import { NextFunction, Request, Response } from 'express';
import { Twilio } from 'twilio';
import { CONFIG } from '../config/config';
import reservationsOperations from '../db/reservations.operations';
import timetablesOperations from '../db/timetables.operations';
import { Reservation } from '../models/reservation.model';
import { ReservationWindow } from '../models/reservationWindow.model';
import { User } from '../models/user.model';
import { ApiError } from '../utils/errors';
import { ResponseCode } from '../utils/responseCodes';

const twilioClient = new Twilio(CONFIG.TWILIO_USER, CONFIG.TWILIO_PASS);

async function getReservationIds(
	req: Request,
	res: Response,
	next: NextFunction
) {
	const userId = (req.body.user as User).id;
	try {
		const resIds = (await reservationsOperations.getUsersReservationWindowIds(
			userId
		)) as number[];
		return res.json(resIds);
	} catch (e) {
		next(e);
	}
}

async function deleteReservation(
	req: Request,
	res: Response,
	next: NextFunction
) {
	const reservationId = parseInt(req.params.resId);
	const userId = (req.body.user as User).id;

	const currentReservation = { reservationId, userId } as Reservation;

	try {
		const reservationExist = await reservationsOperations.reservationExist(
			currentReservation
		);
		if (!reservationExist) {
			return next(ApiError.notFound('Reservation does not exist'));
		}

		const window = (await timetablesOperations.getTimetableById(
			reservationId
		)) as ReservationWindow;
		if (!window) {
			return next(ApiError.notFound('Reservation window does not exist'));
		}

		if (window.limitedSpace) {
			const updatedWindow = {
				...window,
				peopleCount: window.peopleCount + 1,
			} as ReservationWindow;
			await timetablesOperations.updateTimetable(updatedWindow);
		}

		await reservationsOperations.deleteReservation(currentReservation);

		return res.sendStatus(ResponseCode.DELETED);
	} catch (e) {
		next(e);
	}
}

async function createReservation(
	req: Request,
	res: Response,
	next: NextFunction
) {
	const reservationId = parseInt(req.params.resId);
	const userId = (req.body.user as User).id;

	const newReservation = { reservationId, userId } as Reservation;

	try {
		const reservationExist = await reservationsOperations.reservationExist(
			newReservation
		);
		if (reservationExist) {
			return next(ApiError.badRequest('Reservation already exist'));
		}

		const window = (await timetablesOperations.getTimetableById(
			reservationId
		)) as ReservationWindow;
		if (!window) {
			return next(ApiError.notFound('Reservation window does not exist'));
		}

		if (window.limitedSpace && window.peopleCount <= 0) {
			return next(ApiError.badRequest('Not enough visiting space'));
		}

		if (window.limitedSpace) {
			const updatedWindow = {
				...window,
				peopleCount: window.peopleCount - 1,
			} as ReservationWindow;
			await timetablesOperations.updateTimetable(updatedWindow);
		}

		await reservationsOperations.insertReservation(newReservation);

		// await twilioClient.messages.create({
		// 	from: '+17409488189',
		// 	to: '+37064500886asd666',
		// 	body: 'AAAA',
		// });

		return res.sendStatus(ResponseCode.CREATED);
	} catch (e) {
		if (e.message.includes('is not a valid phone number')) {
			next(ApiError.badRequest('Not a valid number'));
		} else {
			next(e);
		}
	}
}

export default {
	createReservation,
	getReservationIds,
	deleteReservation,
};

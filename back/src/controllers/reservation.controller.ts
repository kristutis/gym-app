import { NextFunction, Request, Response } from 'express';
import reservationsOperations from '../db/reservations.operations';
import timetablesOperations from '../db/timetables.operations';
import { Reservation } from '../models/reservation.model';
import { ReservationWindow } from '../models/reservationWindow.model';
import { User } from '../models/user.model';
import { ApiError } from '../utils/errors';
import { ResponseCode } from '../utils/responseCodes';

async function createReservation(
	req: Request,
	res: Response,
	next: NextFunction
) {
	const { reservationId } = req.body as CreateReservationProps;
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

		return res.sendStatus(ResponseCode.CREATED);
	} catch (e) {
		console.log(e);
		next(e);
	}
}

export interface CreateReservationProps {
	reservationId: number;
}

export default {
	createReservation,
};

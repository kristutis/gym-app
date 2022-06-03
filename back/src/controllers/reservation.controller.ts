import { NextFunction, Request, Response } from 'express';
import { Twilio } from 'twilio';
import { CONFIG } from '../config/config';
import reservationsOperations from '../db/reservations.operations';
import timetablesOperations from '../db/timetables.operations';
import usersOperations from '../db/users.operations';
import { Reservation } from '../models/reservation.model';
import { ReservationWindow } from '../models/reservationWindow.model';
import { User } from '../models/user.model';
import sendTwilioMessage from '../services/twillio.service';
import { ApiError } from '../utils/errors';
import { ResponseCode } from '../utils/responseCodes';
import { convertParamsToDates } from './timetable.controller';

const twilioClient = new Twilio(CONFIG.TWILIO_USER, CONFIG.TWILIO_PASS);

async function getReservationsAvailability(
	req: Request,
	res: Response,
	next: NextFunction
) {
	const params = convertParamsToDates(req.query);
	params.endDate.setMonth(params.endDate.getMonth() + 1);
	const userId = (req.body.user as User).id;

	const monthRanges = monthsBetween(
		params.startDate.toISOString().split('T')[0],
		params.endDate.toISOString().split('T')[0]
	);

	const now = new Date();
	const firstMonthDay = new Date(now.getFullYear(), now.getMonth(), 1);
	const currentMonthMissedAttendanceCount =
		(await reservationsOperations.getUsersMissedReservations(
			userId,
			firstMonthDay,
			now
		)) as number;

	const availability = [] as ReservationsAvailabilityProps[];
	try {
		for (let i = 0; i < monthRanges.length - 1; i++) {
			const first = monthRanges[i];
			const last = monthRanges[i + 1];
			const reservations =
				(await reservationsOperations.getUsersReservationWindowIdsInRange(
					userId,
					first,
					last
				)) as number[];
			availability.push({
				startDate: first,
				endDate: last,
				reachedMonthlyLimit:
					reservations?.length >= CONFIG.MAX_MONTHLY_RESERVATIONS,
			} as ReservationsAvailabilityProps);
		}
		return res.status(ResponseCode.OK).json({
			availability,
			maxMonthlyReservationsCount: CONFIG.MAX_MONTHLY_RESERVATIONS,
			reachedMissedAttendanceLimit:
				currentMonthMissedAttendanceCount >= CONFIG.MAX_MISSED_ATTENDANACE,
			maxMissedAttendanceLimit: CONFIG.MAX_MISSED_ATTENDANACE,
		} as ReservationsAvailabilityDetails);
	} catch (e) {
		next(e);
	}
}

async function trainerUpdateReserationAttendency(
	req: Request,
	res: Response,
	next: NextFunction
) {
	const uid = req.body.uid;
	const resId = req.body.resId;
	const attended = req.body.attended;

	try {
		await reservationsOperations.updateReservationAttendency(
			uid,
			resId,
			attended
		);
		return res.sendStatus(ResponseCode.OK);
	} catch (e) {
		next(e);
	}
}

async function trainerGetUsersReservations(
	req: Request,
	res: Response,
	next: NextFunction
) {
	const dates = convertParamsToDates(req.query);
	const uid = req.query.uid as string;

	try {
		const results = await reservationsOperations.getUsersReservationWindows(
			uid,
			dates.startDate,
			dates.endDate
		);
		return res.json(results);
	} catch (e) {
		next(e);
	}
}

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
				peopleCount: window.peopleCount! + 1,
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
	const sendMessage = req.body.sendMessage;
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

		const userInfo = (await usersOperations.getUserById(userId)) as User;
		if (!userInfo.subscriptionName) {
			return next(ApiError.badRequest('User does not have a subscription'));
		}

		if (
			!!userInfo.subscriptionValidUntil &&
			new Date(userInfo.subscriptionValidUntil).getTime() < Date.now()
		) {
			return next(ApiError.badRequest('User subscription is out of date'));
		}

		const inSubscriptionRange = (start: Date): boolean => {
			const formatTime = (time: Date) =>
				time.toLocaleTimeString('lt-LT').split(' ')[0];
			return (
				userInfo.subscriptionStartTime === userInfo.subscriptionEndTime ||
				(formatTime(start) > userInfo.subscriptionStartTime! &&
					formatTime(start) < userInfo.subscriptionEndTime!)
			);
		};

		if (!inSubscriptionRange(new Date(window.startTime))) {
			return next(
				ApiError.badRequest(
					'Reservation window is out of subscription time range'
				)
			);
		}

		if (window.limitedSpace && window.peopleCount! <= 0) {
			return next(ApiError.badRequest('Not enough visiting space'));
		}

		const date = new Date(window.startTime);
		const monthFirstDay = new Date(date.getFullYear(), date.getMonth(), 1);
		const monthLastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
		const reservations =
			(await reservationsOperations.getUsersReservationWindowIdsInRange(
				userId,
				monthFirstDay,
				monthLastDay
			)) as number[];
		if (reservations?.length >= CONFIG.MAX_MONTHLY_RESERVATIONS) {
			return next(ApiError.badRequest('Reached monthly reservations limit'));
		}

		const now = new Date();
		if (
			new Date(window.startTime).getMonth() == now.getMonth() &&
			new Date(window.startTime).getFullYear() == now.getFullYear()
		) {
			const firstMonthDay = new Date(now.getFullYear(), now.getMonth(), 1);
			const currentMonthMissedAttendanceCount =
				(await reservationsOperations.getUsersMissedReservations(
					userId,
					firstMonthDay,
					now
				)) as number;
			if (currentMonthMissedAttendanceCount >= CONFIG.MAX_MISSED_ATTENDANACE) {
				next(
					ApiError.badRequest(
						`Max amount of unattended reservations in this month is reached! (${CONFIG.MAX_MISSED_ATTENDANACE})`
					)
				);
			}
		}

		if (window.limitedSpace) {
			const updatedWindow = {
				...window,
				peopleCount: window.peopleCount! - 1,
			} as ReservationWindow;
			await timetablesOperations.updateTimetable(updatedWindow);
		}

		await reservationsOperations.insertReservation(newReservation);

		if (sendMessage) {
			await sendTwilioMessage(userId, window.startTime.toLocaleString());
		}

		return res.sendStatus(ResponseCode.CREATED);
	} catch (e: any) {
		if (!!e.message && e.message.includes('is not a valid phone number')) {
			return next(ApiError.badRequest('Phone number is invalid'));
		}
		if (!!e.message && e.message.includes('The number  is unverified.')) {
			return next(ApiError.badRequest('Number not verified'));
		}
		next(e);
	}
}

async function geReservationsCount(
	req: Request,
	res: Response,
	next: NextFunction
) {
	const params = convertParamsToDates(req.query);

	try {
		const reservations = await reservationsOperations.getReservationsCount(
			params.startDate,
			params.endDate
		);

		return res.json(reservations);
	} catch (e) {
		next(e);
	}
}

function monthsBetween(...args: any[]): string[] {
	let [a, b] = args.map((arg) =>
		arg
			.split('-')
			.slice(0, 2)
			.reduce((y: any, m: any) => m - 1 + y * 12)
	);
	return Array.from({ length: b - a + 1 }, (_) => a++).map(
		(m) => ~~(m / 12) + '-' + ('0' + ((m % 12) + 1)).slice(-2) + '-01'
	);
}

interface ReservationsAvailabilityProps {
	startDate: string;
	endDate: string;
	reachedMonthlyLimit: boolean;
}

interface ReservationsAvailabilityDetails {
	availability: ReservationsAvailabilityProps[];
	maxMonthlyReservationsCount: number;
	reachedMissedAttendanceLimit: boolean;
	maxMissedAttendanceLimit: number;
}

export default {
	createReservation,
	getReservationIds,
	deleteReservation,
	getReservationsAvailability,
	trainerGetUsersReservations,
	trainerUpdateReserationAttendency,
	geReservationsCount,
};

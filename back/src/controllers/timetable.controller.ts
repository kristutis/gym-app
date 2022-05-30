import { NextFunction, Request, Response } from 'express';
import timetablesOperations from '../db/timetables.operations';
import { ReservationWindow } from '../models/reservationWindow.model';
import { ApiError } from '../utils/errors';
import { ResponseCode } from '../utils/responseCodes';

export function convertParamsToDates(params: any): TimetableQueryProps {
	return {
		startDate: new Date(params.startDate as any),
		endDate: new Date(params.endDate as any),
	} as TimetableQueryProps;
}

async function updateTimetable(
	req: Request,
	res: Response,
	next: NextFunction
) {
	const body = req.body;
	const reservationWindow = {
		id: parseInt(body.id),
		startTime: new Date(body.startTime),
		endTime: new Date(body.endTime),
		limitedSpace: body.limitedSpace as boolean,
		peopleCount:
			!!body.limitedSpace && !!body.peopleCount
				? parseInt(body.peopleCount)
				: undefined,
	} as ReservationWindow;

	try {
		const overlaps = (
			(await timetablesOperations.getOverlappingTimetables(
				new Date(reservationWindow.startTime),
				new Date(reservationWindow.endTime)
			)) as ReservationWindow[]
		).filter((r) => r.id !== reservationWindow.id);

		if (overlaps.length) {
			const startDates: Date[] = overlaps.map((r) => new Date(r.startTime));
			const endDates: Date[] = overlaps.map((r) => new Date(r.endTime));
			const error = `Reservation windows overlaps between dates ${new Date(
				Math.min.apply(null, startDates as any)
			).toLocaleString()} and ${new Date(
				Math.max.apply(null, endDates as any)
			).toLocaleString()}`;
			return next(ApiError.badRequest(error));
		}

		await timetablesOperations.updateTimetable(reservationWindow);
		return res.sendStatus(ResponseCode.OK);
	} catch (e) {
		return next(e);
	}
}

async function deleteTimetableById(
	req: Request,
	res: Response,
	next: NextFunction
) {
	const id = req.params.resId as any as number;

	try {
		await timetablesOperations.deleteTimetableById(id);
		return res.sendStatus(ResponseCode.DELETED);
	} catch (e) {
		return next(e);
	}
}

async function deleteTimetable(
	req: Request,
	res: Response,
	next: NextFunction
) {
	const params = convertParamsToDates(req.query);

	try {
		await timetablesOperations.deleteTimetablesInRange(
			params.startDate,
			params.endDate
		);
		return res.sendStatus(ResponseCode.DELETED);
	} catch (e) {
		return next(e);
	}
}

async function getTimetables(req: Request, res: Response, next: NextFunction) {
	const params = convertParamsToDates(req.query);
	try {
		const result = await timetablesOperations.getTimetablesInRange(
			params.startDate,
			params.endDate
		);
		return res.status(ResponseCode.OK).json(result);
	} catch (e) {
		return next(e);
	}
}

async function createTimetable(
	req: Request,
	res: Response,
	next: NextFunction
) {
	const timetableDetails = req.body as CreateTimetableProps[];

	try {
		await checkForOverlappingTimes(timetableDetails);
	} catch (e) {
		return next(e);
	}

	const reservationWindows = generateReservationWindows(timetableDetails);

	try {
		await timetablesOperations.insertTimetables(reservationWindows);
		res.sendStatus(ResponseCode.CREATED);
	} catch (e) {
		next(e);
	}
}

function generateReservationWindows(
	timetableDetails: CreateTimetableProps[]
): ReservationWindow[] {
	const filteredDays = timetableDetails.map((config) =>
		getFilteredDays(
			config.onlyWeekends,
			config.excludeWeekends,
			getDaysFromRange(
				new Date(config.startDate),
				new Date(config.endDate),
				parseTime(config.startTime)
			),
			config.weekdays
		)
	);

	let allReservationWindows = [];
	for (let i = 0; i < timetableDetails.length; i++) {
		const dates = filteredDays[i];
		const reservationWindowDetails = timetableDetails[i];
		const formattedTimeTables = formatTimeTable(
			dates,
			reservationWindowDetails.startTime,
			reservationWindowDetails.endTime,
			reservationWindowDetails.visitingTime,
			reservationWindowDetails.breakTime,
			reservationWindowDetails.limitVisitors,
			reservationWindowDetails.visitorsCount
		);
		allReservationWindows.push(formattedTimeTables);
	}

	const reservationWindows: ReservationWindow[] = allReservationWindows.flatMap(
		(r) => r
	);

	return reservationWindows;
}

async function checkForOverlappingTimes(
	timetableDetails: CreateTimetableProps[]
): Promise<ApiError | null> {
	const messages = await Promise.all(
		timetableDetails.map(async (config) => {
			const stDate = new Date(config.startDate);
			const stTime = parseTime(config.startTime);
			const edDate = new Date(config.endDate);
			const ndTime = parseTime(config.endTime);
			stDate.setHours(stDate.getHours() + stTime.hour);
			stDate.setMinutes(stDate.getMinutes() + stTime.minutes);
			edDate.setHours(edDate.getHours() + ndTime.hour);
			edDate.setMinutes(edDate.getMinutes() + ndTime.minutes);
			return await getOverlappingTimes(stDate, edDate);
		})
	);

	if (messages.every((msg) => msg === '')) {
		return Promise.resolve(null);
	}

	const resultMessages = messages
		.map((msg, index) => (msg !== '' ? `* Form #${index + 1} ${msg}` : ''))
		.filter((msg) => msg !== '')
		.join('<br/>');
	return Promise.reject(ApiError.badRequest(resultMessages));
}

async function getOverlappingTimes(
	startDate: Date,
	endDate: Date
): Promise<string> {
	const existingReservationWindows =
		(await timetablesOperations.getOverlappingTimetables(
			startDate,
			endDate
		)) as ReservationWindow[];

	if (!existingReservationWindows.length) {
		return '';
	}

	const start = new Date(startDate);
	const end = new Date(endDate);

	return `Reservation windows overlaps between dates ${start.toLocaleDateString()} and ${end.toLocaleDateString()}`;
}

function formatTimeTable(
	dates: Date[],
	startTime: string,
	endTime: string,
	visitingTime: string,
	breakTime: string,
	limitVisitors: boolean,
	visitorsCount?: number
): ReservationWindow[] {
	return dates
		.map((date) =>
			getReservationWindows(
				date,
				parseTime(startTime),
				parseTime(endTime),
				parseTime(visitingTime),
				parseTime(breakTime),
				limitVisitors,
				visitorsCount
			)
		)
		.flatMap((d) => d);
}

function shouldAddDay(
	date: Date,
	startTime: HoursWithMinutes,
	endTime: HoursWithMinutes
): boolean {
	const date2 = new Date(date);

	date.setHours(startTime.hour);
	date.setMinutes(startTime.minutes);

	date2.setHours(endTime.hour);
	date2.setMinutes(endTime.minutes);

	return date >= date2;
}

function getReservationWindows(
	date: Date,
	startTime: HoursWithMinutes,
	endTime: HoursWithMinutes,
	visitingTime: HoursWithMinutes,
	breakTime: HoursWithMinutes,
	limitVisitors: boolean,
	visitorsCount?: number
): ReservationWindow[] {
	date.setHours(startTime.hour);
	date.setMinutes(startTime.minutes);

	const maxDate = new Date(date);
	const addDay = shouldAddDay(date, startTime, endTime) ? 1 : 0;
	maxDate.setDate(maxDate.getDate() + addDay);
	maxDate.setHours(endTime.hour);
	maxDate.setMinutes(endTime.minutes);

	const windows = [];
	let nextDate = date;
	do {
		const newDate = new Date(nextDate);
		newDate.setHours(newDate.getHours() + visitingTime.hour);
		newDate.setMinutes(newDate.getMinutes() + visitingTime.minutes);
		windows.push({
			startTime: new Date(nextDate),
			endTime: new Date(newDate),
			limitedSpace: limitVisitors,
			peopleCount: limitVisitors ? visitorsCount : undefined,
		} as ReservationWindow);
		newDate.setHours(newDate.getHours() + breakTime.hour);
		newDate.setMinutes(newDate.getMinutes() + breakTime.minutes);
		nextDate = newDate;
	} while (nextDate < maxDate);
	if (addDay) {
		windows.pop();
	}
	return windows;
}

function parseTime(time: string): HoursWithMinutes {
	const parts = time.split(':');
	return {
		hour: parseInt(parts[0]),
		minutes: parseInt(parts[1]),
	} as HoursWithMinutes;
}

interface HoursWithMinutes {
	hour: number;
	minutes: number;
}

function getDaysFromRange(
	startDate: Date,
	stopDate: Date,
	startOffset: HoursWithMinutes
) {
	const dateArray = new Array();
	const currentDate = startDate;
	while (currentDate <= stopDate) {
		dateArray.push(new Date(currentDate));
		currentDate.setDate(currentDate.getDate() + 1);
		currentDate.setHours(startOffset.hour);
		currentDate.setMinutes(startOffset.minutes);
	}
	return dateArray;
}

function getFilteredDays(
	weekends: boolean,
	weekdays: boolean,
	days: Date[],
	daysArr?: number[]
): Date[] {
	let filteredDays = days;
	if (weekends) {
		filteredDays = days.map((d) => getWeekend(d)) as Date[];
	}
	if (weekdays) {
		filteredDays = days.map((d) => getWeekday(d)) as Date[];
	}
	if (daysArr?.length) {
		filteredDays = days.map((d) => getFilteredByWeekDays(d, daysArr)) as Date[];
	}
	return filteredDays.filter((d) => d != null);
}

function getFilteredByWeekDays(day: Date, daysArr: number[]): Date | null {
	return daysArr.includes(day.getDay()) ? day : null;
}

function getWeekday(day: Date): Date | null {
	return day.getDay() === 0 || day.getDay() === 6 ? null : day;
}

function getWeekend(day: Date): Date | null {
	return day.getDay() === 0 || day.getDay() === 6 ? day : null;
}

export interface TimetableQueryProps {
	startDate: Date;
	endDate: Date;
}

export interface CreateTimetableProps {
	startDate: Date;
	startTime: string;
	endDate: Date;
	endTime: string;
	visitingTime: string;
	breakTime: string;
	excludeWeekends: boolean;
	onlyWeekends: boolean;
	limitVisitors: boolean;
	visitorsCount?: number;
	weekdays?: number[];
}

export default {
	createTimetable,
	getTimetables,
	deleteTimetable,
	deleteTimetableById,
	updateTimetable,
};

export const testTimetableGenerator = generateReservationWindows;

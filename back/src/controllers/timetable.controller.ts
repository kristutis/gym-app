import { NextFunction, Request, Response } from 'express';
import timetablesOperations from '../db/timetables.operations';
import { ReservationWindow } from '../models/reservationWindow.model';

async function createTimetable(
	req: Request,
	res: Response,
	next: NextFunction
) {
	const timetableDetails = req.body as CreateTimetableProps[];
	const filteredDays = timetableDetails.map((config) =>
		getFilteredDays(
			config.onlyWeekends,
			config.excludeWeekends,
			getDaysFromRange(
				new Date(config.startDate),
				new Date(config.endDate),
				parseTime(config.startTime)
			)
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

	// reservationWindows.forEach((z) =>
	// 	console.log({
	// 		s: z.startTime.toLocaleString('en-GB'),
	// 		e: z.endTime.toLocaleString('en-GB'),
	// 	})
	// );

	const result = await timetablesOperations.insertTimetables(
		reservationWindows
	);
	console.log(result);

	// filteredDays.forEach((x) => console.log(x));

	// try {
	// 	const hashedPassword = await bcrypt.hash(userDetails.password, 10);
	// 	const newUser = {
	// 		...userDetails,
	// 		password: hashedPassword,
	// 	} as CreateUserProps;
	// 	await usersOperations.insertUser(newUser);
	// 	return res
	// 		.status(ResponseCode.CREATED)
	// 		.send(`User ${newUser.name} created!`);
	// } catch (e: any) {
	// 	if (e.sqlMessage && e.sqlMessage.includes('Duplicate entry')) {
	// 		return next(ApiError.unprocessableEntity('Email already exist'));
	// 	}
	// 	return next(e);
	// }
}

function formatTimeTable(
	dates: Date[],
	startTime: string,
	endTime: string,
	visitingTime: string,
	breakTime: string,
	limitVisitors: boolean,
	visitorsCount: number
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
	visitorsCount: number
): ReservationWindow[] {
	date.setHours(startTime.hour);
	date.setMinutes(startTime.minutes);

	const maxDate = new Date(date);
	const addDay = shouldAddDay(date, startTime, endTime) ? 1 : 0;
	maxDate.setDate(maxDate.getDate() + addDay); //24h?
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
	windows.pop();
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
	days: Date[]
): Date[] {
	let filteredDays = days;
	if (weekends) {
		filteredDays = days.map((d) => getWeekend(d));
	}
	if (weekdays) {
		filteredDays = days.map((d) => getWeekday(d));
	}
	return filteredDays.filter((d) => d != null);
}

function getWeekday(day: Date): Date {
	return day.getDay() === 0 || day.getDay() === 6 ? null : day;
}

function getWeekend(day: Date): Date {
	return day.getDay() === 0 || day.getDay() === 6 ? day : null;
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
}

export default {
	createTimetable,
};

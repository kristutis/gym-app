import { NextFunction, Request, Response } from 'express';

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
			getDaysFromRange(new Date(config.startDate), new Date(config.endDate))
		)
	);

	filteredDays.forEach((x) => console.log(x));

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

function getDaysFromRange(startDate: Date, stopDate: Date) {
	var dateArray = new Array();
	var currentDate = startDate;
	while (currentDate <= stopDate) {
		dateArray.push(new Date(currentDate));
		currentDate.setDate(currentDate.getDate() + 1);
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

import { NextFunction, Request, Response } from 'express';

async function createTimetable(
	req: Request,
	res: Response,
	next: NextFunction
) {
	const timetableDetails = req.body as CreateTimetableProps;
	console.log(timetableDetails);
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

export interface CreateTimetableProps {
	startDate: Date;
	startTime: string;
	endDate: Date;
	endTime: string;
	visitingTime: string;
	breakTime: string;
	excludeWeekends: boolean;
	limitVisitors: boolean;
	visitorsCount?: number;
}

export default {
	createTimetable,
};

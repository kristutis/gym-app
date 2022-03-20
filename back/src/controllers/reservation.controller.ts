import { NextFunction, Request, Response } from 'express';
import { User } from '../models/user.model';

async function createReservation(
	req: Request,
	res: Response,
	next: NextFunction
) {
	const { reservationId } = req.body as CreateReservationProps;
	const userId = (req.body.user as User).id;

	console.log(reservationId);
	console.log(userId);

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

export interface CreateReservationProps {
	reservationId: boolean;
}

export default {
	createReservation,
};

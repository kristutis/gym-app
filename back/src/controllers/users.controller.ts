import bcrypt from 'bcrypt';
import { NextFunction, Request, Response } from 'express';
import usersOperations from '../db/users.operations';
import { Trainer } from '../models/trainer.model';
import { User } from '../models/user.model';
import { ApiError } from '../utils/errors';
import { ResponseCode } from '../utils/responseCodes';

async function getUsers(req: Request, res: Response, next: NextFunction) {
	try {
		const usersWithTrainerInfo =
			(await usersOperations.getAllUsersWithTrainerInfo()) as Trainer[];
		const usersWithoutPassword = usersWithTrainerInfo.map((user) => {
			const { hashedPassword, ...userWithoutPassword } = user;
			return userWithoutPassword;
		});
		return res.status(ResponseCode.OK).json(usersWithoutPassword);
	} catch (e) {
		next(e);
	}
}

async function getUserDetails(req: Request, res: Response, next: NextFunction) {
	const userId = req.body.user.id;

	try {
		const user = (await usersOperations.getUserById(userId)) as User;
		if (!user) {
			return next(ApiError.notFound(''));
		}

		const { hashedPassword, ...userWithoutPassword } = user;
		return res.status(200).json(userWithoutPassword);
	} catch (e) {
		next(e);
	}
}

async function createUser(req: Request, res: Response, next: NextFunction) {
	const userDetails = req.body as CreateUserProps;
	try {
		const hashedPassword = await bcrypt.hash(userDetails.password, 10);
		const newUser = {
			...userDetails,
			password: hashedPassword,
		} as CreateUserProps;
		await usersOperations.insertUser(newUser);
		return res
			.status(ResponseCode.CREATED)
			.send(`User ${newUser.name} created!`);
	} catch (e: any) {
		if (e.sqlMessage && e.sqlMessage.includes('Duplicate entry')) {
			return next(ApiError.unprocessableEntity('Email already exist'));
		}
		return next(e);
	}
}

async function updateUser(req: Request, res: Response, next: NextFunction) {
	const userDetails = req.body as UpdateUserProps;

	try {
		if (userDetails.password) {
			const hashedPassword = await bcrypt.hash(userDetails.password, 10);
			await usersOperations.updateUserPassword(userDetails.id, hashedPassword);
		}
		await usersOperations.updateUser(userDetails);
		return res.sendStatus(ResponseCode.OK);
	} catch (e: any) {
		return next(e);
	}
}

async function deleteUser(req: Request, res: Response, next: NextFunction) {
	const uid = req.params.uid as string;

	try {
		await usersOperations.deleteUser(uid);
		return res.sendStatus(ResponseCode.DELETED);
	} catch (e: any) {
		return next(e);
	}
}

export interface CreateUserProps {
	name: string;
	surname: string;
	email: string;
	password: string;
}

export interface UpdateUserProps {
	id: string;
	name: string;
	surname: string;
	phone?: string;
	password?: string;
}

export default {
	getUserDetails,
	createUser,
	updateUser,
	getUsers,
	deleteUser,
};

import bcrypt from 'bcrypt';
import { NextFunction, Request, Response } from 'express';
import rolesOperations, { Role } from '../db/roles.operations';
import trainersOperations, { TrainerProps } from '../db/trainers.operations';
import usersOperations from '../db/users.operations';
import { Trainer } from '../models/trainer.model';
import { User } from '../models/user.model';
import { ApiError } from '../utils/errors';
import { TRAINER_ROLE } from '../utils/jwt';
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

async function trainerUpdateUsersBalance(
	req: Request,
	res: Response,
	next: NextFunction
) {
	const uid = req.body.id;
	const balance = req.body.balance;
	try {
		await usersOperations.updateUserBalance(uid, balance);
		return res.sendStatus(ResponseCode.OK);
	} catch (e) {
		next(e);
	}
}

async function getUsersForTrainer(
	req: Request,
	res: Response,
	next: NextFunction
) {
	try {
		const users = (await usersOperations.getUsersForTrainer()) as User[];
		return res.status(ResponseCode.OK).json(users);
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

async function adminUpdateUserAndTrainer(
	req: Request,
	res: Response,
	next: NextFunction
) {
	const user = req.body as AdminUpdateUserProps;

	const trainerProps =
		TRAINER_ROLE === user.role
			? ({
					fkUserId: user.id,
					price: user.price,
					description: user.description,
					moto: user.moto,
					photoUrl: !!user.photoUrl ? user.photoUrl : 'DEFAULT',
			  } as TrainerProps)
			: null;

	try {
		const roles = (await rolesOperations.getRoles()) as Role[];
		const fk_role = getRoleId(roles, user.role);

		const trainer = await trainersOperations.getTrainerByUid(user.id);
		const trainerExists = !!trainer && Object.keys(trainer).length > 0;

		if (TRAINER_ROLE !== user.role && trainerExists) {
			await trainersOperations.deleteTrainer(user.id);
		}

		if (TRAINER_ROLE === user.role && trainerExists) {
			await trainersOperations.updateTrainer(trainerProps!);
		}

		if (TRAINER_ROLE === user.role && !trainerExists) {
			await trainersOperations.insertTrainer(trainerProps!);
		}

		await usersOperations.updateUserWithRole(
			user.id,
			user.name,
			user.surname,
			user.phone || 'NULL',
			fk_role,
			user.balance
		);
		return res.sendStatus(ResponseCode.OK);
	} catch (e) {
		return next(e);
	}
}

function getRoleId(roles: Role[], roleName: string): number {
	for (const roleObj of roles) {
		if (roleObj.role === roleName) {
			return roleObj.id;
		}
	}
	return -1;
}

async function updateUserPassword(
	req: Request,
	res: Response,
	next: NextFunction
) {
	const email = (req.body.user as User).email;
	const passwordDetails = req.body as UpdatePasswordProps;

	try {
		const user = (await usersOperations.getUserByEmail(email)) as User;
		if (!user) {
			return next(ApiError.notFound('User does not exist'));
		}

		const passwordsMatch = await bcrypt.compare(
			passwordDetails.oldPassword,
			user.hashedPassword as string
		);
		if (!passwordsMatch) {
			return next(ApiError.badRequest('Incorrect password'));
		}

		if (passwordDetails.newPassword) {
			const hashedPassword = await bcrypt.hash(passwordDetails.newPassword, 10);
			await usersOperations.updateUserPassword(user.id, hashedPassword);
		}
		return res.sendStatus(ResponseCode.OK);
	} catch (e: any) {
		return next(e);
	}
}

async function updateUser(req: Request, res: Response, next: NextFunction) {
	const uid = (req.body.user as User).id;
	const userDetails = req.body as UpdateUserProps;

	if (uid !== userDetails.id) {
		return next(ApiError.forbidden('Cannot edit other users details'));
	}

	try {
		await usersOperations.updateUser(
			userDetails.id,
			userDetails.name,
			userDetails.surname,
			userDetails.phone
		);
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
}

interface UpdatePasswordProps {
	oldPassword: string;
	newPassword: string;
}

export interface AdminUpdateUserProps {
	id: string;
	name: string;
	surname: string;
	phone?: string;
	role: string;
	price?: number;
	description?: string;
	moto?: string;
	photoUrl?: string;
	balance: number;
}

export default {
	getUserDetails,
	createUser,
	updateUser,
	getUsers,
	deleteUser,
	adminUpdateUserAndTrainer,
	updateUserPassword,
	trainerUpdateUsersBalance,
	getUsersForTrainer,
};

import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { CONFIG } from '../config/config';
import { User } from '../models/user.model';
import { ApiError } from '../utils/errors';
import { ADMIN_ROLE, TRAINER_ROLE } from '../utils/jwt';

export const authenticateRefreshToken = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		jwt.verify(
			req.body.refreshToken,
			CONFIG.REFRESH_TOKEN_SECRET,
			(err: any, user: any) => {
				if (err) {
					return next(ApiError.forbidden('Refresh token no longer valid'));
				}
				req.body.user = user as User;
				next();
			}
		);
	} catch (err) {
		return next(err);
	}
};

export const authenticateUser = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const user = (await authenticateAccount(req)) as User;
		req.body.user = user;
		next();
	} catch (err) {
		return next(err);
	}
};

export const authenticateAdmin = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const user = (await authenticateAccount(req)) as User;
		if (ADMIN_ROLE == user.role) {
			req.body.user = user;
			next();
		} else {
			return next(ApiError.forbidden(''));
		}
	} catch (err) {
		return next(err);
	}
};

export const authenticateTrainer = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const user = (await authenticateAccount(req)) as User;
		if (TRAINER_ROLE == user.role) {
			req.body.user = user;
			next();
		} else {
			return next(ApiError.forbidden(''));
		}
	} catch (err) {
		return next(err);
	}
};

const authenticateAccount = async (req: Request) => {
	return new Promise((resolve, reject) => {
		try {
			const authHeader = req.headers['authorization'] as string;
			if (!authHeader) {
				return reject(ApiError.unauthorized('Authorization header is missing'));
			}

			const token = authHeader.replace('Bearer', '').trim();
			if (!token) {
				return reject(ApiError.unauthorized('Authorization token is missing'));
			}

			jwt.verify(token, CONFIG.ACCESS_TOKEN_SECRET, (err, user) => {
				if (err) {
					return reject(
						ApiError.forbidden('Authorization token no longer valid')
					);
				}
				resolve(user as User);
			});
		} catch (e) {
			return reject(e);
		}
	});
};

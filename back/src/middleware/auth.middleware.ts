import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { CONFIG } from '../config/config';
import { User } from '../models/user.model';
import { ApiError } from '../utils/errors';
import { ADMIN_ROLE } from '../utils/jwt';

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
					return res.status(403).send('Refresh token no longer valid');
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

const authenticateAccount = async (req: Request) => {
	return new Promise((resolve, reject) => {
		try {
			const authHeader = req.headers['authorization'];
			if (!authHeader) {
				return reject(
					ApiError.unauthorized('Authentication header is missing')
				);
			}

			const token = authHeader.replace('Bearer', '').trim();
			if (!token) {
				return reject(ApiError.unauthorized('Authentication token is missing'));
			}

			jwt.verify(token, CONFIG.ACCESS_TOKEN_SECRET, (err, user) => {
				if (err) {
					return reject(
						ApiError.forbidden('Authentication token no longer valid')
					);
				}
				resolve(user as User);
			});
		} catch (e) {
			return reject(e);
		}
	});
};

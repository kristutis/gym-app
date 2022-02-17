import bcrypt from 'bcrypt';
import { NextFunction, Request, Response } from 'express';
import { CONFIG } from '../config/config';
import usersOperations from '../db/users.operations';
import { User } from '../models/user.model';
import { ApiError } from '../utils/errors';
import { generateAccessToken, generateRefreshToken } from '../utils/jwt';
import { ResponseCode } from '../utils/responseCodes';

const TOKEN_TYPE = 'Bearer';
let validRefreshTokens: string[] = [];

async function removeRefreshToken(
	req: Request,
	res: Response,
	next: NextFunction
) {
	const refreshToken = req.body.refreshToken;
	if (validRefreshTokens.includes(refreshToken)) {
		validRefreshTokens = validRefreshTokens.filter(
			(token) => token !== refreshToken
		);
		res.sendStatus(ResponseCode.DELETED);
	} else {
		return next(ApiError.notFound('Refresh token does not exist'));
	}
}

async function loginUser(req: Request, res: Response, next: NextFunction) {
	const loginUserDetails = req.body as LoginUserProps;

	try {
		const user = (await usersOperations.getUserByEmail(
			loginUserDetails.email
		)) as User;
		if (!user) {
			return next(ApiError.notFound('User does not exist'));
		}

		const passwordsMatch = await bcrypt.compare(
			loginUserDetails.password,
			user.hashedPassword as string
		);
		if (!passwordsMatch) {
			return next(ApiError.badRequest('Incorrect password'));
		}

		const validUser = {
			...user,
			hashedPassword: undefined,
		} as User;

		const accessToken = generateAccessToken(validUser);
		const refreshToken = generateRefreshToken(validUser);
		validRefreshTokens.push(refreshToken);

		res.json({
			tokenType: TOKEN_TYPE,
			expireDate: getExpireDate(),
			accessToken: accessToken,
			refreshToken: refreshToken,
		});
	} catch (e) {
		return next(e);
	}
}

const getExpireDate = (): string => {
	const expireTime = CONFIG.ACCESS_TOKEN_EXPIRE;
	const expireTimeMinutes = parseInt(
		expireTime.substring(0, expireTime.length - 1)
	);
	const currentDate = new Date();
	currentDate.setMinutes(currentDate.getMinutes() + expireTimeMinutes);
	return currentDate.toString();
};

export interface LoginUserProps {
	email: string;
	password: string;
}

export default {
	loginUser,
	removeRefreshToken,
};

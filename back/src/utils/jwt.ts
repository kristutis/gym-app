import jwt from 'jsonwebtoken';
import { CONFIG } from '../config/config';
import { User } from '../models/user.model';

export const ADMIN_ROLE = 'admin';
const ACCESS_TOKEN_EXPIRE = CONFIG.ACCESS_TOKEN_EXPIRE;
const REFRESH_TOKEN_EXPIRE = CONFIG.REFRESH_TOKEN_EXPIRE;
const ACCESS_TOKEN_SECRET = CONFIG.ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = CONFIG.REFRESH_TOKEN_SECRET;

export const generateAccessToken = (user: User): string => {
	return jwt.sign(user, ACCESS_TOKEN_SECRET, {
		expiresIn: ACCESS_TOKEN_EXPIRE,
	});
};

export const generateRefreshToken = (user: User): string => {
	return jwt.sign(user, REFRESH_TOKEN_SECRET, {
		expiresIn: REFRESH_TOKEN_EXPIRE,
	});
};

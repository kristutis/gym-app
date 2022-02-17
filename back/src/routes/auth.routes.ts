import express from 'express';
import authController from '../controllers/auth.controller';
import {
	loginUserSchema,
	refreshTokenSchema,
	validateRequestBody,
} from '../middleware/reqBodyValidation.middleware';

export const authRouter = express.Router();

const BASE_ROUTE = '/api/auth';

authRouter.post(
	BASE_ROUTE + '/login',
	validateRequestBody(loginUserSchema),
	authController.loginUser
);

authRouter.delete(
	BASE_ROUTE + '/logout',
	validateRequestBody(refreshTokenSchema),
	authController.removeRefreshToken
);

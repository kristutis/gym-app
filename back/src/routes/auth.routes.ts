import express from 'express';
import authController from '../controllers/auth.controller';
import { authenticateRefreshToken } from '../middleware/auth.middleware';
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

authRouter.post(
	BASE_ROUTE + '/refresh',
	validateRequestBody(refreshTokenSchema),
	authenticateRefreshToken,
	authController.refreshLogin
);

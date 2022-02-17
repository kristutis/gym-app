import express from 'express';
import usersController from '../controllers/users.controller';
import {
	createUserSchema,
	validateRequestBody,
} from '../middleware/reqBodyValidation.middleware';

export const usersRouter = express.Router();

const BASE_ROUTE = '/api/users';

usersRouter.post(
	BASE_ROUTE,
	validateRequestBody(createUserSchema),
	usersController.createUser
);

usersRouter.get(
	BASE_ROUTE + '/details',
	validateRequestBody(createUserSchema),
	usersController.getUserDetails
);

usersRouter.get(
	BASE_ROUTE,
	validateRequestBody(createUserSchema),
	usersController.createUser
);

import express from 'express';
import usersController from '../controllers/users.controller';
import {
	authenticateAdmin,
	authenticateUser,
} from '../middleware/auth.middleware';
import {
	createUserSchema,
	getUserSchema,
	updateUserSchema,
	validateRequestBody,
	validateRequestParams,
} from '../middleware/reqBodyValidation.middleware';

export const usersRouter = express.Router();

const BASE_ROUTE = '/api/users';

usersRouter.get(
	BASE_ROUTE + '/details',
	authenticateUser,
	usersController.decorateUidParam,
	usersController.getUserDetails
);

usersRouter.get(
	BASE_ROUTE + '/:uid/details',
	authenticateAdmin,
	validateRequestParams(getUserSchema),
	usersController.getUserDetails
);

usersRouter.post(
	BASE_ROUTE,
	validateRequestBody(createUserSchema),
	usersController.createUser
);

usersRouter.put(
	BASE_ROUTE,
	validateRequestBody(updateUserSchema),
	authenticateUser,
	usersController.updateUser
);

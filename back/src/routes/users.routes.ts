import express from 'express';
import usersController from '../controllers/users.controller';
import {
	authenticateAdmin,
	authenticateTrainer,
	authenticateUser,
} from '../middleware/auth.middleware';
import {
	adminUpdateUserSchema,
	createUserSchema,
	deleteUserSchema,
	trainerUpdateUserSchema,
	updateUserPasswordSchema,
	updateUserSchema,
	validateRequestBody,
	validateRequestParams,
} from '../middleware/reqBodyValidation.middleware';

export const usersRouter = express.Router();

const BASE_ROUTE = '/api/users';

usersRouter.get(
	BASE_ROUTE + '/details',
	authenticateUser,
	usersController.getUserDetails
);

usersRouter.get(BASE_ROUTE, authenticateAdmin, usersController.getUsers);

usersRouter.get(
	BASE_ROUTE + '/trainer',
	authenticateTrainer,
	usersController.getUsersForTrainer
);

usersRouter.put(
	BASE_ROUTE + '/trainer',
	validateRequestBody(trainerUpdateUserSchema),
	authenticateTrainer,
	usersController.trainerUpdateUsersBalance
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

usersRouter.put(
	BASE_ROUTE + '/password',
	validateRequestBody(updateUserPasswordSchema),
	authenticateUser,
	usersController.updateUserPassword
);

usersRouter.put(
	BASE_ROUTE + '/admin',
	validateRequestBody(adminUpdateUserSchema),
	authenticateAdmin,
	usersController.adminUpdateUserAndTrainer
);

usersRouter.delete(
	BASE_ROUTE + '/:uid',
	validateRequestParams(deleteUserSchema),
	authenticateAdmin,
	usersController.deleteUser
);

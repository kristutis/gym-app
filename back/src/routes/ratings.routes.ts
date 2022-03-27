import express from 'express';
import ratingsController from '../controllers/ratings.controller';
import { authenticateUser } from '../middleware/auth.middleware';
import {
	postRatingSchema,
	uidParamSchema,
	validateRequestParams,
} from '../middleware/reqBodyValidation.middleware';

export const ratingsRouter = express.Router();

const BASE_ROUTE = '/api/trainers/:uid/ratings';

ratingsRouter.get(
	BASE_ROUTE,
	authenticateUser,
	validateRequestParams(uidParamSchema),
	ratingsController.getUserRatingForTrainer
);

ratingsRouter.get(
	BASE_ROUTE + '/all',
	validateRequestParams(uidParamSchema),
	ratingsController.getTrainerRatings
);

ratingsRouter.post(
	BASE_ROUTE + '/:rating',
	authenticateUser,
	validateRequestParams(postRatingSchema),
	ratingsController.postRating
);

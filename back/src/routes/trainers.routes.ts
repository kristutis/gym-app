import express from 'express';
import trainersController from '../controllers/trainers.controller';
import {
	uidParamSchema,
	validateRequestParams,
} from '../middleware/reqBodyValidation.middleware';

export const trainersRouter = express.Router();

const BASE_ROUTE = '/api/trainers';

trainersRouter.get(BASE_ROUTE, trainersController.getTrainers);

trainersRouter.get(
	BASE_ROUTE + '/:uid/img',
	validateRequestParams(uidParamSchema),
	trainersController.getTrainerImgSrc
);

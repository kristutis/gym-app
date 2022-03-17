import express from 'express';
import timetableController from '../controllers/timetable.controller';
import {
	createTimetablesSchema,
	getTimetablesSchema,
	validateRequestBody,
	validateRequestQuery,
} from '../middleware/reqBodyValidation.middleware';

export const timetableRouter = express.Router();

const BASE_ROUTE = '/api/timetable';

timetableRouter.get(
	BASE_ROUTE,
	validateRequestQuery(getTimetablesSchema),
	timetableController.getTimetables
);

timetableRouter.post(
	BASE_ROUTE,
	validateRequestBody(createTimetablesSchema),
	timetableController.createTimetable
);

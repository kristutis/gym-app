import express from 'express';
import timetableController from '../controllers/timetable.controller';
import {
	createTimetablesSchema,
	validateRequestBody,
} from '../middleware/reqBodyValidation.middleware';

export const timetableRouter = express.Router();

const BASE_ROUTE = '/api/timetable';

timetableRouter.post(
	BASE_ROUTE,
	validateRequestBody(createTimetablesSchema),
	timetableController.createTimetable
);

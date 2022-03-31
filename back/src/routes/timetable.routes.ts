import express from 'express';
import timetableController from '../controllers/timetable.controller';
import { authenticateAdmin } from '../middleware/auth.middleware';
import {
	createTimetablesSchema,
	deleteTimetableParamsSchema,
	deleteTimetableSchema,
	getTimetablesSchema,
	validateRequestBody,
	validateRequestParams,
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
	authenticateAdmin,
	timetableController.createTimetable
);

timetableRouter.delete(
	BASE_ROUTE,
	validateRequestQuery(deleteTimetableSchema),
	authenticateAdmin,
	timetableController.deleteTimetable
);

timetableRouter.delete(
	BASE_ROUTE + '/:tid',
	validateRequestParams(deleteTimetableParamsSchema),
	authenticateAdmin,
	timetableController.deleteTimetableById
);

import express from 'express';
import reservationController from '../controllers/reservation.controller';
import { authenticateUser } from '../middleware/auth.middleware';
import {
	createReservationSchema,
	validateRequestBody,
} from '../middleware/reqBodyValidation.middleware';

export const reservationRouter = express.Router();

const BASE_ROUTE = '/api/reservation';

reservationRouter.post(
	BASE_ROUTE,
	validateRequestBody(createReservationSchema),
	authenticateUser,
	reservationController.createReservation
);

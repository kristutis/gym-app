import express from 'express';
import reservationController from '../controllers/reservation.controller';
import { authenticateUser } from '../middleware/auth.middleware';
import {
	createReservationSchema,
	deleteReservationSchema,
	validateRequestBody,
} from '../middleware/reqBodyValidation.middleware';

export const reservationRouter = express.Router();

const BASE_ROUTE = '/api/reservation';

reservationRouter.get(
	BASE_ROUTE,
	authenticateUser,
	reservationController.getReservationIds
);

reservationRouter.post(
	BASE_ROUTE,
	validateRequestBody(createReservationSchema),
	authenticateUser,
	reservationController.createReservation
);

reservationRouter.delete(
	BASE_ROUTE,
	validateRequestBody(deleteReservationSchema),
	authenticateUser,
	reservationController.deleteReservation
);

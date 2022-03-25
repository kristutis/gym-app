import express from 'express';
import reservationController from '../controllers/reservation.controller';
import { authenticateUser } from '../middleware/auth.middleware';
import {
	reservationIdSchema,
	validateRequestParams,
} from '../middleware/reqBodyValidation.middleware';

export const reservationRouter = express.Router();

const BASE_ROUTE = '/api/reservations';

reservationRouter.get(
	BASE_ROUTE,
	authenticateUser,
	reservationController.getReservationIds
);

reservationRouter.post(
	BASE_ROUTE + '/:resId',
	validateRequestParams(reservationIdSchema),
	authenticateUser,
	reservationController.createReservation
);

reservationRouter.delete(
	BASE_ROUTE + '/:resId',
	validateRequestParams(reservationIdSchema),
	authenticateUser,
	reservationController.deleteReservation
);

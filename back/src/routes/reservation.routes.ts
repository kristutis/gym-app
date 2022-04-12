import express from 'express';
import reservationController from '../controllers/reservation.controller';
import { authenticateUser } from '../middleware/auth.middleware';
import {
	createReservationBodySchema,
	getReservationAvailabilityParamSchema,
	reservationIdSchema,
	validateRequestBody,
	validateRequestParams,
	validateRequestQuery,
} from '../middleware/reqBodyValidation.middleware';

export const reservationRouter = express.Router();

const BASE_ROUTE = '/api/reservations';

reservationRouter.get(
	BASE_ROUTE,
	authenticateUser,
	reservationController.getReservationIds
);

reservationRouter.get(
	BASE_ROUTE + '/availability',
	authenticateUser,
	validateRequestQuery(getReservationAvailabilityParamSchema),
	reservationController.getReservationsAvailability
);

reservationRouter.post(
	BASE_ROUTE + '/:resId',
	validateRequestParams(reservationIdSchema),
	validateRequestBody(createReservationBodySchema),
	authenticateUser,
	reservationController.createReservation
);

reservationRouter.delete(
	BASE_ROUTE + '/:resId',
	validateRequestParams(reservationIdSchema),
	authenticateUser,
	reservationController.deleteReservation
);

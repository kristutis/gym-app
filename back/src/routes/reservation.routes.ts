import express from 'express';
import reservationController from '../controllers/reservation.controller';
import {
	authenticateAdmin,
	authenticateTrainer,
	authenticateUser,
} from '../middleware/auth.middleware';
import {
	createReservationBodySchema,
	getReservationAvailabilityParamSchema,
	getTimetablesSchema,
	reservationIdSchema,
	trainerGetUsersReservationsParamSchema,
	trainerUpdateAttendencySchema,
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
	BASE_ROUTE + '/trainer',
	authenticateTrainer,
	validateRequestQuery(trainerGetUsersReservationsParamSchema),
	reservationController.trainerGetUsersReservations
);

reservationRouter.put(
	BASE_ROUTE + '/trainer',
	validateRequestBody(trainerUpdateAttendencySchema),
	authenticateTrainer,
	reservationController.trainerUpdateReserationAttendency
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

reservationRouter.get(
	BASE_ROUTE + '/reservationsCount',
	validateRequestQuery(getTimetablesSchema),
	authenticateAdmin,
	reservationController.geReservationsCount
);

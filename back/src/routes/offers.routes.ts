import express from 'express';
import offersControllers from '../controllers/offers.controllers';
import { authenticateAdmin } from '../middleware/auth.middleware';
import {
	postOfferSchema,
	validateRequestBody,
} from '../middleware/reqBodyValidation.middleware';

export const offersRouter = express.Router();

const BASE_ROUTE = '/api/offers';

offersRouter.get(BASE_ROUTE, offersControllers.getOffers);

offersRouter.get(
	BASE_ROUTE + '/admin',
	authenticateAdmin,
	offersControllers.getOffers
);

offersRouter.post(
	BASE_ROUTE,
	validateRequestBody(postOfferSchema),
	authenticateAdmin,
	offersControllers.postOffer
);

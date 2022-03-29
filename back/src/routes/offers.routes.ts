import express from 'express';
import offersControllers from '../controllers/offers.controllers';
import { authenticateAdmin } from '../middleware/auth.middleware';
import {
	offerIdSParamschema,
	postOfferSchema,
	updateOfferSchema,
	validateRequestBody,
	validateRequestParams,
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

offersRouter.delete(
	BASE_ROUTE + '/:offerId',
	validateRequestParams(offerIdSParamschema),
	authenticateAdmin,
	offersControllers.deleteOffer
);

offersRouter.put(
	BASE_ROUTE,
	validateRequestBody(updateOfferSchema),
	authenticateAdmin,
	offersControllers.updateOffer
);

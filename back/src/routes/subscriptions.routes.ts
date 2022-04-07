import express from 'express';
import subscriptionsController from '../controllers/subscriptions.controller';
import { authenticateUser } from '../middleware/auth.middleware';
import {
	purchaseSubscriptionParamSchema,
	validateRequestParams,
} from '../middleware/reqBodyValidation.middleware';

export const subscriptionsRouter = express.Router();

const BASE_ROUTE = '/api/subscriptions';

subscriptionsRouter.get(
	BASE_ROUTE + '/types',
	subscriptionsController.getSubscriptionTypes
);

subscriptionsRouter.post(
	BASE_ROUTE + '/:name',
	validateRequestParams(purchaseSubscriptionParamSchema),
	authenticateUser,
	subscriptionsController.purchaseSubscription
);

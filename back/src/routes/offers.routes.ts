import express from 'express';
import offersControllers from '../controllers/offers.controllers';

export const offersRouter = express.Router();

const BASE_ROUTE = '/api/offers';

offersRouter.get(BASE_ROUTE, offersControllers.getOffers);

import express from 'express';
import trainersController from '../controllers/trainers.controller';

export const trainersRouter = express.Router();

const BASE_ROUTE = '/api/trainers';

trainersRouter.get(BASE_ROUTE, trainersController.getTrainers);

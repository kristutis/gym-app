import { NextFunction, Request, Response } from 'express';
import trainersOperations from '../db/trainers.operations';
import { Trainer } from '../models/trainer.model';
import { ResponseCode } from '../utils/responseCodes';

async function getTrainers(req: Request, res: Response, next: NextFunction) {
	try {
		const trainers =
			(await trainersOperations.getTrainersWithUserInfo()) as Trainer[];
		return res.status(ResponseCode.OK).json(trainers);
	} catch (e) {
		next(e);
	}
}

export default { getTrainers };

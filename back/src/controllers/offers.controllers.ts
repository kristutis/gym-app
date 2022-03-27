import { NextFunction, Request, Response } from 'express';
import offersOperations, { Offer } from '../db/offers.operations';
import { ResponseCode } from '../utils/responseCodes';

async function getOffers(req: Request, res: Response, next: NextFunction) {
	try {
		const offers = (await offersOperations.getOffers()) as Offer[];
		if (!offers || !offers.length) {
			return res.status(ResponseCode.OK).json([]);
		}
		return res.status(ResponseCode.OK).json(offers);
	} catch (e) {
		next(e);
	}
}

export default {
	getOffers,
};

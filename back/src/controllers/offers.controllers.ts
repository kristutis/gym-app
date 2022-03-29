import { NextFunction, Request, Response } from 'express';
import offersOperations, { Offer } from '../db/offers.operations';
import { ResponseCode } from '../utils/responseCodes';

async function postOffer(req: Request, res: Response, next: NextFunction) {
	const offer = req.body as Offer;

	try {
		await offersOperations.insertOffer(offer);
		return res.sendStatus(ResponseCode.CREATED);
	} catch (e) {
		next(e);
	}
}

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
	postOffer,
};

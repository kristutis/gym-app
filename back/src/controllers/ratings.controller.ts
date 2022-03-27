import { NextFunction, Request, Response } from 'express';
import ratingsOperations from '../db/ratings.operations';
import { User } from '../models/user.model';
import { ResponseCode } from '../utils/responseCodes';

async function getTrainerRatings(
	req: Request,
	res: Response,
	next: NextFunction
) {
	const trainerId = req.params.uid;
	try {
		const ratings = (await ratingsOperations.getTrainerRatings(trainerId)) as [
			{ rating: number }
		];

		if (ratings.length) {
			const ratingsArr = ratings.map((r) => r.rating);
			return res.status(ResponseCode.OK).json(ratingsArr);
		}

		return res.status(ResponseCode.OK).json([]);
	} catch (e) {
		next(e);
	}
}

async function getUserRatingForTrainer(
	req: Request,
	res: Response,
	next: NextFunction
) {
	const trainerId = req.params.uid;
	const userId = (req.body.user as User).id;
	try {
		const rating = await ratingsOperations.getUserRaitingForTrainer(
			userId,
			trainerId
		);
		return res.status(ResponseCode.OK).json(!!rating ? rating : {});
	} catch (e) {
		next(e);
	}
}

async function postRating(req: Request, res: Response, next: NextFunction) {
	const rating = parseInt(req.params.rating);
	const trainerId = req.params.uid;
	const userId = (req.body.user as User).id;
	try {
		const ratingExist = await ratingsOperations.getUserRaitingForTrainer(
			userId,
			trainerId
		);

		if (!ratingExist) {
			await ratingsOperations.insertRating(userId, trainerId, rating);
		} else {
			await ratingsOperations.updateRating(userId, trainerId, rating);
		}
		return res.sendStatus(ResponseCode.CREATED);
	} catch (e) {
		next(e);
	}
}

export default { getUserRatingForTrainer, postRating, getTrainerRatings };

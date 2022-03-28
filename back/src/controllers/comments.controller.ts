import { NextFunction, Request, Response } from 'express';
import commentsOperations from '../db/comments.operations';
import TrainerComment from '../models/comment.model';
import { User } from '../models/user.model';
import { ResponseCode } from '../utils/responseCodes';

async function getTrainerComments(
	req: Request,
	res: Response,
	next: NextFunction
) {
	const trainerId = req.params.uid;
	try {
		const comments = (await commentsOperations.getTrainerComments(
			trainerId
		)) as TrainerComment[];

		if (!comments || !comments.length) {
			return res.status(ResponseCode.OK).json([]);
		}

		return res.status(ResponseCode.OK).json(comments);
	} catch (e) {
		next(e);
	}
}

async function postComment(req: Request, res: Response, next: NextFunction) {
	const comment = req.body.comment;
	const trainerId = req.params.uid;
	const userId = (req.body.user as User).id;

	try {
		await commentsOperations.insertComment(userId, trainerId, comment);
		return res.sendStatus(ResponseCode.CREATED);
	} catch (e) {
		next(e);
	}
}

export default { postComment, getTrainerComments };

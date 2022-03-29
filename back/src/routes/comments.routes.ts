import express from 'express';
import commentsController from '../controllers/comments.controller';
import { authenticateUser } from '../middleware/auth.middleware';
import {
	deleteCommentSchema,
	postCommentschema,
	uidParamSchema,
	updateCommentBodySchema,
	updateCommentIdSchema,
	validateRequestBody,
	validateRequestParams,
} from '../middleware/reqBodyValidation.middleware';

export const commentsRouter = express.Router();

const BASE_ROUTE = '/api/trainers/:uid/comments';
const COMMENTS_ROUTE = '/api/comments';

commentsRouter.get(
	BASE_ROUTE,
	validateRequestParams(uidParamSchema),
	commentsController.getTrainerComments
);

commentsRouter.post(
	BASE_ROUTE,
	validateRequestParams(uidParamSchema),
	validateRequestBody(postCommentschema),
	authenticateUser,
	commentsController.postComment
);

commentsRouter.delete(
	COMMENTS_ROUTE + '/:commentId',
	validateRequestParams(deleteCommentSchema),
	authenticateUser,
	commentsController.deleteTrainerComment
);

commentsRouter.put(
	COMMENTS_ROUTE + '/:commentId',
	validateRequestParams(updateCommentIdSchema),
	validateRequestBody(updateCommentBodySchema),
	authenticateUser,
	commentsController.updateTrainerComment
);

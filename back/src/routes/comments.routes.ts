import express from 'express';
import commentsController from '../controllers/comments.controller';
import { authenticateUser } from '../middleware/auth.middleware';
import {
	postCommentschema,
	uidParamSchema,
	validateRequestBody,
	validateRequestParams,
} from '../middleware/reqBodyValidation.middleware';

export const commentsRouter = express.Router();

const BASE_ROUTE = '/api/trainers/:uid/comments';

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

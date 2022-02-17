import { NextFunction, Request, Response } from 'express';
import { log } from './logger';

const INTERNAL_ERROR_MESSAGE = 'Unexpected internal error';

export class ApiError {
	code: number;
	message: string;

	constructor(code: number, message: string) {
		this.code = code;
		this.message = message;
	}

	static badRequest(message: string): ApiError {
		return new ApiError(400, message || 'Bad Request');
	}

	static unauthorized(message: string): ApiError {
		return new ApiError(401, message || 'Unauthorized');
	}

	static forbidden(message: string): ApiError {
		return new ApiError(403, message || 'Forbidden');
	}

	static notFound(message: string): ApiError {
		return new ApiError(404, message || 'Not found');
	}

	static notAcceptable(message: string): ApiError {
		return new ApiError(409, message || 'Not Acceptable');
	}

	static unprocessableEntity(message: string): ApiError {
		return new ApiError(422, message || 'Unprocessable Entity');
	}

	static internal(message: string): ApiError {
		return new ApiError(500, message || INTERNAL_ERROR_MESSAGE);
	}
}

export const apiErrorHandler = (
	err: any,
	req: Request,
	res: Response,
	next: NextFunction
) => {
	if (err instanceof ApiError) {
		res.status(err.code).json({ error: { message: err.message } });
		return;
	}
	if (err.type && err.type == 'entity.parse.failed') {
		res.status(400).json({ error: { message: 'Invalid request body' } });
		return;
	}
	log.error(err);
	res.status(500).json({ message: INTERNAL_ERROR_MESSAGE });
	return;
};

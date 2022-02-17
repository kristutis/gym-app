import { NextFunction, Request, Response } from 'express';
import Joi, { ObjectSchema } from 'joi';
import { ApiError } from '../utils/errors';

export const validateRequestBody =
	(schema: ObjectSchema) =>
	async (req: Request, res: Response, next: NextFunction) => {
		schema
			.validateAsync(req.body)
			.then((r) => next())
			.catch((error) => next(ApiError.unprocessableEntity(error as any)));
	};

const emailSchema = Joi.string()
	.min(1)
	.max(255)
	.email({ tlds: { allow: false } })
	.required();

const passwordSchema = Joi.string().min(6).max(255).required();

export const createUserSchema: ObjectSchema = Joi.object({
	name: Joi.string()
		.min(1)
		.max(255)
		.regex(/^[A-Za-z]+$/)
		.required(),
	surname: Joi.string()
		.min(1)
		.max(255)
		.regex(/^[A-Za-z]+$/)
		.required(),
	email: emailSchema,
	password: passwordSchema,
});

export const loginUserSchema: ObjectSchema = Joi.object({
	email: emailSchema,
	password: passwordSchema,
});

export const refreshTokenSchema: ObjectSchema = Joi.object({
	refreshToken: Joi.string().min(1).required(),
});

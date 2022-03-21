import { NextFunction, Request, Response } from 'express';
import Joi, { ArraySchema, ObjectSchema } from 'joi';
import { ApiError } from '../utils/errors';

export const validateRequestBody =
	(schema: ObjectSchema | ArraySchema) =>
	async (req: Request, res: Response, next: NextFunction) => {
		schema
			.validateAsync(req.body)
			.then((r) => next())
			.catch((error) => next(ApiError.unprocessableEntity(error as any)));
	};

export const validateRequestQuery =
	(schema: ObjectSchema | ArraySchema) =>
	async (req: Request, res: Response, next: NextFunction) => {
		schema
			.validateAsync(req.query)
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

const createTimetableSchema: ObjectSchema = Joi.object({
	startDate: Joi.date().required(),
	startTime: Joi.string()
		.regex(/^\d{2}:\d{2}$/)
		.required(),
	endDate: Joi.date().required(),
	endTime: Joi.string()
		.regex(/^\d{2}:\d{2}$/)
		.required(),
	visitingTime: Joi.string()
		.regex(/^\d{2}:\d{2}$/)
		.required(),
	breakTime: Joi.string()
		.regex(/^\d{2}:\d{2}$/)
		.required(),
	excludeWeekends: Joi.boolean().required(),
	onlyWeekends: Joi.boolean().required(),
	limitVisitors: Joi.boolean().required(),
	visitorsCount: Joi.number().min(0),
});

export const createTimetablesSchema: ArraySchema = Joi.array().items(
	createTimetableSchema
);

export const getTimetablesSchema: ObjectSchema = Joi.object({
	startDate: Joi.date().required(),
	endDate: Joi.date().required(),
});

export const createReservationSchema: ObjectSchema = Joi.object({
	reservationId: Joi.number().required(),
});

export const deleteReservationSchema = createReservationSchema;

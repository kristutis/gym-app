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

export const validateRequestParams =
	(schema: ObjectSchema | ArraySchema) =>
	async (req: Request, res: Response, next: NextFunction) => {
		schema
			.validateAsync(req.params)
			.then((r) => next())
			.catch((error) => next(ApiError.unprocessableEntity(error as any)));
	};

const uidSchema = Joi.string()
	.regex(/^[a-zA-Z0-9-]*$/)
	.required();

const emailSchema = Joi.string()
	.min(1)
	.max(255)
	.email({ tlds: { allow: false } })
	.required();

const passwordSchema = Joi.string().min(6).max(255);

const nameSchema = Joi.string()
	.min(1)
	.max(255)
	.regex(/^[A-Za-z]+$/)
	.required();
const surnameSchema = Joi.string()
	.min(1)
	.max(255)
	.regex(/^[A-Za-z]+$/)
	.required();

const phoneSchema = Joi.string().regex(/^\+\d+$/);

export const getUserSchema: ObjectSchema = Joi.object({
	uid: uidSchema,
});

const offerIdSchema = Joi.number().integer().min(1).required();

export const offerIdSParamschema: ObjectSchema = Joi.object({
	offerId: offerIdSchema,
});

export const purchaseSubscriptionParamSchema: ObjectSchema = Joi.object({
	name: Joi.string()
		.min(1)
		.max(255)
		.regex(/^[A-Za-z ]+$/)
		.required(),
});

export const deleteCommentSchema: ObjectSchema = Joi.object({
	commentId: Joi.number().min(1).integer().required(),
});

export const updateCommentIdSchema = deleteCommentSchema;

export const uidParamSchema: ObjectSchema = Joi.object({
	uid: uidSchema,
});

export const postRatingSchema: ObjectSchema = Joi.object({
	uid: uidSchema,
	rating: Joi.number().integer().min(1).max(5).required(),
});

export const createUserSchema: ObjectSchema = Joi.object({
	name: nameSchema,
	surname: surnameSchema,
	email: emailSchema,
	password: passwordSchema.required(),
});

export const updateUserSchema: ObjectSchema = Joi.object({
	id: uidSchema,
	name: nameSchema,
	surname: surnameSchema,
	phone: phoneSchema,
});

export const updateUserPasswordSchema: ObjectSchema = Joi.object({
	oldPassword: passwordSchema,
	newPassword: passwordSchema,
});

export const adminUpdateUserSchema: ObjectSchema = Joi.object({
	id: uidSchema,
	name: nameSchema,
	surname: surnameSchema,
	phone: phoneSchema.allow(null).allow(''),
	role: Joi.string().required(),
	price: Joi.number().allow(null).allow(''),
	description: Joi.string().allow(null).allow(''),
	moto: Joi.string().allow(null).allow(''),
	photoUrl: Joi.string().allow(null).allow(''),
	balance: Joi.number().min(0).required(),
});

export const trainerUpdateUserSchema: ObjectSchema = Joi.object({
	id: uidSchema,
	balance: Joi.number().min(0).required(),
});

export const loginUserSchema: ObjectSchema = Joi.object({
	email: emailSchema,
	password: passwordSchema,
});

export const refreshTokenSchema: ObjectSchema = Joi.object({
	refreshToken: Joi.string()
		.regex(/^[\w-]*\.[\w-]*\.[\w-]*$/)
		.required(),
});

export const updateTimetableSchema: ObjectSchema = Joi.object({
	id: Joi.number().integer().min(1).required(),
	startTime: Joi.date().required(),
	endTime: Joi.date().required(),
	limitedSpace: Joi.boolean().required(),
	peopleCount: Joi.number().min(0),
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
	weekdays: Joi.array().items(Joi.number()).optional(),
});

export const createTimetablesSchema: ArraySchema = Joi.array().items(
	createTimetableSchema
);

export const getTimetablesSchema: ObjectSchema = Joi.object({
	startDate: Joi.date().required(),
	endDate: Joi.date().required(),
});

export const getReservationAvailabilityParamSchema = getTimetablesSchema;

export const trainerGetUsersReservationsParamSchema = Joi.object({
	startDate: Joi.date().required(),
	endDate: Joi.date().required(),
	uid: uidSchema,
});

export const trainerUpdateAttendencySchema = Joi.object({
	uid: uidSchema,
	attended: Joi.boolean().required(),
	resId: Joi.number().integer().min(1).required(),
});

export const deleteTimetableSchema = getTimetablesSchema;

export const reservationIdSchema: ObjectSchema = Joi.object({
	resId: Joi.number().integer().min(1).required(),
});

export const deleteUserSchema: ObjectSchema = Joi.object({
	uid: uidSchema,
});

export const createReservationBodySchema: ObjectSchema = Joi.object({
	sendMessage: Joi.boolean().required(),
});

export const postCommentschema: ObjectSchema = Joi.object({
	comment: Joi.string().min(1).required(),
});

export const updateCommentBodySchema = postCommentschema;

export const postOfferSchema: ObjectSchema = Joi.object({
	imageSrc: Joi.string().required(),
	discountPercentage: Joi.number().min(1).max(100).required(),
	description: Joi.string().required(),
});

export const updateOfferSchema: ObjectSchema = Joi.object({
	id: offerIdSchema,
	imageSrc: Joi.string().required(),
	discountPercentage: Joi.number().min(1).max(100).required(),
	description: Joi.string().required(),
});

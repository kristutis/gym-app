import { Request, Response, NextFunction } from "express";
import Joi, {ObjectSchema} from 'joi'
import { ApiError } from "../utils/errors";

export const validateRequestBody = (schema: ObjectSchema) => async (req: Request, res: Response, next: NextFunction) => {
    // schema.validateAsync(req.body)
    //     .then(r => next())
    //     .catch(error => next(ApiError.uprocessableEntity(error as any)))
    try {
        await schema.validateAsync(req.body)
        next()
    } catch (error) {
        return next(ApiError.unprocessableEntity(error as any))
    }
}

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
    email: Joi.string()
        .min(1)
        .max(255)
        .email({ tlds: { allow: false } })
        .required(),
    password: Joi.string()
        .min(6)
        .max(255)
        .required(),
})

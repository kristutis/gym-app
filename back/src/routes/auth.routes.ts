import express from 'express'
import authController from '../controllers/auth.controller'
import { loginUserSchema, validateRequestBody } from '../middleware/reqBodyValidation.middleware'

export const authRouter = express.Router()

const BASE_ROUTE = '/api/auth'

authRouter.post(BASE_ROUTE + '/login', validateRequestBody(loginUserSchema), authController.loginUser)
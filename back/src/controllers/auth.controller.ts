import { NextFunction, Request, Response } from 'express'
import { log } from '../utils/logger'
import bcrypt from 'bcrypt'
import { ApiError } from '../utils/errors'
import usersOperations from '../db/users.operations'
import { User } from '../models/user.model'
import { generateAccessToken, generateRefreshToken } from '../utils/jwt'

const TOKEN_TYPE = 'Bearer'
const validRefreshTokens = []

async function loginUser(req: Request, res: Response, next: NextFunction) {
    const loginUserDetails = req.body as LoginUserProps

    try {
        const user = await usersOperations.getUserByEmail(loginUserDetails.email) as User
        if (!user) {
            return next(ApiError.notFound('User does not exist'))
        }

        const passwordsMatch = await bcrypt.compare(loginUserDetails.password, user.hashedPassword as string)
        if (!passwordsMatch) {
            return next(ApiError.badRequest('Incorrect password'))
        }

        const validUser = {
            ...user,
            hashedPassword: undefined
        } as User

        const accessToken = generateAccessToken(validUser)
        const refreshToken = generateRefreshToken(validUser)

        validRefreshTokens.push(refreshToken)
        res.json({
            tokenType: TOKEN_TYPE,
            accessToken: accessToken,
            refreshToken: refreshToken
        })
    } catch (e) {
        return next(e)
    }
}

export interface LoginUserProps {
    email: string,
    password: string
}

export default {
    loginUser
}

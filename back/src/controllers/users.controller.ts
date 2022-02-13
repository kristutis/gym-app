import { NextFunction, Request, Response } from 'express'
import { log } from '../utils/logger'
import bcrypt from 'bcrypt'
import { ApiError } from '../utils/errors'
import usersOperations from '../db/users.operations'

async function getUserDetails(req: Request, res: Response, next: NextFunction) {
    return res.status(200).send('user get')
}

async function createUser(req: Request, res: Response, next: NextFunction) {
    const userDetails = req.body as CreateUserProps
    try {
        const hashedPassword = await bcrypt.hash(userDetails.password, 10)
        const newUser = {
            ...userDetails,
            password: hashedPassword,
        } as CreateUserProps
        await usersOperations.insertUser(newUser)
        return res.status(201).send(`User ${newUser.name} created!`)
    } catch (e: any) {
        if (e.sqlMessage && e.sqlMessage.includes('Duplicate entry')) {
            return next(ApiError.unprocessableEntity('Email already exist'));
        }
        return next(e)
    }
} 

export interface CreateUserProps {
    name: string,
    surname: string,
    email: string,
    password: string
}

export default {
    getUserDetails,
    createUser
}

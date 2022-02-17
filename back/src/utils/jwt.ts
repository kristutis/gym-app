import jwt from 'jsonwebtoken'
import { CONFIG } from '../config/config'
import { User } from '../models/user.model'

const ADMIN_ROLE = 'admin'
const ACCESS_TOKEN_EXPIRE = CONFIG.ACCESS_TOKEN_EXPIRE
const REFRESH_TOKEN_EXPIRE = CONFIG.REFRESH_TOKEN_EXPIRE
const ACCESS_TOKEN_SECRET = CONFIG.ACCESS_TOKEN_SECRET
const REFRESH_TOKEN_SECRET = CONFIG.REFRESH_TOKEN_SECRET

export const generateAccessToken = (user: User): string => {
    return jwt.sign(user, ACCESS_TOKEN_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRE })
}

export const generateRefreshToken = (user: User): string => {
    return jwt.sign(user, REFRESH_TOKEN_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRE })
}

function authenticateRefreshToken(req, res, next) {
    try {
        const refreshToken = req.body.refreshToken
        if (!refreshToken) {
            return res.status(400).send('No token recieved')
        }

        jwt.verify(refreshToken, REFRESH_TOKEN_SECRET, (err, user) => {
            if (err) {
                return res.status(403).send('Refresh token no longer valid')
            }
            req.user = {
                id: user.id,
                name: user.name,
                surname: user.surname,
                email: user.email,
                password: user.password,
                money: user.money,
                role: user.role,
            }
            next()
        })
    } catch (e) {
        console.log(e)
        return res.sendStatus(500)
    }
}

async function authenticateUser(req, res, next) {
    try {
        const user = await authenticateAccount(req)
        req.user = user
        next()
    } catch (errorCode) {
        return res.sendStatus(errorCode)
    }
}

async function authenticateAdmin(req, res, next) {
    try {
        const user = await authenticateAccount(req)
        if (ADMIN_ROLE == user.role) {
            req.user = user
            next()
        } else {
            return res.sendStatus(403)
        }
    } catch (errorCode) {
        return res.sendStatus(errorCode)
    }
}

async function authenticateAccount(req) {
    return new Promise((resolve, reject) => {
        try {
            const authHeader = req.headers['authorization']
            if (!authHeader) {
                return reject(401)
            }
            const token = authHeader.replace('Bearer', '').trim();
            if (!token) {
                return reject(401)
            }

            jwt.verify(token, ACCESS_TOKEN_SECRET, (err, user) => {
                if (err) {
                    return reject(403) //token no longer valid 
                }
                resolve(user)
            })
        } catch (e) {
            console.log(e)
            return reject(500)
        }
    })

}

module.exports = {
    ADMIN_ROLE,
    generateAccessToken, generateRefreshToken,
    authenticateUser, authenticateAdmin, authenticateRefreshToken
}
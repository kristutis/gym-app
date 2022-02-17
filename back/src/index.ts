import express, { NextFunction, Request, Response } from 'express'
import { CONFIG } from './config/config';
import { log } from './utils/logger';
import { usersRouter } from './routes/users.routes';
import { ApiError, apiErrorHandler } from './utils/errors';
import { authRouter } from './routes/auth.routes';

const app = express();
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use(usersRouter)
app.use(authRouter)

app.get('/', (req: Request, res: Response) => res.send('Welcome to gym API!'))
app.all('*', (req, res, next) => next(ApiError.notFound('Url does not exist')))

app.use(apiErrorHandler)

app.listen(CONFIG.PORT, () => log.info('listening on port: ' + CONFIG.PORT))


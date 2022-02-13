import express, {NextFunction, Request, Response} from 'express'
import { CONFIG } from './config/config';
import { log } from './utils/logger';
import { Trainer } from './models/trainer.model';
import { usersRouter } from './routes/users.routes';
import { ApiError, apiErrorHandler } from './utils/errors';

const app = express();
app.use(express.json())
app.use(express.urlencoded({extended: false}))

app.use(usersRouter)

app.get('/', (req: Request, res: Response) => res.send('Welcome to gym API!'))
app.all('*', (req, res, next) => next(ApiError.notFound('Url does not exist')))

app.use(apiErrorHandler)

app.listen(CONFIG.PORT, () => log.info('listening on port: ' + CONFIG.PORT))


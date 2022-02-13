import express, {Request, Response} from 'express'
import { CONFIG } from './config/config';
import { log } from './utils/logger';
import { Trainer } from './models/trainer.model';
import { usersRouter } from './routes/users.routes';
import { apiErrorHandler } from './utils/errors';

const app = express();
app.use(express.json())
app.use(express.urlencoded({extended: false}))

app.use(usersRouter)

app.use(apiErrorHandler)

app.get('/', (req, res) => res.send('Welcome to gym API!'))

app.listen(CONFIG.PORT, () => log.info('listening on port: ' + CONFIG.PORT))


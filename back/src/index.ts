import cors from 'cors';
import express, { Request, Response } from 'express';
import { CONFIG } from './config/config';
import { authRouter } from './routes/auth.routes';
import { commentsRouter } from './routes/comments.routes';
import { offersRouter } from './routes/offers.routes';
import { ratingsRouter } from './routes/ratings.routes';
import { reservationRouter } from './routes/reservation.routes';
import { timetableRouter } from './routes/timetable.routes';
import { trainersRouter } from './routes/trainers.routes';
import { usersRouter } from './routes/users.routes';
import { ApiError, apiErrorHandler } from './utils/errors';
import { log } from './utils/logger';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
	cors({
		methods: 'GET,PUT,POST,DELETE',
		origin: 'http://localhost:3000',
		allowedHeaders: 'authorization,content-type',
	})
);

app.use(usersRouter);
app.use(authRouter);
app.use(timetableRouter);
app.use(reservationRouter);
app.use(trainersRouter);
app.use(ratingsRouter);
app.use(offersRouter);
app.use(commentsRouter);

app.get('/', (req: Request, res: Response) => res.send('Welcome to gym API!'));
app.all('*', (req, res, next) => next(ApiError.notFound('Url does not exist')));

app.use(apiErrorHandler);

app.listen(CONFIG.PORT, () => log.info('listening on port: ' + CONFIG.PORT));

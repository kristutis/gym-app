import { MysqlError } from 'mysql';
import { ReservationWindow } from '../models/reservationWindow.model';
import { db } from './connect';

function insertTimetables(reservationWindows: ReservationWindow[]) {
	const values = reservationWindows.map((window) => [
		window.startTime,
		window.endTime,
		window.peopleCount || 0,
		window.limitedSpace,
	]);
	return new Promise((resolve, reject) => {
		db.query(
			'INSERT INTO reservation_windows (start_time, end_time, people_count, limited_space) VALUES ?',
			[values],
			(err, results) => {
				if (err) {
					return reject(err);
				}
				return resolve(results);
			}
		);
	});
}

function getTimetables(): Promise<ReservationWindow[] | MysqlError> {
	return new Promise((resolve, reject) => {
		db.query(
			'SELECT id, start_time as startTime, end_time as endTime, people_count as peopleCount, limited_space=1 as limitedSpace FROM reservation_windows',
			(err, results) => {
				if (err) {
					return reject(err);
				}
				return resolve(results as ReservationWindow[]);
			}
		);
	});
}

export default {
	insertTimetables,
	getTimetables,
};

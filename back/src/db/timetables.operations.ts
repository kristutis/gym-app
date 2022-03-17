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

export default {
	insertTimetables,
};

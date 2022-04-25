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
	if (!values.length) {
		return Promise.resolve(null);
	}
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

function deleteTimetableById(id: number): Promise<MysqlError | null> {
	return new Promise((resolve, reject) => {
		db.query('DELETE FROM reservation_windows WHERE id = ?', [id], (err, _) => {
			if (err) {
				return reject(err);
			}
			return resolve(null);
		});
	});
}

function deleteTimetablesInRange(
	startTime: Date,
	endTime: Date
): Promise<MysqlError | null> {
	return new Promise((resolve, reject) => {
		db.query(
			'DELETE ' +
				'FROM reservation_windows ' +
				'WHERE start_time > ? AND start_time < ?',
			[startTime, endTime],
			(err, _) => {
				if (err) {
					return reject(err);
				}
				return resolve(null);
			}
		);
	});
}

function getOverlappingTimetables(
	startTime: Date,
	endTime: Date
): Promise<ReservationWindow[] | MysqlError> {
	if (typeof startTime === 'number' || typeof endTime === 'number') {
		startTime = new Date(startTime as any);
		endTime = new Date(endTime as any);
	}

	if (startTime === endTime) {
		const newEndTime = new Date(endTime);
		newEndTime.setDate(newEndTime.getDate() + 1);
		endTime = newEndTime.getTime() as any as Date;
	}

	return new Promise((resolve, reject) => {
		db.query(
			'SELECT id, start_time as startTime, end_time as endTime, people_count as peopleCount, limited_space=1 as limitedSpace ' +
				'FROM reservation_windows ' +
				'WHERE start_time <= ? AND ? <= end_time OR ' +
				'start_time <= ? AND ? <= end_time OR ' +
				'? < start_time AND end_time < ? OR ' +
				'start_time < ? AND end_time > ?',
			[
				startTime,
				startTime,
				endTime,
				endTime,
				startTime,
				endTime,
				startTime,
				endTime,
			],
			(err, results) => {
				if (err) {
					return reject(err);
				}
				return resolve(results as ReservationWindow[]);
			}
		);
	});
}

function getTimetablesInRange(
	startTime: Date,
	endTime: Date
): Promise<ReservationWindow[] | MysqlError> {
	return new Promise((resolve, reject) => {
		db.query(
			'SELECT id, start_time as startTime, end_time as endTime, people_count as peopleCount, limited_space=1 as limitedSpace ' +
				'FROM reservation_windows ' +
				'WHERE start_time > ? AND start_time < ?',
			[startTime, endTime],
			(err, results) => {
				if (err) {
					return reject(err);
				}
				return resolve(results as ReservationWindow[]);
			}
		);
	});
}

function getTimetableById(id: number): Promise<ReservationWindow | MysqlError> {
	return new Promise((resolve, reject) => {
		db.query(
			'SELECT id, start_time as startTime, end_time as endTime, people_count as peopleCount, limited_space=1 as limitedSpace ' +
				'FROM reservation_windows ' +
				'WHERE id = ?',
			[id],
			(err, results) => {
				if (err) {
					return reject(err);
				}
				return resolve(results[0] as ReservationWindow);
			}
		);
	});
}

function updateTimetable(
	reservationWindow: ReservationWindow
): Promise<MysqlError | null> {
	return new Promise((resolve, reject) => {
		db.query(
			'UPDATE reservation_windows SET `start_time` = ?, `end_time` = ?, `people_count` = ?, `limited_space` = ? WHERE `id` = ?',
			[
				reservationWindow.startTime,
				reservationWindow.endTime,
				reservationWindow.peopleCount,
				reservationWindow.limitedSpace,
				reservationWindow.id,
			],
			(err, _) => {
				if (err) {
					return reject(err);
				}
				return resolve(null);
			}
		);
	});
}

export default {
	insertTimetables,
	getTimetables,
	getTimetablesInRange,
	getTimetableById,
	updateTimetable,
	deleteTimetablesInRange,
	deleteTimetableById,
	getOverlappingTimetables,
};

import { MysqlError } from 'mysql';
import { Reservation } from '../models/reservation.model';
import { ReservationWindow } from '../models/reservationWindow.model';
import { db } from './connect';

async function updateReservationAttendency(
	userId: string,
	reservationId: string,
	attended: boolean
): Promise<MysqlError> {
	return new Promise((resolve, reject) => {
		db.query(
			'UPDATE reservations SET attended = ? WHERE fk_user_id = ? AND fk_reservation_id = ?',
			[attended, userId, reservationId],
			(err, _) => {
				if (err) {
					return reject(err);
				}
				return resolve(null);
			}
		);
	});
}

async function getUsersReservationWindows(
	userId: string,
	startDate: Date,
	endDate: Date
): Promise<UserReservation[] | MysqlError> {
	return new Promise((resolve, reject) => {
		db.query(
			'SELECT fk_reservation_id as id, fk_user_id as uid, start_time as startTime, end_time as endTime, attended=1 as attended ' +
				'FROM reservations ' +
				'LEFT JOIN reservation_windows ' +
				'ON reservation_windows.id=reservations.fk_reservation_id ' +
				'WHERE fk_user_id = ? AND start_time > ? && start_time < ?',
			[userId, startDate, endDate],
			(err, result) => {
				if (err) {
					return reject(err);
				}
				const results = result.map((res: UserReservation) => {
					return { ...res, attended: !!res.attended };
				});
				return resolve(results as UserReservation[]);
			}
		);
	});
}

async function deleteReservation(reseration: Reservation): Promise<MysqlError> {
	return new Promise((resolve, reject) => {
		db.query(
			'DELETE FROM reservations WHERE fk_user_id = ? AND fk_reservation_id = ?',
			[reseration.userId, reseration.reservationId],
			(err, _) => {
				if (err) {
					return reject(err);
				}
				return resolve(null);
			}
		);
	});
}

async function insertReservation(reseration: Reservation): Promise<MysqlError> {
	return new Promise((resolve, reject) => {
		db.query(
			'INSERT INTO reservations (fk_user_id, fk_reservation_id) VALUES (?, ?)',
			[reseration.userId, reseration.reservationId],
			(err, _) => {
				if (err) {
					return reject(err);
				}
				return resolve(null);
			}
		);
	});
}

async function reservationExist(
	reseration: Reservation
): Promise<boolean | MysqlError> {
	return new Promise((resolve, reject) => {
		db.query(
			'SELECT fk_user_id as userId, fk_reservation_id as reservationId ' +
				'FROM reservations ' +
				'WHERE fk_user_id = ? AND fk_reservation_id = ?',
			[reseration.userId, reseration.reservationId],
			(err, result) => {
				if (err) {
					return reject(err);
				}
				return resolve(!!(result as Reservation[]).length);
			}
		);
	});
}

async function getUsersReservationWindowIds(
	userId: string
): Promise<number[] | MysqlError> {
	return new Promise((resolve, reject) => {
		db.query(
			'SELECT fk_reservation_id as id ' +
				'FROM reservations ' +
				'WHERE fk_user_id = ?',
			[userId],
			(err, result) => {
				if (err) {
					return reject(err);
				}
				const ids = result.map((res) => res.id);
				return resolve(ids as number[]);
			}
		);
	});
}

async function getUsersMissedReservations(
	uid: string,
	startDate: Date,
	endDate: Date
): Promise<number | MysqlError> {
	return new Promise((resolve, reject) => {
		db.query(
			'SELECT COUNT(*) ' +
				' FROM reservations ' +
				' LEFT JOIN reservation_windows ' +
				' ON reservations.fk_reservation_id = reservation_windows.id ' +
				' WHERE fk_user_id = ? AND start_time > ? AND start_time < ? AND attended = 0',
			[uid, startDate, endDate],
			(err, result) => {
				if (err) {
					return reject(err);
				}
				return resolve(parseInt(result[0]['COUNT(*)']));
			}
		);
	});
}

async function getUsersReservationWindowIdsInRange(
	userId: string,
	startDate: string | Date,
	endDate: string | Date
): Promise<number[] | MysqlError> {
	return new Promise((resolve, reject) => {
		db.query(
			'SELECT fk_reservation_id as id ' +
				' FROM reservations ' +
				' LEFT JOIN reservation_windows ' +
				' ON reservations.fk_reservation_id = reservation_windows.id ' +
				' WHERE fk_user_id = ? AND start_time > ? AND start_time < ?',
			[userId, startDate, endDate],
			(err, result) => {
				if (err) {
					return reject(err);
				}
				const ids = result.map((res) => res.id);
				return resolve(ids as number[]);
			}
		);
	});
}

export interface UserReservation extends ReservationWindow {
	uid: string;
	attended: boolean;
}

export default {
	insertReservation,
	reservationExist,
	getUsersReservationWindowIds,
	deleteReservation,
	getUsersReservationWindowIdsInRange,
	getUsersReservationWindows,
	updateReservationAttendency,
	getUsersMissedReservations,
};

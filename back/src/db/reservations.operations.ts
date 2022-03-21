import { MysqlError } from 'mysql';
import { Reservation } from '../models/reservation.model';
import { db } from './connect';

function deleteReservation(reseration: Reservation): Promise<MysqlError> {
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

function insertReservation(reseration: Reservation): Promise<MysqlError> {
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

function reservationExist(
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

function getUsersReservationWindowIds(
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

export default {
	insertReservation,
	reservationExist,
	getUsersReservationWindowIds,
	deleteReservation,
};

import { MysqlError } from 'mysql';
import { db } from './connect';

async function insertRating(
	userId: string,
	trainerId: string,
	rating: number
): Promise<MysqlError | null> {
	return new Promise((resolve, reject) => {
		db.query(
			'INSERT INTO trainer_ratings (rating, fk_user_id, fk_trainer_id) VALUES (?, ?, ?)',
			[rating, userId, trainerId],
			(err, _) => {
				if (err) {
					return reject(err);
				}
				return resolve(null);
			}
		);
	});
}

async function updateRating(
	userId: string,
	trainerId: string,
	rating: number
): Promise<MysqlError | null> {
	return new Promise((resolve, reject) => {
		db.query(
			'UPDATE trainer_ratings	SET rating = ? WHERE fk_user_id = ? AND fk_trainer_id = ?',
			[rating, userId, trainerId],
			(err, _) => {
				if (err) {
					return reject(err);
				}
				return resolve(null);
			}
		);
	});
}

async function getTrainerRatings(
	trainerId: string
): Promise<[{ rating: number }] | MysqlError> {
	return new Promise((resolve, reject) => {
		db.query(
			'SELECT rating FROM trainer_ratings WHERE fk_trainer_id = ?',
			[trainerId],
			(err, results) => {
				if (err) {
					return reject(err);
				}
				return resolve(results);
			}
		);
	});
}

async function getUserRaitingForTrainer(
	userId: string,
	trainerId: string
): Promise<{ rating: number } | undefined | MysqlError> {
	return new Promise((resolve, reject) => {
		db.query(
			'SELECT rating FROM trainer_ratings ' +
				'WHERE fk_user_id = ? AND fk_trainer_id = ?',
			[userId, trainerId],
			(err, results) => {
				if (err) {
					return reject(err);
				}
				return resolve(results[0]);
			}
		);
	});
}

export default {
	getUserRaitingForTrainer,
	insertRating,
	getTrainerRatings,
	updateRating,
};

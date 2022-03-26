import { MysqlError } from 'mysql';
import { Trainer } from '../models/trainer.model';
import { db } from './connect';

function getTrainersWithUserInfo(): Promise<Trainer[] | MysqlError> {
	return new Promise((resolve, reject) => {
		db.query(
			'SELECT uid as id, name, surname, email, ' +
				' reg_date as createDate, modify_date as modifyDate, role, phone, price, description, moto, photo_url as photoUrl ' +
				'FROM users ' +
				'LEFT JOIN user_roles ' +
				'ON users.fk_role = user_roles.id ' +
				'LEFT JOIN trainers ' +
				'ON users.uid = trainers.fk_user_id ' +
				'WHERE role = ?',
			['trainer'],
			(err, results) => {
				if (err) {
					return reject(err);
				}
				return resolve(results as Trainer[]);
			}
		);
	});
}

function deleteTrainer(uid: string): Promise<MysqlError> {
	return new Promise((resolve, reject) => {
		db.query('DELETE FROM trainers WHERE fk_user_id = ?', [uid], (err, _) => {
			if (err) {
				return reject(err);
			}
			return resolve(null);
		});
	});
}

function insertTrainer({
	fkUserId,
	price,
	description,
	moto,
	photoUrl,
}: TrainerProps) {
	return new Promise((resolve, reject) => {
		db.query(
			'INSERT INTO trainers (price, description, moto, photo_url, fk_user_id) VALUES (?, ?, ?, ?, ?)',
			[price, description, moto, photoUrl, fkUserId],
			(err, results) => {
				if (err) {
					return reject(err);
				}
				return resolve(results);
			}
		);
	});
}

function updateTrainer({
	fkUserId,
	price,
	description,
	moto,
	photoUrl,
}: TrainerProps): Promise<MysqlError> {
	return new Promise((resolve, reject) => {
		db.query(
			'UPDATE trainers SET price = ?, description = ?, moto = ?, photo_url = ? WHERE fk_user_id = ?',
			[price, description, moto, photoUrl, fkUserId],
			(err, _) => {
				if (err) {
					return reject(err);
				}
				return resolve(null);
			}
		);
	});
}

function getTrainerByUid(fkUserId: string): Promise<TrainerProps | MysqlError> {
	return new Promise((resolve, reject) => {
		db.query(
			'SELECT ' +
				'price, description, moto, photo_url as photoUrl, fk_user_id as id ' +
				'FROM trainers ' +
				'WHERE fk_user_id = ?',
			[fkUserId],
			(err, results) => {
				if (err) {
					return reject(err);
				}
				return resolve(results[0] as TrainerProps);
			}
		);
	});
}

export interface TrainerProps {
	fkUserId: string;
	price: number;
	description: string;
	moto: string;
	photoUrl?: string;
}

export default {
	getTrainerByUid,
	deleteTrainer,
	updateTrainer,
	insertTrainer,
	getTrainersWithUserInfo,
};

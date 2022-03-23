import { MysqlError } from 'mysql';
import {
	CreateUserProps,
	UpdateUserProps,
} from '../controllers/users.controller';
import { Trainer } from '../models/trainer.model';
import { User } from '../models/user.model';
import { db } from './connect';

function deleteUser(uid: string): Promise<MysqlError> {
	return new Promise((resolve, reject) => {
		db.query('DELETE FROM users WHERE uid = ?', [uid], (err, _) => {
			if (err) {
				return reject(err);
			}
			return resolve(null);
		});
	});
}

function updateUser(user: UpdateUserProps): Promise<MysqlError> {
	return new Promise((resolve, reject) => {
		db.query(
			'UPDATE users SET name = ?, surname = ?, phone = ? WHERE uid = ?',
			[user.name, user.surname, user.phone, user.id],
			(err, _) => {
				if (err) {
					return reject(err);
				}
				return resolve(null);
			}
		);
	});
}

function updateUserPassword(
	uid: string,
	hashedPassword: string
): Promise<MysqlError> {
	return new Promise((resolve, reject) => {
		db.query(
			'UPDATE users SET password = ? WHERE uid = ?',
			[hashedPassword, uid],
			(err, _) => {
				if (err) {
					return reject(err);
				}
				return resolve(null);
			}
		);
	});
}

function insertUser(user: CreateUserProps) {
	return new Promise((resolve, reject) => {
		db.query(
			'INSERT INTO users (name, surname, email, password) VALUES (?, ?, ?, ?)',
			[user.name, user.surname, user.email, user.password],
			(err, results) => {
				if (err) {
					return reject(err);
				}
				return resolve(results);
			}
		);
	});
}

function getUserByEmail(userEmail: string): Promise<User | MysqlError> {
	return new Promise((resolve, reject) => {
		db.query(
			'SELECT ' +
				'uid as id, name, surname, email, password as hashedPassword,' +
				' reg_date as createDate, modify_date as modifyDate, role, phone ' +
				'FROM users ' +
				'LEFT JOIN user_roles ' +
				'ON users.fk_role = user_roles.id ' +
				'WHERE email = ?',
			[userEmail],
			(err, results) => {
				if (err) {
					return reject(err);
				}
				return resolve(results[0] as User);
			}
		);
	});
}

function getUserById(uid: string): Promise<User | MysqlError> {
	return new Promise((resolve, reject) => {
		db.query(
			'SELECT ' +
				'uid as id, name, surname, email, password as hashedPassword,' +
				' reg_date as createDate, modify_date as modifyDate, role, phone ' +
				'FROM users ' +
				'LEFT JOIN user_roles ' +
				'ON users.fk_role = user_roles.id ' +
				'WHERE uid = ?',
			[uid],
			(err, results) => {
				if (err) {
					return reject(err);
				}
				return resolve(results[0] as User);
			}
		);
	});
}

function getAllUsersWithTrainerInfo(): Promise<Trainer[] | MysqlError> {
	return new Promise((resolve, reject) => {
		db.query(
			'SELECT uid as id, name, surname, email, password as hashedPassword,' +
				' reg_date as createDate, modify_date as modifyDate, role, phone, price, description, moto, photo_url as photoUrl ' +
				'FROM users ' +
				'LEFT JOIN user_roles ' +
				'ON users.fk_role = user_roles.id ' +
				'LEFT JOIN trainers ' +
				'ON users.uid = trainers.fk_user_id',
			(err, results) => {
				if (err) {
					return reject(err);
				}
				return resolve(results as Trainer[]);
			}
		);
	});
}

export default {
	insertUser,
	getUserByEmail,
	getUserById,
	updateUser,
	updateUserPassword,
	getAllUsersWithTrainerInfo,
	deleteUser,
};

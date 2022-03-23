import { MysqlError } from 'mysql';
import {
	CreateUserProps,
	UpdateUserProps,
} from '../controllers/users.controller';
import { User } from '../models/user.model';
import { db } from './connect';

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

export default {
	insertUser,
	getUserByEmail,
	getUserById,
	updateUser,
	updateUserPassword,
};

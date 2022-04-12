import { MysqlError } from 'mysql';
import { CreateUserProps } from '../controllers/users.controller';
import { Trainer } from '../models/trainer.model';
import { User } from '../models/user.model';
import { USER_ROLE } from '../utils/jwt';
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

function updateUserBalance(id: string, balance: number): Promise<MysqlError> {
	return new Promise((resolve, reject) => {
		db.query(
			'UPDATE users SET  balance = ? WHERE uid = ?',
			[balance, id],
			(err, _) => {
				if (err) {
					return reject(err);
				}
				return resolve(null);
			}
		);
	});
}

function updateUserWithRole(
	id: string,
	name: string,
	surname: string,
	phone: string,
	role: number,
	balance: number
): Promise<MysqlError> {
	return new Promise((resolve, reject) => {
		db.query(
			'UPDATE users SET name = ?, surname = ?, phone = ?, fk_role = ?, balance = ? WHERE uid = ?',
			[name, surname, phone, role, balance, id],
			(err, _) => {
				if (err) {
					return reject(err);
				}
				return resolve(null);
			}
		);
	});
}

function updateUser(
	id: string,
	name: string,
	surname: string,
	phone?: string
): Promise<MysqlError> {
	return new Promise((resolve, reject) => {
		db.query(
			'UPDATE users SET name = ?, surname = ?, phone = ? WHERE uid = ?',
			[name, surname, phone, id],
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
				'uid as id, users.name as name, surname, email, password as hashedPassword,' +
				' reg_date as createDate, modify_date as modifyDate, role, phone, balance, valid_until as subscriptionValidUntil, ' +
				' fk_subscription_name as subscriptionName, start_time as subscriptionStartTime, end_time as subscriptionEndTime  ' +
				'FROM users ' +
				'LEFT JOIN user_roles ' +
				'ON users.fk_role = user_roles.id ' +
				'LEFT JOIN user_subscriptions ' +
				'ON users.uid = user_subscriptions.fk_user_id ' +
				'LEFT JOIN subscription_types ' +
				'ON subscription_types.name = user_subscriptions.fk_subscription_name ' +
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

function getUsersForTrainer(): Promise<User[] | MysqlError> {
	return new Promise((resolve, reject) => {
		db.query(
			'SELECT uid as id, name, surname, email, ' +
				'reg_date as createDate, modify_date as modifyDate, phone, balance, role ' +
				'FROM users ' +
				'LEFT JOIN user_roles ' +
				'ON users.fk_role = user_roles.id ' +
				'WHERE role = ?',
			[USER_ROLE],
			(err, results) => {
				if (err) {
					return reject(err);
				}
				return resolve(results as Trainer[]);
			}
		);
	});
}

function getAllUsersWithTrainerInfo(): Promise<Trainer[] | MysqlError> {
	return new Promise((resolve, reject) => {
		db.query(
			'SELECT uid as id, name, surname, email, password as hashedPassword, ' +
				'reg_date as createDate, modify_date as modifyDate, role, phone, price, description, moto, photo_url as photoUrl, balance ' +
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
	updateUserWithRole,
	updateUserBalance,
	getUsersForTrainer,
};

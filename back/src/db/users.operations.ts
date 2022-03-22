import { MysqlError } from 'mysql';
import { CreateUserProps } from '../controllers/users.controller';
import { User } from '../models/user.model';
import { db } from './connect';

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

export default {
	insertUser,
	getUserByEmail,
};

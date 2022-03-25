import { MysqlError } from 'mysql';
import { db } from './connect';

function getRoles(): Promise<Role[] | MysqlError> {
	return new Promise((resolve, reject) => {
		db.query('SELECT * FROM user_roles', (err, results) => {
			if (err) {
				return reject(err);
			}
			return resolve(results as Role[]);
		});
	});
}

export interface Role {
	id: number;
	role: string;
}

export default {
	getRoles,
};

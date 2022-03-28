import { MysqlError } from 'mysql';
import TrainerComment from '../models/comment.model';
import { db } from './connect';

async function getTrainerComments(
	trainerId: string
): Promise<TrainerComment[] | MysqlError> {
	return new Promise((resolve, reject) => {
		db.query(
			'SELECT id, comment, create_date as createDate, name as creatorName FROM trainer_comments LEFT JOIN users on trainer_comments.fk_user_id=users.uid WHERE fk_trainer_id = ?',
			[trainerId],
			(err, results) => {
				if (err) {
					return reject(err);
				}
				return resolve(results as TrainerComment[]);
			}
		);
	});
}

async function insertComment(
	userId: string,
	trainerId: string,
	comment: string
): Promise<MysqlError> {
	return new Promise((resolve, reject) => {
		db.query(
			'INSERT INTO trainer_comments (comment, fk_user_id, fk_trainer_id) VALUES (?, ?, ?)',
			[comment, userId, trainerId],
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
	insertComment,
	getTrainerComments,
};

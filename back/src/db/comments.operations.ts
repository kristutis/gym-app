import { MysqlError } from 'mysql';
import TrainerComment from '../models/comment.model';
import { db } from './connect';

async function getTrainerComments(
	trainerId: string
): Promise<TrainerComment[] | MysqlError> {
	return new Promise((resolve, reject) => {
		db.query(
			'SELECT id, fk_user_id as userId, comment, create_date as createDate, name as creatorName FROM trainer_comments LEFT JOIN users on trainer_comments.fk_user_id=users.uid WHERE fk_trainer_id = ?',
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

async function getTrainerCommentById(
	commentId: number
): Promise<TrainerComment | MysqlError> {
	return new Promise((resolve, reject) => {
		db.query(
			'SELECT id, fk_user_id as userId, comment, create_date as createDate, name as creatorName FROM trainer_comments LEFT JOIN users on trainer_comments.fk_user_id=users.uid WHERE id = ?',
			[commentId],
			(err, results) => {
				if (err) {
					return reject(err);
				}
				return resolve(results[0] as TrainerComment);
			}
		);
	});
}

async function insertComment(
	userId: string,
	trainerId: string,
	comment: string
): Promise<MysqlError | null> {
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

async function deleteComment(commentId: number): Promise<MysqlError | null> {
	return new Promise((resolve, reject) => {
		db.query(
			'DELETE FROM trainer_comments WHERE id = ?',
			[commentId],
			(err, _) => {
				if (err) {
					return reject(err);
				}
				return resolve(null);
			}
		);
	});
}

async function updateComment(
	commentId: number,
	comment: string
): Promise<MysqlError | null> {
	return new Promise((resolve, reject) => {
		db.query(
			'UPDATE trainer_comments SET comment = ? WHERE id = ?',
			[comment, commentId],
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
	deleteComment,
	getTrainerCommentById,
	updateComment,
};

import { MysqlError } from 'mysql';
import { SubscriptionType } from '../models/subscriptionType.model';
import { db } from './connect';

function getSubscriptionTypeByName(
	name: string
): Promise<SubscriptionType | MysqlError> {
	return new Promise((resolve, reject) => {
		db.query(
			'SELECT name, price, start_time as startTime, end_time as endTime, valid_days as validDays ' +
				'FROM subscription_types ' +
				'WHERE name = ?',
			[name],
			(err, results) => {
				if (err) {
					return reject(err);
				}
				return resolve(results[0] as SubscriptionType);
			}
		);
	});
}

function getSubscriptionTypes(): Promise<SubscriptionType[] | MysqlError> {
	return new Promise((resolve, reject) => {
		db.query(
			'SELECT name, price, start_time as startTime, end_time as endTime, valid_days as validDays ' +
				'FROM subscription_types',
			(err, results) => {
				if (err) {
					return reject(err);
				}
				return resolve(results as SubscriptionType[]);
			}
		);
	});
}

async function deleteUserSubscriptions(
	uid: string
): Promise<null | MysqlError> {
	return new Promise((resolve, reject) => {
		db.query(
			'DELETE FROM user_subscriptions WHERE fk_user_id = ?',
			[uid],
			(err, _) => {
				if (err) {
					return reject(err);
				}
				return resolve(null);
			}
		);
	});
}

async function createUserSubscription(
	uid: string,
	subscriptionName: string,
	validUntil: Date
): Promise<null | MysqlError> {
	return new Promise((resolve, reject) => {
		db.query(
			'INSERT INTO user_subscriptions (fk_user_id, fk_subscription_name, valid_until) VALUES (?, ?, ?)',
			[uid, subscriptionName, validUntil],
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
	createUserSubscription,
	getSubscriptionTypes,
	getSubscriptionTypeByName,
	deleteUserSubscriptions,
};

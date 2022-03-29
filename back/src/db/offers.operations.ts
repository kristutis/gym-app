import { MysqlError } from 'mysql';
import { db } from './connect';

function insertOffer(offer: Offer): Promise<MysqlError> {
	return new Promise((resolve, reject) => {
		db.query(
			'INSERT INTO offers (image_src, discount_percentage, description) VALUES (?, ?, ?)',
			[offer.imageSrc, offer.discountPercentage, offer.description],
			(err, _) => {
				if (err) {
					return reject(err);
				}
				return resolve(null);
			}
		);
	});
}

// function updateRating(
// 	userId: string,
// 	trainerId: string,
// 	rating: number
// ): Promise<MysqlError> {
// 	return new Promise((resolve, reject) => {
// 		db.query(
// 			'UPDATE trainer_ratings	SET rating = ? WHERE fk_user_id = ? AND fk_trainer_id = ?',
// 			[rating, userId, trainerId],
// 			(err, _) => {
// 				if (err) {
// 					return reject(err);
// 				}
// 				return resolve(null);
// 			}
// 		);
// 	});
// }

function getOffers(): Promise<Offer[] | MysqlError> {
	return new Promise((resolve, reject) => {
		db.query(
			'SELECT id, image_src as imageSrc, discount_percentage as discountPercentage, description FROM offers',
			(err, results) => {
				if (err) {
					return reject(err);
				}
				return resolve(results as Offer[]);
			}
		);
	});
}

export default {
	getOffers,
	insertOffer,
};

export interface Offer {
	id: number;
	imageSrc: string;
	discountPercentage: number;
	description: string;
}

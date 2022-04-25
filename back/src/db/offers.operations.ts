import { MysqlError } from 'mysql';
import { db } from './connect';

function insertOffer(offer: Offer): Promise<MysqlError | null> {
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

function deleteOffer(id: number): Promise<MysqlError | null> {
	return new Promise((resolve, reject) => {
		db.query('DELETE FROM offers WHERE id = ?', [id], (err, _) => {
			if (err) {
				return reject(err);
			}
			return resolve(null);
		});
	});
}

function updateOffer(offer: Offer): Promise<MysqlError | null> {
	return new Promise((resolve, reject) => {
		db.query(
			'UPDATE offers SET image_src = ?, discount_percentage = ?, description = ? WHERE id = ?',
			[offer.imageSrc, offer.discountPercentage, offer.description, offer.id],
			(err, _) => {
				if (err) {
					return reject(err);
				}
				return resolve(null);
			}
		);
	});
}

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
	updateOffer,
	deleteOffer,
};

export interface Offer {
	id: number;
	imageSrc: string;
	discountPercentage: number;
	description: string;
}

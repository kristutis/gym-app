import { User } from './user.model';

export interface Trainer extends User {
	price: number;
	description: string;
	moto: string;
	photoUrl: string;
}

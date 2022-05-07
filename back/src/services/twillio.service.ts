import { Twilio } from 'twilio';
import { CONFIG } from '../config/config';
import usersOperations from '../db/users.operations';
import { User } from '../models/user.model';
import { ApiError } from '../utils/errors';

const twilioClient = new Twilio(CONFIG.TWILIO_USER, CONFIG.TWILIO_PASS);

export default async function sendTwilioMessage(
	userId: string,
	startTime: string
): Promise<string> {
	const user = (await usersOperations.getUserById(userId)) as User;
	const usersPhone = user.phone;
	if (!usersPhone) {
		return Promise.reject(
			ApiError.badRequest('User have not provided a phone number')
		);
	}
	await twilioClient.messages.create({
		from: CONFIG.TWILIO_NUMBER,
		to: usersPhone,
		body: `Dear ${user.name}, your registration on ${startTime} was successful`,
	});
	return Promise.resolve('');
}

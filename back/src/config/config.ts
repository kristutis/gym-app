require('dotenv').config();

export const CONFIG = {
	PORT: process.env.PORT || 3000,

	MYSQL_HOST: process.env.MYSQL_HOST || 'localhost',
	MYSQL_DATABASE: process.env.MYSQL_DATABASE || '',
	MYSQL_USER: process.env.MYSQL_USER || '',
	MYSQL_PASSWORD: process.env.MYSQL_PASSWORD || '',

	ACCESS_TOKEN_EXPIRE: process.env.ACCESS_TOKEN_EXPIRE || '15m',
	REFRESH_TOKEN_EXPIRE: process.env.REFRESH_TOKEN_EXPIRE || '60m',
	ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET || '',
	REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET || '',

	TWILIO_USER: process.env.TWILIO_USER || '',
	TWILIO_PASS: process.env.TWILIO_PASS || '',
	TWILIO_NUMBER: process.env.TWILIO_NUMBER || '',

	MAX_MONTHLY_RESERVATIONS: process.env.MAX_MONTHLY_RESERVATIONS || 0,
	MAX_MISSED_ATTENDANACE: process.env.MAX_MISSED_ATTENDANACE || 0,
};

const validateTokenExpireFormat = (
	tokenExpireConfig: string,
	tokenExpireType: string
) => {
	if (!/^\d+m$/.test(tokenExpireConfig)) {
		throw Error(`Wrong format of ${tokenExpireType}! Example: 15m`);
	}
};

const validateTokenSecret = (secret: string, secretType: string) => {
	if (!secret) {
		throw Error(`${secretType} not found!`);
	}
};

validateTokenSecret(CONFIG.ACCESS_TOKEN_SECRET, 'ACCESS_TOKEN_SECRET');
validateTokenSecret(CONFIG.REFRESH_TOKEN_SECRET, 'REFRESH_TOKEN_SECRET');

validateTokenExpireFormat(CONFIG.ACCESS_TOKEN_EXPIRE, 'ACCESS_TOKEN_EXPIRE');
validateTokenExpireFormat(CONFIG.REFRESH_TOKEN_EXPIRE, 'REFRESH_TOKEN_EXPIRE');

if (!CONFIG.TWILIO_USER || !CONFIG.TWILIO_PASS || !CONFIG.TWILIO_NUMBER) {
	throw Error(`Twilio username or password or number not found!`);
}

if (
	isNaN(CONFIG.MAX_MONTHLY_RESERVATIONS as number) ||
	isNaN(CONFIG.MAX_MISSED_ATTENDANACE as number)
) {
	throw Error(
		`MAX_MONTHLY_RESERVATIONS and MAX_MISSED_ATTENDANACE must be numbers!`
	);
}

if (
	CONFIG.MAX_MONTHLY_RESERVATIONS <= 0 ||
	CONFIG.MAX_MISSED_ATTENDANACE <= 0
) {
	throw Error(
		`MAX_MONTHLY_RESERVATIONS and MAX_MISSED_ATTENDANACE must be more than 0!`
	);
}

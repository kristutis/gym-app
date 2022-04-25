import request from 'supertest';
import app from './app';

describe('testing if application starts up', () => {
	it('should return OK status code on main page', async () => {
		const response = await request(app).get('/');
		expect(response.text).toBe('Welcome to gym API!');
		expect(response.statusCode).toBe(200);
	});

	it('returns correct message when route is not found', async () => {
		const response = await request(app).get('/AAAA/AAAA/AAA');
		expect(response.body?.error?.message).toBe('Url does not exist');
		expect(response.statusCode).toBe(404);
	});
});

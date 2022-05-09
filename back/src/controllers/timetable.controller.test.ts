import request from 'supertest';
import app from '../app';
import {
	CreateTimetableProps,
	testTimetableGenerator,
} from './timetable.controller';

const weekends = [
	'2022-04-03',
	'2022-04-09',
	'2022-04-10',
	'2022-04-16',
	'2022-04-17',
];

describe('testing timetables generation', () => {
	it('Generates timetables correctly', async () => {
		const generatingProps = [
			{
				startDate: new Date('2022-04-03'),
				startTime: '10:00',
				endDate: new Date('2022-04-17'),
				endTime: '20:00',
				visitingTime: '01:00',
				breakTime: '02:00',
				excludeWeekends: false,
				onlyWeekends: false,
				limitVisitors: true,
				visitorsCount: 10,
			},
		] as CreateTimetableProps[];

		const reservationWindows = testTimetableGenerator(generatingProps);

		expect(reservationWindows.length).toBe(42);

		expect(reservationWindows[0].startTime.toLocaleString('lt-LT')).toBe(
			'2022-04-03 10:00:00'
		);
		expect(reservationWindows[0].endTime.toLocaleString('lt-LT')).toBe(
			'2022-04-03 11:00:00'
		);

		expect(reservationWindows[41].startTime.toLocaleString('lt-LT')).toBe(
			'2022-04-16 16:00:00'
		);
		expect(reservationWindows[41].endTime.toLocaleString('lt-LT')).toBe(
			'2022-04-16 17:00:00'
		);

		reservationWindows.forEach((window, index) => {
			expect(window.limitedSpace).toBeTruthy();
			expect(window.peopleCount).toBe(10);
			if (index % 3 === 0) {
				expect(
					reservationWindows[index].startTime.toLocaleTimeString('lt-LT')
				).toBe('10:00:00');
				expect(
					reservationWindows[index].endTime.toLocaleTimeString('lt-LT')
				).toBe('11:00:00');
			}
		});
	});

	it('Generates timetables without weekends', async () => {
		const generatingProps = [
			{
				startDate: new Date('2022-04-03'),
				startTime: '10:00',
				endDate: new Date('2022-04-17'),
				endTime: '20:00',
				visitingTime: '01:00',
				breakTime: '02:00',
				excludeWeekends: true,
				onlyWeekends: false,
				limitVisitors: true,
				visitorsCount: 20,
			},
		] as CreateTimetableProps[];

		const reservationWindows = testTimetableGenerator(generatingProps);

		expect(reservationWindows.length).toBe(30);

		expect(reservationWindows[0].startTime.toLocaleString('lt-LT')).toBe(
			'2022-04-04 10:00:00'
		);
		expect(reservationWindows[0].endTime.toLocaleString('lt-LT')).toBe(
			'2022-04-04 11:00:00'
		);

		expect(reservationWindows[29].startTime.toLocaleString('lt-LT')).toBe(
			'2022-04-15 16:00:00'
		);
		expect(reservationWindows[29].endTime.toLocaleString('lt-LT')).toBe(
			'2022-04-15 17:00:00'
		);

		reservationWindows.forEach((window, _) => {
			expect(window.limitedSpace).toBeTruthy();
			expect(window.peopleCount).toBe(20);
			expect(
				weekends.includes(window.startTime.toLocaleDateString('lt-LT'))
			).toBeFalsy();
			expect(
				weekends.includes(window.endTime.toLocaleDateString('lt-LT'))
			).toBeFalsy();
		});
	});

	it('Generates timetables only on weekends', async () => {
		const generatingProps = [
			{
				startDate: new Date('2022-04-03'),
				startTime: '10:00',
				endDate: new Date('2022-04-17'),
				endTime: '20:00',
				visitingTime: '01:00',
				breakTime: '02:00',
				excludeWeekends: false,
				onlyWeekends: true,
				limitVisitors: true,
				visitorsCount: 30,
			},
		] as CreateTimetableProps[];

		const reservationWindows = testTimetableGenerator(generatingProps);

		expect(reservationWindows.length).toBe(12);

		expect(reservationWindows[0].startTime.toLocaleString('lt-LT')).toBe(
			'2022-04-03 10:00:00'
		);
		expect(reservationWindows[0].endTime.toLocaleString('lt-LT')).toBe(
			'2022-04-03 11:00:00'
		);

		expect(reservationWindows[11].startTime.toLocaleString('lt-LT')).toBe(
			'2022-04-16 16:00:00'
		);
		expect(reservationWindows[11].endTime.toLocaleString('lt-LT')).toBe(
			'2022-04-16 17:00:00'
		);

		reservationWindows.forEach((window, _) => {
			expect(window.limitedSpace).toBeTruthy();
			expect(window.peopleCount).toBe(30);
			expect(
				weekends.includes(window.startTime.toLocaleDateString('lt-LT'))
			).toBeTruthy();
			expect(
				weekends.includes(window.endTime.toLocaleDateString('lt-LT'))
			).toBeTruthy();
		});
	});

	it('Generates correctly unlimited day windows', async () => {
		const generatingProps = [
			{
				startDate: new Date('2022-04-03'),
				startTime: '00:00',
				endDate: new Date('2022-04-06'),
				endTime: '00:00',
				visitingTime: '23:59',
				breakTime: '00:00',
				excludeWeekends: false,
				onlyWeekends: false,
				limitVisitors: true,
				visitorsCount: 30,
			},
		] as CreateTimetableProps[];

		const reservationWindows = testTimetableGenerator(generatingProps);

		expect(reservationWindows.length).toBe(4);
		expect(reservationWindows[0].startTime.toLocaleString('lt-LT')).toBe(
			'2022-04-03 00:00:00'
		);
		expect(reservationWindows[0].endTime.toLocaleString('lt-LT')).toBe(
			'2022-04-03 23:59:00'
		);
		expect(reservationWindows[1].startTime.toLocaleString('lt-LT')).toBe(
			'2022-04-04 00:00:00'
		);
		expect(reservationWindows[1].endTime.toLocaleString('lt-LT')).toBe(
			'2022-04-04 23:59:00'
		);
		expect(reservationWindows[2].startTime.toLocaleString('lt-LT')).toBe(
			'2022-04-05 00:00:00'
		);
		expect(reservationWindows[2].endTime.toLocaleString('lt-LT')).toBe(
			'2022-04-05 23:59:00'
		);
		expect(reservationWindows[3].startTime.toLocaleString('lt-LT')).toBe(
			'2022-04-06 00:00:00'
		);
		expect(reservationWindows[3].endTime.toLocaleString('lt-LT')).toBe(
			'2022-04-06 23:59:00'
		);

		reservationWindows.forEach((window, _) => {
			expect(window.limitedSpace).toBeTruthy();
			expect(window.peopleCount).toBe(30);
		});
	});

	it('Generates correctly with unlimited visitors', async () => {
		const generatingProps = [
			{
				startDate: new Date('2022-04-03'),
				startTime: '00:00',
				endDate: new Date('2022-04-06'),
				endTime: '00:00',
				visitingTime: '23:59',
				breakTime: '00:00',
				excludeWeekends: false,
				onlyWeekends: false,
				limitVisitors: false,
				visitorsCount: 30,
			},
		] as CreateTimetableProps[];

		const reservationWindows = testTimetableGenerator(generatingProps);

		expect(reservationWindows.length).toBe(4);

		reservationWindows.forEach((window, _) => {
			expect(window.limitedSpace).toBeFalsy();
			expect(window.peopleCount).toBe(undefined);
		});
	});

	it('Does not generate if no weekends are present', () => {
		const generatingProps = [
			{
				startDate: new Date('2022-04-04'),
				startTime: '10:00',
				endDate: new Date('2022-04-09'),
				endTime: '16:00',
				visitingTime: '2:00',
				breakTime: '00:00',
				excludeWeekends: false,
				onlyWeekends: true,
				limitVisitors: false,
				visitorsCount: 30,
			},
		] as CreateTimetableProps[];

		const reservationWindows = testTimetableGenerator(generatingProps);

		expect(reservationWindows.length).toBe(0);
	});

	it('Does not generate if no weekdays are present', () => {
		const generatingProps = [
			{
				startDate: new Date('2022-04-09'),
				startTime: '10:00',
				endDate: new Date('2022-04-11'),
				endTime: '16:00',
				visitingTime: '2:00',
				breakTime: '00:00',
				excludeWeekends: true,
				onlyWeekends: false,
				limitVisitors: false,
				visitorsCount: 30,
			},
		] as CreateTimetableProps[];

		const reservationWindows = testTimetableGenerator(generatingProps);

		expect(reservationWindows.length).toBe(0);
	});

	it('Does not generate if request is invalid', async () => {
		const reqBody = [
			{
				startDate: new Date('2022-04-09'),
				startTime: '10:00',
				endDate: new Date('2022-04-11'),
				endTime: '16:00',
				visitingTime: '',
				breakTime: '00:00',
				excludeWeekends: true,
				onlyWeekends: false,
				limitVisitors: false,
				visitorsCount: 30,
			},
		] as CreateTimetableProps[];
		const response = await request(app).post('/api/timetable').send(reqBody);
		expect(response.statusCode).toBe(422);
		expect(JSON.parse(response.text)?.error?.message?.details[0]?.message).toBe(
			`"[0].visitingTime" is not allowed to be empty`
		);
	});

	it('Does not generate if request body is empty', async () => {
		const reqBody = {};
		const response = await request(app).post('/api/timetable').send(reqBody);
		expect(response.statusCode).toBe(422);
		expect(JSON.parse(response.text)?.error?.message?.details[0]?.message).toBe(
			`"value" must be an array`
		);
	});

	it('Does not generate if admin is unauthorized', async () => {
		const reqBody = [
			{
				startDate: new Date('2022-04-09'),
				startTime: '10:00',
				endDate: new Date('2022-04-11'),
				endTime: '16:00',
				visitingTime: '02:00',
				breakTime: '00:00',
				excludeWeekends: true,
				onlyWeekends: false,
				limitVisitors: false,
				visitorsCount: 30,
			},
		] as CreateTimetableProps[];
		const response = await request(app).post('/api/timetable').send(reqBody);
		expect(response.statusCode).toBe(401);
		expect(JSON.parse(response.text)?.error?.message).toBe(
			`Authorization header is missing`
		);
	});

	it('Cannot edit timetable if admin is unauthorized', async () => {
		const reqBody = {
			id: 5,
			startTime: new Date('2022-04-09'),
			endTime: new Date('2022-04-09'),
			limitedSpace: false,
		};
		const response = await request(app).put('/api/timetable').send(reqBody);
		expect(response.statusCode).toBe(401);
		expect(JSON.parse(response.text)?.error?.message).toBe(
			`Authorization header is missing`
		);
	});

	it('Cannot delete timetables if admin is unauthorized', async () => {
		const response = await request(app).delete('/api/timetable/4');
		expect(response.statusCode).toBe(401);
		expect(JSON.parse(response.text)?.error?.message).toBe(
			`Authorization header is missing`
		);
	});
});

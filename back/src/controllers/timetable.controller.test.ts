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
	it('', () => {});

	it('', () => {});

	it('', () => {});

	it('', () => {});

	it('', () => {});

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
});

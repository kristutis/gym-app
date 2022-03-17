export interface ReservationWindow {
	id?: number;
	startTime: Date;
	endTime: Date;
	limitedSpace: boolean;
	peopleCount?: number;
}

export interface User {
	id: string;
	name: string;
	surname: string;
	email: string;
	hashedPassword?: string;
	createDate: Date;
	modifyDate: Date;
	role: string;
	phone: string;
	balance: number;
	subscriptionName?: string;
	subscriptionValidUntil?: Date;
	subscriptionStartTime?: string;
	subscriptionEndTime?: string;
}

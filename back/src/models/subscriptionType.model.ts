export interface SubscriptionType {
	name: string;
	price: number;
	startTime: string;
	endTime: string;
	validDays: number;
}

export interface SubscriptionsCount {
	name: string;
	count: number;
}

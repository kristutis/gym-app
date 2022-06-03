import { NextFunction, Request, Response } from 'express';
import subscriptionsOperations from '../db/subscriptions.operations';
import usersOperations from '../db/users.operations';
import { SubscriptionType } from '../models/subscriptionType.model';
import { User } from '../models/user.model';
import { ApiError } from '../utils/errors';
import { ResponseCode } from '../utils/responseCodes';

async function getSubscriptionTypes(
	req: Request,
	res: Response,
	next: NextFunction
) {
	try {
		const subscriptionTypes =
			(await subscriptionsOperations.getSubscriptionTypes()) as SubscriptionType[];
		return res.status(ResponseCode.OK).json(subscriptionTypes);
	} catch (e) {
		next(e);
	}
}

async function getSubscriptionStats(
	req: Request,
	res: Response,
	next: NextFunction
) {
	try {
		const subscriptions = await subscriptionsOperations.getSubscriptionsCount();
		return res.status(ResponseCode.OK).json(subscriptions);
	} catch (e) {
		next(e);
	}
}

async function purchaseSubscription(
	req: Request,
	res: Response,
	next: NextFunction
) {
	const subsType = req.params.name;
	const userId = (req.body.user as User).id;

	try {
		const subscription =
			(await subscriptionsOperations.getSubscriptionTypeByName(
				subsType
			)) as SubscriptionType;
		const user = (await usersOperations.getUserById(userId)) as User;

		if (isSubscriptionValid(user)) {
			return next(
				ApiError.badRequest(
					`Subscription is valid until ${user.subscriptionValidUntil}`
				)
			);
		}

		if (user.balance < subscription.price) {
			return next(ApiError.badRequest('User balance is not enough'));
		}

		const now = new Date();
		now.setDate(now.getDate() + subscription.validDays);
		await subscriptionsOperations.deleteUserSubscriptions(user.id);
		await subscriptionsOperations.createUserSubscription(
			user.id,
			subscription.name,
			now
		);
		await usersOperations.updateUserBalance(
			user.id,
			user.balance - subscription.price
		);

		return res.sendStatus(ResponseCode.OK);
	} catch (e) {
		next(e);
	}
}

async function deleteSubscription(
	req: Request,
	res: Response,
	next: NextFunction
) {
	const userId = (req.body.user as User).id;

	try {
		const user = (await usersOperations.getUserById(userId)) as User;
		if (!isSubscriptionValid(user)) {
			return next(ApiError.badRequest(`User does not have subscriptions`));
		}

		await subscriptionsOperations.deleteUserSubscriptions(userId);
		return res.sendStatus(ResponseCode.DELETED);
	} catch (e) {
		next(e);
	}
}

function isSubscriptionValid(user: User): boolean {
	return (
		!!user.subscriptionValidUntil &&
		new Date(user.subscriptionValidUntil) > new Date()
	);
}

export default {
	getSubscriptionStats,
	getSubscriptionTypes,
	purchaseSubscription,
	deleteSubscription,
};

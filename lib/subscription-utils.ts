import { SUBSCRIPTION_PLANS, PLANS } from "./subscription-constants";
import { getUserPlan as getPlanName } from "./subscriptions.server";

export const getUserPlan = async () => {
    const planName = await getPlanName();

    if (planName === PLANS.PRO) {
        return SUBSCRIPTION_PLANS.PRO;
    }

    if (planName === PLANS.STANDARD) {
        return SUBSCRIPTION_PLANS.STANDARD;
    }

    return SUBSCRIPTION_PLANS.FREE;
};

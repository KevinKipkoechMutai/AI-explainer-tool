export const PLANS = {
    FREE: 'free',
    STANDARD: 'standard',
    PRO: 'pro'
} as const;

export type PlanType = typeof PLANS[keyof typeof PLANS];

export const PLAN_LIMITS = {
    [PLANS.FREE]: {
        books: 1,
        sessionsPerMonth: 5,
        minutesPerSession: 5,
        history: false,
        features: [
            "1 Book upload",
            "5 Sessions per month",
            "5 Minutes per session",
            "Basic features"
        ]
    },
    [PLANS.STANDARD]: {
        books: 10,
        sessionsPerMonth: 100,
        minutesPerSession: 15,
        history: true,
        features: [
            "10 Book uploads",
            "100 Sessions per month",
            "15 Minutes per session",
            "Session history",
            "Standard support"
        ]
    },
    [PLANS.PRO]: {
        books: 100,
        sessionsPerMonth: Infinity,
        minutesPerSession: 60,
        history: true,
        features: [
            "100 Book uploads",
            "Unlimited sessions",
            "60 Minutes per session",
            "Session history",
            "Priority support"
        ]
    }
} as const;

export const SUBSCRIPTION_PLANS = {
    FREE: {
        slug: PLANS.FREE,
        name: "Free",
        limits: PLAN_LIMITS[PLANS.FREE]
    },
    STANDARD: {
        slug: PLANS.STANDARD,
        name: "Standard",
        limits: PLAN_LIMITS[PLANS.STANDARD]
    },
    PRO: {
        slug: PLANS.PRO,
        name: "Pro",
        limits: PLAN_LIMITS[PLANS.PRO]
    }
} as const;

export type SubscriptionPlan = keyof typeof SUBSCRIPTION_PLANS;

export const getCurrentBillingPeriodStart = (): Date => {
    const now = new Date()
    return new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0)
}
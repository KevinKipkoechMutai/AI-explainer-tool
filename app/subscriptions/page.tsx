'use client'

import React from 'react'
import { SUBSCRIPTION_PLANS } from "@/lib/subscription-constants";
import { useSubscription } from "@/hooks/useSubscription";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useClerk } from "@clerk/nextjs";
import { cn } from "@/lib/utils";

const SubscriptionsPage = () => {
  const { plan: currentPlan, isLoaded } = useSubscription();
  const { openUserProfile } = useClerk();

  const plans = [
    SUBSCRIPTION_PLANS.FREE,
    SUBSCRIPTION_PLANS.STANDARD,
    SUBSCRIPTION_PLANS.PRO,
  ];

  const handlePlanAction = (planSlug: string) => {
    // Open Clerk user profile
    openUserProfile();
  };

  return (
    <main className="wrapper container py-10">
      <div className="flex flex-col items-center mb-10 text-center">
        <h1 className="text-4xl font-bold font-ibm-plex-serif text-brand-dark mb-4">
          Choose Your Plan
        </h1>
        <p className="text-lg text-brand-muted max-w-2xl">
          Unlock more books, longer sessions, and advanced features by upgrading your subscription.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {plans.map((plan) => {
          const isCurrent = isLoaded && currentPlan === plan.slug;
          
          return (
            <div 
              key={plan.slug} 
              className={`flex flex-col p-8 bg-white rounded-2xl border-2 transition-all ${
                isCurrent 
                  ? "border-brand-dark shadow-lg scale-105" 
                  : "border-brand-subtle hover:border-brand-muted"
              }`}
            >
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-brand-dark mb-2">{plan.name}</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-brand-dark">
                    {plan.slug === 'free' ? '$0' : plan.slug === 'standard' ? '$9' : '$19'}
                  </span>
                  <span className="text-brand-muted">/month</span>
                </div>
              </div>

              <div className="flex-1 mb-8">
                <p className="font-semibold text-brand-dark mb-4">Features:</p>
                <ul className="space-y-3">
                  {plan.limits.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3 text-brand-muted">
                      <Check className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <Button 
                onClick={() => handlePlanAction(plan.slug)}
                variant={isCurrent ? "secondary" : "default"}
                className={`w-full py-6 text-lg font-semibold rounded-xl ${
                  isCurrent ? "bg-brand-subtle text-brand-dark hover:bg-brand-subtle/80" : "bg-brand-dark text-white hover:bg-brand-dark/90"
                }`}
              >
                {isCurrent ? "Current Plan" : plan.slug === 'free' ? "Get Started" : "Upgrade Now"}
              </Button>
            </div>
          );
        })}
      </div>
    </main>
  )
}

export default SubscriptionsPage

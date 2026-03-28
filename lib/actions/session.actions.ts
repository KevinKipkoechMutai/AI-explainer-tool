"use server"

import {EndSessionResult, StartSessionResult} from "@/types";
import {connectToDatabase} from "@/database/mongoose";
import VoiceSession from "@/database/models/voice-session.model";
import {getCurrentBillingPeriodStart} from "@/lib/subscription-constants";
import {getUserPlan} from "@/lib/subscription-utils";
import {auth} from "@clerk/nextjs/server";


export const startVoiceSession = async (clerkId: string, bookId: string): Promise<StartSessionResult> => {
    try {
        await connectToDatabase()

        const { userId: currentUserId } = await auth();
        if (!currentUserId || currentUserId !== clerkId) {
            return { success: false, message: "Unauthorized" };
        }

        const plan = await getUserPlan();
        const billingPeriodStart = getCurrentBillingPeriodStart();

        if (plan.limits.sessionsPerMonth !== Infinity) {
            const sessionCount = await VoiceSession.countDocuments({
                clerkId,
                billingPeriodStart
            });

            if (sessionCount >= plan.limits.sessionsPerMonth) {
                return {
                    success: false,
                    message: `You have reached your monthly session limit for the ${plan.name} plan.`,
                    isBillingError: true
                };
            }
        }

        const session = await VoiceSession.create({
            clerkId,
            bookId,
            startedAt: new Date(),
            billingPeriodStart,
            durationSeconds: 0
        })

        return {
            success: true,
            sessionId: session._id.toString(),
            maxDurationMinutes: plan.limits.minutesPerSession
        }
    } catch (e) {
        console.error("Error starting voice session: ", e)
        return {
            success: false,
            message: "Failed to start voice session",
            error: e instanceof Error ? e.message : "Unknown error"
        }
    }
}

export const endVoiceSession = async (sessionId: string, durationSeconds: number): Promise<EndSessionResult> => {
    try {
        await connectToDatabase()
        const session = await VoiceSession.findByIdAndUpdate(sessionId, {
            endedAt: new Date(),
            durationSeconds
        })

        if (!session) {
            return {success: false}
        }

        return {success: true}
    } catch (e) {
        console.error("Error ending voice session: ", e)
        return {success: false}
    }
}
export const getVoiceSessions = async (clerkId: string): Promise<{success: boolean, data?: Record<string, unknown>[], error?: string}> => {
    try {
        await connectToDatabase()

        const plan = await getUserPlan()

        if (!plan.limits.history) {
            return {
                success: true,
                data: []
            }
        }

        const sessions = await VoiceSession.find({ clerkId }).sort({ startedAt: -1 }).lean()

        return {
            success: true,
            data: sessions.map(s => ({
                ...s,
                _id: s._id.toString(),
                bookId: s.bookId.toString()
            }))
        }
    } catch (e) {
        console.error("Error fetching voice sessions: ", e)
        return {
            success: false,
            error: "Failed to fetch voice sessions"
        }
    }
}

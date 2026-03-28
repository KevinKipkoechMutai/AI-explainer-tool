"use server"

import {EndSessionResult, StartSessionResult} from "@/types";
import {connectToDatabase} from "@/database/mongoose";
import VoiceSession from "@/database/models/voice-session.model";
import {getCurrentBillingPeriodStart} from "@/lib/subscription-constants";


export const startVoiceSession = async (clerkId: string, bookId: string): Promise<StartSessionResult> => {
    try {
        await connectToDatabase()
        const session = await VoiceSession.create({
            clerkId,
            bookId,
            startedAt: new Date(),
            billingPeriodStart: getCurrentBillingPeriodStart(),
            durationSeconds: 0
        })

        return {
            success: true,
            sessionId: session._id.toString()
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
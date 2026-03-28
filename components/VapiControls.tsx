"use client"

import {Mic, MicOff} from "lucide-react";
import useVapi from "@/hooks/useVapi";
import {IBook} from "@/types";
import React from "react";
import Image from "next/image";
import Transcript from "@/components/Transcript";
import Link from "next/link";


const VapiControls = ({book}: {book: IBook}) => {
    const {status = 'idle',
        isActive,
        messages,
        currentMessage,
        currentUserMessage,
        duration,
        limitError,
        isBillingError,
        limits,
        start,
        stop,
        clearError: clearErrors} = useVapi(book);



    return (
        <>
            <div className="vapi-main-container max-w-4xl">
                {/* Header Card */}
                <div className="vapi-header-card w-full mb-8">
                    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8 w-full">
                        {/* Left: Book Cover + Mic Button */}
                        <div className="vapi-cover-wrapper">
                            <Image
                                src={book.coverURL || '/placeholder-book.png'}
                                alt={book.title}
                                width={162}
                                height={240}
                                className="vapi-cover-image"
                            />
                            <div className="vapi-mic-wrapper">
                                {(status === 'speaking' || status === 'thinking') && (
                                    <div className="vapi-pulse-ring" />
                                )}
                                <button
                                    onClick={isActive ? stop : start}
                                    disabled={status === 'connecting'}
                                    className={`vapi-mic-btn shadow-soft-md ${isActive ? 'vapi-mic-btn-active' : 'vapi-mic-btn-inactive'}`}
                                >
                                    {isActive ? (
                                        <Mic className="size-7 text-[#663820]" />
                                    ) : (
                                        <MicOff className="size-7 text-[#663820]" />
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Right: Book Info */}
                        <div className="flex-1 flex flex-col items-center sm:items-start text-center sm:text-left pt-4">
                            {limitError && (
                                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-2 rounded-lg mb-4 flex items-center justify-between gap-4 w-full max-w-md">
                                    <div className="flex flex-col gap-1">
                                        <p className="text-sm font-medium">{limitError}</p>
                                        {isBillingError && (
                                            <Link href="/subscriptions" className="text-xs font-bold underline hover:text-red-800 transition-colors">
                                                Upgrade your plan
                                            </Link>
                                        )}
                                    </div>
                                    <button
                                        onClick={clearErrors}
                                        className="text-red-400 hover:text-red-600 transition-colors shrink-0"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                                    </button>
                                </div>
                            )}
                            <h1 className="text-3xl md:text-4xl font-bold font-serif text-[var(--text-primary)] mb-1">
                                {book.title}
                            </h1>
                            <p className="subtitle mb-6">by {book.author}</p>

                            {/* Badges Row */}
                            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
                                <div className="vapi-status-indicator">
                                    <span className={`vapi-status-dot vapi-status-dot-${status === 'idle' ? 'ready' : status}`} />
                                    <span className="vapi-status-text">
                                        {status === 'idle' ? 'Ready' :
                                         status === 'connecting' ? 'Connecting...' :
                                         status === 'starting' ? 'Starting...' :
                                         status === 'listening' ? 'Listening...' :
                                         status === 'thinking' ? 'Thinking...' :
                                         status === 'speaking' ? 'Speaking...' : 'Ready'}
                                    </span>
                                </div>
                                <div className="vapi-status-indicator">
                                    <span className="vapi-status-text">Voice: {book.persona || 'Default'}</span>
                                </div>
                                <div className="vapi-status-indicator">
                                    <span className="vapi-status-text">
                                        {Math.floor(duration / 60)}:{String(duration % 60).padStart(2, '0')}/{limits.minutesPerSession}:00
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Transcript Area */}
                <div className="vapi-transcript-wrapper">
                    <Transcript
                        messages={messages}
                        currentMessage={currentMessage}
                        currentUserMessage={currentUserMessage}
                    />
                </div>
            </div>
        </>
    )
}
export default VapiControls

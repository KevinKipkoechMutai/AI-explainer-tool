"use client"

import {Mic, MicOff} from "lucide-react";
import useVapi from "@/hooks/useVapi";
import {IBook} from "@/types";
import React from "react";
import Image from "next/image";
import Transcript from "@/components/Transcript";


const VapiControls = ({book}: {book: IBook}) => {
    const {status = 'idle',
        isActive,
        messages,
        currentMessage,
        currentUserMessage,
        duration,
        limitError,
        start,
        stop,
        clearErrors} = useVapi(book);



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
                            <h1 className="text-3xl md:text-4xl font-bold font-serif text-[var(--text-primary)] mb-1">
                                {book.title}
                            </h1>
                            <p className="subtitle mb-6">by {book.author}</p>

                            {/* Badges Row */}
                            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
                                <div className="vapi-status-indicator">
                                    <span className={`vapi-status-dot vapi-status-dot-${status === 'idle' ? 'ready' : status}`} />
                                    <span className="vapi-status-text">
                                        {(status || 'idle').charAt(0).toUpperCase() + (status || 'idle').slice(1)}
                                    </span>
                                </div>
                                <div className="vapi-status-indicator">
                                    <span className="vapi-status-text">Voice: {book.persona || 'Default'}</span>
                                </div>
                                <div className="vapi-status-indicator">
                                    <span className="vapi-status-text">
                                        {Math.floor(duration / 60)}:{String(duration % 60).padStart(2, '0')}/5:00
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

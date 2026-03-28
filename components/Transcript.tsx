"use client"

import React, { useEffect, useRef } from "react";
import { Mic } from "lucide-react";
import { Messages } from "@/types";

interface TranscriptProps {
  messages: Messages[];
  currentMessage: string;
  currentUserMessage: string;
}

const Transcript = ({ messages, currentMessage, currentUserMessage }: TranscriptProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, currentMessage, currentUserMessage]);

  const isEmpty = messages.length === 0 && !currentMessage && !currentUserMessage;

  return (
    <div className="transcript-container w-full min-h-[400px]">
      {isEmpty ? (
        <div className="transcript-empty">
          <div className="size-16 rounded-full bg-gray-50 flex items-center justify-center mb-4">
            <Mic className="size-10 text-[#663820] opacity-30" />
          </div>
          <p className="transcript-empty-text">No conversation yet</p>
          <p className="transcript-empty-hint">Click the mic button above to start talking</p>
        </div>
      ) : (
        <div className="transcript-messages" ref={scrollRef}>
          {messages.map((message, index) => (
            <div
              key={index}
              className={`transcript-message ${
                message.role === "user"
                  ? "transcript-message-user"
                  : "transcript-message-assistant"
              }`}
            >
              <div
                className={`transcript-bubble ${
                  message.role === "user"
                    ? "transcript-bubble-user"
                    : "transcript-bubble-assistant"
                }`}
              >
                {message.content}
              </div>
            </div>
          ))}

          {/* Current Streaming Messages */}
          {currentUserMessage && (
            <div className="transcript-message transcript-message-user">
              <div className="transcript-bubble transcript-bubble-user">
                {currentUserMessage}
                <span className="transcript-cursor" />
              </div>
            </div>
          )}

          {currentMessage && (
            <div className="transcript-message transcript-message-assistant">
              <div className="transcript-bubble transcript-bubble-assistant">
                {currentMessage}
                <span className="transcript-cursor" />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Transcript;

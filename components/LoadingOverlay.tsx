"use client";

import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingOverlay = () => {
  return (
    <div className="loading-wrapper">
      <div className="loading-shadow-wrapper">
        <div className="loading-shadow">
          <Loader2 className="loading-animation h-12 w-12 text-[#663820]" />
          <h2 className="loading-title">Synthesizing Your Book...</h2>
          <div className="loading-progress">
            <div className="loading-progress-item">
              <span className="loading-progress-status" />
              <span className="text-[var(--text-secondary)]">Analyzing PDF structure</span>
            </div>
            <div className="loading-progress-item">
              <span className="loading-progress-status" />
              <span className="text-[var(--text-secondary)]">Extracting literary themes</span>
            </div>
            <div className="loading-progress-item">
              <span className="loading-progress-status" />
              <span className="text-[var(--text-secondary)]">Preparing voice assistant</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingOverlay;

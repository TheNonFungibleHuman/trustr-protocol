'use client';

import { useState, useEffect } from 'react';
import { demoMode } from '@/lib/demo';

export default function DemoBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(demoMode.isActive());

    const handleDemoChange = (event: CustomEvent<boolean>) => {
      setIsVisible(event.detail);
    };

    window.addEventListener('demo-mode-change', handleDemoChange as EventListener);
    return () => window.removeEventListener('demo-mode-change', handleDemoChange as EventListener);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="bg-gradient-to-r from-amber-500/20 to-orange-500/20 border-b border-amber-500/30 px-4 py-2">
      <div className="max-w-7xl mx-auto flex items-center justify-between text-sm">
        <div className="flex items-center gap-2 text-amber-400">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="font-medium">Demo Mode Active</span>
          <span className="text-amber-300/70 ml-2">
            You're exploring with simulated transactions - no real wallet or tokens needed
          </span>
        </div>
        <button
          onClick={() => demoMode.setMode(false)}
          className="text-amber-300 hover:text-amber-100 transition-colors text-xs underline"
        >
          Exit Demo
        </button>
      </div>
    </div>
  );
}


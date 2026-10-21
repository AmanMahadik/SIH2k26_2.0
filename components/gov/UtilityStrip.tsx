'use client';

import React, { useState, useEffect } from 'react';
import Emblem from './Emblem';
import { SunMoon } from 'lucide-react';

export default function UtilityStrip() {
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'larger'>('normal');
  const [highContrast, setHighContrast] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    if (fontSize === 'normal') {
      root.style.fontSize = '16px';
    } else if (fontSize === 'large') {
      root.style.fontSize = '17.5px';
    } else if (fontSize === 'larger') {
      root.style.fontSize = '19px';
    }
  }, [fontSize]);

  const toggleContrast = () => {
    setHighContrast(!highContrast);
    document.documentElement.classList.toggle('gov-high-contrast', !highContrast);
  };

  return (
    <div className="w-full bg-white border-b border-gov-border px-4 sm:px-6 lg:px-8 py-1 flex items-center justify-between text-xs text-gov-muted select-none">
      {/* Left side: Ministry Attribution with tiny emblem */}
      <div className="flex items-center space-x-2">
        <Emblem className="w-4 h-4" monochrome />
        <span className="font-medium text-slate-700">Government of India | Ministry of Education</span>
      </div>

      {/* Right side: Accessibility & Language Controls */}
      <div className="flex items-center space-x-3 sm:space-x-4">
        <a
          href="#main-content"
          className="hover:underline text-gov-link focus:outline-hidden focus:ring-2 focus:ring-gov-warning rounded-xs px-1"
        >
          Skip to main content
        </a>
        <span className="text-slate-300">|</span>

        {/* Font resize controls */}
        <div className="flex items-center space-x-1 font-semibold" aria-label="Text Size Controls">
          <button
            onClick={() => setFontSize('normal')}
            className={`px-1 rounded-xs hover:bg-slate-100 ${fontSize === 'normal' ? 'text-gov-navy underline font-bold' : 'text-slate-600'}`}
            title="Standard Font Size"
          >
            A-
          </button>
          <button
            onClick={() => setFontSize('large')}
            className={`px-1 rounded-xs hover:bg-slate-100 ${fontSize === 'large' ? 'text-gov-navy underline font-bold' : 'text-slate-600'}`}
            title="Large Font Size"
          >
            A
          </button>
          <button
            onClick={() => setFontSize('larger')}
            className={`px-1 rounded-xs hover:bg-slate-100 ${fontSize === 'larger' ? 'text-gov-navy underline font-bold' : 'text-slate-600'}`}
            title="Extra Large Font Size"
          >
            A+
          </button>
        </div>

        <span className="text-slate-300">|</span>

        {/* High contrast toggle */}
        <button
          onClick={toggleContrast}
          className="p-1 text-slate-600 hover:text-gov-navy rounded-xs focus:outline-hidden focus:ring-2 focus:ring-gov-warning"
          title="Toggle High Contrast Mode"
          aria-label="Toggle High Contrast Mode"
        >
          <SunMoon className="w-3.5 h-3.5" />
        </button>

        <span className="text-slate-300">|</span>

        {/* Language switch */}
        <div className="flex items-center space-x-1 font-medium text-slate-700">
          <span className="text-gov-navy font-semibold">English</span>
          <span className="text-slate-400">|</span>
          <span className="text-slate-500 hover:text-gov-navy cursor-pointer">हिन्दी</span>
        </div>
      </div>
    </div>
  );
}

'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { RefreshCw } from 'lucide-react';

interface GovCaptchaProps {
  onCodeChange: (code: string) => void;
  inputVal: string;
  onInputChange: (val: string) => void;
  refreshTrigger?: number;
}

const CHAR_SET = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ'; // Exclude ambiguous 0, O, 1, I

function generateRandomCode(): string {
  let code = '';
  for (let i = 0; i < 4; i++) {
    code += CHAR_SET.charAt(Math.floor(Math.random() * CHAR_SET.length));
  }
  return code;
}

export default function GovCaptcha({
  onCodeChange,
  inputVal,
  onInputChange,
  refreshTrigger,
}: GovCaptchaProps) {
  const [captchaCode, setCaptchaCode] = useState('');
  const [rotationAngles, setRotationAngles] = useState<number[]>([0, 0, 0, 0]);
  const [offsets, setOffsets] = useState<number[]>([0, 0, 0, 0]);
  const [isSpinning, setIsSpinning] = useState(false);

  // Keep a stable ref to onCodeChange so it never triggers re-renders or infinite loops
  const onCodeChangeRef = useRef(onCodeChange);
  useEffect(() => {
    onCodeChangeRef.current = onCodeChange;
  }, [onCodeChange]);

  const prevTriggerRef = useRef(refreshTrigger);

  const refreshCaptcha = useCallback(() => {
    const newCode = generateRandomCode();
    setCaptchaCode(newCode);
    setRotationAngles([
      Math.floor((Math.random() - 0.5) * 30),
      Math.floor((Math.random() - 0.5) * 30),
      Math.floor((Math.random() - 0.5) * 30),
      Math.floor((Math.random() - 0.5) * 30),
    ]);
    setOffsets([
      Math.floor((Math.random() - 0.5) * 6),
      Math.floor((Math.random() - 0.5) * 6),
      Math.floor((Math.random() - 0.5) * 6),
      Math.floor((Math.random() - 0.5) * 6),
    ]);
    setIsSpinning(true);
    setTimeout(() => setIsSpinning(false), 400);

    if (onCodeChangeRef.current) {
      onCodeChangeRef.current(newCode);
    }
  }, []);

  // Initial code generation on mount (runs only once)
  useEffect(() => {
    refreshCaptcha();
  }, [refreshCaptcha]);

  // Triggered refresh from parent (e.g. on role switch or failed attempt)
  useEffect(() => {
    if (
      refreshTrigger !== undefined &&
      refreshTrigger > 0 &&
      refreshTrigger !== prevTriggerRef.current
    ) {
      prevTriggerRef.current = refreshTrigger;
      refreshCaptcha();
    }
  }, [refreshTrigger, refreshCaptcha]);

  return (
    <div className="flex items-center space-x-2">
      {/* Distorted Government Visual Captcha Box */}
      <div
        className="relative h-10 w-28 bg-[#F0F3F8] border border-[#B0BAC9] rounded-[6px] overflow-hidden flex items-center justify-center select-none shadow-inner"
        title="Security Captcha - Official AICTE Verification"
      >
        {/* Subtle decorative security noise lines & wave */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none opacity-40"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M -10 20 Q 30 5, 60 22 T 120 18"
            fill="none"
            stroke="#0B2E5C"
            strokeWidth="1.2"
          />
          <path
            d="M -10 12 Q 25 28, 70 12 T 130 24"
            fill="none"
            stroke="#1D4E9E"
            strokeWidth="0.9"
            strokeDasharray="3 2"
          />
          <line x1="0" y1="28" x2="112" y2="10" stroke="#0B2E5C" strokeWidth="1" opacity="0.4" />
          <circle cx="18" cy="12" r="1.5" fill="#0B2E5C" opacity="0.5" />
          <circle cx="85" cy="26" r="1.5" fill="#0B2E5C" opacity="0.5" />
          <circle cx="50" cy="8" r="1" fill="#0B2E5C" opacity="0.5" />
        </svg>

        {/* Captcha Characters with individual rotation and vertical offset */}
        <div className="flex items-center space-x-1 font-mono font-extrabold text-[17px] text-[#0B2E5C] tracking-widest relative z-10">
          {captchaCode.split('').map((char, index) => (
            <span
              key={index}
              style={{
                display: 'inline-block',
                transform: `rotate(${rotationAngles[index] || 0}deg) translateY(${offsets[index] || 0}px)`,
                letterSpacing: '2px',
              }}
              className="drop-shadow-xs select-none"
            >
              {char}
            </span>
          ))}
        </div>
      </div>

      {/* Refresh Captcha Button */}
      <button
        type="button"
        onClick={refreshCaptcha}
        className="p-2 border border-slate-300 rounded-[6px] bg-white hover:bg-slate-100 text-slate-700 transition-colors focus:outline-hidden focus:ring-2 focus:ring-[#0B2E5C] active:scale-95"
        title="Change / Refresh Captcha Code"
        aria-label="Change Captcha Code"
      >
        <RefreshCw className={`w-4 h-4 ${isSpinning ? 'animate-spin text-[#0B2E5C]' : ''}`} />
      </button>

      {/* User Input */}
      <input
        type="text"
        value={inputVal}
        onChange={(e) => onInputChange(e.target.value.toUpperCase())}
        placeholder="Enter Captcha"
        maxLength={4}
        className="flex-1 px-3 py-2 text-xs border border-slate-300 rounded-[6px] focus:outline-hidden focus:ring-2 focus:ring-[#0B2E5C] bg-white text-slate-900 placeholder-slate-400 font-mono font-bold uppercase tracking-wider h-10 shadow-xs"
        required
      />
    </div>
  );
}

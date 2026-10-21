// components/gov/Emblem.tsx - Neutral Emblem Placeholder Component
import React from 'react';

export default function Emblem({ className = "w-10 h-10", monochrome = false }: { className?: string; monochrome?: boolean }) {
  return (
    <div className={`relative flex items-center justify-center shrink-0 ${className}`} aria-label="National Emblem Placeholder">
      <svg
        viewBox="0 0 100 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-xs"
      >
        {/* Ashoka Lion Capital Vector Outline Representation */}
        <path
          d="M50 8C38 8 32 18 32 28C32 38 38 44 42 48C36 49 26 53 24 64C22 75 30 84 38 86C38 92 42 98 50 98C58 98 62 92 62 86C70 84 78 75 76 64C74 53 64 49 58 48C62 44 68 38 68 28C68 18 62 8 50 8Z"
          fill={monochrome ? "#475569" : "#0B2E5C"}
          fillOpacity="0.85"
        />
        {/* Ashoka Chakra Base Center */}
        <circle cx="50" cy="107" r="9" stroke={monochrome ? "#475569" : "#0B2E5C"} strokeWidth="2.5" fill="none" />
        <circle cx="50" cy="107" r="2.5" fill={monochrome ? "#475569" : "#0B2E5C"} />
        {/* Decorative spokes */}
        <line x1="50" y1="99" x2="50" y2="115" stroke={monochrome ? "#475569" : "#0B2E5C"} strokeWidth="1.2" />
        <line x1="42" y1="107" x2="58" y2="107" stroke={monochrome ? "#475569" : "#0B2E5C"} strokeWidth="1.2" />
        <line x1="44.5" y1="101.5" x2="55.5" y2="112.5" stroke={monochrome ? "#475569" : "#0B2E5C"} strokeWidth="1.2" />
        <line x1="44.5" y1="112.5" x2="55.5" y2="101.5" stroke={monochrome ? "#475569" : "#0B2E5C"} strokeWidth="1.2" />
        {/* Base Pedestal */}
        <rect x="20" y="116" width="60" height="3" rx="1.5" fill={monochrome ? "#475569" : "#0B2E5C"} />
      </svg>
    </div>
  );
}

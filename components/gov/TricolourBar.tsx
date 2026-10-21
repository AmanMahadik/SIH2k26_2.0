// components/gov/TricolourBar.tsx
import React from 'react';

export default function TricolourBar({ className = "" }: { className?: string }) {
  return (
    <div className={`w-full flex flex-col h-[3px] shrink-0 ${className}`} aria-hidden="true">
      <div className="h-[1px] w-full bg-[#FF9933]" />
      <div className="h-[1px] w-full bg-[#FFFFFF]" />
      <div className="h-[1px] w-full bg-[#138808]" />
    </div>
  );
}

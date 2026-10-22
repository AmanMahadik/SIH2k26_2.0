// components/gov/GovFooter.tsx - Official Dark Navy Footer
import React from 'react';

export default function GovFooter() {
  return (
    <footer className="w-full bg-[#0B2540] text-white py-3.5 px-4 sm:px-6 lg:px-8 border-t border-slate-700 text-xs select-none">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2.5 text-center md:text-left">
        {/* Left: System identity */}
        <div className="text-slate-300 font-normal">
          <span className="font-semibold text-white">NirikshAI</span> | Application Validation & Compliance Verification | AICTE Regulation Bureau
        </div>

        {/* Center: Official Tagline */}
        <div className="font-bold text-white tracking-wide">
          Check early. Prove everything. Humans decide.
        </div>

        {/* Right: SIH Prototype Notice & Azure Sovereign Cloud */}
        <div className="text-slate-400 font-medium flex items-center justify-center md:justify-end space-x-2">
          <span>PROTOTYPE – Built for SIH 2026 (PS 26261)</span>
          <span className="text-slate-600">•</span>
          <span className="text-cyan-400 font-semibold">Azure Central India</span>
        </div>
      </div>
    </footer>
  );
}

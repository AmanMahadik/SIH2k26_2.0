import './globals.css';
import Navbar from '@/components/Navbar';
import React from 'react';

export const metadata = {
  title: 'NirikshAI (निरीक्षAI) - AI-Powered Regulatory Compliance Decision Support',
  description: 'AICTE Smart India Hackathon 2026 Problem Statement 26261 Decision Support System',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
        <Navbar />
        <main className="flex-1">{children}</main>
        <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-500">
          <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-2">
            <div>
              <span className="font-semibold text-slate-700">NirikshAI (निरीक्षAI)</span> — Smart India Hackathon 2026 (PS 26261)
            </div>
            <div>
              Designed for All India Council for Technical Education (AICTE), Ministry of Education, Govt of India
            </div>
            <div className="text-slate-400">
              Check early. Prove everything. Humans decide.
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}

import './globals.css';
import AuthProvider from '@/components/AuthProvider';
import React from 'react';

export const metadata = {
  title: 'NirikshAI - Application Validation & Compliance Verification | AICTE Regulation Bureau',
  description: 'AI-Powered Regulatory Compliance Decision Support for AICTE Extension of Approval (EoA)',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-[#EEF3FA] text-[#1A1A1A] antialiased">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}

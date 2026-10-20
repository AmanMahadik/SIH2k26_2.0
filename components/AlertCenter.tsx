'use client';

import React, { useState, useEffect } from 'react';
import { Bell, AlertTriangle, CheckCircle2, ShieldAlert, X, ExternalLink } from 'lucide-react';
import Link from 'next/link';

export interface AlertItem {
  id: string;
  type: 'critical' | 'warning' | 'info';
  title: string;
  message: string;
  targetAppId: string;
  timestamp: string;
  read: boolean;
}

const INITIAL_ALERTS: AlertItem[] = [
  {
    id: 'alt-1',
    type: 'critical',
    title: 'Tamper Risk Alert: Apex Technical Campus',
    message: 'Claimed intake altered from 240 to 300 seats. Multiple incremental PDF xref tables detected.',
    targetAppId: 'app-3',
    timestamp: '10 mins ago',
    read: false,
  },
  {
    id: 'alt-2',
    type: 'warning',
    title: 'Deficiency: Delhi College of Engineering',
    message: 'State NOC expired on 31 May 2025. Legal title mismatch with University affiliation.',
    targetAppId: 'app-2',
    timestamp: '25 mins ago',
    read: false,
  },
  {
    id: 'alt-3',
    type: 'warning',
    title: 'Fail-Safe Routing: National Institute of Mgmt',
    message: 'State DTE API timeout after 3 retries. Document escalated to manual review queue.',
    targetAppId: 'app-4',
    timestamp: '1 hour ago',
    read: false,
  },
];

export default function AlertCenter() {
  const [alerts, setAlerts] = useState<AlertItem[]>(INITIAL_ALERTS);
  const [isOpen, setIsOpen] = useState(false);

  const unreadCount = alerts.filter(a => !a.read).length;

  const markAllRead = () => {
    setAlerts(alerts.map(a => ({ ...a, read: true })));
  };

  const dismissAlert = (id: string) => {
    setAlerts(alerts.filter(a => a.id !== id));
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-slate-400 hover:text-white transition-colors rounded-full hover:bg-slate-800"
        title="Regulatory Alerts"
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[9px] font-extrabold text-white animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-xl bg-white shadow-2xl border border-slate-200 z-50 overflow-hidden text-slate-900">
          <div className="flex items-center justify-between bg-slate-900 px-4 py-3 text-white">
            <div className="flex items-center space-x-2">
              <ShieldAlert className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-bold uppercase tracking-wider">Regulatory Alerts (R9)</span>
            </div>
            <div className="flex items-center space-x-2">
              {unreadCount > 0 && (
                <button
                  onClick={markAllRead}
                  className="text-[10px] text-blue-300 hover:text-white underline font-semibold"
                >
                  Mark all read
                </button>
              )}
              <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
            {alerts.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-500">
                <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                All regulatory alerts acknowledged.
              </div>
            ) : (
              alerts.map(a => (
                <div
                  key={a.id}
                  className={`p-3.5 space-y-1.5 transition-colors ${
                    !a.read ? 'bg-amber-50/50' : 'hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <span className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded ${
                      a.type === 'critical' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {a.type}
                    </span>
                    <div className="flex items-center space-x-2">
                      <span className="text-[10px] text-slate-400">{a.timestamp}</span>
                      <button
                        onClick={() => dismissAlert(a.id)}
                        className="text-slate-400 hover:text-slate-600"
                        title="Dismiss"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <h4 className="text-xs font-bold text-slate-900">{a.title}</h4>
                  <p className="text-[11px] text-slate-600 leading-snug">{a.message}</p>

                  <div className="pt-1 flex justify-end">
                    <Link
                      href={`/officer/${a.targetAppId}`}
                      onClick={() => setIsOpen(false)}
                      className="inline-flex items-center space-x-1 text-[11px] font-bold text-blue-900 hover:text-blue-700"
                    >
                      <span>Investigate in Cockpit</span>
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

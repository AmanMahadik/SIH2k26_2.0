'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Application } from '@/lib/types';
import { getStoredApplications } from '@/lib/store';
import { Scale, Filter, AlertTriangle, CheckCircle, ArrowRight, Clock, ShieldAlert } from 'lucide-react';

export default function OfficerQueuePage() {
  const [apps, setApps] = useState<Application[]>([]);
  const [filter, setFilter] = useState<'all' | 'flagged' | 'clean'>('all');

  useEffect(() => {
    setApps(getStoredApplications());
    const handler = () => setApps(getStoredApplications());
    window.addEventListener('nirikshai_apps_change', handler);
    return () => window.removeEventListener('nirikshai_apps_change', handler);
  }, []);

  const filteredApps = apps.filter(app => {
    const hasDeficiencies = (app.findings && app.findings.length > 0);
    if (filter === 'flagged') return hasDeficiencies;
    if (filter === 'clean') return !hasDeficiencies;
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-extrabold text-slate-900">Scrutiny Officer Work Queue</h1>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800">
              Regulation Bureau
            </span>
          </div>
          <p className="text-sm text-slate-600 mt-1">
            Prioritized Extension of Approval (EoA 2026-27) applications for scrutiny officer verification.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center space-x-2 bg-slate-100 p-1 rounded-lg border border-slate-200">
          <Filter className="w-3.5 h-3.5 text-slate-400 ml-1.5" />
          <button
            onClick={() => setFilter('all')}
            className={`text-xs font-bold px-3 py-1.5 rounded ${filter === 'all' ? 'bg-white shadow-sm text-blue-900' : 'text-slate-600'}`}
          >
            All ({apps.length})
          </button>
          <button
            onClick={() => setFilter('flagged')}
            className={`text-xs font-bold px-3 py-1.5 rounded ${filter === 'flagged' ? 'bg-white shadow-sm text-amber-800' : 'text-slate-600'}`}
          >
            Flagged ({apps.filter(a => (a.findings?.length || 0) > 0).length})
          </button>
          <button
            onClick={() => setFilter('clean')}
            className={`text-xs font-bold px-3 py-1.5 rounded ${filter === 'clean' ? 'bg-white shadow-sm text-emerald-800' : 'text-slate-600'}`}
          >
            Clean ({apps.filter(a => (a.findings?.length || 0) === 0).length})
          </button>
        </div>
      </div>

      {/* Queue Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              <th className="py-3 px-4">Priority</th>
              <th className="py-3 px-4">Institution & AICTE ID</th>
              <th className="py-3 px-4">Category & Year</th>
              <th className="py-3 px-4">Verification Status</th>
              <th className="py-3 px-4">Deficiencies</th>
              <th className="py-3 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium">
            {filteredApps.map((app) => {
              const findingsCount = app.findings?.length || 0;
              const hasTamper = app.documents?.some(d => (d.tamper_indicators?.length || 0) > 0);
              const unverified = app.documents?.some(d => d.verification?.status === 'manual_review_required');

              return (
                <tr key={app.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-4 px-4">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-extrabold ${
                      app.priority >= 90
                        ? 'bg-rose-100 text-rose-800'
                        : app.priority >= 70
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-slate-100 text-slate-700'
                    }`}>
                      P-{app.priority}
                    </span>
                  </td>

                  <td className="py-4 px-4">
                    <div className="font-bold text-slate-900">{app.institution?.name}</div>
                    <div className="text-xs text-slate-500 font-mono flex items-center space-x-2">
                      <span>ID: {app.institution?.aicte_id}</span>
                      <span>•</span>
                      <span>{app.institution?.state}</span>
                    </div>
                  </td>

                  <td className="py-4 px-4">
                    <span className="text-xs font-semibold bg-slate-100 text-slate-800 px-2 py-0.5 rounded">
                      {app.category}
                    </span>
                    <div className="text-xs text-slate-500 mt-0.5">{app.academic_year}</div>
                  </td>

                  <td className="py-4 px-4">
                    {unverified ? (
                      <span className="inline-flex items-center space-x-1 text-xs font-bold text-purple-800 bg-purple-100 px-2 py-0.5 rounded">
                        <Clock className="w-3 h-3" />
                        <span>Manual Review Req</span>
                      </span>
                    ) : hasTamper ? (
                      <span className="inline-flex items-center space-x-1 text-xs font-bold text-rose-800 bg-rose-100 px-2 py-0.5 rounded">
                        <ShieldAlert className="w-3 h-3" />
                        <span>Tamper Advisory</span>
                      </span>
                    ) : findingsCount > 0 ? (
                      <span className="inline-flex items-center space-x-1 text-xs font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                        <AlertTriangle className="w-3 h-3" />
                        <span>Discrepancy</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center space-x-1 text-xs font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                        <CheckCircle className="w-3 h-3" />
                        <span>Verified</span>
                      </span>
                    )}
                  </td>

                  <td className="py-4 px-4">
                    {findingsCount === 0 ? (
                      <span className="text-xs text-emerald-700 font-semibold">0 Flags</span>
                    ) : (
                      <span className="text-xs font-extrabold text-amber-900 bg-amber-100 px-2 py-0.5 rounded-full">
                        {findingsCount} Flag{findingsCount > 1 ? 's' : ''}
                      </span>
                    )}
                  </td>

                  <td className="py-4 px-4 text-right">
                    <Link
                      href={`/officer/${app.id}`}
                      className="inline-flex items-center space-x-1 text-xs font-bold bg-blue-900 hover:bg-blue-800 text-white px-3.5 py-1.5 rounded-lg shadow-sm transition-all"
                    >
                      <span>Scrutinize</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

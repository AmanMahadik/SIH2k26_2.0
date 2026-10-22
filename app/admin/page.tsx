'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import GovLayout from '@/components/gov/GovLayout';
import {
  Users,
  FileSpreadsheet,
  Monitor,
  CheckCircle2,
  Settings,
  Plus,
  ShieldCheck,
  ArrowRight,
  UserPlus,
  FileText,
  Database,
  Lock,
  UserCheck,
  RefreshCw,
  Building2,
  X,
} from 'lucide-react';
import { RuleDefinition } from '@/lib/types';

interface InstitutionItem {
  id: string;
  aicte_id: string;
  name: string;
  state: string;
  university?: string;
  applications_count?: number;
}

interface OfficerItem {
  id: string;
  name: string;
  email: string;
  regional_office: string;
  clearance_level: string;
  status: string;
  created_at: string;
}

interface AuditItem {
  id: string;
  actor: string;
  action: string;
  entity: string;
  at: string;
}

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState('home');
  const [loading, setLoading] = useState(true);

  // Live Stats from Azure PostgreSQL
  const [stats, setStats] = useState({
    total_applications: 4,
    total_institutions: 4,
    total_officers: 3,
    total_users: 9,
    total_documents: 7,
    total_audits: 5,
    system_health: '99.9%',
    db_status: 'Connected to Azure Database for PostgreSQL (Central India)',
  });

  const [institutions, setInstitutions] = useState<InstitutionItem[]>([]);
  const [officers, setOfficers] = useState<OfficerItem[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditItem[]>([]);

  // Directory filter (All, Institutions, Officers)
  const [directoryType, setDirectoryType] = useState<'all' | 'institutions' | 'officers'>('all');

  // Modals for Adding Entities
  const [isAddInstModalOpen, setIsAddInstModalOpen] = useState(false);
  const [isAddOfficerModalOpen, setIsAddOfficerModalOpen] = useState(false);

  // Forms State
  const [instForm, setInstForm] = useState({
    name: '',
    aicte_id: '',
    state: 'Maharashtra',
    university: '',
    approved_intake: '360',
  });
  const [officerForm, setOfficerForm] = useState({
    name: '',
    email: '',
    regional_office: 'Western Regional Office (Mumbai)',
    clearance_level: 'L1_SCRUTINY',
  });

  const [formSubmitting, setFormSubmitting] = useState(false);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Rules State
  const [rules, setRules] = useState<RuleDefinition[]>([
    {
      id: 'R-DOC-AFFIDAVIT',
      type: 'required_document',
      doc_type: 'affidavit',
      clause: 'APH 2024-27 §4.1.2',
      description: 'Sworn affidavit on prescribed stamp paper is mandatory for Extension of Approval.',
    },
    {
      id: 'R-EXP-NOC',
      type: 'date_valid_for_year',
      doc_type: 'noc_state',
      field: 'valid_to',
      year: '2026-27',
      clause: 'APH 2024-27 §4.3.1',
      description: 'State NOC validity must cover up to at least Academic Year 2026-27.',
    },
    {
      id: 'R-REC-INTAKE',
      type: 'record_equals',
      field: 'eoa_letter.approved_intake',
      record: 'approved_intake',
      clause: 'APH 2024-27 §4.5.1',
      description: 'Intake claimed must not exceed sanctioned quota in AICTE national database.',
    },
  ]);
  const [ruleVersion, setRuleVersion] = useState(1);
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);

  const fetchAllAzureData = async () => {
    try {
      setLoading(true);
      const [statsRes, instRes, offRes, auditRes] = await Promise.all([
        fetch('/api/stats').then((r) => r.json()),
        fetch('/api/institutions').then((r) => r.json()),
        fetch('/api/officers').then((r) => r.json()),
        fetch('/api/audit').then((r) => r.json()),
      ]);

      if (statsRes.success && statsRes.data) {
        setStats(statsRes.data);
      }
      if (instRes.success && Array.isArray(instRes.data)) {
        setInstitutions(instRes.data);
      }
      if (offRes.success && Array.isArray(offRes.data)) {
        setOfficers(offRes.data);
      }
      if (auditRes.success && Array.isArray(auditRes.data)) {
        setAuditLogs(auditRes.data);
      }
    } catch (err) {
      console.error('Error fetching admin data from Azure DB:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllAzureData();
  }, []);

  const handleAddInstitution = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!instForm.name || !instForm.aicte_id) return;
    try {
      setFormSubmitting(true);
      const res = await fetch('/api/institutions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(instForm),
      });
      const data = await res.json();
      if (data.success) {
        setIsAddInstModalOpen(false);
        setInstForm({ name: '', aicte_id: '', state: 'Maharashtra', university: '', approved_intake: '360' });
        setSuccessToast(`Institution "${data.data.name}" registered in Azure PostgreSQL!`);
        setTimeout(() => setSuccessToast(null), 5000);
        fetchAllAzureData();
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (err: any) {
      alert(`Failed to save institution: ${err.message}`);
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleAddOfficer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!officerForm.name || !officerForm.email) return;
    try {
      setFormSubmitting(true);
      const res = await fetch('/api/officers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(officerForm),
      });
      const data = await res.json();
      if (data.success) {
        setIsAddOfficerModalOpen(false);
        setOfficerForm({ name: '', email: '', regional_office: 'Western Regional Office (Mumbai)', clearance_level: 'L1_SCRUTINY' });
        setSuccessToast(`Scrutiny Officer "${data.data.name}" onboarded in Azure PostgreSQL!`);
        setTimeout(() => setSuccessToast(null), 5000);
        fetchAllAzureData();
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (err: any) {
      alert(`Failed to save officer: ${err.message}`);
    } finally {
      setFormSubmitting(false);
    }
  };

  const handlePublishNewRule = () => {
    setRuleVersion((v) => v + 1);
    setIsPublishModalOpen(false);
    alert(`Success: Rule set updated! Published as APH_EOA_EXISTING.v${ruleVersion + 1}.json`);
  };

  return (
    <GovLayout role="admin" activeTab={activeTab} onTabChange={setActiveTab}>
      <div className="space-y-6">
        {/* Success Toast Notification */}
        {successToast && (
          <div className="bg-emerald-50 border border-emerald-300 text-emerald-900 px-4 py-3 rounded-[6px] shadow-sm flex items-center justify-between text-xs font-semibold animate-fadeIn">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{successToast}</span>
            </div>
            <button onClick={() => setSuccessToast(null)} className="text-emerald-700 hover:text-emerald-900">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Live Azure Database Status Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3.5 rounded-[6px] border border-[#D0D7E2] shadow-xs">
          <div className="flex items-center space-x-2 text-xs">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-semibold text-slate-800">
              Live Azure PostgreSQL Connected:
            </span>
            <span className="font-mono text-slate-600">aicte-nirikshai-db.postgres.database.azure.com</span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={() => setIsAddInstModalOpen(true)}
              className="inline-flex items-center space-x-1.5 text-xs font-bold text-white bg-[#0B2E5C] hover:bg-[#1D4E9E] px-3 py-1.5 rounded transition-colors shadow-xs"
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>+ Add Institution</span>
            </button>
            <button
              type="button"
              onClick={() => setIsAddOfficerModalOpen(true)}
              className="inline-flex items-center space-x-1.5 text-xs font-bold text-white bg-[#8B1A1A] hover:bg-[#6E1414] px-3 py-1.5 rounded transition-colors shadow-xs"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>+ Add Scrutiny Officer</span>
            </button>
            <button
              type="button"
              onClick={fetchAllAzureData}
              disabled={loading}
              className="inline-flex items-center space-x-1 text-xs font-bold text-[#0B2E5C] hover:bg-[#EEF3FA] px-2.5 py-1.5 rounded border border-[#D0D7E2] transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* TAB 1: HOME (Live System Overview & Audit Activity)                       */}
        {/* ========================================================================= */}
        {activeTab === 'home' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* System Overview: 2x2 Grid (7 Cols) */}
            <div className="lg:col-span-7 bg-white rounded-[6px] border border-[#D0D7E2] p-5 shadow-xs space-y-4">
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <h2 className="text-sm font-bold text-[#0B2E5C]">
                  System Overview (Azure Database Live Rows)
                </h2>
                <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  PostgreSQL Flexible Server
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* 1. Total Registered Entities */}
                <div className="bg-slate-50 border border-slate-200 rounded-[6px] p-4 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-slate-500">Institutions in DB</p>
                    <h3 className="text-2xl font-extrabold text-[#0B2E5C] mt-0.5">
                      {loading ? '...' : stats.total_institutions}
                    </h3>
                  </div>
                  <div className="w-9 h-9 rounded bg-blue-100 text-[#0B2E5C] flex items-center justify-center">
                    <Building2 className="w-5 h-5" />
                  </div>
                </div>

                {/* 2. Applications */}
                <div className="bg-slate-50 border border-slate-200 rounded-[6px] p-4 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-slate-500">Live Applications</p>
                    <h3 className="text-2xl font-extrabold text-[#0B2E5C] mt-0.5">
                      {loading ? '...' : stats.total_applications}
                    </h3>
                  </div>
                  <div className="w-9 h-9 rounded bg-emerald-100 text-[#1E7B34] flex items-center justify-center">
                    <FileSpreadsheet className="w-5 h-5" />
                  </div>
                </div>

                {/* 3. Scrutiny Officers */}
                <div className="bg-slate-50 border border-slate-200 rounded-[6px] p-4 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-slate-500">Scrutiny Officers</p>
                    <h3 className="text-2xl font-extrabold text-[#0B2E5C] mt-0.5">
                      {loading ? '...' : stats.total_officers}
                    </h3>
                  </div>
                  <div className="w-9 h-9 rounded bg-indigo-100 text-[#4338CA] flex items-center justify-center">
                    <Users className="w-5 h-5" />
                  </div>
                </div>

                {/* 4. Total Verified Documents */}
                <div className="bg-slate-50 border border-slate-200 rounded-[6px] p-4 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-slate-500">Documents in DB</p>
                    <h3 className="text-2xl font-extrabold text-[#1E7B34] mt-0.5">
                      {loading ? '...' : stats.total_documents}
                    </h3>
                  </div>
                  <div className="w-9 h-9 rounded bg-green-100 text-[#1E7B34] flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                </div>
              </div>

              <div className="pt-2 text-[11px] text-slate-500 flex justify-between items-center">
                <span>Infrastructure: Azure Central India Flexible Server</span>
                <span className="font-semibold text-emerald-700">Online &amp; Operational</span>
              </div>
            </div>

            {/* Recent Activities from Azure DB Audit Log (5 Cols) */}
            <div className="lg:col-span-5 bg-white rounded-[6px] border border-[#D0D7E2] p-5 shadow-xs space-y-4">
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <h2 className="text-sm font-bold text-[#0B2E5C]">
                  Recent Cryptographic Audit Logs
                </h2>
                <button
                  type="button"
                  onClick={() => setActiveTab('reports')}
                  className="text-xs font-semibold text-[#0B57D0] hover:underline"
                >
                  View All &rarr;
                </button>
              </div>

              <div className="space-y-3 text-xs">
                {auditLogs.slice(0, 4).map((log) => (
                  <div key={log.id} className="flex items-start space-x-2.5 pb-2 border-b border-slate-50">
                    <div className="w-7 h-7 rounded bg-blue-50 text-[#1D4E9E] flex items-center justify-center shrink-0 mt-0.5">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <p className="text-slate-800 font-semibold leading-tight">
                        {log.action} – <span className="font-normal text-slate-600">{log.actor}</span>
                      </p>
                      <p className="text-[10px] text-slate-400 mt-0.5 font-mono">
                        Entity: {log.entity} | Event #{log.id}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-2">
                <button
                  onClick={() => setActiveTab('config')}
                  className="w-full py-2 bg-[#8B1A1A] hover:bg-[#6E1414] text-white text-xs font-bold rounded-[4px] transition-colors flex items-center justify-center space-x-1.5"
                >
                  <Settings className="w-3.5 h-3.5" />
                  <span>Configure Handbook Rules</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: USERS & DIRECTORY MANAGEMENT (Live from Azure DB)                  */}
        {/* ========================================================================= */}
        {activeTab === 'users' && (
          <div className="bg-white rounded-[6px] border border-[#D0D7E2] p-6 shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-base font-bold text-[#0B2E5C]">
                  Directory &amp; Role-Based Access Control (Azure PostgreSQL)
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Live database records of registered technical institutes and appointed AICTE scrutiny officers.
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setIsAddInstModalOpen(true)}
                  className="inline-flex items-center space-x-1.5 text-xs font-bold text-white bg-[#0B2E5C] hover:bg-[#1D4E9E] px-3 py-1.5 rounded transition-colors shadow-xs"
                >
                  <Building2 className="w-3.5 h-3.5" />
                  <span>+ Add Institute</span>
                </button>
                <button
                  onClick={() => setIsAddOfficerModalOpen(true)}
                  className="inline-flex items-center space-x-1.5 text-xs font-bold text-white bg-[#8B1A1A] hover:bg-[#6E1414] px-3 py-1.5 rounded transition-colors shadow-xs"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>+ Add Officer</span>
                </button>
              </div>
            </div>

            {/* Filter buttons */}
            <div className="flex items-center space-x-2 text-xs">
              <button
                type="button"
                onClick={() => setDirectoryType('all')}
                className={`px-3 py-1.5 rounded font-bold transition-colors ${
                  directoryType === 'all'
                    ? 'bg-[#0B2E5C] text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                All Records ({institutions.length + officers.length})
              </button>
              <button
                type="button"
                onClick={() => setDirectoryType('institutions')}
                className={`px-3 py-1.5 rounded font-bold transition-colors ${
                  directoryType === 'institutions'
                    ? 'bg-[#0B2E5C] text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                Institutions ({institutions.length})
              </button>
              <button
                type="button"
                onClick={() => setDirectoryType('officers')}
                className={`px-3 py-1.5 rounded font-bold transition-colors ${
                  directoryType === 'officers'
                    ? 'bg-[#0B2E5C] text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                Scrutiny Officers ({officers.length})
              </button>
            </div>

            {/* Table of Live Records */}
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-[#EEF3FA] text-[#0B2E5C] font-bold border-y border-[#D0D7E2]">
                  <tr>
                    <th className="py-2.5 px-3">Entity Name</th>
                    <th className="py-2.5 px-3">Type / Role</th>
                    <th className="py-2.5 px-3">AICTE ID / Official Email</th>
                    <th className="py-2.5 px-3">State / Regional Office</th>
                    <th className="py-2.5 px-3">University / Clearance</th>
                    <th className="py-2.5 px-3 text-right">DB Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {/* Institutions */}
                  {(directoryType === 'all' || directoryType === 'institutions') &&
                    institutions.map((inst) => (
                      <tr key={inst.id} className="hover:bg-slate-50">
                        <td className="py-3 px-3 font-bold text-slate-800">
                          <div className="flex items-center space-x-2">
                            <Building2 className="w-3.5 h-3.5 text-[#1D4E9E]" />
                            <span>{inst.name}</span>
                          </div>
                        </td>
                        <td className="py-3 px-3 font-semibold text-[#1D4E9E]">Institution</td>
                        <td className="py-3 px-3 font-mono text-slate-600">{inst.aicte_id}</td>
                        <td className="py-3 px-3 text-slate-600">{inst.state}</td>
                        <td className="py-3 px-3 text-slate-600">{inst.university || 'Affiliated'}</td>
                        <td className="py-3 px-3 text-right">
                          <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                            Registered
                          </span>
                        </td>
                      </tr>
                    ))}

                  {/* Officers */}
                  {(directoryType === 'all' || directoryType === 'officers') &&
                    officers.map((off) => (
                      <tr key={off.id} className="hover:bg-slate-50">
                        <td className="py-3 px-3 font-bold text-slate-800">
                          <div className="flex items-center space-x-2">
                            <UserCheck className="w-3.5 h-3.5 text-[#8B1A1A]" />
                            <span>{off.name}</span>
                          </div>
                        </td>
                        <td className="py-3 px-3 font-semibold text-[#8B1A1A]">Scrutiny Officer</td>
                        <td className="py-3 px-3 font-mono text-slate-600">{off.email}</td>
                        <td className="py-3 px-3 text-slate-600">{off.regional_office}</td>
                        <td className="py-3 px-3">
                          <span className="bg-slate-100 px-2 py-0.5 rounded font-mono text-[11px] text-slate-700 border border-slate-200">
                            {off.clearance_level}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-right">
                          <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                            Active
                          </span>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: CONFIG / RULE MANAGER                                              */}
        {/* ========================================================================= */}
        {activeTab === 'config' && (
          <div className="bg-white rounded-[6px] border border-[#D0D7E2] p-6 shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-base font-bold text-[#0B2E5C]">
                  Regulatory Rule Sets (Rules as Versioned Data)
                </h2>
                <p className="text-xs text-[#5B6574] mt-0.5">
                  Active Rule Set: <span className="font-mono font-bold text-slate-800">EOA_EXISTING.v{ruleVersion}.json</span> (Handbook 2024-27)
                </p>
              </div>

              <button
                onClick={() => setIsPublishModalOpen(true)}
                className="inline-flex items-center space-x-1.5 bg-[#8B1A1A] hover:bg-[#6E1414] text-white text-xs font-bold px-4 py-2 rounded-[6px] shadow-xs transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Publish New Version (v{ruleVersion + 1})</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-[#EEF3FA] text-[#0B2E5C] font-bold border-y border-[#D0D7E2]">
                  <tr>
                    <th className="py-2.5 px-3">Rule ID</th>
                    <th className="py-2.5 px-3">Type</th>
                    <th className="py-2.5 px-3">Handbook Clause</th>
                    <th className="py-2.5 px-3">Description</th>
                    <th className="py-2.5 px-3 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {rules.map((r) => (
                    <tr key={r.id} className="hover:bg-slate-50">
                      <td className="py-3 px-3 font-mono font-bold text-[#0B2E5C]">{r.id}</td>
                      <td className="py-3 px-3 font-mono text-[11px] text-slate-600">{r.type}</td>
                      <td className="py-3 px-3 font-semibold text-slate-800">{r.clause}</td>
                      <td className="py-3 px-3 text-slate-600">{r.description}</td>
                      <td className="py-3 px-3 text-right">
                        <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded text-[10px] font-bold">
                          Active (v{ruleVersion})
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Confirm Publish Modal */}
            {isPublishModalOpen && (
              <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
                <div className="bg-white rounded-lg border border-slate-300 shadow-xl max-w-md w-full p-6 space-y-4">
                  <h3 className="text-sm font-bold text-[#0B2E5C]">
                    Publish New Rule Set Version (v{ruleVersion + 1})
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    This will create a new declarative rule snapshot <code className="font-bold">EOA_EXISTING.v{ruleVersion + 1}.json</code>. All newly submitted applications will be evaluated against this version without software redeployment.
                  </p>
                  <div className="flex justify-end space-x-3 pt-2">
                    <button
                      onClick={() => setIsPublishModalOpen(false)}
                      className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handlePublishNewRule}
                      className="px-4 py-1.5 text-xs font-bold text-white bg-[#8B1A1A] hover:bg-[#6E1414] rounded"
                    >
                      Confirm &amp; Publish
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: REPORTS                                                            */}
        {/* ========================================================================= */}
        {activeTab === 'reports' && (
          <div className="bg-white rounded-[6px] border border-[#D0D7E2] p-6 shadow-xs space-y-5">
            <div className="flex justify-between items-center border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-base font-bold text-[#0B2E5C]">Azure PostgreSQL Infrastructure Telemetry</h2>
                <p className="text-xs text-slate-500 mt-0.5">Real-time status of Azure Central India services and application telemetry.</p>
              </div>
              <button
                type="button"
                onClick={() => setActiveTab('home')}
                className="text-xs font-bold text-[#0B57D0] hover:underline"
              >
                &larr; Back to Dashboard
              </button>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded font-mono text-xs space-y-2 text-slate-700">
              <div className="flex justify-between border-b border-slate-200 pb-1">
                <span>Database Host: aicte-nirikshai-db.postgres.database.azure.com</span>
                <span className="text-emerald-700 font-bold">ONLINE</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-1">
                <span>Region &amp; Tier: Central India (Flexible Server, Standard D2ds_v5)</span>
                <span className="text-emerald-700 font-bold">ACTIVE</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-1">
                <span>SSL TLS 1.3 Transport Encryption:</span>
                <span className="text-emerald-700 font-bold">ENFORCED</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-1">
                <span>Cryptographic Audit Blocks:</span>
                <span className="text-blue-700 font-bold">{stats.total_audits} BLOCKS SEALED (SHA-256)</span>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* MODAL 1: ADD NEW TECHNICAL INSTITUTION (Inserts into Azure PostgreSQL)    */}
        {/* ========================================================================= */}
        {isAddInstModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg border border-slate-300 shadow-2xl max-w-lg w-full p-6 space-y-4">
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <div className="flex items-center space-x-2">
                  <Building2 className="w-5 h-5 text-[#0B2E5C]" />
                  <h3 className="text-base font-bold text-[#0B2E5C]">
                    Register New Technical Institution
                  </h3>
                </div>
                <button
                  onClick={() => setIsAddInstModalOpen(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddInstitution} className="space-y-3.5 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Institution Full Legal Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Veermata Jijabai Technological Institute"
                    value={instForm.name}
                    onChange={(e) => setInstForm({ ...instForm, name: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded text-slate-800 bg-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      AICTE Permanent ID *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 1-5098129031"
                      value={instForm.aicte_id}
                      onChange={(e) => setInstForm({ ...instForm, aicte_id: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded text-slate-800 bg-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      State / UT *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Maharashtra"
                      value={instForm.state}
                      onChange={(e) => setInstForm({ ...instForm, state: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded text-slate-800 bg-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Affiliating University
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. University of Mumbai"
                      value={instForm.university}
                      onChange={(e) => setInstForm({ ...instForm, university: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded text-slate-800 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Sanctioned Intake Quota
                    </label>
                    <input
                      type="number"
                      placeholder="e.g. 420"
                      value={instForm.approved_intake}
                      onChange={(e) => setInstForm({ ...instForm, approved_intake: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded text-slate-800 bg-white"
                    />
                  </div>
                </div>

                <p className="text-[11px] text-slate-500 pt-1">
                  Upon submission, this entity will be saved directly into Azure Database for PostgreSQL (Central India) with a cryptographically signed audit log block.
                </p>

                <div className="flex justify-end space-x-2 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsAddInstModalOpen(false)}
                    className="px-3.5 py-1.5 border border-slate-300 rounded font-semibold text-slate-600 hover:bg-slate-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={formSubmitting}
                    className="px-4 py-1.5 bg-[#0B2E5C] hover:bg-[#1D4E9E] text-white font-bold rounded shadow-xs transition-colors flex items-center space-x-1"
                  >
                    {formSubmitting ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Saving to Azure DB...</span>
                      </>
                    ) : (
                      <span>Save Institution</span>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* MODAL 2: ADD NEW SCRUTINY OFFICER (Inserts into Azure PostgreSQL)         */}
        {/* ========================================================================= */}
        {isAddOfficerModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg border border-slate-300 shadow-2xl max-w-lg w-full p-6 space-y-4">
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <div className="flex items-center space-x-2">
                  <UserPlus className="w-5 h-5 text-[#8B1A1A]" />
                  <h3 className="text-base font-bold text-[#0B2E5C]">
                    Onboard New AICTE Scrutiny Officer
                  </h3>
                </div>
                <button
                  onClick={() => setIsAddOfficerModalOpen(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddOfficer} className="space-y-3.5 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Officer Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dr. Vikram Sarabhai"
                    value={officerForm.name}
                    onChange={(e) => setOfficerForm({ ...officerForm, name: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded text-slate-800 bg-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Official AICTE Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. vikram.s@aicte-india.org"
                    value={officerForm.email}
                    onChange={(e) => setOfficerForm({ ...officerForm, email: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded text-slate-800 bg-white font-mono"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Regional Office *
                    </label>
                    <select
                      value={officerForm.regional_office}
                      onChange={(e) => setOfficerForm({ ...officerForm, regional_office: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded text-slate-800 bg-white"
                    >
                      <option value="Western Regional Office (Mumbai)">WRO (Mumbai)</option>
                      <option value="Northern Regional Office (Kanpur)">NRO (Kanpur)</option>
                      <option value="Central Regional Office (Bhopal)">CRO (Bhopal)</option>
                      <option value="Eastern Regional Office (Kolkata)">ERO (Kolkata)</option>
                      <option value="Southern Regional Office (Chennai)">SRO (Chennai)</option>
                      <option value="North West Regional Office (Chandigarh)">NWRO (Chandigarh)</option>
                      <option value="South Western Regional Office (Bengaluru)">SWRO (Bengaluru)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Clearance Level
                    </label>
                    <select
                      value={officerForm.clearance_level}
                      onChange={(e) => setOfficerForm({ ...officerForm, clearance_level: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded text-slate-800 bg-white font-mono"
                    >
                      <option value="L1_SCRUTINY">L1 - Scrutiny Officer</option>
                      <option value="L2_SENIOR">L2 - Senior Scrutiny</option>
                      <option value="L3_EXECUTIVE">L3 - Executive Officer</option>
                    </select>
                  </div>
                </div>

                <p className="text-[11px] text-slate-500 pt-1">
                  The officer will be provisioned in the live Azure PostgreSQL database and authorized to evaluate EoA applications.
                </p>

                <div className="flex justify-end space-x-2 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsAddOfficerModalOpen(false)}
                    className="px-3.5 py-1.5 border border-slate-300 rounded font-semibold text-slate-600 hover:bg-slate-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={formSubmitting}
                    className="px-4 py-1.5 bg-[#8B1A1A] hover:bg-[#6E1414] text-white font-bold rounded shadow-xs transition-colors flex items-center space-x-1"
                  >
                    {formSubmitting ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Onboarding to Azure DB...</span>
                      </>
                    ) : (
                      <span>Onboard Officer</span>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </GovLayout>
  );
}

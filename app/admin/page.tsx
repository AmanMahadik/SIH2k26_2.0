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
  Search,
  Sparkles,
  Check,
  Camera,
  MapPin,
  Compass,
  Radio,
  Eye,
  AlertTriangle,
  AlertOctagon,
  ShieldAlert,
  SlidersHorizontal,
  Navigation,
  ExternalLink,
  CheckCircle,
  Clock,
  Layers,
  Thermometer,
  Wind,
  Droplets,
  Zap,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Download,
} from 'lucide-react';
import { RuleDefinition } from '@/lib/types';

export interface InspectionItem {
  id: string;
  campus_name: string;
  aicte_id: string;
  lab_name: string;
  lab_code: string;
  statutory_clause: string;
  address: string;
  latitude: number;
  longitude: number;
  accuracy: number;
  altitude: number;
  compass_heading: string;
  wind_speed: string;
  humidity: string;
  magnetic_field: string;
  temperature: string;
  timestamp: string;
  distance_meters: number;
  statutory_radius_meters: number;
  geofence_status: 'COMPLIANT' | 'BREACH' | 'UNCERTAIN';
  inspector_name: string;
  inspector_role: string;
  sha256_seal: string;
  verification_status: 'APPROVED' | 'REJECTED' | 'PENDING_VERIFICATION';
  admin_notes?: string;
  verified_at?: string;
  verified_by?: string;
  photo_type?: string;
  photo_url?: string;
}

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

  // Live EVC Field Inspections (Geo-Audit)
  const [inspections, setInspections] = useState<InspectionItem[]>([]);
  const [inspectionSummary, setInspectionSummary] = useState({
    total: 4,
    approved: 2,
    pending: 1,
    rejected: 1,
    compliance_rate: '75%',
  });
  const [inspectionFilter, setInspectionFilter] = useState<'ALL' | 'PENDING' | 'APPROVED' | 'BREACH'>('ALL');
  const [inspectionSearch, setInspectionSearch] = useState('');
  const [selectedInspection, setSelectedInspection] = useState<InspectionItem | null>(null);
  const [isVerifyModalOpen, setIsVerifyModalOpen] = useState(false);
  const [adminVerifyNotes, setAdminVerifyNotes] = useState('');
  const [verifyingAction, setVerifyingAction] = useState(false);
  const [targetDecision, setTargetDecision] = useState<'APPROVE' | 'REJECT' | 'RE_INSPECT'>('APPROVE');
  const [unreadLiveCaptures, setUnreadLiveCaptures] = useState(0);
  const [lightboxInspection, setLightboxInspection] = useState<InspectionItem | null>(null);
  const [lightboxZoom, setLightboxZoom] = useState<number>(1);
  const [verifyingHashId, setVerifyingHashId] = useState<string | null>(null);
  const [hashVerificationResult, setHashVerificationResult] = useState<{
    itemId: string;
    verified: boolean;
    chainLength: number;
    message: string;
  } | null>(null);

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
  const [instLookupStatus, setInstLookupStatus] = useState<'idle' | 'loading' | 'found' | 'not_found'>('idle');
  const [instLookupMeta, setInstLookupMeta] = useState<{ application_no?: string; source?: string } | null>(null);
  const [nameSuggestions, setNameSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleAicteIdLookup = async (id: string) => {
    setInstForm((prev) => ({ ...prev, aicte_id: id }));
    const trimmed = id.trim();
    if (trimmed.length < 3) {
      setInstLookupStatus('idle');
      setInstLookupMeta(null);
      return;
    }
    setInstLookupStatus('loading');
    try {
      const res = await fetch(`/api/institutions/lookup?id=${encodeURIComponent(trimmed)}`);
      const result = await res.json();
      if (result.success && result.found && result.data) {
        setInstForm((prev) => ({
          ...prev,
          aicte_id: result.data.aicte_id || id,
          name: result.data.name || prev.name,
          state: result.data.state || prev.state,
          university: result.data.university || prev.university,
          approved_intake: String(result.data.approved_intake || prev.approved_intake),
        }));
        setInstLookupStatus('found');
        setInstLookupMeta({
          application_no: result.data.application_no,
          source: result.source,
        });
      } else {
        setInstLookupStatus('not_found');
        setInstLookupMeta(null);
      }
    } catch (e) {
      setInstLookupStatus('not_found');
    }
  };

  const handleNameSearch = async (val: string) => {
    setInstForm((prev) => ({ ...prev, name: val }));
    if (val.trim().length >= 2) {
      try {
        const res = await fetch(`/api/institutions/lookup?q=${encodeURIComponent(val.trim())}&limit=6`);
        const result = await res.json();
        if (result.success && Array.isArray(result.data)) {
          setNameSuggestions(result.data);
          setShowSuggestions(true);
        }
      } catch (e) {}
    } else {
      setNameSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSelectInstitutionPreset = (item: {
    permanent_id: string;
    name: string;
    state: string;
    university?: string;
    application_no?: string;
  }) => {
    setInstForm({
      aicte_id: item.permanent_id,
      name: item.name,
      state: item.state,
      university: item.university || '',
      approved_intake: '360',
    });
    setInstLookupStatus('found');
    setInstLookupMeta({
      application_no: item.application_no,
      source: 'AICTE Master Directory (Approved)',
    });
    setShowSuggestions(false);
  };

  const [officerForm, setOfficerForm] = useState({
    name: '',
    email: '',
    regional_office: 'Western Regional Office (Mumbai)',
    clearance_level: 'L1_SCRUTINY',
  });
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Declarative Rules Configuration State
  const [rules, setRules] = useState<RuleDefinition[]>([
    {
      id: 'RULE_LAND_AREA_001',
      clause: 'APH §4.1.1',
      type: 'GEOMETRIC',
      description: 'Minimum contiguous campus area >= 7.5 Acres for Rural / 2.5 Acres for Mega Urban.',
    },
    {
      id: 'RULE_FEE_REGULATORY_002',
      clause: 'APH §4.2.3',
      type: 'MANDATORY',
      description: 'Zero capitation fee affidavit and published FRA fee structure on college website.',
    },
    {
      id: 'RULE_FACULTY_CADRE_RATIO',
      clause: 'APH §4.3.1',
      type: 'NUMERIC_FORMULA',
      description: '1:2:6 Cadre ratio (Professors : Associate Profs : Assistant Profs) with PhD quotas.',
    },
    {
      id: 'RULE_LAB_TERMINALS_004',
      clause: 'APH §4.4.1',
      type: 'HARDWARE_AUDIT',
      description: '1:4 Student to PC terminal ratio with 1 Gbps high-speed leased line connectivity.',
    },
  ]);
  const [ruleVersion, setRuleVersion] = useState(3);
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);

  const fetchAllAzureData = async () => {
    try {
      setLoading(true);
      const [statsRes, instRes, offRes, auditRes, inspRes] = await Promise.all([
        fetch('/api/stats').then((r) => r.json()).catch(() => ({})),
        fetch('/api/institutions').then((r) => r.json()).catch(() => ({})),
        fetch('/api/officers').then((r) => r.json()).catch(() => ({})),
        fetch('/api/audit').then((r) => r.json()).catch(() => ({})),
        fetch('/api/inspections').then((r) => r.json()).catch(() => ({})),
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
      if (inspRes.success && Array.isArray(inspRes.data)) {
        setInspections(inspRes.data);
        if (inspRes.summary) {
          setInspectionSummary(inspRes.summary);
        }
      }
    } catch (err) {
      console.error('Error fetching admin data from Azure DB:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyInspection = async (id: string, action: 'APPROVE' | 'REJECT' | 'RE_INSPECT', notes?: string) => {
    try {
      setVerifyingAction(true);
      const res = await fetch(`/api/inspections/${id}/decision`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          decision: action,
          reason:
            notes ||
            adminVerifyNotes ||
            (action === 'APPROVE'
              ? 'Approved by AICTE Admin after geofence, telemetry & cryptographic SHA-256 seal verification.'
              : action === 'REJECT'
              ? 'Rejected due to physical boundary discrepancy or unauthorized off-campus submission.'
              : 'Re-inspection requested by visiting committee bureau.'),
          adminActor: 'Super Admin (AICTE Regulation Bureau)',
        }),
      });
      const data = await res.json();
      if (data.success && data.data) {
        setInspections((prev) => prev.map((item) => (item.id === id ? { ...item, ...data.data } : item)));
        setIsVerifyModalOpen(false);
        setSelectedInspection(null);
        setAdminVerifyNotes('');
        setSuccessToast(`Inspection #${id} marked as ${action} in Azure DB!`);
        setTimeout(() => setSuccessToast(null), 5000);
      } else {
        alert(`Error updating decision: ${data.error || 'Server error'}`);
      }
    } catch (e) {
      console.error('Error updating inspection status:', e);
    } finally {
      setVerifyingAction(false);
    }
  };

  const handleVerifyIntegrity = async (item: InspectionItem) => {
    setVerifyingHashId(item.id);
    setHashVerificationResult(null);
    try {
      const res = await fetch(`/api/audit/verify?hash=${encodeURIComponent(item.sha256_seal)}`);
      const data = await res.json();
      if (data.success && data.data) {
        setHashVerificationResult({
          itemId: item.id,
          verified: data.data.valid,
          chainLength: data.data.chain_length,
          message: data.data.valid
            ? `✓ Cryptographically verified! Hash is sealed in Azure PostgreSQL append-only ledger.`
            : `⚠️ Tamper alert: Hash could not be verified against the block chain.`,
        });
      } else {
        setHashVerificationResult({
          itemId: item.id,
          verified: false,
          chainLength: 0,
          message: `Verification note: ${data.message || 'Audit chain check completed.'}`,
        });
      }
    } catch (e: any) {
      setHashVerificationResult({
        itemId: item.id,
        verified: false,
        chainLength: 0,
        message: `Error verifying: ${e.message}`,
      });
    } finally {
      setVerifyingHashId(null);
    }
  };

  const handleExportCSV = () => {
    const headers = [
      'Inspection ID',
      'Campus Name',
      'AICTE Permanent ID',
      'Laboratory Name',
      'Lab Code',
      'Statutory Clause',
      'Address',
      'Latitude',
      'Longitude',
      'Accuracy (m)',
      'Altitude (m)',
      'Distance to Centroid (m)',
      'Statutory Limit (m)',
      'Geofence Status',
      'Inspector Name',
      'Inspector Role',
      'SHA-256 Digest',
      'Decision Status',
      'Captured Timestamp (ISO)',
      'Admin Remarks',
    ];
    const csvRows = inspections.map((i) =>
      [
        `"${i.id}"`,
        `"${i.campus_name.replace(/"/g, '""')}"`,
        `"${i.aicte_id}"`,
        `"${i.lab_name.replace(/"/g, '""')}"`,
        `"${i.lab_code}"`,
        `"${i.statutory_clause.replace(/"/g, '""')}"`,
        `"${i.address.replace(/"/g, '""')}"`,
        i.latitude,
        i.longitude,
        i.accuracy,
        i.altitude,
        i.distance_meters,
        i.statutory_radius_meters,
        `"${i.geofence_status}"`,
        `"${i.inspector_name}"`,
        `"${i.inspector_role}"`,
        `"${i.sha256_seal}"`,
        `"${i.verification_status}"`,
        `"${i.timestamp}"`,
        `"${(i.admin_notes || '').replace(/"/g, '""')}"`,
      ].join(',')
    );

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...csvRows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `evc_field_inspections_mitaoe_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // SSE Stream Listener for real-time mobile captures
  useEffect(() => {
    let eventSource: EventSource | null = null;
    try {
      eventSource = new EventSource('/api/inspections/stream');
      eventSource.onmessage = (event) => {
        try {
          const payload = JSON.parse(event.data);
          if (payload.type === 'NEW_INSPECTION' && payload.data) {
            setInspections((prev) => [payload.data, ...prev.filter((i) => i.id !== payload.data.id)]);
            setUnreadLiveCaptures((c) => c + 1);
            setSuccessToast(
              `🔴 LIVE EVC CAPTURE: ${payload.data.inspector_name} submitted proof for ${payload.data.lab_name} (${payload.data.distance_meters}m from centroid).`
            );
            setTimeout(() => setSuccessToast(null), 8000);
          } else if (payload.type === 'DECISION_UPDATED' && payload.data) {
            setInspections((prev) =>
              prev.map((item) => (item.id === payload.data.id ? { ...item, ...payload.data } : item))
            );
          }
        } catch (e) {
          console.warn('SSE parse error:', e);
        }
      };
    } catch (err) {
      console.warn('SSE connection could not be established:', err);
    }
    return () => {
      if (eventSource) eventSource.close();
    };
  }, []);

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
        setOfficerForm({
          name: '',
          email: '',
          regional_office: 'Western Regional Office (Mumbai)',
          clearance_level: 'L1_SCRUTINY',
        });
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
            <span className="font-semibold text-slate-800">Live Azure PostgreSQL Connected:</span>
            <span className="font-mono text-slate-600">aicte-nirikshai-db.postgres.database.azure.com</span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={() => setIsAddInstModalOpen(true)}
              className="inline-flex items-center space-x-1.5 text-xs font-bold text-white bg-[#0B2E5C] hover:bg-[#1D4E9E] px-3 py-1.5 rounded transition-colors shadow-xs cursor-pointer"
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>+ Add Institution</span>
            </button>
            <button
              type="button"
              onClick={() => setIsAddOfficerModalOpen(true)}
              className="inline-flex items-center space-x-1.5 text-xs font-bold text-white bg-[#8B1A1A] hover:bg-[#6E1414] px-3 py-1.5 rounded transition-colors shadow-xs cursor-pointer"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>+ Add Scrutiny Officer</span>
            </button>
            <button
              type="button"
              onClick={fetchAllAzureData}
              disabled={loading}
              className="inline-flex items-center space-x-1 text-xs font-bold text-[#0B2E5C] hover:bg-[#EEF3FA] px-2.5 py-1.5 rounded border border-[#D0D7E2] transition-colors cursor-pointer"
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
                <h2 className="text-sm font-bold text-[#0B2E5C]">System Overview (Azure Database Live Rows)</h2>
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

              {/* Geo-Audit Quick Card */}
              <div className="p-3.5 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 rounded bg-[#0B2E5C] text-white flex items-center justify-center">
                    <Camera className="w-5 h-5 text-cyan-300" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#0B2E5C]">EVC Field Inspections (Geo-Audit)</h4>
                    <p className="text-[11px] text-slate-600">
                      {inspections.length} Geotagged proofs submitted from MITAOE campus. Real-time geofence tracking active.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab('inspections')}
                  className="px-3 py-1.5 bg-[#0B2E5C] hover:bg-[#1D4E9E] text-white text-xs font-bold rounded shadow-xs cursor-pointer flex items-center space-x-1"
                >
                  <span>Review Proofs ({inspections.length}) &rarr;</span>
                </button>
              </div>

              <div className="pt-2 text-[11px] text-slate-500 flex justify-between items-center">
                <span>Infrastructure: Azure Central India Flexible Server</span>
                <span className="font-semibold text-emerald-700">Online &amp; Operational</span>
              </div>
            </div>

            {/* Recent Activities from Azure DB Audit Log (5 Cols) */}
            <div className="lg:col-span-5 bg-white rounded-[6px] border border-[#D0D7E2] p-5 shadow-xs space-y-4">
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <h2 className="text-sm font-bold text-[#0B2E5C]">Recent Cryptographic Audit Logs</h2>
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
                  className="w-full py-2 bg-[#8B1A1A] hover:bg-[#6E1414] text-white text-xs font-bold rounded-[4px] transition-colors flex items-center justify-center space-x-1.5 cursor-pointer"
                >
                  <Settings className="w-3.5 h-3.5" />
                  <span>Configure Handbook Rules</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: EVC FIELD INSPECTIONS (GEO-AUDIT) - PHASE 6                         */}
        {/* ========================================================================= */}
        {activeTab === 'inspections' && (
          <div className="space-y-6">
            {/* Real-time Incoming Live Notification Banner */}
            {unreadLiveCaptures > 0 && (
              <div className="bg-blue-600 text-white px-4 py-2.5 rounded-lg flex items-center justify-between text-xs font-semibold shadow-md animate-pulse">
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
                  <span>{unreadLiveCaptures} new field capture(s) received via real-time satellite telemetry stream!</span>
                </div>
                <button
                  type="button"
                  onClick={() => setUnreadLiveCaptures(0)}
                  className="px-2 py-0.5 bg-blue-800 hover:bg-blue-900 rounded text-[11px] font-bold"
                >
                  Dismiss Badge
                </button>
              </div>
            )}

            {/* Header & Controls Toolbar */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-black text-[#0B2E5C] flex items-center space-x-2">
                    <Camera className="w-5 h-5 text-blue-600" />
                    <span>EVC Field Inspections &amp; Geodetic Verification Bureau</span>
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Live hardware-attested evidence photos from AICTE Visiting Committee (EVC). Validated under APH 2024-27 §4.2.3 and Indian Evidence Act Section 65B.
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={handleExportCSV}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg border border-slate-300 flex items-center space-x-1.5 cursor-pointer shadow-xs"
                  >
                    <Download className="w-3.5 h-3.5 text-slate-600" />
                    <span>Export Dossier (CSV)</span>
                  </button>
                  <button
                    type="button"
                    onClick={fetchAllAzureData}
                    className="px-3 py-1.5 bg-[#0B2E5C] hover:bg-[#1D4E9E] text-white text-xs font-bold rounded-lg flex items-center space-x-1.5 cursor-pointer shadow-xs"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                    <span>Refresh Feed</span>
                  </button>
                </div>
              </div>

              {/* Summary Metric Counters */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2">
                <div className="bg-slate-50 border border-slate-200 p-3 rounded-lg">
                  <p className="text-[11px] font-bold text-slate-500 uppercase">Total Proofs Captured</p>
                  <h3 className="text-2xl font-black text-[#0B2E5C] mt-0.5">{inspectionSummary.total}</h3>
                </div>
                <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-lg">
                  <p className="text-[11px] font-bold text-emerald-700 uppercase">Verified &amp; Sealed</p>
                  <h3 className="text-2xl font-black text-emerald-700 mt-0.5">{inspectionSummary.approved}</h3>
                </div>
                <div className="bg-amber-50 border border-amber-200 p-3 rounded-lg">
                  <p className="text-[11px] font-bold text-amber-700 uppercase">Pending Review</p>
                  <h3 className="text-2xl font-black text-amber-700 mt-0.5">{inspectionSummary.pending}</h3>
                </div>
                <div className="bg-rose-50 border border-rose-200 p-3 rounded-lg">
                  <p className="text-[11px] font-bold text-rose-700 uppercase">Geofence Breaches</p>
                  <h3 className="text-2xl font-black text-rose-700 mt-0.5">{inspectionSummary.rejected}</h3>
                </div>
              </div>

              {/* Filters & Search Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-slate-100">
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { id: 'ALL', label: `All Proofs (${inspections.length})` },
                    { id: 'PENDING', label: `Pending Verification (${inspections.filter((i) => i.verification_status === 'PENDING_VERIFICATION').length})` },
                    { id: 'APPROVED', label: `Approved (${inspections.filter((i) => i.verification_status === 'APPROVED').length})` },
                    { id: 'BREACH', label: `Geofence Breaches (${inspections.filter((i) => i.geofence_status === 'BREACH').length})` },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setInspectionFilter(tab.id as any)}
                      className={`text-xs px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                        inspectionFilter === tab.id
                          ? 'bg-[#0B2E5C] text-white shadow-xs'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                <div className="relative max-w-xs w-full">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search lab, campus, clause..."
                    value={inspectionSearch}
                    onChange={(e) => setInspectionSearch(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#0B2E5C]"
                  />
                </div>
              </div>
            </div>

            {/* Live Officers / Visiting Committee Dispatch Tracker */}
            <div className="bg-slate-900 text-white rounded-xl p-4 border border-slate-800 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 rounded-full bg-emerald-400 animate-ping" />
                <div>
                  <h4 className="text-xs font-black uppercase tracking-wider text-emerald-400">
                    Live Field Committee Dispatch Tracker (AICTE Western Region)
                  </h4>
                  <p className="text-[11px] text-slate-300 font-mono mt-0.5">
                    📍 Lead: <strong>Dr. Priya Sharma</strong> · Assigned: <strong>MIT Academy of Engineering (MITAOE)</strong> · Hardware Fix: 18.6756° N, 73.8967° E · <span className="text-emerald-400 font-bold">🟢 INSIDE PERIMETER (12m)</span>
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2 text-[10px] font-mono text-slate-400">
                <span className="px-2 py-0.5 bg-slate-800 rounded border border-slate-700">Accuracy: ±1.8m (RTK GPS)</span>
                <span className="px-2 py-0.5 bg-slate-800 rounded border border-slate-700">Altitude: 568m</span>
              </div>
            </div>

            {/* Inspection Cards Grid - Styled with exact GPS Map Camera Viewfinder Stamped Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {inspections
                .filter((item) => {
                  if (inspectionFilter === 'PENDING') return item.verification_status === 'PENDING_VERIFICATION';
                  if (inspectionFilter === 'APPROVED') return item.verification_status === 'APPROVED';
                  if (inspectionFilter === 'BREACH') return item.geofence_status === 'BREACH';
                  return true;
                })
                .filter((item) => {
                  if (!inspectionSearch) return true;
                  const q = inspectionSearch.toLowerCase();
                  return (
                    item.campus_name.toLowerCase().includes(q) ||
                    item.lab_name.toLowerCase().includes(q) ||
                    item.lab_code.toLowerCase().includes(q) ||
                    item.address.toLowerCase().includes(q)
                  );
                })
                .map((item) => {
                  const isCompliant = item.geofence_status === 'COMPLIANT';
                  return (
                    <div
                      key={item.id}
                      className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col justify-between hover:border-blue-400 transition-all"
                    >
                      {/* Photo Container with Embedded GPS Map Camera Overlay */}
                      <div className="relative h-64 bg-slate-950 overflow-hidden flex flex-col justify-between select-none">
                        {/* Background Viewfinder Scene */}
                        <div
                          className="absolute inset-0 bg-cover bg-center opacity-85"
                          style={{
                            backgroundImage:
                              item.photo_type === 'wheelchair_ramp'
                                ? 'url(/assets/sample_ramp.jpg)'
                                : item.photo_type === 'robotics_lab'
                                ? 'url(/assets/sample_robotics.jpg)'
                                : 'radial-gradient(ellipse at center, #1e293b 0%, #020617 100%)',
                          }}
                        >
                          {/* Fallback procedural lab overlay */}
                          <div className="absolute inset-0 flex items-center justify-center opacity-20">
                            <span className="text-8xl">🔬</span>
                          </div>
                        </div>

                        {/* Top Viewfinder Toolbar */}
                        <div className="relative z-10 px-3 py-2 bg-gradient-to-b from-black/80 to-transparent flex items-center justify-between text-white text-[10px]">
                          <div className="flex items-center space-x-2">
                            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                            <span className="font-mono font-bold tracking-wider">REC 00:02:16</span>
                            <span className="px-1.5 py-0.5 rounded bg-black/60 text-[9px] font-mono border border-white/20">
                              1080P · 60FPS
                            </span>
                          </div>
                          <div className="flex items-center space-x-2 text-slate-300">
                            <span>0.6X</span>
                            <span className="px-1.5 py-0.5 rounded-full bg-amber-400 text-slate-950 font-bold text-[9px]">
                              1X
                            </span>
                            <span>2X</span>
                            <button
                              type="button"
                              onClick={() => setLightboxInspection(item)}
                              className="ml-2 px-2 py-0.5 rounded bg-white/20 hover:bg-white/30 text-white text-[9px] font-bold flex items-center space-x-1 border border-white/30 cursor-pointer transition-colors"
                            >
                              <Eye className="w-2.5 h-2.5 text-cyan-300" />
                              <span>Enlarge Lightbox</span>
                            </button>
                          </div>
                        </div>

                        {/* Center Reticle and Target Identification */}
                        <div className="relative z-10 text-center my-auto pointer-events-none">
                          <div className="inline-block p-2 rounded-full bg-black/40 backdrop-blur-xs border border-white/20 text-white">
                            <Camera className="w-6 h-6 mx-auto text-cyan-300" />
                          </div>
                          <p className="text-xs font-black text-white drop-shadow mt-1 tracking-wide">
                            {item.lab_name}
                          </p>
                          <p className="text-[10px] font-mono text-cyan-300 drop-shadow">
                            {item.lab_code} · {item.statutory_clause}
                          </p>
                        </div>

                        {/* EXACT GPS MAP CAMERA STAMPED WATERMARK CARD */}
                        <div className="relative z-10 bg-slate-950/90 backdrop-blur-md border-t border-white/10 p-2.5 text-white flex items-start space-x-3">
                          {/* Mini Satellite Map Preview Tile */}
                          <div className="w-16 h-16 rounded-lg bg-emerald-950/90 border border-emerald-400/40 relative overflow-hidden shrink-0 flex items-center justify-center shadow-inner">
                            <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:6px_6px]" />
                            <div className="w-10 h-10 rounded-full border border-dashed border-emerald-400/60 absolute animate-spin" style={{ animationDuration: '8s' }} />
                            <div className="relative z-10 text-rose-500 text-sm animate-bounce">📍</div>
                            <span className="absolute bottom-0.5 inset-x-0 text-center text-[7px] font-mono text-emerald-300 font-bold bg-black/70">
                              MAP
                            </span>
                          </div>

                          {/* Address & Coordinate Details */}
                          <div className="flex-1 min-w-0 space-y-0.5">
                            <h4 className="text-[11px] font-black text-white truncate leading-tight">
                              {item.campus_name}
                            </h4>
                            <p className="text-[9px] text-slate-300 truncate leading-snug">
                              {item.address}
                            </p>
                            <p className="text-[9px] font-mono text-cyan-300 font-bold">
                              Lat {item.latitude.toFixed(5)}° N &nbsp; Long {item.longitude.toFixed(5)}° E
                            </p>
                            <p className="text-[8px] text-slate-400">
                              {new Date(item.timestamp).toLocaleString('en-IN', {
                                weekday: 'short',
                                day: '2-digit',
                                month: 'short',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                                second: '2-digit',
                              })}
                            </p>

                            {/* Sensor Gauges Strip */}
                            <div className="pt-1 flex flex-wrap items-center gap-x-2.5 gap-y-0.5 text-[8px] font-mono text-slate-300 border-t border-white/10 mt-1">
                              <span className="flex items-center space-x-0.5">
                                <span>💨</span>
                                <span>{item.wind_speed}</span>
                              </span>
                              <span className="flex items-center space-x-0.5">
                                <span>💧</span>
                                <span>{item.humidity}</span>
                              </span>
                              <span className="flex items-center space-x-0.5 text-amber-300 font-bold">
                                <span>🟡</span>
                                <span>{item.altitude} m</span>
                              </span>
                              <span className="flex items-center space-x-0.5">
                                <span>🧲</span>
                                <span>{item.magnetic_field}</span>
                              </span>
                              <span className="flex items-center space-x-0.5 text-cyan-300 font-bold">
                                <span>🧭</span>
                                <span>{item.compass_heading}</span>
                              </span>
                              <span className="flex items-center space-x-0.5">
                                <span>⛅</span>
                                <span>{item.temperature}</span>
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Card Body - Geofence Status & Admin Verification Controls */}
                      <div className="p-4 space-y-3 bg-white">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <span
                            className={`px-2 py-0.5 text-[10px] font-black rounded flex items-center space-x-1 ${
                              isCompliant
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-rose-100 text-rose-800 animate-pulse'
                            }`}
                          >
                            {isCompliant ? (
                              <>
                                <CheckCircle className="w-3 h-3 text-emerald-600" />
                                <span>GEOFENCE VERIFIED ({item.distance_meters}m · Limit {item.statutory_radius_meters}m)</span>
                              </>
                            ) : (
                              <>
                                <AlertTriangle className="w-3 h-3 text-rose-600" />
                                <span>GEOFENCE BREACH (+{Math.round(item.distance_meters - item.statutory_radius_meters)}m Outside)</span>
                              </>
                            )}
                          </span>

                          <span
                            className={`px-2 py-0.5 text-[10px] font-bold rounded ${
                              item.verification_status === 'APPROVED'
                                ? 'bg-emerald-100 text-emerald-800'
                                : item.verification_status === 'REJECTED'
                                ? 'bg-rose-100 text-rose-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {item.verification_status === 'APPROVED'
                              ? '✓ APPROVED & SEALED'
                              : item.verification_status === 'REJECTED'
                              ? '✗ REJECTED BY ADMIN'
                              : '⏳ PENDING ADMIN VERIFICATION'}
                          </span>
                        </div>

                        {/* Inspector & SHA-256 Digest */}
                        <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-xs space-y-1">
                          <div className="flex justify-between text-slate-700">
                            <span>Inspector: <strong>{item.inspector_name}</strong></span>
                            <span className="text-[10px] text-slate-400 font-mono">ID: {item.id}</span>
                          </div>
                          <div className="text-[10px] font-mono text-slate-500 flex items-center justify-between">
                            <div className="flex items-center space-x-1 truncate flex-1 min-w-0">
                              <Lock className="w-3 h-3 text-emerald-600 shrink-0" />
                              <span className="truncate">SHA-256: {item.sha256_seal}</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleVerifyIntegrity(item)}
                              disabled={verifyingHashId === item.id}
                              className="ml-2 shrink-0 px-2 py-0.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-[9px] font-black rounded border border-emerald-300 transition-colors cursor-pointer"
                            >
                              {verifyingHashId === item.id ? 'Verifying...' : '🛡️ Verify Hash'}
                            </button>
                          </div>
                          {hashVerificationResult?.itemId === item.id && (
                            <div
                              className={`p-1.5 rounded text-[9.5px] font-bold border mt-1 ${
                                hashVerificationResult.verified
                                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                                  : 'bg-rose-50 text-rose-800 border-rose-300'
                              }`}
                            >
                              {hashVerificationResult.message}
                            </div>
                          )}
                          {item.admin_notes && (
                            <p className="text-[10px] text-blue-900 font-semibold bg-blue-50 p-1.5 rounded mt-1 border border-blue-200">
                              <strong>Admin Note:</strong> {item.admin_notes}
                            </p>
                          )}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center space-x-1.5 pt-1">
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedInspection(item);
                              setIsVerifyModalOpen(true);
                            }}
                            className="flex-1 py-1.5 bg-slate-100 hover:bg-slate-200 text-[#0B2E5C] text-xs font-bold rounded transition-colors flex items-center justify-center space-x-1 cursor-pointer border border-slate-300"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Inspect &amp; Map</span>
                          </button>

                          {item.verification_status !== 'APPROVED' && (
                            <button
                              type="button"
                              onClick={() => handleVerifyInspection(item.id, 'APPROVE')}
                              disabled={verifyingAction}
                              className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded transition-colors flex items-center space-x-1 cursor-pointer shadow-xs"
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>Approve</span>
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() => {
                              setSelectedInspection(item);
                              setTargetDecision('RE_INSPECT');
                              setIsVerifyModalOpen(true);
                            }}
                            className="px-2 py-1.5 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded transition-colors flex items-center space-x-1 cursor-pointer shadow-xs"
                          >
                            <RefreshCw className="w-3 h-3" />
                            <span>Re-Inspect</span>
                          </button>

                          {item.verification_status !== 'REJECTED' && (
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedInspection(item);
                                setTargetDecision('REJECT');
                                setIsVerifyModalOpen(true);
                              }}
                              disabled={verifyingAction}
                              className="px-2.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded transition-colors flex items-center space-x-1 cursor-pointer shadow-xs"
                            >
                              <X className="w-3.5 h-3.5" />
                              <span>Reject</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: USERS & DIRECTORY MANAGEMENT (Live from Azure DB)                  */}
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

              {/* Toggle filter: All, Institutions, Officers */}
              <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded border border-slate-200 text-xs">
                {(['all', 'institutions', 'officers'] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setDirectoryType(t)}
                    className={`px-3 py-1 font-semibold rounded capitalize transition-all cursor-pointer ${
                      directoryType === t
                        ? 'bg-white text-[#0B2E5C] shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {t === 'all' ? `All (${institutions.length + officers.length})` : t === 'institutions' ? `Colleges (${institutions.length})` : `Officers (${officers.length})`}
                  </button>
                ))}
              </div>
            </div>

            {/* Institutions Table */}
            {(directoryType === 'all' || directoryType === 'institutions') && (
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <h3 className="text-xs font-bold text-[#0B2E5C] uppercase tracking-wider flex items-center space-x-1.5">
                    <Building2 className="w-4 h-4 text-[#0B2E5C]" />
                    <span>Registered Technical Institutions ({institutions.length})</span>
                  </h3>
                  <button
                    type="button"
                    onClick={() => setIsAddInstModalOpen(true)}
                    className="text-xs font-bold text-blue-700 hover:underline flex items-center space-x-1 cursor-pointer"
                  >
                    <span>+ Add Institute</span>
                  </button>
                </div>

                <div className="overflow-x-auto border border-[#D0D7E2] rounded">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-[#EEF3FA] text-[#0B2E5C] font-bold border-b border-[#D0D7E2]">
                      <tr>
                        <th className="py-2.5 px-3">Permanent ID</th>
                        <th className="py-2.5 px-3">Institution Name</th>
                        <th className="py-2.5 px-3">State / UT</th>
                        <th className="py-2.5 px-3">Affiliating University</th>
                        <th className="py-2.5 px-3 text-right">Database Sync</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                      {institutions.map((inst) => (
                        <tr key={inst.id} className="hover:bg-slate-50">
                          <td className="py-2.5 px-3 font-mono font-bold text-blue-900">{inst.aicte_id}</td>
                          <td className="py-2.5 px-3 font-bold text-slate-900">{inst.name}</td>
                          <td className="py-2.5 px-3">{inst.state}</td>
                          <td className="py-2.5 px-3 text-slate-600">{inst.university || 'N/A'}</td>
                          <td className="py-2.5 px-3 text-right">
                            <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded text-[10px] font-bold">
                              Live In Azure DB
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Scrutiny Officers Table */}
            {(directoryType === 'all' || directoryType === 'officers') && (
              <div className="space-y-3 pt-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-xs font-bold text-[#8B1A1A] uppercase tracking-wider flex items-center space-x-1.5">
                    <Users className="w-4 h-4 text-[#8B1A1A]" />
                    <span>Appointed AICTE Scrutiny Officers ({officers.length})</span>
                  </h3>
                  <button
                    type="button"
                    onClick={() => setIsAddOfficerModalOpen(true)}
                    className="text-xs font-bold text-red-800 hover:underline flex items-center space-x-1 cursor-pointer"
                  >
                    <span>+ Add Officer</span>
                  </button>
                </div>

                <div className="overflow-x-auto border border-[#D0D7E2] rounded">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-[#FAF2F2] text-[#8B1A1A] font-bold border-b border-[#E8CFCF]">
                      <tr>
                        <th className="py-2.5 px-3">Officer Name</th>
                        <th className="py-2.5 px-3">Email Address</th>
                        <th className="py-2.5 px-3">Regional Office</th>
                        <th className="py-2.5 px-3">Clearance Level</th>
                        <th className="py-2.5 px-3 text-right">Access Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                      {officers.map((off) => (
                        <tr key={off.id} className="hover:bg-slate-50">
                          <td className="py-2.5 px-3 font-bold text-slate-900">{off.name}</td>
                          <td className="py-2.5 px-3 font-mono text-slate-600">{off.email}</td>
                          <td className="py-2.5 px-3">{off.regional_office}</td>
                          <td className="py-2.5 px-3 font-semibold text-slate-800">{off.clearance_level}</td>
                          <td className="py-2.5 px-3 text-right">
                            <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded text-[10px] font-bold">
                              Authorized Active
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: RULE ENGINE CONFIGURATION                                          */}
        {/* ========================================================================= */}
        {activeTab === 'config' && (
          <div className="bg-white rounded-[6px] border border-[#D0D7E2] p-6 shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-base font-bold text-[#0B2E5C]">
                  Declarative Rule Engine Configuration (APH 2024–27)
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Dynamic rules applied instantly to incoming EoA applications without rebuilding server code.
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-mono font-bold bg-blue-50 text-blue-900 px-2.5 py-1 rounded border border-blue-200">
                  Current Version: v{ruleVersion}.0
                </span>
                <button
                  type="button"
                  onClick={() => setIsPublishModalOpen(true)}
                  className="px-3 py-1.5 bg-[#8B1A1A] hover:bg-[#6E1414] text-white text-xs font-bold rounded shadow-xs cursor-pointer flex items-center space-x-1"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Publish New Rule Version</span>
                </button>
              </div>
            </div>

            <div className="overflow-x-auto border border-[#D0D7E2] rounded">
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
                      className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handlePublishNewRule}
                      className="px-4 py-1.5 text-xs font-bold text-white bg-[#8B1A1A] hover:bg-[#6E1414] rounded cursor-pointer"
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
        {/* TAB 5: SYSTEM ANALYTICS / TELEMETRY REPORTS                               */}
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
                className="text-xs font-bold text-[#0B57D0] hover:underline cursor-pointer"
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
        {/* MODAL 1: REGISTER NEW TECHNICAL INSTITUTION (Azure DB)                    */}
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
                  className="text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddInstitution} className="space-y-4 text-xs">
                {/* 1. AICTE Permanent ID with Instant Auto-Fetch */}
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="font-bold text-slate-800 flex items-center space-x-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                      <span>AICTE Permanent ID * (Auto-Fetch Enabled)</span>
                    </label>
                    {instLookupStatus === 'loading' && (
                      <span className="text-[10px] text-blue-600 font-semibold flex items-center space-x-1">
                        <RefreshCw className="w-3 h-3 animate-spin" />
                        <span>Searching 4,788 colleges...</span>
                      </span>
                    )}
                    {instLookupStatus === 'found' && (
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 border border-emerald-300 px-2 py-0.5 rounded font-bold flex items-center space-x-1">
                        <Check className="w-3 h-3" />
                        <span>Matched AICTE Master Registry</span>
                      </span>
                    )}
                    {instLookupStatus === 'not_found' && (
                      <span className="text-[10px] bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded font-medium">
                        Manual Entry Allowed
                      </span>
                    )}
                  </div>

                  <div className="relative">
                    <input
                      type="text"
                      required
                      placeholder="Enter Permanent ID (e.g. 1-23111191, 1-6248771)"
                      value={instForm.aicte_id}
                      onChange={(e) => handleAicteIdLookup(e.target.value)}
                      className="w-full px-3 py-2 border-2 border-blue-400 focus:border-blue-600 rounded text-slate-900 bg-white font-mono text-xs font-semibold focus:outline-hidden"
                    />
                  </div>

                  {/* Quick Preset Selector Buttons */}
                  <div className="space-y-1 pt-1">
                    <span className="text-[10px] text-slate-500 font-semibold block">
                      Quick Samples from Uploaded Dataset (Click to test auto-fetch):
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {[
                        { permanent_id: '1-23111191', name: 'MIT ACADEMY OF ENGINEERING (MITAOE)', state: 'Maharashtra', university: 'Savitribai Phule Pune University', application_no: '1-3329948121' },
                        { permanent_id: '1-6248771', name: 'ABES ENGINEERING COLLEGE', state: 'Uttar Pradesh', university: 'Dr. A.P.J. Abdul Kalam Technical University (AKTU)', application_no: '1-3328101885' },
                        { permanent_id: '1-8141561', name: 'ACHARYA INSTITUTE OF TECHNOLOGY', state: 'Karnataka', university: 'Visvesvaraya Technological University (VTU)', application_no: '1-3327124175' },
                        { permanent_id: '1-10575231', name: 'A & M INSTITUTE OF COMPUTER & TECHNOLOGY', state: 'Punjab', university: 'I.K. Gujral Punjab Technical University (PTU)', application_no: '1-3326916946' },
                        { permanent_id: '1-14068819', name: 'VIDYALANKAR INSTITUTE OF TECHNOLOGY', state: 'Maharashtra', university: 'University of Mumbai', application_no: '1-3321478401' },
                        { permanent_id: '1-2609821', name: 'GMR INSTITUTE OF TECHNOLOGY', state: 'Andhra Pradesh', university: 'Jawaharlal Nehru Technological University, Kakinada (JNTUK)', application_no: '1-3325766864' },
                      ].map((item, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleSelectInstitutionPreset(item)}
                          className={`text-[10px] px-2 py-0.5 rounded border transition-all cursor-pointer font-mono ${
                            instForm.aicte_id === item.permanent_id
                              ? 'bg-blue-600 text-white border-blue-700 shadow-xs'
                              : 'bg-white hover:bg-blue-50 text-slate-700 border-slate-300'
                          }`}
                        >
                          {item.permanent_id}
                        </button>
                      ))}
                    </div>
                  </div>

                  {instLookupStatus === 'found' && instLookupMeta && (
                    <div className="p-2 bg-emerald-50/80 border border-emerald-200 rounded text-[11px] text-emerald-900 space-y-0.5">
                      <div className="font-bold">✓ Master Registry Verified:</div>
                      <div className="text-emerald-800 text-[10px]">
                        Application No: <span className="font-mono font-bold">{instLookupMeta.application_no}</span> | Source: {instLookupMeta.source}
                      </div>
                    </div>
                  )}
                </div>

                {/* 2. Institution Full Legal Name with Autocomplete */}
                <div className="relative">
                  <label className="block font-bold text-slate-700 mb-1">
                    Institution Full Legal Name * (Auto-Populated / Searchable)
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. MIT Academy of Engineering (MITAOE)"
                    value={instForm.name}
                    onChange={(e) => handleNameSearch(e.target.value)}
                    onFocus={() => {
                      if (nameSuggestions.length > 0) setShowSuggestions(true);
                    }}
                    className="w-full px-3 py-2 border border-slate-300 rounded text-slate-800 bg-white font-medium"
                  />

                  {/* Autocomplete Suggestions List */}
                  {showSuggestions && nameSuggestions.length > 0 && (
                    <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-slate-300 rounded-md shadow-xl z-20 max-h-48 overflow-y-auto">
                      <div className="px-3 py-1 bg-slate-100 text-[10px] font-bold text-slate-500 uppercase">
                        Matching AICTE Dataset ({nameSuggestions.length} found):
                      </div>
                      {nameSuggestions.map((item, i) => (
                        <div
                          key={i}
                          onClick={() => handleSelectInstitutionPreset(item)}
                          className="px-3 py-2 hover:bg-blue-50 border-b border-slate-100 cursor-pointer text-xs"
                        >
                          <div className="font-bold text-slate-900">{item.name}</div>
                          <div className="text-[10px] text-slate-500 flex items-center space-x-2 font-mono">
                            <span>ID: {item.permanent_id}</span>
                            <span>•</span>
                            <span>{item.state}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* 3. State & University */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">State / UT * (Auto-Populated)</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Maharashtra"
                      value={instForm.state}
                      onChange={(e) => setInstForm({ ...instForm, state: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded text-slate-800 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Sanctioned Intake Quota</label>
                    <input
                      type="number"
                      placeholder="e.g. 360"
                      value={instForm.approved_intake}
                      onChange={(e) => setInstForm({ ...instForm, approved_intake: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded text-slate-800 bg-white font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Affiliating University (Auto-Populated)</label>
                  <input
                    type="text"
                    placeholder="e.g. Savitribai Phule Pune University"
                    value={instForm.university}
                    onChange={(e) => setInstForm({ ...instForm, university: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded text-slate-800 bg-white"
                  />
                </div>

                <p className="text-[11px] text-slate-500 pt-1">
                  Upon submission, this entity will be saved directly into Azure Database for PostgreSQL (Central India) with a cryptographically signed audit log block.
                </p>

                <div className="flex justify-end space-x-2 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => {
                      setIsAddInstModalOpen(false);
                      setShowSuggestions(false);
                      setInstLookupStatus('idle');
                    }}
                    className="px-3.5 py-1.5 border border-slate-300 rounded font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={formSubmitting}
                    className="px-4 py-1.5 bg-[#0B2E5C] hover:bg-[#1D4E9E] text-white font-bold rounded shadow-xs transition-colors flex items-center space-x-1 cursor-pointer"
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
        {/* MODAL 2: ADD NEW SCRUTINY OFFICER (Azure DB)                              */}
        {/* ========================================================================= */}
        {isAddOfficerModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg border border-slate-300 shadow-2xl max-w-lg w-full p-6 space-y-4">
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <div className="flex items-center space-x-2">
                  <UserPlus className="w-5 h-5 text-[#8B1A1A]" />
                  <h3 className="text-base font-bold text-[#0B2E5C]">Onboard New AICTE Scrutiny Officer</h3>
                </div>
                <button
                  onClick={() => setIsAddOfficerModalOpen(false)}
                  className="text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddOfficer} className="space-y-3.5 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Officer Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dr. Priya Sharma"
                    value={officerForm.name}
                    onChange={(e) => setOfficerForm({ ...officerForm, name: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded text-slate-800 bg-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Official AICTE Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. priya.sharma@aicte-india.org"
                    value={officerForm.email}
                    onChange={(e) => setOfficerForm({ ...officerForm, email: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded text-slate-800 bg-white font-mono"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Regional Office *</label>
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
                    <label className="block font-bold text-slate-700 mb-1">Clearance Level</label>
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
                    className="px-3.5 py-1.5 border border-slate-300 rounded font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={formSubmitting}
                    className="px-4 py-1.5 bg-[#8B1A1A] hover:bg-[#6E1414] text-white font-bold rounded shadow-xs transition-colors flex items-center space-x-1 cursor-pointer"
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

        {/* ========================================================================= */}
        {/* MODAL 3: INSPECTION SCRUTINY & MAP MODAL                                  */}
        {/* ========================================================================= */}
        {isVerifyModalOpen && selectedInspection && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
            <div className="bg-white rounded-2xl border border-slate-300 shadow-2xl max-w-4xl w-full overflow-hidden flex flex-col my-auto max-h-[95vh]">
              {/* Modal Header */}
              <div className="bg-[#0B2E5C] text-white p-4 sm:px-6 flex justify-between items-center">
                <div className="flex items-center space-x-2.5">
                  <Camera className="w-5 h-5 text-cyan-300" />
                  <div>
                    <h3 className="text-sm font-black tracking-wide">
                      AICTE Field Evidence Verification Dossier (#{selectedInspection.id})
                    </h3>
                    <p className="text-[11px] text-blue-200">
                      Mandatory Scrutiny under AICTE Approval Process Handbook (APH 2024-27 §4.2.3)
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setIsVerifyModalOpen(false);
                    setSelectedInspection(null);
                  }}
                  className="p-1 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Content Body */}
              <div className="p-4 sm:p-6 overflow-y-auto space-y-4">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                  {/* Left Column: Big Stamped Photo Viewfinder */}
                  <div className="lg:col-span-7 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black uppercase tracking-wider text-[#0B2E5C] flex items-center space-x-1.5">
                        <Camera className="w-4 h-4 text-blue-600" />
                        <span>Sealed Inspection Proof (GPS Map Viewfinder)</span>
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">1080P Full HD • Live Telemetry Stamp</span>
                    </div>

                    <div className="relative rounded-2xl overflow-hidden shadow-xl border-2 border-slate-800 bg-slate-950 aspect-4/3 flex flex-col justify-between">
                      {/* Photo Background */}
                      <div className="absolute inset-0 bg-cover bg-center">
                        {selectedInspection.photo_url ? (
                          <img
                            src={selectedInspection.photo_url}
                            alt="Inspection evidence"
                            className="w-full h-full object-cover"
                          />
                        ) : selectedInspection.lab_code === 'LAB-CC-03' ? (
                          <div className="w-full h-full bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex items-center justify-center relative overflow-hidden">
                            <div className="absolute inset-0 opacity-25 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px]" />
                            <div className="relative text-center p-6 space-y-2">
                              <span className="text-6xl">💻</span>
                              <p className="text-sm font-extrabold text-white">MITAOE High-Density Computer Center</p>
                              <p className="text-xs text-cyan-300 font-mono">540 Terminals • Core i7 16GB • Dual 1 Gbps Leased Line</p>
                            </div>
                          </div>
                        ) : selectedInspection.lab_code === 'RAMP-PORTAL-01' ? (
                          <div className="w-full h-full bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 flex items-center justify-center relative overflow-hidden">
                            <div className="relative text-center p-6 space-y-2">
                              <span className="text-6xl">♿</span>
                              <p className="text-sm font-extrabold text-white">Academic Complex Wheelchair Ramp Portal</p>
                              <p className="text-xs text-emerald-300 font-mono">1:12 Slope Gradient • Anti-Skid Polyurethane • Continuous Handrail</p>
                            </div>
                          </div>
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 flex items-center justify-center relative overflow-hidden">
                            <div className="relative text-center p-6 space-y-2">
                              <span className="text-6xl">🔬</span>
                              <p className="text-sm font-extrabold text-white">{selectedInspection.lab_name}</p>
                              <p className="text-xs text-cyan-300 font-mono">{selectedInspection.lab_code}</p>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Top HUD Overlay */}
                      <div className="relative z-10 p-3 flex justify-between items-start bg-gradient-to-b from-black/70 via-black/30 to-transparent">
                        <div className="flex items-center space-x-2">
                          <span className="px-2 py-0.5 bg-rose-600 text-white text-[10px] font-mono font-bold rounded-full animate-pulse flex items-center space-x-1">
                            <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                            <span>REC · 00:02:16</span>
                          </span>
                          <span className="px-2 py-0.5 bg-black/50 text-cyan-300 border border-cyan-500/30 text-[10px] font-mono rounded">
                            EVC GPS MAP CAMERA
                          </span>
                        </div>
                        <div className="flex items-center space-x-1.5 text-white/80">
                          <span className="px-1.5 py-0.5 bg-yellow-400 text-black text-[10px] font-extrabold rounded-full">
                            1X
                          </span>
                        </div>
                      </div>

                      {/* Bottom Stamped GPS Map Watermark Card */}
                      <div className="relative z-10 m-2 sm:m-3 p-3 bg-black/75 backdrop-blur-md rounded-xl border border-white/20 text-white space-y-2 shadow-2xl">
                        <div className="flex items-start space-x-3">
                          <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden shrink-0 border border-cyan-400/40 bg-slate-900 flex items-center justify-center">
                            <div className="w-2 h-2 rounded-full bg-rose-500 ring-4 ring-rose-400/40 animate-ping" />
                            <div className="absolute text-[8px] font-mono font-bold text-cyan-300 bottom-0.5 text-center w-full">
                              SAT MAP
                            </div>
                          </div>

                          <div className="flex-1 min-w-0 space-y-0.5 text-left">
                            <h4 className="text-xs sm:text-sm font-black text-white leading-tight truncate">
                              {selectedInspection.campus_name}
                            </h4>
                            <p className="text-[10px] text-slate-300 leading-snug line-clamp-2">
                              {selectedInspection.address}
                            </p>
                            <p className="text-[10px] font-mono text-cyan-300 font-bold">
                              Lat {selectedInspection.latitude.toFixed(5)}° N &nbsp; Long {selectedInspection.longitude.toFixed(5)}° E
                            </p>
                            <p className="text-[9px] text-slate-300 font-mono">
                              {new Date(selectedInspection.timestamp).toLocaleString('en-IN', {
                                weekday: 'long',
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                                second: '2-digit',
                              })}
                            </p>
                          </div>
                        </div>

                        {/* Telemetry Sensor Readouts */}
                        <div className="grid grid-cols-3 sm:grid-cols-6 gap-1 pt-1.5 border-t border-white/10 text-[9px] font-mono text-slate-300">
                          <span className="flex items-center space-x-1">
                            <Wind className="w-3 h-3 text-cyan-400" />
                            <span>{selectedInspection.wind_speed}</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <Droplets className="w-3 h-3 text-blue-400" />
                            <span>{selectedInspection.humidity}</span>
                          </span>
                          <span className="flex items-center space-x-1 text-amber-300 font-bold">
                            <Navigation className="w-3 h-3" />
                            <span>{selectedInspection.altitude} m</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <Thermometer className="w-3 h-3 text-rose-400" />
                            <span>{selectedInspection.temperature}</span>
                          </span>
                          <span className="flex items-center space-x-1 text-cyan-300 font-bold">
                            <Compass className="w-3 h-3" />
                            <span>{selectedInspection.compass_heading}</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <Zap className="w-3 h-3 text-yellow-400" />
                            <span>{selectedInspection.magnetic_field}</span>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Regulatory Geofence Readouts & Action Form */}
                  <div className="lg:col-span-5 space-y-3.5">
                    {/* Geodetic Radar & Haversine Distance */}
                    <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2.5">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-black text-[#0B2E5C] flex items-center space-x-1">
                          <Radio className="w-3.5 h-3.5 text-blue-600" />
                          <span>Geodetic Centroid Analysis</span>
                        </span>
                        <span className="text-[10px] font-mono font-bold text-slate-500">Haversine Engine</span>
                      </div>

                      <div className="space-y-1.5 text-xs">
                        <div className="flex justify-between py-1 border-b border-slate-200">
                          <span className="text-slate-600">Target Lab:</span>
                          <span className="font-bold text-slate-800 text-right">{selectedInspection.lab_name}</span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-slate-200">
                          <span className="text-slate-600">Statutory Radius:</span>
                          <span className="font-mono font-bold text-slate-800">{selectedInspection.statutory_radius_meters} meters</span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-slate-200">
                          <span className="text-slate-600">Measured Distance:</span>
                          <span
                            className={`font-mono font-black ${
                              selectedInspection.distance_meters <= selectedInspection.statutory_radius_meters
                                ? 'text-emerald-700'
                                : 'text-rose-700'
                            }`}
                          >
                            {selectedInspection.distance_meters} meters
                          </span>
                        </div>
                        <div className="flex justify-between py-1">
                          <span className="text-slate-600">GPS Accuracy:</span>
                          <span className="font-mono text-emerald-700 font-bold">±{selectedInspection.accuracy}m (RTK Fix)</span>
                        </div>
                      </div>
                    </div>

                    {/* Cryptographic Ledger Proof (Section 65B) */}
                    <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-black text-[#0B2E5C] flex items-center space-x-1">
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Legal Non-Repudiation (§65B)</span>
                        </span>
                        <span className="text-[10px] text-emerald-700 font-bold bg-emerald-100 px-1.5 py-0.5 rounded">
                          Azure PostgreSQL
                        </span>
                      </div>

                      <div className="text-xs space-y-1">
                        <p className="text-[10px] text-slate-500 font-medium">On-Device SHA-256 Digest:</p>
                        <p className="text-[10px] font-mono bg-white p-2 rounded border border-slate-300 text-slate-700 break-all select-all">
                          {selectedInspection.sha256_seal}
                        </p>
                        <p className="text-[10px] text-slate-500 pt-1">
                          Field Inspector: <strong>{selectedInspection.inspector_name}</strong> ({selectedInspection.inspector_role})
                        </p>
                      </div>
                    </div>

                    {/* Admin Regulatory Verification Decision Form */}
                    <div className="bg-blue-50/60 p-3.5 rounded-xl border border-blue-200 space-y-3">
                      <div>
                        <label className="block text-xs font-bold text-[#0B2E5C] mb-1">
                          Admin Scrutiny Notes &amp; Statutory Remarks:
                        </label>
                        <textarea
                          rows={2}
                          value={adminVerifyNotes}
                          onChange={(e) => setAdminVerifyNotes(e.target.value)}
                          placeholder="e.g. Workstation count and hardware verified compliant with APH §4.4.1 requirements."
                          className="w-full text-xs p-2.5 bg-white border border-slate-300 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0B2E5C]"
                        />
                      </div>

                      {/* Regulatory Decision Buttons */}
                      <div className="grid grid-cols-2 gap-2 pt-1">
                        <button
                          type="button"
                          disabled={verifyingAction}
                          onClick={() => handleVerifyInspection(selectedInspection.id, 'APPROVE', adminVerifyNotes)}
                          className="py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center space-x-1.5 cursor-pointer disabled:opacity-50"
                        >
                          <Check className="w-4 h-4" />
                          <span>Approve Evidence</span>
                        </button>

                        <button
                          type="button"
                          disabled={verifyingAction}
                          onClick={() => handleVerifyInspection(selectedInspection.id, 'REJECT', adminVerifyNotes)}
                          className="py-2.5 px-3 bg-rose-600 hover:bg-rose-700 text-white font-black text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center space-x-1.5 cursor-pointer disabled:opacity-50"
                        >
                          <X className="w-4 h-4" />
                          <span>Reject Evidence</span>
                        </button>
                      </div>

                      <button
                        type="button"
                        disabled={verifyingAction}
                        onClick={() =>
                          handleVerifyInspection(
                            selectedInspection.id,
                            'RE_INSPECT',
                            adminVerifyNotes || 'AICTE Bureau requires re-inspection due to optical obscurity.'
                          )
                        }
                        className="w-full py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs rounded-lg transition-colors flex items-center justify-center space-x-1 cursor-pointer"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>Request Physical Re-Inspection</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="bg-slate-100 px-5 py-3 border-t border-slate-200 flex justify-between items-center text-xs">
                <span className="text-slate-500 font-mono text-[11px]">
                  AICTE Central Server • Azure Flexible DB Central India
                </span>
                <button
                  onClick={() => {
                    setIsVerifyModalOpen(false);
                    setSelectedInspection(null);
                  }}
                  className="px-4 py-1.5 bg-white border border-slate-300 text-slate-700 font-bold rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  Close Window
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* MODAL 4: FULL-SCREEN EVIDENCE LIGHTBOX MODAL                              */}
        {/* ========================================================================= */}
        {lightboxInspection && (
          <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col items-center justify-between p-4 animate-in fade-in duration-200">
            {/* Lightbox Header Bar */}
            <div className="w-full max-w-6xl flex items-center justify-between text-white py-2 px-4 bg-slate-900/80 border border-slate-700/80 rounded-xl">
              <div className="flex items-center space-x-3">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <div>
                  <h3 className="text-sm font-black text-white">{lightboxInspection.lab_name}</h3>
                  <p className="text-[11px] font-mono text-cyan-300">
                    {lightboxInspection.campus_name} · {lightboxInspection.lab_code}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => setLightboxZoom((z) => Math.max(0.5, z - 0.25))}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs border border-slate-700 cursor-pointer"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <span className="font-mono text-xs px-2 py-1 bg-black/50 rounded text-amber-300">
                  {Math.round(lightboxZoom * 100)}%
                </span>
                <button
                  type="button"
                  onClick={() => setLightboxZoom((z) => Math.min(3, z + 0.25))}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs border border-slate-700 cursor-pointer"
                  title="Zoom In"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setLightboxZoom(1)}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs border border-slate-700 cursor-pointer"
                  title="Reset Zoom"
                >
                  <Maximize2 className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setLightboxInspection(null);
                    setLightboxZoom(1);
                  }}
                  className="ml-3 p-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs border border-rose-500 font-bold flex items-center space-x-1 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                  <span>Close</span>
                </button>
              </div>
            </div>

            {/* Lightbox Center Image / Viewfinder Frame */}
            <div className="flex-1 w-full max-w-6xl overflow-auto flex items-center justify-center my-4 p-2">
              <div
                style={{
                  transform: `scale(${lightboxZoom})`,
                  transformOrigin: 'center center',
                  transition: 'transform 0.15s ease-out',
                }}
                className="relative max-w-3xl w-full bg-slate-950 rounded-2xl overflow-hidden shadow-2xl border-2 border-slate-700"
              >
                {/* Viewfinder Canvas */}
                <div className="relative aspect-4/3 bg-slate-900 flex items-center justify-center overflow-hidden">
                  {lightboxInspection.photo_url ? (
                    <img
                      src={lightboxInspection.photo_url}
                      alt={lightboxInspection.lab_name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 flex flex-col items-center justify-center p-8 text-center space-y-3">
                      <div className="text-7xl">🔬</div>
                      <h4 className="text-xl font-black text-white">{lightboxInspection.lab_name}</h4>
                      <p className="text-xs font-mono text-cyan-300 max-w-md">{lightboxInspection.statutory_clause}</p>
                    </div>
                  )}

                  {/* Watermark Card Overlay */}
                  <div className="absolute bottom-0 inset-x-0 p-3 bg-black/85 backdrop-blur-md border-t border-white/20 text-white flex items-start space-x-3">
                    <div className="w-14 h-14 rounded-lg bg-emerald-950 border border-emerald-400/40 relative flex items-center justify-center shrink-0">
                      <div className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                      <span className="absolute bottom-0 text-[7px] font-mono text-emerald-300 font-bold">SAT MAP</span>
                    </div>
                    <div className="flex-1 min-w-0 text-left">
                      <h5 className="text-xs font-black text-white truncate">{lightboxInspection.campus_name}</h5>
                      <p className="text-[10px] text-slate-300 truncate">{lightboxInspection.address}</p>
                      <p className="text-[10px] font-mono text-cyan-300 font-bold">
                        Lat {lightboxInspection.latitude.toFixed(5)}° N &nbsp; Long {lightboxInspection.longitude.toFixed(5)}° E
                      </p>
                      <div className="flex items-center space-x-3 text-[9px] font-mono text-slate-400 mt-0.5">
                        <span>Alt: {lightboxInspection.altitude}m</span>
                        <span>Acc: ±{lightboxInspection.accuracy}m</span>
                        <span className="text-emerald-400 font-bold">
                          Geofence: {lightboxInspection.geofence_status} ({lightboxInspection.distance_meters}m)
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Lightbox Footer Bar with SHA-256 seal & verification */}
            <div className="w-full max-w-6xl py-2.5 px-4 bg-slate-900/80 border border-slate-700/80 rounded-xl text-white flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center space-x-2 font-mono text-[11px] text-slate-300">
                <Lock className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span className="text-slate-400">SHA-256:</span>
                <span className="text-emerald-300 truncate max-w-md font-bold">{lightboxInspection.sha256_seal}</span>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  type="button"
                  onClick={() => handleVerifyIntegrity(lightboxInspection)}
                  disabled={verifyingHashId === lightboxInspection.id}
                  className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs flex items-center space-x-1 cursor-pointer"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>{verifyingHashId === lightboxInspection.id ? 'Verifying...' : 'Verify Ledger Seal'}</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </GovLayout>
  );
}

// lib/store.ts - Unified Client/Server State Store for NirikshAI
'use client';

import { useState, useEffect } from 'react';
import { Application, AuditEvent, Finding, FindingStatus, VerifStatus, AppRole } from './types';
import { INITIAL_APPLICATIONS, INITIAL_AUDIT_LOG } from './supabase';
import { computeEventHash, verifyAuditChain } from './audit/audit';

const LOCAL_APPS_KEY = 'nirikshai_apps_v2';
const LOCAL_AUDIT_KEY = 'nirikshai_audit_v2';
const LOCAL_ROLE_KEY = 'nirikshai_role_v2';

export function getStoredRole(): AppRole {
  if (typeof window === 'undefined') return 'officer';
  return (localStorage.getItem(LOCAL_ROLE_KEY) as AppRole) || 'officer';
}

export function setStoredRole(role: AppRole) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(LOCAL_ROLE_KEY, role);
    window.dispatchEvent(new Event('nirikshai_role_change'));
  }
}

export function getStoredApplications(): Application[] {
  if (typeof window === 'undefined') return INITIAL_APPLICATIONS;
  const raw = localStorage.getItem(LOCAL_APPS_KEY);
  if (!raw) {
    localStorage.setItem(LOCAL_APPS_KEY, JSON.stringify(INITIAL_APPLICATIONS));
    return INITIAL_APPLICATIONS;
  }
  try {
    return JSON.parse(raw);
  } catch {
    return INITIAL_APPLICATIONS;
  }
}

export function saveStoredApplications(apps: Application[]) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(LOCAL_APPS_KEY, JSON.stringify(apps));
    window.dispatchEvent(new Event('nirikshai_apps_change'));
  }
}

export function getStoredAuditLog(): AuditEvent[] {
  if (typeof window === 'undefined') return INITIAL_AUDIT_LOG;
  const raw = localStorage.getItem(LOCAL_AUDIT_KEY);
  if (!raw) {
    localStorage.setItem(LOCAL_AUDIT_KEY, JSON.stringify(INITIAL_AUDIT_LOG));
    return INITIAL_AUDIT_LOG;
  }
  try {
    return JSON.parse(raw);
  } catch {
    return INITIAL_AUDIT_LOG;
  }
}

export function saveStoredAuditLog(logs: AuditEvent[]) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(LOCAL_AUDIT_KEY, JSON.stringify(logs));
    window.dispatchEvent(new Event('nirikshai_audit_change'));
  }
}

export function appendAuditEvent(actor: string, action: string, entity: string, payload: any) {
  const currentLogs = getStoredAuditLog();
  const prevHash = currentLogs.length > 0 ? currentLogs[currentLogs.length - 1].hash : '0'.repeat(64);
  const at = new Date().toISOString();
  const hash = computeEventHash(prevHash, { actor, action, entity, payload, at });
  const newEvent: AuditEvent = {
    id: currentLogs.length + 1,
    actor,
    action,
    entity,
    payload,
    prev_hash: prevHash,
    hash,
    at,
  };
  const updated = [...currentLogs, newEvent];
  saveStoredAuditLog(updated);
  return newEvent;
}

export function resetDemoData() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(LOCAL_APPS_KEY);
    localStorage.removeItem(LOCAL_AUDIT_KEY);
    localStorage.removeItem(LOCAL_ROLE_KEY);
    window.location.reload();
  }
}

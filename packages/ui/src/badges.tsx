// packages/ui/src/badges.tsx
import React from 'react';
import { VerifStatus, FindingSeverity } from '@nirikshai/shared-types';
import { AICTE_TOKENS } from './tokens';

export interface StatusBadgeProps {
  status: VerifStatus;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className = '' }) => {
  const meta = AICTE_TOKENS.regulatoryColors[status] || AICTE_TOKENS.regulatoryColors.unsupported;
  const label = status.replace(/_/g, ' ').toUpperCase();

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider ${className}`}
      style={{
        backgroundColor: meta.bg,
        color: meta.text,
        border: `1px solid ${meta.border}`,
      }}
    >
      {label}
    </span>
  );
};

export interface SeverityBadgeProps {
  severity: FindingSeverity;
  className?: string;
}

export const SeverityBadge: React.FC<SeverityBadgeProps> = ({ severity, className = '' }) => {
  const styles: Record<FindingSeverity, { bg: string; text: string; label: string }> = {
    blocking: { bg: '#FDE8E8', text: '#9B1C1C', label: 'BLOCKING' },
    flag: { bg: '#FEF08A', text: '#854D0E', label: 'FLAG' },
    info: { bg: '#E1EFFE', text: '#1E429F', label: 'INFO' },
  };

  const current = styles[severity] || styles.info;

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold tracking-wide ${className}`}
      style={{ backgroundColor: current.bg, color: current.text }}
    >
      {current.label}
    </span>
  );
};

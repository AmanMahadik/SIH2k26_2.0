// mobile-app/src/constants/mockData.ts

export interface GeotaggedEvidence {
  id: string;
  category: string;
  campusName: string;
  aicteId: string;
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: string;
  sha256Hash: string;
  inspectorName: string;
  status: 'Verified & Sealed' | 'Pending AICTE Sync';
}

export interface ScannedDocument {
  id: string;
  docType: string;
  filename: string;
  fileSize: string;
  pageCount: number;
  sha256Hash: string;
  ocrConfidence: number;
  clauseCitation: string;
  status: 'Hashed & Verified' | 'Flagged for Review';
}

export interface DeficiencyAlert {
  id: string;
  institutionName: string;
  aicteId: string;
  severity: 'Critical' | 'Warning';
  clauseId: string;
  ruleTitle: string;
  message: string;
  sentAt: string;
  status: 'Action Required' | 'Resubmitted';
}

export const CURRENT_EVC_OFFICER = {
  name: 'Dr. Priya Sharma',
  role: 'AICTE Expert Visiting Committee (EVC) Lead',
  regionalOffice: 'Western Regional Office (WRO, Mumbai)',
  email: 'priya.sharma@aicte-india.org',
  phone: '+91 94220 18293',
  clearanceLevel: 'L2 - Field Scrutiny & EVC Inspection',
  assignedCampus: 'Pune Institute of Computer Technology (PICT)',
  aictePermanentId: '1-10972348121',
};

export const INITIAL_GEOTAGGED_PHOTOS: GeotaggedEvidence[] = [
  {
    id: 'geo-1',
    category: 'Advanced Computer Center (540 Terminals)',
    campusName: 'Pune Institute of Computer Technology',
    aicteId: '1-10972348121',
    latitude: 18.457532,
    longitude: 73.850831,
    accuracy: 2.1,
    timestamp: '2026-10-27T10:15:30.000Z',
    sha256Hash: '9a6b12a84358fa838d74883b4b84013481239840293482390481023948102394',
    inspectorName: 'Dr. Priya Sharma (EVC Lead)',
    status: 'Verified & Sealed',
  },
  {
    id: 'geo-2',
    category: 'Barrier-Free Wheelchair Ramp & Lift',
    campusName: 'Pune Institute of Computer Technology',
    aicteId: '1-10972348121',
    latitude: 18.457812,
    longitude: 73.851042,
    accuracy: 1.8,
    timestamp: '2026-10-27T10:30:15.000Z',
    sha256Hash: 'f4b1c2d3e4a5061728394a5b6c7d8e9f0123456789abcdef0123456789abcdef',
    inspectorName: 'Dr. Priya Sharma (EVC Lead)',
    status: 'Verified & Sealed',
  },
  {
    id: 'geo-3',
    category: 'Mechanical Engineering Workshop',
    campusName: 'Pune Institute of Computer Technology',
    aicteId: '1-10972348121',
    latitude: 18.458021,
    longitude: 73.850419,
    accuracy: 2.4,
    timestamp: '2026-10-27T11:05:00.000Z',
    sha256Hash: '8e7a6b5c4d3e2f1a0987654321fedcba987654321abcdef0123456789abcdef0',
    inspectorName: 'Dr. Priya Sharma (EVC Lead)',
    status: 'Verified & Sealed',
  },
];

export const INITIAL_SCANNED_DOCS: ScannedDocument[] = [
  {
    id: 'doc-scan-1',
    docType: 'AICTE EoA Approval Letter 2025-26',
    filename: 'AICTE_EoA_PICT_2025.pdf',
    fileSize: '1.8 MB',
    pageCount: 3,
    sha256Hash: '9a6b12a84358fa838d74883b4b84013481239840293482390481023948102394',
    ocrConfidence: 98.4,
    clauseCitation: 'APH 2024-27 §4.1.2 (Mandatory EoA Letter)',
    status: 'Hashed & Verified',
  },
  {
    id: 'doc-scan-2',
    docType: 'State Government NOC (DTE Maharashtra)',
    filename: 'State_NOC_Govt_Maharashtra.pdf',
    fileSize: '2.4 MB',
    pageCount: 2,
    sha256Hash: '3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f90123456789abcdef0123456789abcde',
    ocrConfidence: 96.8,
    clauseCitation: 'APH 2024-27 §4.3.1 (State NOC Expiry Check)',
    status: 'Hashed & Verified',
  },
  {
    id: 'doc-scan-3',
    docType: 'Municipal Fire Safety NOC',
    filename: 'Pune_PMC_Fire_NOC.pdf',
    fileSize: '1.2 MB',
    pageCount: 1,
    sha256Hash: '7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0123456789abcdef01',
    ocrConfidence: 97.2,
    clauseCitation: 'APH 2024-27 §4.4.1 (Life Safety Code)',
    status: 'Hashed & Verified',
  },
];

export const DEFICIENCY_ALERTS: DeficiencyAlert[] = [
  {
    id: 'alert-1',
    institutionName: 'Apex Technical Campus',
    aicteId: '1-30948192034',
    severity: 'Critical',
    clauseId: 'APH 2024-27 §4.3.1',
    ruleTitle: 'State NOC Validity Expired',
    message: 'State NOC expired on 2026-06-30. Current cycle requires NOC valid until 2027-05-31.',
    sentAt: '2026-10-27T08:30:00Z',
    status: 'Action Required',
  },
  {
    id: 'alert-2',
    institutionName: 'Delhi College of Engineering & Technology',
    aicteId: '1-20491823901',
    severity: 'Warning',
    clauseId: 'APH 2024-27 §4.5.1',
    ruleTitle: 'Intake Quota Claim Exceeds Ceiling',
    message: 'Submitted intake claim is 360 seats, but affiliated university clearance specifies 300 seats.',
    sentAt: '2026-10-27T09:15:00Z',
    status: 'Action Required',
  },
];

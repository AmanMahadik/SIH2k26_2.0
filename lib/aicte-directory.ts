import masterData from './aicte-master-institutions.json';

export interface AicteInstitutionRecord {
  sno: number;
  application_no: string;
  permanent_id: string;
  name: string;
  state: string;
  university: string;
  approved_intake?: number;
}

const institutionsList = masterData as AicteInstitutionRecord[];

// Fast indexed maps
const byPermId = new Map<string, AicteInstitutionRecord>();
const byAppNo = new Map<string, AicteInstitutionRecord>();

// Populate index
institutionsList.forEach((inst) => {
  if (inst.permanent_id) {
    byPermId.set(inst.permanent_id.trim().toLowerCase(), inst);
    // Also index without "1-" prefix if user enters only numbers
    const stripped = inst.permanent_id.replace(/^1-/, '').trim().toLowerCase();
    if (stripped) {
      byPermId.set(stripped, inst);
    }
  }
  if (inst.application_no) {
    byAppNo.set(inst.application_no.trim().toLowerCase(), inst);
    const stripped = inst.application_no.replace(/^1-/, '').trim().toLowerCase();
    if (stripped) {
      byAppNo.set(stripped, inst);
    }
  }
});

/**
 * Lookup an institution by exact AICTE Permanent ID or Application Number
 */
export function lookupAicteInstitution(identifier: string): AicteInstitutionRecord | null {
  if (!identifier) return null;
  const cleaned = identifier.trim().toLowerCase();
  
  // Try exact Permanent ID
  if (byPermId.has(cleaned)) {
    return byPermId.get(cleaned)!;
  }
  
  // Try with "1-" prefix if not present
  if (!cleaned.startsWith('1-') && byPermId.has(`1-${cleaned}`)) {
    return byPermId.get(`1-${cleaned}`)!;
  }

  // Try Application No
  if (byAppNo.has(cleaned)) {
    return byAppNo.get(cleaned)!;
  }
  if (!cleaned.startsWith('1-') && byAppNo.has(`1-${cleaned}`)) {
    return byAppNo.get(`1-${cleaned}`)!;
  }

  return null;
}

/**
 * Autocomplete / search institutions by query (matches Permanent ID, Application No, or Name)
 */
export function searchAicteInstitutions(query: string, limit: number = 8): AicteInstitutionRecord[] {
  if (!query || query.trim().length < 2) return [];
  const q = query.trim().toLowerCase();

  const results: AicteInstitutionRecord[] = [];

  for (const inst of institutionsList) {
    if (
      inst.permanent_id.toLowerCase().includes(q) ||
      inst.application_no.toLowerCase().includes(q) ||
      inst.name.toLowerCase().includes(q)
    ) {
      results.push(inst);
      if (results.length >= limit) break;
    }
  }

  return results;
}

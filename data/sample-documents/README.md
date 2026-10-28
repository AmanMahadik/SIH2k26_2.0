# Sample Approval Process Test Documents

This folder contains synthetic, non-PII test PDF and image artifacts for automated validation, OCR evaluation, and forensic anomaly testing.

## Corpus Distribution
1. **Compliant EoA Dossiers**:
   - Sworn Affidavits with valid execution dates (< 180 days).
   - State Government NOCs with validity extending across Academic Year 2026-27.
   - Land and Barrier-Free Infrastructure certificates.
2. **Deficient Dossiers (Negative Test Suite)**:
   - Expired Affidavits & NOCs (triggering `R-EXP-NOC` and `R-EXP-AFFIDAVIT`).
   - Mismatched Legal Titles (triggering `R-XDOC-NAME` cross-field mismatch).
   - Sanctioned Intake Inconsistencies (triggering `R-REC-INTAKE`).
   - Missing Mandatory Exhibits (triggering `R-DOC-*` blocking flags).
3. **Forensic Tamper Samples**:
   - Incrementally modified PDF structures with overwritten byte ranges.
   - Mixed typography and font alterations.
   - Cloned document hashes across multiple institutions (duplicate detection).

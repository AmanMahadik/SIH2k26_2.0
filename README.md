# NirikshAI (निरीक्षAI)
> **AI-Powered Application Validation, Document Authentication & Regulatory Compliance Verification**  
> *"Check early. Prove everything. Humans decide."*

[![Smart India Hackathon 2026](https://img.shields.io/badge/SIH-2026-blue.svg)](https://www.sih.gov.in/)
[![Problem Statement](https://img.shields.io/badge/AICTE-PS%2026261-orange.svg)](#)
[![Theme](https://img.shields.io/badge/Theme-Smart%20Automation-green.svg)](#)

---

## 📌 Problem Overview
- **Organization**: All India Council for Technical Education (AICTE), Ministry of Education, Government of India
- **Department**: Regulation Bureau
- **Category**: Software
- **Theme**: Smart Automation
- **Problem Statement ID**: **26261**

When technical institutions apply annually for Extension of Approval (EoA) and other approval-related changes, scrutiny officers must manually inspect extensive documentation (affidavits, NOCs, accreditation certificates, payment proofs, land/infrastructure compliance). This process is manual, repetitive, vulnerable to missed discrepancies, and delays legitimate approvals.

**NirikshAI** provides an AI-enabled regulatory decision-support platform designed to streamline pre-scrutiny, document authentication, cross-record validation, and tamper triage with complete transparency, human-in-the-loop governance, and verifiable audit trails.

---

## 📄 Documentation Artifacts
This repository contains complete, production-grade project documentation:
- **[Word Documentation Report (DOCX)](./nirikshai_report.docx)** (~617 KB, 80+ sections with tables, schemas & specifications)
- **[Publication-Ready PDF Report](./nirikshai_report.pdf)** (~726 KB, 36 pages with running headers, footers, cover page & embedded diagrams)

### System Visualizations (`img/`)
- **Figure 1**: Root-cause analysis tree (`img/root.png`)
- **Figure 2**: System architecture (`img/arch.png`)
- **Figure 3**: Entity-Relationship Diagram (`img/er.png`)
- **Figure 4**: Seven-state verification state machine (`img/state.png`)

---

## 🚀 Key Innovations

1. **Evidence-Linked Findings**: Every discrepancy or alert flags the exact document, page number, and bounding box coordinates for instant verification.
2. **Rules-as-Data**: Checklists derived from the AICTE Approval Process Handbook (APH) are versioned JSON rule sets citing specific regulatory clauses.
3. **Seven-State Verification Machine**: Implements uniform verification states (`VERIFIED`, `MISMATCH_DETECTED`, `EXPIRED`, `VERIFICATION_PENDING`, `SOURCE_UNAVAILABLE`, `MANUAL_REVIEW_REQUIRED`) with fail-safe routing.
4. **Calibrated Tamper Triage**: Evaluates PDF structural anomalies, metadata inconsistencies, text-layer diffs, and perceptual hashes without unsubstantiated forgery claims.
5. **Hash-Chained Audit Trail**: Cryptographic `SHA-256(prev_hash + canonical_event)` logging ensuring regulatory tamper-evidence.

---

## 🛠️ Tech Stack

- **Frontend & Orchestrator API**: Next.js (App Router), TypeScript, Tailwind CSS, shadcn/ui
- **Auth & Access Control**: Clerk / Supabase Auth with Row Level Security (RLS)
- **Database & Object Storage**: Supabase PostgreSQL + Storage buckets
- **Document AI & Forensics Service**: Python 3.11, FastAPI, PyMuPDF, pikepdf, pyHanko, OpenCV, imagehash, PaddleOCR / Tesseract
- **Documentation Engines**: `docx` (Node.js) & ReportLab (Python)

---

## 🔄 How to Generate Documentation

```bash
# 1. Generate diagrams
python img/generate_diagrams.py

# 2. Build DOCX report
node doc_gen/generate_docx.js

# 3. Build PDF report
python doc_gen/generate_pdf.py
```

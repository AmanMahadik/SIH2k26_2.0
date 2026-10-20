# NirikshAI (निरीक्षAI)
> **AI-Powered Application Validation, Document Authentication & Regulatory Compliance Verification**  
> *"Check early. Prove everything. Humans decide."*

[![Smart India Hackathon 2026](https://img.shields.io/badge/SIH-2026-blue.svg)](https://www.sih.gov.in/)
[![Problem Statement](https://img.shields.io/badge/AICTE-PS%2026261-orange.svg)](#)
[![Theme](https://img.shields.io/badge/Theme-Smart%20Automation-green.svg)](#)
[![Tech Stack](https://img.shields.io/badge/Next.js%2015-Supabase-emerald.svg)](#)

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

## 🚀 Key Innovations & Safeguards

1. **Evidence-Linked Findings**: Every discrepancy or alert flags the exact document, page number, and bounding box coordinates for instant verification, citing specific AICTE Approval Process Handbook (APH 2024-27) clauses.
2. **Rules-as-Data**: Checklists derived from the Handbook are versioned JSON rule sets that can be updated by regulatory staff without modifying or redeploying code.
3. **Seven-State Verification Machine**: Implements uniform verification states (`VERIFIED`, `MISMATCH_DETECTED`, `EXPIRED`, `VERIFICATION_PENDING`, `SOURCE_UNAVAILABLE`, `MANUAL_REVIEW_REQUIRED`) with fail-safe routing (never a silent pass).
4. **Calibrated Tamper Triage**: Evaluates PDF structural anomalies, metadata inconsistencies, text-layer diffs, and perceptual hashes without making reckless or unsubstantiated automated forgery claims.
5. **Hash-Chained Audit Trail**: Cryptographic `SHA-256(prev_hash + canonical_event)` logging ensuring regulatory tamper-evidence and legal non-repudiation.
6. **Human-In-The-Loop Governance**: Zero automated rejection states. Every adverse decision requires explicit Scrutiny Officer action with documented notes.

---

## 🎯 4 Interactive Demonstration Scenarios

| Scenario | Institution | Focus Area | Expected Outcome |
| :--- | :--- | :--- | :--- |
| **Scenario 1** | **Pune Institute of Computer Technology (PICT)** | 100% Valid Application | Clean pass, 100% readiness score, verified with AICTE master records |
| **Scenario 2** | **Delhi College of Engineering & Technology** | Discrepancy & Expiry Flag | State NOC expired prior to 2026-27; legal title mismatch across EoA and NOC |
| **Scenario 3** | **Apex Technical Campus** | Tamper Indicator Advisory | Altered intake digits (300 claimed vs 240 quota); PDF incremental update date gap |
| **Scenario 4** | **National Institute of Management & Science** | Seven-State Fail-Safe Escalation | Issuer endpoint timeout gracefully escalating to `MANUAL_REVIEW_REQUIRED` |

---

## 🛠️ Quick Start & Demonstration Setup

### 1. Run the Web Application
```bash
# Install dependencies
npm install

# Start development server
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 2. Run Empirical Evaluation (Requirement R13)
```bash
python eval/evaluate_metrics.py
```

### 3. Optional: Run Document AI FastAPI Service
```bash
python services/ai/main.py
```

---

## 🗄️ Database Setup (Supabase / PostgreSQL)

The application is pre-configured with Supabase credentials:
- `NEXT_PUBLIC_SUPABASE_URL=https://fdidwqlutymbyrdjjptx.supabase.co`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_JdcfawAzKlJvd5gW9f6Arg_2XeZLOkj`

To initialize or inspect database tables:
- **`db/schema.sql`**: Full PostgreSQL schema for all tables, indexes, and enums.
- **`db/seed.sql`**: Seed data with the 4 demonstration institutions and initial genesis audit ledger block.

> **Resilient Demo Mode**: The application includes a self-healing client/server state layer that operates smoothly with live local reactivity even if external networks or database tables are unmigrated.

---

## 📄 Project Documentation Artifacts

- **[Word Documentation Report (DOCX)](./nirikshai_report.docx)** (~617 KB, 80+ sections with tables, schemas & specifications)
- **[Publication-Ready PDF Report](./nirikshai_report.pdf)** (~726 KB, 36 pages with running headers, footers, cover page & embedded diagrams)
- **System Architecture Diagram**: `img/arch.png`
- **Entity-Relationship Diagram**: `img/er.png`
- **Seven-State Verification State Machine**: `img/state.png`
- **Root-Cause Analysis Tree**: `img/root.png`

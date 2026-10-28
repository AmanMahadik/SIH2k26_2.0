# NirikshAI (निरीक्षAI) 2.0
> **AI-Powered Application Validation, Document Authentication & Regulatory Compliance Verification Platform**  
> *"Check early. Prove everything. Humans decide."*

[![Smart India Hackathon 2026](https://img.shields.io/badge/SIH-2026-blue.svg)](https://www.sih.gov.in/)
[![Problem Statement](https://img.shields.io/badge/AICTE-PS%2026261-orange.svg)](#)
[![Theme](https://img.shields.io/badge/Theme-Smart%20Automation-green.svg)](#)
[![Architecture](https://img.shields.io/badge/Turborepo-Monorepo-black.svg)](#)
[![Next.js 15](https://img.shields.io/badge/Next.js-15%20App%20Router-black.svg)](#)
[![FastAPI](https://img.shields.io/badge/FastAPI-Python%203.11-009688.svg)](#)
[![Live Demo](https://img.shields.io/badge/Production-Live%20Vercel-success.svg)](https://sih-2k26-2-0.vercel.app)

---

## 📌 Problem Statement & Ministry Overview
- **Organization**: All India Council for Technical Education (AICTE), Ministry of Education, Government of India
- **Department**: Regulation Bureau
- **Problem Statement ID**: **26261**
- **Theme**: Smart Automation
- **Target Deadline**: November 2, 2026
- **Live Production URL**: [https://sih-2k26-2-0.vercel.app](https://sih-2k26-2-0.vercel.app)

When technical institutions apply annually for Extension of Approval (EoA) and other approval-related changes under the statutory mandate of the AICTE Approval Process Handbook (APH 2024-27), scrutiny officers must manually inspect thousands of pages of documentation (sworn affidavits, state NOCs, accreditation certificates, land compliance, TER fee receipts, and faculty records).

**NirikshAI** provides an enterprise AI decision-support platform designed to automate pre-scrutiny, document authentication, cross-record reconciliation against the AICTE Central Master Registry, and PDF tamper triage with complete transparency, human-in-the-loop governance, and legally non-repudiable audit trails.

---

## 🏛️ Enterprise Monorepo Structure

```
SIH2k26_2.0/
├── .github/
│   ├── workflows/
│   │   ├── ci.yml                 # Lint, Typecheck, 23 Unit Tests, Next.js Build
│   │   ├── security.yml           # CodeQL SAST, Dependency Scanning & Gitleaks
│   │   ├── deploy-staging.yml     # Staging validation pipeline
│   │   ├── deploy-prod.yml        # Release gate for production
│   │   └── mobile-eas-build.yml   # Expo Android & iOS EAS build pipeline
│   ├── ISSUE_TEMPLATE/
│   ├── PULL_REQUEST_TEMPLATE.md
│   ├── CODEOWNERS
│   └── dependabot.yml
│
├── apps/
│   ├── web/                       # Next.js 15 (5 role portals: Institution, Scrutiny, Committee, Admin, Auditor)
│   └── mobile/                    # Expo SDK 54 / React Native Companion App (Geo-tagged camera, offline sync)
│
├── services/
│   └── ai-service/                # FastAPI (Python 3.11) microservice (PaddleOCR, PDF Forensics, Fuzzy Match)
│
├── packages/
│   ├── rule-engine/               # Pure TS AST Evaluator & 7-State Verification Automaton
│   ├── rules/                     # Versioned JSON rule definitions mapped to APH 2024-27 clauses
│   ├── ledger/                    # SHA-256 hash-chained audit ledger (Section 65B Indian Evidence Act)
│   ├── db/                        # PostgreSQL schema migrations, seeds, and connection pool
│   ├── shared-types/              # Shared TypeScript domain models & Zod schemas
│   ├── api-client/                # Typed API client for FastAPI AI microservice
│   ├── config/                    # Shared ESLint, TypeScript base, and Tailwind preset
│   └── ui/                        # AICTE official design system tokens and badge components
│
├── infra/
│   ├── docker/                    # Multi-container docker-compose.yml (Web, AI-service, PostgreSQL)
│   ├── k8s/                       # Kubernetes deployment and service manifests
│   └── terraform/                 # Azure PostgreSQL Flexible Server Terraform provisioners
│
├── data/
│   ├── aicte-master/              # Ground-truth AICTE institutional registry seeds
│   └── sample-documents/          # Test corpus (compliant, expired, altered, and fault dossiers)
│
├── docs/
│   ├── architecture/              # C4 diagrams, data-flow, threat model (STRIDE)
│   ├── adr/                       # Architectural Decision Records (0001, 0002, 0003)
│   ├── api/                       # OpenAPI 3.0 specification
│   ├── compliance/                # DPDP Act 2023 compliance & data protection
│   ├── runbooks/                  # Production deployment & operations runbook
│   └── sih/                       # SIH 2026 Problem Statement 26261 direct requirements mapping
│
├── turbo.json                     # Turborepo task pipeline configuration
├── Makefile                       # Developer shortcuts (make dev, make test, make build)
└── scripts/
    └── run_all_function_tests.ts  # Comprehensive 23-function automated test suite
```

---

## 🚀 Key Innovations & Safeguards

1. **Evidence-Linked Findings**: Every discrepancy or alert flags the exact document, page number, and bounding box coordinates for instant verification, citing specific AICTE Approval Process Handbook (APH 2024-27) clauses.
2. **Rules-as-Data**: Checklists derived from the Handbook are versioned JSON rule sets that can be updated by regulatory staff without modifying or redeploying code.
3. **Seven-State Verification Machine**: Implements uniform verification states (`verified`, `mismatch_detected`, `expired`, `verification_pending`, `source_unavailable`, `manual_review_required`, `unsupported`) with fail-safe routing (never a silent pass).
4. **Calibrated Tamper Triage**: Evaluates PDF structural anomalies, metadata inconsistencies, text-layer diffs, and perceptual hashes without making reckless or unsubstantiated automated forgery claims.
5. **Hash-Chained Audit Trail**: Cryptographic `SHA-256(prev_hash + canonical_event)` logging ensuring regulatory tamper-evidence and legal non-repudiation under Section 65B of the Indian Evidence Act.
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

## 🛠️ Quick Start & Developer Guide

### 1. Run the Web Application
```bash
# Install dependencies
npm install

# Start Next.js development server
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 2. Run Comprehensive Automated Tests (23 Functions)
```bash
# Execute end-to-end verification and compliance test suite
npx tsx scripts/run_all_function_tests.ts
```

### 3. Run Package Unit Tests
```bash
# Run rule engine AST and state machine tests
npx tsx --test packages/rule-engine/tests/evaluator.test.ts

# Run cryptographic ledger integrity tests
npx tsx --test packages/ledger/tests/ledger.test.ts
```

### 4. Run Multi-Container Docker Stack
```bash
docker compose -f infra/docker/docker-compose.yml up --build -d
```

---

## 🗄️ Database Setup (PostgreSQL / Supabase)

The platform is pre-configured with active database connectivity:
- **`packages/db/migrations/001_initial_schema.sql`**: Full PostgreSQL DDL for institutions, applications, documents, extracted fields, findings, and audit ledger.
- **`packages/db/seeds/aicte_master_seed.sql`**: AICTE Central Master reference data.

---

## 📄 Documentation & Evaluation Reports

- **[SIH Problem Statement Mapping](./docs/sih/sih-problem-statement-mapping.md)**: Direct traceability matrix to PS 26261 requirements.
- **[System Architecture Overview](./docs/architecture/overview.md)**: C4 context and container diagrams.
- **[Regulatory Data Flow](./docs/architecture/data-flow.md)**: End-to-end lifecycle sequence diagrams.
- **[Threat Model & Defense](./docs/architecture/threat-model.md)**: STRIDE analysis for institutional data protection.
- **[Function Test Report (PDF)](./docs/NirikshAI_Function_Workflows_and_Test_Report.pdf)**: 23-function test suite report with execution logs.
- **[OpenAPI 3.0 Specification](./docs/api/openapi.yaml)**: Complete REST API documentation.

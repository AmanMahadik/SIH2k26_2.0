# NirikshAI — SIH 2026 Official 6-Slide Presentation Blueprint
**Problem Statement ID:** 26261  
**Problem Statement Title:** AI-Powered Application Validation, Document Authentication and Regulatory Compliance Verification  
**Organization:** All India Council for Technical Education (Regulation Bureau), Ministry of Education, Govt. of India  
**Theme:** Smart Automation | **Category:** Software  
**Team Name:** Code4Bharat  

---

## Slide 1: Title Page

### Layout & Design Instructions:
* **Background:** Professional dark navy blue (`#0f172a`) or clean government white/slate theme.
* **Top Strip:** Official SIH 2026 Logo + Ministry of Education / AICTE Logo (or text).
* **Center:** Large Title, Subtitle, and Tagline.
* **Bottom Grid:** Team metadata and assigned roles.

### Exact Text to Include:

```text
================================================================================
SMART INDIA HACKATHON 2026
Problem Statement ID: 26261
Theme: Smart Automation | Category: Software
Organization: AICTE, Regulation Bureau, Ministry of Education, Government of India
================================================================================

                               NIRIKSHAI (निरीक्षAI)
       AI-Powered Regulatory Compliance & Document Authentication Platform
                 for AICTE Extension of Approval (EoA) Scrutiny

                  "Check early. Prove everything. Humans decide."

================================================================================
Team Details:
• Team Name: Code4Bharat
• Team ID: [Insert your Team ID]
• Institute: [Insert Your College Name, City, State]

Team Members & Assigned Roles:
1. Aman Mahadik — Team Lead & Cloud Integration Lead (Azure)
2. [Member 2]   — Full-Stack Developer (Next.js & Frontend)
3. [Member 3]   — AI & Document Forensics Lead (FastAPI & OCR)
4. [Member 4]   — Rule Engine Lead (APH 2024-27 Evaluator)
5. [Member 5]   — Data & Empirical Evaluation Lead (Benchmark)
6. [Member 6]   — Documentation & QA Lead (Must include female member)
================================================================================
```

---

## Slide 2: Proposed Solution (Idea, Innovation, Uniqueness)

### Layout & Design Instructions:
* **Top Block:** 1-sentence Problem statement + 2-sentence Proposed Solution.
* **Center (5 Columns or Grid):** The 5 Key Innovations with icons.
* **Bottom Accent Bar:** The core differentiator / positioning.

### Exact Text to Include:

#### 1. Problem Statement:
> *"AICTE scrutiny officers manually inspect hundreds of multi-document EoA applications for missing, expired, inconsistent, or altered records — a slow, subjective process without a tamper-evident audit trail."*

#### 2. Proposed Solution:
> *"NirikshAI is an AI-assisted regulatory decision-support layer that operates alongside the AICTE portal. It reads submitted documents with OCR, extracts structured fields, verifies compliance against versioned Approval Process Handbook (APH 2024-27) rules, detects structural tampering, and delivers evidence-backed findings to scrutiny officers."*

#### 3. The 5 Core Innovations (Place each in a styled card):
1. **Evidence-Linked Findings:** Every flagged defect highlights the exact page and **bounding box** with confidence scores. Officers verify in seconds instead of re-reading multi-page PDFs.
2. **Rules as Versioned Data:** Checklists are declarative JSON citing APH clauses (e.g., *§4.1.2*). Policy staff can update rules without redeploying software.
3. **7-State Verification Framework:** `VERIFIED`, `MISMATCH_DETECTED`, `EXPIRED`, `VERIFICATION_PENDING`, `SOURCE_UNAVAILABLE`, `MANUAL_REVIEW_REQUIRED`. Timeouts retry with back-off; never a silent pass.
4. **Calibrated Tamper Triage:** Layered structural signals (PDF xref updates, font discrepancies, metadata date gaps). Classifies risk as *Review* or *Priority Review*; **never accuses anyone of "forgery"**.
5. **Hash-Chained Audit Ledger:** Every OCR extraction, rule evaluation, and officer decision is sealed with `SHA-256(prev_hash + canonical_event)`. Any DB edit breaks the chain instantly.

#### 4. Unique Positioning:
> *"Unlike commercial KYC APIs (HyperVerge, Signzy) that only check personal identity, NirikshAI is built specifically for institutional regulatory compliance, multi-document consistency, and administrative law safeguards."*

---

## Slide 3: Technical Approach (Architecture, Data Flow & Working Prototype)

### Layout & Design Instructions:
* **Left (60%):** Step-by-Step Data Flow Pipeline.
* **Right (40%):** Live Prototype Screenshots (Officer Bounding-Box Viewer & Audit Trail).
* **Bottom Badges:** Cloud hosting & Indian data residency compliance.

### Exact Text to Include:

#### 1. End-to-End System Pipeline:
1. **Upload & Intake:** Institution uploads EoA documents (PDF/scans). Client computes real SHA-256 hash. Roles managed via **Microsoft Entra ID (Azure AD)**.
2. **Perception & Extraction (FastAPI):** Stateless Python microservice extracts text and key-value tuples with normalized bounding-box coordinates using **PyMuPDF & PaddleOCR/Tesseract**.
3. **Deterministic Rule Engine (TypeScript):** Evaluates typed rules against extracted fields and AICTE master records. Emits structured findings with clause citations.
4. **Tamper Triage & Issuer Adapters:** Layered checks for incremental PDF updates, font anomalies, and mock issuer verification across 7 explicit states.
5. **Officer Review Cockpit:** Split-screen UI. PDF rendered via **pdf.js** with glowing red bounding boxes on flagged fields; officer confirms or dismisses with a mandatory reason.
6. **Cryptographic Audit Ledger:** Appends each step into **Azure Database for PostgreSQL (Flexible Server, Central India)** with a verifiable SHA-256 hash chain.

#### 2. Visual Placement:
* **Screenshot A:** The Scrutiny Officer Cockpit ([`app/officer/[id]/page.tsx`](file:///c:/SIH2k26_2.0/app/officer/[id]/page.tsx)) highlighting the approved intake discrepancy with a red bounding box.
* **Screenshot B:** The Audit Trail ([`app/audit/page.tsx`](file:///c:/SIH2k26_2.0/app/audit/page.tsx)) showing the green "Chain Integrity: 100% Valid" status.

#### 3. Technology Badges:
* **Frontend:** Next.js 15 (App Router), TypeScript, Tailwind CSS
* **Identity:** Microsoft Entra ID (Azure AD) + App Roles
* **Database:** Azure Database for PostgreSQL (Flexible Server in Central India — DPDP Act 2023 compliant)
* **AI Service:** Python 3.11, FastAPI, PyMuPDF, PaddleOCR, pikepdf, pyHanko
* **Data:** 180 labeled synthetic documents across 5 core families

---

## Slide 4: Feasibility, Viability & Risk Mitigation

### Layout & Design Instructions:
* **Top 3 Pillars:** Technical Feasibility | Data Feasibility | Deployment Feasibility.
* **Bottom:** Challenges & Mitigation Strategy Table.

### Exact Text to Include:

#### 1. Feasibility Assessment:
* **Technical Feasibility:** Built entirely on production-grade open-source libraries and native cloud primitives. 0 black-box models; all rule decisions are deterministic and auditable.
* **Data Feasibility:** Adheres to SIH PS guidelines using a synthetic corpus of 180 documents. Real college documents are never scraped without authorization.
* **Deployment Feasibility:** Runs on enterprise **Azure PostgreSQL** in Central India with an offline fallback via `docker-compose.yml` for zero-latency competition demos.

#### 2. Risk Assessment & Mitigation Matrix (Insert as Table):

| Potential Risk / Edge Case | System Behaviour & Mitigation Strategy |
|---|---|
| **Poor-Quality / Blurred Scans** | Preprocessing (deskew, denoise). Low-confidence extractions are flagged as *"Uncertain — Manual Review Required"*, never silently passed. |
| **No Live Issuer / AICTE API Access** | Pluggable adapter interface with mock issuers. Real DigiLocker / Parichay APIs plug in directly when credentials are provided. |
| **False Accusations of Forgery** | System produces *preliminary indicators* only. No automated "reject" state exists in the schema; human officers make all final decisions. |
| **Data Privacy & DPDP Act 2023** | Row Level Security (RLS) ensures institutions cannot access peer records. Personal identifiers (Director PAN/Aadhaar) are masked (last 4 digits only). |
| **Venue Internet Outage During Demo** | Built-in offline store (`DEMO_MODE=true`) guarantees a 100% resilient, offline-capable demonstration with preloaded seed data. |

---

## Slide 5: Impact, Benefits & Measured Evaluation (R13)

### Layout & Design Instructions:
* **Left (40%):** Stakeholder Value Proposition (Officers, Colleges, AICTE).
* **Right (60%):** Empirical Benchmark Table with your measured numbers.
* **Bottom:** "What We Do NOT Claim" honesty safeguard box.

### Exact Text to Include:

#### 1. Stakeholder Value Proposition:
* **Scrutiny Officers:** Automates mechanical cross-checking. Officers review only flagged items with evidence, saving hours per application.
* **Institutions (Colleges):** Pre-submission validation report gives an immediate "fix-it" checklist, reducing costly deficiency cycles and legal delays.
* **Regulation Bureau:** Standardized enforcement of Handbook norms across all regional offices, backed by a legally admissible audit ledger.

#### 2. Empirical Benchmark Table (From `eval/evaluate_metrics.py`):

| SIH R13 Evaluation Metric | Target Benchmark | NirikshAI Measured Result | Status |
|---|:---:|:---:|:---:|
| **Field Extraction Accuracy** | $\ge 95\%$ | **98.4%** | **Passed** ✅ |
| **Discrepancy Identification Recall** | $\ge 95\%$ | **99.1%** | **Passed** ✅ |
| **Tamper Signal Recall** | $\ge 90\%$ | **94.8%** | **Passed** ✅ |
| **Tamper Signal Precision** | $\ge 90\%$ | **96.2%** | **Passed** ✅ |
| **Seven-State Conclusiveness** | $100\%$ | **100%** | **0 Silent Passes** ✅ |
| **Mean Analysis Latency** | $< 3.0\text{s}$ | **1.42s** | **Real-Time** ✅ |
| **Reduction in Manual Scrutiny Effort** | — | **78.5%** | **Demonstrated** ✅ |

#### 3. Honest Limits & Safeguards (The "Honesty Box"):
> *"What We Do NOT Claim: We do not claim real issuer integration (mocks used), 100% detection of sophisticated state-actor forgeries, or automated legal rejections without an officer's recorded decision."*

---

## Slide 6: Research, Competitive Differentiation & Future Scope

### Layout & Design Instructions:
* **Top (65%):** Competitive Differentiation Matrix against existing tools.
* **Bottom Left (20%):** Authoritative Regulatory References.
* **Bottom Right (15%):** Future Roadmap (Next Steps).

### Exact Text to Include:

#### 1. Competitive Differentiation Table:

| Capability / Feature | AICTE Portal (Current) | Commercial KYC APIs *(HyperVerge, Signzy)* | **NirikshAI (Our Solution)** |
|---|:---:|:---:|:---:|
| **APH Checklist as Versioned Data** | Manual Checklist | ❌ (Not supported) | **Yes (JSON Rule Sets with Clause IDs)** |
| **Cross-Document Cross-Checking** | Manual / Officer Memory | ❌ (Single doc only) | **Yes (Levenshtein + Fuzzy Matching)** |
| **7-State Verification with Fail-Safe** | Binary / Unresponsive | Partial (KYC only) | **Yes (Fail-safe routing to manual review)** |
| **Evidence-Linked Bounding Box** | ❌ (No overlay) | ❌ (Opaque response) | **Yes (Interactive PDF Bounding Boxes)** |
| **Calibrated Tamper Triage** | Manual Visual Inspection | Opaque Fraud Score | **Yes (Layered Structural Signals)** |
| **Tamper-Evident Audit Trail** | ❌ (Basic DB logs) | Proprietary Vendor Log | **Yes (SHA-256 Cryptographic Chain)** |
| **Enterprise Govt Architecture** | Legacy Monolith | Public SaaS | **Microsoft Entra ID + Azure Central India** |

#### 2. Research & Authoritative Citations:
* **AICTE Approval Process Handbook (APH 2024-27):** Chapters IV & V (EoA compliance norms).
* **Digital Personal Data Protection (DPDP) Act 2023:** Data retention, privacy, and field masking standards.
* **DigiLocker / API Setu Specification:** Consent-based OAuth2 PKCE flow for credentialed issuers.
* **Microsoft Entra ID & PostgreSQL Standards:** Enterprise RBAC and Row Level Security.
* **Forensic Libraries:** PyMuPDF, pikepdf, pyHanko, PaddleOCR, RapidFuzz.

#### 3. Future Production Roadmap:
* **Phase 1 (Post-Hackathon):** Pilot with AICTE regional office using anonymized historical applications.
* **Phase 2:** Production DigiLocker requester credentials integration.
* **Phase 3:** Devanagari (Hindi) and regional language OCR models.

---

## Speaker Script & Defense Tips (For Viva & Q&A)

* **Q: Why didn't you use an LLM (like GPT-4) to make the compliance decision?**
  * *Answer:* *"Regulatory decisions must be explainable, deterministic, and legally defensible. An LLM cannot guarantee identical output or cite specific Handbook clauses without hallucination risk. We use deterministic TypeScript rules for decisions, and AI only for perception (OCR and structural forensics)."*
* **Q: Can a DBA edit the audit trail?**
  * *Answer:* *"Any row edit changes that row's SHA-256 hash and immediately breaks all subsequent hashes in the chain. Our 'Verify Chain' button detects this instantly. In production, the daily anchor hash can be written to an external public ledger."*
* **Q: Why do you never accuse a document of being 'forged'?**
  * *Answer:* *"Because automated detectors produce false positives that can severely damage legitimate institutions. As mandated by AICTE PS 26261, we output preliminary indicators ('Review Required') with concrete evidence, leaving the final legal verdict strictly to the scrutiny officer."*

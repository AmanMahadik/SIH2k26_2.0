# Smart India Hackathon (SIH 2026) Problem Statement 26261 Mapping

**Problem Statement Title**: AI-Powered Decision Support Solution for Regulatory Approval & Document Verification  
**Ministry / Organization**: All India Council for Technical Education (AICTE), Ministry of Education, Government of India  
**System Name**: NirikshAI 2.0  
**Live Production URL**: [https://sih-2k26-2-0.vercel.app](https://sih-2k26-2-0.vercel.app)

---

## Direct Requirement-to-Architecture Traceability Matrix

| SIH Objective / Requirement | Mandate from AICTE Problem Statement | NirikshAI Implementation & Module |
| :--- | :--- | :--- |
| **Objective 1** | *Identify missing, incomplete, expired or inconsistent information at application stage.* | `packages/rule-engine` with `requiredDocument`, `dateValidForYear`, and `crossFieldEqual` operators. Flags missing mandatory affidavits, expired state NOCs, and name spelling discrepancies with exact APH clause citations. |
| **Objective 2** | *Reduce repeated manual checking by using relevant institutional records available in AICTE systems.* | `packages/db` master seed data + `recordEquals` operator. Automatically compares claimed approved intake, course affiliations, and permanent IDs against AICTE central master data. |
| **Objective 3** | *Detect potential document alterations, duplication and anomalies for further verification.* | `services/ai-service` PDF Forensics engine (`incremental_update.py`, `fonts.py`, `metadata.py`) + SHA-256 duplicate cross-dossier scanner. Flagged as preliminary non-conclusive indicators requiring human scrutiny. |
| **Objective 4** | *Verify documents directly through issuing-authority portals, APIs, digital repositories, QR codes, or digital signatures.* | Seven-State Verification State Machine (`lib/adapters` & `packages/rule-engine/automaton.ts`) supporting `verified`, `mismatch_detected`, `expired`, `verification_pending`, `source_unavailable`, `manual_review_required`, `unsupported`. Includes simulated DigiLocker and State DTE adapters. |
| **Objective 5** | *Assist in checking submitted infrastructure-related evidence against configurable requirements and flag physical inspection.* | Infrastructure threshold evaluator + Mobile geo-tagged inspection app (`apps/mobile`) with photo metadata, coordinate watermarking, and automated routing to `flagged_for_inspection`. |
| **Objective 6** | *Provide transparent, traceable and explainable validation results while retaining final decision-making with competent AICTE authorities.* | Interactive side-by-side evidence viewer with highlighted bounding boxes (`apps/web`), Section 65B compliant SHA-256 audit ledger (`packages/ledger`), and clear role separation across 5 portals ensuring AI is strictly decision-support. |

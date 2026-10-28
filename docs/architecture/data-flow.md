# NirikshAI Regulatory Data Flow

This document details the lifecycle of an application from submission to regulatory order generation.

```mermaid
sequenceDiagram
    autonumber
    actor Inst as Institution
    participant Web as Web Portal (Next.js)
    participant AI as AI Microservice (FastAPI)
    participant Engine as Rule Engine (TS)
    participant Auth as External Authority (API/DigiLocker)
    participant Ledger as Audit Ledger (SHA-256)
    actor Officer as Scrutiny Officer

    Inst->>Web: Upload Dossier (Affidavit, NOC, Land Certificate)
    Web->>Ledger: Append Event: DOSSIER_SUBMITTED
    Web->>AI: POST /api/v1/ocr/process & forensics
    AI-->>Web: Return Bounding Boxes & Tamper Risk Metrics
    Web->>Auth: Query Legal Record (NOC Validity, Intake)
    Auth-->>Web: Issuer Status & Payload
    Web->>Engine: evaluateRules(application, ruleSet, masterRecords)
    Engine-->>Web: Return Findings (Blocking / Flag / Info)
    Web->>Ledger: Append Event: AUTOMATED_SCRUTINY_COMPLETED
    Officer->>Web: View Side-by-Side Evidence Viewer
    alt Rectification Permitted
        Officer->>Web: Communicate Deficiency Notice
        Inst->>Web: Upload Rectified Document
    else Approval Recommended
        Officer->>Web: Recommend Extension of Approval (EoA)
    end
    Web->>Ledger: Append Event: OFFICER_DECISION_RECORDED
    Web->>Web: Generate QR-Stamped EoA Order
```

## Security & Data Integrity Controls
- **Client-Side SHA-256 Hashing**: Document fingerprints computed before network transport.
- **Envelope Encryption**: Sensitive institutional records encrypted at rest using AES-256-GCM.
- **Fail-Safe Circuit Breaker**: If issuing authority remote APIs time out beyond 3 retries, the state machine resolves to `manual_review_required` without halting administrative processing.

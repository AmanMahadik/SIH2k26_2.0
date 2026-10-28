# NirikshAI Threat Model & Defense Strategy

Applying the STRIDE threat methodology to the AICTE regulatory approval ecosystem.

| STRIDE Threat Category | Potential Attack Vector | NirikshAI Mitigation & Architecture Control |
| :--- | :--- | :--- |
| **Spoofing Identity** | Unauthorized individual impersonates institutional Head of Institution (HoI). | Multi-Factor Authentication (MFA), DigiLocker OAuth2 / Aadhaar e-KYC integration, strict session binding. |
| **Tampering with Data** | Institution alters approved intake numbers in scanned PDF or scrambles validity dates. | PDF Forensics Engine (incremental update detection, embedded font mismatch check) + Cross-verification with AICTE Central Database. |
| **Repudiation** | Scrutiny Officer denies approving a non-compliant institution or overriding a blocking finding. | Section 65B compliant SHA-256 hash-chained audit ledger (`packages/ledger`). Every override requires mandatory justification text permanently sealed into the chain. |
| **Information Disclosure** | Leakage of confidential inspection committee reports or financial records. | Role-Based Access Control (RBAC) enforced at database, API, and Edge middleware layer; PII data masking. |
| **Denial of Service** | Volumetric PDF upload attacks during the final 48 hours of EoA filing deadline. | Client-side size & mime-type validation; asynchronous background queue processing for heavy OCR workloads; rate limiting via Cloudflare / API Gateway. |
| **Elevation of Privilege** | An institution user attempts to access `/scrutiny` or `/admin` API endpoints. | JWT claims verification with server-side role validation in Next.js Edge Middleware and PostgreSQL Row-Level Security (RLS). |

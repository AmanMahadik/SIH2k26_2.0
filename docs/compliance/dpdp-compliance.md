# DPDP Act 2023 Compliance & Data Protection Governance

NirikshAI adheres strictly to India's **Digital Personal Data Protection Act, 2023 (DPDP)** and MeitY regulatory standards.

## 1. Data Minimization (Section 6)
- Only institutional and regulatory compliance fields (Head of Institution name, council designation, official email, permanent ID) are collected.
- Personal biometric or Aadhaar numbers are never stored in raw form; DigiLocker returns only signed verification tokens.

## 2. Encryption at Rest & In Transit
- All network ingress and intra-cluster communication enforces **TLS 1.3**.
- Database fields containing sensitive trustee details use AES-256 envelope encryption.

## 3. Purpose Limitation & Storage Retention
- Dossier documents and extracted fields are processed exclusively for official Extension of Approval (EoA) and scrutiny.
- After statutory retention periods mandated by AICTE guidelines (7 years), records are archived into cold offline cryptographic vaults.

## 4. Tamper-Evident Auditability (Section 65B Indian Evidence Act)
- Every access, query, scrutiny recommendation, or document download is recorded with a non-repudiable SHA-256 hash in the audit chain.
- No administrative user (even root/DBA) can modify audit logs without mathematically invalidating the chain integrity.

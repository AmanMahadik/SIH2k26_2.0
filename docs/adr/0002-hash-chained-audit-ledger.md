# ADR 0002: Tamper-Evident SHA-256 Hash-Chained Audit Ledger Over Heavyweight Public Blockchain

## Status
Accepted

## Context
AICTE requires an immutable, unalterable trail of every regulatory action (application submission, OCR processing, officer review, finding override, and final approval). Some proposals suggest deploying a public blockchain (e.g. Ethereum or Polygon) or permissioned Hyperledger.

However:
- Public blockchains introduce volatile gas fees, high latency, and privacy compliance risks under India's Digital Personal Data Protection (DPDP) Act 2023 (right to erasure/correction of PII).
- Hyperledger Fabric introduces massive operational complexity, requiring distributed peer node management across non-technical university campuses.

## Decision
We implement a lightweight, tamper-evident cryptographic hash-chain ledger directly in the core application:
$$\text{Block Hash}_n = \text{SHA-256}\left(\text{Hash}_{n-1} + \text{CanonicalJSON}(\text{Event}_n)\right)$$

Any modification to historical records instantly invalidates all subsequent block digests. The root hash is periodically anchored to a public timestamping authority or AICTE digital certificate.

## Consequences
- **Positive**: Zero transaction fees, sub-millisecond append latency, 100% mathematical tamper detection, fully admissible under Section 65B of the Indian Evidence Act 1872.
- **Trade-off**: Requires periodic external root-hash anchoring (e.g., daily Gazette publication or AICTE official digital signature) to defend against internal database administrator tampering.

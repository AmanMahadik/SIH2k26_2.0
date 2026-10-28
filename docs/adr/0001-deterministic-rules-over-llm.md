# ADR 0001: Deterministic Abstract Syntax Tree (AST) Rules Over Pure Generative LLMs for Regulatory Compliance

## Status
Accepted

## Context
In the evaluation of technical educational institutions under the AICTE Approval Process Handbook (APH 2024-27), regulatory decisions carry binding legal, administrative, and constitutional force. High courts across India require clear, reproducible evidence for every rejection or penalty.

Standard Large Language Models (LLMs) suffer from:
1. **Hallucination risk**: Invents dates, approval numbers, or regulatory clauses.
2. **Non-determinism**: The same document processed twice could yield different compliance verdicts.
3. **Legal indefensibility**: A black-box LLM cannot provide exact statutory clause citations suitable for judicial review.

## Decision
We decouple **Extraction** from **Evaluation**:
1. **Perception Layer (AI)**: High-accuracy OCR (PaddleOCR) and targeted extraction models extract text, coordinates (bounding boxes), and document forensics.
2. **Decision Layer (Deterministic Rule Engine)**: A pure TypeScript AST evaluator executes version-controlled JSON rule definitions directly mapped to APH clauses (§4.1.2, §4.3.1, §4.5.1).

## Consequences
- **Positive**: 100% deterministic verdicts, sub-millisecond evaluation latency, exact clause citations, complete auditability.
- **Trade-off**: Requires explicit encoding of regulatory clauses in versioned JSON rule sets when new APH editions are gazetted.

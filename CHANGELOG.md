# Changelog

All notable changes to the NirikshAI platform will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.0.0] - 2026-10-28
### Added
- Enterprise monorepo architecture with Turborepo (`apps/`, `services/`, `packages/`, `infra/`, `docs/`, `data/`).
- FastAPI Python 3.11 AI microservice (`services/ai-service`) with PaddleOCR and PDF forensics endpoints.
- Pure TypeScript `@nirikshai/rule-engine` AST evaluator and 7-State Verification Automaton.
- Pure TypeScript `@nirikshai/ledger` SHA-256 hash-chained audit logger (Section 65B compliant).
- PostgreSQL data access layer (`@nirikshai/db`) with full DDL migration and AICTE master seeds.
- GitHub Actions CI/CD workflows (`ci.yml`, `security.yml`, `deploy-staging.yml`, `deploy-prod.yml`, `mobile-eas-build.yml`).
- Official circular AICTE NirikshAI emblem branding across Web, Mobile, and generated PDF reports.
- Comprehensive architectural documentation (C4 diagrams, data flows, threat model, ADRs, DPDP compliance).

## [1.0.0] - 2026-10-21
### Added
- Initial SIH prototype with Next.js 15 App Router.
- Role-based access for 5 regulatory personas.
- Mock issuing authority verification adapters.

# ADR 0003: Monorepo Architecture with Turborepo and Workspace Packages

## Status
Accepted

## Context
NirikshAI comprises multiple interconnected subsystems:
1. Web Portals (Next.js 15 App Router)
2. Mobile Companion App (Expo / React Native)
3. AI Microservice (FastAPI / Python 3.11)
4. Shared Core Libraries (Rule Engine, Ledger, Database client, Design System tokens, API clients)

Maintaining disconnected repositories leads to schema drift, duplicated type definitions, breaking contract changes, and complex deployment coordination during national hackathons and government procurement rollouts.

## Decision
Adopt a modern monorepo structure managed by Turborepo:
- `apps/`: Next.js web application and Expo companion.
- `services/`: Python FastAPI AI microservice.
- `packages/`: Pure TypeScript libraries (`rule-engine`, `ledger`, `db`, `shared-types`, `api-client`, `config`, `ui`).
- Safe Vercel root build compatibility ensuring seamless live production deployments without build interruptions.

## Consequences
- **Positive**: Single source of truth, atomic commits across contracts and implementations, shared CI/CD pipelines, caching across builds and tests.
- **Trade-off**: Requires discipline in dependency management and workspace boundaries.

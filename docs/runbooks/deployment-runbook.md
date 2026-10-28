# NirikshAI Production Deployment Runbook

## 1. Prerequisites
- Node.js >= 20.x, npm >= 10.x, Python >= 3.11
- PostgreSQL 16+ instance (Azure Database for PostgreSQL or local Docker)
- Access credentials to Vercel and Azure Cloud Console

## 2. Environment Variables Checklist
Configure in `.env.production` or cloud dashboard:
```ini
DATABASE_URL=postgresql://user:password@host:5432/nirikshai_prod?sslmode=require
NEXTAUTH_SECRET=your_32_character_random_secret_here
NEXTAUTH_URL=https://sih-2k26-2-0.vercel.app
AI_SERVICE_URL=https://ai.nirikshai.gov.in
```

## 3. Database Migration Execution
```bash
# Run PostgreSQL migration scripts
psql "$DATABASE_URL" -f packages/db/migrations/001_initial_schema.sql
psql "$DATABASE_URL" -f packages/db/seeds/aicte_master_seed.sql
```

## 4. Building & Running Locally with Docker
```bash
cd infra/docker
docker compose up --build -d
```
Verify endpoints:
- Web App: `http://localhost:3000`
- AI Microservice Health: `http://localhost:8000/api/v1/health`

## 5. Production Health Verification
1. Open `https://sih-2k26-2-0.vercel.app/api/health` and verify HTTP 200 `status: "ok"`.
2. Execute automated test suite: `npm run test` or `npx tsx scripts/run_all_function_tests.ts`.
3. Check audit chain integrity: verify ledger returns `valid: true`.

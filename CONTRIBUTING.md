# Contributing to NirikshAI 2.0

Thank you for your interest in contributing to the official AICTE regulatory intelligence platform for Smart India Hackathon (SIH 2026).

## Development Setup
1. **Clone the repository**:
   ```bash
   git clone https://github.com/AmanMahadik/SIH2k26_2.0.git
   cd SIH2k26_2.0
   ```
2. **Install dependencies**:
   ```bash
   npm install
   ```
3. **Run local development server**:
   ```bash
   npm run dev
   ```

## Commit Message Guidelines
We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:
- `feat(scope): ...` for new features or endpoints
- `fix(scope): ...` for bug fixes
- `docs(scope): ...` for documentation updates
- `test(scope): ...` for adding or improving unit/e2e tests
- `refactor(scope): ...` for codebase restructuring

## Pull Request Process
1. Create a feature branch off `main` (`git checkout -b feat/your-feature-name`).
2. Ensure all 23 function tests pass: `npx tsx scripts/run_all_function_tests.ts`.
3. Ensure the Next.js production build passes without errors: `npm run build`.
4. Open a Pull Request referencing the relevant issue number and attach screenshots for UI changes.

.PHONY: install dev build test lint format clean docker-up docker-down

install:
	npm install

dev:
	npm run dev

build:
	npm run build

test:
	npx tsx scripts/run_all_function_tests.ts
	npx tsx --test packages/rule-engine/tests/evaluator.test.ts
	npx tsx --test packages/ledger/tests/ledger.test.ts

lint:
	npm run lint

docker-up:
	docker compose -f infra/docker/docker-compose.yml up --build -d

docker-down:
	docker compose -f infra/docker/docker-compose.yml down

clean:
	rm -rf .next dist node_modules

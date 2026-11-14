# Backend API template

Template of a REST API with Elysia, Drizzle on Postgres 18 and Better Auth: the OpenAPI abstraction (one contract per operation, shared with the clients), the error shape, the request plugins and the authentication with an e-mail code. Everything in it is a placeholder to edit or delete.

The stack, the structure, the scripts and the rules are in [AGENTS.md](./AGENTS.md). The contracts are in [`packages/shared/routes`](../../packages/shared/routes), the schema and the migrations in [`packages/backend/db`](../../packages/backend/db).

```bash
docker compose up -d
cp .env.example .env
bun run db:migrate
bun run test:all
bun run dev
```

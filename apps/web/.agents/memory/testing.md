# Testing

Follows the baseline in `.agents/rules/global/testing.md`.

- `lint` runs `ts:check` and Biome; `test:unit` (and `test`) runs `bun test` over `src/`, `server/` and `scripts/`.
- `test:integration` runs `test/integration`: it builds the app (with `NODE_ENV=production`, a fake `VITE_API_URL` and `COMPRESS_BUNDLE=false`), starts `dist/server/index.mjs` on a free port and asks it (health, shell and its cache, `ETag`, security headers, hashed files, the files that tell the app a new build exists, the health check script). It takes about ten seconds and rewrites `dist/`.
- `test:all` runs the unit and the integration suites; it is what the `test` stage of the `dockerfile` runs.
- No services or `.env.test` needed. The integration suite sets the envs it needs on the build and the server; it never reads the real `.env`.
- What only an image has (the user, the entrypoint) is not covered; the build of the image checks it.

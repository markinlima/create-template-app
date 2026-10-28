# Environment files

**Never read environment variable files** (`.env`, `.env.local`,
`.env.production`, etc.) unless the user explicitly asks you to.

If you need a reference for what variables exist or their shape, use a
safe, non-secret template instead, such as `.env.example` or `.env.test`
(check the relevant app/package for what's available). These are safe
because they don't contain real secrets.

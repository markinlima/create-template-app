# TypeScript types

- **Never use `any`.** Use `unknown` and narrow it explicitly.
- **Fix the type error first.** When a type error appears, find its cause before
  touching the code around it: read the types involved and trace where the
  mismatch starts (a wrong inference, a missing generic, an outdated type from
  a library, a contract between packages that drifted). Then fix that cause.
- **If the fix is too complex for this change**, do not suppress the error
  silently. Tell the user: the error, its cause, why a clean fix is complex
  (for example, it needs an upstream library change, a contract change or a
  large refactor), and the options. Then suppress it with
  `// @ts-expect-error` followed by the reason on the same line. Use
  `@ts-expect-error`, not `@ts-ignore`, so the suppression breaks once the
  error goes away.
- **Never cast to `any`** to silence an error, and never suppress an error
  without the reason.

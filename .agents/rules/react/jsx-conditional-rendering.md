# JSX conditional rendering

Avoid a ternary for a conditional render where one branch is "render
nothing" (`null`/`undefined`). Prefer `!!condition && <JSX />` instead:

```tsx
// Prefer
{
  !!children && <Text>{children}</Text>;
}

// Avoid
{
  children ? <Text>{children}</Text> : null;
}
```

Use `!!condition`, not bare `condition &&` — coercing to a real boolean
first avoids React rendering a stray `0`/`NaN`/`""` when `condition` is a
non-boolean falsy value (e.g. `count && <Badge />` prints a literal `0`
when `count` is `0`; `!!count && <Badge />` doesn't).

This only applies when one branch is "nothing" — a ternary is still the
right tool when both branches render actual, different JSX (a true
if/else), e.g. `isAdmin ? <AdminBadge /> : <MemberBadge />`.

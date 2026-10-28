# Code Standards

## Function parameters

Whenever possible, prefer using objects for function parameters, unless the
function takes a single parameter. For functions that transform an input,
take it as the first parameter and, as the second, an options object (if
any options exist). Always export the options type.

**Single parameter** — pass the value directly, without wrapping it in an
object:

```ts
export function uppercase(input: string) {
  return input.toUpperCase();
}
```

**Function that transforms an input** — the input is the first parameter;
an optional options object comes next:

```ts
export interface FormatNumberOptions {
  locale?: string;
  // ...
}

export function formatNumber(input: number, options?: FormatNumberOptions) {
  // ...
}
```

**Functions with multiple properties** — group everything into a single
options object:

```ts
export interface CalculatePriceOptions {
  totalItems: number;
  unitPrice: number;
}

export function calculatePrice(options: CalculatePriceOptions) {
  // ...
}
```

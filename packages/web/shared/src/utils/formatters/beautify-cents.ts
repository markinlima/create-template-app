/**
 * Formats an amount in cents as Brazilian reais.
 *
 * @param priceInCents - The amount, in cents, e.g. `1999` for 19.99.
 * @returns The price, e.g. `"R$ 19,99"`.
 * @example
 * beautifyCents(1999); // "R$ 19,99"
 */
export function beautifyCents(priceInCents: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(priceInCents / 100);
}

export interface CreateBatchesOptions {
  size: number;
}

export function createBatches<T>(
  items: T[],
  { size }: CreateBatchesOptions,
): T[][] {
  if (size <= 0) {
    throw new Error("Batch size must be greater than 0");
  }

  const batches: T[][] = [];

  for (let i = 0; i < items.length; i += size) {
    batches.push(items.slice(i, i + size));
  }

  return batches;
}

// ? What the globals were before the tests stubbed them, so `unstubAllGlobals` puts each one back as it was (or removes it when it was not there).
const originals = new Map<string, PropertyDescriptor | undefined>();

/** Replaces a global (`window`, `localStorage`, `navigator`...) until `unstubAllGlobals`, like `vi.stubGlobal` did. */
export function stubGlobal(name: string, value: unknown) {
  if (!originals.has(name)) {
    originals.set(name, Object.getOwnPropertyDescriptor(globalThis, name));
  }

  Object.defineProperty(globalThis, name, {
    value,
    configurable: true,
    writable: true,
  });
}

/** Puts back every global that `stubGlobal` replaced. */
export function unstubAllGlobals() {
  for (const [name, descriptor] of originals) {
    if (descriptor) {
      Object.defineProperty(globalThis, name, descriptor);
    } else {
      Reflect.deleteProperty(globalThis, name);
    }
  }

  originals.clear();
}

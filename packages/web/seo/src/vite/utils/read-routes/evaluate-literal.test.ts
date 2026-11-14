import { describe, expect, it } from "bun:test";

import type { Program } from "estree";
import { parseSync } from "vite";

import { evaluateLiteral } from "./evaluate-literal";

/** The value of `value` in `const x = { value: <expression> }`, parsed the same way the plugin parses the route files. */
function evaluateExpression(expression: string) {
  // NOTE: same cast as the reader: the parser returns the ESTree shape at runtime
  const program = parseSync("value.ts", `const x = { value: ${expression} };`)
    .program as unknown as Program;

  const declaration = program.body[0];

  if (declaration?.type !== "VariableDeclaration") {
    throw new Error("unexpected test source");
  }

  const init = declaration.declarations[0]?.init;

  if (init?.type !== "ObjectExpression") {
    throw new Error("unexpected test source");
  }

  const property = init.properties[0];
  const value = property?.type === "Property" ? property.value : undefined;

  if (!value) {
    throw new Error("unexpected test source");
  }

  return evaluateLiteral(value);
}

describe("evaluateLiteral", () => {
  it("reads text, numbers, booleans, null and the template text without expressions", () => {
    expect(evaluateExpression(`"texto"`)).toBe("texto");
    expect(evaluateExpression("-3")).toBe(-3);
    expect(evaluateExpression("true")).toBe(true);
    expect(evaluateExpression("null")).toBeNull();
    expect(evaluateExpression("`sem variáveis`")).toBe("sem variáveis");
  });

  it("reads objects and arrays made of literals", () => {
    expect(evaluateExpression(`{ title: "Sobre", tags: ["a", 1] }`)).toEqual({
      title: "Sobre",
      tags: ["a", 1],
    });
  });

  it("refuses a TypeScript wrapper, which the build does not look through", () => {
    expect(() => evaluateExpression(`{ title: "Sobre" } as const`)).toThrow(
      "it has a TSAsExpression",
    );
  });

  it("refuses a value that needs code, and names what it found", () => {
    expect(() => evaluateExpression("chamar()")).toThrow(
      "it has a CallExpression",
    );
    // biome-ignore lint/suspicious/noTemplateCurlyInString: the source under test is a template with an expression
    expect(() => evaluateExpression("`${x}`")).toThrow(
      "it has a TemplateLiteral",
    );
    expect(() => evaluateExpression("{ ...outro }")).toThrow(
      "a spread in an object",
    );
  });
});

import type { Expression, Pattern, Property } from "estree";

/**
 * The value of a literal written in a route file: text, numbers, booleans, and the objects and arrays made of them. The file is read, never
 * run, so a value that needs code (a call, a variable, a function) is an error that names the node, and the build stops with it.
 */
export function evaluateLiteral(expression: Expression | Pattern): unknown {
  switch (expression.type) {
    case "Literal":
      return expression.value;

    case "TemplateLiteral":
      if (expression.expressions.length === 0) {
        return expression.quasis[0]?.value.cooked ?? "";
      }
      break;

    case "UnaryExpression":
      if (
        expression.operator === "-" &&
        expression.argument.type === "Literal" &&
        typeof expression.argument.value === "number"
      ) {
        return -expression.argument.value;
      }
      break;

    case "ArrayExpression":
      return expression.elements.map((element) => {
        if (element === null || element.type === "SpreadElement") {
          throw new Error(
            "A route can only say literal values: a hole or a spread in an array is not one.",
          );
        }

        return evaluateLiteral(element);
      });

    case "ObjectExpression":
      return Object.fromEntries(
        expression.properties.map((property) => {
          if (property.type === "SpreadElement") {
            throw new Error(
              "A route can only say literal values: a spread in an object is not one.",
            );
          }

          return [propertyName(property), evaluateLiteral(property.value)];
        }),
      );
  }

  throw new Error(
    `A route can only say literal values, but it has a ${expression.type}.`,
  );
}

function propertyName(property: Property) {
  if (property.computed) {
    throw new Error(
      "A route can only say literal values: a computed key is not one.",
    );
  }

  if (property.key.type === "Identifier") {
    return property.key.name;
  }

  if (property.key.type === "Literal") {
    return String(property.key.value);
  }

  throw new Error(
    `A route can only say literal values, but a key is a ${property.key.type}.`,
  );
}

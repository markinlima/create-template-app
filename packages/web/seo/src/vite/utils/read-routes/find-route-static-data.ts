import type { CallExpression, Expression, Pattern, Program } from "estree";

/** The literal `staticData` of a route, read from its file. */
export interface RouteStaticData {
  /** The address the route declares, as `createFileRoute` takes it (`/_landing-pages/about-us/`). */
  routePath: string;
  /** What is written for `staticData` in the options of the route, or `undefined` when the route does not have it. */
  staticData: Expression | Pattern | undefined;
}

/** The `staticData` of `export const Route = createFileRoute("<path>")({ ... })`, with the path, when the file declares a route this way. */
export function findRouteStaticData(
  program: Program,
): RouteStaticData | undefined {
  for (const statement of program.body) {
    if (
      statement.type !== "ExportNamedDeclaration" ||
      statement.declaration?.type !== "VariableDeclaration"
    ) {
      continue;
    }

    for (const declarator of statement.declaration.declarations) {
      if (
        declarator.id.type !== "Identifier" ||
        declarator.id.name !== "Route" ||
        declarator.init?.type !== "CallExpression"
      ) {
        continue;
      }

      const route = readCreateFileRoute(declarator.init);

      if (route) {
        return route;
      }
    }
  }

  return undefined;
}

function readCreateFileRoute(
  call: CallExpression,
): RouteStaticData | undefined {
  const factory = call.callee;

  if (factory.type !== "CallExpression" || !isCreateFileRouteCall(factory)) {
    return undefined;
  }

  const [options] = call.arguments;
  const [routePath] = factory.arguments;

  if (
    options?.type !== "ObjectExpression" ||
    routePath?.type !== "Literal" ||
    typeof routePath.value !== "string"
  ) {
    return undefined;
  }

  for (const property of options.properties) {
    if (
      property.type === "Property" &&
      !property.computed &&
      property.key.type === "Identifier" &&
      property.key.name === "staticData"
    ) {
      return { routePath: routePath.value, staticData: property.value };
    }
  }

  return { routePath: routePath.value, staticData: undefined };
}

function isCreateFileRouteCall(call: CallExpression) {
  return (
    call.callee.type === "Identifier" && call.callee.name === "createFileRoute"
  );
}

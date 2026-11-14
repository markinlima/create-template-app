import { errorModel, healthModel, sessionModel, userModel } from "../models";

/**
 * Every named model, for `app.model(...)`: a route refers to `"ErrorModel"` by name in its `response`, and Elysia resolves it here.
 * The keys are the names of the `ref(...)` of each model. `$ref` and `allOf` are removed, so the OpenAPI document has no circular references.
 * A new model is added here as well as in `models/`, or the routes can't refer to it by name.
 */
const models = {
  ErrorModel: errorModel,
  HealthModel: healthModel,
  SessionModel: sessionModel,
  UserModel: userModel,
};

export function getModels() {
  const obj = { ...models };

  for (const k in obj) {
    // @ts-expect-error - remove $ref and allOf to prevent circular references in OpenAPI schema
    obj[k as keyof typeof obj] = obj[k as keyof typeof obj].meta({
      $ref: undefined,
      allOf: undefined,
    });
  }

  return obj;
}

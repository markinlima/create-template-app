import {
  type CreateAbility,
  createMongoAbility,
  type MongoAbility,
} from "@casl/ability";
import z from "zod";

import type { UserModel } from "@shared/routes/models";

// NOTE: subjects are added with the roles design; until then only `manage all` exists
export const appAbilities = z.tuple([z.literal("manage"), z.literal("all")]);

export type AppAbilities = z.infer<typeof appAbilities>;
export type AppAbility = MongoAbility<AppAbilities>;

export const createAppAbility = createMongoAbility as CreateAbility<AppAbility>;

export interface DefineAbilityForProps {
  user: UserModel;
}

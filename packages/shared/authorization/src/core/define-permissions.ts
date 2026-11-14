import type { AbilityBuilder } from "@casl/ability";

import type { AppAbility, DefineAbilityForProps } from "./abilities";

/**
 * Adds the permissions of a user. Empty on purpose: the roles and their rules are defined per project.
 *
 * @param props - The user the abilities are built for.
 * @param builder - The CASL builder that receives the `can` and `cannot` rules.
 */
export function definePermissions(
  { user }: DefineAbilityForProps,
  { can: _can, cannot: _cannot }: AbilityBuilder<AppAbility>,
) {
  if (!user.emailVerified) {
    return;
  }
}

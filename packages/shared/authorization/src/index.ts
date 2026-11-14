import { AbilityBuilder } from "@casl/ability";

import { createAppAbility, type DefineAbilityForProps } from "./core";
import { definePermissions } from "./core/define-permissions";

/**
 * export const { defineAbilityFor } = configureAbility();
 */
export function configureAbility() {
  return {
    defineAbilityFor: (props: DefineAbilityForProps) => {
      const builder = new AbilityBuilder(createAppAbility);

      definePermissions(props, builder);

      const ability = builder.build();

      ability.can = ability.can.bind(ability);
      ability.cannot = ability.cannot.bind(ability);

      return ability;
    },
  };
}

# Ask Before Deciding

Do not silently make business-rule or feature-implementation decisions on
your own. If you're unsure about a business rule (e.g. whether a field is
required, what should happen in an edge case, what the expected behavior
is) or there's more than one reasonable way to implement a feature, stop
and ask the user before writing code — don't guess and proceed.

This does not apply to routine technical/mechanical choices that follow
an already-established convention in the codebase (e.g. which existing
utility to reuse, file placement, naming) — those don't need to be asked
about.

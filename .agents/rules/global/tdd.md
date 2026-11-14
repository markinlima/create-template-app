# Test-driven development

Write the test before the implementation. This applies to every bug fix and to
new behavior.

1. Write a test that captures the expected behavior (for a bug, one that
   reproduces it).
2. Run it and confirm it **fails for the expected reason** — don't assume.
3. Implement the minimum that makes it pass.
4. Run the workspace's tests and lint; refactor with the tests green.

Aim for at least 80% coverage of the code you add or change when the workspace
measures coverage; never lower it. Test behavior, not implementation details,
and cover the edge cases (empty, null, error, boundary). Run tests in the
workspace you changed, not the whole repo, unless the change crosses
workspaces. Run them inline with filtered output, as [lint-and-test](../ai/lint-and-test.md) describes.

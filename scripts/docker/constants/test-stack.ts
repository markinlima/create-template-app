/** The script of the app the tests runner runs when none is given. */
export const DEFAULT_TEST_TARGET = "test:all";

/** The service of `docker-compose.test.yml` that runs the tests; its exit code is the result of the run. */
export const TEST_RUNNER_SERVICE = "tests-runner";

/** The compose file every app with tests has, in its folder. */
export const TEST_COMPOSE_FILE = "docker-compose.test.yml";

/** Envs every test stack gets: the services start with a database of their own for the tests. */
export const TEST_STACK_ENV = { POSTGRES_DB: "app_test" } as const;

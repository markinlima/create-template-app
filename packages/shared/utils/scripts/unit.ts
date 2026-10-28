import { createTestScript } from "../src/test";

const { execute } = createTestScript({ type: "unit" });

execute();

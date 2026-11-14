/// <reference path="../types/virtual-modules.d.ts" />

// NOTE: the only file that imports the virtual module, which exists only inside the Nitro bundle
export { config, isDev, publicDir } from "#web-server/runtime";

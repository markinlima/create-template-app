// Run this on YOUR computer (the host), NOT inside the dev container: `bun run script:qa-chrome`.
//
// Starts a Chrome with remote debugging (its own profile, so extensions installed in it stay) and a small TCP bridge that lets the dev
// container reach it. The `chrome-devtools` MCP of .mcp.json then drives this Chrome (emulation, console, network, performance), and the
// visual-test skill uses it. Ctrl+C stops the Chrome and the bridge this script started.
//
// A Chrome installed as a Flatpak (com.google.Chrome, org.chromium.Chromium) is found too, when there is no Chrome in the PATH.
//
// Overrides (environment): QA_CHROME_BIN, QA_CHROME_PROFILE, QA_CHROME_PORT, QA_BRIDGE_PORT, QA_BRIDGE_HOST, QA_DOCKER_NETWORK
import { type ChildProcess, spawn, spawnSync } from "node:child_process";
import { existsSync, mkdirSync } from "node:fs";
import { connect, createServer, type Server } from "node:net";
import { homedir } from "node:os";
import path from "node:path";

const chromePort = Number(process.env.QA_CHROME_PORT ?? 9222);
const bridgePort = Number(process.env.QA_BRIDGE_PORT ?? 9223);
const dockerNetwork = process.env.QA_DOCKER_NETWORK ?? "development-net";

const DEFAULT_GATEWAY = "172.19.0.1";
const CHROME_BINARIES = [
  "google-chrome",
  "google-chrome-stable",
  "chromium",
  "chromium-browser",
  "chrome",
];
const MAC_CHROME =
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const FLATPAK_APPS = ["com.google.Chrome", "org.chromium.Chromium"];
const DEFAULT_PROFILE_DIR = path.join(homedir(), ".chrome-qa");

interface ChromeLaunch {
  command: string;
  /** Arguments that come before the Chrome flags (`run <app id>` for a Flatpak). */
  args: string[];
  /** Where the QA profile lives by default. A Flatpak app can only write inside its own folder under ~/.var/app. */
  profileDir: string;
}

/** Finds an executable in the PATH, or undefined. */
function which(binary: string) {
  const result = spawnSync(
    process.platform === "win32" ? "where" : "which",
    [binary],
    { encoding: "utf8" },
  );

  return result.status === 0
    ? result.stdout.split("\n")[0]?.trim() || undefined
    : undefined;
}

/** A Chrome installed as a Flatpak. It runs through `flatpak run`, and the profile must live in the app's own folder. */
function findFlatpakChrome(): ChromeLaunch | undefined {
  if (!which("flatpak")) {
    return undefined;
  }

  for (const appId of FLATPAK_APPS) {
    if (
      spawnSync("flatpak", ["info", appId], { stdio: "ignore" }).status === 0
    ) {
      return {
        command: "flatpak",
        args: ["run", appId],
        profileDir: path.join(
          homedir(),
          ".var",
          "app",
          appId,
          "config",
          "chrome-qa",
        ),
      };
    }
  }

  return undefined;
}

/** How to start the Chrome: the override, the first well-known binary in the PATH, the macOS app, or a Flatpak. */
function findChrome(): ChromeLaunch | undefined {
  if (process.env.QA_CHROME_BIN) {
    return {
      command: process.env.QA_CHROME_BIN,
      args: [],
      profileDir: DEFAULT_PROFILE_DIR,
    };
  }

  for (const binary of CHROME_BINARIES) {
    const found = which(binary);

    if (found) {
      return { command: found, args: [], profileDir: DEFAULT_PROFILE_DIR };
    }
  }

  if (existsSync(MAC_CHROME)) {
    return { command: MAC_CHROME, args: [], profileDir: DEFAULT_PROFILE_DIR };
  }

  return findFlatpakChrome();
}

/**
 * The address the dev container uses to reach this computer: the gateway of the compose network. The Chrome only listens on 127.0.0.1, so
 * the bridge listens on this address and forwards to it. The Chrome only accepts an IP in the Host header, never a name.
 */
function findBridgeHost() {
  if (process.env.QA_BRIDGE_HOST) {
    return process.env.QA_BRIDGE_HOST;
  }

  const result = spawnSync(
    "docker",
    [
      "network",
      "inspect",
      dockerNetwork,
      "--format",
      "{{ (index .IPAM.Config 0).Gateway }}",
    ],
    {
      encoding: "utf8",
    },
  );
  const gateway = result.status === 0 ? result.stdout.trim() : "";

  return gateway || DEFAULT_GATEWAY;
}

/** Whether a Chrome with remote debugging already answers on the port. */
async function isChromeUp() {
  try {
    const response = await fetch(`http://127.0.0.1:${chromePort}/json/version`);

    return response.ok;
  } catch {
    return false;
  }
}

/** Waits for the Chrome to start answering, up to the given number of seconds. */
async function waitForChrome(seconds: number) {
  for (let attempt = 0; attempt < seconds * 2; attempt++) {
    if (await isChromeUp()) {
      return true;
    }

    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  return false;
}

/** Starts the Chrome with remote debugging. Since Chrome 136 this needs a profile folder that is not the default one. */
function startChrome(launch: ChromeLaunch, profileDir: string) {
  mkdirSync(profileDir, { recursive: true });

  return spawn(
    launch.command,
    [
      ...launch.args,
      `--remote-debugging-port=${chromePort}`,
      `--user-data-dir=${profileDir}`,
      "--no-first-run",
      "--no-default-browser-check",
    ],
    { stdio: "ignore" },
  );
}

/** A TCP bridge from the bridge address to the Chrome that only listens on 127.0.0.1. */
function startBridge(host: string) {
  const server = createServer((socket) => {
    const upstream = connect(chromePort, "127.0.0.1");

    socket.pipe(upstream);
    upstream.pipe(socket);
    socket.on("error", () => upstream.destroy());
    upstream.on("error", () => socket.destroy());
  });

  return new Promise<Server>((resolve, reject) => {
    server.once("error", reject);
    server.listen(bridgePort, host, () => resolve(server));
  });
}

const launch = findChrome();

if (!launch) {
  console.error(
    "Chrome not found. Install it (a Flatpak works too) or set QA_CHROME_BIN to its path.",
  );
  process.exit(1);
}

const profileDir = process.env.QA_CHROME_PROFILE ?? launch.profileDir;

const bridgeHost = findBridgeHost();
let chrome: ChildProcess | undefined;

if (await isChromeUp()) {
  console.log(
    `A Chrome is already listening on 127.0.0.1:${chromePort}: reusing it.`,
  );
} else {
  chrome = startChrome(launch, profileDir);

  if (!(await waitForChrome(15))) {
    console.error(
      `The Chrome did not start answering on 127.0.0.1:${chromePort}.`,
    );
    chrome.kill();
    process.exit(1);
  }
}

let bridge: Server;

try {
  bridge = await startBridge(bridgeHost);
} catch (error) {
  console.error(
    `Could not listen on ${bridgeHost}:${bridgePort}: ${error instanceof Error ? error.message : String(error)}`,
  );
  console.error(
    "Is Docker running, and the compose network created? Set QA_BRIDGE_HOST to the address the container uses to reach this computer.",
  );
  chrome?.kill();
  process.exit(1);
}

function stop() {
  bridge.close();
  chrome?.kill();
  process.exit(0);
}

process.on("SIGINT", stop);
process.on("SIGTERM", stop);

console.log(
  `\nChrome for QA is up${launch.command === "flatpak" ? ` (Flatpak ${launch.args[1]})` : ""} (profile: ${profileDir}).`,
);
console.log(
  `From the dev container, the MCP reaches it at: http://${bridgeHost}:${bridgePort}`,
);

if (`${bridgeHost}:${bridgePort}` !== `${DEFAULT_GATEWAY}:9223`) {
  console.log(
    `That is not the default of .mcp.json: in the dev container set QA_CHROME_URL=http://${bridgeHost}:${bridgePort}`,
  );
}

console.log(
  "\nIf the dev container cannot connect, the firewall is probably blocking it (Fedora):",
);
console.log(`  sudo firewall-cmd --zone=docker --add-port=${bridgePort}/tcp`);
console.log("\nPress Ctrl+C to stop.");

// NOTE: runs alone in the image (no wget, no imports), so the path is repeated here; see HEALTH_PATH

const port = process.env.PORT ?? "5173";
const TIMEOUT_MS = 3000;

try {
  const response = await fetch(`http://127.0.0.1:${port}/healthz`, {
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });

  if (!response.ok) {
    console.error(
      `✗ web server answered ${response.status}: ${await response.text()}`,
    );
    process.exit(1);
  }

  console.log("✓ web server");
  process.exit(0);
} catch (error) {
  console.error("✗ web server", error);
  process.exit(1);
}

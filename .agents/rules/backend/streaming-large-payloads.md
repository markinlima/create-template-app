# Streaming large payloads

**Never buffer a payload that could be large into memory (`.arrayBuffer()`,
`.bytes()`, `.text()`) before writing it somewhere else.** Read it as a stream
(a `Blob`/`File`'s own `.stream()`, or a `fetch` `Response`'s `.body`) and pipe
it through, chunk by chunk.

- **Why**: awaiting `.arrayBuffer()` holds the entire payload in memory for the
  whole request, multiplied by every upload or download running at the same
  time. A payload whose size we don't bound can be far larger than the
  process can afford.
- **How, with Bun's `S3Client`**: `client.file(key).writer()` returns a
  streaming writer (`write(chunk)`, `flush()`, `end()`). Read the source stream
  with `.getReader()` and pump the chunks into the writer:

  ```ts
  const writer = client.file(key).writer();
  const reader = sourceStream.getReader();
  try {
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      writer.write(value);
      await writer.flush();
    }
  } finally {
    reader.releaseLock();
  }
  await writer.end();
  ```

- **Applies to**: any place that reads a `Blob`, `File` or `fetch` `Response`
  body and then writes it in full somewhere else (object storage, disk, another
  outbound request). Examples: a user upload stored to S3, a file downloaded
  from a third-party API and kept.
- **Doesn't apply to**: a payload already known to be small and bounded, such as
  a typical JSON API response. This rule is about payloads whose size we don't
  control.

## Where it is used

This rule lives in `.agents/rules/backend/` so that the backend app and any
queue worker that moves files load the same guidance. Each of them links to it
from its own `AGENTS.md`.

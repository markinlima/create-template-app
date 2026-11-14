# Long-running tasks

A long task that the [subagent rules](./subagents.md) do not cover runs **in
the same session, in the background, with a timeout**. A background command is
a detached process, not a subagent: it has no context of its own and costs no
extra prefix. You keep working with everything the session already knows, and
you are woken up when the process exits.

## When

The task is slow (a build, a full test suite, a migration, a long script, a
download) **and** a subagent is not worth it per [subagents](./subagents.md).
Short commands stay in the foreground. Work that is long because it needs a lot
of reading or independent judgment is a subagent question, not this one.

## How

1. **Estimate the duration** from what you know: a previous run of the same
   command, the cache state, the size of the job. If you have no reference,
   assume the foreground limit (10 minutes) and say so.
2. **Set a timeout from the estimate**: about 3x the expected time, at least
   60 s, at most 30 min. Raise the cap only if the user asks.
3. **Start it detached with the timeout inside the command**, so it always
   ends and you are always woken up:
   `timeout -k 10 <seconds> <command> > <log> 2>&1`, run with
   `run_in_background`. Send the output to a log file in the scratchpad and read
   only the tail or a `grep` of it later.
4. **Keep working** on what does not depend on the result. Do not poll the log
   and do not `sleep`; the exit wakes you. To wait on a condition (a server
   ready, a file created), use a bounded loop with an upper limit (Monitor
   with an `until` loop and a maximum), never an open-ended one.
5. **On exit**, check the code. `124` (or `137` after `-k`) means the timeout
   killed it: it was stuck or the estimate was wrong. Read the tail of the log,
   report it, and find out why. Do not just re-run it with a bigger timeout,
   and never start a second copy while the first one may still be alive.

## Don'ts

- Don't start a background process without a timeout, a `while true`, a watch
  mode, or a dev server you will not stop. If one is needed (a server for a
  browser test), give it a lifetime and kill it when the check is done.
- Don't leave processes running when the task ends. List and stop yours.
- Don't use a background task to hide that something is not finishing.

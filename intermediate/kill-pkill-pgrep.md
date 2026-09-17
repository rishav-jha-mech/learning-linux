---
sidebar_position: 3
---

# kill, pkill, and pgrep

Send signals to running processes, by PID (`kill`), by name (`pkill`), or find PIDs by name (`pgrep`).

## Mental Model

Despite the name, `kill` doesn't only kill things — it sends a *signal* to a process, and termination is just the default signal. Every process can register how it wants to react to most signals; some signals (like `SIGKILL`) can't be intercepted at all.

## Syntax

```bash
kill [-signal] PID
pkill [-signal] name
pgrep name
```

## Basic Example

```bash
pgrep node
kill 4821
```

`pgrep` finds the PID of a running `node` process; `kill` sends it the default signal (`SIGTERM`), asking it to shut down gracefully.

## Common Signals

| Signal | Number | Meaning |
| --- | --- | --- |
| `SIGTERM` | 15 | Politely ask the process to terminate (default, can be caught/ignored) |
| `SIGKILL` | 9 | Force-terminate immediately, cannot be caught or ignored |
| `SIGHUP` | 1 | Originally "terminal hung up"; commonly used to tell a daemon to reload its config |
| `SIGINT` | 2 | What `Ctrl+C` sends |
| `SIGSTOP` / `SIGCONT` | 19 / 18 | Pause / resume a process |

```bash
kill -9 4821          # SIGKILL — force kill, no cleanup
kill -HUP 4821        # ask a daemon to reload config
pkill -f "node server" # kill by matching the full command line, not just process name
```

## How It Works

Signals are a kernel-level interrupt mechanism — `kill` calls the `kill()` system call, which asks the kernel to deliver a signal to the target process. A well-behaved process installs a signal handler for `SIGTERM` to clean up (close files, finish in-flight work) before exiting; `SIGKILL` bypasses all of that because the kernel terminates the process directly without ever notifying it, which is why `SIGKILL` can leave things like temp files or partial writes behind.

## Real-World Examples

```bash
# Gracefully ask a server to shut down
kill 4821

# Force-kill a stuck process
kill -9 4821

# Kill every process matching a name
pkill firefox

# Find PIDs before deciding what to kill
pgrep -a python
```

## Combining Commands

```bash
pgrep -f "worker.py" | xargs kill
```

Find every process running `worker.py` and terminate them all — useful when multiple instances are running and you don't know their PIDs ahead of time.

## Common Mistakes

* Reaching for `kill -9` by default — it skips graceful shutdown, so processes can't flush buffers, close database connections, or clean up temp files. Try plain `kill` (SIGTERM) first, and escalate to `-9` only if the process won't die.
* Using `pkill` with a name that matches more than intended — `pkill python` kills *every* process with "python" in its name, which might include things you didn't mean to touch. `pkill -f` with a more specific pattern, or checking with `pgrep` first, avoids surprises.
* Assuming `kill` only kills — remembering it as "send signal" rather than "terminate" avoids confusion when you see `kill -HUP` or `kill -STOP` used for non-destructive purposes.

## Related Commands

* `ps` / `top` — find PIDs and confirm a process actually stopped
* `killall` — similar to `pkill`, kill by exact process name
* `trap` — (in shell scripting) catch signals inside your own scripts

## Practice

1. Start a long-running command (e.g. `sleep 100 &`), find its PID with `pgrep`, and terminate it with `kill`.
2. Explain why `kill -9` should be a last resort rather than a default habit.
3. Use `pkill -f` to target a process by part of its full command line instead of just its name.

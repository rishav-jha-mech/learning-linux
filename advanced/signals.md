---
sidebar_position: 11
---

# Signals

A lightweight, asynchronous way for the kernel (or another process) to notify a process that something happened.

## Mental Model

A signal is an interrupt delivered to a process, not data passed through a normal channel like a pipe, but a notification that something occurred: a user pressed Ctrl+C, a segmentation fault happened, a timer expired. The receiving process can choose to handle it, ignore it, or let the default action happen, except for a couple of signals that can't be intercepted at all.

## Common Signals

| Signal | Number | Default Action | Meaning |
| --- | --- | --- | --- |
| `SIGHUP` | 1 | Terminate | Terminal disconnected, or "reload config" by convention |
| `SIGINT` | 2 | Terminate | Interrupt: what `Ctrl+C` sends |
| `SIGKILL` | 9 | Terminate | Force kill: cannot be caught, blocked, or ignored |
| `SIGSEGV` | 11 | Terminate + core dump | Invalid memory access |
| `SIGTERM` | 15 | Terminate | Polite request to terminate: the default for `kill` |
| `SIGSTOP` | 19 | Pause | Pause the process: cannot be caught or ignored |
| `SIGCONT` | 18 | Resume | Resume a paused process |
| `SIGCHLD` | 17 | Ignore | A child process changed state (exited, stopped) |

## Sending Signals

```bash
kill -TERM PID     # or just: kill PID
kill -9 PID        # SIGKILL
kill -HUP PID
```

Covered in more depth in [kill, pkill, and pgrep](/docs/intermediate/kill-pkill-pgrep).

## How It Works

The kernel maintains a pending-signal mask per process. When a signal is generated (by another process's `kill()` call, a hardware exception, or the kernel itself), it's recorded and delivered the next time the target process is scheduled to run. The process's normal execution is paused just long enough to run either its own registered signal handler or the kernel's default action for that signal, then (if the process wasn't terminated) resumes where it left off. A process registers a custom handler for a signal using `sigaction()`; this is how programs implement "graceful shutdown" logic that runs specifically in response to `SIGTERM`. `SIGKILL` and `SIGSTOP` are deliberately exempt from being caught or blocked: they exist as a guaranteed way to control a process no matter how badly it's misbehaving.

## Real-World Examples

```bash
# A server that saves state and exits cleanly when asked
kill -TERM 4821

# Force-terminate something completely unresponsive to SIGTERM
kill -9 4821

# Tell a daemon to reload its config without restarting
kill -HUP 4821
```

Inside a script, catching a signal:

```bash
trap 'echo "caught SIGINT, cleaning up"; exit' INT
```

`trap` registers a shell command to run when a specific signal arrives: the shell-level equivalent of a program's signal handler.

## Common Mistakes

* Defaulting to `SIGKILL` (`kill -9`) instead of trying `SIGTERM` first. Since `SIGKILL` can't be caught, a process has no chance to flush buffers, release locks, or close connections cleanly, which can cause corrupted state or orphaned resources.
* Not knowing `SIGSTOP`/`SIGCONT` exist and reaching for more disruptive ways to temporarily pause a process's execution (they're what `Ctrl+Z` and `bg`/`fg` use under the hood, covered in [job control](/docs/intermediate/job-control)).
* Assuming every signal terminates a process by default. Many, like `SIGCHLD` or `SIGWINCH` (terminal resized), are informational and ignored by default unless a program specifically cares about them.

## Related Commands

* [kill, pkill, and pgrep](/docs/intermediate/kill-pkill-pgrep): the tools used to send signals
* [Processes](/docs/intermediate/processes): the entities signals are delivered to
* `trap`: catch signals inside shell scripts

## Practice

1. Start a long-running command and send it `SIGTERM`, then `SIGKILL`, observing any difference in behavior if the program has custom cleanup logic.
2. Write a tiny shell script using `trap` to catch `SIGINT` and print a message before exiting.
3. Explain why `SIGKILL` and `SIGSTOP` cannot be intercepted, while most other signals can be.

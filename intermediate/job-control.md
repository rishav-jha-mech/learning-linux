---
sidebar_position: 4
---

# Job control: jobs, bg, fg, nohup, disown

Run, pause, and manage multiple commands within a single shell session.

## Mental Model

Anything you run from a shell becomes a "job" tracked by that shell for as long as the session lives. A job can run in the foreground (blocking your prompt) or the background (running while you keep typing), and you can move it between the two.

## Syntax

```bash
command &        # start in the background
jobs              # list jobs in the current shell
fg [%N]           # bring a job to the foreground
bg [%N]           # resume a stopped job in the background
nohup command &   # run immune to hangup, survives the shell exiting
disown %N         # detach a job from the shell without stopping it
```

## Basic Example

```bash
sleep 100 &
jobs
```

Output:

```text
[1]+  Running     sleep 100 &
```

The trailing `&` starts the command in the background immediately; `jobs` lists it.

## Common Options / Keys

| Action | How |
| --- | --- |
| Start in background | trailing `&` |
| Pause a foreground job | `Ctrl+Z` |
| Resume in background | `bg` |
| Bring to foreground | `fg` |
| List jobs | `jobs` |
| Survive shell exit | `nohup command &` or `disown` after starting |

## How It Works

Job control is a shell feature layered on top of process groups and signals — `Ctrl+Z` sends `SIGTSTP` to pause a process, `bg`/`fg` just change whether the shell waits on it and whether it's connected to the terminal. Normally, when your shell exits, it sends `SIGHUP` to its background jobs, which by default terminates them too. `nohup` makes a process ignore `SIGHUP` from the start; `disown` removes a job from the shell's job table so the shell no longer tracks or signals it when exiting — the process itself is unaffected, only the shell's bookkeeping changes.

## Real-World Examples

```bash
# Start a long-running task, keep working, check on it later
long_build.sh &
jobs
fg    # bring it back to foreground to see output

# Start a background process that survives closing the terminal
nohup ./server.sh &

# Pause a foreground command and resume it in the background
# (Ctrl+Z while it's running, then:)
bg
```

## Combining Commands

```bash
nohup python script.py > output.log 2>&1 &
```

Run a script fully detached from the terminal, redirecting both stdout and stderr to a log file so nothing is lost once the terminal closes.

## Common Mistakes

* Closing a terminal with a background job running and expecting it to keep going — without `nohup` or `disown`, it typically receives `SIGHUP` and dies with the shell.
* Forgetting `&` starts a job *immediately* in the background — some people accidentally leave off the `&` and get stuck waiting on a foreground job they meant to background.
* Not redirecting output with `nohup` — without redirection, output still tries to write to a terminal that may no longer exist, which can cause issues; `nohup command > log 2>&1 &` is the safe, complete pattern.

## Related Commands

* `screen` / `tmux` — full terminal multiplexers, a more robust alternative to job control for long sessions
* `systemd` (as a service) — the proper way to run something persistently in production, rather than relying on shell job control
* `ps` — see the actual OS-level process behind a shell job

## Practice

1. Start a `sleep 60 &` job, check `jobs`, bring it to the foreground with `fg`, then pause it with `Ctrl+Z` and resume with `bg`.
2. Start a background process with `nohup`, close and reopen your terminal, and confirm it's still running with `ps`.
3. Explain the difference between what `nohup` does and what `disown` does.

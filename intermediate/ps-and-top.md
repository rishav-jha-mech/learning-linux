---
sidebar_position: 2
---

# ps and top

Show what processes are running on the system, either as a snapshot (`ps`) or a live-updating view (`top`).

## Mental Model

Every running program is a process with a PID (process ID), some CPU/memory usage, and a state. `ps` takes a single snapshot of that information and prints it. `top` takes repeated snapshots and redraws them, giving you a live dashboard.

## Syntax

```bash
ps [options]
top
```

## Basic Example

```bash
ps aux
```

Output (truncated):

```text
USER  PID  %CPU  %MEM  COMMAND
root    1   0.0   0.1  /sbin/init
alice 812   2.3   1.5  node server.js
```

`ps aux` is the combination almost everyone uses: **a**ll users, **u**ser-oriented format, processes without a controlling terminal included (**x**).

## Common Options

| Option | Meaning |
| --- | --- |
| `ps aux` | Show every process, in detail |
| `ps -ef` | Similar info, different (POSIX) format/columns |
| `ps -p PID` | Show only a specific process |
| `top` keys: `q` | Quit |
| `top` keys: `k` | Kill a process by PID, from inside top |
| `top` keys: `P` / `M` | Sort by CPU / memory usage |

## How It Works

Process information on Linux lives in the `/proc` filesystem: a virtual filesystem exposing kernel data as files, one directory per running PID (e.g. `/proc/1234/status`). Both `ps` and `top` read from `/proc` rather than asking the kernel through some special API; they're essentially formatting tools over data the kernel already publishes there. `top` just re-reads `/proc` on an interval and redraws the screen.

## Real-World Examples

```bash
# Find what's using the most CPU right now
top

# Find a specific process by name
ps aux | grep nginx

# See just the process tree (parent/child relationships)
ps -ef --forest
```

## Combining Commands

```bash
ps aux | sort -rk3 | head -5
```

List the top 5 processes by CPU usage (column 3 in `ps aux` output) without needing `top`'s live view: useful in scripts or over a connection where an interactive dashboard isn't convenient.

## Common Mistakes

* Confusing `%CPU` in `ps`/`top` with "percent of all cores": on a multi-core machine, a single-threaded process pegging one core can show close to 100%, and a process using several cores can show well over 100%.
* Killing the wrong PID because two processes have similar names: always double-check the PID and full command line (`ps aux | grep name`) before sending a signal.
* Not knowing `top` has interactive sorting (`P` for CPU, `M` for memory) and instead running `ps` repeatedly by hand.

## Related Commands

* `htop`: a more user-friendly, colorized alternative to `top`
* `kill` / `pkill`: send signals to processes found via `ps`/`top`
* `pgrep`: find PIDs by name without the full `ps` output

## Practice

1. Use `ps aux` to find the PID of your current shell.
2. Open `top`, sort by memory usage with `M`, and identify the top consumer.
3. Build a one-line pipeline that lists the 3 most CPU-hungry processes without opening `top`.

---
sidebar_position: 5
---

# free, uptime, and dmesg

Quick system health checks: memory (`free`), load and time up (`uptime`), and kernel messages (`dmesg`).

## Mental Model

These are the fastest "is everything okay?" checks on a Linux machine — no interval sampling needed, just an instant snapshot of memory, how loaded the system has been, and any low-level kernel events worth knowing about.

## Syntax

```bash
free [options]
uptime
dmesg [options]
```

## Basic Example

```bash
free -h
```

Output:

```text
              total   used   free  shared  buff/cache  available
Mem:           16Gi   4.2Gi  2.1Gi   0.3Gi        9.4Gi      11Gi
```

```bash
uptime
```

Output:

```text
14:32:01 up 12 days,  3:14,  2 users,  load average: 0.45, 0.62, 0.71
```

## Common Options

| Command | Option | Meaning |
| --- | --- | --- |
| `free` | `-h` | Human-readable sizes |
| `free` | `-s N` | Repeat every N seconds |
| `dmesg` | `-T` | Show human-readable timestamps instead of seconds-since-boot |
| `dmesg` | `-w` | Follow new kernel messages live |
| `dmesg` | `-l err` | Filter to a specific severity level |

## How It Works

`free` reads `/proc/meminfo`, which the kernel keeps updated with memory statistics — its most misunderstood column is `buff/cache`: this memory isn't wasted, it's the kernel using otherwise-idle RAM to cache disk data for speed, and it's reclaimed instantly if an application needs it (which is why `available` is the number that actually matters, not raw `free`). `uptime`'s load average is a measure of how many processes were runnable (running or waiting for CPU) on average over the last 1, 5, and 15 minutes — a load average above your CPU core count sustained over time suggests the system is CPU-bound. `dmesg` prints the kernel's own ring buffer of messages — hardware events, driver output, and critical errors the kernel logs directly, often before any user-space logging even starts.

## Real-World Examples

```bash
# Quick memory check
free -h

# See how loaded the system has been recently
uptime

# Check for hardware or driver-level errors
dmesg | grep -i error

# Watch kernel messages live (useful right after plugging in new hardware)
dmesg -w
```

## Combining Commands

```bash
dmesg -T | grep -i "out of memory"
```

Check whether the kernel's OOM (out-of-memory) killer has terminated any processes recently — a common root cause when a service mysteriously disappears without an obvious application-level error.

## Common Mistakes

* Panicking over low "free" memory in `free`'s raw `free` column without checking `available` — Linux deliberately uses spare RAM for disk caching, so a low `free` number with a healthy `available` number is completely normal, not a problem.
* Reading load average without knowing how many CPU cores the machine has — a load average of 4 is fine on a 16-core machine and concerning on a 2-core one.
* Not checking `dmesg` when a process disappears unexpectedly — the OOM killer logs its actions there, and it's often the fastest way to confirm whether that's what happened.

## Related Commands

* `top` / `vmstat` — more detailed, live views of the same underlying data
* `journalctl -k` — modern systemd-based way to view kernel messages, similar purpose to `dmesg`
* `cat /proc/meminfo` — the raw data `free` is built on top of

## Practice

1. Run `free -h` and identify the difference between the `free` and `available` columns.
2. Check `uptime`'s load average and compare it to how many CPU cores your machine has (`nproc`).
3. Search `dmesg` output for any warnings or errors and investigate what they mean.

---
sidebar_position: 4
---

# vmstat, iostat, and sar

Report system-level performance statistics: memory/CPU (`vmstat`), disk I/O (`iostat`), and historical trends (`sar`).

## Mental Model

These tools answer "how is the machine doing as a whole," as opposed to `top`/`ps`, which focus on individual processes. They're the first stop when something feels slow and you don't yet know if it's CPU, memory, or disk causing it.

## Syntax

```bash
vmstat [interval] [count]
iostat [options] [interval] [count]
sar [options]
```

## Basic Example

```bash
vmstat 2 5
```

Prints 5 samples of system stats, 2 seconds apart: CPU, memory, swap, and I/O activity in one compact table.

```bash
iostat -x 2
```

Shows extended per-disk I/O statistics, refreshing every 2 seconds.

## Common Columns to Know

`vmstat`:

| Column | Meaning |
| --- | --- |
| `r` | Processes waiting to run (queued for CPU) |
| `free` | Free memory |
| `si` / `so` | Swap in / swap out: nonzero here often means memory pressure |
| `us` / `sy` / `id` | % time in user code, kernel code, idle |

`iostat`:

| Column | Meaning |
| --- | --- |
| `%util` | Percent of time the disk was busy servicing requests |
| `await` | Average time (ms) a request waits, including queue time |

## How It Works

All three tools read the same kind of kernel-exposed statistics `top` and `ps` do, mostly from `/proc` (`/proc/stat`, `/proc/meminfo`, `/proc/diskstats`), but aggregate them system-wide instead of per-process, and are built for sampling over an interval rather than a single snapshot. `sar` additionally can log this data continuously over time (via a background collector, `sysstat`), letting you look *backward* at what the system was doing hours or days ago, not just right now.

## Real-World Examples

```bash
# Watch for memory pressure (swapping) over 10 seconds
vmstat 2 5

# Check if a specific disk is the bottleneck
iostat -x 2 5

# Look at historical CPU usage from earlier today (requires sysstat logging enabled)
sar -u -s 09:00:00 -e 12:00:00
```

## Combining Commands

```bash
vmstat 1 10 | awk '{print $13}'
```

Extract just the "idle CPU" column from repeated `vmstat` samples for quick scripted monitoring.

## Common Mistakes

* Reading a single `vmstat` sample without an interval: the very first line reports *averages since boot*, not the current instant; always look at the second and later samples for current activity.
* Seeing high `%util` in `iostat` and assuming the disk itself is failing. It usually just means the disk is busy/saturated, which could simply mean the workload is I/O-heavy, not that anything is wrong.
* Not knowing `sar` needs the `sysstat` package's background collection enabled ahead of time. You can't retroactively see historical data unless logging was already running when the period you care about happened.

## Related Commands

* `top` / `htop`: per-process detail, complementary to these system-wide views
* `free`: a quick, simpler view of memory usage alone
* `dstat`: a more modern combined view, drawing together CPU/disk/network stats in one tool

## Practice

1. Run `vmstat 2 5` while doing something CPU-intensive and observe the `us`/`sy`/`id` columns shift.
2. Run `iostat -x 2` while copying a large file and watch `%util` on the relevant disk rise.
3. Check whether `sysstat` logging is enabled on your system and, if so, try pulling historical data with `sar`.

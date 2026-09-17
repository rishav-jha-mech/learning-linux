---
sidebar_position: 6
---

# perf

A low-overhead profiler for understanding exactly where a program (or the whole system) spends CPU time.

## Mental Model

Where `strace` shows every syscall (with real overhead), `perf` takes statistical samples of what the CPU is executing, periodically interrupting to record the current instruction/function, then building a picture of where time is actually going. This sampling approach is what makes it practical to profile real, performance-sensitive workloads without slowing them down significantly.

## Syntax

```bash
perf stat command
perf record command
perf report
perf top
```

## Basic Example

```bash
perf stat ls -la /
```

Output (abridged):

```text
   Performance counter stats for 'ls -la /':

          1.23 msec task-clock
             2      context-switches
             1      page-faults
     3,456,789      cycles
     2,345,678      instructions
```

`perf stat` gives you a summary of low-level hardware counters for a command's execution.

## Common Options

| Command | Meaning |
| --- | --- |
| `perf stat command` | Run a command and summarize hardware performance counters |
| `perf record command` | Sample a command's execution, saving data to `perf.data` |
| `perf report` | View the recorded profile as a breakdown by function |
| `perf top` | Live, `top`-like view of where CPU time is going system-wide |

## How It Works

`perf` is built on the Linux kernel's performance monitoring subsystem, which can read hardware performance counters directly from the CPU (cycles, cache misses, branch mispredictions) and set up sampling interrupts at a configurable frequency. Instead of tracking every single event (which would be `strace`-level overhead), `perf record` samples "what's executing right now" at intervals, and statistically that sample distribution converges on an accurate picture of where time is spent, with far less slowdown than exhaustive tracing.

## Real-World Examples

```bash
# Get high-level performance counters for a command
perf stat ./my-program

# Profile a program and see which functions consume the most CPU time
perf record -g ./my-program
perf report

# Watch system-wide CPU hotspots live
sudo perf top
```

## Combining Commands

```bash
perf record -g -p $(pgrep myapp) -- sleep 10
```

Profile an already-running process for 10 seconds without restarting it, then inspect with `perf report`.

## Common Mistakes

* Reaching for `strace` to diagnose "why is this slow": `strace`'s own overhead can distort timing-sensitive performance issues; `perf` is the right tool once you already know it's slow and need to find out where.
* Running `perf record`/`perf top` without sufficient permissions: many systems restrict access to performance counters by default (`perf_event_paranoid` setting), requiring `sudo` or a sysctl change.
* Looking only at `perf report`'s top-level summary and missing the call graph (`-g`): without it, you see which functions are hot but not *why* they're being called so often.

## Related Commands

* `strace`: syscall-level tracing, different layer and higher overhead
* `top` / `vmstat`: coarser, always-on system monitoring without deep profiling
* `flamegraph` tools: visualize `perf record` output as an intuitive flame graph

## Practice

1. Run `perf stat` on a CPU-bound command and interpret its cycles/instructions output.
2. Use `perf record -g` and `perf report` on a small program to identify its hottest function.
3. Try `perf top` briefly and observe which processes are consuming CPU system-wide right now.

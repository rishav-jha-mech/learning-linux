---
sidebar_position: 2
---

# strace

Traces every system call a program makes, showing exactly how it talks to the kernel.

## Mental Model

A program's visible behavior is the result of many system calls underneath — opening files, reading input, allocating memory, making network connections. `strace` intercepts and logs each of these as they happen, giving you a ground-truth view of what a program is actually doing, independent of what its own logs or documentation claim.

## Syntax

```bash
strace command [args...]
strace -p PID
```

## Basic Example

```bash
strace cat /etc/hostname
```

Output (abridged):

```text
openat(AT_FDCWD, "/etc/hostname", O_RDONLY) = 3
read(3, "myhost\n", 131072)            = 7
write(1, "myhost\n", 7)                = 7
close(3)                                = 0
```

You can see `cat` open the file, read its contents, write them to stdout, and close the file — each step as a real system call with its actual arguments and return value.

## Common Options

| Option | Meaning |
| --- | --- |
| `-p PID` | Attach to an already-running process instead of starting a new one |
| `-f` | Follow child processes too |
| `-e trace=` | Filter to specific syscalls (e.g. `-e trace=open,read`) |
| `-c` | Summarize: count and time spent per syscall, instead of a full log |
| `-o file` | Write output to a file instead of stderr |
| `-T` | Show time spent in each syscall |

## How It Works

`strace` uses the kernel's `ptrace()` system call to intercept every system call a traced process makes, pausing execution at each entry and exit to record the call, its arguments, and its result. This is powerful but has real overhead — a traced process runs meaningfully slower, since every syscall now involves an extra round-trip through the tracer. That overhead is why `strace` is a debugging tool, not something you'd run permanently in production.

## Real-World Examples

```bash
# See exactly which files a program tries to open (and whether they exist)
strace -e trace=open,openat myprogram

# Attach to a running, already-misbehaving process
strace -p 4821

# Get a summary of which syscalls a program spends the most time in
strace -c myprogram

# Debug "permission denied" or "file not found" errors that don't explain themselves
strace -f -e trace=open,openat,access ./mysterious-script.sh
```

## Combining Commands

```bash
strace -e trace=network -f myprogram 2>&1 | grep connect
```

Filter a trace down to just the network-related syscalls, useful when debugging why a program can't reach a service.

## Common Mistakes

* Reaching for `strace` on a performance problem when you actually need a profiler — `strace` shows *what* syscalls happen and their timing, but its own overhead skews fine-grained performance measurements; tools like `perf` are better suited for that.
* Not using `-f` when the process you're tracing spawns children — without it, you only see the parent process's syscalls, missing anything the actual work happens in a forked child.
* Running `strace` on a production process without understanding its slowdown — attaching `strace -p` to a live, latency-sensitive service can itself cause timeouts or degraded behavior.

## Related Commands

* `ltrace` — similar concept, but traces library calls instead of syscalls
* `perf` — proper performance profiling with much lower overhead
- `lsof` — see what files/sockets a process currently has open, a snapshot rather than a live trace

## Practice

1. Run `strace` on a simple command like `ls` and identify the syscalls it uses to read a directory.
2. Use `-c` to get a summary view and identify which syscall a program spends the most time in.
3. Use `-e trace=open,openat` to debug which config files a program checks for at startup.

---
sidebar_position: 22
---

# Processes

A running instance of a program, with its own memory, file descriptors, and place in a family tree of other processes.

## Mental Model

Every process on a Linux system, except the very first one, was created by another process. That parent/child relationship forms a tree rooted at PID 1 (traditionally `init` or `systemd`). A "program" on disk is just a file; a "process" is that program actually running, with its own identity and state.

## Key Facts

| Concept | Meaning |
| --- | --- |
| PID | Unique numeric ID for a running process |
| PPID | The PID of the process that created it (its parent) |
| `fork()` | The syscall that creates a new process by duplicating the calling one |
| `exec()` | The syscall that replaces a process's running program with a different one |
| Zombie | A process that has exited but whose exit status hasn't been collected by its parent yet |
| Orphan | A process whose parent exited before it did |

## Seeing Processes

```bash
ps -ef --forest
```

Shows every process with indentation reflecting the parent/child tree.

```bash
pstree
```

A dedicated, often more readable tool for the same tree view.

## How It Works

Starting a new process almost always follows the same two-step pattern: `fork()` creates a near-identical copy of the calling process (same memory contents, same open file descriptors), and then `exec()` replaces that copy's memory with a completely different program, keeping the same PID. This is why, for a brief moment after your shell runs a command, there are genuinely two processes with the same code before `exec()` swaps one of them out, and it's why child processes inherit things like open file descriptors and environment variables from their parent, since `fork()` duplicates the parent's state before anything is replaced.

A "zombie" exists because the kernel keeps a process's exit code around until the parent calls `wait()` to collect it: if the parent never does, the entry lingers (harmless in small numbers, but a sign of a bug if they accumulate). An "orphan" gets re-parented to PID 1 automatically, so every process always has a parent, even if it isn't the original one.

## Real-World Examples

```bash
# See the parent/child relationship for a specific process
ps -ef --forest | grep -A2 -B2 nginx

# Find a process's parent PID
ps -o ppid= -p PID

# Spot zombie processes (state Z)
ps aux | awk '$8=="Z"'
```

## Combining Commands

```bash
kill -9 $(ps -o ppid= -p $(pgrep myworker))
```

Find a process's parent and kill it: sometimes necessary when the parent is what's respawning a misbehaving child.

## Common Mistakes

* Killing a parent process without understanding its children will be re-parented to PID 1, not necessarily terminated: depending on the application, orphaned children might keep running unexpectedly.
* Confusing zombie processes with "stuck" or "hung" processes that are still actually running: a zombie has already finished; it consumes essentially no resources except a slot in the process table, and clears up once the parent calls `wait()` (often automatically, or on the parent's own exit).
* Assuming `fork()` is expensive because it "copies everything": modern Linux uses copy-on-write, so a forked child initially shares the same physical memory pages as its parent, only actually duplicating a page when either process writes to it.

## Related Commands

* [ps and top](/docs/intermediate/ps-and-top): inspect running processes
* [kill, pkill, and pgrep](/docs/intermediate/kill-pkill-pgrep): send signals to processes
* [Signals](/docs/advanced/signals): how processes communicate about state changes and termination

## Practice

1. Use `pstree` (or `ps -ef --forest`) to find your current shell's place in the process tree.
2. Explain the difference between `fork()` and `exec()` in your own words.
3. Look for any zombie processes on your system with `ps aux | awk '$8=="Z"'` and, if you find one, identify its parent.

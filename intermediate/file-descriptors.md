---
sidebar_position: 21
---

# File Descriptors

The small integers a process uses to refer to anything it has open: files, sockets, pipes.

## Mental Model

A file descriptor (fd) is just a number a process's own private lookup table maps to something the kernel is tracking on its behalf. "Opening" a file doesn't hand you the file directly: it hands you a number, and every future read/write on that file goes through that number.

## The Basics

Every process starts with three descriptors already open, by convention:

| FD | Name |
| --- | --- |
| 0 | stdin |
| 1 | stdout |
| 2 | stderr |

Opening any additional file, socket, or pipe gets the next available number: 3, 4, 5, and so on.

## Seeing Them

```bash
ls -l /proc/self/fd
```

Shows every file descriptor the current shell has open, each as a symlink pointing to the real underlying file, socket, or pipe.

```bash
lsof -p PID
```

Shows every file descriptor a specific process currently has open, system-wide.

## How It Works

Each process has a file descriptor table maintained by the kernel: an array where each entry points to a kernel-level "open file description" (which itself tracks things like the current read/write position). Two different processes can each have an fd numbered `3`, pointing to completely different things: the numbers are only meaningful *within* a process. When a process calls `fork()`, the child inherits copies of the parent's file descriptor table, which is part of why file descriptors behave the way they do around process creation and redirection.

## Real-World Examples

```bash
# See what a running process has open (common in debugging "too many open files")
lsof -p $(pgrep myapp)

# Check your own shell's open descriptors
ls -l /proc/self/fd

# Hit the "too many open files" limit: see how many are allowed
ulimit -n
```

## Combining Commands

```bash
command 3>&1 1>&2 2>&3
```

An advanced idiom that swaps stdout and stderr by using fd 3 as temporary storage: illustrates that redirection operators work on *any* descriptor number, not just the standard three.

## Common Mistakes

* Hitting "too many open files" (EMFILE) and not realizing it's a per-process limit set by [ulimit](/docs/advanced/ulimit-and-sysctl): the fix is often raising that limit, not necessarily a bug in the program itself (though leaking file descriptors by never closing them is also a real, common bug).
* Assuming closing a file descriptor immediately frees the underlying resource: if multiple descriptors (in the same or different processes) point to the same open file description, the resource persists until *all* references are closed.
* Confusing a file descriptor number with an inode number: they're unrelated; the fd is a per-process handle, the inode is the actual on-disk file's identity, and multiple different fds (even across processes) can point to the same inode.

## Related Commands

* [stdin, stdout, and stderr](/docs/intermediate/stdin-stdout-stderr): the three descriptors every process starts with
* `lsof`: list open file descriptors for a process
* [ulimit and sysctl](/docs/advanced/ulimit-and-sysctl): control how many file descriptors a process may open

## Practice

1. Run `ls -l /proc/self/fd` in your shell and identify which entries correspond to stdin/stdout/stderr.
2. Use `lsof -p PID` on a running process and count how many file descriptors it currently has open.
3. Look up your current `ulimit -n` and explain what happens when a process tries to exceed it.

---
sidebar_position: 19
---

# stdin, stdout, and stderr

The three default communication channels every process starts with.

## Mental Model

Every process is born with three open "streams" already connected: one for input, two for output. Programs don't need to open a file to print a message or read a line — these channels are just there, ready to use, identified by small numbers rather than names.

## The Three Streams

| Name | File descriptor | Purpose |
| --- | --- | --- |
| stdin | 0 | Input a program reads |
| stdout | 1 | Normal output |
| stderr | 2 | Error/diagnostic output, kept separate from normal output |

## Basic Example

```bash
echo "hello"
```

Writes to stdout (fd 1) — by default, both stdout and stderr are connected to your terminal, so you see this printed.

```bash
ls /nonexistent
```

Output:

```text
ls: cannot access '/nonexistent': No such file or directory
```

That error message went to stderr (fd 2), not stdout — a distinction invisible until you start redirecting.

## Why Two Output Streams

Having stdout and stderr separate lets you redirect normal output somewhere (like a file or another program) while errors still show up on your terminal, or vice versa:

```bash
command > output.txt
```

Only stdout is redirected to the file — if `command` prints an error, you'll still see it on screen, because stderr wasn't touched.

```bash
command 2> errors.txt
```

Only stderr goes to the file; normal output still prints to the terminal.

```bash
command > output.txt 2> errors.txt
```

Both streams go to separate files.

```bash
command > all.txt 2>&1
```

Redirect stdout to a file, then point stderr at "wherever stdout is currently pointing" (`2>&1`) — the standard idiom for capturing everything into one file. Order matters: this must come *after* `> all.txt`.

## How It Works

File descriptors are just small integers a process uses to refer to open files, sockets, or pipes — the kernel tracks what each number actually points to per-process. When a shell starts a new process, it sets up descriptors 0, 1, and 2 pointing at the terminal by default, but redirection (`>`, `<`, `2>&1`) is really just the shell rewiring what those descriptors point to *before* the program starts — the program itself doesn't know or care whether fd 1 goes to a terminal, a file, or a pipe.

## Real-World Examples

```bash
# Save a program's output for later, but still see errors live
./build.sh > build.log

# Silence all output, including errors
command > /dev/null 2>&1

# Only see errors, ignore normal chatter
command 2>&1 1>/dev/null
```

## Combining Commands

```bash
grep "pattern" file.txt 2>/dev/null | sort
```

Discard any error messages (like "file not found") before piping the remaining valid output into `sort`.

## Common Mistakes

* Writing `2>&1 > file` instead of `> file 2>&1` — order matters. The first points stderr at wherever stdout *currently* is (the terminal), then redirects stdout to the file — leaving stderr still going to the terminal. The second redirects stdout to the file first, then points stderr at that same destination.
* Assuming a pipe (`|`) carries stderr along with stdout — by default it only connects stdout to the next command; error messages still print to the terminal unless explicitly redirected with `2>&1` first.
* Not realizing `/dev/null` is a real, always-empty device file — redirecting output there is the standard way to discard it entirely, not a shell-specific trick.

## Related Commands

* `tee` — split stdout to both a file and the terminal
* `2>&1`, `>`, `<` — shell redirection operators, not commands but essential syntax
* [pipes](/docs/intermediate/pipes) — chaining stdout of one command into stdin of the next

## Practice

1. Run a command that produces both normal output and an error, and redirect only the error to a file.
2. Combine both streams into a single log file using the correct order (`> file 2>&1`).
3. Explain why `command 2>&1 > file` does NOT do what a beginner might expect.

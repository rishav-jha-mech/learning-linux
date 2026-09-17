---
sidebar_position: 20
---

# Pipes

Connect one command's output directly to another command's input.

## Mental Model

A pipe (`|`) takes stdout of the command on its left and feeds it as stdin to the command on its right — no temporary file, no manual copying. It's the mechanism that turns a handful of small, single-purpose tools into arbitrarily complex data-processing chains.

## Syntax

```bash
command1 | command2 | command3
```

## Basic Example

```bash
ls -la | grep ".txt"
```

`ls -la` lists files; `grep` filters that list down to lines containing `.txt` — `grep` never touches the filesystem directly, it only ever sees what `ls` printed.

## How It Works

A pipe is implemented via the `pipe()` system call, which creates a pair of connected file descriptors — one for writing, one for reading — inside the kernel, backed by a small in-memory buffer. The shell wires the left command's stdout to the pipe's write end and the right command's stdin to its read end, then runs both commands *concurrently*: the kernel blocks the writer if the buffer fills up, and blocks the reader if there's nothing to read yet, until data arrives. This is why `command1 | command2` starts producing output as soon as data is available, rather than waiting for `command1` to fully finish first (for commands that stream, like `tail -f`).

## Real-World Examples

```bash
# Filter, then sort, then take the top results
ps aux | grep node | sort -k3 -rn | head -5

# Count how many lines match a pattern
grep "ERROR" app.log | wc -l

# Build a frequency table
cat access.log | awk '{print $1}' | sort | uniq -c | sort -rn
```

## Combining Commands

```bash
tail -f app.log | grep --line-buffered "ERROR"
```

Follow a live log and filter it in real time. `--line-buffered` matters here — without it, `grep` may buffer its output internally and delay printing matches until its buffer fills, defeating the "live" aspect.

## Common Mistakes

* Assuming a pipeline only reports the last command's exit status — by default, `$?` after a pipeline reflects the *final* command only, which can hide an earlier failure (e.g. `cmd_that_fails | grep pattern` can still "succeed" from the shell's perspective if `grep` finds nothing to complain about). `set -o pipefail` in scripts makes the whole pipeline fail if any stage fails.
* Forgetting a pipe only carries stdout, not stderr, from the left command — error messages from `command1` still print directly to the terminal unless separately redirected.
* Piping into a command that buffers its output more aggressively (common with some tools when writing to a pipe instead of a terminal) and being confused why "live" output seems delayed — this is a real, tool-specific behavior, and options like `--line-buffered` or `stdbuf` exist specifically to work around it.

## Related Commands

* [stdin, stdout, and stderr](/docs/intermediate/stdin-stdout-stderr) — the streams pipes actually connect
* `tee` — split a pipeline's data to a file while still passing it along
* `xargs` — for commands that don't read from stdin directly, converting piped data into arguments instead

## Practice

1. Build a three-stage pipeline (e.g. `ps aux | grep name | wc -l`) and explain what each stage does to the data flowing through it.
2. Test whether a pipeline's exit status reflects an early failure or only the last command, using `echo $?` after running it.
3. Use `tail -f` piped into `grep --line-buffered` and observe live filtering as new lines are appended to a file.

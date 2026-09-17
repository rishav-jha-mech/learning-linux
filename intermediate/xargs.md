---
sidebar_position: 6
---

# xargs

Builds and runs commands using input from another command, one argument list at a time.

## Mental Model

Many commands (like `rm` or `chmod`) take arguments directly on the command line; they don't read filenames from stdin. `xargs` bridges that gap: it takes lines from stdin and turns them into arguments for a command you specify.

## Syntax

```bash
command | xargs [options] target-command
```

## Basic Example

```bash
find . -name "*.tmp" | xargs rm
```

`find` prints matching filenames; `xargs` collects them and runs `rm file1.tmp file2.tmp ...` instead of you having to build that command by hand.

## Common Options

| Option | Meaning |
| --- | --- |
| `-n N` | Pass at most N arguments per invocation of the target command |
| `-I {}` | Substitute each input line into a placeholder, running the command once per line |
| `-0` | Read null-separated input instead of newline-separated (pairs with `find -print0`) |
| `-p` | Prompt before running each command (safety check) |

## How It Works

`xargs` reads its input, splits it into chunks that fit within the system's command-line length limit, and invokes the target command with those chunks as arguments, potentially running the command multiple times if there's more input than fits in one invocation. This chunking is invisible in normal use but matters at scale: `xargs` handles a million filenames correctly by batching them, where trying to build one giant command line by hand would fail.

## Real-World Examples

```bash
# Delete every .tmp file found
find . -name "*.tmp" | xargs rm

# Run a command once per input line, substituting it into a specific position
find . -name "*.jpg" | xargs -I {} mv {} ./images/

# Safely handle filenames with spaces or special characters
find . -name "*.log" -print0 | xargs -0 rm
```

## Combining Commands

```bash
cat urls.txt | xargs -n1 curl -O
```

Download every URL listed in a file, one `curl` call per line.

## Common Mistakes

* Piping `find` output into `xargs` without `-print0`/`-0` when filenames might contain spaces or newlines. Plain newline-separated input breaks on those, silently mangling commands. Use `find -print0 | xargs -0` for anything that touches arbitrary user-created filenames.
* Forgetting `-I {}` is needed when you want the input value to go somewhere other than the end of the command. Without it, `xargs` just appends arguments at the end.
* Running a destructive `xargs` command (like `rm`) without testing the pipeline first using `echo` in place of the real command, to preview exactly what would run.

## Related Commands

* `find -exec`: an alternative way to run a command per match, without needing `xargs` at all
* `parallel` (GNU parallel): like `xargs` but runs commands concurrently
* `find`: the most common source of input piped into `xargs`

## Practice

1. Use `find` and `xargs` to list the sizes of every `.txt` file in a directory (`xargs ls -l`).
2. Create filenames with spaces in a test directory and observe how plain `xargs` mishandles them, then fix it with `-print0`/`-0`.
3. Use `xargs -I {}` to run a command that needs the input value somewhere in the middle of the command, not just at the end.

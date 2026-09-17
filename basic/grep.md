---
sidebar_position: 16
---

# grep

Searches text for lines matching a pattern.

## Mental Model

`grep` reads input line by line and prints only the lines that match a pattern. That pattern can be a plain string or a regular expression: "global regular expression print" is where the name comes from.

## Syntax

```bash
grep [options] pattern [file...]
```

## Basic Example

```bash
grep "error" app.log
```

Prints every line in `app.log` containing "error".

## Common Options

| Option | Meaning |
| --- | --- |
| `-i` | Case-insensitive matching |
| `-v` | Invert match: show lines that do NOT match |
| `-r` | Search recursively through a directory |
| `-n` | Show line numbers |
| `-c` | Count matching lines instead of printing them |
| `-E` | Extended regex (supports `+`, `?`, `|`, `()` without escaping) |
| `-l` | Just print filenames that contain a match |

## How It Works

`grep` reads its input a line at a time (from a file or stdin) and tests each line against the pattern using a regex engine. It never loads the whole input into memory at once, which is why `grep` on a huge file, or on a live stream through a pipe, works efficiently without waiting for the whole input to be available first.

## Real-World Examples

```bash
# Find all error lines in a log file
grep "ERROR" app.log

# Search every file in a directory tree for a string
grep -r "TODO" src/

# Count how many lines mention "timeout"
grep -c "timeout" server.log

# Show lines that do NOT contain "debug"
grep -v "debug" app.log
```

## Combining Commands

```bash
ps aux | grep nginx
```

List running processes, then filter to the ones mentioning `nginx`: one of the most common `grep` uses in practice.

```bash
grep -r "TODO" src/ | wc -l
```

Count how many TODO comments exist across a codebase.

## Common Mistakes

* Forgetting that unescaped regex characters (`.`, `*`, `[`, `(`) have special meaning: searching for a literal `.` requires escaping it (`\.`) or using `-F` for a fixed string.
* Using `ps aux | grep nginx` and seeing the `grep` process itself show up in the results (it matches its own command line). Add `[n]ginx` or `grep -v grep` to filter that out if it matters.
* Not knowing `-r` exists and manually running `grep` file by file.

## Related Commands

* `egrep`: equivalent to `grep -E`
* `awk`: extract and transform matched fields, not just print whole lines
* `find`: locate files by name/metadata rather than by content
* `ripgrep` (`rg`): a much faster modern alternative to `grep -r`

## Practice

1. Search a log file for lines containing "error", case-insensitively.
2. Use `grep -v` to filter out noisy lines you don't care about.
3. Recursively search a project directory for every occurrence of a function name.

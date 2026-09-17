---
sidebar_position: 19
---

# wc

Counts lines, words, and bytes in text.

## Mental Model

`wc` ("word count") just tallies things: by default it prints three numbers: lines, words, and bytes. You almost always narrow it down to just the one number you care about.

## Syntax

```bash
wc [options] [file...]
```

## Basic Example

```bash
wc notes.txt
```

Output:

```text
  42  310 2048 notes.txt
```

That's 42 lines, 310 words, 2048 bytes.

## Common Options

| Option | Meaning |
| --- | --- |
| `-l` | Count lines only |
| `-w` | Count words only |
| `-c` | Count bytes only |
| `-m` | Count characters (differs from `-c` with multi-byte encodings) |

## How It Works

`wc` streams through the input counting newline characters (for lines), whitespace-separated tokens (for words), and raw bytes. It doesn't need to hold the whole file in memory, so it works efficiently even on very large files or continuous piped input.

## Real-World Examples

```bash
# Count how many lines are in a log file
wc -l access.log

# Count how many files are in a directory
ls | wc -l

# Count how many matches grep found
grep -c "ERROR" app.log     # equivalent, purpose-built option
grep "ERROR" app.log | wc -l # same result via piping
```

## Combining Commands

```bash
find . -name "*.py" | wc -l
```

Count how many Python files exist under the current directory.

```bash
cat *.txt | wc -w
```

Count total words across multiple files combined.

## Common Mistakes

* Using `cat file | wc -l` when `wc -l file` does the same thing more directly.
* Forgetting `ls | wc -l` counts lines of output, which can be off if filenames contain newlines (rare, but possible). `find . -maxdepth 1 | wc -l` or similar is more robust for scripting.
* Expecting `-c` and `-m` to always agree: they diverge on files with multi-byte (e.g. UTF-8) characters, since `-c` counts bytes and `-m` counts characters.

## Related Commands

* `grep -c`: count matching lines directly, no piping into `wc` needed
* `du`: count disk usage, a different kind of "size"
* `find`: often piped into `wc -l` to count matching files

## Practice

1. Count the number of lines, words, and bytes in a text file.
2. Count how many files of a certain extension exist in a directory using `find` and `wc -l`.
3. Compare `wc -c` and `wc -m` on a file containing non-ASCII characters and explain the difference.

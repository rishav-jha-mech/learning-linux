---
sidebar_position: 10
---

# cat

Prints the contents of one or more files to standard output.

## Mental Model

`cat` (short for "concatenate") reads files in order and writes their bytes straight to stdout. Giving it multiple files "concatenates" them into one continuous stream.

## Syntax

```bash
cat [options] file...
```

## Basic Example

```bash
cat notes.txt
```

Output: the full contents of `notes.txt` printed to the terminal.

## Common Options

| Option | Meaning |
| --- | --- |
| `-n` | Number every line |
| `-b` | Number only non-blank lines |
| `-A` | Show non-printing characters (tabs, line endings): useful for spotting hidden whitespace |
| `-s` | Squeeze multiple blank lines into one |

## How It Works

`cat` opens each file, reads it in chunks, and writes those chunks to file descriptor 1 (stdout). It does no processing or formatting on its own: any "extra" behavior you see (like a pager stopping and starting output) is your terminal or shell, not `cat`. This simplicity is why `cat` is often piped into other tools that do the real work.

## Real-World Examples

```bash
# Quickly view a small config file
cat /etc/hostname

# Concatenate several files into one
cat part1.txt part2.txt part3.txt > full.txt

# Number lines while reading a script
cat -n deploy.sh
```

## Combining Commands

```bash
cat access.log | grep "500"
```

Feed a file's contents into `grep` to filter for a pattern, though for a single file, `grep "500" access.log` is more efficient (see "Common Mistakes").

## Common Mistakes

* Using `cat file | grep pattern` when `grep pattern file` does the same thing without spawning an extra process. This is common enough to have a name, "Useless Use of Cat." `cat` piped into a single command is usually unnecessary.
* Running `cat` on a huge file and flooding the terminal. Use `less` or `head`/`tail` instead for anything you plan to actually read.
* Running `cat` on a binary file: it dumps raw bytes to the terminal, which can garble your terminal's display; use `file` first to check what you're looking at.

## Related Commands

* `less`: view file contents one screen at a time
* `head` / `tail`: view just the beginning or end of a file
* `grep`: search within file contents directly, no `cat` needed

## Practice

1. Concatenate two small files into a new third file using `cat` and `>`.
2. Try `cat -A` on a file with tabs and trailing spaces to see them made visible.
3. Rewrite `cat error.log | grep "fail"` as a single command without `cat`.

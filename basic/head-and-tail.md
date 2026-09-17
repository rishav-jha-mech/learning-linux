---
sidebar_position: 12
---

# head and tail

Print the beginning (`head`) or end (`tail`) of a file.

## Mental Model

Both commands answer "just show me a piece of this file, not all of it." `head` looks at the start, `tail` looks at the end: the two most common places you actually want to look first.

## Syntax

```bash
head [options] file
tail [options] file
```

## Basic Example

```bash
head access.log
tail access.log
```

Each prints 10 lines by default: the first 10 for `head`, the last 10 for `tail`.

## Common Options

| Option | Meaning |
| --- | --- |
| `-n N` | Show N lines instead of the default 10 |
| `-c N` | Show N bytes instead of lines |
| `-f` | (`tail` only) Follow the file as it grows, printing new lines live |

`tail -f` is one of the most-used commands for watching logs in real time.

## How It Works

`head` reads from the start of the file and stops once it hits the line count, efficient because it never has to read past what it prints. `tail` is trickier: without knowing line boundaries in advance, showing "the last N lines" means seeking near the end of the file and scanning backward (or forward from a calculated offset), which is why `tail` on a giant file is still fast, unlike naively reading the whole thing. `tail -f` keeps the file open and uses filesystem notifications (or polling) to detect new data appended to it.

## Real-World Examples

```bash
# Peek at the first few lines of a CSV to see the header
head -n 3 data.csv

# Watch a log file update live as a server runs
tail -f /var/log/app.log

# See the last 50 lines of a crash log
tail -n 50 crash.log
```

## Combining Commands

```bash
tail -f app.log | grep "ERROR"
```

Follow a live log and filter it down to just error lines as they appear.

```bash
head -n 20 report.csv | column -t
```

Preview the first 20 rows of a CSV formatted into aligned columns.

## Common Mistakes

* Forgetting `-f` exists and repeatedly re-running `tail` to check for new log lines.
* Using `tail -f` on a file that gets rotated (renamed and replaced) by logging tools. `tail -f` keeps watching the old (now renamed) file unless you use `tail -F`, which re-opens the file by name.
* Assuming `head`/`tail` count characters, not lines, by default: use `-c` explicitly if you want bytes.

## Related Commands

* `cat`: show the whole file at once
* `less`: page through interactively, including jumping to the end with `G`
* `watch`: repeatedly re-run a command, an alternative way to observe changing output

## Practice

1. Use `head -n 5` and `tail -n 5` on the same file and describe what each captured.
2. Start `tail -f` on a file, then in another terminal append lines with `echo "test" >> file` and watch them appear live.
3. Compare `tail -f` vs `tail -F` behavior when a log file gets rotated (renamed and a new file created in its place).

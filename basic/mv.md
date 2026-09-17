---
sidebar_position: 8
---

# mv

Moves or renames a file or directory.

## Mental Model

`mv` and renaming are the same operation in Linux — a "rename" is just a move to a new name within the same directory. There's no separate rename command because the filesystem doesn't distinguish the two.

## Syntax

```bash
mv [options] source destination
mv [options] source... directory
```

## Basic Example

```bash
mv draft.txt final.txt
ls
```

Output:

```text
final.txt
```

The file's content and inode are untouched — only its directory entry changes.

## Common Options

| Option | Meaning |
| --- | --- |
| `-i` | Prompt before overwriting an existing file |
| `-n` | Never overwrite an existing file |
| `-v` | Print each move as it happens |

## How It Works

When source and destination are on the same filesystem, `mv` calls `rename()`, which just updates directory entries — no data is copied, so it's instant regardless of file size. When moving across filesystems (e.g. from `/` to a different mounted disk), `rename()` can't work across devices, so `mv` falls back to copying the data and then deleting the original — which is why moving a large file to another drive can be noticeably slower than moving it within the same drive.

## Real-World Examples

```bash
# Rename a file
mv old-name.txt new-name.txt

# Move a file into another directory
mv report.pdf ~/Documents/

# Move multiple files at once
mv *.log logs/
```

## Combining Commands

```bash
mv report.pdf report.pdf.bak && vim report.pdf
```

Back up by renaming, then create a fresh file with the original name.

## Common Mistakes

* Moving a file onto an existing filename and overwriting it without warning — use `-i` if you want a safety prompt.
* Expecting a progress bar on large cross-filesystem moves — plain `mv` gives no feedback; use `rsync --progress` if you need that.
* Confusing "move" with "copy" — after `mv`, the original path no longer exists at all.

## Related Commands

* `cp` — duplicate instead of moving
* `rsync` — move/sync with progress and resumability, especially across filesystems
* `rename` — batch rename using patterns (not on all distros by default)

## Practice

1. Rename a file and confirm its modification timestamp didn't change (only `ls -l --time-style` metadata is worth comparing here, since `mv` doesn't touch timestamps).
2. Move several files into a new directory using a wildcard.
3. Predict whether moving a file between two directories on the same disk is instant or proportional to file size, then verify with a large file and `time mv`.

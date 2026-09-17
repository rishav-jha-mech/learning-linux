---
sidebar_position: 7
---

# cp

Copies files or directories.

## Mental Model

`cp` reads the source file's bytes and writes them into a new file at the destination. Source and destination end up as two independent files — editing one never affects the other.

## Syntax

```bash
cp [options] source destination
cp [options] source... directory
```

## Basic Example

```bash
cp notes.txt notes-backup.txt
ls
```

Output:

```text
notes.txt  notes-backup.txt
```

## Common Options

| Option | Meaning |
| --- | --- |
| `-r` | Copy directories recursively |
| `-p` | Preserve permissions, ownership, and timestamps |
| `-i` | Prompt before overwriting an existing file |
| `-v` | Print each file as it's copied |
| `-u` | Only copy if source is newer than destination |

`-r` is required for directories — plain `cp` refuses them.

## How It Works

`cp` opens the source file, reads its contents, creates a new file at the destination, and writes the data into it. This means the destination gets a brand-new inode — it is not the same file on disk as the source, unlike a hard link. For directories, `-r` walks the tree and repeats this process for every file inside.

## Real-World Examples

```bash
# Back up a config file before editing it
cp /etc/nginx/nginx.conf /etc/nginx/nginx.conf.bak

# Copy an entire project directory
cp -r project/ project-copy/

# Copy multiple files into a directory
cp file1.txt file2.txt destination/
```

## Combining Commands

```bash
cp -r src/ backup/ && rm -rf src/*
```

Copy first, confirm the backup is safe, then clear the original — the `&&` chain limits the destructive step to only run after the copy succeeds.

## Common Mistakes

* Forgetting `-r` when copying a directory — `cp` errors with "omitting directory" instead of copying it.
* Overwriting an important file by accident — `cp` overwrites the destination silently unless `-i` is used.
* Assuming a copy is "linked" to the original — it isn't; `cp` duplicates data, so large files mean real additional disk usage.

## Related Commands

* `mv` — move/rename a file instead of duplicating it
* `rsync` — copy with more control, useful for large or remote transfers
* `ln` — create a link instead of a full copy

## Practice

1. Copy a file, edit the copy, and confirm the original is unchanged.
2. Copy a directory tree with `-r` and verify all files transferred with `ls -R`.
3. Try overwriting a file with `cp -i` and observe the confirmation prompt.

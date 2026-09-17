---
sidebar_position: 6
---

# touch

Creates an empty file if it doesn't exist, or updates a file's timestamp if it does.

## Mental Model

`touch` doesn't really care about content — its main job is timestamps. Creating a new empty file is really a side effect of "update the modified time of a file that isn't there yet."

## Syntax

```bash
touch [options] file...
```

## Basic Example

```bash
touch notes.txt
ls -l notes.txt
```

Output:

```text
-rw-r--r-- 1 user user 0 Jan 1 12:00 notes.txt
```

An empty file is created with the current time as its modified timestamp.

## Common Options

| Option | Meaning |
| --- | --- |
| `-t` | Set a specific timestamp instead of "now" |
| `-a` | Change only the access time |
| `-m` | Change only the modification time |
| `-c` | Don't create the file if it doesn't exist |

## How It Works

On an existing file, `touch` calls `utimensat()` to update the access and modification timestamps stored in the file's inode. On a nonexistent path, it first calls `open()` with the `O_CREAT` flag, which creates a new inode with zero length, then applies the timestamp update.

## Real-World Examples

```bash
# Quickly scaffold empty files for a new project
touch README.md main.py .gitignore

# Force a build tool to think a file changed
touch src/main.c
```

## Combining Commands

```bash
touch file.txt && ls -l file.txt
```

Create the file, then immediately confirm it exists with its metadata.

## Common Mistakes

* Assuming `touch` "resets" a file's contents — it never truncates or modifies content, only timestamps (and creates the file if missing).
* Using `touch` when you meant `>` — `touch file` leaves existing content alone, `> file` truncates it to zero bytes.

## Related Commands

* `stat` — inspect a file's timestamps and metadata
* `mkdir` — create a directory
* `rm` — remove a file

## Practice

1. Create three empty files in one `touch` command.
2. Run `touch` on an existing file, then check with `stat` that only the timestamp changed, not the content.
3. Explain why `touch` is often used to trigger rebuilds in Makefiles.

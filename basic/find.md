---
sidebar_position: 15
---

# find

Searches for files and directories matching criteria, walking a directory tree.

## Mental Model

`find` walks every file and directory under a starting path and tests each one against conditions you give it (name, type, size, age, and more). Unlike `ls`, it's built for scripting: safe with unusual filenames and able to act on what it finds.

## Syntax

```bash
find [path] [conditions] [action]
```

## Basic Example

```bash
find . -name "*.log"
```

Prints every `.log` file under the current directory, recursively.

## Common Options

| Option | Meaning |
| --- | --- |
| `-name` | Match filenames by pattern (case-sensitive) |
| `-iname` | Match filenames, case-insensitive |
| `-type f` / `-type d` | Match files only / directories only |
| `-mtime -N` | Modified within the last N days |
| `-size +N` | Larger than N (e.g. `+100M`) |
| `-delete` | Delete matches directly |
| `-exec cmd {} \;` | Run a command on each match |

## How It Works

`find` recursively calls `readdir()` on each directory it encounters, testing every entry against your conditions as it goes. It doesn't build a full list first; it evaluates and (optionally) acts on each match as it's found. This streaming behavior is why `find ... -delete` can safely process millions of files without loading them all into memory at once.

## Real-World Examples

```bash
# Find files modified in the last day
find /var/log -mtime -1

# Find and remove all .tmp files
find . -name "*.tmp" -delete

# Find large files eating disk space
find / -type f -size +500M 2>/dev/null

# Run a command on every match
find . -name "*.sh" -exec chmod +x {} \;
```

## Combining Commands

```bash
find . -name "*.log" | xargs wc -l
```

Feed matched filenames into another command. `xargs` is often paired with `find` for this, though `find -exec` can do the same thing more safely with unusual filenames.

## Common Mistakes

* Parsing `ls` output when `find` would be the safe, script-friendly choice: `find -print0` piped to `xargs -0` correctly handles filenames with spaces or newlines, where naive `ls` parsing breaks.
* Running `find / -delete` conditions without testing them first: always run the search without `-delete` first to confirm the match list is what you expect.
* Forgetting `2>/dev/null` when searching from `/`: you'll get a wall of "Permission denied" errors from directories you can't read.

## Related Commands

* `locate`: much faster file search using a prebuilt index, but can be stale
* `grep -r`: search file *contents* recursively, rather than filenames
* `xargs`: build and run commands from `find`'s output

## Practice

1. Find all files larger than 100MB under your home directory.
2. Find and list (without deleting) every file older than 30 days in a test directory.
3. Use `find ... -exec` to make every `.sh` file in a directory executable in one command.

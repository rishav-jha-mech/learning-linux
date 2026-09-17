---
sidebar_position: 10
---

# readlink, stat, and findmnt

Resolve symbolic links (`readlink`), inspect detailed file metadata (`stat`), and query the mount table (`findmnt`).

## Mental Model

These are inspection tools for the layers underneath ordinary file access: what a symlink actually points to, exactly what metadata an inode carries, and which filesystem a given path actually lives on.

## Syntax

```bash
readlink [options] path
stat [options] file
findmnt [options] [mountpoint]
```

## Basic Example

```bash
readlink -f /usr/bin/python3
```

Output:

```text
/usr/bin/python3.11
```

`-f` fully resolves every symlink in the chain to the real underlying file.

```bash
stat notes.txt
```

Output (abridged):

```text
  File: notes.txt
  Size: 2048        Blocks: 8          IO Block: 4096   regular file
Device: 803h/2051d   Inode: 1234567    Links: 1
Access: 2024-01-01 10:00:00
Modify: 2024-01-01 09:55:00
Change: 2024-01-01 09:55:00
```

```bash
findmnt /home
```

Shows exactly which device and filesystem type `/home` is mounted from.

## Common Options

| Command | Option | Meaning |
| --- | --- | --- |
| `readlink` | `-f` | Fully resolve the entire symlink chain to the final real path |
| `stat` | `-c FORMAT` | Print specific fields in a custom format, useful for scripting |
| `stat` | `-f` | Show filesystem-level info instead of file-level info |
| `findmnt` | `-T path` | Find the mount covering a specific path, not just exact mount points |

## How It Works

A symlink is a special file whose content is just a path string — `readlink` reads that string directly rather than following it, and `-f` repeatedly follows the chain (a symlink can point to another symlink) until it reaches a real file. `stat` reads a file's inode directly, exposing metadata that `ls -l` only partially summarizes: exact timestamps (access, modify, *change* — note "change" refers to metadata changes like permissions, not content), inode number, and hard link count. `findmnt` reads the kernel's live mount table (the same data `mount` and `/proc/mounts` expose) to answer "what filesystem actually backs this path" — useful because the mount at `/` doesn't necessarily extend to `/home` or `/var` if they're separate mounted filesystems.

## Real-World Examples

```bash
# Find where a symlinked binary (e.g. installed by a version manager) really points
readlink -f $(which node)

# Check exact timestamps and inode details for a file
stat important-file.txt

# Confirm which physical disk/partition a directory is actually on
findmnt /var/lib/docker

# Script-friendly: extract just the file size
stat -c %s file.txt
```

## Combining Commands

```bash
stat -c '%n %s' *.log | sort -k2 -n
```

List every `.log` file with its size, sorted numerically — a scriptable alternative to `ls -l` when you need exact, parseable output.

## Common Mistakes

* Confusing a symlink's own metadata with its target's — `stat` by default follows the link and reports on the target; `stat -L`/`--no-dereference`-style flags (implementation-dependent) are needed to inspect the symlink itself.
* Assuming every subdirectory shares the same filesystem as its parent — `/`, `/home`, `/var`, and others are frequently separate mounts, which `findmnt` reveals but a casual `ls`/`cd` never would.
* Parsing `ls -l`'s timestamp column in scripts instead of using `stat -c` with an explicit format — `ls` output formatting can vary and isn't meant for reliable parsing.

## Related Commands

* `ln` — create the symlinks that `readlink` resolves
* `df` — filesystem-level space usage, complementary to `findmnt`'s "what's mounted where"
* `lsblk` — see the block devices underlying what `findmnt` reports

## Practice

1. Find a symlinked command on your system (many version-managed tools are) and fully resolve it with `readlink -f`.
2. Use `stat` to compare a file's access, modify, and change timestamps after touching vs. editing vs. chmod'ing it.
3. Use `findmnt` to determine whether your home directory is on the same filesystem as `/`, or a separate mount.

---
sidebar_position: 3
---

# ls

Lists the contents of a directory.

## Mental Model

`ls` asks the filesystem "what's in this directory?" and prints the names it gets back. Without arguments, it lists the current directory.

## Syntax

```bash
ls [options] [path...]
```

## Basic Example

```bash
cd /etc
ls
```

Output:

```text
hosts
passwd
ssh
...
```

Names are printed in columns, sorted alphabetically by default.

## Common Options

| Option | Meaning |
| --- | --- |
| `-l` | Long format: permissions, owner, size, modified date |
| `-a` | Show hidden files (names starting with `.`) |
| `-h` | With `-l`, show sizes in human-readable form (K, M, G) |
| `-t` | Sort by modification time, newest first |
| `-R` | List subdirectories recursively |
| `-d` | Show a directory itself, not its contents |

`-la` (or `-al`) is the combination used constantly in practice.

## How It Works

`ls` opens the directory and reads its entries via the `readdir()` system call — a directory is really just a special file the kernel maintains, mapping names to inode numbers. For `-l`, `ls` then calls `stat()` on each entry to fetch permissions, size, and timestamps, which is why `ls -l` on a huge directory is noticeably slower than plain `ls`.

## Real-World Examples

```bash
# See permissions and sizes before changing anything
ls -lh /var/log

# Find the most recently modified files
ls -lt

# See hidden config files in your home directory
ls -la ~
```

## Combining Commands

```bash
ls -la | grep '^d'
```

Filters `ls -la` output down to lines starting with `d` — directories only (fragile in general, since it depends on column position, but common for quick checks).

```bash
ls -t | head -5
```

Shows the 5 most recently modified entries.

## Common Mistakes

* Forgetting `-a` and assuming a directory is empty when it only contains dotfiles.
* Parsing `ls` output in scripts — filenames can contain spaces, newlines, or glob characters, which breaks naive parsing. Use `find` or shell globbing instead for anything script-critical.
* Confusing `-l`'s size column with actual disk usage — it shows the file's logical size, not blocks consumed on disk (`du` shows that).

## Related Commands

* `cd` — change directory
* `find` — search for files by criteria, safe for scripting
* `du` — show actual disk usage
* `stat` — show detailed metadata for a single file

## Practice

1. Run `ls -la` in your home directory and identify at least 3 dotfiles.
2. Compare `ls -l` size output with `du -h` for the same file.
3. Use `ls -lt` to find the last file you modified in the current directory.

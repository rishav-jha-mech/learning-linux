---
sidebar_position: 13
---

# chmod

Changes a file or directory's permissions.

## Mental Model

Every file has three permission sets: what the owner can do, what the owning group can do, and what everyone else can do. Each set controls read, write, and execute. `chmod` edits those bits.

## Syntax

```bash
chmod [options] mode file...
```

Mode can be symbolic (`u+x`) or numeric (`755`).

## Basic Example

```bash
chmod +x deploy.sh
ls -l deploy.sh
```

Output:

```text
-rwxr-xr-x 1 user user 128 Jan 1 12:00 deploy.sh
```

The script is now executable for everyone (owner, group, and others already had read; `+x` added execute across the board here since no target was specified).

## Common Options

| Option | Meaning |
| --- | --- |
| `-R` | Apply recursively to a directory and its contents |
| `-v` | Print what changed |

## Numeric vs Symbolic Modes

Numeric mode uses three digits, one per permission set (owner, group, others), each a sum of read (4), write (2), execute (1):

| Value | Meaning |
| --- | --- |
| `7` | rwx (4+2+1) |
| `6` | rw- (4+2) |
| `5` | r-x (4+1) |
| `4` | r-- |
| `0` | no permissions |

```bash
chmod 644 file.txt    # owner: rw-, group: r--, others: r--
chmod 755 script.sh   # owner: rwx, group: r-x, others: r-x
```

Symbolic mode targets `u` (user/owner), `g` (group), `o` (others), or `a` (all), with `+`, `-`, or `=`:

```bash
chmod u+x script.sh     # add execute for the owner only
chmod g-w file.txt      # remove write for the group
chmod o=r file.txt      # set others' permission to exactly read
```

## How It Works

Permission bits live in the file's inode. `chmod` calls the `chmod()` system call, which the kernel checks and applies directly — no data in the file itself is touched, only its metadata. The kernel enforces these bits on every subsequent access: a process without execute permission on a file gets denied at the `exec()` system call, not by some higher-level check.

## Real-World Examples

```bash
# Make a downloaded script runnable
chmod +x install.sh

# Lock a sensitive file down to owner-only read/write
chmod 600 ~/.ssh/id_rsa

# Recursively fix permissions on a directory tree
chmod -R 755 /var/www/html
```

## Combining Commands

```bash
chmod +x script.sh && ./script.sh
```

Make executable, then run — a pattern you'll type constantly after downloading or writing shell scripts.

## Common Mistakes

* Using `chmod 777` "to make it work" — this grants write and execute to everyone, a common and serious security mistake, especially on shared or internet-facing systems.
* Forgetting SSH refuses to use private keys with overly permissive modes (e.g. `644`) — SSH expects `600` and will reject or warn on keys readable by others.
* Confusing `chmod` (permissions) with `chown` (ownership) — they solve different problems and are often needed together.

## Related Commands

* `chown` — change file owner and group
* `umask` — set default permissions for newly created files
* `ls -l` — inspect current permissions

## Practice

1. Create a script, make it executable with `chmod +x`, and run it.
2. Set a file to `600` and explain in your own words why SSH cares about key file permissions.
3. Convert `chmod 750` into its symbolic equivalent (`u=rwx,g=rx,o=`).

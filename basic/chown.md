---
sidebar_position: 14
---

# chown

Changes the owner and/or group of a file or directory.

## Mental Model

Every file has exactly one owning user and one owning group recorded in its metadata. `chown` changes who those are — separate from `chmod`, which controls what each of them (and everyone else) is allowed to do.

## Syntax

```bash
chown [options] user[:group] file...
```

## Basic Example

```bash
chown alice file.txt
ls -l file.txt
```

Output:

```text
-rw-r--r-- 1 alice staff 128 Jan 1 12:00 file.txt
```

The owner is now `alice`; the group is unchanged.

## Common Options

| Option | Meaning |
| --- | --- |
| `-R` | Apply recursively to a directory and its contents |
| `-v` | Print what changed |

## Common Forms

```bash
chown alice file.txt          # change owner only
chown :staff file.txt         # change group only
chown alice:staff file.txt    # change both owner and group
chown -R alice:staff dir/     # apply recursively to a directory tree
```

## How It Works

Ownership is stored in the file's inode as numeric user and group IDs — names like `alice` are just a lookup against `/etc/passwd` and `/etc/group` at display time. Changing ownership requires the `chown()` system call, and on most systems only the superuser (root) can give a file away to another user; a regular user can change a file's group only to a group they themselves belong to.

## Real-World Examples

```bash
# Fix ownership after copying files in as root
sudo chown -R deploy:deploy /var/www/myapp

# Hand a file to another user
sudo chown bob shared-report.txt
```

## Combining Commands

```bash
sudo chown -R www-data:www-data /var/www/html && sudo chmod -R 755 /var/www/html
```

Fix both ownership and permissions in sequence — a common pattern when deploying web application files.

## Common Mistakes

* Trying to `chown` a file to another user without `sudo` — regular users can't give files away, only root can.
* Forgetting `-R` on a directory and ending up with mismatched ownership between a directory and its contents.
* Confusing `chown` (who owns it) with `chmod` (what they can do with it) — you often need both when fixing permission issues on a server.

## Related Commands

* `chmod` — change what owner/group/others are allowed to do
* `chgrp` — change only the group, a narrower version of `chown :group`
* `ls -l` — inspect current ownership

## Practice

1. Create a file, check its owner with `ls -l`, then (if you have sudo access) change its owner.
2. Change only the group of a file using `chown :groupname`.
3. Explain why a regular, non-root user typically cannot `chown` a file to someone else.

---
sidebar_position: 13
---

# df, du, lsblk, mount, and umount

See how disks are laid out, how much space is used, and attach/detach filesystems.

## Mental Model

`lsblk` shows you the physical/logical block devices (disks and partitions) on the system. `mount` and `umount` attach and detach a filesystem from a directory in your tree, making its contents accessible (or not) at that path. `df` reports space usage per mounted filesystem; `du` reports space usage per file/directory — a subtly different question ("how full is this disk" vs "how much space does this specific thing take up").

## Syntax

```bash
lsblk
df [options] [path]
du [options] [path]
mount device mountpoint
umount mountpoint
```

## Basic Example

```bash
df -h
```

Output:

```text
Filesystem  Size  Used  Avail  Use%  Mounted on
/dev/sda1    50G   32G    18G   64%  /
```

```bash
du -sh /var/log
```

Output:

```text
1.2G  /var/log
```

## Common Options

| Command | Option | Meaning |
| --- | --- | --- |
| `df` | `-h` | Human-readable sizes (K/M/G) |
| `du` | `-s` | Summarize — total for a directory, not every file inside |
| `du` | `-h` | Human-readable sizes |
| `du` | `-a` | Show all files, not just directories |
| `lsblk` | (none needed) | Lists disks/partitions and their mount points |

## How It Works

A Linux filesystem tree is really an assembly of separate filesystems "mounted" at various points — `/`, `/home`, `/boot` might each be a different physical partition or even a different disk, joined together at mount points via the `mount()` system call. `df` reads filesystem-level statistics (`statfs()`), which is why it reports numbers per filesystem, not per directory. `du` instead walks the actual directory tree, summing the size of every file it finds — this is why `du -sh` on a large directory can take a while (it has to visit every file), while `df -h` is instant (it just reads pre-tracked filesystem metadata).

## Real-World Examples

```bash
# Check overall disk space
df -h

# Find what's taking up space in a directory, sorted largest first
du -sh /var/log/* | sort -rh

# See attached disks and their partitions
lsblk

# Manually mount a USB drive
sudo mount /dev/sdb1 /mnt/usb

# Safely detach it before removing
sudo umount /mnt/usb
```

## Combining Commands

```bash
du -sh /var/* 2>/dev/null | sort -rh | head -10
```

Find the 10 largest top-level directories under `/var` — a common first step when a disk is unexpectedly full.

## Common Mistakes

* Confusing `df`'s "disk full" with `du`'s "this folder is big" — a disk can show 100% full via `df` from something entirely outside the directory you're checking with `du`.
* Unplugging a drive without `umount` first — pending writes may not have been flushed to disk yet, risking data corruption. Always `umount` before physically removing external media.
* Forgetting that a deleted-but-still-open file (e.g. a log a running process is still writing to) keeps consuming disk space that `df` reports as used, but `du` might not "see" clearly depending on where you're looking — this discrepancy trips people up when trying to free space by deleting an open file that a process still holds.

## Related Commands

* `fdisk` / `parted` — partition disks (a more advanced, riskier operation)
* `findmnt` — see what's mounted where, in a more query-friendly format than `mount` alone
* `ncdu` — an interactive, much friendlier alternative to `du` for exploring disk usage

## Practice

1. Run `df -h` and identify how full your root filesystem is.
2. Use `du -sh` on a few directories in your home folder and rank them by size.
3. If you have a USB drive available, mount and unmount it manually, observing the process with `lsblk` before and after.

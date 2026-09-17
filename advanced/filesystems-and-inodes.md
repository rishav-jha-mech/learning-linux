---
sidebar_position: 12
---

# Filesystems and Inodes

What actually organizes data on disk, and the structure that represents each individual file.

## Mental Model

A filesystem is a scheme for organizing bytes on a disk into files and directories. An inode is the record that represents one specific file within that scheme: its metadata (owner, permissions, size, timestamps, and pointers to where its actual data lives), separate from its name. A filename is just an entry in a directory pointing at an inode; the same inode can have multiple names (hard links) or none at all (an unlinked-but-still-open file).

## Key Facts

| Concept | Meaning |
| --- | --- |
| inode | A data structure holding a file's metadata and pointers to its data blocks |
| Directory entry | A name-to-inode mapping stored inside a directory |
| Hard link | A second directory entry pointing at the *same* inode |
| Symlink | A separate file whose content is a path string, pointing at a name, not an inode directly |
| Filesystem type | The on-disk format/scheme (ext4, xfs, btrfs, etc.) |

## Seeing Inodes

```bash
ls -i file.txt
```

Output:

```text
1234567 file.txt
```

Shows the inode number backing that filename.

```bash
stat file.txt
```

Shows the inode number along with full metadata, covered in [readlink, stat, and findmnt](/docs/advanced/readlink-stat-findmnt).

```bash
df -i
```

Shows inode usage per filesystem. Yes, a filesystem can run out of *inodes* even with free disk space, if it has an enormous number of tiny files.

## How It Works

A directory, structurally, is just a special kind of file whose content is a list of (name, inode number) pairs. This is why creating a hard link doesn't duplicate any file data, it just adds another directory entry pointing at the same existing inode. The actual data blocks a file occupies are tracked *inside* the inode (or via structures the inode points to), completely separate from the name, which is why renaming or moving a file within the same filesystem is instant (only the directory entry changes) while the underlying data never moves, as covered in [mv](/docs/basic/mv). A file's data isn't actually freed until its inode's link count drops to zero *and* no process still has it open. This is the deeper mechanism behind the [rm](/docs/basic/rm) behavior where deleting a file a running process is still writing to doesn't immediately reclaim disk space.

## Real-World Examples

```bash
# Find the inode number of a file
ls -i important-file.txt

# Find every hard link pointing at the same inode
find / -inum 1234567 2>/dev/null

# Check whether a filesystem is running low on inodes, not just disk space
df -i
```

## Combining Commands

```bash
find . -type f -links +1
```

Find every file that has more than one hard link: files that exist under more than one name simultaneously.

## Common Mistakes

* Confusing a symlink with a hard link: a symlink is a separate file containing a path string and can dangle if the target moves or is deleted; a hard link is a second name for the *exact same* inode and can't dangle in that way, but also can't cross filesystem boundaries (an inode is only meaningful within its own filesystem).
* Running out of inodes while `df -h` still shows free space: this happens with workloads that create huge numbers of very small files; `df -i` is the check that catches it.
* Assuming deleting a file always frees its disk space immediately: if another process still has it open, the space isn't reclaimed until that process closes it too, as covered in [rm](/docs/basic/rm).

## Related Commands

* [readlink, stat, and findmnt](/docs/advanced/readlink-stat-findmnt): inspect inode metadata and mount info directly
* [mv](/docs/basic/mv): moves are instant within a filesystem because only directory entries change, not inode data
* [rm](/docs/basic/rm): removes a directory entry and decrements the inode's link count

## Practice

1. Create a hard link to a file (`ln file.txt link.txt`) and confirm with `ls -i` that both names share the same inode number.
2. Check `df -i` on your system and see how many inodes are used vs. available.
3. Explain why a symlink can point across filesystems but a hard link cannot.

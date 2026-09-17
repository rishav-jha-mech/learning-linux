---
sidebar_position: 5
---

# mkdir

Creates a new directory.

## Mental Model

`mkdir` asks the filesystem to create a new directory entry. By default it only creates one level at a time: the parent directory must already exist.

## Syntax

```bash
mkdir [options] directory...
```

## Basic Example

```bash
mkdir project
ls
```

Output:

```text
project
```

## Common Options

| Option | Meaning |
| --- | --- |
| `-p` | Create parent directories as needed, and don't error if the directory already exists |
| `-v` | Print a message for each directory created |
| `-m` | Set permissions for the new directory |

`-p` is the one you'll reach for constantly.

## How It Works

`mkdir` calls the `mkdir()` system call, which creates a new inode of type "directory" and adds an entry for it in the parent directory. Every new directory starts with two automatic entries: `.` (itself) and `..` (its parent). Those aren't a `mkdir` convention, they're created by the kernel as part of directory creation.

## Real-World Examples

```bash
# Create a nested path in one shot
mkdir -p ~/projects/2024/linux-notes

# Create several sibling directories at once
mkdir src tests docs
```

## Combining Commands

```bash
mkdir -p build && cd build
```

Create a directory and immediately move into it: common at the start of a build or scratch session.

## Common Mistakes

* Running `mkdir a/b/c` without `-p` when `a` and `b` don't exist yet: it fails with "No such file or directory" instead of creating the whole chain.
* Assuming `mkdir` fails silently if the directory exists: without `-p` it errors out; with `-p` it succeeds silently, which can hide typos in scripts.

## Related Commands

* `rmdir`: remove an empty directory
* `rm -r`: remove a directory and its contents
* `touch`: create an empty file
* `ls`: confirm the directory was created

## Practice

1. Create a 3-level nested directory in one command using `-p`.
2. Try creating the same directory twice without `-p` and observe the error, then retry with `-p`.
3. Create three sibling directories in a single `mkdir` call.

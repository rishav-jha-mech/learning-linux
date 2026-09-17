---
sidebar_position: 2
---

# pwd

Prints the current working directory: the absolute path of where the shell "is" right now.

## Mental Model

Every running process, including your shell, has a concept of a "current directory." `pwd` just asks the shell to print it.

## Syntax

```bash
pwd [options]
```

## Basic Example

```bash
cd /usr/local
pwd
```

Output:

```text
/usr/local
```

`cd` changes the shell's current directory, and `pwd` reports it back.

## Common Options

| Option | Meaning |
| --- | --- |
| `-L` | Print the logical path (follow symlinks as typed, default behavior) |
| `-P` | Print the physical path (resolve all symlinks to their real target) |

Only useful when symlinks are involved.

## How It Works

The shell keeps track of the current directory internally (it's inherited from the `cd` builtin, which calls the `chdir()` system call). `pwd` as a shell builtin just reads that tracked value: it doesn't need to ask the kernel again, though the standalone `/bin/pwd` binary does read it fresh via `getcwd()`.

## Real-World Examples

```bash
# Confirm where you are before running something destructive
pwd
rm -rf ./build
```

```bash
# See the real path when working through symlinks
cd /var/log/myapp   # symlinked to /opt/myapp/log
pwd -L               # /var/log/myapp
pwd -P                # /opt/myapp/log
```

## Combining Commands

```bash
echo "Running from: $(pwd)"
```

Command substitution `$(pwd)` inserts the current directory into a string, commonly used in scripts that log their own location.

## Common Mistakes

* Assuming `pwd` always matches what you last typed with `cd`: after `cd` through a symlink, `-L` and `-P` can print different paths.
* Confusing `pwd` with `$PWD`: `$PWD` is an environment variable the shell updates on every `cd`; `pwd` re-reads or re-prints it. They usually agree but aren't the same mechanism.

## Related Commands

* `cd`: change the current directory
* `ls`: list contents of a directory
* `realpath`: resolve a path to its absolute, symlink-free form

## Practice

1. Run `pwd` right after opening a new terminal. Where does it point?
2. Create a symlink to a directory, `cd` into it, and compare `pwd -L` vs `pwd -P`.
3. Write a one-line script that prints `"You are in: <current dir>"` using `pwd`.

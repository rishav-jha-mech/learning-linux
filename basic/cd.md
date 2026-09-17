---
sidebar_position: 4
---

# cd

Changes the shell's current working directory.

## Mental Model

Your shell always has a "current directory" it uses to resolve relative paths. `cd` updates that value. It only affects the shell it's run in — it can't change the directory of your parent shell or any other process.

## Syntax

```bash
cd [path]
```

## Basic Example

```bash
cd /var/log
pwd
```

Output:

```text
/var/log
```

Running `cd` with no arguments takes you to your home directory (`$HOME`).

## Common Options

| Option / Argument | Meaning |
| --- | --- |
| `cd` | Go to `$HOME` |
| `cd -` | Go to the previous directory |
| `cd ..` | Go up one directory |
| `cd ~user` | Go to another user's home directory |

`cd` is a shell builtin, not a separate program — it has to be, since a separate process couldn't change its parent shell's state.

## How It Works

`cd` calls the `chdir()` system call, which updates the *process's* current working directory in the kernel. Because it's a builtin, it changes the shell process itself rather than spawning a child. This is also why `cd` inside a script only affects that script's subshell, not the shell that launched it — once the script exits, you're back wherever you started.

## Real-World Examples

```bash
# Jump into a project, do something, jump back
cd /opt/myapp
cat config.yaml
cd -
```

```bash
# Quick way to bounce between two directories
cd /var/log
cd /etc
cd -   # back to /var/log
cd -   # back to /etc
```

## Combining Commands

```bash
cd /tmp && mkdir scratch && cd scratch
```

`&&` chains commands so each only runs if the previous succeeded — useful to avoid creating a directory in the wrong place if `cd` fails.

## Common Mistakes

* Expecting `cd` inside a script to change the directory of the shell that called the script — it won't, since the script runs in its own subshell.
* Using `cd` in scripts without checking it succeeded — if the target doesn't exist, `cd` fails but the rest of the script may keep running against the wrong directory. Prefer `cd /some/path || exit 1` in scripts.
* Forgetting `cd -` exists and manually retyping long paths to go back.

## Related Commands

* `pwd` — show the current directory
* `pushd` / `popd` — maintain a stack of directories to jump between
* `ls` — see what's in the directory you just moved into

## Practice

1. `cd` to `/tmp`, then run `cd -` twice and predict where you'll end up each time.
2. Write a two-line script that does `cd /nonexistent || echo "failed"` and confirm it prints the failure message instead of silently continuing.
3. Compare `cd ..` from `/usr/local/bin` with `cd ../..`.

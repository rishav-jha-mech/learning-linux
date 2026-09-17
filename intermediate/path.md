---
sidebar_position: 24
---

# PATH

The environment variable that tells your shell where to look for commands.

## Mental Model

When you type a command name like `python3`, the shell doesn't have some built-in map of every program on the system — it checks a list of directories, in order, until it finds an executable file with that name. `$PATH` is that list.

## Basic Example

```bash
echo $PATH
```

Output:

```text
/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin
```

Directories are separated by `:`. The shell checks them left to right, using the first match it finds.

## Modifying PATH

```bash
export PATH="$HOME/bin:$PATH"
```

Prepends a directory to the front of `$PATH`, so anything in `~/bin` is found *before* system directories — useful for personal scripts, or intentionally overriding a system tool with your own version.

```bash
export PATH="$PATH:/opt/tool/bin"
```

Appends instead, so it's only used as a fallback if no earlier directory has a matching command.

## How It Works

When the shell needs to run a command that isn't a builtin or a function, it searches `$PATH` directory by directory, checking for an executable file matching the name, and runs the first one found — this exact search is what [which](/docs/basic/which) shows you the result of. Because it's just an environment variable, `$PATH` is inherited by child processes the same way any other exported variable is (see [env, export, and source](/docs/intermediate/env-export-source)) — a subprocess started from your shell sees the same `$PATH` unless something explicitly changes it first.

## Real-World Examples

```bash
# Add your personal scripts directory permanently (add this line to ~/.bashrc or ~/.zshrc)
export PATH="$HOME/bin:$PATH"

# Temporarily test a different version of a tool by prepending its directory
PATH="/opt/node-18/bin:$PATH" node --version

# See exactly which directories are searched, one per line
echo $PATH | tr ':' '\n'
```

## Combining Commands

```bash
which -a python3
```

See every `python3` found across all of `$PATH`, not just the first — useful for diagnosing "why is the wrong version running" issues, since order in `$PATH` determines which one wins.

## Common Mistakes

* Installing a tool and it "not being found" even though the file clearly exists — the directory it was installed into simply isn't in `$PATH` yet; adding it (and opening a new shell, or re-sourcing your shell config) fixes this.
* Editing `$PATH` in the wrong startup file — depending on your shell and how a session starts (interactive vs. login, terminal vs. script), different files (`.bashrc`, `.bash_profile`, `.zshrc`, `.profile`) may or may not be read, causing confusing "it works in one terminal but not another" symptoms.
* Putting a directory you don't fully trust early in `$PATH` — since the *first* match wins, a malicious or accidental file with a common name (like `ls` or `cd`) placed in an early directory would silently override the real command for anything that searches `$PATH`.

## Related Commands

* [which](/docs/basic/which) — shows exactly which file `$PATH` resolves a command name to
* [env, export, and source](/docs/intermediate/env-export-source) — how `$PATH`, like any environment variable, is set and inherited
* `type` — a shell-aware alternative to `which`, also respects `$PATH` for external commands

## Practice

1. Print your current `$PATH`, split across lines with `tr ':' '\n'`, and identify which directories come first.
2. Add a personal scripts directory to your `$PATH` temporarily, create a simple script there, and run it by name.
3. Use `which -a` on a command you've installed multiple versions of (or simulate it) to see every match across `$PATH`, in search order.

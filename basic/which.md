---
sidebar_position: 21
---

# which

Shows the full path of the executable that would run for a given command name.

## Mental Model

When you type a command like `python`, the shell doesn't magically know where it lives — it searches a list of directories (`$PATH`) in order and runs the first match it finds. `which` shows you exactly which file that search would pick.

## Syntax

```bash
which command
```

## Basic Example

```bash
which python3
```

Output:

```text
/usr/bin/python3
```

## Common Options

| Option | Meaning |
| --- | --- |
| `-a` | Show every match in `$PATH`, not just the first one |

## How It Works

`which` reads `$PATH`, splits it on `:`, and checks each directory in order for an executable file matching the name — stopping at the first hit, which is exactly the same lookup the shell itself performs when you run a command. `which -a` continues checking every directory instead of stopping, useful when multiple versions of a tool are installed and you're not sure which one actually runs.

## Real-World Examples

```bash
# Confirm which python interpreter is actually being used
which python3

# See if a tool is even installed
which docker || echo "not installed"

# Find every version of node on your PATH
which -a node
```

## Combining Commands

```bash
$(which python3) --version
```

Run whatever `which` resolves to directly — rarely necessary, but shows how `which`'s output is just a path.

## Common Mistakes

* Confusing `which` with `whereis` — `which` only searches `$PATH` for executables; `whereis` also looks for man pages and source, and searches a different, more limited set of locations.
* Not realizing shell builtins (like `cd`) and aliases don't show up correctly with `which` on some shells — `type command` is more reliable for those cases.
* Assuming the first result in `$PATH` is always the one you want — if you have multiple installs (e.g. via a version manager), order in `$PATH` determines which one wins, and it can surprise you.

## Related Commands

* `type` — shows whether a name is an alias, builtin, function, or executable (more shell-aware than `which`)
* `whereis` — locate binaries, source, and man pages together
* `command -v` — POSIX-portable alternative to `which`

## Practice

1. Run `which` on a few common tools (`python3`, `node`, `git`) and note their paths.
2. Use `which -a` on a tool you've installed multiple versions of (or simulate it) and observe every match.
3. Compare `which python3` with `type python3` and note any differences in what they report.

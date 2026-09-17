---
sidebar_position: 5
---

# env, export, and source

Inspect, set, and load environment variables and shell configuration.

## Mental Model

Every process has a set of environment variables: key/value pairs passed down to it when it starts, and inherited by any process it spawns. `export` promotes a shell variable into that inherited environment; `env` shows what's currently in it; `source` runs a script's commands in your *current* shell instead of a new subprocess, so any variables it sets stick around.

## Syntax

```bash
env
export NAME=value
source script.sh    # or: . script.sh
```

## Basic Example

```bash
export API_KEY=abc123
env | grep API_KEY
```

Output:

```text
API_KEY=abc123
```

## Common Options / Forms

| Form | Meaning |
| --- | --- |
| `export VAR=value` | Set a variable and make it inheritable by child processes |
| `VAR=value` (no export) | Set a variable visible only in the current shell, not passed to children |
| `env` | Print all environment variables |
| `env VAR=value command` | Run a single command with a temporarily overridden variable |
| `source file` / `. file` | Run a script in the current shell, so its variable changes persist |

## How It Works

When a process starts another process (via `fork()` + `exec()`), the kernel copies the parent's environment into the child. A shell variable that isn't `export`ed lives only in the shell's own memory and never gets copied anywhere: `export` is what flags it to be included in that copy. `source` (or `.`) works differently from running a script normally: `./script.sh` executes it as a *new* process, so anything it sets vanishes when it exits; `source script.sh` runs its commands directly in your current shell, so variable and directory changes persist afterward.

## Real-World Examples

```bash
# Set an API key for the rest of the session
export DATABASE_URL="postgres://localhost/mydb"

# Temporarily override a variable for one command only
env NODE_ENV=production node server.js

# Load variables from a .env-style file into your current shell
source .env
```

## Combining Commands

```bash
export PATH="$HOME/bin:$PATH"
```

Prepend a directory to `$PATH`, one of the most common `export` uses, making your own scripts runnable by name.

## Common Mistakes

* Setting `VAR=value` without `export` and being confused why a subprocess (like a script or another program) doesn't see it: only exported variables are inherited.
* Running a script with `./setup.sh` when you meant `source setup.sh`: if the script's purpose is to set environment variables for your current session, running it as a subprocess means those variables disappear the moment it finishes.
* Permanently exporting secrets in shell startup files (`.bashrc`, `.zshrc`) that then leak into `env` output, shell history, or crash dumps more broadly than intended.

## Related Commands

* `printenv`: similar to `env`, print environment variables
* `unset`: remove a variable entirely
* `alias`: define a shorthand command, a different mechanism from environment variables

## Practice

1. Set a variable without `export`, then check whether a subshell (`bash -c 'echo $VAR'`) can see it. Repeat with `export` and compare.
2. Create a small script that sets a variable, run it normally, then run it again with `source`, and compare whether the variable persists in your shell afterward.
3. Use `env VAR=value command` to run a single command with a temporary override, without affecting your shell's persistent environment.

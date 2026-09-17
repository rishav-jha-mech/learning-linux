---
sidebar_position: 22
---

# history

Shows previously run shell commands.

## Mental Model

Your shell keeps a running log of every command you type, both in memory during the session and saved to a file (like `~/.bash_history` or `~/.zsh_history`) when the session ends. `history` shows you that log.

## Syntax

```bash
history [N]
```

## Basic Example

```bash
history 5
```

Output:

```text
  501  cd /var/log
  502  ls -la
  503  cat syslog
  504  grep error syslog
  505  history 5
```

Each entry is numbered so you can re-run it.

## Common Options / Usage

| Form | Meaning |
| --- | --- |
| `history` | Show the full recorded history |
| `history N` | Show only the last N entries |
| `!N` | Re-run the command at history number N |
| `!!` | Re-run the previous command |
| `Ctrl+R` | Interactively search history as you type |

## How It Works

Commands are appended to the shell's in-memory history list as you type them, and written out to a history file on disk when the shell exits (or continuously, depending on shell settings). `history` just prints that in-memory list. `Ctrl+R` triggers the shell's reverse-search feature, which searches that same history incrementally as you type.

## Real-World Examples

```bash
# Re-run the last command with sudo
sudo !!

# Find every git command you've run recently
history | grep git

# Quickly repeat a long command from a few steps back
!502
```

## Combining Commands

```bash
history | grep "docker run" | tail -5
```

Find the last few `docker run` invocations you typed, useful when you don't remember the exact flags you used.

## Common Mistakes

* Assuming `history` shows commands from other terminal sessions in real time — by default each shell session's history is only written to disk when that session exits, so commands from a currently-open second terminal may not show up yet.
* Forgetting sensitive commands (with passwords or tokens typed inline) get saved to your history file in plain text — avoid typing secrets directly on the command line.
* Not knowing `Ctrl+R` exists and scrolling through hundreds of history entries manually.

## Related Commands

* `!!` / `!N` — shell history expansion, not a separate command but closely tied to `history`
* `fc` — edit and re-run a previous command in your `$EDITOR`
* `alias` — save a frequently-used command permanently instead of relying on history to find it again

## Practice

1. Run a handful of commands, then use `history` to list them with their numbers.
2. Re-run one specific past command using its `!N` number.
3. Use `Ctrl+R` to interactively search for a command you ran earlier in the session.

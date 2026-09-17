---
sidebar_position: 24
---

# clear

Clears the terminal screen.

## Mental Model

`clear` doesn't erase anything meaningful — your shell's history and scrollback are untouched. It just tells the terminal to wipe the visible screen and reset the cursor to the top, so you get a clean view.

## Syntax

```bash
clear
```

No arguments needed for everyday use.

## Basic Example

```bash
clear
```

The visible terminal window is wiped; your prompt reappears at the top.

## How It Works

Terminals understand special escape sequences that control cursor position and screen contents, not just plain text. `clear` looks up the correct escape sequence for your terminal type (via the `terminfo` database) and writes it to the screen — this is why `clear` behaves correctly across different terminal emulators despite them having different underlying capabilities.

## Real-World Examples

```bash
# Clean up your terminal before starting a new task
clear

# Common keyboard shortcut equivalent
Ctrl+L
```

`Ctrl+L` triggers the same clearing behavior directly from the shell, without typing a command.

## Combining Commands

```bash
clear && ls -la
```

Clear the screen, then immediately run a fresh command — common at the start of a new block of work in a terminal session.

## Common Mistakes

* Thinking `clear` deletes your command history or scrollback — it doesn't; you can usually still scroll up (or use your terminal's scrollback buffer) to see what was cleared.
* Expecting `clear` to reset shell state (variables, current directory, etc.) — it purely affects the visual display, nothing else.

## Related Commands

* `reset` — a more aggressive terminal reset, useful when the terminal display gets genuinely corrupted (e.g. after printing binary data)
* `tput` — the lower-level tool `clear` is built on, for controlling terminal capabilities directly

## Practice

1. Run a few commands, then `clear` the screen and scroll up to confirm your history is still there.
2. Try the `Ctrl+L` shortcut instead of typing `clear`.
3. Look up what `reset` does differently from `clear` and when you'd need it instead.

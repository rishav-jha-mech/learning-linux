---
sidebar_position: 23
---

# man

Opens the manual page for a command, explaining its usage in full detail.

## Mental Model

Almost every standard Linux command ships with its own reference documentation, installed alongside it. `man` is how you read that documentation without leaving the terminal — it's the built-in answer to "how do I use this?"

## Syntax

```bash
man command
```

## Basic Example

```bash
man ls
```

Opens `ls`'s manual page in a pager (usually `less`), showing its description, options, and examples.

## Common Options

| Option | Meaning |
| --- | --- |
| `man -k keyword` | Search manual page titles/descriptions for a keyword |
| `man N command` | View a specific manual section (e.g. section 2 for system calls) |

## Manual Sections

Manual pages are organized into numbered sections — this matters because some names exist in more than one:

| Section | Contents |
| --- | --- |
| 1 | User commands |
| 2 | System calls |
| 3 | Library functions |
| 5 | File formats/config |
| 8 | Administration commands |

```bash
man 2 open     # the open() system call
man 1 open     # rarely exists, but demonstrates the concept — sections disambiguate identical names
```

## How It Works

Manual pages are plain text files (in a markup format called `troff`/`groff`) installed under paths like `/usr/share/man/`, organized by section. `man` finds the right file for your query, formats it, and pipes it into a pager (`less` by default) so you can navigate it the same way you'd navigate any other paged text.

## Real-World Examples

```bash
# Look up every option for a command you use rarely
man tar

# Search for commands related to a topic you don't know the name of
man -k "compress"

# Read about a specific system call
man 2 fork
```

## Combining Commands

```bash
man grep | grep -A2 "\-i"
```

Search inside a man page's text for a specific option's explanation — useful when a manual page is very long and you just need one flag's meaning.

## Common Mistakes

* Not knowing manual sections exist, and being confused when `man printf` shows the shell command instead of the C library function (or vice versa) — specify the section number to disambiguate.
* Giving up on `man` for being "too dense" instead of jumping straight to the relevant section — most man pages follow a predictable structure (NAME, SYNOPSIS, DESCRIPTION, OPTIONS, EXAMPLES) you can navigate to directly with `/OPTIONS` inside `less`.
* Forgetting `q` quits the man page, since it's just displayed through `less`.

## Related Commands

* `--help` — a quicker, shorter summary many commands print directly, without opening a full manual page
* `info` — a different, often more tutorial-style documentation system used by some GNU tools
* `apropos` — equivalent to `man -k`, searches man page descriptions by keyword

## Practice

1. Open the manual page for a command you use often and find an option you didn't know about.
2. Use `man -k` to search for commands related to "network".
3. Look up a command that has entries in multiple manual sections (e.g. `printf`) and view a specific section explicitly.

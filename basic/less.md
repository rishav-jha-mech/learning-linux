---
sidebar_position: 11
---

# less

Views file contents one screen at a time, with the ability to scroll and search.

## Mental Model

Where `cat` dumps everything at once, `less` shows you a window into the file and lets you move that window around — forward, backward, or jump straight to a search match. It only reads as much of the file as it needs to display, so it opens huge files instantly.

## Syntax

```bash
less [options] file
```

## Basic Example

```bash
less /var/log/syslog
```

Opens the file in a pager. Common keys once inside:

| Key | Action |
| --- | --- |
| `Space` / `f` | Next page |
| `b` | Previous page |
| `/pattern` | Search forward |
| `n` | Next search match |
| `q` | Quit |
| `G` | Jump to end of file |
| `g` | Jump to start of file |

## Common Options

| Option | Meaning |
| --- | --- |
| `-N` | Show line numbers |
| `-S` | Don't wrap long lines — scroll horizontally instead |
| `-i` | Case-insensitive search |

## How It Works

`less` doesn't load the whole file into memory upfront. It reads and buffers the portion around your current view, which is why you can open a multi-gigabyte log file with `less` and see the first page immediately, whereas `cat`ing the same file would try to write the entire thing to your terminal at once.

## Real-World Examples

```bash
# Browse a large log file without flooding the terminal
less /var/log/nginx/access.log

# Search for a specific error inside a big file
less +/ERROR app.log
```

## Combining Commands

```bash
grep "timeout" server.log | less
```

Filter first, then page through just the matching lines — useful when a plain `grep` produces more output than fits on one screen.

## Common Mistakes

* Using `cat file | less` instead of `less file` — unnecessary when you're viewing a single file directly.
* Forgetting `q` quits `less` — beginners sometimes get "stuck" not realizing they're inside a pager.
* Not knowing `/pattern` search exists and scrolling manually through a huge file instead.

## Related Commands

* `more` — an older, more limited pager that `less` improves on ("less is more")
* `cat` — dump a whole file at once, no paging
* `head` / `tail` — view just a portion of a file without a pager

## Practice

1. Open a large file with `less` and search for a word using `/`.
2. Jump to the end of the file with `G`, then back to the start with `g`.
3. Pipe `grep`'s output into `less` and compare it to running `grep` alone on a file with many matches.

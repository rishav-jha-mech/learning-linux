---
sidebar_position: 9
---

# sed

Stream editor — transforms text line by line using pattern-based rules.

## Mental Model

`sed` reads input one line at a time, applies your editing commands to each line, and prints the result. Unlike opening a file in an editor, nothing about `sed`'s process is interactive — it's a script that edits text as it flows through, which makes it perfect for automated, repeatable text transformations.

## Syntax

```bash
sed [options] 'command' [file...]
```

## Basic Example

```bash
echo "hello world" | sed 's/world/linux/'
```

Output:

```text
hello linux
```

`s/pattern/replacement/` is the substitute command — the one you'll use by far the most.

## Common Options

| Option | Meaning |
| --- | --- |
| `-i` | Edit files in place (careful — this overwrites the original) |
| `-n` | Suppress automatic printing (used with `p` to print only matched lines) |
| `-e` | Add multiple `sed` expressions in one command |
| `g` (suffix on `s///`) | Replace every match on the line, not just the first |

## Common Patterns

```bash
sed 's/foo/bar/'        # replace first "foo" with "bar" on each line
sed 's/foo/bar/g'       # replace every "foo" with "bar" on each line
sed '3d'                 # delete line 3
sed -n '2,4p'            # print only lines 2 through 4
sed '/pattern/d'         # delete lines matching pattern
```

## How It Works

`sed` compiles your command(s) into an internal instruction set, then for every input line: loads it into a working buffer, applies the matching instructions, and prints the result (unless `-n` suppresses that). Because it processes one line at a time without loading the whole file into memory, `sed` can transform files far larger than available RAM. `-i` works by writing to a temporary file and replacing the original once processing finishes — which is why an interrupted `sed -i` can occasionally leave a `.bak` file or a truncated result depending on the implementation.

## Real-World Examples

```bash
# Replace every occurrence of a string in a file, in place
sed -i 's/old-domain.com/new-domain.com/g' config.yaml

# Delete blank lines
sed '/^$/d' file.txt

# Print only a specific range of lines
sed -n '10,20p' large-file.txt

# Comment out a line matching a pattern
sed 's/^ENABLE_DEBUG/#ENABLE_DEBUG/' settings.conf
```

## Combining Commands

```bash
cat access.log | sed -n '/ERROR/p' | wc -l
```

Filter to matching lines using `sed` instead of `grep` (both can do this; `sed` is preferable when you're already doing other editing in the same pipeline), then count them.

## Common Mistakes

* Running `sed -i` without a backup on an important file and getting the substitution wrong — test with `sed 's/.../.../ ' file` (no `-i`) first to preview the output before editing in place.
* Forgetting the `g` flag and being confused why only the *first* match per line was replaced.
* Using `/` as the delimiter when the pattern itself contains `/` (e.g. file paths) — `sed` lets you pick a different delimiter, like `sed 's|/old/path|/new/path|'`, to avoid escaping every slash.

## Related Commands

* `awk` — more powerful field-based processing, when `sed` alone isn't enough
* `tr` — simpler character-level translation
* `grep` — pattern matching without the substitution/editing capability

## Practice

1. Use `sed` to replace all occurrences of a word in a test file, previewing the change before using `-i`.
2. Use `sed -n` with a line range to print just a section of a large file.
3. Delete all blank lines from a file using `sed`.

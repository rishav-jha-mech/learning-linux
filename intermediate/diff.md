---
sidebar_position: 11
---

# diff

Compares two files (or directories) and shows the differences between them.

## Mental Model

`diff` finds the minimal set of line additions/removals needed to turn one file into the other, and prints that as a compact set of changes rather than the full content of both files.

## Syntax

```bash
diff [options] file1 file2
```

## Basic Example

```bash
diff old.txt new.txt
```

Output:

```text
3c3
< old line
---
> new line
```

`3c3` means line 3 changed; `<` shows the old version, `>` shows the new one.

## Common Options

| Option | Meaning |
| --- | --- |
| `-u` | Unified format: more readable, the format used by patches and git diffs |
| `-r` | Compare directories recursively |
| `-q` | Just report whether files differ, without showing the details |
| `-i` | Ignore case differences |

## Unified Diff Format

```bash
diff -u old.txt new.txt
```

Output:

```text
--- old.txt
+++ new.txt
@@ -1,3 +1,3 @@
 unchanged line
-old line
+new line
```

Lines starting with `-` were removed, `+` were added, and unmarked lines are context. This is the format almost all tooling (git, patch files, code review diffs) uses.

## How It Works

`diff` computes a line-by-line comparison using an algorithm (typically a variant of the longest common subsequence problem) to find the smallest set of edits connecting the two files. It doesn't understand the *meaning* of the content: a single character change on a line still shows the entire line as removed and re-added, since `diff` operates at line granularity by default.

## Real-World Examples

```bash
# See what changed between two config file versions
diff -u old-nginx.conf new-nginx.conf

# Compare two directory trees recursively
diff -r project-v1/ project-v2/

# Quickly check if two files are identical, without seeing details
diff -q file1.txt file2.txt
```

## Combining Commands

```bash
diff -u old.conf new.conf > changes.patch
```

Save a diff as a patch file, which can later be applied elsewhere with the `patch` command.

## Common Mistakes

* Reading raw (non-unified) `diff` output and finding it hard to parse: `-u` is almost always worth adding for readability.
* Assuming `diff` understands code structure or semantics: it's purely line-based text comparison, so reordering identical lines can produce a larger, noisier diff than expected.
* Comparing files with different line endings (e.g. Windows CRLF vs Unix LF) and getting a diff on every single line: normalize line endings first if that's not the actual change you care about.

## Related Commands

* `patch`: apply a diff's changes to a file
* `git diff`: the same underlying concept, integrated into version control
* `cmp`: a simpler byte-by-byte comparison, useful for binary files

## Practice

1. Create two similar text files with a few differing lines and compare them with `diff -u`.
2. Save a diff to a file and inspect its unified format structure (`---`, `+++`, `@@`).
3. Compare two directory trees recursively with `diff -r` and identify which files differ.

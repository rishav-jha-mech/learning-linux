---
sidebar_position: 9
---

# rm

Removes (deletes) files or directories.

## Mental Model

`rm` doesn't move anything to a "trash": it removes the directory entry pointing to the data, and once nothing references that data anymore, the space is freed. There is no built-in undo.

## Syntax

```bash
rm [options] file...
```

## Basic Example

```bash
rm draft.txt
ls
```

The file is gone: no confirmation, no recovery, unless you have a backup.

## Common Options

| Option | Meaning |
| --- | --- |
| `-r` | Remove directories and their contents recursively |
| `-f` | Force: never prompt, ignore nonexistent files |
| `-i` | Prompt before every removal |
| `-v` | Print each file as it's removed |

`rm -rf` is the combination that shows up in every "I deleted the wrong thing" story: treat it with real caution.

## How It Works

`rm` calls `unlink()`, which removes a directory entry and decrements the target inode's link count. The actual data blocks are only freed once the link count reaches zero *and* no process still has the file open, which is why a program can keep writing to a file you already "deleted," and why `rm`ing a huge open log file doesn't immediately free disk space until the writing process closes it.

## Real-World Examples

```bash
# Remove a single file
rm old-notes.txt

# Remove a directory and everything inside it
rm -rf build/

# Remove without confirmation prompts, but still error on missing files
rm important-but-maybe-missing.txt
```

## Combining Commands

```bash
ls build/ && rm -rf build/
```

List first as a sanity check before deleting: cheap insurance against removing the wrong directory.

## Common Mistakes

* Running `rm -rf` with a space typo, e.g. `rm -rf ./ project` instead of `rm -rf ./project`: the first deletes the current directory's contents, not just `project`.
* Using `rm -rf` on a path built from a variable that might be empty: `rm -rf "$DIR/"` when `$DIR` is unset expands to `rm -rf /`. Always quote and validate variables before using them with `rm -rf`.
* Assuming `rm` asks for confirmation: by default it doesn't; `-i` is opt-in, not default behavior.

## Related Commands

* `rmdir`: remove only empty directories, safer for that specific case
* `trash-cli`: a third-party tool that moves files to a recoverable trash instead of deleting immediately
* `find ... -delete`: delete files matching specific criteria

## Practice

1. Create a test file and directory in `/tmp`, then remove them safely with `rm` and `rm -r`.
2. Explain why `rm -rf $EMPTY_VAR/` is dangerous, using what you know about shell variable expansion.
3. Look up what `rmdir` does differently from `rm -r` and when you'd prefer it.

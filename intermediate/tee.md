---
sidebar_position: 7
---

# tee

Writes input to a file and to stdout simultaneously.

## Mental Model

Think of a plumbing "T" junction: input flows in one side, and comes out both a file *and* the terminal (or the next command in a pipeline), instead of one or the other. Normally you have to choose between saving output to a file and seeing it live: `tee` lets you do both.

## Syntax

```bash
command | tee [options] file
```

## Basic Example

```bash
echo "hello" | tee output.txt
```

Prints `hello` to the terminal *and* writes it into `output.txt`.

## Common Options

| Option | Meaning |
| --- | --- |
| `-a` | Append to the file instead of overwriting it |
| `tee file1 file2` | Write to multiple files at once |

## How It Works

`tee` reads from stdin and, for every chunk of data it receives, writes that same chunk to both the given file and its own stdout. This makes it a normal link in a pipeline (its output can still be piped further) while also having a side effect of saving a copy to disk.

## Real-World Examples

```bash
# See a build's output live, and keep a log of it
./build.sh | tee build.log

# Save output partway through a longer pipeline, while still processing it further
cat access.log | tee raw.log | grep "ERROR"

# Write to a file that needs elevated permissions
echo "setting" | sudo tee /etc/some-config-file
```

## Combining Commands

```bash
dmesg | tee dmesg.log | grep -i error
```

Capture the full output to a file while simultaneously filtering it for errors on screen.

## Common Mistakes

* Trying `sudo command > /root/file` and getting "Permission denied": the redirection happens in your unprivileged shell *before* `sudo` runs, so it fails even with `sudo` on the command. `command | sudo tee /root/file` works because `tee` itself runs with elevated privileges.
* Forgetting `-a` and unintentionally overwriting a log file each time a pipeline runs, losing previous output.
* Not realizing `tee`'s stdout can still be piped further: treating it as a dead-end when it's actually a pass-through.

## Related Commands

* `>` / `>>`: simple redirection to a file, without also showing output live
* `cat`: often confused conceptually with `tee`, but `cat` doesn't split output two ways
* `script`: records an entire terminal session to a file, a different kind of "capture output" tool

## Practice

1. Run a command through `tee` and confirm the output appears both on screen and in the resulting file.
2. Use `tee -a` twice in a row and confirm both outputs accumulate in the file instead of overwriting.
3. Use the `command | sudo tee file` pattern to write to a file that requires root permissions.

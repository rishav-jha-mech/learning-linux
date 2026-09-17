---
sidebar_position: 12
---

# tar, gzip, and zip

Bundle multiple files into one archive (`tar`, `zip`) and/or compress them (`gzip`, `zip`).

## Mental Model

Archiving and compression are two different problems that Linux tooling historically kept separate: `tar` bundles many files into one file (with no compression by itself), and `gzip` compresses a single file. Combining them — `tar` a directory, then `gzip` the result — is where "tarball" (`.tar.gz`) comes from. `zip` does both jobs at once in a single format, which is why it's more common cross-platform (e.g. with Windows).

## Syntax

```bash
tar [options] archive.tar files...
gzip file
gunzip file.gz
zip archive.zip files...
unzip archive.zip
```

## Basic Example

```bash
tar -czvf project.tar.gz project/
```

Creates a compressed archive of the `project/` directory: `c`reate, `z` gzip-compress, `v`erbose, `f`ile (name follows).

```bash
tar -xzvf project.tar.gz
```

Extracts it: e`x`tract, `z` gzip, `v`erbose, `f`ile.

## Common Options

`tar`:

| Flag | Meaning |
| --- | --- |
| `-c` | Create an archive |
| `-x` | Extract an archive |
| `-z` | Compress/decompress with gzip |
| `-v` | Verbose — list files as they're processed |
| `-f` | Specify the archive filename (almost always needed) |
| `-t` | List an archive's contents without extracting |

`zip`/`unzip`:

| Flag | Meaning |
| --- | --- |
| `-r` (zip) | Recurse into directories |
| `-l` (unzip) | List contents without extracting |

## How It Works

`tar` originally stood for "tape archive" — it serializes files (with their metadata: permissions, ownership, timestamps) into one continuous stream, historically for writing to tape drives. That's why `tar` alone doesn't compress: compression was always meant to be a separate, composable step (`tar` output piped through `gzip`), following the Unix philosophy of small tools doing one job. `zip`, developed separately, bundles the archiving and compression logic together into a single format instead.

## Real-World Examples

```bash
# Create a compressed backup of a directory
tar -czvf backup-2024.tar.gz /home/user/project

# See what's inside an archive before extracting
tar -tzvf backup-2024.tar.gz

# Extract into a specific directory
tar -xzvf backup-2024.tar.gz -C /tmp/restore

# Compress a single file
gzip large-log.txt      # produces large-log.txt.gz, removes the original

# Create a zip archive of a directory
zip -r project.zip project/
```

## Combining Commands

```bash
tar -czvf - project/ | ssh user@remote "cat > project.tar.gz"
```

Stream a compressed archive directly to a remote machine over SSH without creating an intermediate local file (`-f -` sends the archive to stdout).

## Common Mistakes

* Forgetting `-z` when extracting a `.tar.gz` — `tar -xvf` alone won't decompress gzip data, since `tar` needs to be told the archive is also compressed.
* Not checking an archive's contents (`tar -tzvf` or `unzip -l`) before extracting into a shared or important directory — a poorly-structured archive can scatter files unexpectedly if it wasn't created with a single top-level folder.
* Assuming `gzip` keeps the original file — by default `gzip file` compresses in place and deletes the original, replacing it with `file.gz` (use `gzip -k` to keep both).

## Related Commands

* `xz` — a newer, typically higher-compression-ratio alternative to gzip
* `rsync` — for transferring files, often preferred over archive+copy for large or repeated transfers
* `7z` — a general-purpose archiver supporting many formats

## Practice

1. Create a `.tar.gz` archive of a test directory, then list its contents without extracting.
2. Extract that archive into a different target directory using `-C`.
3. Compress a single large file with `gzip -k` and confirm both the original and `.gz` version exist afterward.

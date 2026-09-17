---
sidebar_position: 14
---

# ssh, scp, and rsync

Connect to a remote machine (`ssh`) and transfer files to/from it (`scp`, `rsync`).

## Mental Model

`ssh` gives you an encrypted remote shell — everything you type runs on the remote machine. `scp` and `rsync` reuse that same encrypted connection to move files instead of running commands interactively. `rsync` additionally only transfers what's *changed*, making repeated transfers much faster than a full copy.

## Syntax

```bash
ssh user@host
scp source user@host:destination
rsync [options] source destination
```

## Basic Example

```bash
ssh alice@203.0.113.10
```

Opens a remote shell as `alice` on that host, prompting for a password or using a key if configured.

```bash
scp report.pdf alice@203.0.113.10:/home/alice/
```

Copies `report.pdf` to the remote machine.

## Common Options

`ssh`:

| Option | Meaning |
| --- | --- |
| `-i keyfile` | Use a specific private key for authentication |
| `-p port` | Connect on a non-default port |

`rsync`:

| Option | Meaning |
| --- | --- |
| `-a` | Archive mode — preserves permissions, timestamps, symlinks; the option you almost always want |
| `-v` | Verbose |
| `-z` | Compress data during transfer |
| `--delete` | Remove files at the destination that no longer exist at the source (mirrors exactly) |
| `-n` | Dry run — show what would happen without doing it |

## How It Works

`ssh` establishes an encrypted TCP connection (typically port 22), authenticates via password or public-key cryptography, then runs a shell (or a single command) on the remote end, streaming input/output back over that same encrypted channel. `scp` and `rsync` both tunnel through an SSH connection rather than inventing their own transport — this is why file transfer speed and security depend on the same SSH setup you already use for remote shells. `rsync`'s key trick is its delta-transfer algorithm: it compares source and destination and sends only the differing blocks, not the whole file, which is why re-running `rsync` after a small change is fast even on large files.

## Real-World Examples

```bash
# Connect to a server using a specific key
ssh -i ~/.ssh/prod-key.pem deploy@10.0.0.5

# Copy a single file to a remote server
scp app.tar.gz deploy@10.0.0.5:/opt/releases/

# Sync a directory to a remote server, preserving metadata, deleting stale files
rsync -avz --delete ./build/ deploy@10.0.0.5:/var/www/html/

# Preview what rsync would change without actually doing it
rsync -avzn ./build/ deploy@10.0.0.5:/var/www/html/
```

## Combining Commands

```bash
ssh deploy@10.0.0.5 "systemctl restart myapp"
```

Run a single remote command over SSH without opening an interactive session — common in deploy scripts.

## Common Mistakes

* Using `scp` for repeated syncs of a large directory instead of `rsync` — `scp` always copies everything again; `rsync` only sends the differences, which matters a lot for large or frequently-updated directories.
* Running `rsync --delete` without a dry run (`-n`) first — it will delete destination files not present at the source, which is dangerous if source and destination paths are backwards from what you intended.
* Forgetting the trailing slash matters in `rsync` source paths — `rsync dir/ dest/` copies the *contents* of `dir` into `dest`, while `rsync dir dest/` copies `dir` itself as a subdirectory of `dest`.

## Related Commands

* `sftp` — an interactive, FTP-like interface over the same SSH connection
* `ssh-keygen` — generate key pairs for passwordless SSH authentication
* `ssh-copy-id` — install your public key on a remote server for key-based login

## Practice

1. Connect to a remote (or local test) machine via `ssh` using a key instead of a password.
2. Copy a file both ways using `scp` — to a remote host, then back down.
3. Use `rsync -avzn` to preview a sync before actually running it, and explain why the dry run matters before using `--delete`.

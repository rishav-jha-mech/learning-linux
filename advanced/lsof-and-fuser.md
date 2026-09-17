---
sidebar_position: 3
---

# lsof and fuser

Show which processes have which files (or ports) open right now.

## Mental Model

Almost everything a process touches — regular files, directories, network sockets, pipes — is represented as an open file descriptor. `lsof` ("list open files") and `fuser` both answer the question "who's using this?", starting from either a process or a file/port.

## Syntax

```bash
lsof [options]
fuser [options] file
```

## Basic Example

```bash
lsof -i :8080
```

Output:

```text
COMMAND  PID   USER   FD   TYPE  DEVICE  SIZE/OFF  NODE  NAME
node    4821  alice   20u  IPv4       -         0   TCP   *:8080 (LISTEN)
```

Shows exactly which process is bound to port 8080.

```bash
fuser -v /var/log/syslog
```

Shows every process currently holding that specific file open.

## Common Options

`lsof`:

| Option | Meaning |
| --- | --- |
| `-i :port` | Show what's using a specific network port |
| `-p PID` | Show files opened by a specific process |
| `-u user` | Show files opened by a specific user |
| `+D dir` | Show open files within a directory tree |

`fuser`:

| Option | Meaning |
| --- | --- |
| `-v` | Verbose — show user and command for each process |
| `-k` | Kill every process using the file (use with caution) |
| `-m` | Treat the argument as a mounted filesystem, listing everything using it |

## How It Works

Every open file, socket, or pipe a process holds is tracked by the kernel and exposed under `/proc/PID/fd/` as symbolic links. `lsof` and `fuser` both walk this information across all running processes to answer "what's open, and by whom" — `lsof` is more general-purpose and detailed, `fuser` is more narrowly focused on "who's using this specific file/mount/port."

## Real-World Examples

```bash
# Find what's using port 3000 before starting a server there
lsof -i :3000

# Find every file a specific process has open (useful for debugging fd leaks)
lsof -p 4821

# Check what's preventing a filesystem from being unmounted
fuser -vm /mnt/usb

# Force-free a file by killing everything holding it open
fuser -k /var/lock/myapp.lock
```

## Combining Commands

```bash
lsof -i :8080 | awk 'NR>1 {print $2}' | xargs kill
```

Find and kill whatever process is occupying a port you need to free up — common when a previous run of a dev server didn't shut down cleanly.

## Common Mistakes

* Trying to `umount` a device and getting "device is busy" without checking `fuser -m` first to see what's actually holding it open.
* Using `fuser -k` carelessly — it kills every process using the target, which can include things you didn't intend to touch; check with plain `fuser -v` first.
* Forgetting `lsof -i` needs a colon before the port number (`:8080`, not `8080`) — a common typo that silently returns nothing instead of erroring clearly.

## Related Commands

* `ss` — focused specifically on network sockets, a narrower but often faster alternative for port-related questions
* `ps` — see running processes without the "what files are open" angle
* `/proc/PID/fd/` — the raw data both tools ultimately read from, browsable directly

## Practice

1. Start a simple server on a port (or check an existing one), then use `lsof -i :port` to identify the process.
2. Use `fuser -v` on a file you know is currently open (e.g. a running log file) and confirm it reports the right process.
3. Simulate a "device is busy" umount failure and use `fuser -m` to find what's holding the mount.

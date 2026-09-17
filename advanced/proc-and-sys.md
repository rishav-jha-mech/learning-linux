---
sidebar_position: 14
---

# /proc and /sys

Virtual filesystems that expose live kernel and process information as ordinary files.

## Mental Model

Nothing under `/proc` or `/sys` lives on disk. These are views the kernel generates on demand when you read them, backed by whatever the kernel currently knows, not stored data. Reading a file under `/proc` is really asking the kernel a question and getting the answer formatted as text.

## /proc

Organized primarily around running processes, one directory per PID:

```bash
ls /proc/1234/
```

Output (abridged):

```text
cmdline   environ   fd/   status   maps   cwd   exe
```

| Path | Contents |
| --- | --- |
| `/proc/PID/status` | Memory, state, and other summary info for that process |
| `/proc/PID/fd/` | Symlinks to everything that process has open |
| `/proc/PID/cmdline` | The exact command line it was started with |
| `/proc/meminfo` | System-wide memory statistics |
| `/proc/cpuinfo` | Details about the CPU(s) |
| `/proc/self/` | A special symlink always pointing at whichever process is currently reading it |

## /sys

Organized around kernel objects (devices, drivers, and kernel subsystems) and, importantly, often *writable*: writing to certain files under `/sys` changes live kernel behavior immediately.

```bash
cat /sys/class/net/eth0/operstate
```

Output:

```text
up
```

## How It Works

`/proc` and `/sys` are not stored on any physical disk. They're special filesystem types (`procfs` and `sysfs`) where every "file" is backed by a kernel function that generates its content the moment you read it. This is exactly what tools like [ps and top](/docs/intermediate/ps-and-top), [free, uptime, and dmesg](/docs/advanced/free-uptime-dmesg), and [lsof and fuser](/docs/advanced/lsof-and-fuser) are built on: they aren't using some special kernel API, they're just reading and formatting these same files. `/sys` in particular is also how many hardware and kernel tuning knobs (like [sysctl parameters](/docs/advanced/ulimit-and-sysctl)) are actually exposed, sometimes directly, sometimes through the `sysctl` command as a friendlier interface to the same underlying files.

## Real-World Examples

```bash
# See exactly what a process was started with
cat /proc/1234/cmdline | tr '\0' ' '

# Check a network interface's current state directly
cat /sys/class/net/eth0/operstate

# See a process's memory usage in detail
cat /proc/1234/status | grep Vm

# See the exact environment a process is running with
cat /proc/1234/environ | tr '\0' '\n'
```

## Combining Commands

```bash
ls -l /proc/1234/fd/
```

List every open file descriptor for a specific process as symlinks: the raw data `lsof -p` presents in friendlier form.

## Common Mistakes

* Treating `/proc`/`/sys` files as regular files you can safely `cp` or back up: their content is dynamically generated and often meaningless outside the moment you read it (and some, like `/proc/kcore`, represent enormous virtual sizes that aren't real disk usage at all).
* Writing to a file under `/sys` without understanding it changes live kernel behavior immediately, sometimes irreversibly for that boot. This isn't like editing a config file that needs a restart to apply.
* Parsing `/proc/PID/cmdline` without accounting for its null-byte-separated format: arguments are separated by `\0`, not spaces, which is why naive parsing produces one run-on string unless you convert the separators first.

## Related Commands

* [ps and top](/docs/intermediate/ps-and-top): user-friendly tools built entirely on `/proc` data
* [ulimit and sysctl](/docs/advanced/ulimit-and-sysctl): `sysctl` is a friendlier interface over related kernel-tunable files
* [lsof and fuser](/docs/advanced/lsof-and-fuser): present `/proc/PID/fd/` data in a more readable form

## Practice

1. Pick a running process's PID and explore its `/proc/PID/` directory, identifying what a few of the files contain.
2. Read `/proc/meminfo` directly and compare it to what `free -h` reports.
3. Explain why writing to a file under `/sys` is fundamentally different from editing a normal configuration file.

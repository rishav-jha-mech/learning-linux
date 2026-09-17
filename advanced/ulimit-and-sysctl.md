---
sidebar_position: 8
---

# ulimit and sysctl

Control per-process resource limits (`ulimit`) and kernel-wide tunable parameters (`sysctl`).

## Mental Model

`ulimit` caps what a single shell session (and processes it spawns) can consume — open files, memory, processes. `sysctl` reads and writes kernel parameters that affect the whole system's behavior — network settings, virtual memory tuning, and more. One is a guardrail on a session; the other reconfigures the kernel itself.

## Syntax

```bash
ulimit [options] [limit]
sysctl [options] parameter[=value]
```

## Basic Example

```bash
ulimit -n
```

Output:

```text
1024
```

Shows the current limit on open file descriptors for this shell session.

```bash
sysctl vm.swappiness
```

Output:

```text
vm.swappiness = 60
```

Shows how aggressively the kernel swaps memory to disk.

## Common Options

`ulimit`:

| Option | Meaning |
| --- | --- |
| `-n` | Max open file descriptors |
| `-u` | Max number of processes for the user |
| `-v` | Max virtual memory size |
| `-a` | Show all current limits |
| `-S` / `-H` | Soft limit (adjustable up to the hard limit) / hard limit (ceiling, needs privilege to raise) |

`sysctl`:

| Option | Meaning |
| --- | --- |
| `-a` | Show all available kernel parameters |
| `-w param=value` | Set a parameter (temporary, until reboot) |
| (edit `/etc/sysctl.conf`) | Make a setting persist across reboots |

## How It Works

`ulimit` is a shell builtin wrapping the `setrlimit()`/`getrlimit()` system calls, which the kernel enforces per-process — this is exactly the mechanism behind errors like "too many open files" (EMFILE), which happens when a process hits its `ulimit -n` ceiling. `sysctl` reads and writes values under `/proc/sys/`, a live, writable view into kernel internals — changing `vm.swappiness` or `net.ipv4.ip_forward` through `sysctl` takes effect immediately, system-wide, without a reboot, because you're directly modifying the kernel's running configuration.

## Real-World Examples

```bash
# Raise the open-file limit for a session that opens many connections
ulimit -n 65536

# Check current process limit for a user
ulimit -u

# Temporarily reduce how eagerly the kernel swaps memory to disk
sudo sysctl -w vm.swappiness=10

# Allow the machine to forward IP packets (needed for routing/NAT)
sudo sysctl -w net.ipv4.ip_forward=1
```

## Combining Commands

```bash
ulimit -n 65536 && ./high-connection-server
```

Raise the file descriptor limit right before starting a process known to open many concurrent connections (e.g. a busy web server) — a classic fix for the EMFILE errors seen earlier when running Docusaurus's dev server.

## Common Mistakes

* Setting `ulimit` in one shell and expecting it to apply globally — it only affects the current shell session and its children; persistent limits require editing `/etc/security/limits.conf` (for PAM-based sessions) instead.
* Using `sysctl -w` for a setting you want to survive a reboot — that command only changes the running kernel state; add the same setting to `/etc/sysctl.conf` (or a file under `/etc/sysctl.d/`) to persist it.
* Raising a soft limit with `ulimit -n` past the hard limit and hitting a permission error — the hard limit is a ceiling only a privileged user can raise.

## Related Commands

* `/proc/sys/` — the raw filesystem interface `sysctl` reads and writes
* `/etc/security/limits.conf` — persistent per-user resource limit configuration
* `systemd` unit files (`LimitNOFILE=`, etc.) — modern way to set resource limits for services specifically

## Practice

1. Check your current `ulimit -n` and try raising it (soft limit) within your session.
2. Look up `vm.swappiness` with `sysctl` and explain what a lower vs. higher value means for system behavior.
3. Investigate the EMFILE error class in general and explain how `ulimit -n` relates to it.

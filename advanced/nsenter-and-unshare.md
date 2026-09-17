---
sidebar_position: 7
---

# nsenter and unshare

Enter another process's namespaces (`nsenter`) or create new isolated namespaces (`unshare`) — the low-level building blocks containers are made from.

## Mental Model

A "container" isn't a special kernel object — it's a regular process running inside a set of namespaces that give it its own isolated view of process IDs, network interfaces, mounts, hostname, and more. `unshare` creates and enters new namespaces from scratch; `nsenter` jumps into the namespaces an *existing* process (e.g. a running container) is already using.

## Syntax

```bash
unshare [options] command
nsenter [options] command
```

## Basic Example

```bash
unshare --pid --fork --mount-proc bash
```

Starts a new `bash` shell inside its own PID namespace — inside it, this shell sees itself as PID 1, and can't see any of the host's other processes.

```bash
nsenter -t PID -n ip addr
```

Runs `ip addr` inside the network namespace of process `PID` — showing you the network interfaces visible from *inside* that container, not the host's.

## Common Options

`unshare`:

| Option | Meaning |
| --- | --- |
| `--pid` | New PID namespace (isolated process tree) |
| `--net` | New network namespace (isolated interfaces/routes) |
| `--mount` | New mount namespace (isolated filesystem mounts) |
| `--uts` | New UTS namespace (isolated hostname) |
| `--fork` | Fork a new process into the namespace (often required alongside `--pid`) |

`nsenter`:

| Option | Meaning |
| --- | --- |
| `-t PID` | Target process whose namespaces to enter |
| `-n` | Enter its network namespace |
| `-p` | Enter its PID namespace |
| `-m` | Enter its mount namespace |

## How It Works

Linux namespaces are a kernel feature that give a process a private view of a specific kind of global resource — the PID namespace virtualizes process IDs, the network namespace virtualizes interfaces and routing tables, the mount namespace virtualizes the filesystem tree, and so on. Container runtimes (Docker, containerd, etc.) are, underneath, orchestrating exactly these primitives: creating a set of namespaces via `clone()`/`unshare()` syscalls and starting a process inside them. `nsenter` uses `setns()` to attach the calling process to another process's already-existing namespaces — this is literally how tools like `docker exec` work under the hood.

## Real-World Examples

```bash
# Debug a running container's network configuration from the host
nsenter -t $(docker inspect -f '{{.State.Pid}}' mycontainer) -n ip addr

# Create an isolated PID namespace to experiment safely
sudo unshare --pid --fork --mount-proc bash

# Enter a container's mount namespace to inspect its filesystem
nsenter -t PID -m ls /
```

## Combining Commands

```bash
nsenter -t $(pgrep -f mycontainer) -n -- curl localhost:8080
```

Test connectivity to a service exactly as it appears from inside a specific container's network namespace, without needing to exec into the container directly.

## Common Mistakes

* Forgetting `--fork` with `unshare --pid` — the PID namespace won't behave correctly without forking a new process into it as PID 1.
* Assuming a process is fully isolated just because it's in a new PID namespace — namespaces isolate specific resources independently; a process might have its own PID namespace but still share the host's network or filesystem unless those are unshared too.
* Confusing containers with virtual machines — namespaces (plus cgroups for resource limits) provide isolation on the *same* kernel; there's no separate OS or hardware virtualization involved, which is why containers start almost instantly compared to VMs.

## Related Commands

* `docker exec` / `docker inspect` — higher-level tools built on these same primitives
* `cgroups` (not a single command, but a related kernel feature) — resource limiting, complementary to namespace isolation
* `chroot` — an older, more limited form of filesystem isolation, a precursor to mount namespaces

## Practice

1. Use `unshare --pid --fork --mount-proc bash` and confirm the new shell sees itself as PID 1 via `ps`.
2. Find a running container's PID on the host and use `nsenter -t PID -n ip addr` to inspect its network namespace.
3. Explain why containers start faster than virtual machines, in terms of what's actually being isolated.

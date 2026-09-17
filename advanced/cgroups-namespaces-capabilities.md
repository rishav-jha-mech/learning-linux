---
sidebar_position: 15
---

# cgroups, Namespaces, and Capabilities

The three kernel features containers are actually built from: resource limits, isolated views of the system, and fine-grained privilege control.

## Mental Model

A "container" is a regular Linux process wrapped in three independent kernel mechanisms: **namespaces** give it its own isolated view of some global resource (already covered in [nsenter and unshare](/docs/advanced/nsenter-and-unshare)), **cgroups** limit and account for the resources it's allowed to consume (CPU, memory, I/O), and **capabilities** break root's traditionally all-or-nothing power into individual, grantable privileges. None of these three require virtualizing hardware. They all operate on the same running kernel, which is why containers are so much lighter than virtual machines.

## cgroups (Control Groups)

Limit and measure resource usage for a group of processes.

```bash
cat /sys/fs/cgroup/memory.max
```

Shows (or sets) the memory limit for the current cgroup: cgroup configuration lives under `/sys/fs/cgroup/`, following the same virtual-filesystem pattern as [/proc and /sys](/docs/advanced/proc-and-sys).

| Controller | Limits |
| --- | --- |
| `memory` | Maximum memory (and swap) usage |
| `cpu` | CPU time share relative to other cgroups |
| `io` | Disk I/O bandwidth |
| `pids` | Maximum number of processes/threads |

## Namespaces

Already covered in depth in [nsenter and unshare](/docs/advanced/nsenter-and-unshare). Briefly, each namespace type isolates one kind of resource: PID (process IDs), net (network interfaces), mount (filesystem view), UTS (hostname), IPC, and user (UID/GID mapping).

## Capabilities

Traditionally, a process either runs as root (full privilege) or as a regular user (many restrictions). Capabilities split "root's power" into dozens of individual permissions that can be granted separately.

```bash
getcap /usr/bin/ping
```

Output:

```text
/usr/bin/ping cap_net_raw=ep
```

`ping` needs to create raw network sockets, a privileged operation, but instead of requiring full root (historically via setuid, see [permissions](/docs/intermediate/permissions)), it's granted just the specific `CAP_NET_RAW` capability it actually needs.

## How It Works

Each of these three mechanisms is enforced directly by the kernel on every relevant operation. A cgroup limit isn't a suggestion the process can ignore: attempting to allocate memory beyond a cgroup's `memory.max` triggers the kernel's out-of-memory handling *for that group specifically*, independent of the rest of the system. A capability check happens at the exact system call that requires it (e.g., binding to a privileged port under 1024 checks for `CAP_NET_BIND_SERVICE`). The kernel doesn't ask "is this process root," it asks "does this process hold this specific capability." Container runtimes combine all three: a namespace set for isolation, a cgroup for resource limits, and typically a *reduced* capability set (dropping capabilities a container doesn't need) for defense in depth.

## Real-World Examples

```bash
# See a process's current cgroup
cat /proc/1234/cgroup

# Check what capabilities a binary has been granted
getcap /usr/bin/ping

# Grant a specific capability to a custom binary instead of using setuid
sudo setcap cap_net_bind_service=+ep /usr/local/bin/my-server
```

## Combining Commands

```bash
systemd-cgtop
```

A live, `top`-like view of resource usage per cgroup, useful for seeing exactly how systemd is already using cgroups to manage every service on a modern Linux system, even outside of explicit containers.

## Common Mistakes

* Assuming a process is fully "contained" just because it's in namespaces: without a cgroup limiting its resource usage, it can still exhaust CPU or memory and affect the rest of the host, since isolation and resource limiting are separate, independent mechanisms.
* Reaching for setuid when a specific capability would be safer: granting `CAP_NET_BIND_SERVICE` alone is a much smaller attack surface than making a binary fully setuid-root just so it can bind to port 80.
* Not realizing systemd already uses cgroups for every service by default: resource limits set in a systemd unit file (`MemoryMax=`, `CPUQuota=`) are implemented via cgroups under the hood, the same mechanism containers use.

## Related Commands

* [nsenter and unshare](/docs/advanced/nsenter-and-unshare): the namespace half of this picture, in depth
* [/proc and /sys](/docs/advanced/proc-and-sys): cgroup configuration is exposed the same way, as virtual files
* [permissions](/docs/intermediate/permissions): the setuid model capabilities were designed to improve on

## Practice

1. Find which cgroup your shell's process belongs to via `/proc/self/cgroup`.
2. Use `getcap` on a few system binaries (`ping`, `traceroute` if installed) and identify what capability each needs and why.
3. Explain why running a process in isolated namespaces without any cgroup limits could still let it harm the host system.

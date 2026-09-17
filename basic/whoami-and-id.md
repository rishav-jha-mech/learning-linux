---
sidebar_position: 20
---

# whoami and id

Show who you're logged in as, and what permissions that identity carries.

## Mental Model

Every process runs as some user, with a set of group memberships attached. `whoami` answers "who am I," `id` answers "who am I, in full detail" — user ID, group ID, and every group you belong to.

## Syntax

```bash
whoami
id [user]
```

## Basic Example

```bash
whoami
```

Output:

```text
alice
```

```bash
id
```

Output:

```text
uid=1000(alice) gid=1000(alice) groups=1000(alice),27(sudo),999(docker)
```

## Common Options

| Option | Meaning |
| --- | --- |
| `id -u` | Print only the numeric user ID |
| `id -g` | Print only the numeric primary group ID |
| `id -Gn` | Print all group names the user belongs to |
| `id username` | Show identity info for another user, not yourself |

## How It Works

Every process has a numeric user ID (UID) and group IDs (GID) attached by the kernel — these, not usernames, are what the kernel actually checks for permission decisions. `whoami` and `id` both look up your process's UID/GIDs and translate them to human-readable names via `/etc/passwd` and `/etc/group`. Being in a group like `docker` or `sudo` is what actually grants access to those resources — the name itself means nothing to the kernel, only the numeric ID does.

## Real-World Examples

```bash
# Confirm you're not accidentally running as root
whoami

# Check if you're in the docker group (needed to run docker without sudo)
id -Gn | grep docker

# See another user's group memberships
id www-data
```

## Combining Commands

```bash
if [ "$(whoami)" = "root" ]; then echo "running as root"; fi
```

Common in scripts that need to warn or refuse to run under specific accounts.

## Common Mistakes

* Assuming a username in `/etc/passwd` guarantees you're actually operating as that user in the current shell — always check with `whoami`/`id`, especially after `su` or inside containers.
* Editing `/etc/group` to add yourself to a group and expecting it to apply immediately — group membership changes usually require starting a new login session (or running `newgrp`) to take effect in `id`'s output.
* Confusing UID 0 with "the user named root" — any account with UID 0 has root privileges, regardless of its username.

## Related Commands

* `su` / `sudo` — switch to another user's identity
* `groups` — a shorter way to see just group memberships
* `who` / `w` — see all users currently logged into the system

## Practice

1. Run `whoami` and `id` and identify your UID and every group you belong to.
2. Check whether you're in a specific group (e.g. `docker` or `sudo`) using `id -Gn`.
3. Explain why a UID, not a username, is what the kernel actually uses for permission checks.

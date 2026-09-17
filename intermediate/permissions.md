---
sidebar_position: 23
---

# Permissions

The full model behind who can read, write, and execute a file: beyond just the `chmod`/`chown` commands.

## Mental Model

Every file has an owner, a group, and three permission sets (owner/group/others), each controlling read, write, and execute. But "permissions" as a concept is bigger than the numbers `chmod` sets: it also covers *how* the kernel checks them, and a few special bits that change normal behavior.

## The Three Sets, Three Permissions

```text
-rwxr-xr--
 │││└┴┴─── others: r--
 │└┴────── group:  r-x
 └──────── owner:  rwx
```

Read, write, execute: for a directory, these mean something slightly different than for a file:

| Permission | On a file | On a directory |
| --- | --- | --- |
| read | View contents | List entries (`ls`) |
| write | Modify contents | Create/delete/rename entries inside it |
| execute | Run as a program | Enter it (`cd`) or access files by exact name inside it |

## Special Bits

| Bit | Symbol | Effect |
| --- | --- | --- |
| setuid | `s` in owner's execute slot | Program runs with the *file owner's* privileges, not the caller's |
| setgid | `s` in group's execute slot | Program runs with the file's group; on a directory, new files inherit that group |
| sticky | `t` in others' execute slot | Only the file's owner (or root) can delete files inside the directory, even if others have write access |

```bash
chmod u+s program      # setuid
chmod g+s directory    # setgid
chmod +t /tmp          # sticky bit: this is why /tmp is safe to share between users
```

## How It Works

Every process runs with an effective UID and GID, and the kernel checks permission bits against those on every file access, not against the username, which is purely a display convenience. `setuid` is what lets ordinary users run `passwd` (which needs to write to a root-owned file) without being root themselves: the binary temporarily runs as its owner (root) for the duration of that specific program. The sticky bit exists specifically to solve `/tmp`'s problem: a world-writable directory where anyone can create files, but nobody except the owner should be able to delete someone else's.

## Real-World Examples

```bash
# See the special bits in ls -l output (s or t instead of x)
ls -l /usr/bin/passwd
# -rwsr-xr-x ... /usr/bin/passwd   <- setuid bit set

ls -ld /tmp
# drwxrwxrwt ... /tmp              <- sticky bit set
```

## Combining Commands

```bash
find / -perm -4000 -type f 2>/dev/null
```

Find every setuid binary on the system: a common security audit step, since setuid programs are a classic target for privilege escalation if they're buggy.

## Common Mistakes

* Setting `chmod 777` to "just make it work": this doesn't just grant broad access, it also strips away the meaningful distinction between owner/group/others that permissions exist to provide.
* Not realizing execute permission on a *directory* is required just to access files inside it by name, even with read permission: `ls` might fail without directory execute permission, independent of file-level permissions.
* Forgetting the sticky bit exists and being confused why `/tmp` allows everyone to create files but not delete each other's.

## Related Commands

* [chmod](/docs/basic/chmod): set standard and special permission bits
* [chown](/docs/basic/chown): set ownership, which permissions are checked against
* [getfacl and setfacl](/docs/advanced/getfacl-and-setfacl): permissions beyond the basic owner/group/other model

## Practice

1. Find a setuid binary on your system (`find / -perm -4000 -type f 2>/dev/null`) and explain why it needs that bit.
2. Explain why `/tmp` has both world-writable permissions and the sticky bit, and what would go wrong if it only had one of the two.
3. Create a directory without execute permission and observe what happens when you try to access a file inside it by exact name, even with read permission on the directory.

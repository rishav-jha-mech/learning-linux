---
sidebar_position: 9
---

# getfacl and setfacl

View and set Access Control Lists (ACLs): permissions beyond the standard owner/group/other model.

## Mental Model

Standard Linux permissions only let you grant access to exactly one user (the owner) and one group. ACLs extend that: you can grant specific permissions to additional individual users or groups on the same file, without changing its owner or primary group.

## Syntax

```bash
getfacl file
setfacl -m rule file
setfacl -x rule file
```

## Basic Example

```bash
setfacl -m u:bob:rw file.txt
getfacl file.txt
```

Output:

```text
# file: file.txt
# owner: alice
# group: alice
user::rw-
user:bob:rw-
group::r--
mask::rw-
other::r--
```

`bob` now has read/write access to a file owned by `alice`, without being its owner or in its group.

## Common Options

| Option | Meaning |
| --- | --- |
| `-m` | Modify: add or change an ACL entry |
| `-x` | Remove a specific ACL entry |
| `-b` | Remove all ACL entries, back to standard permissions only |
| `-R` | Apply recursively to a directory |
| `-d` | Set a default ACL on a directory, inherited by new files created inside it |

## How It Works

ACLs are stored as extended attributes on the filesystem (most Linux filesystems support this, given it's enabled), separate from the classic permission bits shown by `ls -l`. When ACLs are present, `ls -l` shows a `+` after the permission string as a hint that more detailed rules exist beyond what's visible in the basic `rwx` display. `getfacl` is needed to see the full picture. The `mask` entry is important and often misunderstood: it caps the *effective* maximum permissions for any named user/group ACL entry, regardless of what the entry itself grants.

## Real-World Examples

```bash
# Grant a specific user read access to a file you own
setfacl -m u:contractor:r report.pdf

# Grant a group write access to a shared directory
setfacl -m g:developers:rwx /srv/shared-project

# Set a default ACL so new files inherit group write access automatically
setfacl -d -m g:developers:rwx /srv/shared-project

# Remove a specific ACL entry
setfacl -x u:contractor report.pdf

# View current ACLs
getfacl report.pdf
```

## Combining Commands

```bash
setfacl -R -m g:developers:rwx /srv/shared-project
setfacl -R -d -m g:developers:rwx /srv/shared-project
```

Grant a group access to an existing directory tree recursively, and set a default so any *new* files created inside it inherit the same access automatically.

## Common Mistakes

* Forgetting the `mask` entry limits effective permissions: setting `setfacl -m u:bob:rwx` but having a `mask::r--` means bob's effective permission is only read, despite the entry saying `rwx`. Check `getfacl`'s output fully, not just the entry you added.
* Setting an ACL on a directory without `-d` and expecting new files created inside it to inherit the same permissions: regular `-m` only affects the directory itself, not future contents; `-d` is required for inheritance.
* Not realizing ACL support can be disabled or unavailable on certain filesystems/mount options: `setfacl` will fail outright if the filesystem wasn't mounted with ACL support.

## Related Commands

* `chmod` / `chown`: the standard permission model ACLs extend
- `ls -l`: shows a `+` suffix hinting that ACLs exist on a file
* `umask`: default permission behavior, independent of ACLs

## Practice

1. Grant a second user read access to a file you own, using `setfacl`, then verify with `getfacl`.
2. Set a default ACL on a test directory and confirm a newly created file inside it inherits the expected permissions.
3. Deliberately create a case where the `mask` limits an ACL entry's effective permission, and identify it in `getfacl`'s output.

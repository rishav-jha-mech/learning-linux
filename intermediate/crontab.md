---
sidebar_position: 18
---

# crontab

Schedules commands to run automatically at fixed times or intervals.

## Mental Model

`cron` is a background daemon that wakes up every minute, checks a list of scheduled jobs, and runs any that are due. `crontab` is the command you use to view and edit that list: each user has their own.

## Syntax

```bash
crontab -l          # list your current cron jobs
crontab -e          # edit your cron jobs
```

Each line in a crontab has the form:

```text
minute hour day-of-month month day-of-week command
```

## Basic Example

```text
0 2 * * * /home/user/backup.sh
```

Runs `backup.sh` every day at 2:00 AM. Fields are minute (`0`), hour (`2`), then `*` (any) for day of month, month, and day of week.

## Common Patterns

| Schedule | Meaning |
| --- | --- |
| `* * * * *` | Every minute |
| `0 * * * *` | Every hour, on the hour |
| `0 0 * * *` | Every day at midnight |
| `0 0 * * 0` | Every Sunday at midnight |
| `*/15 * * * *` | Every 15 minutes |
| `0 9 1 * *` | 9 AM on the 1st of every month |

## How It Works

The `cron` daemon runs continuously in the background and checks every minute whether any scheduled job's time has arrived, comparing the current time against each crontab entry's fields. Cron jobs run with a minimal environment (no interactive shell, often a different `$PATH`, and no terminal), which is why scripts that work fine when run manually sometimes fail silently under cron; using absolute paths and explicitly setting any needed environment variables inside the script avoids this class of bug.

## Real-World Examples

```bash
# Edit your personal crontab
crontab -e
```

```text
# Run a backup every night at 2 AM
0 2 * * * /home/user/backup.sh >> /home/user/backup.log 2>&1

# Clean up temp files every Sunday at midnight
0 0 * * 0 rm -rf /tmp/myapp-cache/*
```

```bash
# See what's currently scheduled
crontab -l
```

## Combining Commands

```text
0 * * * * /usr/bin/curl -s https://example.com/healthcheck > /dev/null
```

Ping a health-check endpoint every hour, discarding output: a common lightweight monitoring pattern.

## Common Mistakes

* Not redirecting a cron job's output anywhere: by default, output is often mailed to the user (if mail is configured) or silently dropped; always redirect to a log file (`>> file.log 2>&1`) so you can debug failures.
* Assuming a cron job has the same `$PATH` and environment as your interactive shell: cron's environment is minimal, so scripts should use absolute paths (`/usr/bin/curl` instead of `curl`) or explicitly source needed environment setup.
* Forgetting `crontab -e` edits a *per-user* crontab: system-wide scheduled jobs typically live in `/etc/cron.d/` or `/etc/crontab` instead, and require appropriate permissions to edit.

## Related Commands

* `at`: schedule a one-time job to run once in the future, rather than on a recurring schedule
* `systemd timers`: a modern alternative to cron, integrated with systemd, with better logging via `journalctl`
* `anacron`: like cron but tolerant of the machine being off at the scheduled time, running missed jobs when it next boots

## Practice

1. Add a cron job that appends the current date to a file every minute, verify it runs, then remove it.
2. Write a cron schedule expression for "every weekday at 6 PM."
3. Explain why a script that works when run manually might fail under cron, and what change fixes it.

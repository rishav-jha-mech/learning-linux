---
sidebar_position: 17
---

# systemctl and journalctl

Control system services (`systemctl`) and read their logs (`journalctl`) under systemd.

## Mental Model

Most modern Linux distributions use `systemd` to manage background services ("units"): starting them at boot, restarting them if they crash, and tracking their state. `systemctl` is how you control that system; `journalctl` is how you read the centralized log it collects from those services.

## Syntax

```bash
systemctl [command] service
journalctl [options]
```

## Basic Example

```bash
systemctl status nginx
```

Output (summarized):

```text
● nginx.service - A high performance web server
     Active: active (running) since ...
```

```bash
journalctl -u nginx -f
```

Follows nginx's logs live, similar to `tail -f` but sourced from the systemd journal.

## Common Options

`systemctl`:

| Command | Meaning |
| --- | --- |
| `status service` | Show whether a service is running and recent log lines |
| `start` / `stop` / `restart service` | Control the service now |
| `enable` / `disable service` | Control whether it starts automatically at boot |
| `list-units --type=service` | List all currently loaded services |

`journalctl`:

| Option | Meaning |
| --- | --- |
| `-u service` | Show logs for a specific service only |
| `-f` | Follow logs live |
| `-b` | Show logs since the last boot |
| `--since "1 hour ago"` | Filter by time |
| `-p err` | Show only entries at error priority or higher |

## How It Works

`systemd` runs as PID 1 (the very first process the kernel starts) and is responsible for bringing up every other service in a defined order based on dependencies declared in unit files. Instead of each service writing its own log file, systemd services typically write to the *journal*, a structured, indexed binary log managed by `systemd-journald`, which `journalctl` queries. This structure is why `journalctl` supports rich filtering (by service, time range, priority) that plain text log files parsed with `grep` don't offer as conveniently.

## Real-World Examples

```bash
# Check whether a service is running
systemctl status docker

# Restart a service after changing its config
sudo systemctl restart nginx

# Make a service start automatically on boot
sudo systemctl enable myapp

# See a service's recent errors
journalctl -u myapp -p err --since "1 hour ago"

# Watch logs live during a deploy
journalctl -u myapp -f
```

## Combining Commands

```bash
sudo systemctl restart myapp && journalctl -u myapp -f
```

Restart a service and immediately start watching its logs: a common pattern when debugging why a service fails to come up cleanly.

## Common Mistakes

* Editing a service's config file and expecting the change to apply without a restart: most services need `systemctl restart` (or sometimes `reload`) after config changes take effect.
* Confusing `enable`/`disable` (controls boot-time startup) with `start`/`stop` (controls current running state): a service can be enabled but currently stopped, or started but not enabled, and these are independent settings.
* Reading raw log files by hand when `journalctl -u service` gives a cleaner, filtered view sourced directly from that service.

## Related Commands

* `systemctl daemon-reload`: reload unit file definitions after editing one, before the change takes effect
* `service`: an older, more limited wrapper some distros still support for backward compatibility
* `dmesg`: kernel-level messages, a different log source than the systemd journal

## Practice

1. Check the status of a running service on your system (e.g. `ssh`, `cron`, or `docker`).
2. Use `journalctl -u service --since "10 minutes ago"` to see recent activity for that service.
3. Explain the difference between `enable` and `start`, and give an example of when you'd want one without the other.

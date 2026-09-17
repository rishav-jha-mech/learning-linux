---
sidebar_position: 16
---

# ss, ip, dig, and ping

Inspect network connections, interfaces, DNS resolution, and basic reachability.

## Mental Model

Each tool answers a different layer of "is the network working?": `ip` shows your machine's own network interfaces and routes, `ss` shows active connections and listening ports, `dig` shows how a domain name resolves to an IP, and `ping` tests basic reachability to another host.

## Syntax

```bash
ip addr
ip route
ss [options]
dig domain
ping [options] host
```

## Basic Example

```bash
ip addr show
```

Lists network interfaces and their assigned IP addresses.

```bash
ss -tulnp
```

Lists listening TCP/UDP ports and the processes using them.

```bash
dig example.com
```

Shows the DNS records example.com resolves to.

```bash
ping -c 4 example.com
```

Sends 4 ICMP echo requests and reports round-trip times.

## Common Options

| Command | Option | Meaning |
| --- | --- | --- |
| `ss` | `-t` | TCP sockets |
| `ss` | `-u` | UDP sockets |
| `ss` | `-l` | Listening sockets only |
| `ss` | `-n` | Show numeric addresses/ports, don't resolve names |
| `ss` | `-p` | Show the process using each socket |
| `ip` | `addr` | Show interfaces and IP addresses |
| `ip` | `route` | Show the routing table |
| `ping` | `-c N` | Send exactly N packets, then stop |
| `dig` | `+short` | Print just the resolved IP, no extra detail |

## How It Works

`ip` reads network interface and routing information the kernel maintains, the same data older tools like `ifconfig` and `route` exposed, in a more modern, consistent interface. `ss` ("socket statistics") queries the kernel's socket tables to list active and listening connections, replacing the older `netstat`. `ping` sends ICMP echo request packets and waits for echo replies, directly testing basic network-layer reachability. `dig` sends a DNS query to a resolver and prints the structured response: useful for debugging DNS issues independent of whether the actual service is reachable.

## Real-World Examples

```bash
# Find what's listening on port 8080
ss -tulnp | grep 8080

# Check your machine's IP addresses
ip addr show

# See if a domain resolves, and to what
dig +short example.com

# Test basic connectivity to a host
ping -c 4 8.8.8.8
```

## Combining Commands

```bash
ss -tulnp | grep LISTEN
```

Show only sockets actively listening for connections, filtering out established/closed ones: the fastest way to answer "what's running a server on this machine right now?"

## Common Mistakes

* Reaching for `ifconfig` or `netstat` on modern distros: both are deprecated in favor of `ip` and `ss` respectively, and may not even be installed by default anymore.
* Assuming a failed `ping` always means "the service is down": many servers and firewalls block ICMP specifically while still serving HTTP/other traffic fine; `ping` tests basic reachability, not a specific service.
* Debugging "can't connect" issues without first checking DNS with `dig`: a connection failure that's actually a DNS resolution problem looks identical to a network-layer problem until you isolate which layer is failing.

## Related Commands

* `traceroute` / `mtr`: see the network path (hops) to a destination, useful when `ping` succeeds but is slow or when troubleshooting where latency is introduced
* `nslookup`: an older DNS lookup tool, similar purpose to `dig`
* `curl -I`: test actual HTTP-layer reachability, one level above what `ping` checks

## Practice

1. Use `ip addr` to find your machine's local IP address.
2. Use `ss -tulnp` to find what process is listening on a specific port (e.g. 22 for SSH).
3. Use `dig +short` on a few domains and compare against `ping`'s reported IP to confirm they match.

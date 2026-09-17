---
sidebar_position: 13
---

# Sockets, DNS, and TCP

The layers underneath every network connection: an endpoint (socket), a name-to-address lookup (DNS), and a reliable delivery protocol (TCP).

## Mental Model

A socket is a process's endpoint for network communication — conceptually similar to a file descriptor, but for a network connection instead of a file. DNS is the system that turns a human-readable domain name into an IP address, since that's what's actually needed to establish a connection. TCP is the protocol responsible for making a connection reliable — guaranteeing that data arrives, in order, even over an unreliable underlying network.

## Sockets

```bash
ss -tulnp
```

Lists open sockets — covered in [ss, ip, dig, and ping](/docs/intermediate/ss-ip-dig-ping). Each entry represents a socket: a combination of protocol, local address/port, and (for established connections) the remote address/port too.

A socket is created via the `socket()` system call, and from the kernel's point of view behaves much like an open file — it gets a file descriptor, and reading/writing to it uses the same `read()`/`write()` calls as any other fd, as covered in [file descriptors](/docs/intermediate/file-descriptors).

## DNS

```bash
dig example.com
dig +short example.com
```

DNS resolves a name like `example.com` to an IP address through a hierarchy of servers: your resolver asks a root server, which points to a TLD server (for `.com`), which points to the authoritative server for that specific domain, which finally returns the actual address. In practice, most lookups are answered from a cache long before reaching that full chain, which is why DNS usually feels instant.

## TCP

TCP establishes a connection through a three-step handshake before any application data flows:

```text
Client                     Server
  │  ---- SYN --------------> │   "I'd like to connect"
  │  <---- SYN-ACK ---------- │   "Okay, and acknowledged"
  │  ---- ACK --------------> │   "Confirmed, let's go"
```

After the handshake, TCP tracks every byte sent with sequence numbers, retransmits anything lost, and delivers data to the application in the exact order it was sent — guarantees that make it the default choice for most application protocols (HTTP, SSH, etc.), at the cost of more overhead than a simpler, unordered protocol like UDP.

## How It Works

A socket, once created and connected, is handled by the kernel's networking stack — segmenting outgoing data into packets, attaching TCP's sequencing and acknowledgment info, and handing them to IP for routing. From the application's perspective, none of that complexity is visible: writing to a TCP socket looks just like writing to a file. DNS resolution typically happens through a library call (`getaddrinfo()`) that the application makes before it can even create a socket to the right IP — this is why a DNS failure and a connection failure look different in tools like `curl`, and why isolating "is this a DNS problem or a network problem" (as covered in [ss, ip, dig, and ping](/docs/intermediate/ss-ip-dig-ping)) is a fundamental debugging step.

## Real-World Examples

```bash
# See the sockets a running service has open
ss -tnp | grep nginx

# Confirm a domain resolves before troubleshooting further
dig +short example.com

# Watch a TCP handshake happen at the packet level (needs tcpdump/wireshark)
sudo tcpdump -i any port 443 and host example.com
```

## Common Mistakes

* Debugging a "connection refused" as if it were a DNS issue, or vice versa — DNS failures happen *before* a socket connection is even attempted; a connection refused means DNS succeeded but nothing was listening (or a firewall rejected it) at that address/port.
* Assuming every network protocol needs TCP's guarantees — some workloads (live video, DNS itself, some game traffic) intentionally use UDP, trading reliability for lower overhead and latency.
* Forgetting DNS results are cached at multiple layers (OS, browser, resolver) — a DNS record change can take time to be visible everywhere, which is the entire reason "TTL" (time-to-live) exists in DNS records.

## Related Commands

* [ss, ip, dig, and ping](/docs/intermediate/ss-ip-dig-ping) — the everyday tools for inspecting sockets, routes, and DNS
* [file descriptors](/docs/intermediate/file-descriptors) — sockets are represented the same way as open files
* [curl and wget](/docs/intermediate/curl-and-wget) — application-level tools built on top of sockets, DNS, and TCP

## Practice

1. Use `ss -tnp` to find an established TCP connection on your machine and identify its remote address and port.
2. Use `dig` to resolve a domain and note its TTL value — explain what that number controls.
3. Explain, in your own words, what problem TCP's three-way handshake solves before any data is sent.

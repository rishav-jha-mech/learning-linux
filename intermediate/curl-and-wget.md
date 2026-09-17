---
sidebar_position: 15
---

# curl and wget

Make HTTP(S) requests and download files from the command line.

## Mental Model

Both tools speak HTTP (and other protocols) from the terminal — `curl` leans toward "make a request and let me inspect/script the result," while `wget` leans toward "download this file to disk, reliably." Their default behaviors reflect that difference.

## Syntax

```bash
curl [options] url
wget [options] url
```

## Basic Example

```bash
curl https://example.com
```

Prints the page's HTML directly to stdout.

```bash
wget https://example.com/file.zip
```

Downloads `file.zip` to the current directory, showing a progress bar.

## Common Options

`curl`:

| Option | Meaning |
| --- | --- |
| `-O` | Save output to a file named after the URL, instead of printing to stdout |
| `-o file` | Save output to a specific filename |
| `-I` | Fetch headers only (HEAD request) |
| `-X METHOD` | Set the HTTP method (GET, POST, etc.) |
| `-d data` | Send data in the request body (e.g. for POST) |
| `-H "Header: value"` | Add a custom request header |
| `-L` | Follow redirects |
| `-s` | Silent — suppress progress output |

`wget`:

| Option | Meaning |
| --- | --- |
| `-O file` | Save to a specific filename |
| `-c` | Resume a partially downloaded file |
| `-r` | Recursively download (e.g. mirror a site) |

## How It Works

Both tools open a TCP connection to the target host, perform a TLS handshake for HTTPS, then send a raw HTTP request and parse the response — the same protocol your browser uses, just without rendering anything. `curl`'s design as a library (`libcurl`) underneath means it supports a huge range of protocols and is heavily used inside scripts and other programs; `wget` is more narrowly focused on robust downloading, including resuming interrupted transfers by requesting a specific byte range with `-c`.

## Real-World Examples

```bash
# Download a file, keeping its original name
curl -O https://example.com/dataset.csv

# Check response headers without downloading the body
curl -I https://example.com

# Send a POST request with JSON data
curl -X POST -H "Content-Type: application/json" -d '{"key":"value"}' https://api.example.com/endpoint

# Resume an interrupted download
wget -c https://example.com/large-file.iso
```

## Combining Commands

```bash
curl -s https://api.example.com/data | jq '.results[0]'
```

Fetch JSON from an API and pipe it into `jq` to extract a specific field — a very common pattern for scripting against APIs.

## Common Mistakes

* Forgetting `-L` when a URL redirects — plain `curl` doesn't follow redirects by default, so you might get a mostly-empty response instead of the content you expected.
* Using `curl url > file` instead of `curl -O url` or `curl -o file url` — the redirect approach works, but loses `curl`'s progress reporting and error handling around partial writes.
* Not checking the HTTP status code — a failed request (404, 500) can still "succeed" from the shell's point of view and print an error page as if it were valid content; `curl -f` makes `curl` fail loudly on HTTP errors instead.

## Related Commands

* `jq` — parse and filter JSON, often paired with `curl` for API work
* `httpie` — a more human-friendly alternative to `curl` for interactive API testing
* `ping` — check basic network reachability, a different layer than HTTP

## Practice

1. Use `curl -I` to inspect the response headers of a website without downloading its body.
2. Download a file with `wget`, interrupt it partway, and resume with `-c`.
3. Use `curl` with `-X POST` and `-d` to send a small test request to a public test API (e.g. httpbin.org).

---
sidebar_position: 8
---

# tr and cut

Transform characters (`tr`) or extract columns/fields (`cut`) from text.

## Mental Model

`tr` operates on individual characters, translating, deleting, or squeezing them. `cut` operates on structure, pulling out specific columns or byte ranges from each line. Neither understands "words" or context the way `awk` or `sed` do; they're both intentionally simple, single-purpose tools.

## Syntax

```bash
tr [options] set1 [set2]
cut [options] [file...]
```

## Basic Example

```bash
echo "Hello World" | tr 'a-z' 'A-Z'
```

Output:

```text
HELLO WORLD
```

```bash
echo "name,age,city" | cut -d',' -f2
```

Output:

```text
age
```

## Common Options

`tr`:

| Option | Meaning |
| --- | --- |
| `-d` | Delete characters in the given set |
| `-s` | Squeeze repeated characters into one |
| `-c` | Complement the set (match everything NOT listed) |

`cut`:

| Option | Meaning |
| --- | --- |
| `-d` | Set the field delimiter (default is tab) |
| `-f` | Select specific field numbers |
| `-c` | Select specific character positions instead of fields |

## How It Works

Both tools stream input line by line without buffering the whole file. `tr` maps each input character through a translation table built from the sets you give it, which is why it can only work on single characters, not multi-character patterns (that's `sed`'s job). `cut` splits each line on the delimiter and picks out the requested field indexes; it has no concept of quoted fields or escaping, which is why `cut` breaks on CSVs where a field itself contains the delimiter (a real CSV parser or `awk` handles that correctly).

## Real-World Examples

```bash
# Convert line endings from CRLF to LF
tr -d '\r' < windows-file.txt > unix-file.txt

# Remove all digits from text
echo "abc123" | tr -d '0-9'

# Squeeze multiple spaces into one
echo "a    b     c" | tr -s ' '

# Extract just usernames from /etc/passwd (colon-delimited)
cut -d':' -f1 /etc/passwd
```

## Combining Commands

```bash
cat access.log | cut -d' ' -f1 | sort | uniq -c | sort -rn
```

Extract the first field (often an IP address in web server logs), then build a frequency count of it: a very common log-analysis pattern.

## Common Mistakes

* Using `cut` on a CSV where fields can contain quoted commas. `cut -d','` blindly splits on every comma, breaking on `"Smith, John",30`. Use a real CSV-aware tool for anything beyond the simplest cases.
* Expecting `tr` to match multi-character strings: `tr 'ab' 'xy'` maps `a`→`x` and `b`→`y` independently, it does not replace the two-character sequence `"ab"`.
* Forgetting `cut`'s default delimiter is tab, not space. A common surprise when running `cut -f2` on space-separated text without specifying `-d' '`.

## Related Commands

* `sed`: pattern-based text substitution, handles multi-character replacements
* `awk`: full field-based text processing with programmable logic
* `column`: format columnar text for readability

## Practice

1. Use `tr` to convert a string to uppercase, then to delete all vowels from it.
2. Use `cut` to extract the third column from a colon-delimited file.
3. Explain why `cut -d','` is unsafe on arbitrary CSV files but fine on simple, well-controlled ones.

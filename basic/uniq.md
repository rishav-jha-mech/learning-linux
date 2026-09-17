---
sidebar_position: 18
---

# uniq

Removes or counts duplicate adjacent lines.

## Mental Model

`uniq` only looks at neighbors: it collapses consecutive identical lines into one. It has no idea whether a duplicate exists elsewhere in the file unless the lines are already next to each other, which is why it's almost always used after `sort`.

## Syntax

```bash
uniq [options] [file]
```

## Basic Example

```bash
sort names.txt | uniq
```

Prints each unique name once, having sorted the file first so duplicates become adjacent.

## Common Options

| Option | Meaning |
| --- | --- |
| `-c` | Prefix each line with its count of occurrences |
| `-d` | Show only lines that appeared more than once |
| `-u` | Show only lines that appeared exactly once |
| `-i` | Case-insensitive comparison |

## How It Works

`uniq` reads input line by line, comparing each line only to the immediately previous one. If they match, it's treated as a duplicate and collapsed; if not, both are kept. This single-pass, adjacent-only comparison is what makes `uniq` fast, but also why unsorted input produces misleading results (duplicates scattered across the file won't be detected).

## Real-World Examples

```bash
# See how many times each unique line appears, most frequent first
sort access.log | uniq -c | sort -rn

# Find lines that appear more than once
sort file.txt | uniq -d

# Find lines that are truly unique (appear exactly once)
sort file.txt | uniq -u
```

## Combining Commands

```bash
cut -d',' -f1 users.csv | sort | uniq -c | sort -rn | head
```

Extract a column, count occurrences of each distinct value, and show the top results: a common way to answer "what are the most common values in this column?"

## Common Mistakes

* Running `uniq` on unsorted input and expecting it to remove all duplicates: it only catches adjacent ones, so non-adjacent duplicates slip through.
* Forgetting `-c` when you actually want counts, not just deduplication.
* Confusing `uniq -u` (only-once lines) with `uniq` alone (deduplicated output, including things that appeared many times).

## Related Commands

* `sort`: almost always used right before `uniq`
* `awk`: can dedupe without requiring sorted input, using an associative array, at the cost of more memory for large inputs
* `cut`: extract specific fields before counting/deduping

## Practice

1. Build a frequency count of words in a text file using `sort` and `uniq -c`.
2. Use `uniq -d` to find which lines in a file are duplicated.
3. Explain why running `uniq` directly on an unsorted file can miss duplicates.

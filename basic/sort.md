---
sidebar_position: 17
---

# sort

Sorts lines of text.

## Mental Model

`sort` reads all its input lines, orders them according to a comparison rule (alphabetical by default), and prints the result. It doesn't sort in place — it always produces new output.

## Syntax

```bash
sort [options] [file...]
```

## Basic Example

```bash
sort names.txt
```

Prints the lines of `names.txt` in alphabetical order.

## Common Options

| Option | Meaning |
| --- | --- |
| `-n` | Sort numerically instead of lexically (so `10` comes after `2`, not before) |
| `-r` | Reverse the sort order |
| `-k N` | Sort by field N (useful for structured/columnar text) |
| `-u` | Remove duplicate lines from the output |
| `-t` | Set the field delimiter (default is whitespace) |

## How It Works

By default, `sort` compares lines byte by byte as strings — which is why `sort` on numbers like `2`, `10`, `100` without `-n` gives `10`, `100`, `2` (lexical order, not numeric order). `-n` tells it to interpret each line as a number before comparing. For large inputs that don't fit comfortably in memory, `sort` transparently splits the data into chunks, sorts each on disk, and merges them — you don't need to think about this, but it's why `sort` scales to files larger than RAM.

## Real-World Examples

```bash
# Sort a list of numbers correctly
sort -n numbers.txt

# Sort in reverse (largest/last first)
sort -rn numbers.txt

# Sort a CSV by the second column
sort -t',' -k2 data.csv

# Get a de-duplicated, sorted list
sort -u names.txt
```

## Combining Commands

```bash
cat access.log | awk '{print $1}' | sort | uniq -c | sort -rn
```

A classic pipeline: extract a field, sort it so identical values are adjacent, count occurrences with `uniq -c`, then sort the counts descending — this is the standard way to build a frequency table from log data.

## Common Mistakes

* Sorting numbers without `-n` and being confused why `9` comes after `10`.
* Assuming `sort` modifies the input file — it only prints sorted output; redirect it (`sort file > sorted.txt`) or use `sort -o file file` to write back to the same file.
* Forgetting `uniq` only removes duplicates from *adjacent* lines — you almost always need `sort` before `uniq` for it to work as expected.

## Related Commands

* `uniq` — remove or count duplicate adjacent lines, usually paired with `sort`
* `awk` — extract specific fields before sorting
* `comm` — compare two sorted files line by line

## Practice

1. Sort a file of numbers both lexically and with `-n`, and compare the difference.
2. Sort a CSV file by its second column using `-k` and `-t`.
3. Build the classic "count and rank" pipeline: extract a column, `sort`, `uniq -c`, `sort -rn`.

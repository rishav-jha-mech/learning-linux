---
sidebar_position: 10
---

# awk

A field-based text processing language — splits each line into fields and lets you act on them.

## Mental Model

`awk` treats every input line as a record made of fields (by default, whitespace-separated). You write patterns and actions: "when a line matches this condition, do this." It's a full programming language, but the vast majority of real-world use is a one-liner acting on one or two fields.

## Syntax

```bash
awk 'pattern { action }' file
```

## Basic Example

```bash
echo "alice 30 engineer" | awk '{print $1}'
```

Output:

```text
alice
```

`$1` is the first field, `$2` the second, and so on; `$0` refers to the whole line.

## Common Built-ins

| Variable/Option | Meaning |
| --- | --- |
| `$1`, `$2`, ... | Individual fields |
| `$0` | The entire line |
| `NF` | Number of fields on the current line |
| `NR` | Current line (record) number |
| `-F` | Set the field separator (e.g. `-F','` for CSV) |

## How It Works

`awk` reads input one line at a time, splits it into fields using the field separator (whitespace by default), and evaluates your pattern/action pairs against it — much like `sed`, but with a proper expression language instead of just substitution. This is why `awk` can do arithmetic, maintain running totals across lines, and format output, while `sed`/`grep` are limited to matching and simple text substitution.

## Real-World Examples

```bash
# Print the first column of every line
awk '{print $1}' access.log

# Print lines where the third column is greater than 100
awk '$3 > 100' data.txt

# Sum a column of numbers
awk '{sum += $2} END {print sum}' sales.txt

# Process a CSV, printing the second field
awk -F',' '{print $2}' data.csv

# Print line number alongside each line
awk '{print NR, $0}' file.txt
```

## Combining Commands

```bash
cat access.log | awk '{print $1}' | sort | uniq -c | sort -rn | head
```

Extract the first field (often an IP), count occurrences, and rank them — the classic "top talkers" analysis on a web server log.

## Common Mistakes

* Using `awk` for something `cut` already does more simply — if you're just extracting one fixed field with a simple delimiter, `cut` is more obvious; reach for `awk` once you need conditions, math, or multiple related fields.
* Forgetting the default field separator is whitespace (including runs of multiple spaces treated as one separator) — for real CSVs, set `-F','` explicitly, and be aware that quoted fields containing commas still aren't handled correctly by plain `awk`.
* Not using `END { }` for aggregation — beginners sometimes try to print a running sum on every line instead of accumulating it and printing once at the end.

## Related Commands

* `sed` — pattern-based substitution without field awareness
* `cut` — simpler field extraction, no conditions or math
* `perl` / `python` — for text processing beyond what a one-liner can comfortably express

## Practice

1. Use `awk` to print the second column of a space-separated file.
2. Use `awk` with a condition to print only lines where a numeric column exceeds a threshold.
3. Use `awk` with `END` to sum a column of numbers across an entire file.

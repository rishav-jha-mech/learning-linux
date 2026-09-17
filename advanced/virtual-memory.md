---
sidebar_position: 16
---

# Virtual Memory

The illusion every process gets its own private, contiguous memory space, independent of how physical RAM is actually laid out.

## Mental Model

A process never touches physical RAM addresses directly. It sees a virtual address space, and the kernel (with hardware help) translates every access to wherever the real data actually lives, which might be RAM, or might not be resident at all yet. This indirection is what allows multiple processes to each believe they have gigabytes of memory starting at address zero, without stepping on each other.

## Key Facts

| Concept | Meaning |
| --- | --- |
| Virtual address | The address a process's own code uses |
| Physical address | Where data actually sits in RAM |
| Page | A fixed-size chunk (commonly 4KB) that virtual memory is managed in |
| Page table | The per-process mapping from virtual pages to physical pages |
| Page fault | A trap triggered when accessing a virtual page not currently mapped to physical RAM |
| Swap | Disk space used to hold pages evicted from RAM under memory pressure |

## Seeing It

```bash
cat /proc/1234/status | grep Vm
```

Output (abridged):

```text
VmSize:   845000 kB   # total virtual memory reserved
VmRSS:     42000 kB   # actually resident in physical RAM right now
```

`VmSize` and `VmRSS` can differ enormously: a process can *reserve* far more virtual address space than it's actually using at any moment.

## How It Works

Every memory access a process makes goes through the CPU's memory management unit (MMU), which consults that process's page table to translate the virtual address into a physical one. If the corresponding page isn't currently mapped, because it's never been touched, or was swapped out to disk, the CPU raises a page fault, and the kernel steps in to either allocate a fresh physical page (for a first access) or read the page back in from swap. This is why a program can `malloc()` a large amount of memory instantly: it's just reserving virtual address space, and physical pages are only actually allocated (and count against real RAM usage) the first time each page is touched, a behavior called "lazy" or "demand" paging. It's also the deeper reason [free's buff/cache column](/docs/advanced/free-uptime-dmesg) isn't wasted memory: the kernel uses spare physical pages to cache file data, and can reclaim and repurpose them instantly if a process's page fault needs real RAM.

## Real-World Examples

```bash
# Compare virtual size vs actual resident memory for a process
cat /proc/1234/status | grep -E 'VmSize|VmRSS'

# Watch swap activity — sustained si/so above zero suggests memory pressure
vmstat 2 5

# See overall memory including how much is cached vs truly free
free -h
```

## Combining Commands

```bash
ps aux --sort=-rss | head -5
```

Find the 5 processes using the most *actual* physical memory (resident set size), as opposed to reserved virtual memory, which can be a misleading number on its own.

## Common Mistakes

* Reading a process's virtual memory size (`VmSize`) as if it represents real RAM usage: it's an upper bound on address space reserved, often far larger than what's actually resident (`VmRSS`).
* Panicking when `free -h` shows little "free" memory. As covered in [free, uptime, and dmesg](/docs/advanced/free-uptime-dmesg), unused RAM is used for disk caching by design and is reclaimed instantly when needed; `available` is the number that reflects true headroom.
* Assuming any swap usage means the system is in trouble. A small, stable amount of swap (holding pages that are genuinely inactive) is normal; it's *sustained, growing* swap activity (visible via `vmstat`'s `si`/`so` columns) that indicates real memory pressure.

## Related Commands

* [free, uptime, and dmesg](/docs/advanced/free-uptime-dmesg): everyday tools for checking memory pressure
* [vmstat, iostat, and sar](/docs/advanced/vmstat-iostat-sar): watch swap activity over time
* [/proc and /sys](/docs/advanced/proc-and-sys): where per-process memory statistics like `VmRSS` are exposed

## Practice

1. Pick a running process and compare its `VmSize` and `VmRSS` from `/proc/PID/status`. Explain the gap.
2. Run `vmstat 2 5` under normal conditions and identify the `si`/`so` (swap in/out) columns; they should be near zero on a healthy system.
3. Explain why `malloc()`-ing a huge block of memory can succeed instantly even on a machine with much less physical RAM available.

# Simple Task Runner — Assignment #1

A single-file HTML/CSS/JS demo that teaches three core async JavaScript concepts through interactive buttons: `setTimeout`, `async`/`await`, `Promise.all`, and the event loop (call stack → microtask queue → macrotask queue).

No build step, no dependencies to install — just open the HTML file in a browser.

## How to run

Open the `.html` file directly in any modern browser (double-click it, or right-click → Open With → your browser). Everything runs client-side; nothing needs to be served or installed.

## What's on the page

### 1. Run a task
Three cards (`Load Users`, `Load Posts`, `Load Comments`), each with its own **Run** button. Clicking one simulates a network request: the status flips to `running`, waits a random 500–2000ms, then flips to `done (Xms)` and bumps a run counter. The button is disabled while its task is in flight so you can't double-fire it.

### 2. Sequential vs. concurrent
Generates three random load times, then runs them two different ways using the *same* three numbers so the comparison is fair:
- **Sequential** — one `await` at a time in a `for` loop. Total time ≈ the sum of all three.
- **Concurrent** — all three started at once via `Promise.all`. Total time ≈ the slowest one alone.

The result box prints both times so you can see the difference for yourself.

### 3. Event loop order
Prints four lines from a mix of synchronous code, a `setTimeout`, and a `Promise.then`. Guess the print order before you click — the actual order (`1, 4, 3, 2`) demonstrates that synchronous code always runs first, then all pending microtasks (promises), then macrotasks (timers).

## Code structure

Everything lives in one HTML file:

| Section | What it contains |
|---|---|
| `<style>` | Design tokens (`:root` custom properties), background grid + blob decoration, and styling for cards/buttons/output boxes |
| `<body>` | Three `<div class="task">` cards, a comparison section, and an event-loop section — each with a button wired via an inline `onclick` |
| `<script>` | Four functions: `wait()`, `runTask()`, `compareSpeed()`, `runEventLoopDemo()` |

### Functions

- **`wait(ms)`** — wraps `setTimeout` in a `Promise` so it can be used with `await`. This is the one utility every other async function in the file depends on.
- **`runTask(name)`** — looks up the DOM elements for the given task name, sets status to `running`, `await`s a random delay via `wait()`, then updates status, run count, and re-enables the button.
- **`compareSpeed()`** — generates three shared random durations, times a sequential `for` loop of `await wait(...)` calls, then times a concurrent `Promise.all(times.map(wait))` call, and prints both totals.
- **`runEventLoopDemo()`** — runs four `print()` calls interleaved with a `setTimeout` and a `Promise.then`, demonstrating call-stack → microtask → macrotask ordering.

State is kept in one plain object, `taskRuns = { users: 0, posts: 0, comments: 0 }` — no closures, no classes, just a shared object all the functions read and write.

## Design

- **Fonts:** Montserrat (`--primary`, body/headings/buttons), Cinzel (`--accent`, section headings), JetBrains Mono (`--mono`, status text and output boxes) — loaded from Google Fonts.
- **Palette:** dark background (`#0A0E18`) with card surfaces (`#141B2E`), a cyan/violet blob backdrop, and status colors: gray = idle, amber = running, green = done.

## Concepts this project demonstrates

- Turning a callback-based API (`setTimeout`) into a promise with `new Promise(resolve => ...)`
- `async`/`await` for writing asynchronous code that reads top-to-bottom
- The real difference between sequential `await` calls and `Promise.all`
- The JavaScript event loop: synchronous code → microtask queue (promises) → macrotask queue (timers)

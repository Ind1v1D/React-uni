# ⚡ Async Task Runner & Event Loop Visualizer

A lightweight, interactive web tool built with vanilla JavaScript and CSS to demonstrate core asynchronous JavaScript concepts, including `setTimeout`, `async/await`, `Promise.all`, and **Event Loop** execution priority.

---

## 🚀 Features

* **Task Runner Engine:** Interactive simulation of asynchronous tasks with random latency profiles.
* **Sequential vs. Concurrent Comparison:** Visual demonstration of how `await` inside loops differs from `Promise.all` in execution speed ($\text{T}_{\text{sum}}$ vs. $\text{T}_{\text{max}}$).
* **Event Loop Order Demo:** Clear step-by-step breakdown of how the Call Stack handles synchronous code, Microtasks (Promises), and Macrotasks (`setTimeout`).
* **Modern UI:** Responsive layout with dynamic dark theme, radial grid overlays, and ambient glowing accents built without external framework dependencies.

---

## 📁 Project Structure

```text
.
├── index.html       # Combined structure, styles, and task execution logic
└── README.md        # Project documentation
```
🛠️ How It Works
1. Promisifying Asynchronous Delays
The project wraps the standard callback-based setTimeout API into a Promise helper function:
```JavaScript
function wait(ms) {
  return new Promise(function (resolve) {
    setTimeout(resolve, ms);
  });
}
```
2. Execution ParadigmsMethodBehaviorExecution Time FormulaSequentialRuns tasks one after another using a for loop with await.$T_{\text{total}} = T_1 + T_2 + T_3$ConcurrentRuns all tasks simultaneously using Promise.all.$T_{\text{total}} = \max(T_1, T_2, T_3)$3. Event Loop Priority HierarchyThe event loop demonstration outputs logs in the following strict order:Synchronous Stack: 1: script start $\rightarrow$ 4: script endMicrotask Queue: 3: promise .then callback (High Priority)Macrotask Queue: 2: setTimeout callback (Low Priority)💻 Quick StartClone or download this repository.Open index.html directly in any web browser. No npm install, build steps, or server setup required.

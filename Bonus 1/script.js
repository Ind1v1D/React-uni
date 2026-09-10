// ─────────────────────────────────────────────
// Helper: render to DOM
// ─────────────────────────────────────────────
function render(containerId, html) {
  const el = document.getElementById(containerId);
  if (el) el.innerHTML += html;
}

// ─────────────────────────────────────────────
// TASK 1 — Variables & Data Types
// ─────────────────────────────────────────────
(function task1() {
  const name = "Alice";
  const age = 22;
  let active = true;
  const courses = ["React", "Node.js", "CSS"];
  const address = { city: "Almaty", street: "123 Main St" };

  const nothing = null;
  let notDefined;

  const vars = [
    { name: "name",     value: name,     type: typeof name },
    { name: "age",      value: age,      type: typeof age },
    { name: "active",   value: active,   type: typeof active },
    { name: "courses",  value: JSON.stringify(courses),  type: typeof courses },
    { name: "address",  value: JSON.stringify(address),  type: typeof address },
    { name: "nothing (null)",       value: String(nothing),  type: typeof nothing },
    { name: "notDefined (undef.)",  value: String(notDefined), type: typeof notDefined },
  ];

  let tableRows = vars.map(v => {
    const isRef = Array.isArray(v.value);
    return `<tr>
      <td>${v.name}</td>
      <td>${v.value}</td>
      <td>${v.type}</td>
      <td>${isRef ? "Reference" : "Primitive"}</td>
    </tr>`;
  }).join("");

  render("task1-output", `
    <h3>Student Variables</h3>
    <table class="result-table">
      <tr><th>Variable</th><th>Value</th><th>typeof</th><th>Category</th></tr>
      ${tableRows}
    </table>

    <h3>Template Literal</h3>
    <div class="code-block">${`\`\${name} is \${age} years old and takes \${courses.length} courses.\``}</div>
    <div class="answer">${name} is ${age} years old and takes ${courses.length} courses.</div>

    <h3>Key Questions</h3>
    <div class="answer"><strong>let vs const?</strong> <code>let</code> allows reassignment; <code>const</code> does not. Both are block-scoped. Use <code>const</code> by default and <code>let</code> only when reassignment is needed.</div>
    <div class="answer"><strong>typeof null?</strong> Returns <code>"object"</code> — this is a well-known bug in JavaScript dating back to the first implementation.</div>
    <div class="answer"><strong>Primitive types:</strong> string, number, bigint, boolean, undefined, symbol, null.</div>
  `);

  render("task1-insights", `
    <h4>Insight</h4>
    <p>Arrays and objects are reference types, while strings, numbers, booleans, null, and undefined are primitives. This distinction becomes critical in Task 5 when we explore copying behavior.</p>
  `);
})();

// ─────────────────────────────────────────────
// TASK 2 — Arrays
// ─────────────────────────────────────────────
(function task2() {
  const numbers = [3, 7, 2, 10, 5];

  const doubled      = numbers.map(n => n * 2);
  const greaterThan5 = numbers.filter(n => n > 5);
  const firstGT5     = numbers.find(n => n > 5);
  const sum          = numbers.reduce((acc, n) => acc + n, 0);
  const has10        = numbers.includes(10);

  render("task2-output", `
    <h3>Original Array</h3>
    <div class="code-block">const numbers = [3, 7, 2, 10, 5];</div>

    <h3>map — Multiply by 2</h3>
    <div class="output-row"><span class="output-label">numbers.map(n => n * 2)</span><span class="output-value">[${doubled}]</span></div>

    <h3>filter — Greater than 5</h3>
    <div class="output-row"><span class="output-label">numbers.filter(n => n > 5)</span><span class="output-value">[${greaterThan5}]</span></div>

    <h3>find — First number > 5</h3>
    <div class="output-row"><span class="output-label">numbers.find(n => n > 5)</span><span class="output-value">${firstGT5}</span></div>

    <h3>reduce — Sum</h3>
    <div class="output-row"><span class="output-label">numbers.reduce((acc, n) => acc + n, 0)</span><span class="output-value">${sum}</span></div>

    <h3>includes — Check for 10</h3>
    <div class="output-row"><span class="output-label">numbers.includes(10)</span><span class="output-value">${has10}</span></div>
  `);

  render("task2-insights", `
    <h4>Insight</h4>
    <p>All these methods are non-mutating: they return new arrays (or values) without changing the original. This functional style is core to React development, where immutability keeps state predictable.</p>
  `);
})();

// ─────────────────────────────────────────────
// TASK 3 — Arrays of Objects
// ─────────────────────────────────────────────
(function task3() {
  const students = [
    { id: 1, name: "Anna",  grade: 85 },
    { id: 2, name: "John",  grade: 62 },
    { id: 3, name: "Sara",  grade: 91 },
    { id: 4, name: "Mike",  grade: 55 },
  ];

  const passing      = students.filter(s => s.grade >= 70);
  const names        = students.map(s => s.name);
  const sara         = students.find(s => s.id === 3);
  const highest      = students.reduce((best, s) => s.grade > best.grade ? s : best);
  const average      = students.reduce((sum, s) => sum + s.grade, 0) / students.length;
  const passedArr    = students.map(s => ({ ...s, passed: s.grade >= 70 }));

  render("task3-output", `
    <h3>Original Students</h3>
    <table class="result-table">
      <tr><th>ID</th><th>Name</th><th>Grade</th></tr>
      ${students.map(s => `<tr><td>${s.id}</td><td>${s.name}</td><td>${s.grade}</td></tr>`).join("")}
    </table>

    <h3>Students with Grade ≥ 70 (filter)</h3>
    <table class="result-table">
      <tr><th>ID</th><th>Name</th><th>Grade</th></tr>
      ${passing.map(s => `<tr><td>${s.id}</td><td>${s.name}</td><td>${s.grade}</td></tr>`).join("")}
    </table>

    <h3>All Names (map)</h3>
    <div class="output-row"><span class="output-label">students.map(s => s.name)</span><span class="output-value">[${names.join(", ")}]</span></div>

    <h3>Student with id = 3 (find)</h3>
    <div class="output-row"><span class="output-label">students.find(s => s.id === 3)</span><span class="output-value">${JSON.stringify(sara)}</span></div>

    <h3>Highest Grade (reduce)</h3>
    <div class="output-row"><span class="output-label">reduce — best student</span><span class="output-value">${highest.name} (${highest.grade})</span></div>

    <h3>Average Grade (reduce)</h3>
    <div class="output-row"><span class="output-label">reduce — average</span><span class="output-value">${average}</span></div>

    <h3>Pass/Fail Array (map + spread)</h3>
    <table class="result-table">
      <tr><th>ID</th><th>Name</th><th>Grade</th><th>Passed</th></tr>
      ${passedArr.map(s => `<tr>
        <td>${s.id}</td><td>${s.name}</td><td>${s.grade}</td>
        <td class="${s.passed ? 'bool-true' : 'bool-false'}">${s.passed}</td>
      </tr>`).join("")}
    </table>
  `);

  render("task3-insights", `
    <h4>Insight</h4>
    <p>Using spread (<code>{ ...s, passed: ... }</code>) we create new objects without mutating the originals. This pattern — returning new data instead of modifying existing data — is the foundation of Redux-style state management in React.</p>
  `);
})();

// ─────────────────────────────────────────────
// TASK 4 — Objects
// ─────────────────────────────────────────────
(function task4() {
  let user = {
    id: 1,
    name: "Alice",
    age: 25,
    address: { city: "Almaty", street: "123 Main St" }
  };

  // Read name and city
  const userName = user.name;
  const userCity = user.address.city;

  // Change age
  user.age = 26;

  // Add email
  user.email = "alice@example.com";

  // Remove street
  delete user.address.street;

  // Destructuring — name + age
  const { name, age } = user;

  // Nested destructuring — city
  const { address: { city } } = user;

  // Rename during destructuring
  const { name: userNameRenamed } = user;

  render("task4-output", `
    <h3>Original User</h3>
    <div class="code-block">{ id: 1, name: "Alice", age: 25, address: { city: "Almaty", street: "123 Main St" } }</div>

    <h3>Read name & city</h3>
    <div class="output-row"><span class="output-label">user.name</span><span class="output-value">${userName}</span></div>
    <div class="output-row"><span class="output-label">user.address.city</span><span class="output-value">${userCity}</span></div>

    <h3>After mutations (age=26, added email, deleted street)</h3>
    <div class="code-block">${JSON.stringify(user, null, 2)}</div>

    <h3>Destructuring</h3>
    <div class="code-block">const { name, age } = user;\n// name = "${name}", age = ${age}</div>

    <h3>Nested Destructuring</h3>
    <div class="code-block">const { address: { city } } = user;\n// city = "${city}"</div>

    <h3>Rename During Destructuring</h3>
    <div class="code-block">const { name: userName } = user;\n// userName = "${userNameRenamed}"</div>
  `);

  render("task4-insights", `
    <h4>Insight</h4>
    <p>Destructuring is one of the most useful ES6 features for React — you'll use it constantly to extract props and state. Nested destructuring is great for pulling out values from complex objects in one line.</p>
  `);
})();

// ─────────────────────────────────────────────
// TASK 5 — Values & References
// ─────────────────────────────────────────────
(function task5() {
  // --- Part A: Shallow reference ---
  let original = { name: "Alice", score: 10 };
  let copy = original;
  copy.score = 99;
  const originalScoreAfterCopyMut = original.score;
  // Reset
  original = { name: "Alice", score: 10 };

  // --- Part B: Spread copy ---
  const spreadCopy = { ...original };
  spreadCopy.score = 50;
  const originalScoreAfterSpread = original.score;

  // --- Part C: Nested spread problem ---
  let user = { name: "Alice", address: { city: "Almaty" } };
  const shallowUserCopy = { ...user };
  shallowUserCopy.address.city = "Astana";
  const originalCityAfterShallow = user.address.city;
  // Reset
  user = { name: "Alice", address: { city: "Almaty" } };

  // --- Part D: Deep copy ---
  const deepUserCopy = { ...user, address: { ...user.address } };
  deepUserCopy.address.city = "Shymkent";
  const originalCityAfterDeep = user.address.city;

  render("task5-output", `
    <h3>Part A — Direct Assignment (reference)</h3>
    <div class="compare-grid">
      <div class="compare-box left">
        <h4>Original (after copy.score = 99)</h4>
        <pre>{ name: "Alice", score: ${originalScoreAfterCopyMut} }</pre>
      </div>
      <div class="compare-box right">
        <h4>Explanation</h4>
        <pre>copy = original makes both variables point to the SAME object in memory. Changing copy.score also changes original.score.</pre>
      </div>
    </div>

    <h3>Part B — Spread Operator (shallow copy)</h3>
    <div class="compare-grid">
      <div class="compare-box right">
        <h4>Original (unchanged)</h4>
        <pre>{ name: "Alice", score: ${originalScoreAfterSpread} }</pre>
      </div>
      <div class="compare-box right">
        <h4>Spread Copy</h4>
        <pre>{ name: "Alice", score: 50 }</pre>
      </div>
    </div>

    <h3>Part C — Nested Spread (the gotcha)</h3>
    <div class="compare-grid">
      <div class="compare-box left">
        <h4>Original (changed!)</h4>
        <pre>{ name: "Alice", address: { city: "${originalCityAfterShallow}" } }</pre>
      </div>
      <div class="compare-box left">
        <h4>Why?</h4>
        <pre>Spread only copies one level deep. The address object is still shared, so mutating it affects the original.</pre>
      </div>
    </div>

    <h3>Part D — Correct Deep Copy of Nested Address</h3>
    <div class="compare-grid">
      <div class="compare-box right">
        <h4>Original (unchanged!)</h4>
        <pre>{ name: "Alice", address: { city: "${originalCityAfterDeep}" } }</pre>
      </div>
      <div class="compare-box right">
        <h4>Solution</h4>
        <pre>const deepCopy = { ...user, address: { ...user.address } };\n// Manually spread nested objects</pre>
      </div>
    </div>
  `);

  render("task5-insights", `
    <h4>Insight</h4>
    <p>Objects are stored by reference, not by value. Simple assignment copies the reference (pointer), not the data. Spread creates a new top-level object, but nested objects are still shared references. For fully independent copies you need to manually spread each nesting level, use <code>structuredClone()</code> (modern browsers), or <code>JSON.parse(JSON.stringify(...))</code>. This concept is critical for understanding React's immutability model.</p>
  `);
})();

// ─────────────────────────────────────────────
// TASK 6 — Functions
// ─────────────────────────────────────────────
(function task6() {
  // Normal function syntax
  function isEven(number) {
    return number % 2 === 0;
  }

  function getFullName(firstName, lastName) {
    return firstName + " " + lastName;
  }

  // Arrow function syntax
  const calculatePrice = (price, quantity) => price * quantity;

  const calculateDiscount = (price, percent) => price - (price * percent / 100);

  const getMax = (a, b) => (a > b ? a : b);

  const results = [
    { label: "isEven(4)",           value: String(isEven(4)) },
    { label: "isEven(7)",           value: String(isEven(7)) },
    { label: 'getFullName("A","B")', value: getFullName("Alice", "Bob") },
    { label: "calculatePrice(10,3)", value: calculatePrice(10, 3) },
    { label: "calculateDiscount(100,20)", value: calculateDiscount(100, 20) },
    { label: "getMax(15, 8)",        value: getMax(15, 8) },
  ];

  let rows = results.map(r => `<div class="output-row"><span class="output-label">${r.label}</span><span class="output-value">${r.value}</span></div>`).join("");

  render("task6-output", `
    <h3>Function Definitions</h3>
    <div class="code-block"><span class="cm">// Normal function syntax</span>
<span class="kw">function</span> <span class="fn">isEven</span>(number) {
  <span class="kw">return</span> number % 2 === 0;
}

<span class="kw">function</span> <span class="fn">getFullName</span>(firstName, lastName) {
  <span class="kw">return</span> firstName + <span class="str">" "</span> + lastName;
}

<span class="cm">// Arrow function syntax</span>
<span class="kw">const</span> <span class="fn">calculatePrice</span> = (price, quantity) => price * quantity;
<span class="kw">const</span> <span class="fn">calculateDiscount</span> = (price, percent) => price - (price * percent / 100);
<span class="kw">const</span> <span class="fn">getMax</span> = (a, b) => (a > b ? a : b);</div>

    <h3>Results</h3>
    ${rows}
  `);

  render("task6-insights", `
    <h4>Insight</h4>
    <p>Arrow functions are shorter and don't have their own <code>this</code> binding, which makes them ideal for callbacks — a pattern you'll use constantly in React (event handlers, <code>.map()</code>, <code>.filter()</code>, etc.). Use arrow functions for short, concise operations and regular functions when you need <code>this</code> or hoisting.</p>
  `);
})();

// ─────────────────────────────────────────────
// TASK 7 — Functions as Values
// ─────────────────────────────────────────────
(function task7() {
  function add(a, b) { return a + b; }
  function multiply(a, b) { return a * b; }

  function calculate(a, b, operation) {
    return operation(a, b);
  }

  const results = [
    { label: "calculate(5, 3, add)",      value: calculate(5, 3, add) },
    { label: "calculate(5, 3, multiply)", value: calculate(5, 3, multiply) },
    { label: "calculate(10, 2, add)",     value: calculate(10, 2, add) },
    { label: "calculate(10, 2, multiply)",value: calculate(10, 2, multiply) },
    { label: "calculate(7, 4, (a,b)=>a-b) — inline", value: calculate(7, 4, (a, b) => a - b) },
  ];

  let rows = results.map(r => `<div class="output-row"><span class="output-label">${r.label}</span><span class="output-value">${r.value}</span></div>`).join("");

  render("task7-output", `
    <h3>Functions</h3>
    <div class="code-block"><span class="kw">function</span> <span class="fn">add</span>(a, b) { <span class="kw">return</span> a + b; }
<span class="kw">function</span> <span class="fn">multiply</span>(a, b) { <span class="kw">return</span> a * b; }

<span class="kw">function</span> <span class="fn">calculate</span>(a, b, operation) {
  <span class="kw">return</span> operation(a, b);
}</div>

    <h3>Results</h3>
    ${rows}
  `);

  render("task7-insights", `
    <h4>Insight</h4>
    <p>Functions are first-class citizens in JavaScript — they can be passed as arguments just like strings or numbers. This is the basis of higher-order functions and is used extensively in React: <code>useState(setState =&gt; ...)</code>, <code>useEffect(() =&gt; ...)</code>, and callback props like <code>onClick={handleClick}</code> all rely on this concept.</p>
  `);
})();

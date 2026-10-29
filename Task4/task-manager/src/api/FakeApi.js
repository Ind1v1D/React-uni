const KEY = "task-manager-db-v1";

const seed = [
  { id: 1, title: "Design landing page", assignee: "Anna", category: "Design", priority: "high", status: "todo", estimateHours: 8, dueDate: "2026-11-10", description: "Create wireframes and final mockups for the landing page.", createdAt: "2026-10-01T09:00:00Z", updatedAt: "2026-10-01T09:00:00Z" },
  { id: 2, title: "Set up CI pipeline", assignee: "Max", category: "DevOps", priority: "medium", status: "in-progress", estimateHours: 5, dueDate: "2026-11-05", description: "Configure lint, tests and deploy steps.", createdAt: "2026-10-03T12:00:00Z", updatedAt: "2026-10-03T12:00:00Z" },
  { id: 3, title: "Write API docs", assignee: "Lena", category: "Docs", priority: "low", status: "todo", estimateHours: 3, dueDate: "2026-11-20", description: "Document all endpoints with examples.", createdAt: "2026-10-05T15:30:00Z", updatedAt: "2026-10-05T15:30:00Z" },
];

function read() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) {
      localStorage.setItem(KEY, JSON.stringify(seed));
      return [...seed];
    }
    return JSON.parse(raw);
  } catch {
    return [...seed];
  }
}

function write(data) {
  localStorage.setItem(KEY, JSON.stringify(data));
}


function simulate(operation, { min = 500, max = 2000, failRate = 0.15 } = {}) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() < failRate) {
        reject(new Error("Network error. Please try again."));
        return;
      }
      try {
        resolve(operation());
      } catch (e) {
        reject(e);
      }
    }, min + Math.random() * (max - min));
  });
}

export function fetchTasks() {
  return simulate(() =>
    read().map(({ id, title, status, priority }) => ({ id, title, status, priority }))
  );
}


export function fetchTaskDetails(id) {
  return simulate(() => {
    const task = read().find((t) => t.id === id);
    if (!task) throw new Error("Task not found.");
    return task;
  });
}

export function createTask(data) {
  return simulate(() => {
    const all = read();
    const now = new Date().toISOString();
    const task = {
      ...data,
      id: Date.now(),
      status: "todo",
      createdAt: now,
      updatedAt: now,
    };
    write([...all, task]);
    return task;
  });
}

export function updateTask(id, patch) {
  return simulate(() => {
    const all = read();
    const idx = all.findIndex((t) => t.id === id);
    if (idx === -1) throw new Error("Task not found.");
    const updated = { ...all[idx], ...patch, updatedAt: new Date().toISOString() };
    all[idx] = updated;
    write(all);
    return updated;
  });
}

export function removeTask(id) {
  return simulate(() => {
    write(read().filter((t) => t.id !== id));
    return id;
  });
}

export function completeTask(id) {
  return simulate(
    () => {
      const all = read();
      const idx = all.findIndex((t) => t.id === id);
      if (idx === -1) throw new Error("Task not found.");
      all[idx] = { ...all[idx], status: "done", updatedAt: new Date().toISOString() };
      write(all);
      return all[idx];
    },
    { min: 2000, max: 3500 }
  );
}
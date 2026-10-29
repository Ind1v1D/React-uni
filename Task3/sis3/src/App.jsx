import { useState, useEffect } from "react";
import {
  fetchTasks, fetchTaskDetails, createTask, updateTask, removeTask, completeTask,
} from "./api/fakeApi";
import TaskForm from "./components/TaskForm";

export default function App() {
  // ----- list state -----
  const [tasks, setTasks] = useState([]);
  const [listStatus, setListStatus] = useState("loading"); // loading | error | success
  const [listError, setListError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  // ----- details state -----
  const [selectedId, setSelectedId] = useState(null);
  const [details, setDetails] = useState(null);
  const [detailsStatus, setDetailsStatus] = useState("idle"); // idle | loading | error | success
  const [detailsError, setDetailsError] = useState("");

  // ----- actions state -----
  const [busyIds, setBusyIds] = useState([]); // ids with a request in flight
  const [actionError, setActionError] = useState("");
  const [form, setForm] = useState(null); // null | { mode: "create" } | { mode: "edit", task }
  const [saving, setSaving] = useState(false);

  // 1) Load the list. Re-runs when Reload is clicked.
  useEffect(() => {
    let ignore = false;
    setListStatus("loading");
    fetchTasks()
      .then((data) => {
        if (ignore) return;
        setTasks(data);
        setListStatus("success");
      })
      .catch((e) => {
        if (ignore) return;
        setListError(e.message);
        setListStatus("error");
      });
    return () => { ignore = true; };
  }, [reloadKey]);

  // 2) Load details of the selected task. RACE-CONDITION SAFE via cleanup flag.
  useEffect(() => {
    if (selectedId === null) {
      setDetails(null);
      setDetailsStatus("idle");
      return;
    }
    let ignore = false;
    setDetails(null);
    setDetailsStatus("loading");
    fetchTaskDetails(selectedId)
      .then((data) => {
        if (ignore) return; // outdated response, discard
        setDetails(data);
        setDetailsStatus("success");
      })
      .catch((e) => {
        if (ignore) return;
        setDetailsError(e.message);
        setDetailsStatus("error");
      });
    return () => { ignore = true; }; // runs when selectedId changes / unmount
  }, [selectedId]);

  // ----- helpers -----
  function markBusy(id) { setBusyIds((prev) => [...prev, id]); }
  function unmarkBusy(id) { setBusyIds((prev) => prev.filter((x) => x !== id)); }
  const isBusy = (id) => busyIds.includes(id);

  // Keeps list + details in sync using FUNCTIONAL updates and the captured id
  function applyUpdate(updated) {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === updated.id
          ? { id: t.id, title: updated.title, status: updated.status, priority: updated.priority }
          : t
      )
    );
    setDetails((prev) => (prev && prev.id === updated.id ? updated : prev));
  }

  // ----- Complete (stale-closure-safe) -----
  async function handleComplete(taskId) {
    // taskId is captured NOW. Even if the user selects another item
    // while we wait, the response still updates the right task.
    if (isBusy(taskId)) return; // block conflicting actions
    setActionError("");
    markBusy(taskId);
    try {
      const updated = await completeTask(taskId);
      applyUpdate(updated);
    } catch (e) {
      setActionError(`Could not complete task: ${e.message}`);
    } finally {
      unmarkBusy(taskId);
    }
  }

  // ----- Remove -----
  async function handleRemove(taskId) {
    if (isBusy(taskId)) return;
    if (!window.confirm("Delete this task?")) return;
    setActionError("");
    markBusy(taskId);
    try {
      await removeTask(taskId);
      setTasks((prev) => prev.filter((t) => t.id !== taskId));
      setSelectedId((cur) => (cur === taskId ? null : cur));
    } catch (e) {
      setActionError(`Could not delete task: ${e.message}`);
    } finally {
      unmarkBusy(taskId);
    }
  }

  // ----- Create / Edit -----
  async function handleSave(values) {
    setSaving(true);
    setActionError("");
    try {
      if (form.mode === "create") {
        const created = await createTask(values);
        setTasks((prev) => [
          ...prev,
          { id: created.id, title: created.title, status: created.status, priority: created.priority },
        ]);
      } else {
        const id = form.task.id; // captured id
        markBusy(id);
        try {
          const updated = await updateTask(id, values);
          applyUpdate(updated);
        } finally {
          unmarkBusy(id);
        }
      }
      setForm(null);
    } catch (e) {
      setActionError(`Save failed: ${e.message}`);
    } finally {
      setSaving(false);
    }
  }

  // ----- render -----
  return (
    <div className="app">
      <header>
        <h1>Task Manager</h1>
        <div className="row">
          <button onClick={() => setReloadKey((k) => k + 1)} disabled={listStatus === "loading"}>
            ↻ Reload
          </button>
          <button onClick={() => setForm({ mode: "create" })}>+ New task</button>
        </div>
      </header>

      {actionError && (
        <div className="banner error" role="alert">
          {actionError} <button className="link" onClick={() => setActionError("")}>dismiss</button>
        </div>
      )}

      <main className="layout">
        {/* LIST */}
        <section className="panel">
          <h2>Tasks</h2>
          {listStatus === "loading" && <p className="muted">Loading tasks...</p>}
          {listStatus === "error" && (
            <div className="banner error">
              {listError}{" "}
              <button onClick={() => setReloadKey((k) => k + 1)}>Retry</button>
            </div>
          )}
          {listStatus === "success" && tasks.length === 0 && (
            <p className="muted">No tasks yet. Create your first one!</p>
          )}
          {listStatus === "success" && tasks.length > 0 && (
            <ul className="list">
              {tasks.map((t) => (
                <li
                  key={t.id}
                  className={t.id === selectedId ? "item selected" : "item"}
                  onClick={() => setSelectedId(t.id)}
                >
                  <span>{t.title}</span>
                  <span className={`badge ${t.status}`}>{t.status}</span>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* DETAILS / FORM */}
        <section className="panel">
          {form ? (
            <TaskForm
              key={form.mode === "edit" ? form.task.id : "new"}
              initial={form.mode === "edit" ? form.task : null}
              saving={saving}
              onSave={handleSave}
              onCancel={() => setForm(null)}
            />
          ) : (
            <>
              <h2>Details</h2>
              {detailsStatus === "idle" && <p className="muted">Select a task to see details.</p>}
              {detailsStatus === "loading" && <p className="muted">Loading details...</p>}
              {detailsStatus === "error" && (
                <div className="banner error">
                  {detailsError}{" "}
                  <button onClick={() => { const id = selectedId; setSelectedId(null); setTimeout(() => setSelectedId(id), 0); }}>
                    Retry
                  </button>
                </div>
              )}
              {detailsStatus === "success" && details && (
                <div>
                  <h3>{details.title}</h3>
                  <dl className="fields">
                    <dt>Status</dt><dd><span className={`badge ${details.status}`}>{details.status}</span></dd>
                    <dt>Priority</dt><dd>{details.priority}</dd>
                    <dt>Assignee</dt><dd>{details.assignee || "—"}</dd>
                    <dt>Category</dt><dd>{details.category || "—"}</dd>
                    <dt>Estimate</dt><dd>{details.estimateHours} h</dd>
                    <dt>Due date</dt><dd>{details.dueDate || "—"}</dd>
                    <dt>Description</dt><dd>{details.description || "—"}</dd>
                    <dt>Created</dt><dd>{new Date(details.createdAt).toLocaleString()}</dd>
                    <dt>Updated</dt><dd>{new Date(details.updatedAt).toLocaleString()}</dd>
                  </dl>
                  <div className="row">
                    <button
                      onClick={() => handleComplete(details.id)}
                      disabled={isBusy(details.id) || details.status === "done"}
                    >
                      {isBusy(details.id) ? "Working..." : "✓ Mark complete"}
                    </button>
                    <button className="secondary" onClick={() => setForm({ mode: "edit", task: details })} disabled={isBusy(details.id)}>
                      Edit
                    </button>
                    <button className="danger" onClick={() => handleRemove(details.id)} disabled={isBusy(details.id)}>
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </section>
      </main>
    </div>
  );
}
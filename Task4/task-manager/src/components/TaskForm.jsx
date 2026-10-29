import { useState } from "react";

export default function TaskForm({ initial, saving, onSave, onCancel }) {
  const [values, setValues] = useState(
    initial ?? {
      title: "", assignee: "", category: "", priority: "medium",
      estimateHours: 1, dueDate: "", description: "",
    }
  );

  function change(e) {
    const { name, value } = e.target;
    setValues((v) => ({ ...v, [name]: value }));
  }

  function submit(e) {
    e.preventDefault();
    if (!values.title.trim()) return;
    onSave({ ...values, estimateHours: Number(values.estimateHours) });
  }

  return (
    <form className="form" onSubmit={submit}>
      <h3>{initial ? "Edit task" : "New task"}</h3>
      <label>Title<input name="title" value={values.title} onChange={change} required /></label>
      <label>Assignee<input name="assignee" value={values.assignee} onChange={change} /></label>
      <label>Category<input name="category" value={values.category} onChange={change} /></label>
      <label>Priority
        <select name="priority" value={values.priority} onChange={change}>
          <option value="low">low</option>
          <option value="medium">medium</option>
          <option value="high">high</option>
        </select>
      </label>
      <label>Estimate (hours)<input type="number" min="0" name="estimateHours" value={values.estimateHours} onChange={change} /></label>
      <label>Due date<input type="date" name="dueDate" value={values.dueDate} onChange={change} /></label>
      <label>Description<textarea name="description" rows="3" value={values.description} onChange={change} /></label>
      <div className="row">
        <button type="submit" disabled={saving}>{saving ? "Saving..." : "Save"}</button>
        <button type="button" className="secondary" onClick={onCancel} disabled={saving}>Cancel</button>
      </div>
    </form>
  );
}
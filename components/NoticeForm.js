// components/NoticeForm.js
// Reusable form component for both creating and editing notices.
// Accepts initialData (for edit pre-fill) and onSubmit handler.

import { useState } from "react";

const CATEGORIES = ["Exam", "Event", "General"];
const PRIORITIES = ["Normal", "Urgent"];

// Convert a Date/ISO string to the value format expected by <input type="date">
function toDateInputValue(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "";
  return d.toISOString().split("T")[0];
}

export default function NoticeForm({ initialData = {}, onSubmit, isSubmitting }) {
  const [form, setForm] = useState({
    title: initialData.title || "",
    body: initialData.body || "",
    category: initialData.category || "General",
    priority: initialData.priority || "Normal",
    publishDate: toDateInputValue(initialData.publishDate),
    image: initialData.image || "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    // Clear field-level error on change
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // Client-side validation (server also validates independently)
  const validate = () => {
    const errs = {};
    if (!form.title.trim()) errs.title = "Title is required";
    if (!form.body.trim()) errs.body = "Body is required";
    if (!form.publishDate) errs.publishDate = "Publish date is required";
    return errs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    onSubmit(form);
  };

  const inputClass = (field) =>
    `w-full px-4 py-2.5 rounded-xl border text-sm text-slate-800 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition ${
      errors[field]
        ? "border-red-400 focus:ring-red-300"
        : "border-slate-200 hover:border-slate-300"
    }`;

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
      {/* Title */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1.5">
          Title <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Enter notice title"
          className={inputClass("title")}
        />
        {errors.title && (
          <p className="mt-1 text-xs text-red-500">{errors.title}</p>
        )}
      </div>

      {/* Body */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1.5">
          Body <span className="text-red-500">*</span>
        </label>
        <textarea
          name="body"
          value={form.body}
          onChange={handleChange}
          rows={5}
          placeholder="Enter notice details..."
          className={`${inputClass("body")} resize-y min-h-[100px]`}
        />
        {errors.body && (
          <p className="mt-1 text-xs text-red-500">{errors.body}</p>
        )}
      </div>

      {/* Category + Priority row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">
            Category
          </label>
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className={inputClass("category")}
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">
            Priority
          </label>
          <select
            name="priority"
            value={form.priority}
            onChange={handleChange}
            className={inputClass("priority")}
          >
            {PRIORITIES.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Publish Date */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1.5">
          Publish Date <span className="text-red-500">*</span>
        </label>
        <input
          type="date"
          name="publishDate"
          value={form.publishDate}
          onChange={handleChange}
          className={inputClass("publishDate")}
        />
        {errors.publishDate && (
          <p className="mt-1 text-xs text-red-500">{errors.publishDate}</p>
        )}
      </div>

      {/* Image URL (optional) */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1.5">
          Image URL{" "}
          <span className="text-slate-400 font-normal">(optional)</span>
        </label>
        <input
          type="url"
          name="image"
          value={form.image}
          onChange={handleChange}
          placeholder="https://example.com/image.jpg"
          className={inputClass("image")}
        />
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-2 w-full py-3 px-6 rounded-xl font-bold text-sm text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors shadow-sm"
      >
        {isSubmitting ? "Saving…" : "Save Notice"}
      </button>
    </form>
  );
}

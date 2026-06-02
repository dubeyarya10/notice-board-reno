// components/NoticeCard.js

import { useRouter } from "next/router";

// Category style map
const CATEGORY_STYLES = {
  Exam: "bg-blue-100 text-blue-800 border border-blue-200",
  Event: "bg-emerald-100 text-emerald-800 border border-emerald-200",
  General: "bg-amber-100 text-amber-800 border border-amber-200",
};

// Format date for display
function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function NoticeCard({ notice, onDelete }) {
  const router = useRouter();
  const isUrgent = notice.priority === "Urgent";

  const handleEdit = () => router.push(`/notice/${notice.id}`);

  const handleDelete = () => {
    // Confirmation dialog required before any API call
    const confirmed = window.confirm(
      `Are you sure you want to delete "${notice.title}"? This action cannot be undone.`
    );
    if (confirmed) onDelete(notice.id);
  };

  return (
    <article
      className={`relative flex flex-col bg-white rounded-2xl shadow-sm border transition-all duration-200 hover:shadow-md overflow-hidden ${
        isUrgent ? "border-red-300 ring-1 ring-red-200" : "border-slate-200"
      }`}
    >
      {/* Urgent accent bar */}
      {isUrgent && <div className="h-1 w-full bg-gradient-to-r from-red-500 to-rose-400" />}

      {/* Optional image */}
      {notice.image && (
        <div className="h-44 overflow-hidden bg-slate-100">
          <img
            src={notice.image}
            alt={notice.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.style.display = "none";
            }}
          />
        </div>
      )}

      <div className="flex flex-col flex-1 p-5 gap-3">
        {/* Header row: badges */}
        <div className="flex flex-wrap items-center gap-2">
          {/* URGENT badge — mandatory for urgent notices */}
          {isUrgent && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold tracking-wider bg-red-500 text-white uppercase shadow-sm">
              ⚡ URGENT
            </span>
          )}
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
              CATEGORY_STYLES[notice.category] || CATEGORY_STYLES.General
            }`}
          >
            {notice.category}
          </span>
        </div>

        {/* Title */}
        <h2 className="text-lg font-bold text-slate-800 leading-snug line-clamp-2">
          {notice.title}
        </h2>

        {/* Body */}
        <p className="text-sm text-slate-600 leading-relaxed flex-1 line-clamp-3">
          {notice.body}
        </p>

        {/* Footer: date + actions */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100 mt-auto">
          <time
            className="text-xs text-slate-400 font-medium"
            dateTime={notice.publishDate}
          >
            📅 {formatDate(notice.publishDate)}
          </time>

          <div className="flex gap-2">
            <button
              onClick={handleEdit}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg text-indigo-700 bg-indigo-50 hover:bg-indigo-100 transition-colors"
            >
              Edit
            </button>
            <button
              onClick={handleDelete}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg text-red-600 bg-red-50 hover:bg-red-100 transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

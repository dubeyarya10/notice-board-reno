// pages/index.js — Home page: lists all notices

import { useState, useEffect } from "react";
import Link from "next/link";
import NoticeCard from "../components/NoticeCard";

export default function HomePage() {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Fetch all notices on mount
  useEffect(() => {
    fetchNotices();
  }, []);

  async function fetchNotices() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/notices");
      if (!res.ok) throw new Error("Failed to load notices");
      const data = await res.json();
      setNotices(data);
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  // Delete handler — confirmation already done inside NoticeCard
  async function handleDelete(id) {
    try {
      const res = await fetch(`/api/notices/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to delete notice");
      }
      setNotices((prev) => prev.filter((n) => n.id !== id));
      setSuccessMsg("Notice deleted successfully.");
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (err) {
      setError(err.message || "Failed to delete notice");
      setTimeout(() => setError(""), 4000);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">📋</span>
            <div>
              <h1 className="text-xl font-black text-slate-900 tracking-tight leading-none">
                Notice Board
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Announcements &amp; Updates
              </p>
            </div>
          </div>
          <Link
            href="/notice/new"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 text-white text-sm font-bold hover:bg-indigo-700 transition-colors shadow-sm"
          >
            <span>＋</span> New Notice
          </Link>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Toast messages */}
        {successMsg && (
          <div className="mb-6 px-4 py-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm font-medium flex items-center gap-2">
            <span>✅</span> {successMsg}
          </div>
        )}
        {error && (
          <div className="mb-6 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm font-medium flex items-center gap-2">
            <span>❌</span> {error}
          </div>
        )}

        {/* Loading state */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-24 text-slate-400">
            <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-500 rounded-full animate-spin mb-4" />
            <p className="text-sm font-medium">Loading notices…</p>
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && notices.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="text-6xl mb-4">📭</div>
            <h2 className="text-xl font-bold text-slate-700 mb-2">
              No notices yet
            </h2>
            <p className="text-slate-500 text-sm mb-6">
              Be the first to post an announcement.
            </p>
            <Link
              href="/notice/new"
              className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-sm hover:bg-indigo-700 transition-colors"
            >
              Post a Notice
            </Link>
          </div>
        )}

        {/* Notice grid */}
        {!loading && notices.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {notices.map((notice) => (
              <NoticeCard
                key={notice.id}
                notice={notice}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

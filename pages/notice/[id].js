// pages/notice/[id].js — Edit an existing notice

import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import NoticeForm from "../../components/NoticeForm";

export default function EditNoticePage() {
  const router = useRouter();
  const { id } = router.query;

  const [notice, setNotice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState("");

  // Fetch existing notice data to pre-fill the form
  useEffect(() => {
    if (!id) return;
    fetchNotice();
  }, [id]);

  async function fetchNotice() {
    setLoading(true);
    setFetchError("");
    try {
      const res = await fetch(`/api/notices/${id}`);
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Notice not found");
      }
      const data = await res.json();
      setNotice(data);
    } catch (err) {
      setFetchError(err.message || "Failed to load notice");
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(formData) {
    setIsSubmitting(true);
    setApiError("");

    try {
      const res = await fetch(`/api/notices/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to update notice");
      }

      // Redirect to home on success
      router.push("/?updated=1");
    } catch (err) {
      setApiError(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-4 flex items-center gap-3">
          <Link
            href="/"
            className="text-slate-500 hover:text-slate-800 transition-colors text-sm font-medium"
          >
            ← Back
          </Link>
          <span className="text-slate-300">|</span>
          <h1 className="text-lg font-black text-slate-900">Edit Notice</h1>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">

          {/* Loading */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-16 text-slate-400">
              <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-500 rounded-full animate-spin mb-4" />
              <p className="text-sm font-medium">Loading notice…</p>
            </div>
          )}

          {/* Fetch error */}
          {!loading && fetchError && (
            <div className="text-center py-12">
              <div className="text-5xl mb-4">😕</div>
              <h2 className="text-lg font-bold text-slate-700 mb-2">
                {fetchError}
              </h2>
              <Link
                href="/"
                className="text-indigo-600 text-sm font-semibold hover:underline"
              >
                Go back home
              </Link>
            </div>
          )}

          {/* Form */}
          {!loading && notice && (
            <>
              <div className="mb-6">
                <h2 className="text-2xl font-black text-slate-900">
                  Edit Notice
                </h2>
                <p className="text-sm text-slate-500 mt-1">
                  Update the fields below and save your changes.
                </p>
              </div>

              {/* API-level error */}
              {apiError && (
                <div className="mb-5 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm font-medium flex items-center gap-2">
                  <span>❌</span> {apiError}
                </div>
              )}

              <NoticeForm
                initialData={notice}
                onSubmit={handleSubmit}
                isSubmitting={isSubmitting}
              />
            </>
          )}
        </div>
      </main>
    </div>
  );
}

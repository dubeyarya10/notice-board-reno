// pages/notice/new.js — Create a new notice

import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import NoticeForm from "../../components/NoticeForm";

export default function NewNoticePage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState("");

  async function handleSubmit(formData) {
    setIsSubmitting(true);
    setApiError("");

    try {
      const res = await fetch("/api/notices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to create notice");
      }

      // Redirect to home on success
      router.push("/?created=1");
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
          <h1 className="text-lg font-black text-slate-900">New Notice</h1>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-black text-slate-900">
              Post a Notice
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Fill in the details below to publish a new announcement.
            </p>
          </div>

          {/* API-level error */}
          {apiError && (
            <div className="mb-5 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm font-medium flex items-center gap-2">
              <span>❌</span> {apiError}
            </div>
          )}

          <NoticeForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
        </div>
      </main>
    </div>
  );
}

// pages/api/notices/[id].js

import prisma from "../../../lib/prisma";

export default async function handler(req, res) {
  const { id } = req.query;
  const noticeId = parseInt(id, 10);

  if (isNaN(noticeId)) {
    return res.status(400).json({ error: "Invalid notice ID" });
  }

  if (req.method === "GET") {
    return handleGet(req, res, noticeId);
  } else if (req.method === "PUT") {
    return handlePut(req, res, noticeId);
  } else if (req.method === "DELETE") {
    return handleDelete(req, res, noticeId);
  } else {
    res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
    return res.status(405).json({ error: `Method ${req.method} not allowed` });
  }
}

// GET /api/notices/[id] — return a single notice
async function handleGet(req, res, id) {
  try {
    const notice = await prisma.notice.findUnique({ where: { id } });
    if (!notice) return res.status(404).json({ error: "Notice not found" });
    return res.status(200).json(notice);
  } catch (error) {
    console.error(`GET /api/notices/${id} error:`, error);
    return res.status(500).json({ error: "Failed to fetch notice" });
  }
}

// PUT /api/notices/[id] — update a notice
async function handlePut(req, res, id) {
  const { title, body, category, priority, publishDate, image } = req.body;

  // Server-side validation
  const errors = validateNotice({ title, body, publishDate });
  if (errors.length > 0) {
    return res.status(400).json({ error: errors.join(", ") });
  }

  try {
    const notice = await prisma.notice.update({
      where: { id },
      data: {
        title: title.trim(),
        body: body.trim(),
        category: category || "General",
        priority: priority || "Normal",
        publishDate: new Date(publishDate),
        image: image?.trim() || null,
      },
    });
    return res.status(200).json(notice);
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Notice not found" });
    }
    console.error(`PUT /api/notices/${id} error:`, error);
    return res.status(500).json({ error: "Failed to update notice" });
  }
}

// DELETE /api/notices/[id] — delete a notice
async function handleDelete(req, res, id) {
  try {
    await prisma.notice.delete({ where: { id } });
    return res.status(200).json({ message: "Notice deleted successfully" });
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Notice not found" });
    }
    console.error(`DELETE /api/notices/${id} error:`, error);
    return res.status(500).json({ error: "Failed to delete notice" });
  }
}

// Shared validation helper
function validateNotice({ title, body, publishDate }) {
  const errors = [];
  if (!title || title.trim() === "") errors.push("Title is required");
  if (!body || body.trim() === "") errors.push("Body is required");
  if (!publishDate || isNaN(new Date(publishDate).getTime())) {
    errors.push("A valid publish date is required");
  }
  return errors;
}

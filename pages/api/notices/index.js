// pages/api/notices/index.js

import prisma from "../../../lib/prisma";

export default async function handler(req, res) {
  if (req.method === "GET") {
    return handleGet(req, res);
  } else if (req.method === "POST") {
    return handlePost(req, res);
  } else {
    res.setHeader("Allow", ["GET", "POST"]);
    return res.status(405).json({ error: `Method ${req.method} not allowed` });
  }
}

// GET /api/notices — return all notices, Urgent first, then by newest publishDate
async function handleGet(req, res) {
  try {
    const notices = await prisma.notice.findMany({
      orderBy: [
        // Prisma sorts enums alphabetically; "Urgent" > "Normal" so we use desc
        { priority: "desc" },
        { publishDate: "desc" },
      ],
    });
    return res.status(200).json(notices);
  } catch (error) {
    console.error("GET /api/notices error:", error);
    return res.status(500).json({ error: "Failed to fetch notices" });
  }
}

// POST /api/notices — create a new notice
async function handlePost(req, res) {
  const { title, body, category, priority, publishDate, image } = req.body;

  // Server-side validation
  const errors = validateNotice({ title, body, publishDate });
  if (errors.length > 0) {
    return res.status(400).json({ error: errors.join(", ") });
  }

  try {
    const notice = await prisma.notice.create({
      data: {
        title: title.trim(),
        body: body.trim(),
        category: category || "General",
        priority: priority || "Normal",
        publishDate: new Date(publishDate),
        image: image?.trim() || null,
      },
    });
    return res.status(201).json(notice);
  } catch (error) {
    console.error("POST /api/notices error:", error);
    return res.status(500).json({ error: "Failed to create notice" });
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

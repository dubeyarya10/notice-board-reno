# 📋 Notice Board

A production-quality full-stack Notice Board application with CRUD functionality, built with **Next.js (Pages Router)**, **Prisma ORM**, **Supabase PostgreSQL**, and **Tailwind CSS**. Deployable to **Vercel** in minutes.

---

## Project Overview

The Notice Board lets users post, view, edit, and delete notices across three categories (Exam, Event, General) with two priority levels (Normal, Urgent). Urgent notices always appear first in the feed. All data is persisted in a hosted PostgreSQL database and survives both browser refreshes and redeployments.

**Key features:**
- Full CRUD via REST API routes
- Server-side validation on every mutation
- Prisma-driven sorting: Urgent first, then newest `publishDate`
- Red URGENT badge on every high-priority notice
- Delete confirmation dialog
- Responsive mobile-first design (Tailwind CSS)
- Loading and empty states
- Optional per-notice image support

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (Pages Router) |
| Database ORM | Prisma 5 |
| Database | Supabase PostgreSQL |
| Styling | Tailwind CSS 3 |
| Deployment | Vercel |

---

## Environment Variables

Create a `.env.local` file at the project root (see `.env.example`):

```env
# Pooled connection for runtime queries (via PgBouncer)
DATABASE_URL="postgresql://postgres:PASSWORD@db.PROJECT_REF.supabase.co:5432/postgres?pgbouncer=true&connection_limit=1"

# Direct connection for Prisma migrations (bypasses PgBouncer)
DIRECT_URL="postgresql://postgres:PASSWORD@db.PROJECT_REF.supabase.co:5432/postgres"
```

> **Never commit `.env.local` to Git.**

---

## Database Setup (Supabase)

1. Go to [supabase.com](https://supabase.com) and create a free account.
2. Click **New project** and choose a region closest to your users.
3. Once the project is ready, navigate to **Settings → Database**.
4. Copy the **Connection string (URI)** — use the *pooling* string for `DATABASE_URL` and the *direct* string for `DIRECT_URL`.
5. Paste both values into `.env.local`.

> Supabase free tier is sufficient for development and small production workloads.

---

## Local Setup Instructions

### Prerequisites
- Node.js 18+
- npm 9+
- A Supabase project (see above)

### Steps

```bash
# 1. Clone the repository
git clone https://github.com/YOUR_USERNAME/noticeboard.git
cd noticeboard

# 2. Install dependencies
npm install

# 3. Create your environment file
cp .env.example .env.local
# Fill in DATABASE_URL and DIRECT_URL

# 4. Generate Prisma client
npx prisma generate

# 5. Push schema to the database (creates tables)
npx prisma migrate dev --name init

# 6. Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

### Useful scripts

```bash
npm run db:studio    # Open Prisma Studio (visual DB browser)
npm run db:push      # Push schema changes without a migration file
```

---

## Deployment to Vercel

1. Push your code to a GitHub repository.
2. Go to [vercel.com](https://vercel.com) and click **Add New Project**.
3. Import your GitHub repo.
4. In the **Environment Variables** section, add:
   - `DATABASE_URL` → your Supabase pooled connection string
   - `DIRECT_URL` → your Supabase direct connection string
5. Click **Deploy**.

Vercel will automatically run `next build` and deploy your app. Prisma Client is generated during the build step automatically.

> **Important:** Set the `DIRECT_URL` env var as well. Prisma uses it for migrations; the `DATABASE_URL` with PgBouncer is used for all runtime queries.

---

## Folder Structure

```
noticeboard/
├── components/
│   ├── NoticeCard.js       # Reusable notice card with edit/delete
│   └── NoticeForm.js       # Reusable form (shared by create & edit pages)
├── lib/
│   └── prisma.js           # Singleton Prisma client
├── pages/
│   ├── _app.js             # Global CSS import
│   ├── index.js            # Home — lists all notices
│   ├── notice/
│   │   ├── new.js          # Create notice page
│   │   └── [id].js         # Edit notice page
│   └── api/
│       └── notices/
│           ├── index.js    # GET all, POST new
│           └── [id].js     # GET one, PUT, DELETE
├── prisma/
│   └── schema.prisma       # Prisma data model
├── styles/
│   └── globals.css         # Tailwind directives
├── .env.example            # Environment variable template
├── next.config.js
├── tailwind.config.js
├── postcss.config.js
└── package.json
```

---

## API Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/notices` | Return all notices (Urgent first, newest date first) |
| POST | `/api/notices` | Create a new notice |
| GET | `/api/notices/:id` | Return single notice |
| PUT | `/api/notices/:id` | Update existing notice |
| DELETE | `/api/notices/:id` | Delete a notice |

All mutation endpoints validate `title`, `body`, and `publishDate` server-side and return HTTP 400 with a clear error message on failure.

---

## Future Improvement

**Search & filter:** Add a search bar and filter buttons (by category and/or priority) on the home page so users can quickly find relevant notices without scrolling through the full feed. This would be implemented with client-side state (no additional API needed for modest datasets) or a Prisma `where` clause for larger ones.

---

## Honest AI Usage

This project was generated with AI assistance (Claude by Anthropic). The AI produced the initial code structure, component logic, API routes, Prisma schema, and this README based on a detailed specification document. All code was reviewed for correctness, completeness, and adherence to the requirements. The developer is responsible for reviewing, testing, and maintaining the codebase before using it in production.

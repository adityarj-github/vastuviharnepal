# Vastu Vihar Nepal

Marketing website for **Vastu Vihar Nepal**, a developer of planned residential townships across Nepal. It is a single landing page built with Next.js (App Router), React and TypeScript, styled with CSS Modules.

## Tech stack

- [Next.js](https://nextjs.org) 16.4 (App Router)
- React 19.3
- TypeScript 5
- CSS Modules
- Local fonts loaded with `next/font/local`: Involve (headings) and Switzer (body)
- Prisma ORM 6.4 with SQLite database (`prisma/dev.db`)
- JWT authentication (`jose`) with HTTP-only cookies
- Password hashing with `bcryptjs`
- Spreadsheet reporting with `xlsx` (Excel `.xlsx` generation)
- ESLint 9 with `eslint-config-next`

## Getting started

You need Node.js 22.13 or newer (pinned in `.nvmrc` and the `engines` field of `package.json`). With nvm, run `nvm use` to switch.

```bash
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

### Scripts

| Command         | What it does                       |
| --------------- | ---------------------------------- |
| `npm run dev`   | Start the development server       |
| `npm run build` | Create a production build          |
| `npm run start` | Serve the production build         |
| `npm run lint`  | Run ESLint                         |
| `npx prisma db push` | Sync schema with SQLite database |
| `node prisma/seed.mjs` | Seed users, jobs, blogs, gallery & leads |
| `npx prisma studio` | Open Prisma database visualizer UI |

## Project structure

```
public/                  Static assets (images, icons, model and property photos)
src/
  app/
    layout.tsx           Root layout: fonts, metadata, header and footer
    page.tsx             Landing page, built from the section components
    globals.css          Global styles and CSS variables
    favicon.ico, icon.png, apple-icon.png   App icons
  components/
    header/              Sticky header with desktop dropdowns and mobile menu
    home/                Hero, stat counters, about section
    homes/               "Explore homes" project showcase
    amenities/           Amenities marquee
    awards/              Awards section
    career/              Careers section
    quality/             Quality section
    journey/             Company journey timeline
    testimonials/        Customer testimonials
    footer/              Site footer
    buttons/             Shared ActionButton, IconButton and FlipButtons
  data/                  Content for each section as typed TypeScript objects
  fonts/                 Involve and Switzer .woff2 files
```

## Editing content

All copy, links and image paths are in `src/data/`, one file per section (`hero.ts`, `about.ts`, `projects.ts`, `testimonials.ts`, `navigation.ts`, `footer.ts` and so on). To change text or swap images, edit these files and leave the components alone. Image paths point to files under `public/`.

Site metadata (page title, description, favicon) also comes from `src/data/about.ts`.

## Component pattern

Most sections come in two parts:

- `Section.tsx`: a server component that reads data from `src/data/`
- `SectionClient.tsx`: a client component that handles interactivity and animation

Every component has a matching `.module.css` file next to it.

## Note for AI coding agents

This project runs a Next.js version with breaking changes. Read `AGENTS.md` and the docs in `node_modules/next/dist/docs/` before changing any code.

## Deployment

The site deploys to [Netlify](https://www.netlify.com). `netlify.toml` sets the build command (`npm run build`), the publish directory (`.next`) and Node 22, and Netlify's Next.js runtime handles the rest. Connect the repository in Netlify and every push to `main` triggers a deploy.

Any other host that supports Next.js (for example Vercel) works too. Run `npm run build` locally before you push to make sure the production build passes.

Note: the footer uses the `"use cache"` directive so its `new Date()` call doesn't break prerendering. Keep that in mind if you add other time-dependent code to server components.

---

## Backend & Admin Panel Documentation

Vastu Vihar Nepal includes a full-featured bespoke Admin Panel and backend built directly into the Next.js App Router, backed by **Prisma ORM** and local **SQLite** (`prisma/dev.db`).

### 1. Technology Architecture

- **Database**: SQLite (`file:./dev.db`) managed through Prisma ORM 6.4.
- **Authentication**: Stateless HTTP-only cookie-based sessions signed with `jose` (JWT) and encrypted passwords hashed with `bcryptjs`.
- **Excel Engine**: Real `.xlsx` binary spreadsheet generation via `xlsx` with styled headings and auto-sized column widths.
- **File Storage**: Local uploads written directly to `/public/uploads/` (`blogs/`, `gallery/`, `resumes/`) via Next.js Route Handlers with streaming multipart support.
- **Dynamic Content Sync**: Public pages (`/career`, `/blog`, `/gallery`) query the Prisma database first with automatic fallback to static TypeScript archives.

---

### 2. Role-Based Access Control (RBAC)

The admin panel enforces granular permissions across 4 distinct organizational roles:

| Role Code | Team Name | Permissions & Accessible Modules |
| :--- | :--- | :--- |
| `ROOT` | **Root Admin** | **Full system access**: Dashboard, Leads CRM, Excel Export, Job Openings, Applicant Resumes, Blog CMS, Photo Gallery, and User Management. Can create, edit, or delete user accounts and assign roles. Protected against accidental deletion. |
| `MEDIA` | **Media Team** | **Blog and Gallery only**: Write and publish articles, upload inline middle-content photos, organize gallery albums, and manage photography collections. Blocked from leads, HR candidates, and user management. |
| `HR` | **HR Team** | **Job postings and applicant review (view only)**: Post, edit, and toggle active career vacancies, review incoming candidate submissions from `/career/apply`, download resumes (PDF/DOCX), and update recruitment pipeline statuses. Blocked from sales leads and blogs. |
| `SALES` | **Sales Team** | **Leads CRM only**: View, search, and filter residential inquiries from all channels (Model pages, Blog leads, Contact form), record housing advisor notes, and export datasets to Excel (`.xlsx`). Blocked from job openings and content editing. |

---

### 3. Pre-Seeded Team Accounts

The database includes pre-configured credentials for all 4 team roles:

| Role | Email | Password | Access Scope |
| :--- | :--- | :--- | :--- |
| **Root Admin** | `info@vastuvihar.org` | `info123` | Full Access (All 7 modules + User Management) |
| **Sales Team** | `sales@vastuvihar.org` | `sales123` | Leads CRM + Excel Export |
| **HR Team** | `hr@vastuvihar.org` | `hr123` | Job Openings + Candidate Applications |
| **Media Team** | `media@vastuvihar.org` | `media123` | Blog Articles CMS + Photo Gallery |

> **Login Portal**: Navigate to `/admin/login`. The page includes one-click autofill shortcut buttons for all 4 team roles. The public website Header and Footer are automatically hidden on all admin views.

---

### 4. Database Schema & Prisma Models

The schema is defined in `prisma/schema.prisma`:

#### `User`
- `id` (String, cuid)
- `email` (String, unique)
- `password` (String, bcrypt hash)
- `name` (String)
- `role` (String: `ROOT` | `MEDIA` | `HR` | `SALES`)
- `createdAt`, `updatedAt` (DateTime)

#### `Lead`
- `id` (String, cuid)
- `fullName` (String)
- `phone` (String)
- `email` (String, optional)
- `source` (String: `Model Inquiry` | `Blog Lead` | `Contact Form` | `General`)
- `residenceName` (String, optional — model name from Model Inquiry)
- `budget` (String, optional — budget range)
- `purpose` (String, optional — Self-use, Investment, Vacation)
- `locationPref` (String, optional — Birtamode, Birgunj, etc.)
- `interestType` (String, optional — Bungalow type or article category)
- `blogSlug` (String, optional — referring article slug)
- `message` (String, optional — user notes)
- `status` (String: `NEW` | `CONTACTED` | `IN_PROGRESS` | `CONVERTED` | `CLOSED`)
- `notes` (String, optional — internal sales notes)
- `createdAt`, `updatedAt` (DateTime)

#### `JobOpening`
- `id` (String, cuid)
- `jobId` (String, unique slug)
- `title` (String)
- `department` (String)
- `type` (String, default "Full-Time")
- `location` (String)
- `description` (String)
- `requirements` (String, JSON array of qualifications)
- `isOpen` (Boolean, default true)
- `applications` (Relation to `JobApplication[]`)
- `createdAt`, `updatedAt` (DateTime)

#### `JobApplication`
- `id` (String, cuid)
- `fullName` (String)
- `email` (String)
- `phone` (String)
- `location` (String)
- `position` (String)
- `jobOpeningId` (String, optional relation to `JobOpening`)
- `experience` (String)
- `portfolioUrl` (String, optional)
- `coverNote` (String, optional)
- `resumeUrl` (String, path to uploaded resume in `/public/uploads/resumes/`)
- `resumeFileName` (String, original filename)
- `status` (String: `NEW` | `REVIEWING` | `SHORTLISTED` | `REJECTED` | `HIRED`)
- `notes` (String, optional — internal HR evaluation notes)
- `createdAt`, `updatedAt` (DateTime)

#### `BlogPost`
- `id` (String, cuid)
- `slug` (String, unique)
- `title` (String)
- `excerpt` (String)
- `category` (String)
- `publishedDate` (String)
- `readTime` (String)
- `coverImage` (String)
- `coverImageAlt` (String)
- `isPublished` (Boolean, default true)
- `featured` (Boolean, default false)
- `authorName` (String)
- `authorRole` (String)
- `authorAvatar` (String, optional)
- `tags` (String, JSON array)
- `keyTakeaways` (String, JSON array)
- `sections` (String, JSON array of blogger-style rich blocks with optional inline middle-images)
- `metaTitle`, `metaDescription`, `metaKeywords` (String, optional SEO tags)
- `createdAt`, `updatedAt` (DateTime)

#### `GalleryFolder` & `GalleryImageItem`
- `GalleryFolder`: `id`, `slug` (unique), `title`, `category`, `description`, `coverImage`, `order` (Int), `images` (Relation)
- `GalleryImageItem`: `id`, `folderId` (relation), `src`, `alt`, `caption` (optional), `order` (Int)

---

### 5. REST API Endpoints

#### Authentication
- `POST /api/auth/login` — Authenticates credentials, signs JWT, sets HTTP-only session cookie.
- `POST /api/auth/logout` — Destroys session cookie.
- `GET /api/auth/me` — Returns current logged-in user profile and role.

#### Public Ingestion
- `POST /api/leads` — Public submission endpoint for all frontend lead forms.
- `POST /api/jobs/apply` — Public candidate job application endpoint with multipart resume upload.
- `GET /api/jobs` — Public listing of active job openings.
- `GET /api/blogs` & `GET /api/blogs/[slug]` — Public blog endpoints.
- `GET /api/gallery` & `GET /api/gallery/[slug]` — Public photo gallery endpoints.

#### Admin Leads & CRM (Roles: `ROOT`, `SALES`)
- `GET /api/admin/leads?source=&status=&search=` — Filterable leads query.
- `PATCH /api/admin/leads/[id]` — Update lead status and sales advisor notes.
- `DELETE /api/admin/leads/[id]` — Delete lead record.
- `GET /api/admin/leads/export` — Stream downloadable real `.xlsx` Excel workbook.

#### Admin Careers & Hiring (Roles: `ROOT`, `HR`)
- `GET /api/admin/jobs` — List all job openings with applicant counts.
- `POST /api/admin/jobs` — Create new job vacancy.
- `PATCH /api/admin/jobs/[id]` — Update vacancy details and toggle `isOpen` status.
- `DELETE /api/admin/jobs/[id]` — Delete job opening.
- `GET /api/admin/applications` — List candidate job applications with filters.
- `PATCH /api/admin/applications/[id]` — Update candidate recruitment status and HR notes.
- `DELETE /api/admin/applications/[id]` — Delete application record.

#### Admin Content & Media (Roles: `ROOT`, `MEDIA`)
- `GET /api/admin/blogs` & `POST /api/admin/blogs` — List and create blog posts.
- `PATCH /api/admin/blogs/[id]` & `DELETE /api/admin/blogs/[id]` — Update and delete blog post.
- `GET /api/admin/gallery/folders` & `POST /api/admin/gallery/folders` — Album folders CRUD.
- `PATCH /api/admin/gallery/folders/[id]` & `DELETE /api/admin/gallery/folders/[id]` — Update and delete folder.
- `POST /api/admin/gallery/images` — Attach uploaded images to a folder.
- `DELETE /api/admin/gallery/images/[id]` — Remove individual photo.
- `POST /api/admin/upload` — Upload files to `/public/uploads/{blogs|gallery|resumes}/`.

#### Admin User Management (Role: `ROOT` only)
- `GET /api/admin/users` — List all administrative users.
- `POST /api/admin/users` — Create new user with assigned role (`ROOT`, `MEDIA`, `HR`, `SALES`).
- `PATCH /api/admin/users/[id]` — Update user details, role, or reset password.
- `DELETE /api/admin/users/[id]` — Delete user account (root admin protected against deletion).

#### Dashboard Overview
- `GET /api/admin/dashboard` — Returns system metrics, channel distribution percentages, and recent records.

---

### 6. Database & CLI Commands

```bash
# Push schema changes to the local SQLite database
npx prisma db push

# Re-seed the database with team accounts, jobs, blogs, and gallery folders
node prisma/seed.mjs

# Open visual Prisma Studio database GUI
npx prisma studio

# Generate Prisma Client
npx prisma generate
```

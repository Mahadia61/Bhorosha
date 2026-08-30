# Bhorosha

Bhorosha is a privacy-preserving course and professor feedback platform for CUET (Chittagong University of Engineering & Technology) students and teachers.

## Tech stack

- [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/) for dev server and production builds
- [Tailwind CSS v4](https://tailwindcss.com/) for styling

This frontend currently uses in-memory navigation and demo data. The production
API lives in `../Backend`; connect UI actions to its `/api` endpoints as the
next integration step.

## Getting started

```bash
npm install
npm run dev
```

The dev server starts on `http://localhost:8443` by default (configurable via the `PORT` environment variable).

## Scripts

| Command           | Description                              |
| ------------------ | ----------------------------------------- |
| `npm run dev`       | Start the Vite dev server with hot reload |
| `npm run build`     | Production build to `dist/`               |
| `npm run preview`   | Preview the production build locally      |
| `npm run format`    | Format the codebase with oxfmt            |

## Project structure

```
src/
  App.tsx              # View router (switch over the current `view` state)
  context.tsx           # Global app state: auth role, current view, theme
  types.ts               # Shared TypeScript types (View, Role, etc.)
  components/
    Navbar.tsx            # Role-aware top navigation
    ui.tsx                 # Shared design-system components (Button, Card, etc.)
  content/
    legal.ts               # Terms of Service / Privacy Policy copy
  pages/
    Landing.tsx             # Public marketing landing page
    Auth.tsx                 # Role select, sign up, OTP verify, login, forgot password
    Legal.tsx                 # Terms of Service and Privacy Policy pages
    student/                   # Student dashboard, course detail, reviews, profile
    teacher/                    # Teacher dashboard, feedback, Q&A, profile
    admin/                        # Admin dashboard, users, courses, moderation, analytics, profile
```

## Roles

The app supports three roles, selectable from the demo login screen:

- **Student** — browse courses, write reviews, ask questions
- **Teacher** — view feedback trends, answer student questions
- **Admin** — manage users/courses, moderate content, view analytics

Only students and teachers with an official `@student.cuet.ac.bd` / `@teacher.cuet.ac.bd` email can sign up. Admin accounts are pre-provisioned and have no self-signup flow.

## Deploying

`npm run build` outputs a static site to `dist/` that can be hosted on any static host (Vercel, Netlify, GitHub Pages, Cloudflare Pages, etc.) — no server runtime required.

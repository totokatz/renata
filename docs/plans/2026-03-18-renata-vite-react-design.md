# Renata Nanni — Vite + React Frontend Design

**Date:** 2026-03-18
**Status:** Approved

---

## Context

Convert an existing HTML/Tailwind landing page for artist Renata Nanni into a Vite + React application. The app is a public-only frontend. Images will be hosted on Supabase Storage. More pages (gallery, story, contact) will be added in the future.

---

## Stack

- **Vite** — build tool
- **React** — UI framework
- **Tailwind CSS** — styling (via `@tailwindcss/vite` plugin)
- **React Router DOM v6** — client-side routing for future pages
- **@supabase/supabase-js** — Supabase client for image URLs

---

## Architecture

### File Structure

```
renata-nanni/
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── Footer.jsx
│   │   └── sections/
│   │       ├── HeroSection.jsx
│   │       ├── IntroSection.jsx
│   │       ├── AsymmetricSection1.jsx
│   │       ├── QuoteSection.jsx
│   │       ├── AsymmetricSection2.jsx
│   │       └── StudioSection.jsx
│   ├── lib/
│   │   └── supabase.js
│   ├── pages/
│   │   └── Home.jsx
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── tailwind.config.js
├── vite.config.js
└── package.json
```

### Routing

React Router v6 with `<BrowserRouter>`. Initial route: `/` → `Home`. Stub routes for future pages (`/gallery`, `/story`, `/contact`) can be added to `App.jsx`.

### Tailwind Config

All color tokens, font families, and border radius values from the original HTML are preserved in `tailwind.config.js`. Fonts: `Newsreader` (headline), `Work Sans` (body/label).

### Supabase

`src/lib/supabase.js` exports a configured Supabase client using env vars (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`). Currently images use external URLs as placeholders; Supabase Storage URLs will replace them later.

### Responsiveness

- Mobile-first with Tailwind breakpoints
- `sm:` breakpoint added for small screens (font scaling, reduced padding)
- All existing `md:` grid layouts preserved
- Navbar collapses to hamburger on mobile (already in HTML)

---

## Components

| Component | Responsibility |
|---|---|
| `Navbar` | Fixed top nav, logo, links, mobile hamburger |
| `HeroSection` | Full-screen hero with background image and title |
| `IntroSection` | Centered italic quote + CTA button |
| `AsymmetricSection1` | 8/4 grid — image left, text right |
| `QuoteSection` | Full-width quote on `surface-container-low` background |
| `AsymmetricSection2` | 3/7 grid — text left, image right |
| `StudioSection` | Full-bleed panoramic image with overlay text |
| `Footer` | Logo, nav links, copyright |
| `Home` | Composes all sections |

---

## Data Flow

Static for now. Images are props passed into section components. When Supabase is integrated, `Home.jsx` will fetch image URLs and pass them down.

---

## Out of Scope

- Admin panel / CMS
- Authentication
- Dark mode toggle (CSS is dark-mode ready via `dark:` classes but no toggle needed yet)

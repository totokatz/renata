# Renata Nanni — Vite + React Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Convert the Renata Nanni HTML landing page into a fully responsive Vite + React app with React Router and Supabase client ready for future pages and image integration.

**Architecture:** Single-page React app scaffolded with Vite. The HTML is decomposed into 8 section components composed by a `Home` page. React Router v6 handles navigation. Tailwind CSS replicates all design tokens from the original. Supabase client is wired in `src/lib/supabase.js` using env vars.

**Tech Stack:** Vite, React 18, Tailwind CSS v4 (@tailwindcss/vite), React Router DOM v6, @supabase/supabase-js

---

### Task 1: Scaffold Vite + React project

**Files:**
- Create: `package.json`, `vite.config.js`, `src/main.jsx`, `src/App.jsx`, `src/index.css`

**Step 1: Scaffold project**

Run inside `c:/Users/totot/Documents/Proyectos/Renata`:
```bash
npm create vite@latest . -- --template react
```
When prompted "Current directory is not empty" → select **Ignore files and continue**.
Select framework: **React**, variant: **JavaScript**.

**Step 2: Install dependencies**

```bash
npm install
npm install react-router-dom @supabase/supabase-js
npm install -D tailwindcss @tailwindcss/vite
```

**Step 3: Configure Tailwind in vite.config.js**

Replace contents of `vite.config.js`:
```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
})
```

**Step 4: Set up index.css**

Replace contents of `src/index.css`:
```css
@import "tailwindcss";

@theme {
  --color-surface-container-high: #ebe7e8;
  --color-on-secondary-fixed: #121d22;
  --color-inverse-on-surface: #f3f0f1;
  --color-primary-fixed-dim: #a8caea;
  --color-secondary-fixed-dim: #bcc8cf;
  --color-surface-dim: #dcd9da;
  --color-outline-variant: #c2c7cd;
  --color-on-secondary: #ffffff;
  --color-outline: #72787e;
  --color-on-background: #1c1b1c;
  --color-surface-bright: #fcf8f9;
  --color-secondary-fixed: #d8e4eb;
  --color-primary-container: #063049;
  --color-on-error: #ffffff;
  --color-on-surface: #1c1b1c;
  --color-tertiary-container: #422700;
  --color-surface-container-lowest: #ffffff;
  --color-inverse-primary: #a8caea;
  --color-secondary-container: #d5e1e8;
  --color-primary-fixed: #cce5ff;
  --color-on-tertiary: #ffffff;
  --color-error: #ba1a1a;
  --color-on-secondary-fixed-variant: #3d484e;
  --color-on-tertiary-fixed: #2a1700;
  --color-background: #fcf8f9;
  --color-inverse-surface: #313031;
  --color-on-surface-variant: #42474d;
  --color-surface-container-low: #f6f3f4;
  --color-surface: #fcf8f9;
  --color-tertiary-fixed: #ffddb8;
  --color-tertiary-fixed-dim: #ffb95f;
  --color-on-tertiary-fixed-variant: #653e00;
  --color-on-primary: #ffffff;
  --color-on-primary-fixed: #001e31;
  --color-surface-tint: #40627d;
  --color-surface-variant: #e5e2e3;
  --color-on-primary-container: #7698b6;
  --color-on-tertiary-container: #cf8400;
  --color-error-container: #ffdad6;
  --color-primary: #001a2c;
  --color-tertiary: #261400;
  --color-on-primary-fixed-variant: #274a64;
  --color-on-secondary-container: #59646a;
  --color-secondary: #556066;
  --color-surface-container-highest: #e5e2e3;
  --color-surface-container: #f0edee;
  --color-on-error-container: #93000a;

  --font-headline: "Newsreader", serif;
  --font-body: "Work Sans", sans-serif;
  --font-label: "Work Sans", sans-serif;

  --radius-DEFAULT: 0.25rem;
  --radius-lg: 0.5rem;
  --radius-xl: 0.75rem;
  --radius-full: 9999px;
}

.material-symbols-outlined {
  font-variation-settings: 'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 24;
}

body {
  font-family: 'Work Sans', sans-serif;
  background-color: #fcf8f9;
  color: #1c1b1c;
}
```

**Step 5: Update index.html to add Google Fonts**

Replace `<head>` content in `index.html` (keep `<title>` and viewport meta, add fonts):
```html
<!DOCTYPE html>
<html lang="en" class="scroll-smooth">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Renata Nanni | Water & Silence</title>
    <link href="https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,200..800;1,6..72,200..800&family=Work+Sans:wght@100;200;300;400;500;600&display=swap" rel="stylesheet"/>
    <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet"/>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

**Step 6: Clean up generated boilerplate**

Delete `src/App.css` and `src/assets/react.svg`. Clear `src/App.jsx` to a minimal shell (will be replaced in Task 3).

**Step 7: Verify dev server starts**

```bash
npm run dev
```
Expected: server running at `http://localhost:5173` with no errors.

**Step 8: Commit**

```bash
git init
git add .
git commit -m "feat: scaffold Vite + React with Tailwind, Router, Supabase deps"
```

---

### Task 2: Supabase client

**Files:**
- Create: `src/lib/supabase.js`
- Create: `.env.example`

**Step 1: Create Supabase client**

Create `src/lib/supabase.js`:
```js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

**Step 2: Create .env.example**

Create `.env.example`:
```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

**Step 3: Add .env to .gitignore**

Verify `.gitignore` includes `.env` and `.env.local` (Vite scaffold includes this by default).

**Step 4: Commit**

```bash
git add src/lib/supabase.js .env.example
git commit -m "feat: add Supabase client with env var config"
```

---

### Task 3: App.jsx with React Router

**Files:**
- Modify: `src/main.jsx`
- Create: `src/App.jsx`
- Create: `src/pages/Home.jsx` (stub)

**Step 1: Update main.jsx**

```jsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
```

**Step 2: Create App.jsx with routing**

```jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </BrowserRouter>
  )
}
```

**Step 3: Create stub Home page**

Create `src/pages/Home.jsx`:
```jsx
export default function Home() {
  return <div className="p-8 font-headline text-4xl text-primary">Renata Nanni</div>
}
```

**Step 4: Verify in browser**

Run `npm run dev`. Navigate to `http://localhost:5173`. Should see "Renata Nanni" in Newsreader font, dark color.

**Step 5: Commit**

```bash
git add src/main.jsx src/App.jsx src/pages/Home.jsx
git commit -m "feat: add React Router with Home page stub"
```

---

### Task 4: Navbar component

**Files:**
- Create: `src/components/Navbar.jsx`

**Step 1: Create Navbar**

```jsx
import { Link } from 'react-router-dom'
import { useState } from 'react'

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-white/70 backdrop-blur-md shadow-[0_20px_40px_rgba(0,26,44,0.06)]">
      <div className="flex justify-between items-center w-full px-6 md:px-12 py-4 md:py-6 max-w-[1920px] mx-auto">
        <Link to="/" className="text-xl md:text-2xl font-light tracking-tighter text-slate-900 font-headline">
          Renata Nanni
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center space-x-12">
          <Link to="/" className="text-slate-900 font-medium border-b border-slate-900/20 font-label tracking-widest text-xs uppercase hover:text-slate-900 transition-all duration-700 ease-in-out hover:tracking-[0.2em]">
            Selected Works
          </Link>
          <Link to="/story" className="text-slate-500 font-label tracking-widest text-xs uppercase hover:text-slate-900 transition-all duration-700 ease-in-out hover:tracking-[0.2em]">
            Story
          </Link>
          <Link to="/inquire" className="text-slate-500 font-label tracking-widest text-xs uppercase hover:text-slate-900 transition-all duration-700 ease-in-out hover:tracking-[0.2em]">
            Inquire
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-primary"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span className="material-symbols-outlined">
            {menuOpen ? 'close' : 'menu'}
          </span>
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-md px-6 pb-6 flex flex-col gap-6">
          <Link to="/" onClick={() => setMenuOpen(false)} className="text-slate-900 font-label tracking-widest text-xs uppercase">Selected Works</Link>
          <Link to="/story" onClick={() => setMenuOpen(false)} className="text-slate-500 font-label tracking-widest text-xs uppercase">Story</Link>
          <Link to="/inquire" onClick={() => setMenuOpen(false)} className="text-slate-500 font-label tracking-widest text-xs uppercase">Inquire</Link>
        </div>
      )}
    </nav>
  )
}
```

**Step 2: Add Navbar to Home**

Update `src/pages/Home.jsx`:
```jsx
import Navbar from '../components/Navbar'

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="pt-20">
        <div className="p-8 font-headline text-4xl text-primary">Renata Nanni</div>
      </main>
    </>
  )
}
```

**Step 3: Verify in browser**

Check navbar is fixed, logo shows, desktop links visible, hamburger appears on mobile (resize window < 768px), mobile menu opens/closes.

**Step 4: Commit**

```bash
git add src/components/Navbar.jsx src/pages/Home.jsx
git commit -m "feat: add responsive Navbar with mobile menu"
```

---

### Task 5: HeroSection component

**Files:**
- Create: `src/components/sections/HeroSection.jsx`

**Step 1: Create HeroSection**

```jsx
const HERO_IMAGE = 'https://lh3.googleusercontent.com/aida-public/AB6AXuDPnr6b_xan6sAKV9kA-15uUeMZncyryCnmoLP6S8OR95RlZeuRk-4ze5eCCvoIKq2gqFzGzjWBh0Ix5odJB2VKVNx-XkC98pM402HfItRHpb4UUWJUxBcAO3Dui7WaaMc7E4Glj-msFHjkPgNni3vC9cfguTwGiOodfDrDD99Jbwcs1jBVnQominkuZpDhbcpnuhdswsb2DWNtPiwOyZZ-EKQAj3DyfYuA0pv2LzbpnK6D34OAgnjfOXKe5uWJvVoirUfxt8Rm_OKk'

export default function HeroSection() {
  return (
    <section className="relative h-screen w-full flex items-center justify-center overflow-hidden pt-20">
      <div className="absolute inset-0 z-0 scale-105">
        <img
          src={HERO_IMAGE}
          alt="Contemporary abstract artwork"
          className="w-full h-full object-cover filter brightness-[0.97]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/10 to-background" />
      </div>
      <div className="relative z-10 text-center px-6 max-w-6xl">
        <h1 className="font-headline text-5xl sm:text-6xl md:text-[8rem] lg:text-[10rem] leading-none tracking-tight text-primary">
          The Fluid Geometry <br className="hidden sm:block" /> of Silence
        </h1>
      </div>
    </section>
  )
}
```

**Step 2: Add to Home**

Add `<HeroSection />` inside `<main>` in `Home.jsx`. Remove the placeholder div.

**Step 3: Verify in browser**

Full-screen hero with background image and large headline. Check on mobile: text should scale down to `text-5xl`.

**Step 4: Commit**

```bash
git add src/components/sections/HeroSection.jsx src/pages/Home.jsx
git commit -m "feat: add HeroSection with responsive typography"
```

---

### Task 6: IntroSection component

**Files:**
- Create: `src/components/sections/IntroSection.jsx`

**Step 1: Create IntroSection**

```jsx
export default function IntroSection() {
  return (
    <section className="w-full py-24 md:py-40 lg:py-64 bg-background">
      <div className="max-w-4xl mx-auto px-6 md:px-12 text-center">
        <p className="font-headline text-xl sm:text-2xl md:text-4xl italic text-on-surface-variant leading-relaxed">
          A dialogue between light and matter through the lens of Renata Nanni.
        </p>
        <div className="mt-12 md:mt-20">
          <button className="px-8 md:px-12 py-4 md:py-5 bg-primary text-on-primary font-label tracking-[0.25em] text-xs uppercase transition-all duration-700 ease-in-out hover:bg-primary-container hover:tracking-[0.35em] focus:outline-none">
            Enter the Gallery
          </button>
        </div>
      </div>
    </section>
  )
}
```

**Step 2: Add to Home**

Add `<IntroSection />` after `<HeroSection />` in `Home.jsx`.

**Step 3: Commit**

```bash
git add src/components/sections/IntroSection.jsx src/pages/Home.jsx
git commit -m "feat: add IntroSection"
```

---

### Task 7: AsymmetricSection1 component

**Files:**
- Create: `src/components/sections/AsymmetricSection1.jsx`

**Step 1: Create AsymmetricSection1**

```jsx
const IMAGE_URL = 'https://lh3.googleusercontent.com/aida-public/AB6AXuDTpAsBY6d8ObIQapkzt49QtTWW23nUqPQeMbGxeg07aMJ1qP7QIuk4s6SAwViRzs5HaqiYeF-J3fv5kBcwttIXLuOInXhGvA4GpKOJn2N05L1jAWlPZtKJfMBVXIjgpPCQ3IY5YeDDPCkpPgzU7p1Hav8vRBchTZVGmEe0llaPh9YYPYXqL_61dUXiut7euEP6XQZ0jWoNb3E9MHNuMwCSbA7hhljzpbA-Fuf9O2Q2c2XK7IuZ3R-RxkW5ySvA49VVBDkpJKQMTSAP'

export default function AsymmetricSection1() {
  return (
    <section className="w-full py-16 md:py-40 flex flex-col items-center">
      <div className="w-full max-w-7xl px-6 md:px-12 grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-20 items-center">
        <div className="md:col-span-8 md:col-start-1">
          <img
            src={IMAGE_URL}
            alt="Detailed artwork fragment — close up of textured oil painting strokes"
            className="w-full aspect-[4/5] object-cover shadow-[0_20px_40px_rgba(0,26,44,0.06)]"
          />
        </div>
        <div className="md:col-span-4 md:col-start-9">
          <div className="space-y-6 md:space-y-8">
            <span className="font-label text-[0.65rem] tracking-[0.3em] uppercase text-on-surface-variant">
              The Medium
            </span>
            <h2 className="font-headline text-3xl md:text-4xl text-primary leading-tight">
              Pigment and <br /> Atmospheric Tension
            </h2>
            <p className="font-body text-sm leading-loose text-on-surface-variant/80">
              Renata's process begins in the quiet. By layering translucent glazes, she captures the
              weightless suspension of particles in water, translating physical mass into ethereal presence.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
```

**Step 2: Add to Home**

Add `<AsymmetricSection1 />` after `<IntroSection />` in `Home.jsx`.

**Step 3: Verify responsiveness**

On mobile: image stacks on top, text below. On desktop: 8-col image left, 4-col text right.

**Step 4: Commit**

```bash
git add src/components/sections/AsymmetricSection1.jsx src/pages/Home.jsx
git commit -m "feat: add AsymmetricSection1 with responsive grid"
```

---

### Task 8: QuoteSection component

**Files:**
- Create: `src/components/sections/QuoteSection.jsx`

**Step 1: Create QuoteSection**

```jsx
export default function QuoteSection() {
  return (
    <section className="w-full py-32 md:py-60 bg-surface-container-low">
      <div className="max-w-2xl mx-auto px-6 md:px-12 text-center">
        <h3 className="font-headline text-2xl sm:text-3xl md:text-5xl font-light text-primary leading-snug">
          "Art is the residual salt left after the ocean of thought has receded."
        </h3>
      </div>
    </section>
  )
}
```

**Step 2: Add to Home**

Add `<QuoteSection />` after `<AsymmetricSection1 />` in `Home.jsx`.

**Step 3: Commit**

```bash
git add src/components/sections/QuoteSection.jsx src/pages/Home.jsx
git commit -m "feat: add QuoteSection"
```

---

### Task 9: AsymmetricSection2 component

**Files:**
- Create: `src/components/sections/AsymmetricSection2.jsx`

**Step 1: Create AsymmetricSection2**

```jsx
import { Link } from 'react-router-dom'

const IMAGE_URL = 'https://lh3.googleusercontent.com/aida-public/AB6AXuCKYtx1gR9WwGI4nbnFfH1FeoXFmBAyimEXT7huThULeQBjwYMaYkxGkTOSPRdK01Atgb3QEViON7SeY64FpNqC7S6bOA0Xxtu979BVVd41H8SzzTNT7JkCShHc_7b7cnJgHHZ_cfWBbTQqMEfpaH432QTHrqcR2KVvOggvzrVp1O8nP7SxfS8tQc5nuWFSZs2H4ghyFSdOiDjFlVIRozoLnFYc2VyaS_OC_TRnlw7aaLTcYro1wTCquvbRUDQ_Mf3bL7kE3MOv9-zQ'

export default function AsymmetricSection2() {
  return (
    <section className="w-full py-16 md:py-40 flex flex-col items-center">
      <div className="w-full max-w-7xl px-6 md:px-12 grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-20 items-center">
        {/* Text — order-2 on mobile, order-1 on desktop */}
        <div className="md:col-span-3 md:col-start-2 order-2 md:order-1">
          <div className="space-y-6 md:space-y-8">
            <span className="font-label text-[0.65rem] tracking-[0.3em] uppercase text-on-surface-variant">
              The Collection
            </span>
            <h2 className="font-headline text-3xl md:text-4xl text-primary leading-tight">
              Reflections <br /> on Submergence
            </h2>
            <p className="font-body text-sm leading-loose text-on-surface-variant/80">
              A series exploring the threshold where sight dissolves into feeling. Each piece acts as a
              window into a submerged architecture of memory.
            </p>
            <Link
              to="/gallery"
              className="inline-block font-label text-[0.7rem] tracking-widest uppercase border-b border-primary/20 pb-2 hover:border-primary transition-colors"
            >
              View Series
            </Link>
          </div>
        </div>
        {/* Image — order-1 on mobile, order-2 on desktop */}
        <div className="md:col-span-7 md:col-start-6 order-1 md:order-2">
          <img
            src={IMAGE_URL}
            alt="Large canvas painting in a minimalist white gallery"
            className="w-full aspect-square object-cover shadow-[0_20px_40px_rgba(0,26,44,0.06)]"
          />
        </div>
      </div>
    </section>
  )
}
```

**Step 2: Add to Home**

Add `<AsymmetricSection2 />` after `<QuoteSection />` in `Home.jsx`.

**Step 3: Verify responsiveness**

On mobile: image on top, text below. On desktop: text left (3-col), image right (7-col).

**Step 4: Commit**

```bash
git add src/components/sections/AsymmetricSection2.jsx src/pages/Home.jsx
git commit -m "feat: add AsymmetricSection2 with reversed responsive layout"
```

---

### Task 10: StudioSection component

**Files:**
- Create: `src/components/sections/StudioSection.jsx`

**Step 1: Create StudioSection**

```jsx
const IMAGE_URL = 'https://lh3.googleusercontent.com/aida-public/AB6AXuAer1Fy96bZG5w9fDmllTWCpM0REPpZOaORIOTZde2KGnbLhXw44PIRUUO5hviPd9IEI8KInaG_I3FX8ZxPOu-nFtIYheLL2Bo0HcCI0rAMmZPgzJNh73s8s86zAE3epp-YFCYFH_rIYkZ5AkEjSRZfs7OuMj_EwdilJQPJRzTRP1R0PljHfhJQPJRzTRP1R0PljHfhJwfGSzjYHfbtfhEMX99ATAbBPdRsEiVqqzcLX-9ZeRR1XRULivfRJwKGyoeaXOzzfU2siC-X_aDprOamwgCtrhujj1'

export default function StudioSection() {
  return (
    <section className="w-full py-24 md:py-40">
      <div className="max-w-[1920px] mx-auto px-6 md:px-12">
        <div className="relative w-full aspect-[4/3] sm:aspect-[16/9] md:aspect-[21/9] overflow-hidden">
          <img
            src={IMAGE_URL}
            alt="Modern minimalist sunlit art studio with tall windows"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-primary/5" />
          <div className="absolute bottom-8 left-8 sm:bottom-12 sm:left-12 md:bottom-24 md:left-24 text-white">
            <span className="font-label text-[0.65rem] tracking-[0.4em] uppercase opacity-70">
              The Space
            </span>
            <p className="font-headline text-2xl sm:text-3xl md:text-5xl mt-3 md:mt-4">
              Where silence <br /> finds its form.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
```

**Step 2: Add to Home**

Add `<StudioSection />` after `<AsymmetricSection2 />` in `Home.jsx`.

**Step 3: Commit**

```bash
git add src/components/sections/StudioSection.jsx src/pages/Home.jsx
git commit -m "feat: add StudioSection with responsive panoramic image"
```

---

### Task 11: Footer component

**Files:**
- Create: `src/components/Footer.jsx`

**Step 1: Create Footer**

```jsx
import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="w-full py-12 md:py-20 px-6 md:px-12 mt-24 md:mt-40 bg-[#fcf8f9] flex flex-col md:flex-row justify-between items-center gap-6 md:gap-8 border-t border-slate-200/10">
      <div className="text-base md:text-lg font-bold tracking-widest text-[#1c1b1c] font-label uppercase">
        Renata Nanni
      </div>
      <div className="flex flex-wrap justify-center gap-8 md:gap-10">
        <a
          href="https://instagram.com"
          target="_blank"
          rel="noopener noreferrer"
          className="font-body text-[0.75rem] tracking-[0.15em] font-light text-[#1c1b1c] opacity-60 hover:opacity-100 transition-opacity duration-1000 ease-in-out"
        >
          Instagram
        </a>
        <Link
          to="/privacy"
          className="font-body text-[0.75rem] tracking-[0.15em] font-light text-[#1c1b1c] opacity-60 hover:opacity-100 transition-opacity duration-1000 ease-in-out underline underline-offset-8"
        >
          Privacy
        </Link>
        <Link
          to="/inquire"
          className="font-body text-[0.75rem] tracking-[0.15em] font-light text-[#1c1b1c] opacity-60 hover:opacity-100 transition-opacity duration-1000 ease-in-out"
        >
          Contact
        </Link>
      </div>
      <div className="font-body text-[0.75rem] tracking-[0.15em] font-light text-[#1c1b1c] opacity-40">
        © 2024 Renata Nanni. All Rights Reserved.
      </div>
    </footer>
  )
}
```

**Step 2: Add Footer to Home**

Add `<Footer />` after `</main>` in `Home.jsx`. Final `Home.jsx` structure:

```jsx
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import HeroSection from '../components/sections/HeroSection'
import IntroSection from '../components/sections/IntroSection'
import AsymmetricSection1 from '../components/sections/AsymmetricSection1'
import QuoteSection from '../components/sections/QuoteSection'
import AsymmetricSection2 from '../components/sections/AsymmetricSection2'
import StudioSection from '../components/sections/StudioSection'

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <IntroSection />
        <AsymmetricSection1 />
        <QuoteSection />
        <AsymmetricSection2 />
        <StudioSection />
      </main>
      <Footer />
    </>
  )
}
```

**Step 3: Verify full page in browser**

Scroll through entire page on desktop and mobile. Check all sections render correctly.

**Step 4: Commit**

```bash
git add src/components/Footer.jsx src/pages/Home.jsx
git commit -m "feat: add Footer and complete Home page assembly"
```

---

### Task 12: Final responsive pass

**Files:**
- Modify: any section component that needs adjustment

**Step 1: Test at all breakpoints**

Open browser DevTools. Test at these widths:
- 375px (iPhone SE)
- 390px (iPhone 14)
- 768px (iPad)
- 1024px (iPad landscape)
- 1280px (desktop)
- 1920px (large desktop)

**Step 2: Fix any overflow issues**

Check for horizontal scroll at any breakpoint. If found, add `overflow-x-hidden` to the offending container.

**Step 3: Verify hero text doesn't overflow on small screens**

On 375px the headline should be `text-5xl` (set in Task 5). Adjust if needed.

**Step 4: Final commit**

```bash
git add -A
git commit -m "fix: responsive adjustments across all breakpoints"
```

---

## Notes for Executor

- The Tailwind v4 `@theme` block in `index.css` replaces `tailwind.config.js` for custom tokens — do NOT create a separate `tailwind.config.js`.
- Image URLs are temporary placeholders (from the original HTML). They'll be replaced with Supabase Storage URLs in a future task.
- The Supabase client in `src/lib/supabase.js` won't work until `.env` is populated, but it won't break the app since it's not called yet.
- The `StudioSection` image URL in Task 10 may be broken (the original HTML URL had a duplication). If the image doesn't load, use a placeholder from `https://picsum.photos/1920/820` temporarily.

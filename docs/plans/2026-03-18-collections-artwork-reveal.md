# Collections Artwork Reveal Animation Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace the generic `reveal-up` CSS animation on artwork cards in Collections with an elegant Framer Motion curtain reveal (clip-path + scale stagger).

**Architecture:** `ArtworkGrid` becomes a Framer Motion stagger container; each `ArtworkCard` uses `whileInView` with clip-path curtain + simultaneous image scale. Titles below the image fade in with a delay. The existing IntersectionObserver is kept for section-level elements (headers, ghost numbers).

**Tech Stack:** React, Framer Motion (already installed), Tailwind CSS

---

### Task 1: Add Framer Motion variants to `ArtworkCard`

**Files:**
- Modify: `src/pages/Collections.jsx` — `ArtworkCard` function (lines 256–300)

**Step 1: Define variants outside the component**

Add these variant objects just above the `ArtworkCard` function definition (after line 254):

```js
const cardVariants = {
  hidden: {
    clipPath: 'inset(100% 0 0 0)',
  },
  visible: {
    clipPath: 'inset(0% 0 0 0)',
    transition: {
      duration: 0.85,
      ease: [0.76, 0, 0.24, 1],
    },
  },
}

const imageVariants = {
  hidden: { scale: 1.12 },
  visible: {
    scale: 1.08,
    transition: {
      duration: 1.1,
      ease: [0.22, 1, 0.36, 1],
    },
  },
}

const titleVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      delay: 0.6,
      ease: [0.22, 1, 0.36, 1],
    },
  },
}
```

**Step 2: Update `ArtworkCard` to use `motion` components**

Replace the entire `ArtworkCard` function with:

```jsx
function ArtworkCard({ artwork, aspect }) {
  return (
    <motion.div variants={cardVariants}>
      {/* Image container */}
      <div className={`parallax-container ${aspect} bg-surface-container-low relative overflow-hidden`}>
        <motion.img
          src={artwork.image}
          alt={artwork.title}
          className="artwork-img w-full h-full object-cover"
          variants={imageVariants}
        />

        {/* Hover overlay — gradient fade */}
        <div className="artwork-overlay absolute inset-0 bg-gradient-to-t from-primary/85 via-primary/20 to-transparent flex flex-col justify-end p-6 md:p-8">
          <div className="artwork-info">
            <p className="font-label text-[10px] uppercase tracking-[0.3em] text-on-primary mb-1">
              {artwork.title}
            </p>
            {artwork.medium && (
              <p className="font-body text-xs text-on-primary/60 italic">
                {artwork.medium}
              </p>
            )}
            <span className="mt-4 inline-flex items-center gap-2 text-on-primary/70 font-label text-[10px] uppercase tracking-widest">
              Ver obra
              <span className="material-symbols-outlined text-sm">arrow_right_alt</span>
            </span>
          </div>
        </div>
      </div>

      {/* Title below image */}
      <motion.div className="mt-5" variants={titleVariants}>
        <p className="font-label text-[10px] uppercase tracking-[0.25em] text-on-surface">
          {artwork.title}
        </p>
        {artwork.medium && (
          <p className="font-body text-[11px] text-outline mt-1 italic">{artwork.medium}</p>
        )}
      </motion.div>
    </motion.div>
  )
}
```

Note: `delay` prop removed from `ArtworkCard` — stagger is now handled by the parent container.

**Step 3: Verify the component compiles**

Run: `npm run dev`
Expected: dev server starts with no errors in terminal.

---

### Task 2: Add stagger container to `ArtworkGrid`

**Files:**
- Modify: `src/pages/Collections.jsx` — `ArtworkGrid` function (lines 208–252)

**Step 1: Define the container variants**

Add just above the `ArtworkGrid` function (after line 206):

```js
const gridVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.09,
      delayChildren: 0.05,
    },
  },
}
```

**Step 2: Replace the grid `div` with a `motion.div`**

In `ArtworkGrid`, replace:
```jsx
<div className="grid grid-cols-1 md:grid-cols-12 gap-5 md:gap-7">
```
with:
```jsx
<motion.div
  className="grid grid-cols-1 md:grid-cols-12 gap-5 md:gap-7"
  variants={gridVariants}
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true, amount: 0.15 }}
>
```

And close it with `</motion.div>` instead of `</div>`.

**Step 3: Update `ArtworkCard` call — remove `delay` prop**

In `ArtworkGrid`, the `ArtworkCard` call currently passes `delay={delays[i]}`. Since stagger is now handled by the container, remove that prop:

Change:
```jsx
<ArtworkCard artwork={artwork} aspect={aspects[i]} delay={delays[i]} />
```
to:
```jsx
<ArtworkCard artwork={artwork} aspect={aspects[i]} />
```

Also remove the `delays` array (it's no longer needed):
```js
// DELETE this line:
const delays = [0, 140, 280, 420]
```

**Step 4: Add `motion` import**

At the top of `Collections.jsx`, ensure Framer Motion is imported:

```js
import { motion } from 'framer-motion'
```

**Step 5: Verify visually**

Open `http://localhost:5173/collections` in browser. Scroll down to the artwork grid. Each of the 4 artworks should reveal with the curtain effect, staggered 90ms apart.

Expected:
- Cards lift up from behind like a curtain being raised
- Images have a subtle scale-down as they appear
- Titles below fade in ~0.6s after the card starts revealing
- No console errors

**Step 6: Commit**

```bash
git add src/pages/Collections.jsx
git commit -m "feat: elegant curtain reveal animation for collection artworks"
```

---

### Task 3: Clean up unused CSS

**Files:**
- Modify: `src/index.css`

**Step 1: Verify `.reveal-up` is no longer used on artwork cards**

Check that no `.reveal-up` class remains on `ArtworkCard` elements. The class is still used on section headers in `CollectionSection` (lines ~153, 168, 177, 193) — those must be kept.

**Step 2: No CSS removal needed**

`.reveal-up`, `.reveal-clip`, `.reveal-ghost` in `index.css` are still used by the section headers and ghost numbers via the IntersectionObserver. Leave them as-is.

**Step 3: Verify `artwork-img` CSS rule still applies**

The CSS rule `.collection-artwork .artwork-img` (hover scale) and `.collection-artwork .artwork-overlay` (hover fade) still work because the `Link` element retains the `collection-artwork` class. Confirm hover still shows the overlay correctly in the browser.

**Step 4: Commit if any changes were made**

```bash
git add src/index.css
git commit -m "chore: remove unused reveal-up from artwork cards"
```

---

### Task 4: Final visual QA

**Step 1: Check both collection sections**

Navigate to `/collections`. Both collection grids (normal and flipped layout) should animate correctly.

**Step 2: Check `prefers-reduced-motion`**

Framer Motion automatically respects `prefers-reduced-motion: reduce` — no extra work needed. Verify by enabling it in DevTools (Rendering panel → Emulate CSS media feature) and confirming cards appear instantly without animation.

**Step 3: Check mobile**

Resize to mobile viewport. Cards should still appear (no layout breakage), animations may be less pronounced due to smaller scroll distances — that's acceptable.

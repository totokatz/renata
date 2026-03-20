# Sección "Diseño" — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build an immersive "Diseño" section with index page + scroll-takeover case study detail pages for Renata Nanni's design/industrial projects.

**Architecture:** Two new routes (`/diseño` index, `/diseño/:slug` detail). Flexible data model where each project defines its own sections array. Detail page renders section components (hero, showcase, split, fullbleed, grid, text) each with unique scroll-driven animations. Index page uses same 12-col asymmetric grid system as Collections.

**Tech Stack:** React, React Router v6, Framer Motion (useScroll, useTransform, useInView), Tailwind CSS v4, CSS clip-path animations, IntersectionObserver.

---

## Task 1: Data layer + routing scaffold

**Files:**
- Create: `src/data/designProjects.js`
- Modify: `src/App.jsx`
- Modify: `src/components/Navbar.jsx`

**Step 1: Create the data file with one placeholder project**

Create `src/data/designProjects.js`:

```js
// Placeholder images — replace with real renders when available
const placeholder = '/images/placeholder.jpg'

export const designProjects = [
  {
    slug: 'fast-green',
    title: 'Fast Green',
    subtitle: 'Comida rápida saludable',
    type: 'Diseño de productos',
    date: 'Junio 2024',
    description:
      'Fast Green es una propuesta de un carrito ambulante, ofertando a la oferta de comida rápida saludable. Presenta un trabajo de desarrollo comercial sustentable en un producto funcional y moderno.',
    cover: placeholder,
    sections: [
      { type: 'hero', image: placeholder },
      {
        type: 'text',
        content:
          'Fast Green es una propuesta de un carrito ambulante, ofertando a la oferta de comida rápida saludable. Presenta un trabajo de desarrollo comercial sustentable en un producto funcional, adaptado para la producción de comida saludable.',
      },
      {
        type: 'split',
        image: placeholder,
        text: 'El diseño del carrito contempla la experiencia completa del usuario, desde la aproximación visual hasta la interacción con los productos ofrecidos.',
        direction: 'left',
      },
      {
        type: 'showcase',
        images: [placeholder, placeholder, placeholder, placeholder],
      },
      { type: 'fullbleed', image: placeholder, caption: 'Semántica' },
      {
        type: 'grid',
        images: [placeholder, placeholder, placeholder],
        columns: 3,
      },
      {
        type: 'split',
        image: placeholder,
        text: 'El desarrollo tecnológico del producto permite su fabricación en serie manteniendo la calidad artesanal del diseño original.',
        direction: 'right',
      },
    ],
  },
]
```

**Step 2: Add routes to App.jsx**

In `src/App.jsx`, add imports and routes. After the existing imports (line 6), add:

```js
import Design from './pages/Design'
import DesignProject from './pages/DesignProject'
```

Inside the `<Routes>` block (after the `/artwork/:id` route at line 24), add:

```jsx
<Route path="/diseño" element={<Design />} />
<Route path="/diseño/:slug" element={<DesignProject />} />
```

**Step 3: Add "Diseño" link to Navbar**

In `src/components/Navbar.jsx`, update the `links` array (line 5-9) to include the new page:

```js
const links = [
  { to: '/', label: 'Obras Selectas' },
  { to: '/collections', label: 'Colecciones' },
  { to: '/diseño', label: 'Diseño' },
  { to: '/inquire', label: 'Consultar' },
]
```

Then add an `isDesign` check alongside the existing `isHome`/`isCollections` checks (line 16):

```js
const isDesign = pathname === '/diseño' || pathname.startsWith('/diseño/')
```

Add a desktop nav link for Diseño after the Colecciones link (after line 62), following the same pattern as the existing links but using `isDesign` for the active state.

**Step 4: Create stub pages so routing works**

Create `src/pages/Design.jsx`:

```jsx
import { motion } from 'framer-motion'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export default function Design() {
  return (
    <>
      <Navbar />
      <motion.main
        className="pt-40 pb-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { duration: 0.5, ease: 'easeOut' } }}
        exit={{ opacity: 0, transition: { duration: 0.2, ease: 'easeIn' } }}
      >
        <header className="px-6 md:px-12 max-w-[1920px] mx-auto mb-32">
          <h1 className="font-headline text-6xl md:text-8xl font-light leading-[1.05] tracking-tight">
            Dise<br />
            <span className="italic pl-12 md:pl-24">ño</span>
          </h1>
        </header>
      </motion.main>
      <Footer />
    </>
  )
}
```

Create `src/pages/DesignProject.jsx`:

```jsx
import { useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { designProjects } from '../data/designProjects'

export default function DesignProject() {
  const { slug } = useParams()
  const project = designProjects.find((p) => p.slug === slug)

  if (!project) return <div>Proyecto no encontrado</div>

  return (
    <>
      <Navbar />
      <motion.main
        className="pt-40 pb-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { duration: 0.5, ease: 'easeOut' } }}
        exit={{ opacity: 0, transition: { duration: 0.2, ease: 'easeIn' } }}
      >
        <h1 className="px-6 md:px-12 font-headline text-5xl font-light">{project.title}</h1>
        <p className="px-6 md:px-12 mt-4 text-outline">{project.subtitle}</p>
      </motion.main>
      <Footer />
    </>
  )
}
```

**Step 5: Verify the app compiles and routes work**

Run: `npm run dev`
- Navigate to `/diseño` — should see the "Diseño" header
- Navigate to `/diseño/fast-green` — should see "Fast Green" title
- Navbar should show "Diseño" link with correct active state

**Step 6: Commit**

```bash
git add src/data/designProjects.js src/pages/Design.jsx src/pages/DesignProject.jsx src/App.jsx src/components/Navbar.jsx
git commit -m "feat: scaffold design section with routes, data layer, and stub pages"
```

---

## Task 2: Section Divider component

**Files:**
- Create: `src/components/design/SectionDivider.jsx`

**Step 1: Create the animated divider**

This component renders a thin line that grows from center to edges on viewport entry.

```jsx
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

export default function SectionDivider() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-50px' })

  return (
    <div ref={ref} className="py-16 md:py-24 max-w-[1920px] mx-auto px-6 md:px-12">
      <motion.div
        className="h-px bg-outline-variant/20"
        initial={{ scaleX: 0 }}
        animate={inView ? { scaleX: 1 } : { scaleX: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        style={{ transformOrigin: 'center' }}
      />
    </div>
  )
}
```

**Step 2: Verify it renders**

Temporarily import and render in Design.jsx stub to confirm the animation works.

**Step 3: Commit**

```bash
git add src/components/design/SectionDivider.jsx
git commit -m "feat: add animated section divider component"
```

---

## Task 3: HeroSection component (scroll-driven dramatic entry)

**Files:**
- Create: `src/components/design/HeroSection.jsx`

**Step 1: Build the hero with scroll-driven scale + desaturation**

The image starts at 60% scale and fully desaturated. As the user scrolls, it grows to full-screen and gains color. The title reveals with a diagonal clip-path mask.

```jsx
import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

export default function HeroSection({ image, title, subtitle }) {
  const containerRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  })

  // Image: scale 0.6 → 1.0
  const scale = useTransform(scrollYProgress, [0, 0.6], [0.6, 1])
  // Desaturation: grayscale(100%) → grayscale(0%)
  const grayscale = useTransform(scrollYProgress, [0, 0.6], [100, 0])
  // Title clip-path: diagonal wipe
  const clipProgress = useTransform(scrollYProgress, [0.1, 0.5], [0, 100])

  return (
    <section ref={containerRef} className="relative h-[150vh]">
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center">
        {/* Background image with scale + grayscale driven by scroll */}
        <motion.div
          className="absolute inset-0"
          style={{ scale }}
        >
          <motion.img
            src={image}
            alt={title || ''}
            className="w-full h-full object-cover"
            style={{
              filter: useTransform(grayscale, (v) => `grayscale(${v}%)`),
            }}
          />
          {/* Subtle overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/10" />
        </motion.div>

        {/* Title with diagonal clip-path reveal */}
        {title && (
          <div className="relative z-10 text-center px-6">
            <motion.h1
              className="font-headline text-5xl md:text-8xl lg:text-9xl font-light text-white tracking-tight"
              style={{
                clipPath: useTransform(
                  clipProgress,
                  (v) => `polygon(0 0, ${v}% 0, ${v}% 100%, 0 100%)`
                ),
              }}
            >
              {title}
            </motion.h1>
            {subtitle && (
              <motion.p
                className="font-headline italic text-lg md:text-2xl text-white/70 mt-4 font-light"
                style={{
                  clipPath: useTransform(
                    clipProgress,
                    (v) => `polygon(0 0, ${Math.max(0, v - 15)}% 0, ${Math.max(0, v - 15)}% 100%, 0 100%)`
                  ),
                }}
              >
                {subtitle}
              </motion.p>
            )}
          </div>
        )}
      </div>
    </section>
  )
}
```

**Step 2: Wire into DesignProject.jsx**

Import and render HeroSection when `section.type === 'hero'`.

**Step 3: Verify scroll animation works**

Navigate to `/diseño/fast-green`. The hero image should start small and grayscale, then grow and colorize as you scroll.

**Step 4: Commit**

```bash
git add src/components/design/HeroSection.jsx src/pages/DesignProject.jsx
git commit -m "feat: add immersive hero section with scroll-driven scale and desaturation"
```

---

## Task 4: TextSection component (kinetic typography)

**Files:**
- Create: `src/components/design/TextSection.jsx`

**Step 1: Build the word-by-word reveal**

Each word starts at `opacity: 0.15` and transitions to `1.0` as the section scrolls through the viewport. Creates a "guided reading" effect.

```jsx
import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

function Word({ word, progress, range }) {
  const opacity = useTransform(progress, range, [0.15, 1])
  return (
    <motion.span className="inline-block mr-[0.3em]" style={{ opacity }}>
      {word}
    </motion.span>
  )
}

export default function TextSection({ content }) {
  const containerRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 0.8', 'end 0.4'],
  })

  const words = content.split(' ')

  return (
    <section ref={containerRef} className="px-6 md:px-12 max-w-[1920px] mx-auto">
      <p
        className="font-headline text-2xl md:text-4xl lg:text-5xl font-light leading-relaxed text-primary max-w-5xl"
      >
        {words.map((word, i) => {
          const start = i / words.length
          const end = start + 1 / words.length
          return (
            <Word
              key={`${word}-${i}`}
              word={word}
              progress={scrollYProgress}
              range={[start, end]}
            />
          )
        })}
      </p>
    </section>
  )
}
```

**Step 2: Wire into DesignProject.jsx section renderer**

**Step 3: Verify the word-by-word reveal animates on scroll**

**Step 4: Commit**

```bash
git add src/components/design/TextSection.jsx src/pages/DesignProject.jsx
git commit -m "feat: add kinetic typography section with scroll-driven word reveal"
```

---

## Task 5: SplitSection component (parallax multilayer)

**Files:**
- Create: `src/components/design/SplitSection.jsx`

**Step 1: Build the split layout with clip-path wipe + parallax**

Image enters with horizontal clip-path wipe, moves slower than text for depth effect.

```jsx
import { useRef } from 'react'
import { motion, useScroll, useTransform, useInView } from 'framer-motion'

const ease = [0.22, 1, 0.36, 1]

export default function SplitSection({ image, text, direction = 'left' }) {
  const containerRef = useRef(null)
  const inView = useInView(containerRef, { once: true, margin: '-100px' })

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  })

  // Parallax: image moves slower than natural scroll
  const imageY = useTransform(scrollYProgress, [0, 1], [40, -40])
  // Text moves slightly faster
  const textY = useTransform(scrollYProgress, [0, 1], [80, -80])

  const isLeft = direction === 'left'

  // Clip-path: wipe from the direction side
  const clipFrom = isLeft ? 'inset(0 100% 0 0)' : 'inset(0 0 0 100%)'
  const clipTo = 'inset(0 0% 0 0%)'

  return (
    <section
      ref={containerRef}
      className="px-6 md:px-12 max-w-[1920px] mx-auto"
    >
      <div className={`grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center ${
        isLeft ? '' : 'md:[direction:rtl]'
      }`}>
        {/* Image side */}
        <motion.div
          className="relative aspect-[4/5] overflow-hidden bg-surface-container-low md:[direction:ltr]"
          style={{ y: imageY }}
        >
          <motion.div
            className="w-full h-full"
            initial={{ clipPath: clipFrom }}
            animate={inView ? { clipPath: clipTo } : { clipPath: clipFrom }}
            transition={{ duration: 0.9, ease }}
          >
            <img
              src={image}
              alt=""
              className="w-full h-full object-cover scale-105"
            />
          </motion.div>
        </motion.div>

        {/* Text side */}
        <motion.div
          className="flex flex-col justify-center md:[direction:ltr]"
          style={{ y: textY }}
        >
          <motion.p
            className="font-headline text-xl md:text-2xl font-light leading-relaxed text-on-surface-variant italic"
            initial={{ opacity: 0, y: 40 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease, delay: 0.3 }}
          >
            {text}
          </motion.p>
        </motion.div>
      </div>
    </section>
  )
}
```

**Step 2: Wire into DesignProject.jsx**

**Step 3: Verify parallax depth and clip-path wipe work**

**Step 4: Commit**

```bash
git add src/components/design/SplitSection.jsx src/pages/DesignProject.jsx
git commit -m "feat: add split section with parallax multilayer and clip-path wipe"
```

---

## Task 6: ShowcaseSection component (scroll takeover)

**Files:**
- Create: `src/components/design/ShowcaseSection.jsx`

**Step 1: Build the sticky showcase with scroll-driven crossfade**

This is the centerpiece. A sticky container that crossfades between images as the user scrolls. Each image gets ~100vh of scroll distance.

```jsx
import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

export default function ShowcaseSection({ images }) {
  const containerRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  })

  const count = images.length

  return (
    <section
      ref={containerRef}
      className="relative"
      style={{ height: `${count * 100}vh` }}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {images.map((src, i) => {
          // Each image fades in and out within its scroll segment
          const segStart = i / count
          const segEnd = (i + 1) / count
          const fadeIn = i === 0 ? 0 : segStart
          const fadeOut = i === count - 1 ? 1 : segEnd

          return (
            <ShowcaseImage
              key={i}
              src={src}
              index={i}
              progress={scrollYProgress}
              fadeIn={fadeIn}
              fadeOut={fadeOut}
              isFirst={i === 0}
              isLast={i === count - 1}
            />
          )
        })}

        {/* Counter */}
        <Counter progress={scrollYProgress} count={count} />
      </div>
    </section>
  )
}

function ShowcaseImage({ src, progress, fadeIn, fadeOut, isFirst, isLast }) {
  // Opacity: fade in at segment start, fade out at segment end
  const opacity = useTransform(
    progress,
    isFirst
      ? [fadeIn, fadeOut - 0.05, fadeOut]
      : isLast
        ? [fadeIn - 0.05, fadeIn, fadeOut]
        : [fadeIn - 0.05, fadeIn, fadeOut - 0.05, fadeOut],
    isFirst
      ? [1, 1, 0]
      : isLast
        ? [0, 1, 1]
        : [0, 1, 1, 0]
  )

  // Subtle scale: 1.0 → 1.05 during visibility
  const scale = useTransform(
    progress,
    [fadeIn, fadeOut],
    [1.0, 1.05]
  )

  return (
    <motion.div
      className="absolute inset-0"
      style={{ opacity }}
    >
      <motion.img
        src={src}
        alt=""
        className="w-full h-full object-cover"
        style={{ scale }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
    </motion.div>
  )
}

function Counter({ progress, count }) {
  // Determine current image index from scroll progress
  const currentIndex = useTransform(progress, (v) =>
    Math.min(Math.floor(v * count), count - 1)
  )

  return (
    <div className="absolute bottom-12 right-12 z-10 flex items-baseline gap-1">
      <motion.span className="font-label text-sm text-white/90 tracking-widest">
        {/* Will update reactively */}
        <CounterNumber progress={progress} count={count} />
      </motion.span>
      <span className="font-label text-xs text-white/50 tracking-widest">
        / {String(count).padStart(2, '0')}
      </span>
    </div>
  )
}

function CounterNumber({ progress, count }) {
  const display = useTransform(progress, (v) => {
    const idx = Math.min(Math.floor(v * count), count - 1)
    return String(idx + 1).padStart(2, '0')
  })

  return <motion.span>{display}</motion.span>
}
```

**Step 2: Wire into DesignProject.jsx**

**Step 3: Verify the sticky scroll takeover works**

Scroll through the showcase section — images should crossfade, counter should update, and after the last image the page should continue scrolling normally.

**Step 4: Commit**

```bash
git add src/components/design/ShowcaseSection.jsx src/pages/DesignProject.jsx
git commit -m "feat: add scroll takeover showcase section with crossfade and counter"
```

---

## Task 7: FullbleedSection component

**Files:**
- Create: `src/components/design/FullbleedSection.jsx`

**Step 1: Build fullbleed image with parallax + letter-by-letter caption**

```jsx
import { useRef } from 'react'
import { motion, useScroll, useTransform, useInView } from 'framer-motion'

export default function FullbleedSection({ image, caption }) {
  const containerRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  })

  const y = useTransform(scrollYProgress, [0, 1], [-40, 40])

  return (
    <section ref={containerRef} className="relative w-full overflow-hidden">
      {/* Full-width image with parallax */}
      <div className="relative h-[70vh] md:h-[85vh] overflow-hidden">
        <motion.img
          src={image}
          alt={caption || ''}
          className="w-full h-full object-cover scale-110"
          style={{ y }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
      </div>

      {/* Caption with letter-by-letter reveal */}
      {caption && (
        <div className="px-6 md:px-12 max-w-[1920px] mx-auto mt-8">
          <LetterReveal text={caption} />
        </div>
      )}
    </section>
  )
}

function LetterReveal({ text }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-50px' })

  const letters = text.split('')

  return (
    <h3
      ref={ref}
      className="font-headline text-3xl md:text-5xl font-light text-primary tracking-tight"
    >
      {letters.map((letter, i) => (
        <motion.span
          key={i}
          className="inline-block"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{
            duration: 0.4,
            ease: [0.22, 1, 0.36, 1],
            delay: i * 0.03,
          }}
        >
          {letter === ' ' ? '\u00A0' : letter}
        </motion.span>
      ))}
    </h3>
  )
}
```

**Step 2: Wire into DesignProject.jsx**

**Step 3: Verify parallax and letter animation**

**Step 4: Commit**

```bash
git add src/components/design/FullbleedSection.jsx src/pages/DesignProject.jsx
git commit -m "feat: add fullbleed section with parallax and letter-by-letter caption reveal"
```

---

## Task 8: GridSection component (staggered iris reveal)

**Files:**
- Create: `src/components/design/GridSection.jsx`

**Step 1: Build the grid with clip-path circle reveal + stagger**

```jsx
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12 },
  },
}

const itemVariants = {
  hidden: {
    clipPath: 'circle(0% at 50% 50%)',
    opacity: 0,
  },
  visible: {
    clipPath: 'circle(100% at 50% 50%)',
    opacity: 1,
    transition: {
      clipPath: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
      opacity: { duration: 0.4 },
    },
  },
}

export default function GridSection({ images, columns = 3 }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  const colClass =
    columns === 2
      ? 'grid-cols-1 md:grid-cols-2'
      : columns === 4
        ? 'grid-cols-2 md:grid-cols-4'
        : 'grid-cols-1 md:grid-cols-3'

  return (
    <section ref={ref} className="px-6 md:px-12 max-w-[1920px] mx-auto">
      <motion.div
        className={`grid ${colClass} gap-4 md:gap-6`}
        variants={containerVariants}
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
      >
        {images.map((src, i) => (
          <motion.div
            key={i}
            className="relative aspect-square overflow-hidden bg-surface-container-low group"
            variants={itemVariants}
          >
            <img
              src={src}
              alt=""
              className="w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03]"
            />
          </motion.div>
        ))}
      </motion.div>
    </section>
  )
}
```

**Step 2: Wire into DesignProject.jsx**

**Step 3: Verify staggered iris reveal + hover scale**

**Step 4: Commit**

```bash
git add src/components/design/GridSection.jsx src/pages/DesignProject.jsx
git commit -m "feat: add grid section with staggered iris clip-path reveal"
```

---

## Task 9: DesignProject.jsx — full section renderer + navigation

**Files:**
- Modify: `src/pages/DesignProject.jsx`

**Step 1: Build the complete section renderer**

Replace the stub `DesignProject.jsx` with the full implementation that maps `project.sections` to components and adds prev/next navigation:

```jsx
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { designProjects } from '../data/designProjects'

import HeroSection from '../components/design/HeroSection'
import TextSection from '../components/design/TextSection'
import SplitSection from '../components/design/SplitSection'
import ShowcaseSection from '../components/design/ShowcaseSection'
import FullbleedSection from '../components/design/FullbleedSection'
import GridSection from '../components/design/GridSection'
import SectionDivider from '../components/design/SectionDivider'

const ease = [0.22, 1, 0.36, 1]

const sectionComponents = {
  hero: HeroSection,
  text: TextSection,
  split: SplitSection,
  showcase: ShowcaseSection,
  fullbleed: FullbleedSection,
  grid: GridSection,
}

export default function DesignProject() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const project = designProjects.find((p) => p.slug === slug)
  const projectIndex = designProjects.findIndex((p) => p.slug === slug)
  const prevProject = projectIndex > 0 ? designProjects[projectIndex - 1] : null
  const nextProject = projectIndex < designProjects.length - 1 ? designProjects[projectIndex + 1] : null

  const cursorRef = useRef(null)
  const cursorHalf = useRef(16)

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [slug])

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${e.clientX - cursorHalf.current}px, ${e.clientY - cursorHalf.current}px, 0)`
      }
    }
    document.addEventListener('mousemove', handleMouseMove)
    return () => document.removeEventListener('mousemove', handleMouseMove)
  }, [])

  if (!project) return <div>Proyecto no encontrado</div>

  return (
    <>
      <Navbar />

      <motion.main
        className="pb-20 overflow-x-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { duration: 0.5, ease: 'easeOut' } }}
        exit={{ opacity: 0, transition: { duration: 0.2, ease: 'easeIn' } }}
      >
        {/* Project info bar */}
        <div className="pt-32 pb-8 px-6 md:px-12 max-w-[1920px] mx-auto flex flex-wrap items-baseline gap-x-8 gap-y-2">
          <span className="font-label text-[10px] uppercase tracking-[0.35em] text-outline">
            {project.type}
          </span>
          <span className="font-label text-[10px] uppercase tracking-[0.35em] text-outline">
            {project.date}
          </span>
        </div>

        {/* Sections */}
        <div className="space-y-24 md:space-y-40">
          {project.sections.map((section, i) => {
            const Component = sectionComponents[section.type]
            if (!Component) return null
            return (
              <div key={i}>
                <Component {...section} title={section.type === 'hero' ? project.title : undefined} subtitle={section.type === 'hero' ? project.subtitle : undefined} />
                {i < project.sections.length - 1 && section.type !== 'hero' && <SectionDivider />}
              </div>
            )
          })}
        </div>

        {/* Prev / Next navigation */}
        <nav className="mt-32 md:mt-48 px-6 md:px-12 max-w-[1920px] mx-auto border-t border-outline-variant/20 pt-12 flex justify-between items-center">
          {prevProject ? (
            <Link
              to={`/diseño/${prevProject.slug}`}
              className="group flex items-center gap-4 text-primary transition-all duration-700"
            >
              <span className="material-symbols-outlined transition-transform group-hover:-translate-x-2">arrow_left_alt</span>
              <div>
                <span className="font-label text-[9px] uppercase tracking-[0.4em] text-outline block">Anterior</span>
                <span className="font-headline text-lg font-light">{prevProject.title}</span>
              </div>
            </Link>
          ) : <div />}

          {nextProject ? (
            <Link
              to={`/diseño/${nextProject.slug}`}
              className="group flex items-center gap-4 text-primary transition-all duration-700 text-right"
            >
              <div>
                <span className="font-label text-[9px] uppercase tracking-[0.4em] text-outline block">Siguiente</span>
                <span className="font-headline text-lg font-light">{nextProject.title}</span>
              </div>
              <span className="material-symbols-outlined transition-transform group-hover:translate-x-2">arrow_right_alt</span>
            </Link>
          ) : <div />}
        </nav>

        {/* Back to index */}
        <div className="mt-12 px-6 md:px-12 max-w-[1920px] mx-auto">
          <Link
            to="/diseño"
            className="group inline-flex items-center gap-4 text-primary transition-all duration-700"
          >
            <span className="material-symbols-outlined transition-transform group-hover:-translate-x-2">arrow_left_alt</span>
            <span className="font-label text-[10px] uppercase tracking-[0.4em]">Todos los proyectos</span>
          </Link>
        </div>
      </motion.main>

      <Footer />

      {/* Custom cursor */}
      <div
        ref={cursorRef}
        className="custom-cursor fixed top-0 left-0 w-8 h-8 border border-primary/20 rounded-full pointer-events-none z-[100] hidden md:block mix-blend-difference"
      />
    </>
  )
}
```

**Step 2: Verify all section types render correctly in sequence**

Navigate to `/diseño/fast-green` and scroll through the full case study.

**Step 3: Commit**

```bash
git add src/pages/DesignProject.jsx
git commit -m "feat: complete design project detail page with section renderer and navigation"
```

---

## Task 10: Design.jsx — full index page with asymmetric grid + cursor hover

**Files:**
- Modify: `src/pages/Design.jsx`

**Step 1: Build the full index page**

Replace the stub with the complete implementation: editorial header, asymmetric card grid, ghost numbers, parallax, cursor-following clip-path hover effect.

```jsx
import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { designProjects } from '../data/designProjects'

const gridVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.14, delayChildren: 0.08 },
  },
}

const cardVariants = {
  hidden: { opacity: 0, y: 60 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 50, damping: 18, mass: 1 },
  },
}

// Repeating col-span pattern for asymmetric layout
const colPatterns = [
  'md:col-start-1 md:col-span-7',
  'md:col-start-9 md:col-span-4',
  'md:col-start-2 md:col-span-5',
  'md:col-start-7 md:col-span-6',
]

export default function Design() {
  const cursorRef = useRef(null)
  const cursorHalf = useRef(16)

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${e.clientX - cursorHalf.current}px, ${e.clientY - cursorHalf.current}px, 0)`
      }
    }
    document.addEventListener('mousemove', handleMouseMove)

    // Parallax for ghost numbers
    const handleScroll = () => {
      document.querySelectorAll('.ghost-number').forEach((ghost) => {
        const rect = ghost.getBoundingClientRect()
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          const offset = (window.innerHeight / 2 - rect.top) * 0.14
          ghost.style.transform = `translateY(${offset}px)`
        }
      })
    }
    window.addEventListener('scroll', handleScroll, { passive: true })

    // Cursor expansion on card hover
    const items = document.querySelectorAll('.design-card')
    items.forEach((item) => {
      item.addEventListener('mouseenter', () => {
        cursorHalf.current = 40
        if (cursorRef.current) {
          cursorRef.current.style.width = '80px'
          cursorRef.current.style.height = '80px'
        }
      })
      item.addEventListener('mouseleave', () => {
        cursorHalf.current = 16
        if (cursorRef.current) {
          cursorRef.current.style.width = '32px'
          cursorRef.current.style.height = '32px'
        }
      })
    })

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return (
    <>
      <Navbar />

      <motion.main
        className="pt-40 pb-20 overflow-x-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { duration: 0.5, ease: 'easeOut' } }}
        exit={{ opacity: 0, transition: { duration: 0.2, ease: 'easeIn' } }}
      >
        {/* Header */}
        <header className="px-6 md:px-12 max-w-[1920px] mx-auto mb-32 md:mb-48">
          <div className="max-w-4xl">
            <h1 className="font-headline text-6xl md:text-8xl font-light leading-[1.05] mb-8 tracking-tight">
              Dise<br />
              <span className="italic pl-12 md:pl-24">ño</span>
            </h1>
            <p className="font-label text-xs uppercase tracking-[0.3em] text-outline">
              {designProjects.length} proyectos
            </p>
          </div>
        </header>

        {/* Project grid */}
        <motion.div
          className="px-6 md:px-12 max-w-[1920px] mx-auto grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8"
          variants={gridVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          {designProjects.map((project, i) => (
            <Link
              key={project.slug}
              to={`/diseño/${project.slug}`}
              className={`design-card block relative ${colPatterns[i % colPatterns.length]}`}
            >
              {/* Ghost number */}
              <div
                className="ghost-number absolute pointer-events-none select-none font-headline leading-none text-primary tracking-tighter opacity-[0.038]"
                style={{
                  fontSize: 'clamp(5rem, 16vw, 20rem)',
                  top: '-1rem',
                  right: i % 2 === 0 ? '-0.5rem' : 'auto',
                  left: i % 2 !== 0 ? '-0.5rem' : 'auto',
                  zIndex: 0,
                }}
              >
                {String(i + 1).padStart(2, '0')}
              </div>

              <DesignCard project={project} />
            </Link>
          ))}
        </motion.div>
      </motion.main>

      <Footer />

      {/* Custom cursor */}
      <div
        ref={cursorRef}
        className="custom-cursor fixed top-0 left-0 w-8 h-8 border border-primary/20 rounded-full pointer-events-none z-[100] hidden md:block mix-blend-difference"
      />
    </>
  )
}

function DesignCard({ project }) {
  const cardRef = useRef(null)
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 })

  const handleMouseMove = (e) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    setMousePos({ x, y })
  }

  return (
    <motion.div
      ref={cardRef}
      variants={cardVariants}
      className="relative aspect-[3/4] overflow-hidden bg-surface-container-low group"
      onMouseMove={handleMouseMove}
    >
      {/* Image with desaturation */}
      <img
        src={project.cover}
        alt={project.title}
        className="w-full h-full object-cover scale-105 transition-all duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] grayscale-[30%] group-hover:grayscale-0 group-hover:scale-100"
      />

      {/* Overlay with cursor-following clip-path */}
      <div
        className="absolute inset-0 bg-gradient-to-t from-primary/85 via-primary/40 to-primary/10 flex flex-col justify-end p-8 md:p-10 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
        style={{
          clipPath: `circle(0% at ${mousePos.x}% ${mousePos.y}%)`,
          transition: 'clip-path 0.6s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.5s ease',
        }}
      >
        {/* Expand clip-path on hover via CSS class */}
        <style>{`
          .group:hover > div[style*="clip-path"] {
            clip-path: circle(150% at ${mousePos.x}% ${mousePos.y}%) !important;
          }
        `}</style>

        <p className="font-label text-[10px] uppercase tracking-[0.35em] text-white/60 mb-2">
          {project.type} · {project.date}
        </p>
        <h3 className="font-headline text-3xl md:text-4xl font-light text-white mb-4">
          {project.title}
        </h3>
        <span className="inline-flex items-center gap-2 text-white/70 font-label text-[10px] uppercase tracking-widest">
          Ver proyecto
          <span className="material-symbols-outlined text-sm">arrow_right_alt</span>
        </span>
      </div>
    </motion.div>
  )
}
```

**Step 2: Add CSS for the cursor-following overlay**

In `src/index.css`, add after the existing cursor styles (around line 157):

```css
/* Design card overlay — clip-path circle from cursor */
.design-card:hover .design-overlay {
  clip-path: circle(150% at var(--mouse-x, 50%) var(--mouse-y, 50%));
}
```

**Step 3: Verify the index page**

Navigate to `/diseño`:
- Header should show "Dise / ño" with editorial split
- Cards should have asymmetric layout
- Hover should show cursor-following circular overlay reveal
- Ghost numbers should parallax on scroll

**Step 4: Commit**

```bash
git add src/pages/Design.jsx src/index.css
git commit -m "feat: complete design index page with asymmetric grid and cursor-following overlay"
```

---

## Task 11: CSS animations for new effects

**Files:**
- Modify: `src/index.css`

**Step 1: Add iris clip-path and showcase transition styles**

Append to `src/index.css` after existing styles:

```css
/* ── Design section animations ───────────────────────────── */

/* Showcase counter styling */
.showcase-counter {
  font-variant-numeric: tabular-nums;
}

/* Reduced motion: disable all scroll-driven effects */
@media (prefers-reduced-motion: reduce) {
  .design-card img {
    filter: none !important;
    transform: none !important;
  }
}
```

**Step 2: Commit**

```bash
git add src/index.css
git commit -m "feat: add design section CSS animations and reduced-motion support"
```

---

## Task 12: Final integration + smoke test

**Files:**
- All created/modified files

**Step 1: Full smoke test**

Run: `npm run dev`

Test the following flow:
1. Home page → click "Diseño" in navbar → lands on `/diseño`
2. Index page renders with editorial header, asymmetric grid, ghost numbers
3. Hover on a card → cursor expands, circular overlay reveals from cursor position
4. Click card → navigates to `/diseño/fast-green`
5. Hero section: image starts small + grayscale, grows on scroll
6. Text section: words light up progressively
7. Split section: image wipes in with clip-path, parallax depth effect
8. Showcase section: sticky scroll takeover, crossfade between images, counter updates
9. Fullbleed section: parallax image, letter-by-letter caption
10. Grid section: staggered iris reveal
11. Prev/Next navigation works
12. "Todos los proyectos" link returns to index
13. Back button in browser works correctly
14. Mobile responsive: all sections stack cleanly

**Step 2: Fix any issues found**

**Step 3: Final commit**

```bash
git add -A
git commit -m "feat: complete immersive design section with all animations"
```

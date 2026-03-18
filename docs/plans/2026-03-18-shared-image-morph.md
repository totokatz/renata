# Shared Image Morph — Transición Galería → Detalle

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Animar la navegación de Obras Selectas a ArtworkDetail con un shared element transition: el contenedor de la imagen vuela de su posición en la galería hasta el panel del detalle.

**Architecture:** Framer Motion `layoutId` en `motion.div` containers (no en `motion.img` directamente, para evitar conflictos con el parallax CSS transform). `AnimatePresence mode="wait"` en App.jsx vía un componente `AnimatedRoutes` interno que usa `useLocation`. El texto del detalle entra con stagger. Se respeta `prefers-reduced-motion`.

**Tech Stack:** React 19, React Router v7, Framer Motion (nueva dependencia), Tailwind CSS v4

---

### Task 1: Instalar Framer Motion

**Files:**
- Modify: `package.json` (automático via npm)

**Step 1: Instalar la dependencia**

```bash
npm install framer-motion
```

**Step 2: Verificar que instaló correctamente**

```bash
node -e "require('./node_modules/framer-motion/dist/cjs/index.js'); console.log('ok')"
```

Expected output: `ok`

**Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: install framer-motion for page transition animations"
```

---

### Task 2: Refactorizar App.jsx con AnimatePresence

**Files:**
- Modify: `src/App.jsx`

El problema: `useLocation` solo puede llamarse dentro de `<BrowserRouter>`. Necesitamos un componente interno `AnimatedRoutes`.

**Step 1: Reemplazar todo el contenido de `src/App.jsx`**

```jsx
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import Home from './pages/Home'
import ArtworkDetail from './pages/ArtworkDetail'

function AnimatedRoutes() {
  const location = useLocation()
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/artwork/:id" element={<ArtworkDetail />} />
      </Routes>
    </AnimatePresence>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AnimatedRoutes />
    </BrowserRouter>
  )
}
```

**Step 2: Verificar en navegador**

- Correr `npm run dev`
- Navegar a `/` — debe cargar sin errores en consola
- Navegar a `/artwork/1` manualmente en la URL — debe cargar sin errores
- La navegación normal funciona (sin animaciones aún, eso va en los siguientes tasks)

**Step 3: Commit**

```bash
git add src/App.jsx
git commit -m "feat: add AnimatePresence wrapper for page transitions"
```

---

### Task 3: Añadir layoutId a las imágenes de galería en Home.jsx

**Files:**
- Modify: `src/pages/Home.jsx`

**Concepto:** Reemplazar el `<div className="parallax-container ...">` de cada gallery item con `<motion.div layoutId={...} className="parallax-container ...">`. El `<img>` con la clase `parallax-img` queda intacto adentro — esto evita conflictos entre el CSS transform del parallax y el layout animation de Framer Motion.

**Step 1: Añadir el import de motion al inicio de Home.jsx**

Agregar al final de los imports existentes:
```jsx
import { motion } from 'framer-motion'
```

**Step 2: Row 1 — reemplazar el div contenedor de la imagen**

Buscar (líneas ~92-98):
```jsx
<div className="parallax-container aspect-[4/5] bg-surface-container-low">
  <img
    src={artworks[0].image}
    alt={artworks[0].title}
    className="parallax-img w-full h-full object-cover"
  />
</div>
```

Reemplazar con:
```jsx
<motion.div
  layoutId={`artwork-image-${artworks[0].id}`}
  className="parallax-container aspect-[4/5] bg-surface-container-low"
>
  <img
    src={artworks[0].image}
    alt={artworks[0].title}
    className="parallax-img w-full h-full object-cover"
  />
</motion.div>
```

**Step 3: Row 2 — primer artwork (artworks[1])**

Buscar:
```jsx
<div className="parallax-container aspect-square bg-surface-container-low">
  <img
    src={artworks[1].image}
    alt={artworks[1].title}
    className="parallax-img w-full h-full object-cover"
  />
</div>
```

Reemplazar con:
```jsx
<motion.div
  layoutId={`artwork-image-${artworks[1].id}`}
  className="parallax-container aspect-square bg-surface-container-low"
>
  <img
    src={artworks[1].image}
    alt={artworks[1].title}
    className="parallax-img w-full h-full object-cover"
  />
</motion.div>
```

**Step 4: Row 2 — segundo artwork (artworks[2])**

Buscar:
```jsx
<div className="parallax-container aspect-[16/10] bg-surface-container-low">
  <img
    src={artworks[2].image}
    alt={artworks[2].title}
    className="parallax-img w-full h-full object-cover"
  />
</div>
```

Reemplazar con:
```jsx
<motion.div
  layoutId={`artwork-image-${artworks[2].id}`}
  className="parallax-container aspect-[16/10] bg-surface-container-low"
>
  <img
    src={artworks[2].image}
    alt={artworks[2].title}
    className="parallax-img w-full h-full object-cover"
  />
</motion.div>
```

**Step 5: Row 3 — artworks[3]**

Buscar:
```jsx
<div className="parallax-container aspect-[3/4] bg-surface-container-low">
  <img
    src={artworks[3].image}
    alt={artworks[3].title}
    className="parallax-img w-full h-full object-cover"
  />
</div>
```

Reemplazar con:
```jsx
<motion.div
  layoutId={`artwork-image-${artworks[3].id}`}
  className="parallax-container aspect-[3/4] bg-surface-container-low"
>
  <img
    src={artworks[3].image}
    alt={artworks[3].title}
    className="parallax-img w-full h-full object-cover"
  />
</motion.div>
```

**Step 6: Row 4 — artworks[4]**

Buscar:
```jsx
<div className="parallax-container h-[400px] md:h-[716px] w-full bg-surface-container-low">
  <img
    src={artworks[4].image}
    alt={artworks[4].title}
    className="parallax-img w-full h-full object-cover"
  />
</div>
```

Reemplazar con:
```jsx
<motion.div
  layoutId={`artwork-image-${artworks[4].id}`}
  className="parallax-container h-[400px] md:h-[716px] w-full bg-surface-container-low"
>
  <img
    src={artworks[4].image}
    alt={artworks[4].title}
    className="parallax-img w-full h-full object-cover"
  />
</motion.div>
```

**Step 7: Verificar en navegador**

- Home carga sin errores en consola
- El hover parallax en las imágenes sigue funcionando
- Las imágenes se ven igual que antes

**Step 8: Commit**

```bash
git add src/pages/Home.jsx
git commit -m "feat: add layoutId to gallery image containers for shared morph transition"
```

---

### Task 4: Animar ArtworkDetail con layoutId + stagger de contenido

**Files:**
- Modify: `src/pages/ArtworkDetail.jsx`

**Step 1: Añadir imports de framer-motion**

Agregar al final de los imports existentes:
```jsx
import { motion } from 'framer-motion'
```

**Step 2: Definir variantes de animación**

Agregar estas constantes justo antes del `return` del componente `ArtworkDetail` (dentro de la función, después de la línea `const artwork = ...`):

```jsx
const contentVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.25 }
  },
  exit: { opacity: 0, transition: { duration: 0.15, ease: 'easeIn' } }
}

const itemVariants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] }
  }
}
```

**Step 3: Reemplazar el contenedor de imagen (Image Side)**

Buscar (líneas ~20-28):
```jsx
<div className="relative w-full aspect-[4/5] md:aspect-[3/4] overflow-hidden bg-surface-container-low">
  <img
    src={artwork.detailImage || artwork.image}
    alt={artwork.title}
    className="w-full h-full object-cover opacity-90"
    style={{ filter: 'grayscale(20%) contrast(110%)' }}
  />
  <div className="absolute inset-0 bg-primary/5 pointer-events-none" />
</div>
```

Reemplazar con:
```jsx
<motion.div
  layoutId={`artwork-image-${id}`}
  className="relative w-full aspect-[4/5] md:aspect-[3/4] overflow-hidden bg-surface-container-low"
  transition={{ type: 'spring', stiffness: 280, damping: 28 }}
>
  <img
    src={artwork.detailImage || artwork.image}
    alt={artwork.title}
    className="w-full h-full object-cover opacity-90"
    style={{ filter: 'grayscale(20%) contrast(110%)' }}
  />
  <div className="absolute inset-0 bg-primary/5 pointer-events-none" />
</motion.div>
```

**Step 4: Animar el Content Side con stagger**

Buscar (líneas ~31-65):
```jsx
{/* Content Side */}
<div className="flex flex-col pt-12 md:pt-24 max-w-xl">
  <span className="text-xs uppercase tracking-[0.3em] text-outline mb-8 block">
    Sobre la Práctica
  </span>
  <h1 className="font-headline text-5xl md:text-7xl font-light leading-[1.1] text-primary mb-12 tracking-tight">
    La Artista detrás del Silencio
  </h1>
  <div className="font-headline text-lg md:text-xl text-on-surface-variant leading-relaxed space-y-8 font-light italic">
    {artwork.story.map((paragraph, i) => (
      <p key={i}>{paragraph}</p>
    ))}
  </div>

  <div className="mt-20 pt-12 border-t border-outline-variant/20 flex flex-col gap-8">
    <div className="flex items-center gap-4">
      <span className="material-symbols-outlined text-primary-container" style={{ fontVariationSettings: "'wght' 300" }}>
        water_drop
      </span>
      <span className="text-xs uppercase tracking-widest text-on-surface font-medium">
        Filosofía del Fluir
      </span>
    </div>
    <Link
      to="/inquire"
      className="group inline-flex items-center gap-4 text-primary transition-all duration-700"
    >
      <span className="text-xs uppercase tracking-[0.4em] font-medium transition-all group-hover:tracking-[0.6em]">
        Consultar
      </span>
      <span className="material-symbols-outlined transition-transform group-hover:translate-x-2">
        arrow_right_alt
      </span>
    </Link>
  </div>
</div>
```

Reemplazar con:
```jsx
{/* Content Side */}
<motion.div
  className="flex flex-col pt-12 md:pt-24 max-w-xl"
  variants={contentVariants}
  initial="hidden"
  animate="visible"
  exit="exit"
>
  <motion.span variants={itemVariants} className="text-xs uppercase tracking-[0.3em] text-outline mb-8 block">
    Sobre la Práctica
  </motion.span>
  <motion.h1 variants={itemVariants} className="font-headline text-5xl md:text-7xl font-light leading-[1.1] text-primary mb-12 tracking-tight">
    La Artista detrás del Silencio
  </motion.h1>
  <motion.div variants={itemVariants} className="font-headline text-lg md:text-xl text-on-surface-variant leading-relaxed space-y-8 font-light italic">
    {artwork.story.map((paragraph, i) => (
      <p key={i}>{paragraph}</p>
    ))}
  </motion.div>

  <motion.div variants={itemVariants} className="mt-20 pt-12 border-t border-outline-variant/20 flex flex-col gap-8">
    <div className="flex items-center gap-4">
      <span className="material-symbols-outlined text-primary-container" style={{ fontVariationSettings: "'wght' 300" }}>
        water_drop
      </span>
      <span className="text-xs uppercase tracking-widest text-on-surface font-medium">
        Filosofía del Fluir
      </span>
    </div>
    <Link
      to="/inquire"
      className="group inline-flex items-center gap-4 text-primary transition-all duration-700"
    >
      <span className="text-xs uppercase tracking-[0.4em] font-medium transition-all group-hover:tracking-[0.6em]">
        Consultar
      </span>
      <span className="material-symbols-outlined transition-transform group-hover:translate-x-2">
        arrow_right_alt
      </span>
    </Link>
  </motion.div>
</motion.div>
```

**Step 5: Animar la sección secundaria de detalle**

Buscar la sección secundaria (líneas ~71-97):
```jsx
{/* Secondary Detail Section */}
<section className="mt-40 bg-surface-container-low py-32 px-6 md:px-12">
```

Reemplazar `<section` con `<motion.section` y añadir animación:
```jsx
{/* Secondary Detail Section */}
<motion.section
  className="mt-40 bg-surface-container-low py-32 px-6 md:px-12"
  initial={{ opacity: 0, y: 24 }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0 }}
  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0.5 }}
>
```

Y cerrar con `</motion.section>` en lugar de `</section>`.

**Step 6: Verificar el resultado completo en navegador**

- Click en cualquier obra de la galería → la imagen debe volar suavemente de su posición al panel izquierdo del detalle
- El texto debe aparecer en stagger después de que la imagen llega
- Click en el botón atrás del navegador → la imagen debe volar de regreso a la galería
- Verificar en Chrome DevTools → Console: sin errores

**Step 7: Verificar otros artworks**

- Click en Row 2, artwork 1 → imagen vuela desde su posición (izquierda, cuadrada)
- Click en Row 2, artwork 2 → imagen vuela desde su posición (derecha, landscape)
- Click en Row 3 → imagen vuela desde el centro
- Click en Row 4 → imagen vuela desde el bleed full-width

**Step 8: Commit**

```bash
git add src/pages/ArtworkDetail.jsx
git commit -m "feat: add shared image morph and stagger animations to ArtworkDetail"
```

---

### Task 5: Respetar prefers-reduced-motion

**Files:**
- Modify: `src/pages/ArtworkDetail.jsx`
- Modify: `src/pages/Home.jsx`

Framer Motion respeta `prefers-reduced-motion` automáticamente para `animate` y `initial`, pero el `layoutId` morph sigue corriendo. Lo desactivamos manualmente para usuarios que lo prefieren.

**Step 1: Añadir useReducedMotion en ArtworkDetail.jsx**

Añadir al import de framer-motion:
```jsx
import { motion, useReducedMotion } from 'framer-motion'
```

**Step 2: Usar el hook en el componente**

Después de `const artwork = ...`, añadir:
```jsx
const shouldReduceMotion = useReducedMotion()
```

**Step 3: Condicionar el layoutId de la imagen**

```jsx
<motion.div
  layoutId={shouldReduceMotion ? undefined : `artwork-image-${id}`}
  className="relative w-full aspect-[4/5] md:aspect-[3/4] overflow-hidden bg-surface-container-low"
  transition={{ type: 'spring', stiffness: 280, damping: 28 }}
>
```

**Step 4: Añadir useReducedMotion en Home.jsx**

```jsx
import { motion, useReducedMotion } from 'framer-motion'
```

Y en el componente `Home`, después de `const cursorRef = useRef(null)`:
```jsx
const shouldReduceMotion = useReducedMotion()
```

Y en cada `motion.div` de galería:
```jsx
<motion.div
  layoutId={shouldReduceMotion ? undefined : `artwork-image-${artworks[0].id}`}
  className="parallax-container aspect-[4/5] bg-surface-container-low"
>
```
(Aplicar lo mismo a los 5 gallery items)

**Step 5: Verificar**

- En Chrome DevTools → Rendering → Emulate CSS prefers-reduced-motion: reduce
- La navegación debe funcionar sin el morph (fade normal)
- Sin esa emulación: el morph funciona normalmente

**Step 6: Commit**

```bash
git add src/pages/ArtworkDetail.jsx src/pages/Home.jsx
git commit -m "feat: respect prefers-reduced-motion for shared image transition"
```

---

## Verificación Final

1. `npm run build` — sin errores
2. Navegar todas las obras y verificar que el morph se ve fluido en cada una
3. Verificar que el parallax de scroll en Home sigue funcionando tras volver de un detalle
4. Verificar en mobile (Chrome DevTools → responsive) — la animación debe verse igualmente fluida

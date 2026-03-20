# Scroll-Lock 360° Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Bloquear el scroll de la página en la sección "Explora la lámpara 360°" para que el input de scroll controle la rotación del modelo 3D (0%→100%), liberando el scroll al completar. Bidireccional: al volver subiendo, el lock se re-activa y la rotación va en reversa.

**Architecture:** Hook reutilizable `useScrollLock` que intercepta eventos wheel/touch, fija la página con `scrollTo`, y convierte deltas en progreso 0-1 con lerp suave. El mismo patrón que ya usa HeroSection, extraído como hook compartido. Se aplica al `Model3DSection` (modo `scroll-rotate`) y se refactoriza el `HeroSection` para usar el mismo hook.

**Tech Stack:** React 19, requestAnimationFrame, wheel/touch event listeners, getBoundingClientRect

---

### Task 1: Crear el hook `useScrollLock`

**Files:**
- Create: `src/hooks/useScrollLock.js`

**Step 1: Crear directorio y archivo**

Crear `src/hooks/useScrollLock.js` con el siguiente contenido completo:

```js
import { useState, useEffect } from 'react'

// Mutex global — solo un scroll-lock activo a la vez
let globalLockActive = false

export function useScrollLock(sectionRef, options = {}) {
  const {
    enabled = true,
    wheelDivisor = 2500,
    touchDivisor = 800,
    lerpFactor = 0.06,
    snapThreshold = 0.0005,
    reEngageAfterForward = false,
  } = options

  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (!enabled) return
    const el = sectionRef.current
    if (!el) return

    let locked = false
    let touchY = 0
    let target = 0
    let current = 0
    let rafId = null
    let doneDirection = null // null | 'forward' | 'backward'

    const getLockTop = () => el.getBoundingClientRect().top + window.scrollY

    const lock = () => {
      if (locked || globalLockActive) return
      globalLockActive = true
      window.scrollTo({ top: getLockTop(), behavior: 'instant' })
      locked = true
    }

    const unlock = () => {
      if (!locked) return
      globalLockActive = false
      locked = false
    }

    const tick = () => {
      const diff = target - current
      current += diff * lerpFactor
      if (Math.abs(diff) < snapThreshold) current = target

      setProgress(current)

      if (current >= 1) {
        current = 1
        target = 1
        setProgress(1)
        rafId = null
        doneDirection = 'forward'
        unlock()
        return
      }

      if (current <= 0 && target <= 0) {
        current = 0
        target = 0
        setProgress(0)
        rafId = null
        doneDirection = 'backward'
        unlock()
        return
      }

      rafId = requestAnimationFrame(tick)
    }

    const startLoop = () => {
      if (!rafId) rafId = requestAnimationFrame(tick)
    }

    const drive = (delta) => {
      target = Math.max(0, Math.min(1, target + delta))
      startLoop()
    }

    const sectionAtTop = () => {
      const rect = el.getBoundingClientRect()
      const threshold = window.innerHeight * 0.1
      return rect.top < threshold && rect.top > -threshold && rect.bottom > window.innerHeight * 0.5
    }

    // Handler unificado para wheel y touch
    const handleDelta = (delta, preventDefault) => {
      const down = delta > 0

      // === COMPLETADO FORWARD (progreso llegó a 1) ===
      if (doneDirection === 'forward') {
        if (down) return // sigue bajando, dejar pasar
        // Scrolleando hacia arriba — ¿re-enganche?
        if (reEngageAfterForward && sectionAtTop()) {
          doneDirection = null
          target = 1
          current = 1
          preventDefault()
          lock()
          drive(delta)
          return
        }
        return // no re-enganchar, dejar pasar
      }

      // === COMPLETADO BACKWARD (progreso llegó a 0) ===
      if (doneDirection === 'backward') {
        if (!down) return // sigue subiendo, dejar pasar
        // Scrolleando hacia abajo — re-enganche
        if (sectionAtTop()) {
          doneDirection = null
          target = 0
          current = 0
          preventDefault()
          lock()
          drive(delta)
          return
        }
        return // sección no visible, dejar pasar
      }

      // === LOCK ACTIVO ===
      if (locked) {
        preventDefault()
        drive(delta)
        return
      }

      // === PRIMERA ENTRADA (scroll down hacia la sección) ===
      if (down && sectionAtTop()) {
        preventDefault()
        lock()
        drive(delta)
      }
    }

    const onWheel = (e) => {
      handleDelta(e.deltaY / wheelDivisor, () => e.preventDefault())
    }

    const onTouchStart = (e) => {
      touchY = e.touches[0].clientY
    }

    const onTouchMove = (e) => {
      const dy = touchY - e.touches[0].clientY
      touchY = e.touches[0].clientY
      handleDelta(dy / touchDivisor, () => e.preventDefault())
    }

    window.addEventListener('wheel', onWheel, { passive: false })
    window.addEventListener('touchstart', onTouchStart, { passive: true })
    window.addEventListener('touchmove', onTouchMove, { passive: false })

    return () => {
      unlock()
      if (rafId) cancelAnimationFrame(rafId)
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchmove', onTouchMove)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled])

  return { progress }
}
```

**Step 2: Verificar que el archivo se creó correctamente**

Run: `cat src/hooks/useScrollLock.js | head -5`
Expected: las primeras 5 líneas del hook

**Step 3: Commit**

```bash
git add src/hooks/useScrollLock.js
git commit -m "feat: add useScrollLock hook for scroll-hijacking sections"
```

---

### Task 2: Actualizar Model3DSection para usar el hook en modo scroll-rotate

**Files:**
- Modify: `src/components/design/Model3DSection.jsx`

**Step 1: Agregar import del hook**

En la línea 1 de `Model3DSection.jsx`, cambiar:

```js
import { useRef, useState, Suspense, useEffect } from 'react'
```

por:

```js
import { useRef, useState, Suspense, useEffect } from 'react'
import { useScrollLock } from '../../hooks/useScrollLock'
```

**Step 2: Reemplazar la lógica de scroll del componente principal**

Reemplazar el bloque de lógica dentro de `Model3DSection` (líneas 144-162 aprox.):

```js
export default function Model3DSection({ model, mode = 'scroll-rotate', caption }) {
  const containerRef = useRef(null)
  const captionRef = useRef(null)
  const captionInView = useInView(captionRef, { once: true, margin: '-50px' })
  const [scrollVal, setScrollVal] = useState(0)

  const isScrollDriven = mode === 'scroll-rotate' || mode === 'explode'
  const sectionHeight = isScrollDriven ? (mode === 'explode' ? '250vh' : '200vh') : '100vh'

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  })

  useEffect(() => {
    if (!isScrollDriven) return
    const unsubscribe = scrollYProgress.on('change', (v) => setScrollVal(v))
    return unsubscribe
  }, [scrollYProgress, isScrollDriven])
```

por:

```js
export default function Model3DSection({ model, mode = 'scroll-rotate', caption }) {
  const containerRef = useRef(null)
  const captionRef = useRef(null)
  const captionInView = useInView(captionRef, { once: true, margin: '-50px' })
  const [scrollVal, setScrollVal] = useState(0)

  const isScrollLocked = mode === 'scroll-rotate'
  const isExplode = mode === 'explode'
  const sectionHeight = isExplode ? '250vh' : '100vh'

  // Scroll-lock para rotación 360°
  const { progress } = useScrollLock(containerRef, {
    enabled: isScrollLocked,
    reEngageAfterForward: true,
  })

  // Framer Motion scroll solo para modo explode
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  })

  useEffect(() => {
    if (!isExplode) return
    const unsubscribe = scrollYProgress.on('change', (v) => setScrollVal(v))
    return unsubscribe
  }, [scrollYProgress, isExplode])
```

**Step 3: Actualizar el className del contenedor sticky**

Reemplazar:

```jsx
      <div
        className={`${isScrollDriven ? 'sticky top-0' : 'relative'} h-screen w-full`}
      >
```

por:

```jsx
      <div
        className={`${isExplode ? 'sticky top-0' : 'relative'} h-screen w-full`}
      >
```

**Step 4: Actualizar el ScrollRotateScene para usar `progress` del hook**

Reemplazar:

```jsx
              {mode === 'scroll-rotate' && (
                <ScrollRotateScene model={model} scrollProgress={scrollVal} />
              )}
```

por:

```jsx
              {mode === 'scroll-rotate' && (
                <ScrollRotateScene model={model} scrollProgress={progress} />
              )}
```

**Step 5: Actualizar el indicador de porcentaje**

Reemplazar:

```jsx
        {isScrollDriven && (
          <div className="absolute bottom-12 right-12 z-10">
            <span className="font-label text-xs text-outline/50 tracking-widest">
              {Math.round(scrollVal * 100)}%
            </span>
          </div>
        )}
```

por:

```jsx
        {(isScrollLocked || isExplode) && (
          <div className="absolute bottom-12 right-12 z-10">
            <span className="font-label text-xs text-outline/50 tracking-widest">
              {Math.round((isScrollLocked ? progress : scrollVal) * 100)}%
            </span>
          </div>
        )}
```

**Step 6: Verificar que el dev server compila sin errores**

Run: `npm run dev` (verificar que no hay errores de compilación en la consola)

**Step 7: Verificar manualmente en el browser**

Abrir `http://localhost:5173/design/lampara-truyu` y verificar:
1. Al llegar a la sección 360°, el scroll se bloquea
2. El scroll controla la rotación del modelo
3. El % sube de 0 a 100
4. Al llegar a 100%, el scroll normal se libera
5. Al scrollear hacia arriba de vuelta, el lock se re-activa
6. La rotación va en reversa (100% → 0%)
7. Al llegar a 0%, el scroll se libera hacia arriba
8. Las secciones explode e interactive siguen funcionando igual

**Step 8: Commit**

```bash
git add src/components/design/Model3DSection.jsx
git commit -m "feat: scroll-lock 360° rotation in Model3DSection"
```

---

### Task 3: Refactorizar HeroSection para usar el hook

**Files:**
- Modify: `src/components/design/HeroSection.jsx`

**Step 1: Agregar import del hook y eliminar imports innecesarios**

Reemplazar:

```js
import { useRef, useState, useEffect, useCallback } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
```

por:

```js
import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useScrollLock } from '../../hooks/useScrollLock'
```

**Step 2: Reemplazar el useState de progress y el useEffect completo**

Reemplazar las líneas 5-139 (desde `const sectionRef = useRef(null)` hasta el cierre del `useEffect`):

```js
  const sectionRef = useRef(null)
  const [progress, setProgress] = useState(0)

  const letters = title ? title.split('') : []
  // ... (líneas de cálculo de fases) ...

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return

    let locked = false
    let touchY = 0
    // ... (110 líneas de lógica de scroll-lock) ...

    return () => {
      unlock()
      if (rafId) cancelAnimationFrame(rafId)
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchmove', onTouchMove)
    }
  }, [])
```

por:

```js
  const sectionRef = useRef(null)
  const { progress } = useScrollLock(sectionRef)

  const letters = title ? title.split('') : []
  // ... (todas las líneas de cálculo de fases se mantienen exactamente igual) ...
```

Es decir, el componente completo queda:

```jsx
export default function HeroSection({ image, title, subtitle, type, date }) {
  const sectionRef = useRef(null)
  const { progress } = useScrollLock(sectionRef)

  const letters = title ? title.split('') : []
  const totalLetters = letters.length
  const subLetters = subtitle ? subtitle.split('') : []
  const totalSubLetters = subLetters.length

  // Phase 1: 0–0.40 → title letters change color
  const colorRatio = Math.min(1, progress / 0.4)
  const coloredIndex = Math.round(colorRatio * totalLetters)
  const shadowAlpha = 1 - colorRatio

  // Phase 1.5: 0.40–0.58 → subtitle letters appear one by one
  const subRatio = Math.max(0, Math.min(1, (progress - 0.40) / 0.18))
  const visibleSubIndex = Math.round(subRatio * totalSubLetters)

  // Phase 2: 0.62–1.0 → title + subtitle lift up
  const liftRatio = Math.max(0, (progress - 0.62) / 0.38)
  const titleY = liftRatio * -110
  const infoOpacity = Math.max(0, 1 - liftRatio * 3)

  // Post-animation: image stays sticky
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  })
  const imgScale = useTransform(scrollYProgress, [0.2, 0.7], [1, 1.03])
  const imgGrayscale = useTransform(scrollYProgress, [0.1, 0.4], [30, 0])

  return (
    // ... JSX sin cambios ...
  )
}
```

**Step 3: Verificar que el HeroSection funciona igual que antes**

Abrir `http://localhost:5173/design/lampara-truyu` y verificar:
1. La animación del título funciona igual (letras cambian de color, subtítulo aparece, título sube)
2. El scroll se bloquea al inicio y se libera al completar
3. El parallax de la imagen sigue funcionando después del unlock
4. Si scrolleás hacia arriba al principio de la animación, el progreso vuelve a 0
5. Después de que la animación completa (100%), scrollear hacia arriba NO re-activa el lock

**Step 4: Commit**

```bash
git add src/components/design/HeroSection.jsx
git commit -m "refactor: HeroSection now uses shared useScrollLock hook"
```

---

### Task 4: Verificación final end-to-end

**Step 1: Test completo de la página Lámpara Truyu**

Abrir `http://localhost:5173/design/lampara-truyu` y recorrer TODA la página:

1. **Hero**: scroll-lock funciona, letras cambian, título sube, parallax post-unlock ✓
2. **Texto**: word-by-word reveal funciona ✓
3. **Model3D scroll-rotate**: scroll se bloquea, lámpara rota 360°, % va de 0 a 100, unlock al 100% ✓
4. **Split**: imagen + texto con parallax ✓
5. **Fullbleed**: imagen edge-to-edge ✓
6. **Model3D explode**: sticky + scroll-driven explosion funciona igual que antes ✓
7. **Split**: segunda instancia ✓
8. **Showcase**: galería de imágenes ✓
9. **Model3D interactive**: drag-to-rotate funciona ✓
10. **Grid**: grilla de imágenes ✓

**Step 2: Test de re-entrada bidireccional**

1. Scrollear hasta la sección 360°, completar hasta 100%
2. Seguir bajando algunas secciones
3. Scrollear hacia arriba de vuelta a la sección 360°
4. Verificar que el lock se re-activa con progreso en 100%
5. Scrollear hacia arriba — la lámpara rota en reversa
6. Al llegar a 0%, el scroll se libera hacia arriba
7. Repetir el ciclo 2-3 veces para verificar estabilidad

**Step 3: Test en mobile (devtools)**

1. Abrir DevTools → Device toolbar → iPhone 14 Pro
2. Repetir los tests de Step 1 y Step 2 con gestos touch
3. Verificar que no hay jank ni saltos en la rotación

**Step 4: Commit final si hubo ajustes**

```bash
git add -A
git commit -m "fix: adjustments from end-to-end testing"
```

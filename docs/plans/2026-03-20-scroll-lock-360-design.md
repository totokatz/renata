# Diseño: Scroll-Lock para sección "Explora la lámpara 360°"

## Problema

La sección `model3d` en modo `scroll-rotate` usa un contenedor de `200vh` con `sticky top-0` y Framer Motion `useScroll` para rotar la lámpara. El usuario puede scrollear más allá de la sección antes de completar la rotación 360°, rompiendo la experiencia inmersiva.

## Objetivo

Bloquear el scroll de la página mientras el usuario está en la sección 360°. El input de scroll debe controlar exclusivamente la rotación del modelo (0% → 100%). Al llegar al 100%, el scroll normal se libera. Al volver subiendo, el lock se re-activa y la rotación va en reversa (100% → 0%).

## Enfoque elegido: Scroll-hijack imperativo (patrón HeroSection)

### Referencia: HeroSection actual (líneas 29-139)

El HeroSection ya implementa este patrón:
1. Intercepta `wheel`/`touchmove` con `{ passive: false }` + `preventDefault()`
2. Fija la página con `window.scrollTo({ top: X, behavior: 'instant' })`
3. Convierte deltas en progreso normalizado 0→1 (`delta / 2500` wheel, `/ 800` touch)
4. Lerp suave via `requestAnimationFrame` (factor 0.06, snap threshold 0.0005)
5. Libera al llegar a `current >= 1` o `current <= 0`

### Diseño: Hook `useScrollLock`

Extraer la lógica en un hook reutilizable:

```js
useScrollLock(sectionRef, {
  wheelDivisor: 2500,     // sensibilidad wheel
  touchDivisor: 800,      // sensibilidad touch
  lerpFactor: 0.06,       // suavizado
  snapThreshold: 0.0005,  // umbral snap
})
// Retorna: { progress }
```

**Flujo del hook:**
1. `IntersectionObserver` detecta cuándo la sección está ~95% visible
2. Al detectar scroll hacia la sección, activa el lock
3. `window.scrollTo()` fija la página en el tope de la sección
4. Los eventos `wheel`/`touchmove` alimentan `target` (0→1 bajando, 1→0 subiendo)
5. Loop `requestAnimationFrame` lerp-ea `current` → `target`
6. Al `current >= 1`: unlock, scroll continúa hacia abajo
7. Al `current <= 0`: unlock, scroll continúa hacia arriba
8. Re-entrada: si el usuario vuelve a scrollear hacia la sección, el lock se re-activa

**Diferencia clave vs HeroSection:** el HeroSection siempre se lockea en `scrollTop: 0` (es la primera sección). El hook necesita calcular dinámicamente la posición de lock basándose en `sectionRef.getBoundingClientRect().top + window.scrollY`.

### Cambios en Model3DSection

Para modo `scroll-rotate`:
- **Eliminar** contenedor `200vh` → usar `100vh`
- **Eliminar** `useScroll`/`useTransform` de Framer Motion para este modo
- **Usar** `useScrollLock(containerRef)` → obtener `progress`
- **Pasar** `progress` como `scrollProgress` a `ScrollRotateScene`
- El indicador `%` usa `progress` en vez de `scrollVal`

Modos `explode` e `interactive` no cambian.

### Refactor de HeroSection

Reemplazar las líneas 29-139 (el useEffect imperativo) con:
```js
const { progress } = useScrollLock(sectionRef, { wheelDivisor: 2500 })
```

Todo el render y la lógica de fases (colorRatio, subRatio, liftRatio) sigue igual, solo cambia la fuente de `progress`.

## Archivos afectados

| Archivo | Cambio |
|---------|--------|
| `src/hooks/useScrollLock.js` | **Nuevo** — hook reutilizable |
| `src/components/design/Model3DSection.jsx` | Usar hook en modo `scroll-rotate` |
| `src/components/design/HeroSection.jsx` | Refactorizar para usar hook |

## Lo que NO cambia

- `LamparaModel.jsx` — rotación `scrollProgress * Math.PI * 2` intacta
- Modos `explode` e `interactive` — sin modificaciones
- El indicador `%` — mismo render, distinta fuente
- Demás secciones y componentes — sin impacto

## Riesgos

1. **Lock position:** A diferencia del hero (siempre en top:0), la sección 360° está a mitad de página. Hay que calcular bien `offsetTop` para el `scrollTo`.
2. **Re-entrada bidireccional:** Detectar si el usuario viene de arriba (progress empieza en 0) o de abajo (progress empieza en 1) requiere tracking de dirección.
3. **Múltiples secciones con lock:** Si el hero y la 360° usan el mismo hook, deben coordinarse para no interferir. Solución: cada hook solo se activa cuando su sección está en viewport.

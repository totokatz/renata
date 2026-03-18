# Shared Image Morph — Transición de Galería a Detalle

**Fecha:** 2026-03-18
**Proyecto:** Renata Nanni — Portfolio de Arte

---

## Objetivo

Animar la navegación de "Obras Selectas" → `ArtworkDetail` con una transición de elemento compartido (shared image morph): la imagen del cuadro vuela de su posición en la galería hasta su lugar en la página de detalle, de forma continua, sin cortes.

---

## Librería

**Framer Motion** — `motion.img` con `layoutId` compartido entre galería y detalle.

---

## Comportamiento

### Entrada (Home → ArtworkDetail)
1. Click en obra → la imagen vuela desde su posición en la galería hasta el panel izquierdo del detalle (~500ms, spring physics)
2. El resto del contenido del detalle (título, texto, metadata) aparece con stagger suave: `y: 20 → 0`, `opacity: 0 → 1`, 80ms entre cada elemento

### Salida (ArtworkDetail → Home)
1. El contenido (título, texto) hace fade out `opacity → 0` en 200ms
2. La imagen viaja de regreso a su posición en la galería

---

## Parámetros de animación

| Elemento | Tipo | Parámetros |
|---|---|---|
| Imagen (morph) | `spring` | `stiffness: 280, damping: 28` |
| Texto (stagger) | `tween` | `duration: 0.4s, ease: easeOut`, delay +80ms por elemento |
| Salida de texto | `tween` | `duration: 0.2s, ease: easeIn` |

---

## Archivos a modificar

| Archivo | Cambio |
|---|---|
| `package.json` | Instalar `framer-motion` |
| `src/App.jsx` | Añadir `useLocation`, envolver `<Routes>` en `<AnimatePresence mode="wait">` con `key={location.pathname}` |
| `src/pages/Home.jsx` | `<img>` de galería → `<motion.img layoutId={\`artwork-image-${artwork.id}\`}>` en cada `gallery-item` |
| `src/pages/ArtworkDetail.jsx` | `<motion.img layoutId={\`artwork-image-${id}\`}>` + wrappers `motion.div` con stagger para título, texto y metadata |

---

## Restricciones

- No modificar el diseño visual ni los estilos existentes
- La animación no debe romper el parallax scroll existente en Home
- Mantener accesibilidad: respetar `prefers-reduced-motion`

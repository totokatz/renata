# Sección "Diseño" — Case Studies Inmersivos

**Fecha:** 2026-03-19
**Estado:** Aprobado
**Enfoque:** Scroll Takeover (inmersivo-experimental)

---

## Contexto

Renata Nanni tiene dos verticales creativas: **arte** (pinturas — ya implementado) y **diseño** (renders de diseño industrial/gráfico/producto). Esta feature crea el sistema completo para mostrar proyectos de diseño como case studies interactivos con animaciones inmersivas.

---

## Arquitectura

### Nuevas rutas
- `/diseño` — página índice con grid de proyectos
- `/diseño/:slug` — página detalle (case study inmersivo)

### Estructura de datos flexible

Cada proyecto define sus propias secciones. No hay estructura fija — Renata combina bloques como quiera:

```js
{
  slug: 'fast-green',
  title: 'Fast Green',
  subtitle: 'Comida rápida saludable',
  type: 'Diseño de productos',
  date: 'Junio 2024',
  description: 'Fast Green es una propuesta de un carrito ambulante...',
  cover: '/images/diseño/fast-green/hero.jpg',
  sections: [
    { type: 'hero', image: '...' },
    { type: 'text', content: '...' },
    { type: 'split', image: '...', text: '...', direction: 'left' },
    { type: 'showcase', images: ['v1.jpg', 'v2.jpg', 'v3.jpg', 'v4.jpg'] },
    { type: 'fullbleed', image: '...', caption: 'Semántica' },
    { type: 'grid', images: ['d1.jpg', 'd2.jpg', 'd3.jpg'], columns: 3 },
  ]
}
```

---

## Página Índice `/diseño`

### Header
Título editorial con word-split:
```
Dise
   ño
```
Newsreader, font-light, itálica + sangría en segunda línea.

### Grid de proyectos
- 12 columnas asimétricas (mismo sistema que Collections)
- Cards con `aspect-[3/4]` — verticales, como portada de revista
- Tamaños alternados: col-span-7, col-span-4, col-span-5, col-span-6 (patrón que se repite)
- Números fantasma `01`, `02`... detrás, opacidad 0.038, parallax

### Card behavior
- **Estado normal:** imagen cover con leve desaturación (`grayscale(30%)`) y escala `1.05`
- **Hover:** imagen gana color completo, de-escala a `1.0`, overlay con clip-path circular que se expande desde la posición del cursor
- **Overlay contenido:** título (Newsreader, grande), tipo + fecha (Work Sans, label), flecha "Ver proyecto →"

### Animaciones
- Reveal al scroll: cards con stagger (Framer Motion, spring)
- Ghost numbers: reveal-ghost + parallax propio
- Parallax en imágenes de cards

---

## Página Detalle `/diseño/:slug`

El detalle es un case study vertical donde cada sección tiene su propia animación. El componente principal itera `project.sections` y renderiza el componente correspondiente al `type`.

### Componentes de sección

#### `hero` — Entrada dramática
- La imagen arranca al 60% de escala, desaturada, centrada en viewport
- Al scrollear: crece a full-screen (scale 0.6 → 1.0), gana color (grayscale 100% → 0%)
- Título se revela con máscara diagonal (clip-path polygon animado)
- Implementación: scroll-driven animation con CSS o Framer Motion useScroll/useTransform

#### `showcase` — Scroll Takeover (plato fuerte)
- Sección sticky (position: sticky, height: 100vh)
- El scroll deja de mover la página — en su lugar crossfadea entre las imágenes del array
- Transición entre imágenes: scale sutil (1.0 → 1.05) + opacity crossfade
- Counter `01 / 04` en esquina con el número actual
- Cada imagen ocupa ~100vh de scroll distance
- Cuando terminan las vistas, la sección se des-stickea y el scroll normal continúa
- Implementación: container con height = images.length * 100vh, inner sticky div con useScroll

#### `split` — Parallax multicapa
- Pantalla dividida: imagen de un lado, texto del otro
- Imagen entra con clip-path wipe horizontal (inset animado)
- Imagen se mueve más lento que el texto (parallax offset *0.05 vs *0.12)
- `direction: 'left' | 'right'` controla desde qué lado entra la imagen
- Texto con reveal-up estándar (translateY + opacity)

#### `fullbleed` — Imagen a sangre completa
- 100vw, sin padding
- Parallax vertical sutil (offset *0.07, scale 1.08)
- Caption se revela letra por letra al entrar al viewport (stagger 30ms por carácter)
- Implementación: split caption en spans individuales, animar con IntersectionObserver + CSS delays

#### `grid` — Mosaico con stagger
- Grid responsive: `columns` define cantidad de columnas
- Cada imagen aparece escalonada (stagger 120ms entre cada una)
- Efecto de entrada: clip-path circular que se expande desde el centro (circle(0%) → circle(100%))
- Hover individual: escala sutil 1.0 → 1.03

#### `text` — Tipografía cinética
- Texto se divide en palabras
- Al scrollear, cada palabra pasa de `opacity: 0.15` a `1.0` progresivamente
- Efecto de "lectura guiada" — las palabras se iluminan conforme avanzan en el viewport
- Implementación: useScroll con offset por palabra basado en su posición

### Transiciones entre secciones
- Separador animado: línea fina (`border-outline-variant/20`) que crece desde el centro hacia los bordes al entrar al viewport
- Spacing generoso entre secciones: `space-y-32 md:space-y-48`

### Navegación
- Botón "Anterior / Siguiente" al final (como en Wix original)
- Botón back que vuelve a `/diseño`

---

## Estilo visual — Coherencia con el sitio

- Misma paleta (primary `#001a2c`, surface `#fcf8f9`, outline `#72787e`)
- Misma tipografía (Newsreader titulares, Work Sans cuerpo/labels)
- Misma curva de animación universal: `cubic-bezier(0.22, 1, 0.36, 1)`
- Cursor custom con expansión en hover sobre renders
- Labels uppercase con tracking extremo
- `prefers-reduced-motion` respetado en todas las animaciones

---

## Stack técnico

- **Framer Motion** — useScroll, useTransform, useInView para animaciones scroll-driven
- **CSS** — clip-path animations, transitions, sticky positioning
- **IntersectionObserver** — reveal triggers (ya implementado en el proyecto)
- **React Router** — nuevas rutas en App.jsx
- Sin dependencias nuevas necesarias

---

## Archivos a crear/modificar

### Nuevos
- `src/data/designProjects.js` — datos de proyectos de diseño
- `src/pages/Design.jsx` — página índice
- `src/pages/DesignProject.jsx` — página detalle (case study)
- `src/components/design/HeroSection.jsx`
- `src/components/design/ShowcaseSection.jsx`
- `src/components/design/SplitSection.jsx`
- `src/components/design/FullbleedSection.jsx`
- `src/components/design/GridSection.jsx`
- `src/components/design/TextSection.jsx`
- `src/components/design/SectionDivider.jsx`

### Modificar
- `src/App.jsx` — agregar rutas `/diseño` y `/diseño/:slug`
- `src/index.css` — nuevas animaciones CSS (clip-path iris, letra-por-letra, etc.)
- `src/components/Navbar.jsx` — agregar link a "Diseño" en navegación

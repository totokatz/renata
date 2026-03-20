# Diseño — Integración 3D GLB + Mejoras Inmersivas

**Fecha:** 2026-03-20
**Estado:** Aprobado
**Enfoque:** Integrar modelo 3D interactivo de Lámpara Truyu + fixes de UX

---

## Contexto

El proyecto de diseño ya tiene la estructura base implementada (index, detail, secciones). Ahora se integra el modelo 3D GLB de la Lámpara Truyu para elevar la experiencia a nivel Awwwards, y se corrigen problemas de UX existentes.

---

## GLB Analysis

**Archivo:** `src/assets/Lamparu TRUYU/LAMPARA TRUYU.glb`
- **Tamaño:** 184KB (óptimo para web)
- **3 meshes separados:**
  - `Cube` — base/cuerpo principal
  - `Pieza 1: Luz` — la cabeza con la luz
  - `Pieza 2: Soporte` — el soporte/estructura
- **Sin texturas embebidas** — material único, se puede estilizar con shaders
- **Sin animaciones** — se crean programáticamente

---

## Nuevo componente: `Model3DSection`

### Comportamiento
Sección de tipo `model3d` que renderiza el GLB con React Three Fiber.

### Modos de interacción (configurables por sección):

#### 1. `scroll-rotate` (por defecto)
- La lámpara gira 360° en Y mientras scrolleás
- Sticky section (como showcase), height = 300vh
- Rotación suave mapeada a scroll progress
- Fondo del sitio (surface color) — la lámpara flota en el espacio del diseño

#### 2. `explode`
- Al scrollear, las 3 piezas se separan (explotan) con movimiento orgánico
- Cada pieza se desplaza en su eje natural:
  - Luz → sube (translateY +)
  - Soporte → baja y rota levemente
  - Cube (base) → queda en lugar o baja poco
- Scroll reverso = las piezas se rearman
- Labels aparecen señalando cada pieza cuando están separadas

#### 3. `interactive`
- El usuario arrastra con el mouse para rotar libremente
- Orbit controls con damping suave
- Auto-rotate lento cuando no hay interacción
- Zoom con scroll wheel (limitado)

### Iluminación
- Ambient light suave (warm white, baja intensidad)
- Directional light principal desde arriba-izquierda (simula luz de estudio)
- Spot light que sigue la posición de la lámpara/pieza de luz (simula que "está encendida")
- Environment map sutil para reflejos en la madera

### Material override
- El GLB tiene un solo material genérico
- Se aplica un MeshStandardMaterial con:
  - Color: tono madera cálida (#C49A6C)
  - Roughness: 0.6 (semi-mate, como madera real)
  - Metalness: 0.05
  - Para la pieza de luz: emisión suave (warm white glow)

### Responsive
- Desktop: modelo ocupa ~60% del viewport, centrado
- Mobile: modelo ocupa ~80%, controles de orbit simplificados (touch-drag)
- `prefers-reduced-motion`: desactiva auto-rotate, permite solo interacción manual

---

## Dependencias nuevas

```
@react-three/fiber  — React renderer para Three.js
@react-three/drei   — Helpers (OrbitControls, Environment, useGLTF, etc.)
three               — Three.js core
```

---

## Fixes de UX

### 1. Hero title disappearing
**Problema:** El título se revela con clip-path pero el scroll avanza antes de que sea completamente visible.
**Fix:** Ajustar los offsets de scroll — el clip-path debe completarse al 25% del scroll (no al 35%), y el container debe ser más alto (250vh en vez de 200vh) para dar más tiempo de lectura.

### 2. Image cropping
**Problema:** Las imágenes de Behance tienen bordes, texto overlay, y padding que no corresponde al diseño editorial.
**Fix:** Las imágenes en `lampara-truyu/` ya están mayormente bien recortadas. Las de `Lamparu TRUYU/` son los originales de Behance — se usan como referencia pero no directamente en el proyecto.

---

## Data structure actualizada

```js
{
  slug: 'lampara-truyu',
  title: 'Lámpara Truyu',
  sections: [
    { type: 'hero', image: ... },
    { type: 'text', content: '...' },
    // NUEVO: sección 3D
    {
      type: 'model3d',
      model: '/path/to/lampara.glb',
      mode: 'scroll-rotate',     // 'scroll-rotate' | 'explode' | 'interactive'
      caption: 'Explorá la lámpara en 360°'
    },
    { type: 'model3d', model: '...', mode: 'explode', caption: 'Descomposición de piezas' },
    { type: 'split', ... },
    // etc.
  ]
}
```

---

## Archivos a crear/modificar

### Nuevos
- `src/components/design/Model3DSection.jsx` — Componente principal con Canvas + modelo
- `src/components/design/LamparaModel.jsx` — Componente Three.js del modelo (useGLTF, materials, animation logic)

### Modificar
- `src/pages/DesignProject.jsx` — Registrar `model3d` en sectionComponents
- `src/data/designProjects.js` — Agregar secciones model3d al proyecto Lámpara Truyu
- `src/components/design/HeroSection.jsx` — Fix timing del título
- `package.json` — Agregar dependencias Three.js

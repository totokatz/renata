# Auto-Scroll Buttons Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Dos botones fijos (arriba/abajo) que al hacer hover scrollean la página continuamente, bypasseando los scroll-locks.

**Architecture:** Flag global `scrollLockBypassed` en el hook + componente `ScrollButtons` con rAF loop.

**Tech Stack:** React 19, requestAnimationFrame, Tailwind

---

### Task 1: Agregar bypass al hook useScrollLock

**Files:** Modify `src/hooks/useScrollLock.js`

Agregar flag global exportado y usarlo en los handlers.

### Task 2: Crear componente ScrollButtons

**Files:** Create `src/components/design/ScrollButtons.jsx`

Componente con dos flechas fijas, rAF auto-scroll en hover.

### Task 3: Renderizar ScrollButtons en DesignProject

**Files:** Modify `src/pages/DesignProject.jsx`

Importar y renderizar el componente.

# Collections Artwork Reveal Animation — Design

**Date:** 2026-03-18
**Status:** Approved

## Goal

Replace the generic `reveal-up` (translateY + opacity) entrance animation for artwork cards in the Collections page with an elegant, editorial "curtain reveal" using Framer Motion.

## Approach

**Option A — Clip-path curtain + scale**, selected for its theatrical, gallery-quality reveal.

## Animation Behavior Per Card

1. **Curtain (clip-path):** `inset(100% 0 0 0)` → `inset(0% 0 0 0)`, duration 0.85s, ease `[0.76, 0, 0.24, 1]`. The image rises from below as the container opens upward.
2. **Image scale:** Internal image scales `1.12` → `1.08` (parallax rest value), duration 1.1s, ease `[0.22, 1, 0.36, 1]`. Adds depth — the image "grows" as the curtain lifts.
3. **Title / metadata below:** `opacity 0 → 1` + `y: 12px → 0`, delay 0.6s after card starts, duration 0.5s.

## Stagger (ArtworkGrid)

- `ArtworkGrid` becomes a `motion.div` container with `staggerChildren: 0.09` and `delayChildren: 0.05`.
- 4 artworks reveal in cascade, following the asymmetric layout order.

## Framer Motion Parameters

| Property | Value |
|---|---|
| staggerChildren | 0.09s |
| delayChildren | 0.05s |
| clip-path duration | 0.85s |
| clip-path ease | [0.76, 0, 0.24, 1] |
| image scale duration | 1.1s |
| image scale ease | [0.22, 1, 0.36, 1] |
| title delay | 0.6s |
| whileInView once | true |
| viewport amount | 0.15 |

## Code Changes

- `ArtworkCard`: wrap container in `motion.div` with clip-path variants; wrap `<img>` in `motion.img` for scale variant.
- `ArtworkGrid`: change outer `div` to `motion.div` with stagger container variants.
- Remove `reveal-up` class from `ArtworkCard` (CSS animation replaced by Framer Motion).
- Keep IntersectionObserver in `useEffect` for section-level animations (`reveal-clip`, `reveal-up`, `reveal-ghost` on headers/ghost numbers) — only artwork cards are migrated.
- No new dependencies needed (Framer Motion already installed).

## What Is NOT Changed

- Hover overlay animation (CSS — works fine)
- Parallax scroll effect on images
- Section header reveal animations (`reveal-clip`, `reveal-ghost`, `reveal-up` on text)
- Custom cursor behavior

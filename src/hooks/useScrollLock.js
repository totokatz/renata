import { useState, useEffect } from 'react'

// Mutex global — solo un scroll-lock activo a la vez
let globalLockActive = false

// Bypass flag — cuando true, los scroll-locks no se activan ni fuerzan posición
export let scrollLockBypassed = false
export function setScrollLockBypassed(val) {
  scrollLockBypassed = val
  if (val && globalLockActive) {
    globalLockActive = false
  }
}

export function useScrollLock(sectionRef, options = {}) {
  const {
    enabled = true,
    wheelDivisor = 2500,
    touchDivisor = 800,
    lerpFactor = 0.06,
    snapThreshold = 0.0005,
    reEngageAfterForward = false,
    autoCompleteAt = null, // when target reaches this going forward, jump to 1
    autoCompleteLerpFactor = null, // faster lerp during auto-complete exit
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
    let lockScrollY = null // posición cacheada de lock
    let autoCompleting = false // true when autoCompleteAt triggered

    const lock = () => {
      if (locked || globalLockActive || scrollLockBypassed) return
      globalLockActive = true
      // Cachear la posición ideal: donde el top de la sección = top del viewport
      lockScrollY = window.scrollY + el.getBoundingClientRect().top
      window.scrollTo({ top: lockScrollY, behavior: 'instant' })
      locked = true
    }

    const unlock = () => {
      if (!locked) return
      globalLockActive = false
      locked = false
      lockScrollY = null
    }

    // Forzar posición mientras está locked (previene drift por momentum)
    const onScroll = () => {
      if (scrollLockBypassed) return
      if (locked && lockScrollY !== null && Math.abs(window.scrollY - lockScrollY) > 1) {
        window.scrollTo({ top: lockScrollY, behavior: 'instant' })
      }
    }

    const tick = () => {
      const diff = target - current
      const activeLerp = (autoCompleting && autoCompleteLerpFactor) ? autoCompleteLerpFactor : lerpFactor
      current += diff * activeLerp
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
      // Auto-complete: one scroll past threshold triggers full animation
      if (autoCompleteAt !== null && delta > 0 && target >= autoCompleteAt) {
        target = 1
        autoCompleting = true
      }
      if (delta < 0) autoCompleting = false // scrolling back cancels auto-complete
      startLoop()
    }

    // Tracking para detectar cruces en scroll rápido
    let lastRectTop = Infinity

    const sectionAtTop = () => {
      const rect = el.getBoundingClientRect()
      const top = rect.top
      const prev = lastRectTop
      lastRectTop = top
      if (rect.bottom < window.innerHeight * 0.5) return false
      // Zona de detección: ±150px (seguro gracias al lockScrollY cacheado)
      if (top < 150 && top > -150) return true
      // Scroll rápido: la sección cruzó el viewport top entre frames
      if (prev > 0 && top < 0) return true
      return false
    }

    // Handler unificado para wheel y touch
    const handleDelta = (delta, preventDefault) => {
      if (scrollLockBypassed) return
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
    window.addEventListener('scroll', onScroll, { passive: true })

    return () => {
      unlock()
      if (rafId) cancelAnimationFrame(rafId)
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchmove', onTouchMove)
      window.removeEventListener('scroll', onScroll)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled])

  return { progress }
}

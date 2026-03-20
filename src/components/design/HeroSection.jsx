import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useScrollLock } from '../../hooks/useScrollLock'

export default function HeroSection({ image, title, subtitle, type, date }) {
  const sectionRef = useRef(null)
  const { progress } = useScrollLock(sectionRef, {
    lerpFactor: 0.07,
    wheelDivisor: 1400,
    touchDivisor: 500,
    reEngageAfterForward: true,
    autoCompleteAt: 0.92,
    autoCompleteLerpFactor: 0.25,
  })

  const letters = title ? title.split('') : []
  const totalLetters = letters.length
  const subLetters = subtitle ? subtitle.split('') : []
  const totalSubLetters = subLetters.length

  // Phase 1: 0–0.35 → title letters change color
  const colorRatio = Math.min(1, progress / 0.35)
  const coloredIndex = Math.round(colorRatio * totalLetters)
  const shadowAlpha = 1 - colorRatio

  // Phase 1.5: 0.35–0.62 → subtitle letters appear one by one (wider range = more time to read)
  const subRatio = Math.max(0, Math.min(1, (progress - 0.35) / 0.27))
  const visibleSubIndex = Math.round(subRatio * totalSubLetters)

  // Phase 2: 0.72–1.0 → title + subtitle lift up (delayed start gives reading pause)
  const liftRatio = Math.max(0, (progress - 0.72) / 0.28)
  const titleY = liftRatio * -110

  // Info bar fades out as title lifts
  const infoOpacity = Math.max(0, 1 - liftRatio * 3)

  // Post-animation: image stays sticky
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  })
  const imgScale = useTransform(scrollYProgress, [0.2, 0.7], [1, 1.03])
  const imgGrayscale = useTransform(scrollYProgress, [0.1, 0.4], [30, 0])

  return (
    <section ref={sectionRef} className="relative h-[120vh] md:h-[110vh]">
      <div
        className="sticky top-0 h-screen w-full overflow-hidden"
        style={{ backgroundColor: '#fcf8f9' }}
      >
        {/* Info bar */}
        {(type || date) && (
          <div
            className="absolute top-0 left-0 right-0 z-20 pt-24 pb-6 px-6 md:px-12 max-w-[1920px] mx-auto flex flex-wrap items-baseline gap-x-4 md:gap-x-8 gap-y-1 md:gap-y-2"
            style={{ opacity: infoOpacity }}
          >
            {type && (
              <span className="font-label text-[10px] uppercase tracking-[0.35em] text-outline">
                {type}
              </span>
            )}
            {date && (
              <span className="font-label text-[10px] uppercase tracking-[0.35em] text-outline">
                {date}
              </span>
            )}
          </div>
        )}

        <motion.div className="absolute inset-0" style={{ scale: imgScale }}>
          <motion.img
            src={image}
            alt={title || ''}
            className="w-full h-full object-contain mix-blend-multiply"
            style={{
              filter: useTransform(imgGrayscale, (v) => `grayscale(${v}%)`),
            }}
          />
        </motion.div>

        {title && (
          <div
            className="absolute inset-0 z-10 flex items-start justify-center pt-[20vh] md:pt-[15vh]"
            style={{ transform: `translateY(${titleY}vh)` }}
          >
            <div className="text-center px-6">
              <h1
                className="font-headline text-4xl sm:text-5xl md:text-8xl lg:text-9xl font-light tracking-tight"
                aria-label={title}
                style={{
                  textShadow: `0 2px 30px rgba(0,0,0,${0.25 * shadowAlpha}), 0 0 60px rgba(0,0,0,${0.15 * shadowAlpha})`,
                }}
              >
                {letters.map((char, i) => (
                  <span
                    key={i}
                    className="inline-block"
                    style={{
                      color: i < coloredIndex ? '#001a2c' : '#ffffff',
                      transition: 'color 0.4s cubic-bezier(0.22, 1, 0.36, 1)',
                    }}
                  >
                    {char === ' ' ? '\u00A0' : char}
                  </span>
                ))}
              </h1>
              {subtitle && (
                <p
                  className="font-headline italic text-lg md:text-2xl mt-3 md:mt-4 font-light"
                  aria-label={subtitle}
                >
                  {subLetters.map((char, i) => (
                    <span
                      key={i}
                      className="inline-block"
                      style={{
                        color: 'rgba(0,26,44,0.45)',
                        opacity: i < visibleSubIndex ? 1 : 0,
                        transition: 'opacity 0.5s cubic-bezier(0.22, 1, 0.36, 1)',
                      }}
                    >
                      {char === ' ' ? '\u00A0' : char}
                    </span>
                  ))}
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

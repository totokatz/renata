import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

export default function HeroSection({ image, title, subtitle }) {
  const containerRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  })

  const scale = useTransform(scrollYProgress, [0, 0.6], [0.6, 1])
  const grayscale = useTransform(scrollYProgress, [0, 0.6], [100, 0])
  const clipProgress = useTransform(scrollYProgress, [0.1, 0.5], [0, 100])

  return (
    <section ref={containerRef} className="relative h-[150vh]">
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center">
        <motion.div
          className="absolute inset-0"
          style={{ scale }}
        >
          <motion.img
            src={image}
            alt={title || ''}
            className="w-full h-full object-cover"
            style={{
              filter: useTransform(grayscale, (v) => `grayscale(${v}%)`),
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/10" />
        </motion.div>

        {title && (
          <div className="relative z-10 text-center px-6">
            <motion.h1
              className="font-headline text-5xl md:text-8xl lg:text-9xl font-light text-white tracking-tight"
              style={{
                clipPath: useTransform(
                  clipProgress,
                  (v) => `polygon(0 0, ${v}% 0, ${v}% 100%, 0 100%)`
                ),
              }}
            >
              {title}
            </motion.h1>
            {subtitle && (
              <motion.p
                className="font-headline italic text-lg md:text-2xl text-white/70 mt-4 font-light"
                style={{
                  clipPath: useTransform(
                    clipProgress,
                    (v) => `polygon(0 0, ${Math.max(0, v - 15)}% 0, ${Math.max(0, v - 15)}% 100%, 0 100%)`
                  ),
                }}
              >
                {subtitle}
              </motion.p>
            )}
          </div>
        )}
      </div>
    </section>
  )
}

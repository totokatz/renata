import { useRef } from 'react'
import { motion, useScroll, useTransform, useInView } from 'framer-motion'

export default function FullbleedSection({ image, caption }) {
  const containerRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  })

  const y = useTransform(scrollYProgress, [0, 1], [-40, 40])

  return (
    <section ref={containerRef} className="relative w-full overflow-hidden">
      <div className="relative h-[60vh] md:h-[85vh] overflow-hidden">
        <motion.img
          src={image}
          alt={caption || ''}
          className="w-full h-full object-cover scale-110"
          style={{ y }}
        />
        {/* Stronger gradient on mobile for caption readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 md:from-black/40 via-transparent to-transparent" />
      </div>

      {caption && (
        <div className="px-6 md:px-12 max-w-[1920px] mx-auto mt-6 md:mt-8">
          <LetterReveal text={caption} />
        </div>
      )}
    </section>
  )
}

function LetterReveal({ text }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.5 })

  const letters = text.split('')

  return (
    <h3
      ref={ref}
      className="font-headline text-2xl sm:text-3xl md:text-5xl font-light text-primary tracking-tight"
    >
      {letters.map((letter, i) => (
        <motion.span
          key={i}
          className="inline-block"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{
            duration: 0.4,
            ease: [0.22, 1, 0.36, 1],
            delay: i * 0.025,
          }}
        >
          {letter === ' ' ? '\u00A0' : letter}
        </motion.span>
      ))}
    </h3>
  )
}

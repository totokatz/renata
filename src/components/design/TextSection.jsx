import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

function Word({ word, progress, range }) {
  const opacity = useTransform(progress, range, [0.15, 1])
  return (
    <motion.span className="inline-block mr-[0.3em]" style={{ opacity }}>
      {word}
    </motion.span>
  )
}

export default function TextSection({ content }) {
  const containerRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 0.8', 'end 0.4'],
  })

  const words = content.split(' ')

  return (
    <section ref={containerRef} className="px-6 md:px-12 max-w-[1920px] mx-auto">
      <p
        className="font-headline text-2xl md:text-4xl lg:text-5xl font-light leading-relaxed text-primary max-w-5xl"
      >
        {words.map((word, i) => {
          const start = i / words.length
          const end = start + 1 / words.length
          return (
            <Word
              key={`${word}-${i}`}
              word={word}
              progress={scrollYProgress}
              range={[start, end]}
            />
          )
        })}
      </p>
    </section>
  )
}

import { useRef } from 'react'
import { motion, useScroll, useTransform, useInView } from 'framer-motion'

const ease = [0.22, 1, 0.36, 1]

export default function SplitSection({ image, text, direction = 'left' }) {
  const containerRef = useRef(null)
  const inView = useInView(containerRef, { once: true, margin: '-100px' })

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  })

  const imageY = useTransform(scrollYProgress, [0, 1], [40, -40])
  const textY = useTransform(scrollYProgress, [0, 1], [80, -80])

  const isLeft = direction === 'left'

  const clipFrom = isLeft ? 'inset(0 100% 0 0)' : 'inset(0 0 0 100%)'
  const clipTo = 'inset(0 0% 0 0%)'

  return (
    <section
      ref={containerRef}
      className="px-6 md:px-12 max-w-[1920px] mx-auto"
    >
      <div className={`grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center ${
        isLeft ? '' : 'md:[direction:rtl]'
      }`}>
        <motion.div
          className="relative aspect-[4/5] overflow-hidden bg-surface-container-low md:[direction:ltr]"
          style={{ y: imageY }}
        >
          <motion.div
            className="w-full h-full"
            initial={{ clipPath: clipFrom }}
            animate={inView ? { clipPath: clipTo } : { clipPath: clipFrom }}
            transition={{ duration: 0.9, ease }}
          >
            <img
              src={image}
              alt=""
              className="w-full h-full object-cover scale-105"
            />
          </motion.div>
        </motion.div>

        <motion.div
          className="flex flex-col justify-center md:[direction:ltr]"
          style={{ y: textY }}
        >
          <motion.p
            className="font-headline text-xl md:text-2xl font-light leading-relaxed text-on-surface-variant italic"
            initial={{ opacity: 0, y: 40 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease, delay: 0.3 }}
          >
            {text}
          </motion.p>
        </motion.div>
      </div>
    </section>
  )
}

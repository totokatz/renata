import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12 },
  },
}

const itemVariants = {
  hidden: {
    clipPath: 'circle(0% at 50% 50%)',
    opacity: 0,
  },
  visible: {
    clipPath: 'circle(100% at 50% 50%)',
    opacity: 1,
    transition: {
      clipPath: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
      opacity: { duration: 0.4 },
    },
  },
}

export default function GridSection({ images, columns = 3 }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  const colClass =
    columns === 2
      ? 'grid-cols-1 md:grid-cols-2'
      : columns === 4
        ? 'grid-cols-2 md:grid-cols-4'
        : 'grid-cols-1 md:grid-cols-3'

  return (
    <section ref={ref} className="px-6 md:px-12 max-w-[1920px] mx-auto">
      <motion.div
        className={`grid ${colClass} gap-4 md:gap-6`}
        variants={containerVariants}
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
      >
        {images.map((src, i) => (
          <motion.div
            key={i}
            className="relative aspect-square overflow-hidden bg-surface-container-low group"
            variants={itemVariants}
          >
            <img
              src={src}
              alt=""
              className="w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03]"
            />
          </motion.div>
        ))}
      </motion.div>
    </section>
  )
}

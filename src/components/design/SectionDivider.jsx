import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

export default function SectionDivider() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-50px' })

  return (
    <div ref={ref} className="py-16 md:py-24 max-w-[1920px] mx-auto px-6 md:px-12">
      <motion.div
        className="h-px bg-outline-variant/20"
        initial={{ scaleX: 0 }}
        animate={inView ? { scaleX: 1 } : { scaleX: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        style={{ transformOrigin: 'center' }}
      />
    </div>
  )
}

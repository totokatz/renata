import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

export default function ShowcaseSection({ images }) {
  const containerRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  })

  const count = images.length

  return (
    <section
      ref={containerRef}
      className="relative"
      style={{ height: `${count * 100}vh` }}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {images.map((src, i) => {
          const segStart = i / count
          const segEnd = (i + 1) / count

          return (
            <ShowcaseImage
              key={i}
              src={src}
              index={i}
              progress={scrollYProgress}
              segStart={segStart}
              segEnd={segEnd}
              isFirst={i === 0}
              isLast={i === count - 1}
              count={count}
            />
          )
        })}

        <Counter progress={scrollYProgress} count={count} />
      </div>
    </section>
  )
}

function ShowcaseImage({ src, progress, segStart, segEnd, isFirst, isLast }) {
  const opacity = useTransform(
    progress,
    isFirst
      ? [segStart, segEnd - 0.05, segEnd]
      : isLast
        ? [segStart - 0.05, segStart, segEnd]
        : [segStart - 0.05, segStart, segEnd - 0.05, segEnd],
    isFirst
      ? [1, 1, 0]
      : isLast
        ? [0, 1, 1]
        : [0, 1, 1, 0]
  )

  const scale = useTransform(
    progress,
    [segStart, segEnd],
    [1.0, 1.05]
  )

  return (
    <motion.div
      className="absolute inset-0"
      style={{ opacity }}
    >
      <motion.img
        src={src}
        alt=""
        className="w-full h-full object-cover"
        style={{ scale }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
    </motion.div>
  )
}

function Counter({ progress, count }) {
  return (
    <div className="absolute bottom-12 right-12 z-10 flex items-baseline gap-1">
      <CounterNumber progress={progress} count={count} />
      <span className="font-label text-xs text-white/50 tracking-widest">
        / {String(count).padStart(2, '0')}
      </span>
    </div>
  )
}

function CounterNumber({ progress, count }) {
  const display = useTransform(progress, (v) => {
    const idx = Math.min(Math.floor(v * count), count - 1)
    return String(idx + 1).padStart(2, '0')
  })

  return <motion.span className="font-label text-sm text-white/90 tracking-widest">{display}</motion.span>
}

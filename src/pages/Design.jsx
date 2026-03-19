import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { designProjects } from '../data/designProjects'

const gridVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.14, delayChildren: 0.08 },
  },
}

const cardVariants = {
  hidden: { opacity: 0, y: 60 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 50, damping: 18, mass: 1 },
  },
}

const colPatterns = [
  'md:col-start-1 md:col-span-7',
  'md:col-start-9 md:col-span-4',
  'md:col-start-2 md:col-span-5',
  'md:col-start-7 md:col-span-6',
]

export default function Design() {
  const cursorRef = useRef(null)
  const cursorHalf = useRef(16)

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${e.clientX - cursorHalf.current}px, ${e.clientY - cursorHalf.current}px, 0)`
      }
    }
    document.addEventListener('mousemove', handleMouseMove)

    const handleScroll = () => {
      document.querySelectorAll('.ghost-number').forEach((ghost) => {
        const rect = ghost.getBoundingClientRect()
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          const offset = (window.innerHeight / 2 - rect.top) * 0.14
          ghost.style.transform = `translateY(${offset}px)`
        }
      })
    }
    window.addEventListener('scroll', handleScroll, { passive: true })

    const items = document.querySelectorAll('.design-card')
    items.forEach((item) => {
      item.addEventListener('mouseenter', () => {
        cursorHalf.current = 40
        if (cursorRef.current) {
          cursorRef.current.style.width = '80px'
          cursorRef.current.style.height = '80px'
        }
      })
      item.addEventListener('mouseleave', () => {
        cursorHalf.current = 16
        if (cursorRef.current) {
          cursorRef.current.style.width = '32px'
          cursorRef.current.style.height = '32px'
        }
      })
    })

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return (
    <>
      <Navbar />

      <motion.main
        className="pt-40 pb-20 overflow-x-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { duration: 0.5, ease: 'easeOut' } }}
        exit={{ opacity: 0, transition: { duration: 0.2, ease: 'easeIn' } }}
      >
        <header className="px-6 md:px-12 max-w-[1920px] mx-auto mb-32 md:mb-48">
          <div className="max-w-4xl">
            <h1 className="font-headline text-6xl md:text-8xl font-light leading-[1.05] mb-8 tracking-tight">
              Dise<br />
              <span className="italic pl-12 md:pl-24">ño</span>
            </h1>
            <p className="font-label text-xs uppercase tracking-[0.3em] text-outline">
              {designProjects.length} proyectos
            </p>
          </div>
        </header>

        <motion.div
          className="px-6 md:px-12 max-w-[1920px] mx-auto grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8"
          variants={gridVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          {designProjects.map((project, i) => (
            <Link
              key={project.slug}
              to={`/diseño/${project.slug}`}
              className={`design-card block relative ${colPatterns[i % colPatterns.length]}`}
            >
              <div
                className="ghost-number absolute pointer-events-none select-none font-headline leading-none text-primary tracking-tighter opacity-[0.038]"
                style={{
                  fontSize: 'clamp(5rem, 16vw, 20rem)',
                  top: '-1rem',
                  right: i % 2 === 0 ? '-0.5rem' : 'auto',
                  left: i % 2 !== 0 ? '-0.5rem' : 'auto',
                  zIndex: 0,
                }}
              >
                {String(i + 1).padStart(2, '0')}
              </div>

              <DesignCard project={project} />
            </Link>
          ))}
        </motion.div>
      </motion.main>

      <Footer />

      <div
        ref={cursorRef}
        className="custom-cursor fixed top-0 left-0 w-8 h-8 border border-primary/20 rounded-full pointer-events-none z-[100] hidden md:block mix-blend-difference"
      />
    </>
  )
}

function DesignCard({ project }) {
  const cardRef = useRef(null)
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 })
  const [isHovered, setIsHovered] = useState(false)

  const handleMouseMove = (e) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    setMousePos({ x, y })
  }

  return (
    <motion.div
      ref={cardRef}
      variants={cardVariants}
      className="relative aspect-[3/4] overflow-hidden bg-surface-container-low group"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <img
        src={project.cover}
        alt={project.title}
        className="w-full h-full object-cover scale-105 transition-all duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] grayscale-[30%] group-hover:grayscale-0 group-hover:scale-100"
      />

      <div
        className="absolute inset-0 bg-gradient-to-t from-primary/85 via-primary/40 to-primary/10 flex flex-col justify-end p-8 md:p-10"
        style={{
          clipPath: isHovered
            ? `circle(150% at ${mousePos.x}% ${mousePos.y}%)`
            : `circle(0% at ${mousePos.x}% ${mousePos.y}%)`,
          transition:
            'clip-path 0.6s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.5s ease',
        }}
      >
        <p className="font-label text-[10px] uppercase tracking-[0.35em] text-white/60 mb-2">
          {project.type} · {project.date}
        </p>
        <h3 className="font-headline text-3xl md:text-4xl font-light text-white mb-4">
          {project.title}
        </h3>
        <span className="inline-flex items-center gap-2 text-white/70 font-label text-[10px] uppercase tracking-widest">
          Ver proyecto
          <span className="material-symbols-outlined text-sm">arrow_right_alt</span>
        </span>
      </div>
    </motion.div>
  )
}

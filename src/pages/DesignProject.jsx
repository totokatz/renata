import { useParams, Link, useNavigate } from 'react-router-dom'
import { useEffect, useRef, Suspense } from 'react'
import { motion } from 'framer-motion'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { designProjects } from '../data/designProjects'

import HeroSection from '../components/design/HeroSection'
import TextSection from '../components/design/TextSection'
import SplitSection from '../components/design/SplitSection'
import ShowcaseSection from '../components/design/ShowcaseSection'
import FullbleedSection from '../components/design/FullbleedSection'
import GridSection from '../components/design/GridSection'
import { lazy } from 'react'
const Model3DSection = lazy(() => import('../components/design/Model3DSection'))
import SectionDivider from '../components/design/SectionDivider'
import ScrollButtons from '../components/design/ScrollButtons'

const ease = [0.22, 1, 0.36, 1]

const sectionComponents = {
  hero: HeroSection,
  text: TextSection,
  split: SplitSection,
  showcase: ShowcaseSection,
  fullbleed: FullbleedSection,
  grid: GridSection,
  model3d: Model3DSection,
}

export default function DesignProject() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const project = designProjects.find((p) => p.slug === slug)
  const projectIndex = designProjects.findIndex((p) => p.slug === slug)
  const prevProject = projectIndex > 0 ? designProjects[projectIndex - 1] : null
  const nextProject = projectIndex < designProjects.length - 1 ? designProjects[projectIndex + 1] : null

  const cursorRef = useRef(null)
  const cursorHalf = useRef(16)

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [slug])

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${e.clientX - cursorHalf.current}px, ${e.clientY - cursorHalf.current}px, 0)`
      }
    }
    document.addEventListener('mousemove', handleMouseMove)
    return () => document.removeEventListener('mousemove', handleMouseMove)
  }, [])

  if (!project) return <div>Proyecto no encontrado</div>

  return (
    <>
      <Navbar />

      <motion.main
        className="pb-20 overflow-x-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { duration: 0.5, ease: 'easeOut' } }}
        exit={{ opacity: 0, transition: { duration: 0.2, ease: 'easeIn' } }}
      >
        {/* Sections */}
        <div className="space-y-12 md:space-y-24">
          {project.sections.map((section, i) => {
            const Component = sectionComponents[section.type]
            if (!Component) return null
            return (
              <div key={i}>
                <Suspense fallback={null}>
                  <Component {...section} title={section.type === 'hero' ? project.title : undefined} subtitle={section.type === 'hero' ? project.subtitle : undefined} type={section.type === 'hero' ? project.type : undefined} date={section.type === 'hero' ? project.date : undefined} />
                </Suspense>
                {i < project.sections.length - 1 && section.type !== 'hero' && <SectionDivider />}
              </div>
            )
          })}
        </div>

        {/* Prev / Next navigation */}
        <nav className="mt-20 md:mt-48 px-6 md:px-12 max-w-[1920px] mx-auto border-t border-outline-variant/20 pt-12 flex flex-col gap-8 md:flex-row md:gap-0 justify-between items-start md:items-center">
          {prevProject ? (
            <Link
              to={`/diseño/${prevProject.slug}`}
              className="group flex items-center gap-4 text-primary transition-all duration-700"
            >
              <span className="material-symbols-outlined transition-transform group-hover:-translate-x-2 group-active:-translate-x-1">arrow_left_alt</span>
              <div>
                <span className="font-label text-[9px] uppercase tracking-[0.4em] text-outline block">Anterior</span>
                <span className="font-headline text-lg font-light">{prevProject.title}</span>
              </div>
            </Link>
          ) : <div />}

          {nextProject ? (
            <Link
              to={`/diseño/${nextProject.slug}`}
              className="group flex items-center gap-4 text-primary transition-all duration-700 text-right self-end md:self-auto"
            >
              <div>
                <span className="font-label text-[9px] uppercase tracking-[0.4em] text-outline block">Siguiente</span>
                <span className="font-headline text-lg font-light">{nextProject.title}</span>
              </div>
              <span className="material-symbols-outlined transition-transform group-hover:translate-x-2 group-active:translate-x-1">arrow_right_alt</span>
            </Link>
          ) : <div />}
        </nav>

        {/* Back to index */}
        <div className="mt-8 md:mt-12 px-6 md:px-12 max-w-[1920px] mx-auto">
          <Link
            to="/diseño"
            className="group inline-flex items-center gap-4 text-primary transition-all duration-700"
          >
            <span className="material-symbols-outlined transition-transform group-hover:-translate-x-2 group-active:-translate-x-1">arrow_left_alt</span>
            <span className="font-label text-[10px] uppercase tracking-[0.4em]">Todos los proyectos</span>
          </Link>
        </div>
      </motion.main>

      <Footer />

      <ScrollButtons />

      {/* Custom cursor */}
      <div
        ref={cursorRef}
        className="custom-cursor fixed top-0 left-0 w-8 h-8 border border-primary/20 rounded-full pointer-events-none z-[100] hidden md:block mix-blend-difference"
      />
    </>
  )
}

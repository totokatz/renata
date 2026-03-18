import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { artworks } from '../data/artworks'
import heroImg from '../assets/waves-1.jpg'

export default function Home() {
  const cursorRef = useRef(null)

  useEffect(() => {
    const handleScroll = () => {
      const images = document.querySelectorAll('.parallax-img')
      images.forEach(img => {
        const rect = img.parentElement.getBoundingClientRect()
        const speed = 0.1
        const offset = (window.innerHeight - rect.top) * speed
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          img.style.transform = `scale(1.1) translateY(${offset - 20}px)`
        }
      })
    }

    const handleMouseMove = (e) => {
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${e.clientX - 16}px, ${e.clientY - 16}px, 0)`
      }
    }

    window.addEventListener('scroll', handleScroll)
    document.addEventListener('mousemove', handleMouseMove)

    return () => {
      window.removeEventListener('scroll', handleScroll)
      document.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])

  return (
    <>
      <Navbar />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { duration: 0.5, ease: 'easeOut' } }}
        exit={{ opacity: 0, transition: { duration: 0.2, ease: 'easeIn' } }}
      >

      {/* Hero — full-screen painting */}
      <section className="relative h-screen w-full overflow-hidden">
        <img
          src={heroImg}
          alt="Renata Nanni — Reflejos I"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ objectPosition: 'center center' }}
        />
        {/* Gradient for text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/55" />

        {/* Bottom-left: name + title */}
        <div className="absolute bottom-16 left-6 md:left-12" style={{ animation: 'heroFadeUp 1.4s cubic-bezier(0.22,1,0.36,1) both', animationDelay: '0.3s' }}>
          <p className="font-label text-[9px] uppercase tracking-[0.55em] text-white/55 mb-3">
            Renata Nanni
          </p>
          <h1 className="font-headline text-5xl md:text-8xl font-light text-white leading-none italic">
            Waves
          </h1>
        </div>

        {/* Bottom-right: scroll indicator */}
        <div className="absolute bottom-12 right-6 md:right-12 flex flex-col items-center gap-3" style={{ animation: 'heroFadeUp 1.4s cubic-bezier(0.22,1,0.36,1) both', animationDelay: '0.8s' }}>
          <span className="font-label text-[8px] uppercase tracking-[0.45em] text-white/35" style={{ writingMode: 'vertical-rl' }}>
            Scroll
          </span>
          <div className="w-px h-10 bg-white/25" style={{ animation: 'scrollPulse 2s ease-in-out infinite' }} />
        </div>
      </section>

      <main className="pb-20">
        {/* Header Section */}
        <header className="px-6 md:px-12 max-w-[1920px] mx-auto mb-32 pt-32">
          <div className="max-w-4xl">
            <h1 className="font-headline text-6xl md:text-8xl font-light leading-tight mb-8">
              Obras<br />
              <span className="italic pl-12 md:pl-24">Selectas</span>
            </h1>
            <p className="font-label text-xs uppercase tracking-[0.3em] text-outline">
              Exploraciones de movimiento y luz
            </p>
          </div>
        </header>

        {/* Asymmetrical Editorial Gallery Grid */}
        <section className="px-6 md:px-12 max-w-[1920px] mx-auto space-y-40 md:space-y-64">

          {/* Row 1: Large Featured (Right Aligned) */}
          <div className="flex flex-col md:flex-row justify-end items-start gap-12">
            <Link to={`/artwork/${artworks[0].id}`} className="w-full md:w-3/5 gallery-item block">
              <div className="parallax-container aspect-[4/5] bg-surface-container-low">
                <img
                  src={artworks[0].image}
                  alt={artworks[0].title}
                  className="parallax-img w-full h-full object-cover"
                />
              </div>
              <div className="mt-8">
                <p className="font-label text-[10px] uppercase tracking-[0.25em] text-on-surface">{artworks[0].title}</p>
                <p className="font-body text-xs text-outline mt-2 italic">{artworks[0].medium}</p>
              </div>
            </Link>
          </div>

          {/* Row 2: Two Asymmetrical Columns */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
            <Link to={`/artwork/${artworks[1].id}`} className="md:col-start-2 md:col-span-4 gallery-item block">
              <div className="parallax-container aspect-square bg-surface-container-low">
                <img
                  src={artworks[1].image}
                  alt={artworks[1].title}
                  className="parallax-img w-full h-full object-cover"
                />
              </div>
              <div className="mt-8">
                <p className="font-label text-[10px] uppercase tracking-[0.25em] text-on-surface">{artworks[1].title}</p>
              </div>
            </Link>

            <Link to={`/artwork/${artworks[2].id}`} className="md:col-start-8 md:col-span-5 gallery-item block">
              <div className="parallax-container aspect-[16/10] bg-surface-container-low">
                <img
                  src={artworks[2].image}
                  alt={artworks[2].title}
                  className="parallax-img w-full h-full object-cover"
                />
              </div>
              <div className="mt-8">
                <p className="font-label text-[10px] uppercase tracking-[0.25em] text-on-surface">{artworks[2].title}</p>
              </div>
            </Link>
          </div>

          {/* Row 3: Centered Vertical Focus */}
          <div className="flex justify-center items-start">
            <Link to={`/artwork/${artworks[3].id}`} className="w-full md:w-2/5 gallery-item block">
              <div className="parallax-container aspect-[3/4] bg-surface-container-low">
                <img
                  src={artworks[3].image}
                  alt={artworks[3].title}
                  className="parallax-img w-full h-full object-cover"
                />
              </div>
              <div className="mt-8 text-center md:text-left">
                <p className="font-label text-[10px] uppercase tracking-[0.25em] text-on-surface">{artworks[3].title}</p>
                <p className="font-body text-xs text-outline mt-2 max-w-xs">{artworks[3].description}</p>
              </div>
            </Link>
          </div>

          {/* Row 4: Wide Bleed */}
          <div className="w-full pt-20">
            <Link to={`/artwork/${artworks[4].id}`} className="gallery-item block">
              <div className="parallax-container h-[400px] md:h-[716px] w-full bg-surface-container-low">
                <img
                  src={artworks[4].image}
                  alt={artworks[4].title}
                  className="parallax-img w-full h-full object-cover"
                />
              </div>
              <div className="mt-8 flex justify-between items-baseline border-t border-outline-variant/20 pt-8">
                <p className="font-label text-[10px] uppercase tracking-[0.25em] text-on-surface">{artworks[4].title}</p>
                <span className="font-label text-[10px] uppercase tracking-[0.25em] text-primary border-b border-primary/40 hover:border-primary transition-colors">
                  Ver Serie
                </span>
              </div>
            </Link>
          </div>

          {/* Row 5: Intensidad I — left-aligned portrait */}
          <div className="flex flex-col md:flex-row justify-start items-start gap-12">
            <Link to={`/artwork/${artworks[4].id}`} className="w-full md:w-2/5 gallery-item block">
              <div className="parallax-container aspect-[4/5] bg-surface-container-low">
                <img
                  src={artworks[4].image}
                  alt={artworks[4].title}
                  className="parallax-img w-full h-full object-cover"
                />
              </div>
              <div className="mt-8">
                <p className="font-label text-[10px] uppercase tracking-[0.25em] text-on-surface">{artworks[4].title}</p>
                <p className="font-body text-xs text-outline mt-2 italic">{artworks[4].medium}</p>
              </div>
            </Link>
          </div>

          {/* Row 6: Intensidad II — right-aligned */}
          <div className="flex flex-col md:flex-row justify-end items-start gap-12">
            <Link to={`/artwork/${artworks[5].id}`} className="w-full md:w-3/5 gallery-item block">
              <div className="parallax-container aspect-[4/5] bg-surface-container-low">
                <img
                  src={artworks[5].image}
                  alt={artworks[5].title}
                  className="parallax-img w-full h-full object-cover"
                />
              </div>
              <div className="mt-8">
                <p className="font-label text-[10px] uppercase tracking-[0.25em] text-on-surface">{artworks[5].title}</p>
                <p className="font-body text-xs text-outline mt-2 italic">{artworks[5].medium}</p>
              </div>
            </Link>
          </div>

        </section>

        {/* Newsletter / Contact Teaser */}
        <section className="mt-64 px-6 md:px-12 py-32 bg-surface-container-low text-center">
          <h2 className="font-headline text-4xl md:text-6xl mb-12">Guarda el silencio.</h2>
          <form className="max-w-md mx-auto flex flex-col gap-8" onSubmit={e => e.preventDefault()}>
            <div className="relative">
              <input
                type="email"
                className="w-full bg-transparent border-0 border-b border-outline-variant py-4 font-label text-[10px] tracking-widest focus:ring-0 focus:border-primary placeholder:text-outline-variant uppercase"
                placeholder="TU CORREO ELECTRÓNICO"
              />
            </div>
            <button
              type="submit"
              className="bg-primary text-on-primary py-6 font-label text-[10px] tracking-[0.3em] uppercase hover:bg-primary-container transition-all duration-500"
            >
              Suscribirse al Estudio
            </button>
          </form>
        </section>
      </main>

      <Footer />

      </motion.div>

      {/* Custom Cursor */}
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 w-8 h-8 border border-primary/20 rounded-full pointer-events-none z-[100] hidden md:block mix-blend-difference"
      />
    </>
  )
}

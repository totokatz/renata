import { Link, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const links = [
  { to: '/', label: 'Obras Selectas' },
  { to: '/collections', label: 'Colecciones' },
  { to: '/diseño', label: 'Diseño' },
  { to: '/inquire', label: 'Consultar' },
]

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { pathname } = useLocation()
  const isHome = pathname === '/'
  const isCollections = pathname === '/collections'
  const isDesign = pathname === '/diseño' || pathname.startsWith('/diseño/')
  const transparent = isHome && !scrolled && !menuOpen

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 80)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Lock body scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  const close = () => setMenuOpen(false)

  return (
    <>
      <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-700 ${
        transparent
          ? 'bg-transparent'
          : 'bg-white/70 backdrop-blur-md shadow-[0_20px_40px_rgba(0,26,44,0.06)]'
      }`}>
        <div className="flex justify-between items-center w-full px-6 md:px-12 py-4 md:py-6 max-w-[1920px] mx-auto">
          <Link to="/" onClick={() => { window.scrollTo(0, 0); close() }} className={`text-xl md:text-2xl font-light tracking-tighter font-headline transition-colors duration-700 ${
            transparent ? 'text-white' : 'text-primary'
          }`}>
            Renata Nanni
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center space-x-12">
            <Link to="/" className={`font-label tracking-widest text-xs uppercase whitespace-nowrap transition-all duration-700 ease-in-out hover:tracking-[0.2em] ${
              isHome
                ? `font-medium border-b ${transparent ? 'text-white/90 border-white/30 hover:text-white' : 'text-primary border-slate-900/20 hover:text-primary'}`
                : `${transparent ? 'text-white/70 hover:text-white' : 'text-on-surface-variant hover:text-primary'}`
            }`}>
              Obras Selectas
            </Link>
            <Link to="/collections" className={`font-label tracking-widest text-xs uppercase whitespace-nowrap transition-all duration-700 ease-in-out hover:tracking-[0.2em] ${
              isCollections
                ? `font-medium border-b ${transparent ? 'text-white/90 border-white/30 hover:text-white' : 'text-primary border-slate-900/20 hover:text-primary'}`
                : `${transparent ? 'text-white/70 hover:text-white' : 'text-on-surface-variant hover:text-primary'}`
            }`}>
              Colecciones
            </Link>
            <Link to="/diseño" className={`font-label tracking-widest text-xs uppercase whitespace-nowrap transition-all duration-700 ease-in-out hover:tracking-[0.2em] ${
              isDesign
                ? `font-medium border-b ${transparent ? 'text-white/90 border-white/30 hover:text-white' : 'text-primary border-slate-900/20 hover:text-primary'}`
                : `${transparent ? 'text-white/70 hover:text-white' : 'text-on-surface-variant hover:text-primary'}`
            }`}>
              Diseño
            </Link>
            <Link to="/inquire" className={`font-label tracking-widest text-xs uppercase whitespace-nowrap transition-all duration-700 ease-in-out hover:tracking-[0.2em] ${
              transparent ? 'text-white/70 hover:text-white' : 'text-on-surface-variant hover:text-primary'
            }`}>
              Consultar
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            className={`md:hidden transition-colors duration-700 z-[60] relative ${menuOpen ? 'text-primary' : transparent ? 'text-white' : 'text-primary'}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <span className="material-symbols-outlined">
              {menuOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </nav>

      {/* Mobile full-screen overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="fixed inset-0 z-40 md:hidden flex flex-col bg-white"
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] } }}
            exit={{ opacity: 0, y: -16, transition: { duration: 0.2, ease: 'easeIn' } }}
          >
            {/* Links */}
            <div className="flex flex-col justify-center flex-1 px-8 gap-2 mt-16">
              {links.map(({ to, label }, i) => {
                const active = pathname === to
                return (
                  <motion.div
                    key={to}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0, transition: { delay: 0.1 + i * 0.07, duration: 0.4, ease: [0.22, 1, 0.36, 1] } }}
                  >
                    <Link
                      to={to}
                      onClick={close}
                      className={`block font-headline font-light leading-none py-5 border-b border-outline-variant/20 transition-colors duration-300 ${
                        active ? 'text-primary' : 'text-on-surface-variant'
                      }`}
                      style={{ fontSize: 'clamp(2rem, 10vw, 3rem)' }}
                    >
                      {active && (
                        <span className="font-label text-[9px] uppercase tracking-[0.4em] text-outline block mb-2">
                          Actual
                        </span>
                      )}
                      {label}
                    </Link>
                  </motion.div>
                )
              })}
            </div>

            {/* Footer del overlay */}
            <motion.div
              className="px-8 pb-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { delay: 0.35, duration: 0.4 } }}
            >
              <p className="font-label text-[9px] uppercase tracking-[0.4em] text-outline">
                Renata Nanni — Arte Contemporáneo
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

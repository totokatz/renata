import { Link, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { pathname } = useLocation()
  const isHome = pathname === '/'
  const isCollections = pathname === '/collections'
  const transparent = isHome && !scrolled

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 80)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-700 ${
      transparent
        ? 'bg-transparent'
        : 'bg-white/70 backdrop-blur-md shadow-[0_20px_40px_rgba(0,26,44,0.06)]'
    }`}>
      <div className="flex justify-between items-center w-full px-6 md:px-12 py-4 md:py-6 max-w-[1920px] mx-auto">
        <Link to="/" onClick={() => window.scrollTo(0, 0)} className={`text-xl md:text-2xl font-light tracking-tighter font-headline transition-colors duration-700 ${
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
          <Link to="/inquire" className={`font-label tracking-widest text-xs uppercase whitespace-nowrap transition-all duration-700 ease-in-out hover:tracking-[0.2em] ${
            transparent ? 'text-white/70 hover:text-white' : 'text-on-surface-variant hover:text-primary'
          }`}>
            Consultar
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className={`md:hidden transition-colors duration-700 ${transparent ? 'text-white' : 'text-primary'}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span className="material-symbols-outlined">
            {menuOpen ? 'close' : 'menu'}
          </span>
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-md px-6 pb-6 flex flex-col gap-6">
          <Link to="/" onClick={() => setMenuOpen(false)} className="text-primary font-label tracking-widest text-xs uppercase">Obras Selectas</Link>
          <Link to="/collections" onClick={() => setMenuOpen(false)} className="text-on-surface-variant font-label tracking-widest text-xs uppercase">Colecciones</Link>
          <Link to="/inquire" onClick={() => setMenuOpen(false)} className="text-on-surface-variant font-label tracking-widest text-xs uppercase">Consultar</Link>
        </div>
      )}
    </nav>
  )
}

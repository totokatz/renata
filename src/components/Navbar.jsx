import { Link } from 'react-router-dom'
import { useState } from 'react'

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-white/70 backdrop-blur-md shadow-[0_20px_40px_rgba(0,26,44,0.06)]">
      <div className="flex justify-between items-center w-full px-6 md:px-12 py-4 md:py-6 max-w-[1920px] mx-auto">
        <Link to="/" className="text-xl md:text-2xl font-light tracking-tighter text-slate-900 font-headline">
          Renata Nanni
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center space-x-12">
          <Link to="/" className="text-slate-900 font-medium border-b border-slate-900/20 font-label tracking-widest text-xs uppercase hover:text-slate-900 transition-all duration-700 ease-in-out hover:tracking-[0.2em]">
            Selected Works
          </Link>
          <Link to="/story" className="text-slate-500 font-label tracking-widest text-xs uppercase hover:text-slate-900 transition-all duration-700 ease-in-out hover:tracking-[0.2em]">
            Story
          </Link>
          <Link to="/inquire" className="text-slate-500 font-label tracking-widest text-xs uppercase hover:text-slate-900 transition-all duration-700 ease-in-out hover:tracking-[0.2em]">
            Inquire
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-primary"
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
          <Link to="/" onClick={() => setMenuOpen(false)} className="text-slate-900 font-label tracking-widest text-xs uppercase">Selected Works</Link>
          <Link to="/story" onClick={() => setMenuOpen(false)} className="text-slate-500 font-label tracking-widest text-xs uppercase">Story</Link>
          <Link to="/inquire" onClick={() => setMenuOpen(false)} className="text-slate-500 font-label tracking-widest text-xs uppercase">Inquire</Link>
        </div>
      )}
    </nav>
  )
}

import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { collections } from '../data/collections'
import { artworks as allArtworks } from '../data/artworks'

export default function Collections() {
  const cursorRef = useRef(null)
  const cursorHalf = useRef(16)

  useEffect(() => {
    // ── Cursor follow ──────────────────────────────────────
    const handleMouseMove = (e) => {
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${e.clientX - cursorHalf.current}px, ${e.clientY - cursorHalf.current}px, 0)`
      }
    }
    document.addEventListener('mousemove', handleMouseMove)

    // ── Intersection Observer for reveal animations ────────
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed')
          }
        })
      },
      { threshold: 0.08, rootMargin: '0px 0px -50px 0px' }
    )
    document.querySelectorAll('.reveal-clip, .reveal-up, .reveal-ghost').forEach((el) =>
      observer.observe(el)
    )

    // ── Scroll parallax ────────────────────────────────────
    const handleScroll = () => {
      // Ghost numbers parallax
      document.querySelectorAll('.ghost-number').forEach((ghost) => {
        const rect = ghost.getBoundingClientRect()
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          const offset = (window.innerHeight / 2 - rect.top) * 0.14
          ghost.style.transform = `translateY(${offset}px)`
        }
      })
      // Image parallax
      document.querySelectorAll('.artwork-img').forEach((img) => {
        const rect = img.parentElement.getBoundingClientRect()
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          const offset = (window.innerHeight - rect.top) * 0.07
          img.style.transform = `scale(1.08) translateY(${offset - 18}px)`
        }
      })
    }
    window.addEventListener('scroll', handleScroll, { passive: true })

    // ── Cursor size on artwork hover ───────────────────────
    const items = document.querySelectorAll('.collection-artwork')
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
      observer.disconnect()
    }
  }, [])

  return (
    <>
      <Navbar />

      <main className="pt-40 pb-20 overflow-x-hidden">
        {/* ── Page header ─────────────────────────────────── */}
        <header className="px-6 md:px-12 max-w-[1920px] mx-auto mb-32 md:mb-48">
          <div className="max-w-4xl">
            <h1 className="font-headline text-6xl md:text-8xl font-light leading-[1.05] mb-8 tracking-tight">
              Colec<br />
              <span className="italic pl-12 md:pl-24">ciones</span>
            </h1>
            <p className="font-label text-xs uppercase tracking-[0.3em] text-outline">
              Dos series · Ocho obras
            </p>
          </div>
        </header>

        {/* ── Collection sections ──────────────────────────── */}
        <div className="space-y-48 md:space-y-80">
          {collections.map((collection, index) => {
            const works = collection.artworkIds
              .map((id) => allArtworks.find((a) => a.id === id))
              .filter(Boolean)
            return (
              <CollectionSection
                key={collection.id}
                collection={collection}
                artworks={works}
                flipped={index % 2 !== 0}
              />
            )
          })}
        </div>
      </main>

      <Footer />

      {/* ── Custom cursor ────────────────────────────────── */}
      <div
        ref={cursorRef}
        className="custom-cursor fixed top-0 left-0 w-8 h-8 border border-primary/20 rounded-full pointer-events-none z-[100] hidden md:block mix-blend-difference"
      />
    </>
  )
}

/* ──────────────────────────────────────────────────────────── */

function CollectionSection({ collection, artworks, flipped }) {
  return (
    <section className="relative px-6 md:px-12 max-w-[1920px] mx-auto">
      {/* Ghost number — absolute, behind everything */}
      <div
        className="ghost-number reveal-ghost absolute pointer-events-none select-none font-headline leading-none text-primary tracking-tighter"
        style={{
          fontSize: 'clamp(7rem, 22vw, 28rem)',
          top: '-2rem',
          right: flipped ? 'auto' : '-1rem',
          left: flipped ? '-1rem' : 'auto',
          zIndex: 0,
        }}
      >
        {collection.number}
      </div>

      {/* ── Collection header ──────────────────────────────── */}
      <div className={`relative z-10 mb-16 md:mb-20 ${flipped ? 'md:text-right' : ''}`}>
        <p
          className="reveal-up font-label text-[10px] uppercase tracking-[0.45em] text-outline mb-3"
        >
          Serie
        </p>

        {/* Clip-path title wipe */}
        <div className="overflow-hidden mb-5">
          <h2
            className="reveal-clip font-headline font-light text-primary leading-[1.0]"
            style={{ fontSize: 'clamp(3.5rem, 9vw, 9rem)' }}
          >
            {collection.name}
          </h2>
        </div>

        <p
          className="reveal-up font-headline italic text-on-surface-variant font-light leading-snug"
          style={{
            fontSize: 'clamp(1.1rem, 2vw, 1.7rem)',
            '--reveal-delay': '220ms',
          }}
        >
          {collection.tagline}
        </p>

        <p
          className="reveal-up font-label text-[10px] uppercase tracking-[0.3em] text-outline mt-4"
          style={{ '--reveal-delay': '340ms' }}
        >
          {collection.years} &nbsp;·&nbsp; {artworks.length} obras
        </p>
      </div>

      {/* ── Artwork grid ───────────────────────────────────── */}
      <div className="relative z-10">
        <ArtworkGrid artworks={artworks} flipped={flipped} />
      </div>

      {/* ── Section separator ──────────────────────────────── */}
      <div
        className="reveal-up mt-20 md:mt-28 pt-8 border-t border-outline-variant/20 flex justify-between items-center"
        style={{ '--reveal-delay': '480ms' }}
      >
        <span className="font-label text-[10px] uppercase tracking-[0.35em] text-outline">
          {collection.number} / 02
        </span>
        <span className="font-label text-[10px] uppercase tracking-[0.35em] text-outline">
          {collection.years}
        </span>
      </div>
    </section>
  )
}

/* ──────────────────────────────────────────────────────────── */

function ArtworkGrid({ artworks, flipped }) {
  // 12-col asymmetric editorial layout, mirrored when flipped
  const layout = flipped
    ? [
        // Artwork 1 — large, right side
        { col: 'md:col-start-6 md:col-span-7', row: 'md:row-start-1', self: '' },
        // Artwork 2 — medium, left, bottom-aligned
        { col: 'md:col-start-1 md:col-span-4', row: 'md:row-start-1', self: 'md:self-end' },
        // Artwork 3 — wide landscape, center-left offset
        { col: 'md:col-start-3 md:col-span-6', row: '', self: 'md:-mt-12' },
        // Artwork 4 — square, right
        { col: 'md:col-start-9 md:col-span-4', row: '', self: '' },
      ]
    : [
        // Artwork 1 — large, left side
        { col: 'md:col-start-1 md:col-span-7', row: 'md:row-start-1', self: '' },
        // Artwork 2 — medium, right, bottom-aligned
        { col: 'md:col-start-9 md:col-span-4', row: 'md:row-start-1', self: 'md:self-end' },
        // Artwork 3 — wide landscape, left offset
        { col: 'md:col-start-2 md:col-span-6', row: '', self: 'md:-mt-12' },
        // Artwork 4 — square, right
        { col: 'md:col-start-8 md:col-span-5', row: '', self: '' },
      ]

  const aspects = ['aspect-[4/5]', 'aspect-[3/4]', 'aspect-[16/9]', 'aspect-square']
  const delays = [0, 140, 280, 420]

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-5 md:gap-7">
      {artworks.map((artwork, i) => {
        if (!artwork) return null
        const pos = layout[i]
        return (
          <Link
            key={artwork.id}
            to={`/artwork/${artwork.id}`}
            className={`collection-artwork block ${pos.col} ${pos.row} ${pos.self}`}
          >
            <ArtworkCard artwork={artwork} aspect={aspects[i]} delay={delays[i]} />
          </Link>
        )
      })}
    </div>
  )
}

/* ──────────────────────────────────────────────────────────── */

function ArtworkCard({ artwork, aspect, delay }) {
  return (
    <div
      className="reveal-up"
      style={{ '--reveal-delay': `${delay}ms` }}
    >
      {/* Image container */}
      <div className={`parallax-container ${aspect} bg-surface-container-low relative overflow-hidden`}>
        <img
          src={artwork.image}
          alt={artwork.title}
          className="artwork-img w-full h-full object-cover"
        />

        {/* Hover overlay — gradient fade */}
        <div className="artwork-overlay absolute inset-0 bg-gradient-to-t from-primary/85 via-primary/20 to-transparent flex flex-col justify-end p-6 md:p-8">
          <div className="artwork-info">
            <p className="font-label text-[10px] uppercase tracking-[0.3em] text-on-primary mb-1">
              {artwork.title}
            </p>
            {artwork.medium && (
              <p className="font-body text-xs text-on-primary/60 italic">
                {artwork.medium}
              </p>
            )}
            <span className="mt-4 inline-flex items-center gap-2 text-on-primary/70 font-label text-[10px] uppercase tracking-widest">
              Ver obra
              <span className="material-symbols-outlined text-sm">arrow_right_alt</span>
            </span>
          </div>
        </div>
      </div>

      {/* Title below image — visible always */}
      <div className="mt-5">
        <p className="font-label text-[10px] uppercase tracking-[0.25em] text-on-surface">
          {artwork.title}
        </p>
        {artwork.medium && (
          <p className="font-body text-[11px] text-outline mt-1 italic">{artwork.medium}</p>
        )}
      </div>
    </div>
  )
}

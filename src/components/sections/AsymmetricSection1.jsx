const IMAGE_URL = 'https://lh3.googleusercontent.com/aida-public/AB6AXuDTpAsBY6d8ObIQapkzt49QtTWW23nUqPQeMbGxeg07aMJ1qP7QIuk4s6SAwViRzs5HaqiYeF-J3fv5kBcwttIXLuOInXhGvA4GpKOJn2N05L1jAWlPZtKJfMBVXIjgpPCQ3IY5YeDDPCkpPgzU7p1Hav8vRBchTZVGmEe0llaPh9YYPYXqL_61dUXiut7euEP6XQZ0jWoNb3E9MHNuMwCSbA7hhljzpbA-Fuf9O2Q2c2XK7IuZ3R-RxkW5ySvA49VVBDkpJKQMTSAP'

export default function AsymmetricSection1() {
  return (
    <section className="w-full py-16 md:py-40 flex flex-col items-center">
      <div className="w-full max-w-7xl px-6 md:px-12 grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-20 items-center">
        <div className="md:col-span-8 md:col-start-1">
          <img
            src={IMAGE_URL}
            alt="Detailed artwork fragment — close up of textured oil painting strokes"
            className="w-full aspect-[4/5] object-cover shadow-[0_20px_40px_rgba(0,26,44,0.06)]"
          />
        </div>
        <div className="md:col-span-4 md:col-start-9">
          <div className="space-y-6 md:space-y-8">
            <span className="font-label text-[0.65rem] tracking-[0.3em] uppercase text-on-surface-variant">
              The Medium
            </span>
            <h2 className="font-headline text-3xl md:text-4xl text-primary leading-tight">
              Pigment and <br /> Atmospheric Tension
            </h2>
            <p className="font-body text-sm leading-loose text-on-surface-variant/80">
              Renata's process begins in the quiet. By layering translucent glazes, she captures the
              weightless suspension of particles in water, translating physical mass into ethereal presence.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

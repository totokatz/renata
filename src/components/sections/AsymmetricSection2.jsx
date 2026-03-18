import { Link } from 'react-router-dom'

const IMAGE_URL = 'https://lh3.googleusercontent.com/aida-public/AB6AXuCKYtx1gR9WwGI4nbnFfH1FeoXFmBAyimEXT7huThULeQBjwYMaYkxGkTOSPRdK01Atgb3QEViON7SeY64FpNqC7S6bOA0Xxtu979BVVd41H8SzzTNT7JkCShHc_7b7cnJgHHZ_cfWBbTQqMEfpaH432QTHrqcR2KVvOggvzrVp1O8nP7SxfS8tQc5nuWFSZs2H4ghyFSdOiDjFlVIRozoLnFYc2VyaS_OC_TRnlw7aaLTcYro1wTCquvbRUDQ_Mf3bL7kE3MOv9-zQ'

export default function AsymmetricSection2() {
  return (
    <section className="w-full py-16 md:py-40 flex flex-col items-center">
      <div className="w-full max-w-7xl px-6 md:px-12 grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-20 items-center">
        {/* Text — order-2 on mobile, order-1 on desktop */}
        <div className="md:col-span-3 md:col-start-2 order-2 md:order-1">
          <div className="space-y-6 md:space-y-8">
            <span className="font-label text-[0.65rem] tracking-[0.3em] uppercase text-on-surface-variant">
              The Collection
            </span>
            <h2 className="font-headline text-3xl md:text-4xl text-primary leading-tight">
              Reflections <br /> on Submergence
            </h2>
            <p className="font-body text-sm leading-loose text-on-surface-variant/80">
              A series exploring the threshold where sight dissolves into feeling. Each piece acts as a
              window into a submerged architecture of memory.
            </p>
            <Link
              to="/gallery"
              className="inline-block font-label text-[0.7rem] tracking-widest uppercase border-b border-primary/20 pb-2 hover:border-primary transition-colors"
            >
              View Series
            </Link>
          </div>
        </div>
        {/* Image — order-1 on mobile, order-2 on desktop */}
        <div className="md:col-span-7 md:col-start-6 order-1 md:order-2">
          <img
            src={IMAGE_URL}
            alt="Large canvas painting in a minimalist white gallery"
            className="w-full aspect-square object-cover shadow-[0_20px_40px_rgba(0,26,44,0.06)]"
          />
        </div>
      </div>
    </section>
  )
}

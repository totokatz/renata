const IMAGE_URL = 'https://lh3.googleusercontent.com/aida-public/AB6AXuAer1Fy96bZG5w9fDmllTWCpM0REPpZOaORIOTZde2KGnbLhXw44PIRUUO5hviPd9IEI8KInaG_I3FX8ZxPOu-nFtIYheLL2Bo0HcCI0rAMmZPgzJNh73s8s86zAE3epp-YFCYFH_rIYkZ5AkEjSRZfs7OuMj_EwdilJQPJRzTRP1R0PljHfhJwfGSzjYHfbtfhEMX99ATAbBPdRsEiVqqzcLX-9ZeRR1XRULivfRJwKGyoeaXOzzfU2siC-X_aDprOamwgCtrhujj1'

export default function StudioSection() {
  return (
    <section className="w-full py-24 md:py-40">
      <div className="max-w-[1920px] mx-auto px-6 md:px-12">
        <div className="relative w-full aspect-[4/3] sm:aspect-[16/9] md:aspect-[21/9] overflow-hidden">
          <img
            src={IMAGE_URL}
            alt="Modern minimalist sunlit art studio with tall windows"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-primary/5" />
          <div className="absolute bottom-8 left-8 sm:bottom-12 sm:left-12 md:bottom-24 md:left-24 text-white">
            <span className="font-label text-[0.65rem] tracking-[0.4em] uppercase opacity-70">
              The Space
            </span>
            <p className="font-headline text-2xl sm:text-3xl md:text-5xl mt-3 md:mt-4">
              Where silence <br /> finds its form.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

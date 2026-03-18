export default function IntroSection() {
  return (
    <section className="w-full py-24 md:py-40 lg:py-64 bg-background">
      <div className="max-w-4xl mx-auto px-6 md:px-12 text-center">
        <p className="font-headline text-xl sm:text-2xl md:text-4xl italic text-on-surface-variant leading-relaxed">
          A dialogue between light and matter through the lens of Renata Nanni.
        </p>
        <div className="mt-12 md:mt-20">
          <button className="px-8 md:px-12 py-4 md:py-5 bg-primary text-on-primary font-label tracking-[0.25em] text-xs uppercase transition-all duration-700 ease-in-out hover:bg-primary-container hover:tracking-[0.35em] focus:outline-none">
            Enter the Gallery
          </button>
        </div>
      </div>
    </section>
  )
}

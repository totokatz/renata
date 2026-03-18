import { useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { artworks } from '../data/artworks'

const ease = [0.22, 1, 0.36, 1]

const itemVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease, delay: 0.35 + i * 0.1 }
  })
}

export default function ArtworkDetail() {
  const { id } = useParams()
  const artwork = artworks.find(a => a.id === id) ?? artworks[0]

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [id])

  return (
    <>
      <Navbar />

      {/* Page wrapper — coordina toda la entrada y salida */}
      <motion.main
        className="min-h-screen pt-32 pb-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { duration: 0.45, ease: 'easeOut' } }}
        exit={{ opacity: 0, transition: { duration: 0.2, ease: 'easeIn' } }}
      >
        {/* Split Layout Section */}
        <section className="max-w-[1920px] mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0 md:gap-24 items-start">

            {/* Image — entra con zoom sutil desde adentro */}
            <motion.div
              className="relative w-full aspect-[4/5] md:aspect-[3/4] overflow-hidden bg-surface-container-low"
              initial={{ opacity: 0, scale: 1.06 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.1, ease }}
            >
              <img
                src={artwork.detailImage || artwork.image}
                alt={artwork.title}
                className="w-full h-full object-cover opacity-90"
                style={{ filter: 'grayscale(20%) contrast(110%)' }}
              />
              <div className="absolute inset-0 bg-primary/5 pointer-events-none" />
            </motion.div>

            {/* Content — cada elemento entra escalonado */}
            <div className="flex flex-col pt-12 md:pt-24 max-w-xl">

              <motion.span
                custom={0}
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                className="text-xs uppercase tracking-[0.3em] text-outline mb-8 block"
              >
                Sobre la Práctica
              </motion.span>

              <motion.h1
                custom={1}
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                className="font-headline text-5xl md:text-7xl font-light leading-[1.1] text-primary mb-12 tracking-tight"
              >
                La Artista detrás del Silencio
              </motion.h1>

              <motion.div
                custom={2}
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                className="font-headline text-lg md:text-xl text-on-surface-variant leading-relaxed space-y-8 font-light italic"
              >
                {artwork.story.map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))}
              </motion.div>

              <motion.div
                custom={3}
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                className="mt-20 pt-12 border-t border-outline-variant/20 flex flex-col gap-8"
              >
                <div className="flex items-center gap-4">
                  <span className="material-symbols-outlined text-primary-container" style={{ fontVariationSettings: "'wght' 300" }}>
                    water_drop
                  </span>
                  <span className="text-xs uppercase tracking-widest text-on-surface font-medium">
                    Filosofía del Fluir
                  </span>
                </div>
                <Link
                  to="/inquire"
                  className="group inline-flex items-center gap-4 text-primary transition-all duration-700"
                >
                  <span className="text-xs uppercase tracking-[0.4em] font-medium transition-all group-hover:tracking-[0.6em]">
                    Consultar
                  </span>
                  <span className="material-symbols-outlined transition-transform group-hover:translate-x-2">
                    arrow_right_alt
                  </span>
                </Link>
              </motion.div>

            </div>
          </div>
        </section>

        {/* Secondary Detail Section */}
        <motion.section
          className="mt-40 bg-surface-container-low py-32 px-6 md:px-12"
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease, delay: 0.75 }}
        >
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="font-headline text-3xl md:text-4xl text-primary-container mb-12 italic">
              «La luz no simplemente toca la superficie; la habita.»
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-16 text-left">
              <div className="space-y-4">
                <h3 className="text-[0.65rem] uppercase tracking-[0.2em] font-bold text-primary">Proceso</h3>
                <p className="text-sm font-body leading-relaxed text-on-surface-variant">
                  Meses de superponer veladuras finas para alcanzar la profundidad de las corrientes del océano.
                </p>
              </div>
              <div className="space-y-4">
                <h3 className="text-[0.65rem] uppercase tracking-[0.2em] font-bold text-primary">Materiales</h3>
                <p className="text-sm font-body leading-relaxed text-on-surface-variant">
                  Pigmentos minerales y aceites de linaza puros, mezclados a mano en el estudio de la galería.
                </p>
              </div>
              <div className="space-y-4">
                <h3 className="text-[0.65rem] uppercase tracking-[0.2em] font-bold text-primary">Intención</h3>
                <p className="text-sm font-body leading-relaxed text-on-surface-variant">
                  Crear un espacio de reposo en un mundo de aceleración visual constante.
                </p>
              </div>
            </div>
          </div>
        </motion.section>
      </motion.main>

      <Footer />
    </>
  )
}

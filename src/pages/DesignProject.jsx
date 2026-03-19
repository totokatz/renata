import { useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { designProjects } from '../data/designProjects'

export default function DesignProject() {
  const { slug } = useParams()
  const project = designProjects.find((p) => p.slug === slug)

  if (!project) return <div>Proyecto no encontrado</div>

  return (
    <>
      <Navbar />
      <motion.main
        className="pt-40 pb-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { duration: 0.5, ease: 'easeOut' } }}
        exit={{ opacity: 0, transition: { duration: 0.2, ease: 'easeIn' } }}
      >
        <h1 className="px-6 md:px-12 font-headline text-5xl font-light">{project.title}</h1>
        <p className="px-6 md:px-12 mt-4 text-outline">{project.subtitle}</p>
      </motion.main>
      <Footer />
    </>
  )
}

import { motion } from 'framer-motion'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export default function Design() {
  return (
    <>
      <Navbar />
      <motion.main
        className="pt-40 pb-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { duration: 0.5, ease: 'easeOut' } }}
        exit={{ opacity: 0, transition: { duration: 0.2, ease: 'easeIn' } }}
      >
        <header className="px-6 md:px-12 max-w-[1920px] mx-auto mb-32">
          <h1 className="font-headline text-6xl md:text-8xl font-light leading-[1.05] tracking-tight">
            Dise<br />
            <span className="italic pl-12 md:pl-24">ño</span>
          </h1>
        </header>
      </motion.main>
      <Footer />
    </>
  )
}

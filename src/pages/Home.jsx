import Navbar from '../components/Navbar'
import HeroSection from '../components/sections/HeroSection'
import IntroSection from '../components/sections/IntroSection'

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <IntroSection />
      </main>
    </>
  )
}

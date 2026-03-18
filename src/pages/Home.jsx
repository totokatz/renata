import Navbar from '../components/Navbar'
import HeroSection from '../components/sections/HeroSection'
import IntroSection from '../components/sections/IntroSection'
import AsymmetricSection1 from '../components/sections/AsymmetricSection1'

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <IntroSection />
        <AsymmetricSection1 />
      </main>
    </>
  )
}

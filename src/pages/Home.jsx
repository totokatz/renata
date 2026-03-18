import Navbar from '../components/Navbar'
import HeroSection from '../components/sections/HeroSection'
import IntroSection from '../components/sections/IntroSection'
import AsymmetricSection1 from '../components/sections/AsymmetricSection1'
import QuoteSection from '../components/sections/QuoteSection'
import AsymmetricSection2 from '../components/sections/AsymmetricSection2'
import StudioSection from '../components/sections/StudioSection'

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <IntroSection />
        <AsymmetricSection1 />
        <QuoteSection />
        <AsymmetricSection2 />
        <StudioSection />
      </main>
    </>
  )
}

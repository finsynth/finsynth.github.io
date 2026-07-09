import Navbar from '../components/Navbar'
import FormulaBar from '../components/FormulaBar'
import Hero from '../components/Hero'
import TrustedBy from '../components/TrustedBy'
import PositioningBlock from '../components/PositioningBlock'
import UseCases from '../components/UseCases'
import HowItWorks from '../components/HowItWorks'
import SecuritySection from '../components/SecuritySection'
import Setup from '../components/Setup'
import { Pillars } from '../components/PillarSections'
import Auditability from '../components/Auditability'
import VideoSection from '../components/VideoSection'
import Security from '../components/Security'
import Testimonial from '../components/Testimonial'
import Faq from '../components/Faq'
import CtaBand from '../components/CtaBand'
import Footer from '../components/Footer'

function Home() {
  return (
    <div className="mainContainer">
      <Navbar />
      <FormulaBar />
      <Hero />
      <TrustedBy />
      <PositioningBlock />
      <HowItWorks />
      <SecuritySection />
      <Auditability />
      <Setup />
      <Pillars />
      <UseCases />
      <VideoSection />
      <Security />
      <Testimonial />
      <Faq />
      <CtaBand />
      <Footer />
    </div>
  )
}

export default Home

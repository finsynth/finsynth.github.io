import Navbar from '../components/Navbar'
import FormulaBar from '../components/FormulaBar'
import Hero from '../components/Hero'
import HowItWorks from '../components/HowItWorks'
import SecuritySection from '../components/SecuritySection'
import Setup from '../components/Setup'
import { PillarAccuracy, PillarAuditability, PillarData, PillarSpeed } from '../components/PillarSections'
import VideoSection from '../components/VideoSection'
import Security from '../components/Security'
import Testimonial from '../components/Testimonial'
import CtaBand from '../components/CtaBand'
import Footer from '../components/Footer'

function Home() {
  return (
    <div className="mainContainer">
      <Navbar />
      <FormulaBar />
      <Hero />
      <HowItWorks />
      <SecuritySection />
      <Setup />
      <PillarAccuracy />
      <PillarAuditability />
      <PillarData />
      <PillarSpeed />
      <VideoSection />
      <Security />
      <Testimonial />
      <CtaBand />
      <Footer />
    </div>
  )
}

export default Home

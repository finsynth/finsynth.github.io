import Navbar from '../components/Navbar'
import FormulaBar from '../components/FormulaBar'
import Hero from '../components/Hero'
import TrustedBy from '../components/TrustedBy'
import PositioningBlock from '../components/PositioningBlock'
import HowItWorks from '../components/HowItWorks'
import Setup from '../components/Setup'
import UseCasesPalette from '../components/UseCasesPalette'
import Auditability from '../components/Auditability'
import VideoSection from '../components/VideoSection'
import Security from '../components/Security'
import Testimonial from '../components/Testimonial'
import Faq from '../components/Faq'
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
      <Setup />
      <Auditability />
      <UseCasesPalette />
      <VideoSection />
      <Security />
      <Testimonial />
      <Faq />
      <Footer />
    </div>
  )
}

export default Home

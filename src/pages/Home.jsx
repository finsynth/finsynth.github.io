import Navbar from '../components/Navbar'
import FormulaBar from '../components/FormulaBar'
import Hero from '../components/Hero'
import AnnouncementBar from '../components/AnnouncementBar'
import BeforeAfter from '../components/BeforeAfter'
import PositioningBlock from '../components/PositioningBlock'
import HowItWorks from '../components/HowItWorks'
import Security from '../components/Security'
import Testimonial from '../components/Testimonial'
import Faq from '../components/Faq'
import Footer from '../components/Footer'
import SectionRule from '../components/SectionRule'

function Home() {
  return (
    <div className="mainContainer">
      <div className="page-rails" aria-hidden="true">
        <span className="rail rail-left" />
        <span className="rail rail-right" />
      </div>
      <AnnouncementBar />
      <Navbar />
      <FormulaBar />
      <Hero />
      <SectionRule />
      <PositioningBlock />
      <SectionRule />
      <HowItWorks />
      <SectionRule label="Before / After" />
      <BeforeAfter />
      <SectionRule />
      <Testimonial />
      <SectionRule />
      <Security />
      <SectionRule />
      <Faq />
      <SectionRule />
      <Footer />
    </div>
  )
}

export default Home

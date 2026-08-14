import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import WhyAnalysts from '../components/WhyAnalysts'
import ExcelSection from '../components/ExcelSection'
import FiaAgentSection from '../components/FiaAgentSection'
import Security from '../components/Security'
import Testimonial from '../components/Testimonial'
import Faq from '../components/Faq'
import Footer from '../components/Footer'
import SectionRule from '../components/SectionRule'
import ScrollNextButton from '../components/ScrollNextButton'

function Home() {
  return (
    <div className="mainContainer">
      <div className="page-rails" aria-hidden="true">
        <span className="rail rail-left" />
        <span className="rail rail-right" />
      </div>
      <Navbar />
      {/* One hero — copy over the Bay Bridge sunset photo pixelated in full
          colour. The `bare` variant that ran here (plain background + the
          scattered photo-tile collage down the flanks) was dropped on request;
          Hero.jsx keeps the whole backdrop switch intact if it's wanted back. */}
      <Hero variant="photo" />
      <SectionRule />
      {/* the Excel add-in as its own product section — the Security section's
          bordered table: four rows, the claim left and its visual right */}
      <ExcelSection />
      {/* the numbers belong to the add-in section: same .wrap, hung off the
          bottom of its frame with no <SectionRule /> between them, so the
          frame's own bottom hairline is the only line and the band reads as
          the close of the section rather than a section of its own */}
      <WhyAnalysts />
      <SectionRule />
      {/* Fia follows the add-in — the two products read as one suite, in the
          same framed layout */}
      <FiaAgentSection />
      <Testimonial />
      <SectionRule />
      <Security />
      <SectionRule />
      <Faq />
      <SectionRule />
      <Footer />
      <ScrollNextButton />
    </div>
  )
}

export default Home

import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import AnnouncementBar from '../components/AnnouncementBar'
import BeforeAfter from '../components/BeforeAfter'
import WhatSection from '../components/WhatSection'
import PositioningBlock from '../components/PositioningBlock'
import HowItWorks from '../components/HowItWorks'
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
      <AnnouncementBar />
      <Navbar />
      <Hero variant="globe" />
      <SectionRule />
      <Hero variant="tiles" />
      <SectionRule />
      <PositioningBlock />
      <SectionRule />
      <HowItWorks />
      <SectionRule />
      <BeforeAfter />
      <SectionRule />
      <WhatSection />
      <SectionRule />
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

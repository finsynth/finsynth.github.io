import { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import BeforeAfter from '../components/BeforeAfter'
import WhatSection from '../components/WhatSection'
import HowItWorks from '../components/HowItWorks'
import Security from '../components/Security'
import Testimonial from '../components/Testimonial'
import Faq from '../components/Faq'
import Footer from '../components/Footer'
import SectionRule from '../components/SectionRule'
import ScrollNextButton from '../components/ScrollNextButton'

function Home() {
  // Any hero's ask popup being open freezes the whole page: the popup's scrim
  // is viewport-fixed and only blurs, so animation anywhere on screen (other
  // heroes' canvases, typewriter headings, section CSS loops) stays visible
  // through it. The body class pauses CSS animations (see .ask-freeze in
  // index.css); the prop pauses the JS-driven canvases and typewriters.
  const [askOpen, setAskOpen] = useState(false)
  useEffect(() => {
    document.body.classList.toggle('ask-freeze', askOpen)
    return () => document.body.classList.remove('ask-freeze')
  }, [askOpen])

  return (
    <div className="mainContainer">
      <div className="page-rails" aria-hidden="true">
        <span className="rail rail-left" />
        <span className="rail rail-right" />
      </div>
      <Navbar />
      {/* hero — copy over the Bay Bridge sunset photo pixelated in full colour. */}
      <Hero variant="photo" frozen={askOpen} onAskOpenChange={setAskOpen} />
      <SectionRule />
      <BeforeAfter />
      <SectionRule />
      <HowItWorks />
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

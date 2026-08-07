import { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import Differentiator from '../components/Differentiator'
import WhyAnalysts from '../components/WhyAnalysts'
import ExcelSection from '../components/ExcelSection'
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
      {/* the same hero again, riding the how-it-works glass wash instead of
          the photo — a backdrop comparison, content identical */}
      <Hero
        variant="photo"
        bgImage="/assets/img/testi-glass-bg.png"
        bgGlass
        frozen={askOpen}
        onAskOpenChange={setAskOpen}
      />
      <SectionRule />
      {/* the product, working, straight off the hero — the panel plays itself
          through brief → work → approve and the composer is live, so the first
          thing under the fold is the thing itself rather than a claim about it */}
      <HowItWorks />
      <SectionRule />
      {/* then the claim that separates us: outreach lands on people already sold
          on agents, so what they need is what makes this different from what
          they already run — auditability, and nothing else in this section */}
      <Differentiator />
      <SectionRule />
      <WhyAnalysts />
      <SectionRule />
      {/* the Excel add-in as its own product section — pillars as sheet tabs,
          image slots reserved per sheet until product shots exist */}
      <ExcelSection />
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

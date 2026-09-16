import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import WhyAnalysts from '../components/WhyAnalysts'
import ExcelSection from '../components/ExcelSection'
import FiaAgentSection from '../components/FiaAgentSection'
import Security from '../components/Security'
import Testimonial from '../components/Testimonial'
import PlansSection from '../components/PlansSection'
import Faq from '../components/Faq'
import Footer from '../components/Footer'
import SectionRule from '../components/SectionRule'
import ScrollNextButton from '../components/ScrollNextButton'
import useHashScroll from '../hooks/useHashScroll'

function Home() {
  useHashScroll()

  return (
    <div className="mainContainer">
      <div className="page-rails" aria-hidden="true">
        <span className="rail rail-left" />
        <span className="rail rail-right" />
      </div>
      <Navbar />
      <Hero variant="photo" />
      <SectionRule />
      <ExcelSection />
      <WhyAnalysts />
      <SectionRule />
      <FiaAgentSection />
      <Testimonial />
      <SectionRule />
      <Security />
      <SectionRule />
      <PlansSection />
      <SectionRule />
      <Faq />
      <SectionRule />
      <Footer />
      <ScrollNextButton />
    </div>
  )
}

export default Home

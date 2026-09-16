import useSectionZoom from '../hooks/useSectionZoom'
import EnterpriseBanner from './EnterpriseBanner'


export default function EnterpriseSection() {
  const zoomRef = useSectionZoom()

  return (
    <section className="plans" id="enterprise-plan">
      <div className="wrap plans-wrap" ref={zoomRef}>
        <p className="plans-eyebrow">Enterprise</p>
        <h2 className="plans-title">Get your team on <span className="ttl-hl">FinSynth</span></h2>

        <div className="plans-table">
          <EnterpriseBanner />
        </div>
      </div>
    </section>
  )
}

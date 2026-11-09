import EnterpriseBanner from '@/components/home/EnterpriseBanner'

export default function EnterpriseSection() {
  return (
    <section className="plans" id="enterprise-plan">
      <div className="wrap plans-wrap" data-zoom>
        <p className="plans-eyebrow">Enterprise</p>
        <h2 className="plans-title">
          Get your team on <span className="ttl-hl">FinSynth</span>
        </h2>

        <div className="plans-table">
          <EnterpriseBanner />
        </div>
      </div>
    </section>
  )
}

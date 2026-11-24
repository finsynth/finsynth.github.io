function SectionRule() {
  return (
    <div className="section-rule" aria-hidden="true">
      <div className="sr-track">
        <span className="sr-line" />
      </div>
      <span className="guide-node sr-node--l" />
      <span className="guide-node sr-node--r" />
    </div>
  )
}

export default SectionRule

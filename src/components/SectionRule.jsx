function SectionRule({ label }) {
  return (
    <div className="section-rule" aria-hidden="true">
      <div className="sr-track">
        {label ? (
          <>
            <span className="sr-line" />
            <span className="sr-label">{label}</span>
            <span className="sr-line" />
          </>
        ) : (
          <span className="sr-line" />
        )}
      </div>
      {/* rounded-square guide nodes where the rule meets each vertical rail */}
      <span className="guide-node sr-node--l" />
      <span className="guide-node sr-node--r" />
      <span className="sr-box sr-box--solid sr-box--l1" />
      <span className="sr-box sr-box--stripe sr-box--l2" />
      <span className="sr-box sr-box--solid sr-box--r1" />
      <span className="sr-box sr-box--stripe sr-box--r2" />
    </div>
  )
}

export default SectionRule

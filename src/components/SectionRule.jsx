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
    </div>
  )
}

export default SectionRule

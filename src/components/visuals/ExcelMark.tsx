/* The Excel mark, drawn inline in Excel's greens since the repo has no Office
   logo asset. Sized by the caller's class. */
export default function ExcelMark({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 32 32" aria-hidden="true" focusable="false">
      <path fill="#33C481" d="M10 2h18a2 2 0 0 1 2 2v5H10z" />
      <path fill="#21A366" d="M10 9h20v7H10z" />
      <path fill="#107C41" d="M10 16h20v7H10z" />
      <path fill="#185C37" d="M10 23h20v5a2 2 0 0 1-2 2H10z" />
      <rect x="2" y="8" width="16" height="16" rx="2" fill="#107C41" />
      <path
        d="M6.5 12.5 13.5 19.5M13.5 12.5 6.5 19.5"
        fill="none"
        stroke="#fff"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  )
}

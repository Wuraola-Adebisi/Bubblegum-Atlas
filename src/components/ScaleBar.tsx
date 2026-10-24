interface ScaleBarProps {
  /** 0 to 1 */
  progress: number
  start: string
  end: string
}

/** A map scale bar that fills as progress advances. Decorative: the page text carries the content. */
export default function ScaleBar({ progress, start, end }: ScaleBarProps) {
  return (
    <div className="pointer-events-none flex items-center gap-3 font-hand text-label font-semibold" aria-hidden="true">
      <span className="rounded-pill bg-paper px-3">{start}</span>
      <span className="relative h-3 flex-1 overflow-hidden rounded-pill border-hair border-accent bg-paper">
        <span className="absolute inset-y-0 left-0 bg-accent" style={{ width: `${progress * 100}%` }} />
      </span>
      <span className="rounded-pill bg-paper px-3">{end}</span>
    </div>
  )
}

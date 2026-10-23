import type { ReactNode } from 'react'

const flagClip = 'polygon(0 0, calc(100% - 12px) 0, 100% 50%, calc(100% - 12px) 100%, 0 100%, 10px 50%)'

interface LabelTagProps {
  variant?: 'pill' | 'flag'
  children: ReactNode
  className?: string
}

/** Place label. Pills are paper with a berry hairline and ink text. Flags are solid berry with white text. */
export default function LabelTag({ variant = 'pill', children, className = '' }: LabelTagProps) {
  if (variant === 'flag') {
    return (
      <span
        className={`inline-block bg-accent px-5 py-1 font-hand text-label font-semibold whitespace-nowrap text-paper ${className}`}
        style={{ clipPath: flagClip }}
      >
        {children}
      </span>
    )
  }
  return (
    <span
      className={`inline-block rounded-pill border-hair border-accent bg-paper px-3 py-0.5 font-hand text-label font-semibold whitespace-nowrap text-ink ${className}`}
    >
      {children}
    </span>
  )
}

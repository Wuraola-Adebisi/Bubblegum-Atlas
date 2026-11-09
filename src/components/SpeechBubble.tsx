/** A small speech bubble with a tail, used when a place or the couple says hello. It announces itself politely to screen readers. */
export default function SpeechBubble({ who, text, className = '', style }: { who: string; text: string; className?: string; style?: React.CSSProperties }) {
  return (
    <div role="status" className={`pin-pop pointer-events-none w-52 sm:w-60 ${className}`} style={style}>
      <div className="relative rounded-panel border-hair border-accent bg-paper px-4 py-3 text-center">
        <p className="font-hand text-label">{who}</p>
        <p className="text-small">{text}</p>
        <span aria-hidden="true" className="absolute -bottom-[7px] left-1/2 size-3 -translate-x-1/2 rotate-45 border-r-[1.5px] border-b-[1.5px] border-accent bg-paper" />
      </div>
    </div>
  )
}

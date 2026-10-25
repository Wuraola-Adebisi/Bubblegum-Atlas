import { useRef, useState } from 'react'
import { toPng } from 'html-to-image'
import type { EventConfig } from '../../data/events/types.ts'
import ShareCard, { CARD_H, CARD_W } from './ShareCard.tsx'

interface ShareCardPanelProps {
  event: EventConfig
  values: Record<string, string>
  code: string
}

const btn =
  'inline-flex min-h-11 cursor-pointer items-center rounded-pill border-hair border-accent bg-paper px-6 py-2 font-medium text-accent shadow-press transition duration-micro ease-standard hover:bg-accent hover:text-paper active:translate-y-0.5 active:shadow-press-down disabled:cursor-not-allowed disabled:border-dashed disabled:opacity-60 disabled:hover:bg-paper disabled:hover:text-accent'

const PREVIEW_W = 360

/** A preview of the share image, with buttons to save it or send it with the phone's share sheet. */
export default function ShareCardPanel({ event, values, code }: ShareCardPanelProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [busy, setBusy] = useState(false)
  const [note, setNote] = useState('')
  const scale = PREVIEW_W / CARD_W

  const render = async () => {
    if (!ref.current) throw new Error('no card')
    return toPng(ref.current, { width: CARD_W, height: CARD_H, pixelRatio: 1, cacheBust: true, style: { transform: 'none', transformOrigin: 'top left' } })
  }

  const download = async () => {
    setBusy(true)
    setNote('Making your card.')
    try {
      const url = await render()
      const a = document.createElement('a')
      a.href = url
      a.download = 'larkmere-share-card.png'
      a.click()
      setNote('Saved. Check your downloads.')
    } catch {
      setNote('The card could not be made. Try again, or take a screenshot of the pass instead.')
    } finally {
      setBusy(false)
    }
  }

  const share = async () => {
    setBusy(true)
    setNote('Making your card.')
    try {
      const url = await render()
      const blob = await (await fetch(url)).blob()
      const file = new File([blob], 'larkmere-share-card.png', { type: 'image/png' })
      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file], title: event.title, text: `I am going to ${event.title}.` })
        setNote('Shared.')
      } else {
        setNote('This browser cannot share images. Use the download button.')
      }
    } catch {
      setNote('Sharing was cancelled or did not work. You can still download the card.')
    } finally {
      setBusy(false)
    }
  }

  const canShare = typeof navigator !== 'undefined' && typeof navigator.share === 'function'

  return (
    <section aria-labelledby="share-heading" className="mt-10 grid items-start gap-8 rounded-panel bg-paper p-5 sm:p-8 md:grid-cols-[auto_1fr] print:hidden">
      <div aria-hidden="true" className="overflow-hidden rounded-panel border-hair border-accent" style={{ width: PREVIEW_W, height: CARD_H * scale, maxWidth: '100%' }}>
        <div style={{ width: CARD_W, height: CARD_H, transform: `scale(${scale})`, transformOrigin: 'top left' }}>
          <ShareCard event={event} values={values} code={code} cardRef={ref} />
        </div>
      </div>
      <div>
        <h2 id="share-heading" className="font-display text-h3 font-extrabold">
          Share your card
        </h2>
        <p className="mt-2 max-w-measure text-body">A 1080 by 1350 image that fits an Instagram or TikTok carousel slide. It shows your ferry and party size.</p>
        <div className="mt-5 flex flex-wrap gap-3">
          <button type="button" className={btn} disabled={busy} onClick={download}>
            Download share card
          </button>
          {canShare && (
            <button type="button" className={btn} disabled={busy} onClick={share}>
              Share
            </button>
          )}
        </div>
        <p className="mt-3 text-small" role="status">
          {note}
        </p>
      </div>
    </section>
  )
}

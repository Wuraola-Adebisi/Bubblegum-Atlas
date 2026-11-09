import { confettiCannons } from '../lib/confetti.ts'
import { useRef, useState } from 'react'
import { wedding as event } from '../data/events/wedding.ts'
import BoardingPass from '../features/rsvp/BoardingPass.tsx'
import RsvpForm from '../features/rsvp/RsvpForm.tsx'
import RsvpScene from '../features/rsvp/RsvpScene.tsx'
import ShareCardPanel from '../features/rsvp/ShareCardPanel.tsx'
import { passCode, replySummary, statusFor, storageKey, validate } from '../features/rsvp/rsvp.ts'
import { useAvatar } from '../features/walk/useAvatar.ts'
import type { RsvpReply } from '../features/rsvp/rsvp.ts'
import { readJson, removeKey, writeJson } from '../lib/storage.ts'

const btn =
  'inline-flex min-h-11 cursor-pointer items-center rounded-pill border-hair border-accent bg-paper px-6 py-2 font-medium text-accent shadow-press transition duration-micro ease-standard hover:bg-accent hover:text-paper active:translate-y-0.5 active:shadow-press-down'

const primaryBtn =
  'inline-flex min-h-11 cursor-pointer items-center rounded-pill border-hair border-accent bg-accent px-6 py-2 font-medium text-paper shadow-press transition duration-micro ease-standard hover:bg-ink active:translate-y-0.5 active:shadow-press-down'

export default function RsvpPage() {
  const [reply, setReply] = useState<RsvpReply | null>(() => readJson<RsvpReply>(storageKey(event)))
  const [editing, setEditing] = useState(false)
  const [attending, setAttending] = useState<'yes' | 'no' | ''>(() => (reply ? (reply.attending ? 'yes' : 'no') : ''))
  const [values, setValues] = useState<Record<string, string>>(() => reply?.values ?? {})
  const [errors, setErrors] = useState<Record<string, string>>({})
  const heading = useRef<HTMLHeadingElement>(null)
  const [avatar] = useAvatar()
  const [copyNote, setCopyNote] = useState('')

  const change = (id: string, v: string) => {
    setValues((prev) => ({ ...prev, [id]: v }))
    setErrors((prev) => {
      if (!prev[id]) return prev
      const { [id]: _drop, ...rest } = prev
      return rest
    })
  }

  const submit = () => {
    if (!attending) {
      setErrors({ attending: 'Choose yes or no so we know whether to save you a place.' })
      return
    }
    const yes = attending === 'yes'
    const found = validate(event, yes, values)
    if (Object.keys(found).length) {
      setErrors(found)
      const first = event.pass.fields.find((f) => found[f.id])
      if (first) setTimeout(() => document.getElementById(`rsvp-${first.id}`)?.focus(), 0)
      return
    }
    const next: RsvpReply = {
      attending: yes,
      values: yes ? values : { name: values.name ?? '', email: values.email ?? '' },
      status: statusFor(event, yes, values),
      code: passCode(values.name ?? '', values.party ?? ''),
      savedAt: new Date().toISOString(),
    }
    writeJson(storageKey(event), next)
    setReply(next)
    if (next.status === 'confirmed') confettiCannons()
    setEditing(false)
    setErrors({})
    setTimeout(() => heading.current?.focus(), 0)
  }

  const copyReply = async () => {
    if (!reply) return
    try {
      await navigator.clipboard.writeText(replySummary(event, reply))
      setCopyNote('Copied. Paste it into a message to Maya and Theo.')
    } catch {
      setCopyNote('Your browser blocked copying. Select the text of your pass and copy it by hand.')
    }
  }

  const clear = () => {
    removeKey(storageKey(event))
    setReply(null)
    setAttending('')
    setValues({})
    setEditing(false)
  }

  const showForm = !reply || editing
  const first = (reply?.values.name ?? '').trim().split(/\s+/)[0]
  const title =
    reply?.status === 'confirmed'
      ? first
        ? `See you at Willowmere, ${first}`
        : 'See you at Willowmere'
      : reply?.status === 'waitlist'
        ? 'You are on the waitlist'
        : first
          ? `We will miss you, ${first}`
          : 'We will miss you'

  return (
    <main id="main" className="focus:outline-hidden mx-auto max-w-7xl px-4 pt-24 pb-12 sm:px-8">
      {showForm ? (
        <>
          <RsvpScene state="draft" avatar={avatar} />
          <header className="mb-8 max-w-measure">
            <h1 ref={heading} tabIndex={-1} className="font-display text-h1 font-extrabold outline-none">
              RSVP
            </h1>
            <p className="mt-3 text-body">{event.copy.rsvpPageIntro}</p>
          </header>
          <div className="grid items-start gap-8 lg:grid-cols-2">
            <RsvpForm event={event} attending={attending} values={values} errors={errors} onAttending={setAttending} onChange={change} onSubmit={submit} />
            <div className="lg:sticky lg:top-24">
              <BoardingPass event={event} values={values} state="draft" />
            </div>
          </div>
        </>
      ) : (
        reply && (
          <>
            <RsvpScene state={reply.status} avatar={avatar} />
            <header className="mb-8 max-w-measure">
              <h1 ref={heading} tabIndex={-1} className="font-display text-h1 font-extrabold outline-none">
                {title}
              </h1>
              <p className="mt-3 text-body">
                {reply.status === 'confirmed' && 'You are on the list. Your boarding pass is below, to bring on your phone or on paper. Press Send my reply so Maya and Theo have your answer.'}
                {reply.status === 'waitlist' && 'Your party is larger than the places we have left, so you are on the waitlist. Press Send my reply and we will write to you if places open up.'}
                {reply.status === 'declined' && 'Thank you for letting us know. Press Send my reply so Maya and Theo hear it from you. If your plans change, you can update your reply here.'}
              </p>
            </header>
            {reply.status !== 'declined' && <BoardingPass event={event} values={reply.values} state={reply.status} code={reply.code} />}
            {reply.status === 'confirmed' && <ShareCardPanel event={event} values={reply.values} code={reply.code} />}
            <div className="mt-8 flex flex-wrap gap-3 print:hidden">
              {reply.status !== 'declined' && (
                <button type="button" className={btn} onClick={() => window.print()}>
                  Print or save as PDF
                </button>
              )}
              <a
                className={primaryBtn}
                href={`mailto:${event.rsvp?.to ?? ''}?subject=${encodeURIComponent(`RSVP from ${reply.values.name ?? 'a guest'}`)}&body=${encodeURIComponent(replySummary(event, reply))}`}
              >
                Send my reply
              </a>
              <button type="button" className={btn} onClick={copyReply}>
                Copy my reply
              </button>
              <button type="button" className={btn} onClick={() => setEditing(true)}>
                Change my reply
              </button>
              <button type="button" className={btn} onClick={clear}>
                Start over
              </button>
            </div>
            <p role="status" className="mt-3 text-small print:hidden">
              {copyNote}
            </p>
          </>
        )
      )}
    </main>
  )
}

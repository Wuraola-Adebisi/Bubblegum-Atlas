import { useRef, useState } from 'react'
import type { FormEvent, ReactNode } from 'react'
import PageBanner from '../components/PageBanner.tsx'
import { wedding as event } from '../data/events/wedding.ts'
import { confetti } from '../lib/confetti.ts'
import { readJson, writeJson } from '../lib/storage.ts'

const btn =
  'inline-flex min-h-11 cursor-pointer items-center rounded-pill border-hair border-accent bg-paper px-6 py-2 font-medium text-accent shadow-press transition duration-micro ease-standard hover:bg-accent hover:text-paper active:translate-y-0.5 active:shadow-press-down'
const primaryBtn =
  'inline-flex min-h-11 cursor-pointer items-center rounded-pill border-hair border-accent bg-accent px-6 py-2 font-medium text-paper shadow-press transition duration-micro ease-standard hover:bg-ink active:translate-y-0.5 active:shadow-press-down'
const field =
  'mt-1 block w-full rounded-panel border-hair border-accent bg-paper px-4 py-2.5 text-body focus:outline-hidden'

interface Note {
  id: string
  name: string
  text: string
  mine?: boolean
}

const noteTones = ['bg-land-wash', 'bg-water-wash', 'bg-park-wash', 'bg-water-deep-wash', 'bg-paper']
const noteTilt = ['-rotate-1', 'rotate-1', 'rotate-0', '-rotate-[0.5deg]', 'rotate-[0.7deg]']

function Section({ title, intro, tone, id, children }: { title: string; intro?: string; tone: string; id: string; children: ReactNode }) {
  return (
    <section aria-labelledby={id} className={`mt-6 rounded-panel p-5 sm:p-8 ${tone}`}>
      <h2 id={id} className="font-display text-h2 font-extrabold">
        {title}
      </h2>
      {intro && <p className="mt-2 max-w-measure">{intro}</p>}
      {children}
    </section>
  )
}

const money = (n: number) => `$${n.toLocaleString('en-US')}`

/**
 * Gifts and notes. A fund guests can chip in to, shops with registries, and a wall of notes for the couple.
 * Chip-ins and notes are kept in the visitor's browser for now (`ba:gifts:` and `ba:notes:`). A real build would send them to a payment provider and a database.
 */
export default function GiftsPage() {
  const reg = event.registry
  const giftKey = `ba:gifts:${event.id}`
  const noteKey = `ba:notes:${event.id}`
  const [given, setGiven] = useState<Record<string, number>>(() => readJson<Record<string, number>>(giftKey) ?? {})
  const [mine, setMine] = useState<Note[]>(() => readJson<Note[]>(noteKey) ?? [])
  const [name, setName] = useState('')
  const [text, setText] = useState('')
  const [errors, setErrors] = useState<{ name?: string; text?: string }>({})
  const [status, setStatus] = useState('')
  const wall = useRef<HTMLUListElement>(null)
  if (!reg) return null

  const chip = (id: string, amount: number, e: React.MouseEvent<HTMLButtonElement>) => {
    const next = { ...given, [id]: amount }
    setGiven(next)
    writeJson(giftKey, next)
    const r = e.currentTarget.getBoundingClientRect()
    confetti(r.left + r.width / 2, r.top, { count: 36, spread: Math.PI * 1.2, power: 0.7 })
  }
  const undo = (id: string) => {
    const { [id]: _drop, ...rest } = given
    setGiven(rest)
    writeJson(giftKey, rest)
  }

  const submit = (e: FormEvent) => {
    e.preventDefault()
    const found: { name?: string; text?: string } = {}
    if (!name.trim()) found.name = 'Add your name so we know who it is from.'
    if (!text.trim()) found.text = 'Write a line or two before you leave your note.'
    setErrors(found)
    if (found.name || found.text) {
      document.getElementById(found.name ? 'note-name' : 'note-text')?.focus()
      return
    }
    const note: Note = { id: `mine-${Date.now()}`, name: name.trim(), text: text.trim(), mine: true }
    const next = [note, ...mine]
    setMine(next)
    writeJson(noteKey, next)
    setName('')
    setText('')
    setStatus('Thank you. Your note is on the wall.')
    const r = wall.current?.getBoundingClientRect()
    confetti(window.innerWidth / 2, r ? Math.max(120, r.top) : 200, { count: 50, power: 0.8 })
  }
  const remove = (id: string) => {
    const next = mine.filter((n) => n.id !== id)
    setMine(next)
    writeJson(noteKey, next)
    setStatus('Your note was removed.')
  }

  const notes: Note[] = [...mine, ...reg.notes.seed.map((n, i) => ({ id: `seed-${i}`, ...n }))]

  return (
    <main id="main" className="focus:outline-hidden mx-auto max-w-7xl px-4 pt-20 pb-16 sm:px-8">
      <PageBanner
        title="Gifts and notes"
        pieces={[
          { id: 'landmark-hotel', x: 12, y: 90, w: 11 },
          { id: 'prop-tree-round', x: 24, y: 90, w: 5 },
          { id: 'prop-cake', x: 40, y: 90, w: 10 },
          { id: 'landmark-estate', x: 62, y: 86, w: 24 },
          { id: 'landmark-ferry', x: 88, y: 68, w: 15 },
        ]}
      >
        <p className="mt-5 max-w-measure text-body">{reg.intro}</p>
      </PageBanner>

      <Section title={reg.fund.title} intro={reg.fund.blurb} tone="bg-land-wash" id="fund">
        <ul className="mt-6 grid gap-4 sm:grid-cols-2">
          {reg.fund.items.map((it) => {
            const mineAmount = given[it.id] ?? 0
            const raised = Math.min(it.amount, it.raised + mineAmount)
            const left = it.amount - it.raised
            const chipAmount = Math.min(25, Math.max(0, left))
            const pct = Math.round((raised / it.amount) * 100)
            return (
              <li key={it.id} className="flex flex-col rounded-panel bg-paper p-5">
                <h3 className="font-display text-h3 font-extrabold">{it.title}</h3>
                <p className="mt-1 max-w-measure text-small">{it.blurb}</p>
                <div className="mt-4" role="img" aria-label={`${money(raised)} of ${money(it.amount)} given`}>
                  <div className="h-3 rounded-pill border-hair border-accent bg-water-deep-wash">
                    <div className="h-full rounded-pill bg-accent" style={{ width: `${pct}%` }} />
                  </div>
                </div>
                <p className="mt-2 font-hand text-label">
                  {money(raised)} of {money(it.amount)}
                </p>
                <div className="mt-auto pt-4">
                  {mineAmount > 0 ? (
                    <p className="text-small">
                      <span className="font-medium">Thank you. {money(mineAmount)} is on its way to this one.</span>{' '}
                      <button type="button" onClick={() => undo(it.id)} className="cursor-pointer text-accent underline underline-offset-4">
                        Take it back
                      </button>
                    </p>
                  ) : chipAmount === 0 ? (
                    <p className="text-small font-medium">Fully given. Thank you to everyone who chipped in.</p>
                  ) : (
                    <button type="button" className={btn} onClick={(e) => chip(it.id, chipAmount, e)}>
                      Chip in {money(chipAmount)}
                    </button>
                  )}
                </div>
              </li>
            )
          })}
        </ul>
      </Section>

      <Section title="Home registries" intro="If you would rather give something for the flat, these are the shops we chose." tone="bg-water-wash" id="shops">
        <ul className="mt-6 grid gap-4 sm:grid-cols-3">
          {reg.shops.map((s) => (
            <li key={s.name} className="flex flex-col rounded-panel bg-paper p-5">
              <h3 className="font-display text-h3 font-extrabold">{s.name}</h3>
              <p className="mt-1 max-w-measure text-small">{s.blurb}</p>
              <p className="mt-auto pt-4">
                <a href={s.url} target="_blank" rel="noopener noreferrer" className={btn}>
                  See their registry
                </a>
              </p>
            </li>
          ))}
        </ul>
      </Section>

      <Section title={reg.notes.title} intro={reg.notes.intro} tone="bg-park-wash" id="notes">
        <form onSubmit={submit} noValidate className="mt-6 grid max-w-2xl gap-4 rounded-panel bg-paper p-5 sm:p-6">
          <div>
            <label htmlFor="note-name" className="font-medium">
              Your name
            </label>
            <input id="note-name" value={name} maxLength={40} onChange={(e) => setName(e.target.value)} aria-invalid={!!errors.name} aria-describedby={errors.name ? 'note-name-error' : undefined} className={field} />
            {errors.name && (
              <p id="note-name-error" className="mt-1.5 text-small font-medium text-error">
                {errors.name}
              </p>
            )}
          </div>
          <div>
            <label htmlFor="note-text" className="font-medium">
              Your note
            </label>
            <textarea id="note-text" rows={3} value={text} maxLength={240} onChange={(e) => setText(e.target.value)} aria-invalid={!!errors.text} aria-describedby={errors.text ? 'note-text-error' : 'note-text-count'} className={field} />
            <p id="note-text-count" className="mt-1 text-small">
              {240 - text.length} characters left
            </p>
            {errors.text && (
              <p id="note-text-error" className="mt-1.5 text-small font-medium text-error">
                {errors.text}
              </p>
            )}
          </div>
          <p>
            <button type="submit" className={primaryBtn}>
              Leave my note
            </button>
          </p>
        </form>
        <p aria-live="polite" className="mt-3 min-h-6 font-medium">
          {status}
        </p>

        <ul ref={wall} className="mt-4 columns-1 gap-4 sm:columns-2 lg:columns-3">
          {notes.map((n, i) => (
            <li key={n.id} className={`mb-4 break-inside-avoid rounded-panel border-hair border-accent p-5 ${noteTones[i % noteTones.length]} ${noteTilt[i % noteTilt.length]}`}>
              <p className="max-w-measure text-body">{n.text}</p>
              <p className="mt-3 font-hand text-label">{n.name}</p>
              {n.mine && (
                <p className="mt-1 text-small">
                  Your note.{' '}
                  <button type="button" onClick={() => remove(n.id)} className="cursor-pointer text-accent underline underline-offset-4">
                    Remove it
                  </button>
                </p>
              )}
            </li>
          ))}
        </ul>
      </Section>
    </main>
  )
}

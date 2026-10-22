import { contrastRatio, readToken } from '../lib/color.ts'
import { pairs, type Pair } from './tokens.ts'

function verdict(ratio: number | null, intent: Pair['intent']) {
  if (ratio === null) return { grade: 'No value', ok: false }
  const grade = ratio >= 4.5 ? 'Passes AA text' : ratio >= 3 ? 'Large text only' : 'Fails'
  const ok = intent === 'text' ? ratio >= 4.5 : intent === 'large' ? ratio >= 3 : ratio < 4.5
  return { grade, ok }
}

export default function Contrast() {
  return (
    <div className="overflow-x-auto rounded-panel bg-paper p-4 sm:p-6">
      <table className="w-full min-w-2xl text-left text-small">
        <thead>
          <tr>
            <th className="p-3 font-medium">Sample</th>
            <th className="p-3 font-medium">Text on background</th>
            <th className="p-3 font-medium">Ratio</th>
            <th className="p-3 font-medium">Result</th>
            <th className="p-3 font-medium">Intended use</th>
            <th className="p-3 font-medium">Matches intent</th>
          </tr>
        </thead>
        <tbody>
          {pairs.map((p) => {
            const fg = readToken(`--color-${p.fg}`)
            const bg = readToken(`--color-${p.bg}`)
            const ratio = contrastRatio(fg, bg)
            const v = verdict(ratio, p.intent)
            return (
              <tr key={`${p.fg}-${p.bg}`} className="border-t-2 border-ground">
                <td className="p-3">
                  <span
                    className="inline-block rounded-pill border-2 border-water px-4 py-1 font-display font-extrabold"
                    style={{ color: `var(--color-${p.fg})`, backgroundColor: `var(--color-${p.bg})` }}
                  >
                    Aa
                  </span>
                </td>
                <td className="p-3">
                  {p.fg} on {p.bg}
                </td>
                <td className="p-3 font-medium">{ratio === null ? 'n/a' : `${ratio.toFixed(2)}:1`}</td>
                <td className="p-3">{v.grade}</td>
                <td className="p-3">
                  {p.use}
                  {p.intent === 'forbidden' ? ' (forbidden)' : p.intent === 'large' ? ' (large only)' : ''}
                </td>
                <td className="p-3 font-medium">{v.ok ? 'Yes' : 'Check'}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

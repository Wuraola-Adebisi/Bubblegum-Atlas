import { hexToRgb, readToken, rgbToHex } from '../lib/color.ts'

function hexOf(token: string): string {
  const rgb = hexToRgb(readToken(`--color-${token}`))
  return rgb ? rgbToHex(rgb) : 'n/a'
}
import { primitives, semantic } from './tokens.ts'

function Swatch({ token }: { token: string }) {
  const hex = hexOf(token)
  return (
    <li className="rounded-panel bg-paper p-3">
      <div className="h-20 rounded-pill border-2 border-water" style={{ backgroundColor: `var(--color-${token})` }} />
      <p className="mt-3 text-small font-medium">{token}</p>
      <p className="text-small">{hex}</p>
    </li>
  )
}

export default function Palette() {
  return (
    <>
      <h3 className="mb-6 font-display text-h3 font-extrabold">Primitives</h3>
      <ul className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-8">
        {primitives.map((p) => (
          <Swatch key={p} token={p} />
        ))}
      </ul>

      <h3 className="mt-16 mb-6 font-display text-h3 font-extrabold">Semantic roles</h3>
      <div className="overflow-x-auto rounded-panel bg-paper p-4 sm:p-6">
        <table className="w-full min-w-xl text-left text-small">
          <thead>
            <tr>
              <th className="p-3 font-medium">Role</th>
              <th className="p-3 font-medium">Token</th>
              <th className="p-3 font-medium">Source</th>
              <th className="p-3 font-medium">Hex</th>
              <th className="p-3 font-medium">Used for</th>
            </tr>
          </thead>
          <tbody>
            {semantic.map((s) => (
              <tr key={s.name} className="border-t-2 border-ground">
                <td className="p-3">
                  <span
                    className="inline-block h-8 w-8 rounded-pill border-2 border-water align-middle"
                    style={{ backgroundColor: `var(--color-${s.name})` }}
                    aria-hidden="true"
                  />
                </td>
                <td className="p-3 font-medium">--color-{s.name}</td>
                <td className="p-3">{s.source}</td>
                <td className="p-3">{hexOf(s.name)}</td>
                <td className="p-3">{s.role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}

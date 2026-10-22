"""Bubblegum Atlas illustration generator.

Each piece is described as shapes plus a part-to-color map, and can be drawn in two styles:

  deep-line (default)  The v1 deep palette and three-tone shading, a 1.5 px hairline over each shape,
                       and no white sticker silhouette. This is the current look (brief section 22).
  deep                 The same without the hairline.
  light                Pale tints, one solid accent, hairline only (brief section 21, not chosen).
  v1                   The original look: three-tone shading and a white sticker silhouette.

All fills use CSS variables with hex fallbacks, so inlined SVGs follow the design tokens and
standalone SVGs still render. Run from the repo root:

  python tools/illustrations/gen.py                      deep-line style into src/assets/illustrations
  python tools/illustrations/gen.py --style v1 --out public/illustration-v1
"""
import argparse, os, re

INK = ('--color-ink', '#1F2F6B')
COL = {
    'accent': ('--color-accent', '#B0306B'),
    'land': ('--color-land', '#FFC9DB'),
    'land-strong': ('--color-land-strong', '#FF8FB8'),
    'water': ('--color-water', '#BFE4F0'),
    'water-deep': ('--color-water-deep', '#6F8FDB'),
    'park': ('--color-park', '#A8DEC3'),
    'park-deep': ('--color-park-deep', '#17935F'),
    'glow': ('--color-glow', '#FFE08A'),
    'flag': ('--color-flag', '#FF9B54'),
    'ink': INK,
    'paper': ('--color-paper', '#FFFFFF'),
}

def cv(role):
    v, h = COL[role]
    return f'var({v}, {h})'

class Piece:
    def __init__(self, name, title, vb, parts, pad=(8, 8), line='accent', full=()):
        self.name, self.title, self.vb, self.pad = name, title, vb, pad
        self.parts = parts  # part -> css color expression
        self.defs, self.art, self.sil, self.n = [], [], [], 0

    def cls(self, part, tone=''):
        return f'{self.name}-{part}{tone}'

    def css(self):
        out = []
        for part, base in self.parts.items():
            shade = f'color-mix(in oklab, {base} 86%, {cv("ink")})'
            hi = f'color-mix(in oklab, {base} 60%, #fff)'
            out.append(f'.{self.cls(part)}{{fill:{base}}}.{self.cls(part,"-s")}{{fill:{shade}}}.{self.cls(part,"-h")}{{fill:{hi}}}')
        out.append(f'.{self.name}-glow{{fill:{cv("glow")};opacity:var(--scene-glow,0)}}')
        return ''.join(out)

    # shaded shape: el(attrs) returns an element string. bbox = (x,y,w,h)
    def solid(self, el, bbox, part, sil=True, shade=True, sw=0.26):
        self.n += 1
        cid = f'{self.name}-c{self.n}'
        x, y, w, h = bbox
        self.defs.append(f'<clipPath id="{cid}">{el("")}</clipPath>')
        self.art.append(el(f'class="{self.cls(part)}"'))
        if shade:
            sx = x + w * (1 - sw)
            self.art.append(
                f'<g clip-path="url(#{cid})">'
                f'<rect class="{self.cls(part,"-h")}" x="{x}" y="{y}" width="{w}" height="{h*0.1:.1f}"/>'
                f'<rect class="{self.cls(part,"-h")}" x="{x}" y="{y}" width="{w*0.07:.1f}" height="{h}"/>'
                f'<rect class="{self.cls(part,"-s")}" x="{sx:.1f}" y="{y}" width="{w*sw+2:.1f}" height="{h}"/>'
                f'<rect class="{self.cls(part,"-s")}" x="{x}" y="{y+h*0.86:.1f}" width="{w}" height="{h*0.14+2:.1f}"/>'
                f'</g>')
        if sil:
            self.sil.append(el('fill="#fff" stroke="#fff" stroke-width="12" stroke-linejoin="round"'))

    def ball(self, cx, cy, r, part, sil=True):
        self.n += 1
        cid = f'{self.name}-c{self.n}'
        self.defs.append(f'<clipPath id="{cid}"><circle cx="{cx}" cy="{cy}" r="{r}"/></clipPath>')
        self.art.append(
            f'<circle class="{self.cls(part,"-s")}" cx="{cx}" cy="{cy}" r="{r}"/>'
            f'<g clip-path="url(#{cid})"><circle class="{self.cls(part)}" cx="{cx-r*0.14:.1f}" cy="{cy-r*0.16:.1f}" r="{r}"/></g>'
            f'<circle class="{self.cls(part,"-h")}" cx="{cx-r*0.4:.1f}" cy="{cy-r*0.42:.1f}" r="{r*0.15:.1f}"/>')
        if sil:
            self.sil.append(f'<circle cx="{cx}" cy="{cy}" r="{r}" fill="#fff" stroke="#fff" stroke-width="12"/>')

    def flat(self, el, part, sil=False):
        self.art.append(el(f'class="{self.cls(part)}"'))
        if sil:
            self.sil.append(el('fill="#fff" stroke="#fff" stroke-width="12" stroke-linejoin="round"'))

    def raw(self, s):
        self.art.append(s)

    def glow_rect(self, x, y, w, h, rx, part='win'):
        self.flat(lambda a: f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{rx}" {a}/>', part)
        self.art.append(f'<rect class="{self.name}-glow" x="{x}" y="{y}" width="{w}" height="{h}" rx="{rx}"/>')

    def circle_glow(self, cx, cy, r, part='win'):
        self.art.append(f'<circle class="{self.cls(part)}" cx="{cx}" cy="{cy}" r="{r}"/><circle class="{self.name}-glow" cx="{cx}" cy="{cy}" r="{r}"/>')

    def stroke_path(self, d, w=5):
        self.art.append(f'<path d="{d}" fill="none" stroke="{cv("paper")}" stroke-width="{w}" stroke-linecap="round"/>')

    def svg(self):
        px, py = self.pad
        return (
            f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{self.vb}" role="img" aria-labelledby="{self.name}-title">'
            f'<title id="{self.name}-title">{self.title}</title>'
            f'<style>{self.css()}</style>'
            f'<defs>{"".join(self.defs)}</defs>'
            f'<g transform="translate({px} {py})">'
            f'<g class="{self.name}-sticker" aria-hidden="true">{"".join(self.sil)}</g>'
            f'{"".join(self.art)}'
            f'</g></svg>')

# ---------------- light style (brief section 21) ----------------
TINT = 32  # percent of the base color kept in a pale fill (the rest is white)

class LightPiece(Piece):
    """Line art. One pale tint per part, a hairline stroke in one line color, optional full-strength
    accent parts, no shade tones and no white sticker silhouette."""

    def __init__(self, name, title, vb, parts, pad=(8, 8), line='accent', full=()):
        super().__init__(name, title, vb, parts, pad)
        self.line, self.full = line, set(full)

    def css(self):
        n, line = self.name, cv(self.line)
        out = [
            f'.piece-{n} :where(path,rect,circle,ellipse){{stroke:{line};stroke-width:var(--ba-line-w,1.5px);'
            f'stroke-linejoin:round;stroke-linecap:round;vector-effect:non-scaling-stroke}}'
        ]
        for part, base in self.parts.items():
            if part in self.full:
                fill = base
            elif base == cv('accent'):
                fill = f'color-mix(in oklab, {cv("land")} 55%, #fff)'  # berry becomes cotton-candy pink, not dusty mauve
            else:
                fill = f'color-mix(in oklab, {base} {TINT}%, #fff)'
            out.append(f'.{self.cls(part)}{{fill:{fill}}}')
        out.append(f'.{n}-glow{{fill:{cv("glow")};opacity:var(--scene-glow,0);stroke:none}}')
        out.append(f'.{n}-hatch{{fill:none;stroke-width:1px;opacity:.55}}')
        out.append(f'.{n}-wave{{fill:none;stroke:{cv("water-deep")}}}')
        return ''.join(out)

    def _hatch(self, el, bbox):
        x, y, w, h = bbox
        self.n += 1
        cid = f'{self.name}-c{self.n}'
        self.defs.append(f'<clipPath id="{cid}">{el("")}</clipPath>')
        xr = x + w - 3
        count = max(2, int(w * 0.2 / 5))
        lines = ''.join(f'M{xr - i * 5:.1f} {y + h:.1f} L{xr - i * 5 + h * 0.28:.1f} {y:.1f}' for i in range(count))
        self.art.append(f'<g clip-path="url(#{cid})"><path class="{self.name}-hatch" d="{lines}"/></g>')

    def solid(self, el, bbox, part, sil=True, shade=True, sw=0.26, hatch=False):
        self.art.append(el(f'class="{self.cls(part)}"'))
        if hatch:
            self._hatch(el, bbox)

    def ball(self, cx, cy, r, part, sil=True):
        self.art.append(f'<circle class="{self.cls(part)}" cx="{cx}" cy="{cy}" r="{r}"/>')

    def flat(self, el, part, sil=False):
        self.art.append(el(f'class="{self.cls(part)}"'))

    def circle_glow(self, cx, cy, r, part='win'):
        self.art.append(f'<circle class="{self.cls(part)}" cx="{cx}" cy="{cy}" r="{r}"/><circle class="{self.name}-glow" cx="{cx}" cy="{cy}" r="{r}"/>')

    def stroke_path(self, d, w=5):
        self.art.append(f'<path class="{self.name}-wave" d="{d}"/>')

    def svg(self):
        px, py = self.pad
        return (
            f'<svg xmlns="http://www.w3.org/2000/svg" class="piece-{self.name}" viewBox="{self.vb}" role="img" aria-labelledby="{self.name}-title">'
            f'<title id="{self.name}-title">{self.title}</title>'
            f'<style>{self.css()}</style>'
            f'<defs>{"".join(self.defs)}</defs>'
            f'<g transform="translate({px} {py})">{"".join(self.art)}</g></svg>')


# ---------------- deep style: v1 colors and shading, no white sticker, optional hairline ----------------
class DeepPiece(Piece):
    """Version 1 deep palette and three-tone shading without the white sticker silhouette.
    With outline=True, a 1.5 px hairline in the piece line color is drawn over each shape."""

    def __init__(self, name, title, vb, parts, pad=(8, 8), line='accent', full=(), outline=False):
        super().__init__(name, title, vb, parts, pad)
        self.line, self.outline = line, outline

    def _o(self, el):
        if self.outline:
            self.art.append(el(f'fill="none" stroke="{cv(self.line)}" stroke-width="1.5px" stroke-linejoin="round" vector-effect="non-scaling-stroke"'))

    def solid(self, el, bbox, part, sil=True, shade=True, sw=0.26, hatch=False):
        super().solid(el, bbox, part, sil=False, shade=shade, sw=sw)
        self._o(el)

    def flat(self, el, part, sil=False):
        super().flat(el, part, sil=False)
        self._o(el)

    def ball(self, cx, cy, r, part, sil=True):
        super().ball(cx, cy, r, part, sil=False)
        self._o(lambda a: f'<circle cx="{cx}" cy="{cy}" r="{r}" {a}/>')

    def stroke_path(self, d, w=5):
        self.art.append(f'<path d="{d}" fill="none" stroke="{cv("water-deep")}" stroke-width="1.5px" stroke-linecap="round" vector-effect="non-scaling-stroke"/>')

    def svg(self):
        px, py = self.pad
        return (
            f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{self.vb}" role="img" aria-labelledby="{self.name}-title">'
            f'<title id="{self.name}-title">{self.title}</title>'
            f'<style>{self.css()}</style>'
            f'<defs>{"".join(self.defs)}</defs>'
            f'<g transform="translate({px} {py})">{"".join(self.art)}</g></svg>')

STYLE = 'deep-line'

def make(*a, **k):
    if STYLE == 'light':
        return LightPiece(*a, **k)
    if STYLE in ('deep', 'deep-line'):
        return DeepPiece(*a, outline=(STYLE == 'deep-line'), **k)
    return Piece(*a, **k)


def R(x, y, w, h, rx=0):
    return lambda a: f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{rx}" {a}/>'

def P(d):
    return lambda a: f'<path d="{d}" {a}/>'

# ---------------- ferry ----------------
def ferry():
    p = make('ferry', 'A pink and berry passenger ferry with a glowing cabin', '0 0 270 190',
              {'hull': cv('accent'), 'stripe': cv('paper'), 'cabin': cv('land'), 'bridge': cv('water'),
               'funnel': cv('flag'), 'band': cv('accent'), 'win': cv('water-deep'), 'mast': cv('ink'), 'pennant': cv('glow')},
              line='ink', full=('funnel', 'band', 'pennant'))
    p.flat(R(58, 26, 4, 42, 2), 'mast', sil=True)
    p.flat(P('M62 28 L92 37 L62 46 Z'), 'pennant', sil=True)
    p.solid(R(128, 8, 26, 32, 5), (128, 8, 26, 32), 'funnel')
    p.flat(R(128, 16, 26, 8, 0), 'band')
    p.solid(R(98, 34, 86, 36, 10), (98, 34, 86, 36), 'bridge')
    p.glow_rect(108, 44, 66, 14, 6)
    p.solid(R(46, 64, 172, 38, 10), (46, 64, 172, 38), 'cabin')
    for i in range(5):
        p.glow_rect(64 + 30 * i, 74, 20, 17, 6)
    p.solid(P('M16 98 L248 98 L227 143 Q223 151 213 151 L51 151 Q41 151 37 143 Z'), (16, 98, 232, 53), 'hull')
    p.flat(R(30, 111, 208, 9, 4), 'stripe')
    for x in (62, 94, 126, 158, 190):
        p.flat(lambda a, x=x: f'<circle cx="{x}" cy="135" r="5" {a}/>', 'win')
    p.stroke_path('M12 158 q12 -9 24 0 t24 0 t24 0 t24 0 t24 0 t24 0 t24 0 t24 0 t24 0')
    p.stroke_path('M48 166 q12 -9 24 0 t24 0 t24 0 t24 0 t24 0 t24 0')
    return p

# ---------------- estate ----------------
def estate():
    p = make('estate', 'A lakeside estate house with a berry roof and glowing windows', '0 0 336 226',
              {'wall': cv('water-deep'), 'roof': cv('accent'), 'roofmain': cv('land-strong'), 'trim': cv('paper'), 'door': cv('flag'),
               'chimney': cv('land-strong'), 'win': cv('water'), 'mast': cv('ink'), 'flag': cv('glow')},
              line='accent', full=('door', 'flag', 'roofmain'))
    p.flat(R(158, 2, 3, 26, 1.5), 'mast', sil=True)
    p.flat(P('M161 4 L186 10 L161 16 Z'), 'flag', sil=True)
    p.solid(R(196, 30, 18, 38, 3), (196, 30, 18, 38), 'chimney')
    p.solid(R(14, 120, 92, 84, 6), (14, 120, 92, 84), 'wall')
    p.solid(R(214, 120, 92, 84, 6), (214, 120, 92, 84), 'wall')
    p.solid(R(84, 84, 152, 120, 8), (84, 84, 152, 120), 'wall')
    p.solid(P('M6 124 L30 92 L90 92 L114 124 Z'), (6, 92, 108, 32), 'roof')
    p.solid(P('M206 124 L230 92 L290 92 L314 124 Z'), (206, 92, 108, 32), 'roof')
    p.solid(P('M70 92 L160 24 L250 92 Z'), (70, 24, 180, 68), 'roofmain')
    p.circle_glow(160, 66, 11, 'win')
    for x in (100, 148, 196):
        p.glow_rect(x, 102, 24, 30, 9)
    p.glow_rect(96, 152, 18, 30, 7)
    p.glow_rect(206, 152, 18, 30, 7)
    for x in (28, 62):
        p.glow_rect(x, 140, 18, 28, 7)
    for x in (240, 274):
        p.glow_rect(x, 140, 18, 28, 7)
    p.flat(R(114, 134, 92, 10, 5), 'trim')
    p.flat(R(122, 144, 8, 54, 3), 'trim')
    p.flat(R(190, 144, 8, 54, 3), 'trim')
    p.solid(R(144, 150, 32, 54, 16), (144, 150, 32, 54), 'door', sil=False)
    p.flat(R(114, 198, 92, 8, 4), 'trim', sil=True)
    return p

# ---------------- tree ----------------
def tree():
    p = make('tree', 'A round lollipop tree', '0 0 112 142', {'leaf': cv('park-deep'), 'trunk': cv('park-deep'), 'dot': cv('park')}, pad=(8, 8),
              line='park-deep', full=('dot',))
    p.solid(R(46, 76, 9, 50, 4), (46, 76, 9, 50), 'trunk', shade=False)
    p.ball(50, 46, 38, 'leaf')
    for cx, cy in ((34, 58), (62, 30), (68, 62)):
        p.flat(lambda a, cx=cx, cy=cy: f'<circle cx="{cx}" cy="{cy}" r="5" {a}/>', 'dot')
    return p

# ---------------- people ----------------
def guest1():
    p = make('guest01', 'A wedding guest in a berry dress with a hair bun', '0 0 64 112',
              {'skin': 'var(--skin, #E3AE8A)', 'hair': 'var(--hair, #5A3A22)', 'dress': cv('accent'), 'shoe': cv('ink')}, pad=(12, 8),
              line='accent', full=('skin', 'hair'))
    p.flat(lambda a: f'<circle cx="24" cy="4" r="5.5" {a}/>', 'hair', sil=True)
    p.flat(lambda a: f'<circle cx="24" cy="15" r="11.5" {a}/>', 'hair', sil=True)
    p.flat(lambda a: f'<circle cx="24" cy="17" r="10" {a}/>', 'skin')
    p.flat(R(5, 32, 7, 28, 3.5), 'skin', sil=True)
    p.flat(R(36, 32, 7, 28, 3.5), 'skin', sil=True)
    p.flat(R(16, 62, 7, 26, 3.5), 'skin', sil=True)
    p.flat(R(25, 62, 7, 26, 3.5), 'skin', sil=True)
    p.flat(lambda a: f'<ellipse cx="19.5" cy="90" rx="6.5" ry="3.5" {a}/>', 'shoe', sil=True)
    p.flat(lambda a: f'<ellipse cx="28.5" cy="90" rx="6.5" ry="3.5" {a}/>', 'shoe', sil=True)
    p.solid(P('M13 30 Q24 25 35 30 L42 68 Q24 75 6 68 Z'), (6, 25, 36, 50), 'dress')
    return p

def guest2():
    p = make('guest02', 'A wedding guest in a periwinkle suit', '0 0 64 112',
              {'skin': 'var(--skin, #5E3B28)', 'hair': 'var(--hair, #2B2118)', 'suit': cv('water-deep'), 'shirt': cv('paper'),
               'tie': cv('accent'), 'pants': cv('ink')}, pad=(12, 8),
              line='accent', full=('skin', 'hair', 'tie'))
    p.flat(lambda a: f'<circle cx="24" cy="17" r="10" {a}/>', 'skin', sil=True)
    p.flat(P('M13.5 16 A10.5 10.5 0 0 1 34.5 16 Q24 8.5 13.5 16 Z'), 'hair')
    p.solid(R(14, 66, 9, 24, 3), (14, 66, 9, 24), 'pants', sil=True, shade=False)
    p.solid(R(25, 66, 9, 24, 3), (25, 66, 9, 24), 'pants', sil=True, shade=False)
    p.flat(lambda a: f'<ellipse cx="18.5" cy="91" rx="7" ry="3.5" {a}/>', 'pants', sil=True)
    p.flat(lambda a: f'<ellipse cx="29.5" cy="91" rx="7" ry="3.5" {a}/>', 'pants', sil=True)
    p.solid(R(11, 28, 26, 42, 9), (11, 28, 26, 42), 'suit')
    p.solid(R(3, 30, 9, 32, 4.5), (3, 30, 9, 32), 'suit')
    p.solid(R(36, 30, 9, 32, 4.5), (36, 30, 9, 32), 'suit')
    p.flat(lambda a: f'<circle cx="7.5" cy="64" r="4" {a}/>', 'skin', sil=True)
    p.flat(lambda a: f'<circle cx="40.5" cy="64" r="4" {a}/>', 'skin', sil=True)
    p.flat(P('M19 28 L24 42 L29 28 Z'), 'shirt')
    p.flat(P('M22.5 33 L25.5 33 L26.5 44 L24 48 L21.5 44 Z'), 'tie')
    return p

if __name__ == '__main__':
    ap = argparse.ArgumentParser(description='Generate the Bubblegum Atlas illustrations.')
    ap.add_argument('--style', choices=['deep-line', 'deep', 'light', 'v1'], default='deep-line')
    ap.add_argument('--out', default='src/assets/illustrations', help='output folder, relative to the repo root')
    args = ap.parse_args()
    STYLE = args.style
    pieces = {
        'wedding/landmark-ferry': ferry(),
        'wedding/landmark-estate': estate(),
        'shared/prop-tree-round': tree(),
        'shared/person-guest-01': guest1(),
        'shared/person-guest-02': guest2(),
    }
    for fname, piece in pieces.items():
        path = f'{args.out}/{fname}.svg'
        os.makedirs(os.path.dirname(path), exist_ok=True)
        s = piece.svg()
        with open(path, 'w', encoding='utf-8') as f:
            f.write(s)
        print(path, len(s), 'bytes')

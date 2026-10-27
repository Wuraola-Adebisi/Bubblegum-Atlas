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

    def css(self):
        # Night dimming: every fill is pulled toward a deep navy by --scene-halo, so lit windows stand out.
        # Halo: a larger soft yellow shape behind each lit window. It only shows at night.
        def dim(c):
            return f'color-mix(in oklab, var(--scene-night, #1E2457) calc(var(--scene-halo, 0) * 38%), {c})'
        out = []
        for part, base in self.parts.items():
            shade = f'color-mix(in oklab, {base} 86%, {cv("ink")})'
            hi = f'color-mix(in oklab, {base} 60%, #fff)'
            out.append(f'.{self.cls(part)}{{fill:{dim(base)}}}.{self.cls(part, "-s")}{{fill:{dim(shade)}}}.{self.cls(part, "-h")}{{fill:{dim(hi)}}}')
        out.append(f'.{self.name}-glow{{fill:{cv("glow")};opacity:var(--scene-glow,0)}}')
        out.append(f'.{self.name}-halo{{fill:{cv("glow")};opacity:calc(var(--scene-halo,0) * .45);stroke:none}}')
        return ''.join(out)

    def glow_rect(self, x, y, w, h, rx, part='win'):
        pad = 7
        self.art.append(f'<rect class="{self.name}-halo" x="{x - pad}" y="{y - pad}" width="{w + 2 * pad}" height="{h + 2 * pad}" rx="{rx + pad}"/>')
        super().glow_rect(x, y, w, h, rx, part)

    def circle_glow(self, cx, cy, r, part='win'):
        self.art.append(f'<circle class="{self.name}-halo" cx="{cx}" cy="{cy}" r="{r + 7}"/>')
        super().circle_glow(cx, cy, r, part)

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
               'funnel': cv('flag'), 'band': cv('accent'), 'win': cv('water-deep'), 'mast': cv('water-deep'), 'pennant': cv('glow')},
              line='accent', full=('funnel', 'band', 'pennant'))
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

# ---------------- map landmarks (build step 3) ----------------
def _waves(p, y, x0, n):
    p.stroke_path(f'M{x0} {y} q12 -9 24 0' + ' t24 0' * (n - 1))

def _quad(p0, c, p1, t):
    u = 1 - t
    return (u * u * p0[0] + 2 * u * t * c[0] + t * t * p1[0], u * u * p0[1] + 2 * u * t * c[1] + t * t * p1[1])

def _swag(p, p0, c, p1, n, part='bulb'):
    """A string of lights: a hairline curve with lit bulbs that follow the glow channel."""
    p.stroke_path(f'M{p0[0]} {p0[1]} Q{c[0]} {c[1]} {p1[0]} {p1[1]}')
    for i in range(1, n + 1):
        x, y = _quad(p0, c, p1, i / (n + 1))
        p.circle_glow(round(x, 1), round(y + 3, 1), 3.5, part)

def jetty():
    p = make('jetty', 'A wooden jetty with glowing lamp posts', '0 0 300 128',
             {'deck': cv('land'), 'post': cv('accent'), 'bulb': cv('paper')}, line='accent')
    for x in (24, 84, 144, 204, 256):
        p.flat(R(x, 52, 8, 46, 3), 'post')
    p.solid(R(8, 40, 268, 18, 6), (8, 40, 268, 18), 'deck')
    for x in (34, 134, 234):
        p.flat(R(x, 8, 4, 36, 2), 'post')
        p.circle_glow(x + 2, 8, 6, 'bulb')
    _waves(p, 104, 8, 11)
    _waves(p, 114, 32, 9)
    return p

def boathouse():
    p = make('boathouse', 'A lakeside boathouse with a berry roof and a lit terrace', '0 0 232 200',
             {'wall': cv('water-deep'), 'roof': cv('accent'), 'door': cv('flag'), 'deck': cv('paper'), 'win': cv('water')},
             line='accent')
    p.solid(R(20, 76, 176, 74, 6), (20, 76, 176, 74), 'wall')
    p.solid(P('M8 80 L108 22 L208 80 Z'), (8, 22, 200, 58), 'roof')
    p.circle_glow(108, 58, 10, 'win')
    p.glow_rect(124, 100, 22, 28, 8)
    p.glow_rect(158, 100, 22, 28, 8)
    p.solid(P('M44 150 L44 124 Q44 96 72 96 Q100 96 100 124 L100 150 Z'), (44, 96, 56, 54), 'door', sil=False)
    for x in (24, 80, 136, 192):
        p.flat(R(x, 158, 8, 16, 3), 'roof')
    p.solid(R(8, 148, 216, 14, 5), (8, 148, 216, 14), 'deck')
    _waves(p, 174, 12, 8)
    _waves(p, 184, 36, 6)
    return p

def arch():
    p = make('arch', 'A ceremony arch covered in pink and orange flowers', '0 0 156 204',
             {'post': cv('paper'), 'bloom': cv('land-strong'), 'bloom2': cv('flag'), 'bloom3': cv('glow'),
              'leaf': cv('park-deep'), 'runner': cv('accent'), 'bulb': cv('paper')}, line='accent')
    p.flat(P('M52 180 L108 180 L122 188 L38 188 Z'), 'runner')
    p.solid(R(22, 64, 12, 116, 5), (22, 64, 12, 116), 'post')
    p.solid(R(126, 64, 12, 116, 5), (126, 64, 12, 116), 'post')
    p.solid(P('M22 70 Q80 -14 138 70 L126 72 Q80 10 34 72 Z'), (22, 20, 116, 52), 'post')
    for y in (96, 124, 152):
        p.circle_glow(28, y, 3.5, 'bulb')
        p.circle_glow(132, y, 3.5, 'bulb')
    for t, part, r in ((0.1, 'bloom', 9), (0.28, 'bloom2', 7), (0.5, 'bloom', 10), (0.72, 'bloom3', 7), (0.9, 'bloom', 9)):
        x, y = _quad((28, 71), (80, -4), (132, 71), t)
        p.ball(round(x, 1), round(y, 1), r, part)
    p.ball(28, 176, 9, 'leaf')
    p.ball(132, 176, 9, 'leaf')
    return p

def marquee():
    p = make('marquee', 'A reception marquee strung with glowing lights', '0 0 296 192',
             {'wall': cv('paper'), 'roof': cv('accent'), 'stripe': cv('paper'), 'door': cv('flag'), 'mast': cv('ink'),
              'pennant': cv('glow'), 'win': cv('water'), 'bulb': cv('paper')}, line='accent', full=('pennant',))
    p.flat(R(142, 4, 3, 20, 1.5), 'mast', sil=True)
    p.flat(P('M145 6 L168 12 L145 18 Z'), 'pennant', sil=True)
    p.solid(R(22, 94, 244, 74, 6), (22, 94, 244, 74), 'wall')
    p.solid(P('M8 98 L144 22 L280 98 Z'), (8, 22, 272, 76), 'roof')
    for a, b in ((46, 84), (122, 144), (144, 166), (204, 242)):
        p.flat(P(f'M144 22 L{a} 98 L{b} 98 Z'), 'stripe')
    p.glow_rect(40, 114, 36, 38, 12)
    p.glow_rect(212, 114, 36, 38, 12)
    p.solid(P('M118 168 L118 144 Q118 118 144 118 Q170 118 170 144 L170 168 Z'), (118, 118, 52, 50), 'door', sil=False)
    _swag(p, (16, 104), (80, 148), (144, 104), 4)
    _swag(p, (144, 104), (208, 148), (272, 104), 4)
    return p

def cafe():
    p = make('cafe', 'A lakeside cafe with a striped awning and an outdoor table', '0 0 248 184',
             {'wall': cv('land-strong'), 'roof': cv('accent'), 'awn': cv('accent'), 'stripe': cv('paper'), 'door': cv('flag'),
              'win': cv('water'), 'pole': cv('ink'), 'table': cv('paper'), 'bulb': cv('paper')}, line='accent')
    p.solid(R(8, 62, 168, 98, 8), (8, 62, 168, 98), 'wall')
    p.solid(R(2, 48, 180, 20, 8), (2, 48, 180, 20), 'roof')
    p.solid(R(8, 74, 168, 24, 6), (8, 74, 168, 24), 'awn')
    for x in (20, 62, 104, 146):
        p.flat(R(x, 74, 14, 24, 0), 'stripe')
    p.glow_rect(22, 108, 70, 44, 10)
    p.solid(R(112, 106, 44, 54, 22), (112, 106, 44, 54), 'door', sil=False)
    for x in (26, 62, 98, 134, 160):
        p.circle_glow(x, 104, 3, 'bulb')
    p.flat(R(206, 112, 4, 48, 2), 'pole')
    p.flat(P('M184 114 Q208 80 232 114 Z'), 'awn', sil=True)
    p.flat(lambda a: f'<ellipse cx="208" cy="158" rx="20" ry="6" {a}/>', 'table', sil=True)
    return p

def hotel():
    p = make('hotel', 'A four-storey guest hotel with a lit sign', '0 0 192 248',
             {'wall': cv('park'), 'roof': cv('accent'), 'door': cv('flag'), 'awn': cv('accent'), 'win': cv('water'), 'sign': cv('paper')},
             line='accent')
    p.solid(R(24, 52, 136, 180, 8), (24, 52, 136, 180), 'wall')
    p.solid(R(14, 38, 156, 20, 7), (14, 38, 156, 20), 'roof')
    p.glow_rect(60, 12, 64, 20, 10, 'sign')
    for y in (68, 106, 144):
        for x in (42, 80, 118):
            p.glow_rect(x, y, 24, 28, 8)
    p.solid(R(76, 186, 32, 46, 16), (76, 186, 32, 46), 'door', sil=False)
    p.solid(R(60, 176, 64, 14, 6), (60, 176, 64, 14), 'awn')
    return p

def shuttle():
    p = make('shuttle', 'A wedding shuttle bus with lit windows', '0 0 232 114',
             {'body': cv('flag'), 'stripe': cv('paper'), 'win': cv('water'), 'wheel': cv('ink'), 'hub': cv('paper'), 'lamp': cv('paper')},
             line='accent')
    p.solid(R(8, 22, 208, 60, 16), (8, 22, 208, 60), 'body')
    p.flat(R(8, 54, 208, 8, 0), 'stripe')
    for i in range(5):
        p.glow_rect(26 + 37 * i, 32, 29, 18, 6)
    p.circle_glow(204, 70, 5, 'lamp')
    for x in (56, 168):
        p.ball(x, 84, 14, 'wheel')
        p.flat(lambda a, x=x: f'<circle cx="{x}" cy="84" r="5" {a}/>', 'hub')
    return p

# ---------------- walking avatars and a cake (home page estate walk) ----------------
def _grp(p, cls, *calls):
    """Wrap the pieces drawn by `calls` in a <g class=...>, so CSS can swing them while someone walks."""
    p.raw(f'<g class="{cls}">')
    for c in calls:
        c()
    p.raw('</g>')

def avatar_dress():
    p = make('avdress', 'A guest in a berry dress who walks as you scroll', '0 0 64 112',
             {'skin': 'var(--skin, #E3AE8A)', 'hair': 'var(--hair, #5A3A22)', 'dress': cv('accent'), 'shoe': cv('ink')}, pad=(12, 8),
             line='accent', full=('skin', 'hair'))
    p.flat(lambda a: f'<circle cx="24" cy="4" r="5.5" {a}/>', 'hair', sil=True)
    p.flat(lambda a: f'<circle cx="24" cy="15" r="11.5" {a}/>', 'hair', sil=True)
    p.flat(lambda a: f'<circle cx="24" cy="17" r="10" {a}/>', 'skin')
    _grp(p, 'av-arm av-arm-a', lambda: p.flat(R(5, 32, 7, 28, 3.5), 'skin', sil=True))
    _grp(p, 'av-arm av-arm-b', lambda: p.flat(R(36, 32, 7, 28, 3.5), 'skin', sil=True))
    _grp(p, 'av-leg av-leg-a', lambda: p.flat(R(16, 62, 7, 26, 3.5), 'skin', sil=True),
         lambda: p.flat(lambda a: f'<ellipse cx="19.5" cy="90" rx="6.5" ry="3.5" {a}/>', 'shoe', sil=True))
    _grp(p, 'av-leg av-leg-b', lambda: p.flat(R(25, 62, 7, 26, 3.5), 'skin', sil=True),
         lambda: p.flat(lambda a: f'<ellipse cx="28.5" cy="90" rx="6.5" ry="3.5" {a}/>', 'shoe', sil=True))
    p.solid(P('M13 30 Q24 25 35 30 L42 68 Q24 75 6 68 Z'), (6, 25, 36, 50), 'dress')
    return p

def avatar_suit():
    p = make('avsuit', 'A guest in a periwinkle suit who walks as you scroll', '0 0 64 112',
             {'skin': 'var(--skin, #5E3B28)', 'hair': 'var(--hair, #2B2118)', 'suit': cv('water-deep'), 'shirt': cv('paper'),
              'tie': cv('accent'), 'pants': cv('ink')}, pad=(12, 8), line='accent', full=('skin', 'hair', 'tie'))
    p.flat(lambda a: f'<circle cx="24" cy="17" r="10" {a}/>', 'skin', sil=True)
    p.flat(P('M13.5 16 A10.5 10.5 0 0 1 34.5 16 Q24 8.5 13.5 16 Z'), 'hair')
    _grp(p, 'av-leg av-leg-a', lambda: p.solid(R(14, 66, 9, 24, 3), (14, 66, 9, 24), 'pants', sil=True, shade=False),
         lambda: p.flat(lambda a: f'<ellipse cx="18.5" cy="91" rx="7" ry="3.5" {a}/>', 'pants', sil=True))
    _grp(p, 'av-leg av-leg-b', lambda: p.solid(R(25, 66, 9, 24, 3), (25, 66, 9, 24), 'pants', sil=True, shade=False),
         lambda: p.flat(lambda a: f'<ellipse cx="29.5" cy="91" rx="7" ry="3.5" {a}/>', 'pants', sil=True))
    p.solid(R(11, 28, 26, 42, 9), (11, 28, 26, 42), 'suit')
    _grp(p, 'av-arm av-arm-a', lambda: p.solid(R(3, 30, 9, 32, 4.5), (3, 30, 9, 32), 'suit'),
         lambda: p.flat(lambda a: f'<circle cx="7.5" cy="64" r="4" {a}/>', 'skin', sil=True))
    _grp(p, 'av-arm av-arm-b', lambda: p.solid(R(36, 30, 9, 32, 4.5), (36, 30, 9, 32), 'suit'),
         lambda: p.flat(lambda a: f'<circle cx="40.5" cy="64" r="4" {a}/>', 'skin', sil=True))
    p.flat(P('M19 28 L24 42 L29 28 Z'), 'shirt')
    p.flat(P('M22.5 33 L25.5 33 L26.5 44 L24 48 L21.5 44 Z'), 'tie')
    return p

def cake():
    p = make('cake', 'A three tier wedding cake with a lit candle', '0 0 144 140',
             {'plate': cv('water-deep'), 'tier1': cv('paper'), 'tier2': cv('land-strong'), 'tier3': cv('paper'),
              'candle': cv('accent'), 'bulb': cv('paper'), 'berry': cv('flag')}, line='accent')
    p.flat(R(4, 118, 136, 12, 6), 'plate', sil=True)
    p.solid(R(12, 84, 120, 36, 9), (12, 84, 120, 36), 'tier1')
    p.solid(R(32, 54, 80, 32, 9), (32, 54, 80, 32), 'tier2')
    p.solid(R(52, 28, 40, 28, 9), (52, 28, 40, 28), 'tier3')
    for x in (30, 52, 72, 92, 114):
        p.ball(x, 84, 5, 'berry')
    p.flat(R(70, 10, 4, 20, 2), 'candle')
    p.circle_glow(72, 6, 6, 'bulb')
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
        'wedding/landmark-jetty': jetty(),
        'wedding/landmark-boathouse': boathouse(),
        'wedding/landmark-arch': arch(),
        'wedding/landmark-marquee': marquee(),
        'wedding/landmark-cafe': cafe(),
        'wedding/landmark-hotel': hotel(),
        'wedding/prop-shuttle': shuttle(),
        'wedding/prop-cake': cake(),
        'shared/avatar-dress': avatar_dress(),
        'shared/avatar-suit': avatar_suit(),
    }
    for fname, piece in pieces.items():
        path = f'{args.out}/{fname}.svg'
        os.makedirs(os.path.dirname(path), exist_ok=True)
        s = piece.svg()
        with open(path, 'w', encoding='utf-8') as f:
            f.write(s)
        print(path, len(s), 'bytes')

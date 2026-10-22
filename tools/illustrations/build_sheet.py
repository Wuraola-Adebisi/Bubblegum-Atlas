"""Builds public/illustration-sheet.html (deep-line style, inline so the time slider works) and writes the
v1 SVGs to public/illustration-v1 for the before and after comparison.

Run from the repo root after gen.py:  python tools/illustrations/build_sheet.py
"""
import os, sys
sys.path.insert(0, os.path.dirname(__file__))
import gen

def build(style):
    gen.STYLE = style
    return {
        'landmark-ferry': gen.ferry(), 'landmark-estate': gen.estate(), 'prop-tree-round': gen.tree(),
        'person-guest-01': gen.guest1(), 'person-guest-02': gen.guest2(),
    }

light = {k: v.svg() for k, v in build('deep-line').items()}
os.makedirs('public/illustration-v1', exist_ok=True)
for k, v in build('v1').items():
    with open(f'public/illustration-v1/{k}.svg', 'w', encoding='utf-8') as f:
        f.write(v.svg())

def fig(name, width, bg='transparent'):
    return (f'<figure><div class="card" style="background:{bg}"><div style="width:{width}px">{light[name]}</div></div>'
            f'<figcaption>{name}</figcaption></figure>')

def old(name, width):
    return (f'<figure><div class="card"><img src="/illustration-v1/{name}.svg" alt="" width="{width}"></div>'
            f'<figcaption>{name}, version 1</figcaption></figure>')

large = [('landmark-ferry', 420), ('landmark-estate', 460), ('prop-tree-round', 150), ('person-guest-01', 110), ('person-guest-02', 110)]

def at(name, left, top, width):
    return f'<div style="left:{left}%;top:{top}%;width:{width}px">{light[name]}</div>'

html = f"""<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Bubblegum Atlas: illustration test sheet</title>
<style>
  :root {{ --scene-glow: 0; --color-ink: #1F2F6B; }}
  body {{ margin: 0; padding: 40px 24px 80px; background: #FFF6F8; color: #1F2F6B; font: 17px/1.6 "DM Sans Variable", "DM Sans", system-ui, sans-serif; }}
  main {{ max-width: 1280px; margin: 0 auto; }}
  h1 {{ font: 800 clamp(2rem, 5vw, 3.25rem)/1 "Bricolage Grotesque Variable", system-ui, sans-serif; margin: 0 0 12px; }}
  h2 {{ font: 800 1.5rem/1.2 "Bricolage Grotesque Variable", system-ui, sans-serif; margin: 56px 0 20px; }}
  p {{ max-width: 70ch; margin: 0 0 16px; }}
  .row {{ display: flex; flex-wrap: wrap; gap: 28px; align-items: flex-end; }}
  figure {{ margin: 0; display: flex; flex-direction: column; align-items: center; gap: 8px; }}
  figcaption {{ font-size: 14px; font-weight: 500; }}
  .card {{ padding: 12px; display: flex; align-items: flex-end; justify-content: center; }}
  svg {{ display: block; width: 100%; height: auto; }}
  img {{ display: block; height: auto; max-width: 100%; }}
  .panel {{ background: #fff; border: 1.5px dashed #6F8FDB; border-radius: 28px; padding: 24px; max-width: 520px; }}
  label {{ display: flex; justify-content: space-between; font-weight: 500; margin-bottom: 12px; }}
  input[type=range] {{ width: 100%; accent-color: #B0306B; }}
  .scale {{ position: relative; width: 1000px; max-width: 100%; height: 300px; border-radius: 28px; overflow: hidden; background: #BFE4F0; }}
  .scale .land {{ position: absolute; left: 6%; right: 6%; top: 18%; bottom: 8%; background: #FFC9DB; border-radius: 46% 54% 50% 50% / 55% 45% 55% 45%; border: 1.5px solid #B0306B; }}
  .scale > div[style] {{ position: absolute; }}
  .phone {{ width: 360px; max-width: 100%; }}
</style>
</head>
<body>
<main id="sheet">
  <h1>Illustration test sheet, deep line style</h1>
  <p>The same five pieces with the deep v1 colors and shading, a 1.5 px hairline in one color per piece, and no white sticker outline. Windows light up with the time slider. Version 1 is shown underneath for comparison.</p>

  <div class="panel">
    <label for="glow"><span>Time of day</span><span id="glow-out">Daytime</span></label>
    <input id="glow" type="range" min="0" max="100" value="0" aria-valuetext="Daytime">
  </div>

  <h2>Deep line style, large</h2>
  <div class="row">{''.join(fig(n, w) for n, w in large)}</div>

  <h2>Version 1, for comparison</h2>
  <div class="row">{''.join(old(n, w) for n, w in large)}</div>

  <h2>At map scale</h2>
  <p>The sizes in the scale ladder on a 1600 unit wide map shown at 1000 pixels. The lines stay at 1.5 px at every scale, so check that small pieces such as the guests still read.</p>
  <div class="scale" role="img" aria-label="The five illustrations placed on a small pink island at map scale">
    <div class="land"></div>
    {at('landmark-ferry', 5, 60, 140)}
    {at('landmark-estate', 36, 20, 168)}
    {at('prop-tree-round', 68, 34, 38)}
    {at('prop-tree-round', 75, 40, 34)}
    {at('person-guest-01', 58, 58, 30)}
    {at('person-guest-02', 63, 58, 30)}
  </div>

  <h2>At phone width</h2>
  <p>The same scene on a 360 pixel wide screen. Open the page on a real phone to judge the hairlines.</p>
  <div class="scale phone" role="img" aria-label="The island scene at phone width" style="height: 210px">
    <div class="land"></div>
    {at('landmark-estate', 30, 18, 100)}
    {at('landmark-ferry', 4, 56, 80)}
    {at('person-guest-01', 66, 56, 22)}
    {at('person-guest-02', 76, 56, 22)}
  </div>
</main>
<script>
  var slider = document.getElementById('glow');
  var out = document.getElementById('glow-out');
  slider.addEventListener('input', function () {{
    var v = Number(slider.value) / 100;
    document.getElementById('sheet').style.setProperty('--scene-glow', String(v));
    var label = v < 0.25 ? 'Daytime' : v < 0.75 ? 'Golden hour' : 'Dusk';
    out.textContent = label;
    slider.setAttribute('aria-valuetext', label);
  }});
</script>
</body>
</html>
"""
with open('public/illustration-sheet.html', 'w', encoding='utf-8') as f:
    f.write(html)
print('wrote public/illustration-sheet.html and public/illustration-v1/')

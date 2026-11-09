"""Scrub the day page under 4x CPU throttle and print frame and style-recalc cost.
Usage: python tools/perf/scrub.py URL [width height [from to]]   (from and to are 0 to 1)
Needs: pip install playwright && playwright install chromium. Headless has no GPU, so read the numbers as relative.
"""
import sys, json, subprocess, time, statistics
from playwright.sync_api import sync_playwright

URL = sys.argv[1]
W, H = (int(sys.argv[2]), int(sys.argv[3])) if len(sys.argv) > 3 else (390, 844)
STEPS = 80
LO = float(sys.argv[4]) if len(sys.argv) > 4 else 0.0
HI = float(sys.argv[5]) if len(sys.argv) > 5 else 1.0

with sync_playwright() as p:
    b = p.chromium.launch()
    ctx = b.new_context(viewport={'width': W, 'height': H}, reduced_motion='no-preference')
    page = ctx.new_page()
    errs = []
    page.on('console', lambda m: errs.append(m.text) if m.type == 'error' else None)
    page.on('pageerror', lambda e: errs.append(str(e)))
    page.goto(URL, wait_until='networkidle')
    page.wait_for_selector('input[type=range]')
    cdp = ctx.new_cdp_session(page)
    cdp.send('Performance.enable')
    cdp.send('Emulation.setCPUThrottlingRate', {'rate': 4})
    # warm up
    page.evaluate("""() => new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)))""")
    def metrics():
        return {m['name']: m['value'] for m in cdp.send('Performance.getMetrics')['metrics']}
    m0 = metrics()
    times = page.evaluate("""async ([steps, lo, hi]) => {
      const el = document.querySelector('input[type=range]');
      const min = +el.min, max = +el.max, st = +el.step || 1;
      const set = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set;
      const raf2 = () => new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));
      const out = [];
      for (let i = 0; i <= steps; i++) {
        const v = Math.round((min + (max - min) * (lo + (hi - lo) * i / steps)) / st) * st;
        const t0 = performance.now();
        set.call(el, String(v));
        el.dispatchEvent(new Event('input', { bubbles: true }));
        await raf2();
        out.push(performance.now() - t0);
      }
      return out;
    }""", [STEPS, LO, HI])
    m1 = metrics()
    d = lambda k: round((m1[k] - m0[k]) * 1000)
    print(json.dumps({
        'viewport': f'{W}x{H}',
        'mean_ms_per_step': round(statistics.mean(times), 1),
        'median_ms': round(statistics.median(times), 1),
        'p90_ms': round(sorted(times)[int(len(times) * 0.9)], 1),
        'recalc_style_ms_total': d('RecalcStyleDuration'),
        'layout_ms_total': d('LayoutDuration'),
        'script_ms_total': d('ScriptDuration'),
        'task_ms_total': d('TaskDuration'),
        'console_errors': errs[:3],
    }))
    b.close()

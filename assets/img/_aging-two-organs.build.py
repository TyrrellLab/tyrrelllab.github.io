"""Redraws assets/img/aging-two-organs.svg.

Run from the project root:  python3 assets/img/_aging-two-organs.build.py

The two labels are Lexend converted to outlines, because the SVG is loaded
through an <img> and a page webfont cannot reach inside one. That means the
words are not editable in the file: change them here and rebuild. Needs
fontTools, which reads the woff2 in assets/vendor directly.
"""
import sys
sys.path.insert(0, 'assets/img')
from _aging_two_organs_textpath import text_path

INK   = "#0b2417"   # --card-ink
GREEN = "#1a5632"   # --uab-green
GOLD  = "#b07d05"   # a darkened --uab-gold, for contrast on cream

HEART = """M 24 -16 C 31 -8, 31 6, 25 16
C 18 27, 2 37, -16 38 C -22 28, -26 14, -24 2
C -22 -12, -12 -22, 0 -24 C 9 -25, 18 -21, 24 -16 Z"""
HEART_VESSELS = """M -3 -24 L -6 -40
M 8 -24 L 8 -41
M 18 -20 L 23 -35
M 5 -22 C 1 -8, -6 1, -16 6"""

BRAIN = """M -30 0 C -32 -14, -22 -27, -4 -28
C 15 -29, 30 -19, 31 -6 C 32 4, 26 11, 17 13
C 10 19, -4 21, -14 17 C -25 13, -30 7, -30 0 Z"""
BRAIN_GYRI = """M -24 0 C -14 -2, -2 2, 8 -2
M -20 -14 C -14 -21, -5 -22, 1 -18
M 4 -22 C 12 -20, 18 -14, 19 -8
M -26 -7 C -21 -12, -14 -12, -9 -9"""
BRAIN_STEM = """M 12 15 C 20 13, 25 16, 24 21 C 23 26, 15 26, 11 22
M 3 20 C 4 27, 2 32, -2 34"""

def label(s, cx, baseline, size=13, weight=500, tracking=0.15):
    d, w = text_path(s, size, weight, tracking)
    return f'<g transform="translate({cx - w/2:.1f} {baseline})"><path d="{d}" fill="{INK}"/></g>'

def arrow(cx, y0, y1):
    h = 4.5
    return (f'<path d="M {cx} {y0} V {y1}" stroke="{GOLD}" stroke-width="2" stroke-linecap="round" fill="none"/>'
            f'<path d="M {cx-h} {y1-h} L {cx} {y1+1.5} L {cx+h} {y1-h}" stroke="{GOLD}" stroke-width="2" '
            f'stroke-linecap="round" stroke-linejoin="round" fill="none"/>')

def build():
    L, R, ORGAN_Y = 82, 238, 56
    p = []
    p.append(f'<g transform="translate({L} {ORGAN_Y})" stroke="{GREEN}" fill="none" stroke-linecap="round" stroke-linejoin="round">')
    p.append(f'  <path d="{HEART}" stroke-width="3.2" fill="{GREEN}" fill-opacity=".07"/>')
    p.append(f'  <path d="{HEART_VESSELS}" stroke-width="3"/>')
    p.append('</g>')
    p.append(f'<g transform="translate({R} {ORGAN_Y})" stroke="{GREEN}" fill="none" stroke-linecap="round" stroke-linejoin="round">')
    p.append(f'  <path d="{BRAIN}" stroke-width="3.2" fill="{GREEN}" fill-opacity=".07"/>')
    p.append(f'  <path d="{BRAIN_GYRI}" stroke-width="2.2"/>')
    p.append(f'  <path d="{BRAIN_STEM}" stroke-width="3"/>')
    p.append('</g>')
    p.append(arrow(L, 104, 118))
    p.append(arrow(R, 104, 118))
    p.append(label("Atherosclerosis", L, 140))
    p.append(label("Neurodegeneration", R, 140))
    body = '\n'.join(p)
    return f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 160" width="320" height="160" role="img" aria-label="Aging in two organs: the heart, leading to atherosclerosis, and the brain, leading to neurodegeneration">
{body}
</svg>
'''

if __name__ == '__main__':
    open('assets/img/aging-two-organs.svg','w').write(build())
    import os; print('wrote', os.path.getsize('assets/img/aging-two-organs.svg'), 'bytes')

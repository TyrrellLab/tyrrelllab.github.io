"""Redraws assets/img/old-mice-cd8.svg.

Run from the project root:  python3 assets/img/_old-mice-cd8.build.py

Same rules as the other card's drawing: the labels are Lexend converted to
outlines, so they are not editable in the SVG. Change them here and rebuild.
"""
import sys
sys.path.insert(0, 'assets/img')
from _aging_two_organs_textpath import text_path

INK, GREEN, GOLD = "#0b2417", "#1a5632", "#b07d05"

MOUSE = """M -48 6 C -45 -1, -38 -7, -30 -7
C -22 -7, -16 -11, -8 -15 C 6 -21, 24 -17, 32 -5
C 40 7, 34 19, 20 21 C 4 23, -12 19, -26 13
C -36 9, -46 9, -48 6 Z"""
MOUSE_TAIL = """M 33 8 C 46 14, 56 12, 60 4 C 63 -2, 60 -8, 55 -8"""
MOUSE_EAR  = ("-22", "-11", "7.5")
MOUSE_EYE  = ("-34", "-2", "1.9")
MOUSE_SNOUT= """M -47 1 C -53 -2, -58 -5, -61 -9
M -47 9 C -53 11, -58 13, -61 16"""
MOUSE_FEET = """M -6 21 C -6 26, -3 28, 1 27
M 16 21 C 16 26, 19 28, 23 26"""

CELLS = [(-19,-16,7.5,1),(2,-19,6.5,0),(17,-6,7,1),(-6,2,7.5,0),
         (13,14,6.5,0),(-18,10,6,0),(0,-3,5,0)]

def label(s, cx, baseline, size=13, weight=500, tracking=0.15):
    d, w = text_path(s, size, weight, tracking)
    return f'<g transform="translate({cx - w/2:.1f} {baseline})"><path d="{d}" fill="{INK}"/></g>'

def build():
    MX, MY = 74, 58
    CX, CY, R = 236, 58, 42
    p = []
    # the animal
    p.append(f'<g transform="translate({MX} {MY})" stroke="{GREEN}" fill="none" stroke-linecap="round" stroke-linejoin="round">')
    p.append(f'  <path d="{MOUSE}" stroke-width="3.2" fill="{GREEN}" fill-opacity=".07"/>')
    p.append(f'  <path d="{MOUSE_TAIL}" stroke-width="2.6"/>')
    p.append(f'  <path d="{MOUSE_SNOUT}" stroke-width="1.8" stroke-opacity=".8"/>')
    p.append(f'  <path d="{MOUSE_FEET}" stroke-width="2.6"/>')
    p.append(f'  <circle cx="{MOUSE_EAR[0]}" cy="{MOUSE_EAR[1]}" r="{MOUSE_EAR[2]}" stroke-width="3"/>')
    p.append(f'  <circle cx="{MOUSE_EYE[0]}" cy="{MOUSE_EYE[1]}" r="{MOUSE_EYE[2]}" fill="{GREEN}" stroke="none"/>')
    p.append('</g>')
    # the callout: two lines from the flank opening onto the field of view
    p.append(f'<g stroke="{GOLD}" stroke-width="1.6" fill="none" stroke-linecap="round" opacity=".85">')
    p.append(f'  <path d="M 128 44 L {CX-R+3} {CY-R+9}"/>')
    p.append(f'  <path d="M 128 70 L {CX-R+3} {CY+R-9}"/>')
    p.append('</g>')
    # the field of view
    p.append(f'<circle cx="{CX}" cy="{CY}" r="{R}" fill="none" stroke="{GREEN}" stroke-width="2.4" stroke-opacity=".55"/>')
    p.append(f'<g transform="translate({CX} {CY})" stroke="{GREEN}" stroke-width="2.4">')
    for x, y, r, solid in CELLS:
        if solid:
            p.append(f'  <circle cx="{x}" cy="{y}" r="{r}" fill="{GREEN}" fill-opacity=".85" stroke="none"/>')
        else:
            p.append(f'  <circle cx="{x}" cy="{y}" r="{r}" fill="{GREEN}" fill-opacity=".07"/>')
    p.append('</g>')
    p.append(label("Aged", MX, 126))
    p.append(label("CD8+ T cells", CX, 126))
    body = '\n'.join(p)
    return f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 140" width="320" height="140" role="img" aria-label="An aged mouse, and a magnified field of its T cells with the CD8+ population picked out">
{body}
</svg>
'''

if __name__ == '__main__':
    open('assets/img/old-mice-cd8.svg','w').write(build())
    import os; print('wrote', os.path.getsize('assets/img/old-mice-cd8.svg'), 'bytes')

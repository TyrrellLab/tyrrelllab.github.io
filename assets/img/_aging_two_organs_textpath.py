from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.misc.transform import Transform

_cache = {}
def _font(weight):
    if weight not in _cache:
        f = TTFont('assets/vendor/lexend-latin.woff2')
        _cache[weight] = instantiateVariableFont(f, {'wght': weight}, inplace=False)
    return _cache[weight]

def text_path(s, size, weight=500, tracking=0.0):
    """Return (path_d, advance_width) for `s` set in Lexend, baseline at y=0,
       starting at x=0, in user units where `size` is the em size."""
    font = _font(weight)
    upem = font['head'].unitsPerEm
    cmap = font.getBestCmap()
    gs = font.getGlyphSet()
    hmtx = font['hmtx']
    scale = size / upem
    x = 0.0
    parts = []
    for ch in s:
        gname = cmap.get(ord(ch))
        if gname is None:
            x += size * 0.3 + tracking
            continue
        pen = SVGPathPen(gs, ntos=lambda v: f"{v:.1f}")
        tp = TransformPen(pen, Transform(scale, 0, 0, -scale, x, 0))
        gs[gname].draw(tp)
        d = pen.getCommands()
        if d: parts.append(d)
        x += hmtx[gname][0] * scale + tracking
    return ' '.join(parts), x - tracking

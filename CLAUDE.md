# The Tyrrell Lab website

A static site: no build step, no package manager. Start the server with
`python3 -m http.server 4173`. See [SERVER.md](SERVER.md).

Read [DESIGN.md](DESIGN.md) before you change colour, type, layout or movement.
Read [PRODUCT.md](PRODUCT.md) before you change the words on a page. All the
documents use ASD-STE100 Simplified Technical English. Keep them short.

## Images

**Do not make a reference to a JPEG file or a PNG file in `assets/img/news/`
or in `assets/img/gallery/`.** Each photograph is a WebP file. This rule is
most important for news posts, because their photographs arrive in groups
directly from a phone. Convert the files first, then write the markup:

```bash
python3 - <<'PY'
from PIL import Image
import glob, os, shutil

LONG_EDGE, QUALITY = 1200, 78          # news. Gallery uses 1500.
KEEP = 'assets/_originals/news'        # sources stage here, see below
os.makedirs(KEEP, exist_ok=True)

for p in glob.glob('assets/img/news/*.jpg') + glob.glob('assets/img/news/*.png'):
    im = Image.open(p).convert('RGB')
    w, h = im.size
    if max(w, h) > LONG_EDGE:          # never upscale
        s = LONG_EDGE / max(w, h)
        im = im.resize((round(w * s), round(h * s)), Image.LANCZOS)
    out = os.path.splitext(p)[0] + '.webp'
    im.save(out, 'WEBP', quality=QUALITY, method=6)
    print(f'{os.path.basename(out)}  {im.width}x{im.height}  {os.path.getsize(out)//1024} KB')
    shutil.move(p, os.path.join(KEEP, os.path.basename(p)))
PY
```

The folder `assets/_originals/` is a temporary location, not an archive. Delete
its contents after you look at the feed and agree that the feed is correct.

Do not use less than 1200 px. The file `assets/js/lightbox.js` opens the `src`
file of the tile at full screen size, thus a tile that shows at 240 px is the
same file that a visitor sees at approximately 1000 px.

In `news.html`, each photograph is a lightbox tile with all four of these
items:

```html
<figure class="shot" style="--r:1.3333"><button class="lb" type="button"
  data-kicker="Post headline" aria-label="Open larger: Post headline"><img
  src="assets/img/news/YYYYMM_name.webp" width="1200" height="900"
  alt="What is actually in the photograph" loading="lazy" decoding="async"></button></figure>
```

- `--r` is the width divided by the height. It controls the band layout. If it
  is incorrect, the bottom edges of the row are not level.
- `width` and `height` are the true pixel dimensions of the file. They prevent
  a change of the layout. They are not a display size.
- Put `loading="lazy"` on each image except the first tile of the newest post.
- The `alt` text describes the photograph, not the post. A screen reader speaks
  it.

**A photograph has no visible caption.** Do not put `<figcaption class="cap">`
on a tile, and do not let `lightbox.js` use the `alt` text for the caption
line. A reader who opens a photograph sees the photograph, the chapter label
and the counter. Alt text stays on each image, because a screen reader has no
other data, but alt text is too literal for a caption. Write it for the person
who cannot see the photograph, and show no text to the person who can.

After you convert the files, make sure that no file in `assets/img/news/` is a
`.jpg` file or a `.png` file, and that `grep -c '\.jpg' news.html` gives 0.

## Publications

Each entry in `publications.html` is one `<li>` element of continuous text. The
landing page finds the title by its class, thus a new entry needs `.ti`:

```html
<li><span class="lab">Ali MA</span>, ... <span class="lab">Tyrrell DJ</span>.
<span class="ti">The paper's title goes here.</span> Journal. 2026 Jan 4.
<span class="meta">...</span></li>
```

Without `.ti` the block finds no title and stays hidden, and it gives no
message. Put a new entry at the top of the `<ol class="pubs">` list for the
current year. The years are in sequence from the most recent, and so are the
entries in each year. `assets/js/latest.js` uses the first `<li>` of the first
`.pubyear`.

## The other rules

- **Give each font size in `rem`, not px.** 1rem is 16px, thus divide a px
  value by 16. This lets a reader who increased the default font size of the
  browser get a larger site. Keep padding and gaps in px.
- **Increase the `?v=` number on each asset that you change.** If you do not,
  a visitor who comes again gets the old file:

  | file | pages that link to it |
  |---|---|
  | `site.css` | all seven pages. Increase the number on all seven |
  | `hero.css`, `hero-scene.js`, `hero-liquid.js`, `latest.js` | index only |
  | `lightbox.js` | gallery and news |
  | `newsfilter.js` | news only |
- **Do not use an em dash or an en dash in the words on a page.** Do not use
  `—`, `–`, `&mdash;` or `&ndash;`. Use a full stop if the two clauses are
  complete, a comma for a short parenthesis, or a colon if the second part
  gives an explanation. For a range, use "to" or a hyphen. For a compound
  scientific term, use a hyphen: blood-brain barrier, cGAS-STING, TLR9-MyD88.
  In a page title, use `&middot;`. Check with:

  ```bash
  grep -c '—\|–\|&mdash;\|&ndash;' *.html
  ```
- **Give a commit no co-author who is not a member of the lab.** Do not add a
  `Co-Authored-By:` line for an AI assistant or for any other tool. Only a
  person who supervised the work can be an author or a co-author of a commit.
- **Git is the undo function, but only for tracked files.** GitHub Pages
  deploys the site from `main`. You can recover a tracked file that you delete.
  The files that `.gitignore` keeps out have **no other copy**: these are
  `assets/_originals/`, `*.bak`, `_removed-*/` and the source files under
  `assets/img/` that are not WebP files. Move those files out of the folder, do
  not delete them, and tell the user which files you moved. Check first:

  ```bash
  git check-ignore <path>        # silent means tracked, so git can restore it
  ```

  Do not make a new `_removed-*/` folder. A branch or a commit does the same
  task and adds no weight.
- **A new photograph in `assets/img/` must be a WebP file, or the site does not
  deploy it.** `.gitignore` keeps out `*.jpg`, `*.jpeg` and `*.png` there. Five
  images are exceptions, and they stay only because of the `!` lines at the
  bottom of the ignore file. A sixth such image is kept out with no message:
  the page operates on your computer and gives a 404 error after the
  deployment. Convert the image, or add a `!` line. This command prints nothing
  if git will commit each image that a page uses. Do not add `-v`, because `-v`
  also reports the `!` lines, which are correct:

  ```bash
  git check-ignore $(grep -oh 'assets/img/[^"]*\.\(jpg\|png\)' *.html | sort -u)
  ```
- Keep the accessibility contract in DESIGN.md true. It is a list of conditions
  that are correct now, not a list of aims.

## The landing page reads the other pages

`assets/js/latest.js` gets `publications.html` and `news.html` when the page
loads, then fills `#latest` on the index page with the two most recent papers
and the six most recent posts. There is no second copy of that content, thus a
change to one of those pages changes the landing page.

The script fails with no message, and this is intentional. `#latest` starts
with the `hidden` attribute, and the script removes the attribute only after it
reads some data, thus a failed request leaves no empty box. The cost is that a
usual reference error also gives a clean console and an empty section. If the
block is not on the page, put a message in the `.catch()` function before you
examine the markup.

## Do not use a JavaScript width test to control the layout

CSS decides what shows at each width. If JavaScript does a `matchMedia` test
one time only, the page stays incorrect: the parts that CSS controls change
when the user makes the window narrow, and the part that JavaScript controls
does not. `latest.js` had this defect. Now it gets the data at each width, and
`.latest{ display:none }` outside the 900px query hides the block. If you must
read a breakpoint in JavaScript, use a listener.

## Notes on method

- **Make sure of your work with a screenshot, not only with measurements.** In
  this project a button label was cut and a block was defective, but the
  measurements of both were correct.
- **If you change nested markup with a script, count the depth of the tags.**
  If you match a sequence of `</div>` tags, the script removes a closing tag
  that belongs to a parent element. This made `research.html` defective.
- **Examine what a section of a file contains before you replace it.** One
  replacement between two anchors deleted a helper function.

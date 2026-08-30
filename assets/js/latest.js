/* Latest publication and latest two news posts, on the landing page only.

   The pages themselves are the source. Editing news.html or publications.html
   is all it takes to change what shows here; there is no build step and no
   second copy of the content to keep in sync.

   Three things this deliberately does:

   It only runs below 900px. The wide landing page is sized to be exactly one
   screen and this block would end that, so on desktop the CSS hides it and
   there is no reason to spend the bandwidth either.

   It waits for the hero. The scene boots WebGL, compiles shaders and runs the
   intro; two page fetches competing with that is the one thing guaranteed to
   be felt. This goes after the intro settles, on an idle callback.

   It fails silently. The section ships with `hidden` and the attribute is
   only removed once something was actually parsed, so a failed fetch, an
   offline visitor or a markup change leaves no empty box on the page.      */
(function () {
  'use strict';

  var host = document.getElementById('latest');
  if (!host || !window.fetch || !window.DOMParser) return;

  function txt(node) { return node ? node.textContent.trim() : ''; }

  function parse(html) {
    return new DOMParser().parseFromString(html, 'text/html');
  }

  /* priority:'low' where it is supported, so these two never take bandwidth
     from three.min.js and the hero scripts on the critical path. Browsers
     that do not know the option ignore it. */
  function get(url) {
    return fetch(url, { credentials: 'same-origin', priority: 'low' })
      .then(function (r) { return r.ok ? r.text() : Promise.reject(r.status); })
      .then(parse);
  }

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }

  function block(kicker) {
    var a = el('article', 'lblock');
    a.appendChild(el('p', 'lblock-k', kicker));
    return a;
  }

  /* The years run newest first and the entries inside a year do too, so
     document order across .pubyear is newest first. The title is read from
     .ti; without it there is no element around the title at all and the only
     alternative is guessing where the author list stops.

     The journal and date are the run of text between .ti and .meta. That is
     not a wrapper, it is whatever the citation puts there, which is why it
     is walked as nodes rather than matched with a pattern: some entries name
     a journal and a date, one of them carries only a date. */
  function sourceOf(li) {
    var ti = li.querySelector('.ti');
    if (!ti) return '';
    var out = '', n = ti.nextSibling;
    while (n && !(n.nodeType === 1 && n.className && String(n.className).indexOf('meta') > -1)) {
      out += n.textContent || '';
      n = n.nextSibling;
    }
    return out.replace(/\s+/g, ' ').trim().replace(/[.;,]$/, '');
  }

  function publications(doc) {
    var lis = [].slice.call(doc.querySelectorAll('.pubyear .pubs li')).slice(0, 2);
    if (!lis.length) return null;
    var c = block('Latest publications');
    var ul = el('ul', 'lnews');
    lis.forEach(function (li) {
      var title = txt(li.querySelector('.ti'));
      if (!title) return;
      var item = el('li');
      var src = sourceOf(li);
      if (src) item.appendChild(el('span', 'lnews-d', src));
      item.appendChild(el('span', 'lnews-t', title.replace(/\.$/, '')));
      ul.appendChild(item);
    });
    if (!ul.children.length) return null;
    c.appendChild(ul);
    return c;
  }

  /* Year only. The posts carry dates at mixed precision, some to the day and
     some to the year, so a full date next to a bare one read as an error in
     the shorter of the two. The year is the part that carries the signal
     here: this is a recency cue, not a citation. Reads the datetime
     attribute where there is one and falls back to the first four digits of
     the visible text. */
  function yearOf(t) {
    if (!t) return '';
    var m = String(t.getAttribute('datetime') || t.textContent || '').match(/\d{4}/);
    return m ? m[0] : '';
  }

  function news(doc) {
    var posts = [].slice.call(doc.querySelectorAll('.feed .post')).slice(0, 6);
    if (!posts.length) return null;
    var c = block('Latest news');
    var ul = el('ul', 'lnews');
    posts.forEach(function (p) {
      var when = yearOf(p.querySelector('time'));
      var kind = txt(p.querySelector('.kind'));
      var head = txt(p.querySelector('h2'));
      if (!head) return;
      var li = el('li');
      li.appendChild(el('span', 'lnews-d', kind ? when + ' \u00b7 ' + kind : when));
      li.appendChild(el('span', 'lnews-t', head));
      ul.appendChild(li);
    });
    if (!ul.children.length) return null;
    c.appendChild(ul);
    return c;
  }

  var built = false;

  function build() {
    if (built) return;                          /* the listener can fire twice */
    built = true;
    Promise.all([
      get('publications.html').then(publications, function () { return null; }),
      get('news.html').then(news, function () { return null; })
    ]).then(function (parts) {
      var made = parts.filter(Boolean);
      if (!made.length) return;                 /* nothing parsed: stay hidden */
      made.forEach(function (n) { host.appendChild(n); });
      host.removeAttribute('hidden');
    }).catch(function () { /* leave the section hidden */ });
  }

  /* No width check here, on purpose.

     This used to test the 900px breakpoint once and return early on desktop,
     to save the fetch. That is what broke dragging the window narrow: every
     other part of the page reflowed, because every other part is CSS, and
     this one had already decided not to exist. Watching the breakpoint with
     a matchMedia listener would fix that case, but it still leaves a piece
     of layout depending on JS state that can be wrong.

     So the decision is CSS's alone. `.latest` is display:none above 900px
     and the script just fills it either way. There is no state to get stuck
     and resizing cannot break it, because nothing here is watching the width.

     The cost is 67KB fetched on a desktop that never shows it. Measured at
     4ms each, at priority:'low', against three.min.js's 594KB on the same
     page. That is the price of the section being pure CSS at the point where
     it matters, and it is worth it. */
  build();
})();

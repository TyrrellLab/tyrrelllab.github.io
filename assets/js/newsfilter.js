/* Topic filter for the news feed.

   The feed carries one .kind label per post, and there are more labels than
   anyone wants to see as buttons — eleven of them across thirty posts, several
   describing the same thing ("Talk", "Poster", "Conference", "Training" all
   mean somebody went somewhere and presented). So the buttons are groups, not
   raw labels, and GROUPS below maps a group to the labels it swallows.

   A label that isn't in GROUPS still gets its own button rather than vanishing,
   so adding a new .kind to a post can never silently drop it out of the feed.

   The bar is built here rather than in the markup: with scripting off there is
   nothing to click, and a row of dead buttons is worse than no row at all.     */
(function () {
  var feed = document.querySelector('.feed');
  if (!feed) return;

  var posts = [].slice.call(feed.querySelectorAll('article.post'));
  if (!posts.length) return;

  var GROUPS = [
    ['Research',         ['Talk', 'Poster', 'Conference', 'Training']],
    ['Funding & awards', ['Grant', 'Fellowship', 'Award']],
    ['People',           ['Arrivals', 'Milestone', 'Lab opens']],
    ['Lab life',         ['Lab life']]
  ];

  function slug(s) {
    return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  }

  function kindOf(p) {
    var k = p.querySelector('.kind');
    return k ? k.textContent.trim() : '';
  }

  /* groups, plus a catch-all button for any label GROUPS doesn't cover */
  var seen = {};
  var groups = GROUPS.map(function (g) {
    g[1].forEach(function (k) { seen[k] = true; });
    return { label: g[0], kinds: g[1].slice() };
  });
  posts.forEach(function (p) {
    var k = kindOf(p);
    if (k && !seen[k]) { seen[k] = true; groups.push({ label: k, kinds: [k] }); }
  });

  groups.forEach(function (g) {
    g.slug = slug(g.label);
    g.n = posts.filter(function (p) { return g.kinds.indexOf(kindOf(p)) > -1; }).length;
  });
  groups = groups.filter(function (g) { return g.n > 0; });
  if (groups.length < 2) return;                 /* nothing to sort by */

  var years   = [].slice.call(feed.querySelectorAll('.yr'));
  var yrLinks = [].slice.call(document.querySelectorAll('.yrjump a'));

  var bar = document.createElement('nav');
  bar.className = 'kindfilter';
  bar.setAttribute('aria-label', 'Filter posts by topic');

  var live = document.createElement('p');
  live.className = 'kindfilter-live';
  live.setAttribute('role', 'status');
  live.setAttribute('aria-live', 'polite');

  var btns = [];
  function addBtn(label, key, n) {
    var b = document.createElement('button');
    b.type = 'button';
    b.setAttribute('aria-pressed', 'false');
    b.setAttribute('data-topic', key);
    b.appendChild(document.createTextNode(label));
    var c = document.createElement('span');
    c.className = 'n';
    c.textContent = n;
    b.appendChild(c);
    b.addEventListener('click', function () { apply(key, true); });
    bar.appendChild(b);
    btns.push(b);
  }

  addBtn('All', 'all', posts.length);
  groups.forEach(function (g) { addBtn(g.label, g.slug, g.n); });

  function apply(key, push) {
    var g = null;
    groups.forEach(function (x) { if (x.slug === key) g = x; });
    if (!g) key = 'all';

    posts.forEach(function (p) {
      p.hidden = !!g && g.kinds.indexOf(kindOf(p)) === -1;
    });

    /* a year with nothing left in it goes too, and so does its jump link */
    var last = null;
    years.forEach(function (y) {
      var any = [].slice.call(y.querySelectorAll('article.post')).some(function (p) {
        return !p.hidden;
      });
      y.hidden = !any;
      y.classList.remove('is-last');
      if (any) last = y;
    });
    if (last) last.classList.add('is-last');     /* the spine stops at the last one */

    yrLinks.forEach(function (a) {
      var t = document.getElementById(a.getAttribute('href').slice(1));
      a.hidden = !!(t && t.hidden);
    });

    btns.forEach(function (b) {
      b.setAttribute('aria-pressed', b.getAttribute('data-topic') === key ? 'true' : 'false');
    });

    var n = g ? g.n : posts.length;
    live.textContent = n + (n === 1 ? ' post' : ' posts') + ' shown';

    if (push) {
      try {
        var u = new URL(location.href);
        if (key === 'all') u.searchParams.delete('topic');
        else u.searchParams.set('topic', key);
        history.replaceState(null, '', u);
      } catch (e) { /* file:// and old engines — the filter still works */ }
    }
  }

  var yj = document.querySelector('.yrjump');
  if (yj) yj.parentNode.insertBefore(bar, yj);
  else feed.parentNode.insertBefore(bar, feed);
  bar.parentNode.insertBefore(live, bar.nextSibling);

  var start = 'all';
  try { start = new URL(location.href).searchParams.get('topic') || 'all'; } catch (e) {}
  apply(start, false);
})();

/* Shared photo viewer.
   Used by gallery.html and news.html. Any <button class="lb"> on the page
   joins the set, in document order; the button's own <img> is the photo and
   its .cap (if present) is the caption. A data-kicker on the button, or the
   nearest [data-kicker] ancestor, supplies the small gold label.

   Photographs carry no caption in the viewer. Every tile still has alt text,
   because a screen reader needs it, but alt is written to describe a frame
   and reads as a label rather than a caption when it is put on screen.

   Cleanup deliberately hangs off shut() rather than the dialog's own close
   event: that event does not fire in every engine, and when it doesn't, the
   previous photo's src is left in place and focus is stranded inside a hidden
   dialog. shut() is idempotent, so the close listener below is a safety net
   and not the mechanism. Do not move the cleanup back onto the event.        */
(function () {
  var dlg = document.querySelector('.lbox');
  if (!dlg || !dlg.showModal) return;              /* no <dialog>: tiles stay inert */

  var srcs = [].slice.call(document.querySelectorAll('button.lb'));
  if (!srcs.length) return;

  /* News can filter posts out from under us, and stepping next/prev into a
     photo nobody can see is a dead end. The pool is recomputed on open, so
     pages that never hide anything (the gallery) behave exactly as before.  */
  var pool = srcs;
  function onScreen(b) { return !b.closest('[hidden]'); }

  var big = dlg.querySelector('img');
  var lab = dlg.querySelector('figcaption b');
  var txt = dlg.querySelector('figcaption span');
  var cnt = dlg.querySelector('.lb-count');
  var i = 0, opener = null;

  function kickerFor(b) {
    if (b.getAttribute('data-kicker')) return b.getAttribute('data-kicker');
    var host = b.closest('[data-kicker]');
    return host ? host.getAttribute('data-kicker') : '';
  }

  function show(n) {
    if (!pool.length) return;
    i = (n + pool.length) % pool.length;
    var b = pool[i];
    var img = b.querySelector('img');
    var cap = b.querySelector('.cap');
    big.src = img.currentSrc || img.src;
    big.alt = img.alt;
    lab.textContent = kickerFor(b);
    /* No fallback to img.alt. Alt text exists for screen readers and it is
       written to describe the frame, which makes it far too literal to read
       as a caption under the photograph. The viewer shows a caption only if
       the tile carries a visible one, and no page currently does. */
    txt.textContent = cap ? cap.textContent : '';
    cnt.textContent = (i + 1) + ' / ' + pool.length;
  }

  function shut() {
    if (dlg.open) dlg.close();
    big.removeAttribute('src');
    if (opener) { opener.focus(); opener = null; }
  }

  srcs.forEach(function (b) {
    b.addEventListener('click', function () {
      opener = b;
      pool = srcs.filter(onScreen);
      show(pool.indexOf(b));
      dlg.showModal();
    });
  });

  dlg.querySelector('.lb-next').addEventListener('click', function () { show(i + 1); });
  dlg.querySelector('.lb-prev').addEventListener('click', function () { show(i - 1); });
  dlg.querySelector('.lb-close').addEventListener('click', shut);

  /* the backdrop, but not the photo or the controls */
  dlg.addEventListener('click', function (e) {
    if (e.target === dlg || e.target.classList.contains('lbox-in')) shut();
  });

  dlg.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowRight')     { e.preventDefault(); show(i + 1); }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); show(i - 1); }
    else if (e.key === 'Escape')    { e.preventDefault(); shut(); }
  });

  dlg.addEventListener('close', shut);
})();

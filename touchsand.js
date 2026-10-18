// Lays the projects out as beach towels, and the sunset pictures as polaroids. The data is projects.js.
(function () {
  'use strict';
  var STATUS = { playable: 'Playable', beta: 'Beta', open: 'Open build', workshop: 'In the workshop', soon: 'Coming soon' };
  var TOWELS = ['coral', 'sea', 'sun', 'palm', 'dusk'];
  var items = Array.isArray(window.CATALOG) ? window.CATALOG : [];

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text !== undefined) n.textContent = text;
    return n;
  }

  // Only a full https address is a real link. Anything else (a page that is not on this site) counts as not open yet.
  function link(it) {
    return it.status !== 'soon' && /^https:\/\/[^\s]+$/.test(it.url || '') ? it.url : '';
  }

  function towel(it, i) {
    var href = link(it);
    var status = href || it.status === 'soon' ? it.status : 'soon';
    var card = el('article', 'towel towel-' + TOWELS[i % TOWELS.length]);
    card.appendChild(el('span', 'ribbon', STATUS[status] || STATUS.soon));
    var art = el('div', 'art', (it.art && it.art.icon) || '🏖️');
    art.setAttribute('aria-hidden', 'true');
    card.appendChild(art);
    card.appendChild(el('h3', null, it.title || 'Untitled'));
    card.appendChild(el('p', 'tag', it.tagline || ''));
    if (it.blurb) card.appendChild(el('p', 'blurb', it.blurb));
    if (href) {
      var a = el('a', 'btn', 'Dig in');
      a.href = href;
      a.rel = 'noopener';
      a.setAttribute('aria-label', 'Dig in: ' + (it.title || 'project'));
      card.appendChild(a);
    } else {
      card.appendChild(el('span', 'btn off', 'Washing ashore soon'));
    }
    return card;
  }

  var grid = document.getElementById('grid');
  if (items.length === 0) {
    grid.appendChild(el('p', 'empty', 'The tide is out. Check back soon.'));
  } else {
    items.forEach(function (it, i) { grid.appendChild(towel(it, i)); });
    var burst = document.getElementById('burst');
    burst.textContent = items.length + (items.length === 1 ? ' project' : ' projects') + ' on the shore!';
    burst.hidden = false;
  }

  // Sunset pictures, only when there are any. Paths must stay inside sunset/.
  var shots = Array.isArray(window.SUNSETS) ? window.SUNSETS.filter(function (s) { return /^sunset\/[\w.-]+\.(jpe?g|png|webp)$/i.test(s.src || ''); }) : [];
  if (shots.length) {
    var wall = document.getElementById('polaroids');
    shots.forEach(function (s, n) {
      var fig = el('figure', 'polaroid');
      var img = el('img');
      img.src = s.src;
      img.alt = s.alt || 'Sunset at the beach';
      img.loading = 'lazy';
      img.decoding = 'async';
      fig.appendChild(img);
      if (s.caption) fig.appendChild(el('figcaption', null, s.caption));
      fig.style.setProperty('--tilt', (n % 2 ? 1 : -1) * (0.6 + (n % 3) * 0.5) + 'deg');
      wall.appendChild(fig);
    });
    document.getElementById('sunsets').hidden = false;
  }

  // A little celebration on arrival, skipped for anyone who asked for less motion.
  if (!window.matchMedia || !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    var colors = ['#ff6f59', '#ffc83d', '#2ec4b6', '#ffffff', '#ff9ec4', '#7fd1ff'];
    var layer = el('div', 'confetti');
    layer.setAttribute('aria-hidden', 'true');
    for (var k = 0; k < 36; k++) {
      var bit = el('i');
      bit.style.left = Math.round(Math.random() * 100) + '%';
      bit.style.background = colors[k % colors.length];
      bit.style.animationDelay = (Math.random() * 1.2).toFixed(2) + 's';
      bit.style.animationDuration = (2.4 + Math.random() * 1.8).toFixed(2) + 's';
      bit.style.setProperty('--drift', Math.round((Math.random() - 0.5) * 140) + 'px');
      layer.appendChild(bit);
    }
    document.body.appendChild(layer);
    setTimeout(function () { layer.remove(); }, 6500);
  }

  // Bunting across the top: one flag per 70px.
  var bunting = document.querySelector('.bunting');
  var flagColors = ['coral', 'sun', 'sea', 'pink'];
  for (var f = 0; f < 40; f++) bunting.appendChild(el('i', 'flag flag-' + flagColors[f % flagColors.length]));
})();

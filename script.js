(function () {
  'use strict';
  var doc = document.documentElement;
  doc.classList.add('js');
  var WA = 'https://wa.me/77714341199';

  /* Прайс-лист клиники (цены в тенге) */
  var CATS = ['Диагностика', 'Лечение', 'Удаление', 'Протезирование', 'Гигиена'];
  var PRICES = [
    ['Диагностика', 'Консультация', 'бесплатно'],
    ['Диагностика', 'Рентген-диагностика', '1 000 ₸'],
    ['Лечение', 'Лечение поверхностного кариеса', '5 000 ₸'],
    ['Лечение', 'Лечение среднего кариеса', '10 000 ₸'],
    ['Лечение', 'Лечение глубокого кариеса', '15 000 ₸'],
    ['Лечение', 'Лечение пульпита (1 канал)', '18 000 ₸'],
    ['Лечение', 'Лечение пульпита (2 канала)', '20 000 ₸'],
    ['Лечение', 'Лечение пульпита (3 канала)', '22 000 ₸'],
    ['Лечение', 'Лечение пульпита (4 канала)', '25 000 ₸'],
    ['Лечение', 'Наложение девитализирующей пасты', '1 000 ₸'],
    ['Удаление', 'Удаление', '6 000 ₸'],
    ['Удаление', 'Сложное удаление', '12 000 ₸'],
    ['Протезирование', 'Металлокерамика', '18 000 ₸'],
    ['Протезирование', 'Коронка с напылением', '11 000 ₸'],
    ['Протезирование', 'Фасетка', '13 000 ₸'],
    ['Протезирование', 'Циркониевая коронка', '75 000 ₸'],
    ['Протезирование', 'Съёмный протез', '32 000 ₸'],
    ['Протезирование', 'Микропротез', '18 000 ₸'],
    ['Протезирование', 'Импортный протез', '90 000 ₸'],
    ['Протезирование', 'Починка', '9 000 ₸'],
    ['Протезирование', 'Фиксация коронки', '1 000 ₸'],
    ['Протезирование', 'Снятие коронки', '1 000 ₸'],
    ['Гигиена', 'Ультразвуковая чистка', '500 ₸']
  ];

  function norm(s) { return s.toLowerCase().replace(/ё/g, 'е').trim(); }

  var chips = document.getElementById('chips'),
      list = document.getElementById('plist'),
      q = document.getElementById('q'),
      cat = 'Все';

  ['Все'].concat(CATS).forEach(function (c) {
    var b = document.createElement('button');
    b.type = 'button';
    b.className = 'chip';
    b.textContent = c;
    b.setAttribute('aria-pressed', c === cat ? 'true' : 'false');
    b.addEventListener('click', function () {
      cat = c;
      [].forEach.call(chips.children, function (x) {
        x.setAttribute('aria-pressed', x === b ? 'true' : 'false');
      });
      render();
    });
    chips.appendChild(b);
  });

  function render() {
    var term = norm(q.value), html = '', shown = 0;
    CATS.forEach(function (c) {
      if (cat !== 'Все' && cat !== c) return;
      var rows = PRICES.filter(function (p) {
        return p[0] === c && norm(p[1]).indexOf(term) !== -1;
      });
      if (!rows.length) return;
      shown += rows.length;
      html += '<div class="pg"><h3>' + c + '</h3>' + rows.map(function (p) {
        return '<div class="pr' + (p[2] === 'бесплатно' ? ' fr' : '') + '"><span>' + p[1] + '</span><b>' + p[2] + '</b></div>';
      }).join('') + '</div>';
    });
    list.innerHTML = shown ? html :
      '<p class="empty">Ничего не найдено. Попробуйте другое слово или <a href="' + WA + '" target="_blank" rel="noopener">спросите нас в WhatsApp</a>.</p>';
  }
  q.addEventListener('input', render);
  render();

  /* Шапка и мобильное меню */
  var hd = document.getElementById('hd'),
      burger = document.getElementById('burger');
  function onScroll() { hd.classList.toggle('s', window.scrollY > 24); }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  function setMenu(open) {
    hd.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    burger.setAttribute('aria-label', open ? 'Закрыть меню' : 'Открыть меню');
  }
  burger.addEventListener('click', function () { setMenu(!hd.classList.contains('open')); });
  document.getElementById('nav').addEventListener('click', function (e) {
    if (e.target.tagName === 'A') setMenu(false);
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });
  /* Карусель отзывов */
  var track = document.getElementById('track'),
      prev = document.getElementById('prev'),
      next = document.getElementById('next'),
      cnt = document.getElementById('cnt'),
      cards = track.children;
  function step() { return cards[0].offsetWidth + 22; }
  function sync() {
    var i = Math.round(track.scrollLeft / step());
    cnt.textContent = (Math.min(i, cards.length - 1) + 1) + ' / ' + cards.length;
    prev.disabled = track.scrollLeft < 4;
    next.disabled = track.scrollLeft + track.clientWidth >= track.scrollWidth - 4;
  }
  prev.addEventListener('click', function () { track.scrollBy({ left: -step(), behavior: 'smooth' }); });
  next.addEventListener('click', function () { track.scrollBy({ left: step(), behavior: 'smooth' }); });
  track.addEventListener('scroll', sync, { passive: true });
  track.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowRight') next.click();
    if (e.key === 'ArrowLeft') prev.click();
  });
  window.addEventListener('resize', sync);
  sync();

  /* Запись через WhatsApp */
  document.getElementById('form').addEventListener('submit', function (e) {
    e.preventDefault();
    var name = document.getElementById('nm').value.trim(),
        svc = document.getElementById('sv').value,
        msg = 'Здравствуйте! ' + (name ? 'Меня зовут ' + name + '. ' : '') + 'Хочу записаться: ' + svc.toLowerCase() + '.';
    window.open(WA + '?text=' + encodeURIComponent(msg), '_blank', 'noopener');
  });

  /* Сегодняшний день в графике и год в подвале */
  var today = document.querySelector('#hrs li[data-d="' + new Date().getDay() + '"]');
  if (today) today.className = 't';
  document.getElementById('yr').textContent = new Date().getFullYear();

  /* Плавное появление блоков */
  var items = document.querySelectorAll('.rv');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    items.forEach(function (el, i) {
      el.style.transitionDelay = (i % 3) * 90 + 'ms';
      io.observe(el);
    });
  } else {
    items.forEach(function (el) { el.classList.add('in'); });
  }
})();
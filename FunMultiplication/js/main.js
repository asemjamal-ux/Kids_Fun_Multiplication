/* Shared helpers: nav, mascot art, confetti, storage, sounds. */
(function () {
  'use strict';

  window.MM = window.MM || {};

  /* ---------- Storage (safe wrappers) ---------- */
  MM.load = function (key, fallback) {
    try { const v = localStorage.getItem('mm_' + key); return v === null ? fallback : JSON.parse(v); }
    catch (e) { return fallback; }
  };
  MM.save = function (key, value) {
    try { localStorage.setItem('mm_' + key, JSON.stringify(value)); } catch (e) { /* private mode etc. */ }
  };
  /* Record one answered fact so the parents page can show mastery per table.
     Every correct answer also earns a star (see the prize system below). */
  MM.recordFact = function (a, b, correct) {
    const stats = MM.load('facts', {});
    const k = a + 'x' + b;
    const s = stats[k] || { r: 0, w: 0 };
    if (correct) s.r++; else s.w++;
    stats[k] = s;
    MM.save('facts', stats);
    if (correct) MM.addStar();
  };

  /* ---------- Player name ---------- */
  MM.name = String(MM.load('name', '') || '').slice(0, 24);
  MM.setName = function (n) {
    MM.name = String(n || '').trim().slice(0, 24);
    MM.save('name', MM.name);
    document.querySelectorAll('[data-player-name]').forEach(el => { el.textContent = MM.name; });
  };

  /* ---------- Stars & prizes ----------
     1 correct answer = 1 star. Every STARS_PER_PRIZE stars unlocks the next sticker. */
  MM.STARS_PER_PRIZE = 10;
  MM.STICKERS = ['🦄', '🚀', '🐉', '🍦', '🦖', '🌈', '🏆', '🦋', '🐬', '🎸', '🧁', '🐼', '🛸', '👑', '🦊', '🎠', '🐢', '🍕', '🦁', '🎆', '🐙', '🍭', '🦕', '💎'];
  MM.stars = MM.load('stars', 0);
  MM.prizes = MM.load('prizes', []);
  MM.stickerName = (i) => MM.t('sticker.' + (i % MM.STICKERS.length));
  MM.starsToNext = () => MM.STARS_PER_PRIZE - (MM.stars % MM.STARS_PER_PRIZE);
  MM.paintStars = function () {
    document.querySelectorAll('[data-stars]').forEach(el => { el.textContent = '⭐ ' + MM.stars; });
    document.querySelectorAll('[data-prize-count]').forEach(el => { el.textContent = MM.prizes.length; });
    document.querySelectorAll('[data-stars-next]').forEach(el => { el.textContent = MM.t('name.next', { n: MM.starsToNext() }); });
    if (typeof MM.paintPrizeBox === 'function') MM.paintPrizeBox();
  };
  MM.addStar = function () {
    MM.stars++; MM.save('stars', MM.stars);
    if (MM.stars % MM.STARS_PER_PRIZE === 0) {
      const idx = MM.prizes.length;
      MM.prizes.push(idx); MM.save('prizes', MM.prizes);
      MM.showPrize(idx);
    }
    MM.paintStars();
  };
  MM.showPrize = function (idx) {
    const emoji = MM.STICKERS[idx % MM.STICKERS.length];
    const back = document.createElement('div');
    back.className = 'prize-back';
    back.innerHTML = `
      <div class="prize-card">
        <div class="prize-rays"></div>
        <div class="prize-emoji">${emoji}</div>
        <h2>${MM.name ? MM.t('prize.title', { name: MM.name }) : MM.t('prize.titleAnon')}</h2>
        <p>${MM.t('prize.body', { sticker: '<b>' + MM.stickerName(idx) + '</b>' })}</p>
        <button class="btn btn-coral btn-lg">${MM.t('prize.btn')}</button>
      </div>`;
    back.querySelector('button').addEventListener('click', () => back.remove());
    document.body.appendChild(back);
    MM.confetti(140);
    setTimeout(() => MM.sound.win(), 50);
  };
  /* Renders every [data-prize-box] as a sticker grid: earned ones bright, the rest locked. */
  MM.paintPrizeBox = function () {
    document.querySelectorAll('[data-prize-box]').forEach(box => {
      box.innerHTML = '';
      MM.STICKERS.forEach((emoji, i) => {
        const earned = i < MM.prizes.length;
        const d = document.createElement('div');
        d.className = 'prize-slot' + (earned ? ' earned' : '');
        const need = (i + 1) * MM.STARS_PER_PRIZE - MM.stars;
        d.title = earned ? MM.stickerName(i) : MM.t('prize.locked', { n: Math.max(0, need) });
        d.innerHTML = `<span class="prize-slot-emoji">${earned ? emoji : '🔒'}</span><small>${earned ? MM.stickerName(i) : (i + 1) * MM.STARS_PER_PRIZE + ' ⭐'}</small>`;
        box.appendChild(d);
      });
    });
  };

  /* ---------- Random helpers ---------- */
  MM.rand = (n) => Math.floor(Math.random() * n);
  MM.pick = (arr) => arr[MM.rand(arr.length)];
  MM.shuffle = function (arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) { const j = MM.rand(i + 1); [a[i], a[j]] = [a[j], a[i]]; }
    return a;
  };
  /* Build 3 plausible wrong answers around the right one. */
  MM.distractors = function (a, b) {
    const right = a * b;
    const set = new Set();
    const cands = [a * (b + 1), a * (b - 1), (a + 1) * b, (a - 1) * b, right + a, right - a, right + 1, right - 1, right + 10, right - 10, a + b];
    MM.shuffle(cands).forEach(v => { if (set.size < 3 && v > 0 && v !== right && v <= 120) set.add(v); });
    while (set.size < 3) { const v = right + MM.rand(9) - 4; if (v > 0 && v !== right) set.add(v); }
    return MM.shuffle([right, ...set]);
  };

  /* ---------- Confetti ---------- */
  MM.confetti = function (count) {
    const colors = ['#FFD23F', '#FF6B6B', '#4ECDC4', '#9B6BFF', '#8FD96C', '#FF7EB6', '#FF9F1C'];
    for (let i = 0; i < (count || 60); i++) {
      const p = document.createElement('div');
      p.className = 'confetti-piece';
      p.style.left = Math.random() * 100 + 'vw';
      p.style.background = MM.pick(colors);
      p.style.animationDelay = Math.random() * .6 + 's';
      p.style.animationDuration = (2.2 + Math.random() * 1.4) + 's';
      document.body.appendChild(p);
      setTimeout(() => p.remove(), 4200);
    }
  };

  /* ---------- Tiny synth sounds (no files needed) ---------- */
  let ctx = null;
  function tone(freq, dur, type, when) {
    try {
      ctx = ctx || new (window.AudioContext || window.webkitAudioContext)();
      const o = ctx.createOscillator(), g = ctx.createGain();
      o.type = type || 'sine'; o.frequency.value = freq;
      g.gain.setValueAtTime(.0001, ctx.currentTime + when);
      g.gain.exponentialRampToValueAtTime(.18, ctx.currentTime + when + .01);
      g.gain.exponentialRampToValueAtTime(.0001, ctx.currentTime + when + dur);
      o.connect(g); g.connect(ctx.destination);
      o.start(ctx.currentTime + when); o.stop(ctx.currentTime + when + dur + .05);
    } catch (e) { /* audio blocked; fine */ }
  }
  MM.sound = {
    enabled: MM.load('sound', true),
    good() { if (!this.enabled) return; tone(660, .12, 'triangle', 0); tone(880, .18, 'triangle', .1); },
    bad() { if (!this.enabled) return; tone(220, .25, 'sawtooth', 0); },
    win() { if (!this.enabled) return; [523, 659, 784, 1046].forEach((f, i) => tone(f, .25, 'triangle', i * .12)); },
    tick() { if (!this.enabled) return; tone(1200, .04, 'square', 0); }
  };

  /* ---------- Mascot ("Multi") ---------- */
  MM.mascotSVG = function (extraClass) {
    return `
<svg class="mascot ${extraClass || ''}" viewBox="0 0 220 220" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Multi, the friendly multiplication monster">
  <defs>
    <linearGradient id="mBody" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#B08CFF"/><stop offset="1" stop-color="#7E4FE8"/>
    </linearGradient>
  </defs>
  <!-- antenna -->
  <path d="M110 46 C 112 30, 118 22, 128 16" fill="none" stroke="#2B2140" stroke-width="6" stroke-linecap="round"/>
  <circle cx="130" cy="14" r="9" fill="#FFD23F" stroke="#2B2140" stroke-width="5"/>
  <!-- body -->
  <path d="M110 40 C 165 40, 192 80, 190 125 C 188 175, 155 200, 110 200 C 65 200, 32 175, 30 125 C 28 80, 55 40, 110 40 Z" fill="url(#mBody)" stroke="#2B2140" stroke-width="6"/>
  <!-- tummy patch -->
  <ellipse cx="110" cy="150" rx="42" ry="30" fill="#FFF3C4" stroke="#2B2140" stroke-width="4"/>
  <text x="110" y="162" text-anchor="middle" font-family="Fredoka, Comic Sans MS, sans-serif" font-weight="700" font-size="34" fill="#2B2140">×</text>
  <!-- eyes -->
  <ellipse cx="86" cy="96" rx="18" ry="20" fill="#fff" stroke="#2B2140" stroke-width="5"/>
  <ellipse cx="134" cy="96" rx="18" ry="20" fill="#fff" stroke="#2B2140" stroke-width="5"/>
  <circle class="pupil" cx="90" cy="100" r="8" fill="#2B2140"/>
  <circle class="pupil" cx="138" cy="100" r="8" fill="#2B2140"/>
  <circle cx="93" cy="96" r="3" fill="#fff"/><circle cx="141" cy="96" r="3" fill="#fff"/>
  <!-- cheeks -->
  <circle cx="64" cy="120" r="8" fill="#FF7EB6" opacity=".85"/><circle cx="156" cy="120" r="8" fill="#FF7EB6" opacity=".85"/>
  <!-- smile -->
  <path d="M90 124 Q 110 142, 130 124" fill="none" stroke="#2B2140" stroke-width="6" stroke-linecap="round"/>
  <!-- little arms -->
  <path d="M34 130 C 18 122, 14 108, 24 100" fill="none" stroke="#2B2140" stroke-width="6" stroke-linecap="round"/>
  <path d="M186 130 C 202 122, 206 108, 196 100" fill="none" stroke="#2B2140" stroke-width="6" stroke-linecap="round"/>
  <!-- feet -->
  <ellipse cx="84" cy="200" rx="18" ry="9" fill="#2B2140"/><ellipse cx="136" cy="200" rx="18" ry="9" fill="#2B2140"/>
</svg>`;
  };

  /* ---------- Nav ---------- */
  document.addEventListener('DOMContentLoaded', function () {
    const toggle = document.querySelector('.nav-toggle');
    const links = document.querySelector('.nav-links');
    if (toggle && links) {
      toggle.addEventListener('click', () => {
        const open = links.classList.toggle('open');
        toggle.setAttribute('aria-expanded', String(open));
      });
    }
    // Highlight current page
    const here = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
    document.querySelectorAll('.nav-links a').forEach(a => {
      const target = (a.getAttribute('href') || '').split('#')[0].toLowerCase();
      if (target === here) a.classList.add('active');
    });
    // Inject mascots wherever requested
    document.querySelectorAll('[data-mascot]').forEach(el => { el.innerHTML = MM.mascotSVG(el.dataset.mascot); });
    // Eyes follow the mouse a little
    document.addEventListener('mousemove', (e) => {
      document.querySelectorAll('.mascot').forEach(svg => {
        const r = svg.getBoundingClientRect();
        const dx = Math.max(-1, Math.min(1, (e.clientX - (r.left + r.width / 2)) / 300));
        const dy = Math.max(-1, Math.min(1, (e.clientY - (r.top + r.height / 2)) / 300));
        svg.querySelectorAll('.pupil').forEach(p => { p.setAttribute('transform', `translate(${dx * 5} ${dy * 4})`); });
      });
    });
    // Star counter chip in the nav (inserted before the language toggle)
    const langBtn = document.querySelector('.lang-toggle');
    if (langBtn) {
      const chip = document.createElement('a');
      chip.className = 'star-chip'; chip.href = 'games.html#prizes'; chip.setAttribute('data-stars', '');
      chip.title = MM.t('prize.box');
      langBtn.parentNode.insertBefore(chip, langBtn);
    }
    // Name greeting / form
    document.querySelectorAll('[data-player-name]').forEach(el => { el.textContent = MM.name; });
    document.querySelectorAll('[data-name-form]').forEach(form => {
      const input = form.querySelector('input');
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        if (!input.value.trim()) return;
        MM.setName(input.value);
        MM.sound.good();
        document.dispatchEvent(new CustomEvent('mm:name'));
      });
    });
    document.querySelectorAll('[data-name-change]').forEach(btn => btn.addEventListener('click', () => {
      MM.setName('');
      document.dispatchEvent(new CustomEvent('mm:name'));
    }));
    MM.paintStars();
    // Sound toggle buttons
    document.querySelectorAll('[data-sound-toggle]').forEach(btn => {
      const paint = () => btn.textContent = MM.sound.enabled ? MM.t('sound.on') : MM.t('sound.off');
      paint();
      btn.addEventListener('click', () => { MM.sound.enabled = !MM.sound.enabled; MM.save('sound', MM.sound.enabled); paint(); });
    });
  });
})();

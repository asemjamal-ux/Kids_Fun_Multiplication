/* Shared helpers: nav, mascot art, confetti, storage, sounds. */
(function () {
  'use strict';

  window.MM = window.MM || {};
  MM.SISTER_URL = 'https://fundivision.netlify.app/';

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
    if (correct) { MM.addStar(); MM.checkBadges(); }
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
  MM.STICKERS = ['🦄', '🚀', '🐉', '🍦', '🦖', '🌈', '🏆', '🦋', '🐬', '🎸', '🧁', '🐼', '🛸', '👑', '🦊', '🎠', '🐢', '🍕', '🦁', '🎆', '🐙', '🍭', '🦕', '💎',
    '🐳', '🌋', '🦩', '🎪', '🍉', '🐨', '🚁', '🧜', '🦚', '🍓', '🌙', '🦈'];
  MM.stars = MM.load('stars', 0);
  MM.prizes = MM.load('prizes', []);
  MM.stickerName = (i) => MM.t('sticker.' + (i % MM.STICKERS.length));
  MM.starsToNext = () => MM.STARS_PER_PRIZE - (MM.stars % MM.STARS_PER_PRIZE);
  MM.paintStars = function () {
    document.querySelectorAll('[data-stars]').forEach(el => { el.textContent = '⭐ ' + MM.stars; });
    document.querySelectorAll('[data-prize-count]').forEach(el => { el.textContent = MM.prizes.length + MM.badges.length; });
    document.querySelectorAll('[data-stars-next]').forEach(el => { el.textContent = MM.t('name.next', { n: MM.starsToNext() }); });
    if (typeof MM.paintPrizeBox === 'function') MM.paintPrizeBox();
    if (typeof MM.paintBadgeBox === 'function') MM.paintBadgeBox();
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
  /* showPrize(stickerIndex) or showPrize({ kind: 'badge', emoji, name }) */
  MM.showPrize = function (what) {
    const badge = typeof what === 'object';
    const emoji = badge ? what.emoji : MM.STICKERS[what % MM.STICKERS.length];
    const name = badge ? what.name : MM.stickerName(what);
    const title = badge
      ? (MM.name ? MM.t('badge.title', { name: MM.name }) : MM.t('badge.titleAnon'))
      : (MM.name ? MM.t('prize.title', { name: MM.name }) : MM.t('prize.titleAnon'));
    const body = badge ? MM.t('badge.body', { badge: '<b>' + name + '</b>' }) : MM.t('prize.body', { sticker: '<b>' + name + '</b>' });
    const back = document.createElement('div');
    back.className = 'prize-back';
    back.innerHTML = `
      <div class="prize-card ${badge ? 'badge' : ''}">
        <div class="prize-rays"></div>
        <div class="prize-emoji">${emoji}</div>
        <h2>${title}</h2>
        <p>${body}</p>
        <button class="btn btn-coral btn-lg">${MM.t('prize.btn')}</button>
      </div>`;
    // Show one celebration at a time: queue if another popup is open
    if (document.querySelector('.prize-back')) { MM.prizeQueue.push(back); return; }
    MM.openPrize(back);
  };
  MM.prizeQueue = [];
  MM.openPrize = function (back) {
    back.querySelector('button').addEventListener('click', () => {
      back.remove();
      const next = MM.prizeQueue.shift();
      if (next) setTimeout(() => MM.openPrize(next), 250);
    });
    document.body.appendChild(back);
    MM.confetti(140);
    setTimeout(() => MM.sound.win(), 50);
  };
  /* ---------- Trophies (achievement prizes) ----------
     Unlocked by doing something, not by star count. The `hard` ones need real mastery of the
     6–9 tables: at least MASTERY_TRIES answers on that table with MASTERY_ACC accuracy. */
  MM.MASTERY_TRIES = 15; MM.MASTERY_ACC = .9;
  MM.tableStats = function () {
    const facts = MM.load('facts', {});
    const per = {}; for (let n = 1; n <= 10; n++) per[n] = { r: 0, w: 0 };
    Object.entries(facts).forEach(([k, s]) => {
      const [a, b] = k.split('x').map(Number);
      if (per[a]) { per[a].r += s.r; per[a].w += s.w; }
      if (per[b] && a !== b) { per[b].r += s.r; per[b].w += s.w; }
    });
    const acc = (n) => { const t = per[n], tot = t.r + t.w; return tot ? t.r / tot : 0; };
    const tries = (n) => per[n].r + per[n].w;
    return { per, acc, tries, mastered: (n) => tries(n) >= MM.MASTERY_TRIES && acc(n) >= MM.MASTERY_ACC };
  };
  const tableProgress = (n) => (s) => `${Math.round(s.acc(n) * 100)}% · ${Math.min(s.tries(n), MM.MASTERY_TRIES)}/${MM.MASTERY_TRIES}`;
  const ALL = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  MM.BADGES = [
    { id: 'bingo',     emoji: '🎯', check: (s, e) => e.bingoWin },
    { id: 'memory',    emoji: '🧠', check: (s, e) => e.memoryMoves > 0 && e.memoryMoves <= 12 },
    { id: 'racer',     emoji: '🚀', check: (s, e) => e.raceScore >= 20 },
    { id: 'popstar',   emoji: '🎈', check: (s, e) => e.balloonScore >= 15 },
    { id: 'eyes',      emoji: '🔍', check: (s, e) => e.huntRounds >= 5 },
    { id: 'century',   emoji: '💯', check: () => MM.stars >= 100, progress: () => `${Math.min(MM.stars, 100)}/100 ⭐` },
    { id: 'little',    emoji: '🌟', check: (s) => [1, 2, 3, 4, 5].every(s.mastered), progress: (s) => `${[1, 2, 3, 4, 5].filter(s.mastered).length}/5` },
    { id: 't6',        emoji: '🐝', hard: true, check: (s) => s.mastered(6), progress: tableProgress(6) },
    { id: 't7',        emoji: '🌈', hard: true, check: (s) => s.mastered(7), progress: tableProgress(7) },
    { id: 't8',        emoji: '🐙', hard: true, check: (s) => s.mastered(8), progress: tableProgress(8) },
    { id: 't9',        emoji: '🥷', hard: true, check: (s) => s.mastered(9), progress: tableProgress(9) },
    { id: 'hardracer', emoji: '🔥', hard: true, check: (s, e) => e.raceScore >= 15 && Array.isArray(e.raceTables) && e.raceTables.length > 0 && e.raceTables.every(n => n >= 6 && n <= 9) },
    { id: 'hardpop',   emoji: '🌶️', hard: true, check: (s, e) => e.balloonScore >= 10 && Array.isArray(e.balloonTables) && e.balloonTables.length > 0 && e.balloonTables.every(n => n >= 6 && n <= 9) },
    { id: 'hero',      emoji: '🦸', hard: true, check: (s) => [6, 7, 8, 9].every(s.mastered), progress: (s) => `${[6, 7, 8, 9].filter(s.mastered).length}/4` },
    { id: 'royalty',   emoji: '👑', hard: true, check: (s) => ALL.every(s.mastered), progress: (s) => `${ALL.filter(s.mastered).length}/10` },
    { id: 'genius',    emoji: '🎓', check: () => MM.stars >= 500, progress: () => `${Math.min(MM.stars, 500)}/500 ⭐` }
  ];
  MM.badges = MM.load('badges', []);
  MM.badgeName = (b) => MM.t('badge.' + b.id);
  /* Call with an event describing what just happened, e.g. { raceScore: 22, raceTables: [6,7,8,9] }.
     Table-mastery trophies need no event; recordFact() calls this with none. */
  MM.checkBadges = function (e) {
    e = e || {};
    const s = MM.tableStats();
    const newly = [];
    MM.BADGES.forEach(b => {
      if (MM.badges.includes(b.id)) return;
      let ok = false; try { ok = !!b.check(s, e); } catch (err) { ok = false; }
      if (ok) { MM.badges.push(b.id); newly.push(b); }
    });
    if (!newly.length) return;
    MM.save('badges', MM.badges);
    newly.forEach((b, i) => setTimeout(() => MM.showPrize({ kind: 'badge', emoji: b.emoji, name: MM.badgeName(b) }), 600 + i * 500));
    MM.paintStars();
  };
  /* Renders every [data-badge-box]: earned trophies bright; locked ones show what to do and progress. */
  MM.paintBadgeBox = function () {
    const boxes = document.querySelectorAll('[data-badge-box]');
    if (!boxes.length) return;
    const s = MM.tableStats();
    boxes.forEach(box => {
      box.innerHTML = '';
      MM.BADGES.forEach(b => {
        const earned = MM.badges.includes(b.id);
        const d = document.createElement('div');
        d.className = 'badge-slot' + (earned ? ' earned' : ' locked') + (b.hard ? ' hard' : '');
        let prog = ''; if (!earned && b.progress) { try { prog = b.progress(s); } catch (err) { prog = ''; } }
        d.innerHTML = `
          ${b.hard ? `<span class="badge-hard">${MM.t('prizes.hard')}</span>` : ''}
          <span class="badge-emoji">${earned ? b.emoji : '🔒'}</span>
          <b>${MM.badgeName(b)}</b>
          <small>${MM.t('badge.' + b.id + '.how')}</small>
          ${prog ? `<span class="badge-progress math">${prog}</span>` : ''}`;
        box.appendChild(d);
      });
    });
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
    // Links to the sister site keep the chosen language
    document.querySelectorAll('[data-sister]').forEach(a => { a.href = MM.SISTER_URL + (MM.rtl ? '?lang=ar' : ''); });
    // Sound toggle buttons
    document.querySelectorAll('[data-sound-toggle]').forEach(btn => {
      const paint = () => btn.textContent = MM.sound.enabled ? MM.t('sound.on') : MM.t('sound.off');
      paint();
      btn.addEventListener('click', () => { MM.sound.enabled = !MM.sound.enabled; MM.save('sound', MM.sound.enabled); paint(); });
    });
  });
})();

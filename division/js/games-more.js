/* More games: Memory Match, Balloon Pop, Number Hunt — plus the "Who's playing?" card. */
(function () {
  'use strict';
  const $ = (id) => document.getElementById(id);
  const openModal = MM.openModal;

  /* =========================================================
     WHO'S PLAYING (name card + personalised heading)
     ========================================================= */
  function paintWho() {
    const has = !!MM.name;
    $('who-ask').hidden = has; $('who-hi').hidden = !has;
    if (has) {
      $('who-hi-title').textContent = MM.t('name.hi', { name: MM.name });
      $('games-title').textContent = MM.t('games.h1.named', { name: MM.name });
    } else {
      $('games-title').textContent = MM.rtl ? MM.t('games.h1') : 'Pick a game 🎮';
      setTimeout(() => $('who-name').focus(), 300);
    }
    MM.paintStars();
  }
  document.addEventListener('mm:name', paintWho);
  document.addEventListener('DOMContentLoaded', paintWho);

  /* Helper: chips for choosing which numbers to divide by */
  function tableChips(container, set) {
    for (let n = 1; n <= 10; n++) {
      const c = document.createElement('button');
      c.className = 'chip'; c.textContent = '÷' + n; c.dataset.n = n;
      c.setAttribute('aria-pressed', String(set.has(n)));
      c.addEventListener('click', () => { if (set.has(n)) set.delete(n); else set.add(n); c.setAttribute('aria-pressed', String(set.has(n))); });
      container.appendChild(c);
    }
  }
  function levelRange(level) { return level === 'easy' ? [1,2,3,4,5] : level === 'hard' ? [6,7,8,9,10] : [1,2,3,4,5,6,7,8,9,10]; }
  function levelPicker(containerId, onPick) {
    const box = $(containerId);
    box.querySelectorAll('.chip').forEach(c => c.addEventListener('click', () => {
      box.querySelectorAll('.chip').forEach(x => x.setAttribute('aria-pressed', 'false'));
      c.setAttribute('aria-pressed', 'true'); onPick(c.dataset.level);
    }));
  }

  /* =========================================================
     MEMORY MATCH — 8 division cards + 8 answer cards
     ========================================================= */
  const memory = { level: 'easy', open: [], moves: 0, pairs: 0, locked: false, total: 8 };
  levelPicker('memory-level', (l) => memory.level = l);
  function paintMemoryBest() {
    const b = MM.load('memory_best', 0);
    $('memory-best-label').textContent = b ? MM.t('memory.best', { b }) : '';
  }
  paintMemoryBest();
  function memoryStart() {
    // 8 different answers, so every answer card matches exactly one division
    const range = levelRange(memory.level);
    const answers = MM.shuffle([1,2,3,4,5,6,7,8,9,10]).slice(0, memory.total);
    const cards = [];
    answers.forEach((q, i) => {
      const n = MM.pick(range);
      cards.push({ id: i, face: `${n * q} ÷ ${n}`, kind: 'q', n, q });
      cards.push({ id: i, face: String(q), kind: 'a', n, q });
    });
    memory.open = []; memory.moves = 0; memory.pairs = 0; memory.locked = false;
    $('memory-moves').textContent = 0; $('memory-pairs').textContent = `0 / ${memory.total}`;
    const grid = $('memory-grid'); grid.innerHTML = '';
    MM.shuffle(cards).forEach(card => {
      const el = document.createElement('button');
      el.className = 'mcard'; el.dataset.id = card.id; el.dataset.kind = card.kind;
      el.innerHTML = `<div class="mcard-inner"><div class="mcard-front">?</div><div class="mcard-back ${card.kind}">${card.face}</div></div>`;
      el.addEventListener('click', () => memoryFlip(el, card));
      grid.appendChild(el);
    });
    $('memory-setup').hidden = true; $('memory-play').hidden = false;
  }
  function memoryFlip(el, card) {
    if (memory.locked || el.classList.contains('flipped') || el.classList.contains('matched')) return;
    el.classList.add('flipped'); MM.sound.tick();
    memory.open.push({ el, card });
    if (memory.open.length < 2) return;
    memory.moves++; $('memory-moves').textContent = memory.moves;
    const [x, y] = memory.open;
    const match = x.card.id === y.card.id && x.card.kind !== y.card.kind;
    memory.locked = true;
    if (match) {
      MM.recordFact(x.card.n, x.card.q, true);
      setTimeout(() => {
        x.el.classList.add('matched'); y.el.classList.add('matched'); MM.sound.good();
        memory.pairs++; $('memory-pairs').textContent = `${memory.pairs} / ${memory.total}`;
        memory.open = []; memory.locked = false;
        if (memory.pairs === memory.total) memoryWin();
      }, 350);
    } else {
      // A division paired with the wrong answer counts against that division
      if (x.card.kind !== y.card.kind) { const d = x.card.kind === 'q' ? x.card : y.card; MM.recordFact(d.n, d.q, false); }
      setTimeout(() => {
        x.el.classList.remove('flipped'); y.el.classList.remove('flipped'); MM.sound.bad();
        memory.open = []; memory.locked = false;
      }, 900);
    }
  }
  function memoryWin() {
    const best = MM.load('memory_best', 0), newBest = !best || memory.moves < best;
    if (newBest) MM.save('memory_best', memory.moves);
    paintMemoryBest();
    MM.sound.win(); MM.confetti(newBest ? 120 : 60);
    MM.checkBadges({ memoryMoves: memory.moves });
    setTimeout(() => {
      $('memory-setup').hidden = false; $('memory-play').hidden = true;
      openModal(newBest ? '🏆' : '🃏', MM.t('memory.win.title'),
        MM.t('memory.win.body', { p: memory.total, m: memory.moves, tail: newBest ? MM.t('memory.beat') : MM.t('memory.best', { b: best }) }), memoryStart);
    }, 700);
  }
  $('memory-start').addEventListener('click', memoryStart);
  $('memory-quit').addEventListener('click', () => { $('memory-setup').hidden = false; $('memory-play').hidden = true; });

  /* =========================================================
     BALLOON POP — tap the balloon carrying the right answer
     ========================================================= */
  const balloon = { tables: new Set([2, 3, 4, 5]), score: 0, lives: 3, f: null, locked: false, running: false };
  tableChips($('balloon-tables'), balloon.tables);
  $('balloon-best-label').textContent = MM.load('balloon_best', 0);
  const BALLOON_COLORS = ['#FF6B6B', '#FFD23F', '#4ECDC4', '#9B6BFF', '#8FD96C', '#FF7EB6', '#FF9F1C'];

  function balloonRound() {
    if (!balloon.running) return;
    balloon.locked = false;
    balloon.f = MM.divFact([...balloon.tables]);
    const { n, q, p } = balloon.f;
    $('balloon-q').textContent = `${p} ÷ ${n} = ?`;
    const arena = $('balloon-arena'); arena.innerHTML = '<div class="arena-clouds"><span>☁️</span><span>☁️</span><span>☁️</span></div>';
    // Faster as the score climbs: 7s down to ~3.5s
    const dur = Math.max(3.5, 7 - balloon.score * .12);
    const lanes = MM.shuffle([8, 30, 52, 74]);
    MM.divDistractors(n, q).forEach((v, i) => {
      const el = document.createElement('button');
      el.className = 'balloon'; el.textContent = v;
      el.style.left = lanes[i] + '%';
      el.style.background = MM.pick(BALLOON_COLORS);
      el.style.animationDuration = dur + 's';
      el.style.animationDelay = (Math.random() * .8) + 's';
      const correct = v === q;
      el.addEventListener('click', () => balloonTap(el, correct));
      if (correct) el.addEventListener('animationend', (e) => { if (e.animationName === 'float-up' && !balloon.locked && balloon.running) balloonMiss(el); });
      arena.appendChild(el);
    });
  }
  function balloonTap(el, correct) {
    if (balloon.locked || !balloon.running) return;
    const { n, q } = balloon.f;
    if (correct) {
      balloon.locked = true;
      MM.recordFact(n, q, true);
      el.style.animationDelay = '0s'; el.classList.add('pop'); MM.sound.good();
      balloon.score++; $('balloon-score').textContent = balloon.score;
      if (balloon.score % 5 === 0) MM.confetti(25);
      setTimeout(balloonRound, 500);
    } else {
      MM.recordFact(n, q, false);
      el.classList.add('wobble'); MM.sound.bad();
      setTimeout(() => el.classList.remove('wobble'), 500);
      balloonLoseLife();
    }
  }
  function balloonMiss(el) {
    balloon.locked = true;
    MM.recordFact(balloon.f.n, balloon.f.q, false);
    el.classList.add('escaped'); MM.sound.bad();
    balloonLoseLife();
    if (balloon.running) setTimeout(balloonRound, 600);
  }
  function balloonLoseLife() {
    balloon.lives--;
    $('balloon-hearts').textContent = '❤️'.repeat(Math.max(0, balloon.lives)) + '🖤'.repeat(3 - Math.max(0, balloon.lives));
    if (balloon.lives <= 0) balloonEnd();
  }
  function balloonStart() {
    if (balloon.tables.size === 0) { [2, 3, 4, 5].forEach(n => balloon.tables.add(n)); $('balloon-tables').querySelectorAll('.chip').forEach(c => c.setAttribute('aria-pressed', String(balloon.tables.has(+c.dataset.n)))); }
    balloon.score = 0; balloon.lives = 3; balloon.running = true;
    $('balloon-score').textContent = 0; $('balloon-hearts').textContent = '❤️❤️❤️';
    $('balloon-setup').hidden = true; $('balloon-play').hidden = false;
    balloonRound();
  }
  function balloonEnd() {
    if (!balloon.running) return;
    balloon.running = false; balloon.locked = true;
    $('balloon-arena').innerHTML = '';
    $('balloon-setup').hidden = false; $('balloon-play').hidden = true;
    const best = MM.load('balloon_best', 0), newBest = balloon.score > best;
    if (newBest) { MM.save('balloon_best', balloon.score); $('balloon-best-label').textContent = balloon.score; }
    if (balloon.score > 0) { MM.sound.win(); MM.confetti(newBest ? 100 : 40); }
    MM.checkBadges({ balloonScore: balloon.score, balloonTables: [...balloon.tables] });
    openModal(newBest ? '🏆' : '🎈', MM.t(newBest ? 'generic.beat' : 'balloon.over'),
      MM.t('balloon.body', { s: balloon.score, word: MM.t(balloon.score === 1 ? 'balloon.one' : 'balloon.many'), tail: newBest ? '' : MM.t('generic.best', { b: Math.max(best, balloon.score) }) }), balloonStart);
  }
  $('balloon-start').addEventListener('click', balloonStart);
  $('balloon-quit').addEventListener('click', balloonEnd);

  /* =========================================================
     NUMBER HUNT — tap every division whose answer is the target
     ========================================================= */
  const hunt = { round: 0, found: 0, time: 20, timer: null, target: 0, remaining: 0, running: false };
  $('hunt-best-label').textContent = MM.load('hunt_best', 0);

  function huntRound() {
    hunt.round++; $('hunt-round').textContent = hunt.round;
    hunt.target = 2 + MM.rand(8); $('hunt-target').textContent = hunt.target;   // 2–9
    const divisors = MM.shuffle([2, 3, 4, 5, 6, 7, 8, 9, 10]).slice(0, 2 + MM.rand(3));  // 2–4 correct tiles
    const tiles = divisors.map(n => ({ n, q: hunt.target, ok: true }));
    const seen = new Set(tiles.map(t => t.n + '/' + t.q));
    while (tiles.length < 12) {
      const n = 2 + MM.rand(9), q = 2 + MM.rand(9);
      if (q !== hunt.target && !seen.has(n + '/' + q)) { seen.add(n + '/' + q); tiles.push({ n, q, ok: false }); }
    }
    hunt.remaining = tiles.filter(t => t.ok).length;
    const grid = $('hunt-grid'); grid.innerHTML = '';
    MM.shuffle(tiles).forEach(t => {
      const el = document.createElement('button');
      el.className = 'hunt-tile'; el.textContent = `${t.n * t.q} ÷ ${t.n}`;
      el.addEventListener('click', () => huntTap(el, t));
      grid.appendChild(el);
    });
  }
  function huntTap(el, t) {
    if (!hunt.running || el.classList.contains('hit') || el.classList.contains('miss')) return;
    MM.recordFact(t.n, t.q, t.ok);
    if (t.ok) {
      el.classList.add('hit'); MM.sound.good();
      hunt.found++; $('hunt-found').textContent = hunt.found;
      hunt.remaining--;
      if (hunt.remaining === 0) {
        hunt.time = Math.min(20, hunt.time + 5);           // bonus time for clearing a round
        MM.confetti(20);
        setTimeout(huntRound, 500);
      }
    } else {
      el.classList.add('miss'); MM.sound.bad();
      hunt.time = Math.max(0, hunt.time - 3);              // wrong tap costs 3 seconds
      setTimeout(() => el.classList.remove('miss'), 600);
      huntPaintTime();
      if (hunt.time <= 0) huntEnd();
    }
  }
  function huntPaintTime() {
    $('hunt-time').textContent = hunt.time;
    $('hunt-timer').style.width = (hunt.time / 20 * 100) + '%';
  }
  function huntTick() {
    hunt.time--; huntPaintTime();
    if (hunt.time <= 5 && hunt.time > 0) MM.sound.tick();
    if (hunt.time <= 0) huntEnd();
  }
  function huntStart() {
    hunt.round = 0; hunt.found = 0; hunt.time = 20; hunt.running = true;
    $('hunt-found').textContent = 0; huntPaintTime();
    $('hunt-setup').hidden = true; $('hunt-play').hidden = false;
    huntRound();
    clearInterval(hunt.timer); hunt.timer = setInterval(huntTick, 1000);
  }
  function huntEnd() {
    if (!hunt.running) return;
    hunt.running = false; clearInterval(hunt.timer);
    $('hunt-setup').hidden = false; $('hunt-play').hidden = true;
    const best = MM.load('hunt_best', 0), newBest = hunt.found > best;
    if (newBest) { MM.save('hunt_best', hunt.found); $('hunt-best-label').textContent = hunt.found; }
    if (hunt.found > 0) { MM.sound.win(); MM.confetti(newBest ? 100 : 40); }
    MM.checkBadges({ huntRounds: Math.max(0, hunt.round - 1) });
    openModal(newBest ? '🏆' : '🔍', MM.t(newBest ? 'generic.beat' : 'hunt.over'),
      MM.t('hunt.body', { r: Math.max(0, hunt.round - 1), f: hunt.found, tail: newBest ? '' : MM.t('generic.best', { b: Math.max(best, hunt.found) }) }), huntStart);
  }
  $('hunt-start').addEventListener('click', huntStart);
  $('hunt-quit').addEventListener('click', huntEnd);
})();

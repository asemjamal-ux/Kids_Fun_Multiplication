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

  /* Helper shared by the games below: chips for choosing tables */
  function tableChips(container, set) {
    for (let n = 1; n <= 10; n++) {
      const c = document.createElement('button');
      c.className = 'chip'; c.textContent = n; c.dataset.n = n;
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
     MEMORY MATCH — 8 question cards + 8 answer cards
     ========================================================= */
  const memory = { level: 'easy', open: [], moves: 0, pairs: 0, locked: false, total: 8 };
  levelPicker('memory-level', (l) => memory.level = l);
  function paintMemoryBest() {
    const b = MM.load('memory_best', 0);
    $('memory-best-label').textContent = b ? MM.t('memory.best', { b }) : '';
  }
  paintMemoryBest();
  function memoryStart() {
    // Pick 8 facts with distinct products so every answer card matches exactly one question
    const range = levelRange(memory.level);
    const facts = [];
    range.forEach(a => { for (let b = 1; b <= 10; b++) facts.push([a, b]); });
    const chosen = [], seen = new Set();
    for (const f of MM.shuffle(facts)) { const p = f[0] * f[1]; if (!seen.has(p)) { seen.add(p); chosen.push(f); } if (chosen.length === memory.total) break; }
    const cards = [];
    chosen.forEach(([a, b], i) => {
      cards.push({ id: i, face: `${a} × ${b}`, kind: 'q', a, b });
      cards.push({ id: i, face: String(a * b), kind: 'a', a, b });
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
      MM.recordFact(x.card.a, x.card.b, true);
      setTimeout(() => {
        x.el.classList.add('matched'); y.el.classList.add('matched'); MM.sound.good();
        memory.pairs++; $('memory-pairs').textContent = `${memory.pairs} / ${memory.total}`;
        memory.open = []; memory.locked = false;
        if (memory.pairs === memory.total) memoryWin();
      }, 350);
    } else {
      // Only count a wrong pairing against the fact when both cards belong to the same question type mix
      if (x.card.kind !== y.card.kind) MM.recordFact(x.card.a, x.card.b, false);
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
  const balloon = { tables: new Set([2, 3, 4, 5]), score: 0, lives: 3, a: 0, b: 0, locked: false, timer: null, running: false };
  tableChips($('balloon-tables'), balloon.tables);
  $('balloon-best-label').textContent = MM.load('balloon_best', 0);
  const BALLOON_COLORS = ['#FF6B6B', '#FFD23F', '#4ECDC4', '#9B6BFF', '#8FD96C', '#FF7EB6', '#FF9F1C'];

  function balloonRound() {
    if (!balloon.running) return;
    balloon.locked = false;
    const t = [...balloon.tables];
    balloon.a = MM.pick(t); balloon.b = 1 + MM.rand(10);
    if (Math.random() < .5) [balloon.a, balloon.b] = [balloon.b, balloon.a];
    $('balloon-q').textContent = `${balloon.a} × ${balloon.b} = ?`;
    const arena = $('balloon-arena'); arena.innerHTML = '<div class="arena-clouds"><span>☁️</span><span>☁️</span><span>☁️</span></div>';
    const answers = MM.distractors(balloon.a, balloon.b);
    // Faster as the score climbs: 7s down to ~3.5s
    const dur = Math.max(3.5, 7 - balloon.score * .12);
    const lanes = MM.shuffle([8, 30, 52, 74]);
    answers.forEach((v, i) => {
      const el = document.createElement('button');
      el.className = 'balloon'; el.textContent = v;
      el.style.left = lanes[i] + '%';
      el.style.background = MM.pick(BALLOON_COLORS);
      el.style.animationDuration = dur + 's';
      el.style.animationDelay = (Math.random() * .8) + 's';
      const correct = v === balloon.a * balloon.b;
      el.addEventListener('click', () => balloonTap(el, correct));
      if (correct) el.addEventListener('animationend', (e) => { if (e.animationName === 'float-up' && !balloon.locked && balloon.running) balloonMiss(el); });
      arena.appendChild(el);
    });
  }
  function balloonTap(el, correct) {
    if (balloon.locked || !balloon.running) return;
    if (correct) {
      balloon.locked = true;
      MM.recordFact(balloon.a, balloon.b, true);
      el.style.animationDelay = '0s'; el.classList.add('pop'); MM.sound.good();
      balloon.score++; $('balloon-score').textContent = balloon.score;
      if (balloon.score % 5 === 0) MM.confetti(25);
      setTimeout(balloonRound, 500);
    } else {
      MM.recordFact(balloon.a, balloon.b, false);
      el.classList.add('wobble'); MM.sound.bad();
      setTimeout(() => el.classList.remove('wobble'), 500);
      balloonLoseLife();
    }
  }
  function balloonMiss(el) {
    balloon.locked = true;
    MM.recordFact(balloon.a, balloon.b, false);
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
    if (balloon.tables.size === 0) { balloon.tables = new Set([2, 3, 4, 5]); $('balloon-tables').querySelectorAll('.chip').forEach(c => c.setAttribute('aria-pressed', String(balloon.tables.has(+c.dataset.n)))); }
    balloon.score = 0; balloon.lives = 3; balloon.running = true;
    $('balloon-score').textContent = 0; $('balloon-hearts').textContent = '❤️❤️❤️';
    $('balloon-setup').hidden = true; $('balloon-play').hidden = false;
    balloonRound();
  }
  function balloonEnd() {
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
     NUMBER HUNT — tap every tile equal to the target
     ========================================================= */
  const hunt = { round: 0, found: 0, time: 20, timer: null, target: 0, remaining: 0, running: false };
  const HUNT_TARGETS = [6, 8, 10, 12, 16, 18, 20, 24, 30, 36, 40, 12, 24, 18, 36];
  $('hunt-best-label').textContent = MM.load('hunt_best', 0);

  function huntRound() {
    hunt.round++; $('hunt-round').textContent = hunt.round;
    hunt.target = MM.pick(HUNT_TARGETS); $('hunt-target').textContent = hunt.target;
    // Every ordered pair (a, b) with a × b = target, 1..10
    const good = [];
    for (let a = 1; a <= 10; a++) for (let b = 1; b <= 10; b++) if (a * b === hunt.target && !(a === 1 || b === 1)) good.push([a, b]);
    const picked = MM.shuffle(good).slice(0, 2 + MM.rand(3));           // 2–4 correct tiles
    const tiles = picked.map(([a, b]) => ({ a, b, ok: true }));
    const seen = new Set(picked.map(p => p.join('x')));
    while (tiles.length < 12) {
      const a = 2 + MM.rand(9), b = 2 + MM.rand(9);
      if (a * b !== hunt.target && !seen.has(a + 'x' + b)) { seen.add(a + 'x' + b); tiles.push({ a, b, ok: false }); }
    }
    hunt.remaining = tiles.filter(t => t.ok).length;
    const grid = $('hunt-grid'); grid.innerHTML = '';
    MM.shuffle(tiles).forEach(t => {
      const el = document.createElement('button');
      el.className = 'hunt-tile'; el.textContent = `${t.a} × ${t.b}`;
      el.addEventListener('click', () => huntTap(el, t));
      grid.appendChild(el);
    });
  }
  function huntTap(el, t) {
    if (!hunt.running || el.classList.contains('hit') || el.classList.contains('miss')) return;
    MM.recordFact(t.a, t.b, t.ok);
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

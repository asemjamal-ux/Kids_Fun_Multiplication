/* Games: Fair Share, Division Race, Division Bingo, Division Puzzles */
(function () {
  'use strict';
  const $ = (id) => document.getElementById(id);
  const GAMES = ['share', 'race', 'bingo', 'puzzle', 'memory', 'balloon', 'hunt'];

  /* ---------- Tabs ---------- */
  const tabs = document.querySelectorAll('.game-tab');
  function showGame(name) {
    tabs.forEach(t => t.setAttribute('aria-selected', String(t.dataset.game === name)));
    document.querySelectorAll('.game-panel').forEach(p => p.classList.toggle('active', p.id === 'game-' + name));
    history.replaceState(null, '', location.search + '#' + name);
  }
  tabs.forEach(t => t.addEventListener('click', () => showGame(t.dataset.game)));
  const hash = location.hash.replace('#', '');
  if (GAMES.includes(hash)) showGame(hash);
  MM.showGame = showGame;

  /* ---------- Modal ---------- */
  const modal = $('modal');
  let modalAgain = null;
  function openModal(emoji, title, body, again) {
    $('modal-emoji').textContent = emoji; $('modal-title').textContent = title; $('modal-body').innerHTML = body;
    modalAgain = again; modal.classList.add('open');
  }
  MM.openModal = openModal;
  $('modal-close').addEventListener('click', () => modal.classList.remove('open'));
  $('modal-again').addEventListener('click', () => { modal.classList.remove('open'); if (modalAgain) modalAgain(); });

  /* Shared: answer buttons for "p ÷ n = ?" questions */
  function answerButtons(container, n, q, onPick) {
    container.innerHTML = '';
    MM.divDistractors(n, q).forEach(v => {
      const btn = document.createElement('button');
      btn.className = 'option'; btn.textContent = v;
      btn.addEventListener('click', () => onPick(btn, v));
      container.appendChild(btn);
    });
  }
  function markCorrect(container, answer) {
    [...container.children].forEach(o => { if (o.textContent === String(answer)) o.classList.add('correct'); });
  }

  /* =========================================================
     FAIR SHARE — deal treats out to friends, see the equal groups
     ========================================================= */
  const SHARE_ITEMS = ['🍪', '🍓', '🍬', '🧁', '🍩', '🍎'];
  const FRIENDS = ['🐻', '🐰', '🐸', '🐱', '🐶', '🐼'];
  const share = { round: 0, score: 0, locked: false, f: null, item: 0 };
  $('share-best-label').textContent = MM.load('share_best', 0);

  function shareRound() {
    share.round++; share.locked = false;
    $('share-round').textContent = `${share.round} / 10`;
    $('share-msg').textContent = '';
    // Keep the pile small enough to count: at most 30 treats
    const n = 2 + MM.rand(5);                                   // 2–6 friends
    const q = 1 + MM.rand(Math.min(8, Math.floor(30 / n)));      // each gets 1–8
    share.f = { n, q, p: n * q };
    share.item = MM.rand(SHARE_ITEMS.length);
    const emoji = SHARE_ITEMS[share.item];
    $('share-q').textContent = MM.t('share.q', { p: share.f.p, n, item: MM.t('share.i.' + share.item) });
    const pile = $('share-pile'); pile.innerHTML = '';
    for (let i = 0; i < share.f.p; i++) {
      const s = document.createElement('span'); s.textContent = emoji; s.style.animationDelay = (i * .02) + 's'; pile.appendChild(s);
    }
    const friends = $('share-friends'); friends.innerHTML = '';
    for (let i = 0; i < n; i++) {
      const d = document.createElement('div'); d.className = 'friend';
      d.innerHTML = `<span class="friend-face">${FRIENDS[i]}</span><div class="plate"></div>`;
      friends.appendChild(d);
    }
    answerButtons($('share-opts'), n, q, shareAnswer);
  }
  /* Deal the treats one at a time onto each plate, round-robin, like real sharing */
  function shareDeal(done) {
    const { n, p } = share.f, emoji = SHARE_ITEMS[share.item];
    const plates = [...document.querySelectorAll('#share-friends .plate')];
    const pile = $('share-pile');
    let i = 0;
    const step = Math.max(40, Math.min(120, 1400 / p));
    const t = setInterval(() => {
      if (i >= p) { clearInterval(t); done(); return; }
      if (pile.lastChild) pile.lastChild.remove();
      const s = document.createElement('span'); s.textContent = emoji;
      plates[i % n].appendChild(s);
      i++;
    }, step);
  }
  function shareAnswer(btn, v) {
    if (share.locked) return; share.locked = true;
    const { n, q, p } = share.f, right = v === q;
    MM.recordFact(n, q, right);
    if (right) { share.score++; btn.classList.add('correct'); MM.sound.good(); $('share-score').textContent = share.score; }
    else { btn.classList.add('wrong'); MM.sound.bad(); markCorrect($('share-opts'), q); }
    shareDeal(() => {
      $('share-msg').textContent = MM.t('share.each', { p, n, q });
      setTimeout(() => { if (share.round >= 10) shareEnd(); else shareRound(); }, right ? 1500 : 2300);
    });
  }
  function shareStart() {
    share.round = 0; share.score = 0;
    $('share-score').textContent = 0;
    $('share-setup').hidden = true; $('share-play').hidden = false;
    shareRound();
  }
  function shareEnd() {
    $('share-setup').hidden = false; $('share-play').hidden = true;
    const best = MM.load('share_best', 0), newBest = share.score > best;
    if (newBest) { MM.save('share_best', share.score); $('share-best-label').textContent = share.score; }
    const perfect = share.score === 10;
    if (share.score > 0) { MM.sound.win(); MM.confetti(perfect ? 140 : 50); }
    MM.checkBadges({ shareScore: share.score });
    openModal(perfect ? '🏆' : '🍪', MM.t(perfect ? 'share.title.perfect' : 'share.title.over'),
      MM.t('share.body', { s: share.score, tail: newBest ? MM.t('generic.beat') : MM.t('generic.best', { b: Math.max(best, share.score) }) }), shareStart);
  }
  $('share-start').addEventListener('click', shareStart);
  $('share-quit').addEventListener('click', () => { share.locked = true; $('share-setup').hidden = false; $('share-play').hidden = true; });

  /* =========================================================
     DIVISION RACE
     ========================================================= */
  const race = { tables: new Set([2, 3, 4, 5]), score: 0, streak: 0, time: 60, timer: null, f: null, locked: false, answered: 0 };
  const raceTables = $('race-tables');
  for (let n = 1; n <= 10; n++) {
    const c = document.createElement('button');
    c.className = 'chip'; c.textContent = '÷' + n; c.dataset.n = n;
    c.setAttribute('aria-pressed', String(race.tables.has(n)));
    c.addEventListener('click', () => {
      if (race.tables.has(n)) race.tables.delete(n); else race.tables.add(n);
      c.setAttribute('aria-pressed', String(race.tables.has(n)));
    });
    raceTables.appendChild(c);
  }
  function setTables(list) {
    race.tables = new Set(list);
    raceTables.querySelectorAll('.chip').forEach(c => c.setAttribute('aria-pressed', String(race.tables.has(+c.dataset.n))));
  }
  document.querySelectorAll('[data-preset]').forEach(b => b.addEventListener('click', () => {
    const p = b.dataset.preset;
    setTables(p === 'all' ? [1,2,3,4,5,6,7,8,9,10] : p === 'easy' ? [1,2,5,10] : [6,7,8,9]);
  }));
  $('race-best-label').textContent = MM.load('race_best', 0);

  function raceQuestion() {
    race.locked = false;
    race.f = MM.divFact([...race.tables]);
    $('race-q').textContent = `${race.f.p} ÷ ${race.f.n} = ?`;
    answerButtons($('race-opts'), race.f.n, race.f.q, raceAnswer);
  }
  function raceAnswer(btn, v) {
    if (race.locked) return; race.locked = true;
    const right = v === race.f.q;
    race.answered++;
    MM.recordFact(race.f.n, race.f.q, right);
    if (right) {
      race.score++; race.streak++; MM.sound.good(); btn.classList.add('correct');
      if (race.streak % 5 === 0) MM.confetti(25);
    } else {
      race.streak = 0; MM.sound.bad(); btn.classList.add('wrong');
      markCorrect($('race-opts'), race.f.q);
    }
    $('race-score').textContent = race.score; $('race-streak').textContent = race.streak;
    const pct = Math.min(100, race.score * 4);
    $('race-fill').style.width = pct + '%'; $('race-rocket').style.left = pct + '%';
    setTimeout(raceQuestion, right ? 350 : 1100);
  }
  function raceTick() {
    race.time--;
    $('race-time').textContent = race.time;
    $('race-timer').style.width = (race.time / 60 * 100) + '%';
    if (race.time <= 5 && race.time > 0) MM.sound.tick();
    if (race.time <= 0) raceEnd();
  }
  function raceStart() {
    if (race.tables.size === 0) { setTables([2, 3, 4, 5]); }
    race.score = 0; race.streak = 0; race.time = 60; race.answered = 0;
    $('race-score').textContent = 0; $('race-streak').textContent = 0; $('race-time').textContent = 60;
    $('race-timer').style.width = '100%'; $('race-fill').style.width = '0%'; $('race-rocket').style.left = '0%';
    $('race-setup').hidden = true; $('race-play').hidden = false;
    raceQuestion();
    clearInterval(race.timer); race.timer = setInterval(raceTick, 1000);
  }
  function raceEnd() {
    clearInterval(race.timer);
    $('race-setup').hidden = false; $('race-play').hidden = true;
    const best = MM.load('race_best', 0);
    const newBest = race.score > best;
    if (newBest) { MM.save('race_best', race.score); $('race-best-label').textContent = race.score; }
    const acc = race.answered ? Math.round(race.score / race.answered * 100) : 0;
    const stars = race.score >= 25 ? '⭐⭐⭐' : race.score >= 15 ? '⭐⭐' : race.score >= 6 ? '⭐' : '';
    if (race.score > 0) { MM.sound.win(); MM.confetti(newBest ? 120 : 50); }
    MM.checkBadges({ raceScore: race.score, raceTables: [...race.tables] });
    openModal(newBest ? '🏆' : '🚀', MM.t(newBest ? 'race.title.best' : 'race.title.over'),
      MM.t('race.body', { s: race.score, acc, stars, tail: newBest ? MM.t('race.beat') : MM.t('race.bestSoFar', { b: Math.max(best, race.score) }) }), raceStart);
  }
  $('race-start').addEventListener('click', raceStart);
  $('race-quit').addEventListener('click', raceEnd);

  /* =========================================================
     DIVISION BINGO — the card holds answers (1–10, repeated);
     Divi calls a division and any unmarked square with that answer counts
     ========================================================= */
  const bingo = { level: 'easy', cells: [], marked: [], calls: 0, f: null, onCard: true, locked: false };
  $('bingo-level').querySelectorAll('.chip').forEach(c => c.addEventListener('click', () => {
    $('bingo-level').querySelectorAll('.chip').forEach(x => x.setAttribute('aria-pressed', 'false'));
    c.setAttribute('aria-pressed', 'true'); bingo.level = c.dataset.level;
  }));
  const levelDivisors = (l) => l === 'easy' ? [1,2,3,4,5] : l === 'hard' ? [6,7,8,9,10] : [1,2,3,4,5,6,7,8,9,10];
  function bingoStart() {
    // Every answer 1–10 appears twice, plus four extras
    const nums = [];
    for (let v = 1; v <= 10; v++) nums.push(v, v);
    for (let i = 0; i < 4; i++) nums.push(1 + MM.rand(10));
    const shuffled = MM.shuffle(nums);
    bingo.cells = shuffled.slice(0, 12).concat(['FREE'], shuffled.slice(12));
    bingo.marked = bingo.cells.map(c => c === 'FREE');
    bingo.calls = 0;
    const grid = $('bingo-grid'); grid.innerHTML = '';
    bingo.cells.forEach((v, i) => {
      const cell = document.createElement('button');
      cell.className = 'bingo-cell' + (v === 'FREE' ? ' free' : ''); cell.textContent = v === 'FREE' ? MM.t('bingo.free') : v;
      cell.addEventListener('click', () => bingoClick(i, cell));
      grid.appendChild(cell);
    });
    $('bingo-setup').hidden = true; $('bingo-play').hidden = false;
    $('bingo-marked').textContent = 0;
    bingoCall();
  }
  const unmarkedValues = () => new Set(bingo.cells.filter((c, i) => c !== 'FREE' && !bingo.marked[i]));
  function bingoCall() {
    bingo.locked = false;
    const open = [...unmarkedValues()];
    // Mostly answers that are still on the card; sometimes any answer, so kids must check
    const q = (open.length && Math.random() < .8) ? MM.pick(open) : 1 + MM.rand(10);
    const n = MM.pick(levelDivisors(bingo.level));
    bingo.f = { n, q, p: n * q };
    bingo.onCard = unmarkedValues().has(q);
    bingo.calls++;
    $('bingo-calls').textContent = bingo.calls;
    const caller = $('bingo-caller'); caller.textContent = `${bingo.f.p} ÷ ${n}`;
    caller.style.animation = 'none'; void caller.offsetWidth; caller.style.animation = 'pop .4s';
  }
  function bingoClick(i, cell) {
    if (bingo.locked || bingo.marked[i] || bingo.cells[i] === 'FREE') return;
    const { n, q } = bingo.f;
    const right = bingo.cells[i] === q;
    MM.recordFact(n, q, right);
    if (right) {
      bingo.locked = true; bingo.marked[i] = true; cell.classList.add('marked'); MM.sound.good();
      $('bingo-marked').textContent = bingo.marked.filter(Boolean).length - 1;
      const line = bingoLine();
      if (line) { line.forEach(j => $('bingo-grid').children[j].classList.add('win')); bingoWin(); return; }
      setTimeout(bingoCall, 500);
    } else {
      cell.classList.add('wrong'); MM.sound.bad();
      setTimeout(() => cell.classList.remove('wrong'), 450);
    }
  }
  function bingoLine() {
    const m = bingo.marked, lines = [];
    for (let r = 0; r < 5; r++) lines.push([0,1,2,3,4].map(c => r * 5 + c));
    for (let c = 0; c < 5; c++) lines.push([0,1,2,3,4].map(r => r * 5 + c));
    lines.push([0, 6, 12, 18, 24], [4, 8, 12, 16, 20]);
    return lines.find(l => l.every(i => m[i])) || null;
  }
  function bingoWin() {
    MM.sound.win(); MM.confetti(120);
    const wins = MM.load('bingo_wins', 0) + 1; MM.save('bingo_wins', wins);
    MM.checkBadges({ bingoWin: true });
    setTimeout(() => openModal('🎯', MM.t('bingo.win.title'), MM.t('bingo.win.body', { c: bingo.calls, w: wins }), bingoStart), 700);
  }
  $('bingo-nope').addEventListener('click', () => {
    if (bingo.locked) return;
    const { n, q } = bingo.f;
    if (!bingo.onCard) { MM.sound.good(); MM.recordFact(n, q, true); bingoCall(); }
    else {
      MM.sound.bad(); MM.recordFact(n, q, false);
      const idx = bingo.cells.findIndex((c, i) => c === q && !bingo.marked[i]);
      const cell = $('bingo-grid').children[idx];
      if (cell) { cell.classList.add('wrong'); setTimeout(() => cell.classList.remove('wrong'), 600); }
    }
  });
  $('bingo-start').addEventListener('click', bingoStart);
  $('bingo-quit').addEventListener('click', () => { $('bingo-setup').hidden = false; $('bingo-play').hidden = true; });

  /* =========================================================
     DIVISION PUZZLES
     ========================================================= */
  const puzzle = { score: 0, lives: 3, locked: false, current: null };
  $('puzzle-best-label').textContent = MM.load('puzzle_best', 0);
  const fact = () => { const n = 2 + MM.rand(9), q = 2 + MM.rand(9); return { n, q, p: n * q }; };
  const puzzleTypes = [
    // Missing dividend: ? ÷ n = q
    function () {
      const { n, q, p } = fact();
      const opts = new Set([p]);
      MM.shuffle([p + n, p - n, p + 1, p - 1, n + q, p + 10]).forEach(v => { if (opts.size < 4 && v > 0 && v !== p) opts.add(v); });
      return { type: MM.t('puzzle.type.missing'), q: `? ÷ ${n} = ${q}`, opts: MM.shuffle([...opts]), ans: p, fact: [n, q], explain: `${p} ÷ ${n} = ${q}` };
    },
    // Missing divisor: p ÷ ? = q
    function () {
      const { n, q, p } = fact();
      const opts = new Set([n]);
      while (opts.size < 4) { const v = Math.max(1, n + MM.rand(7) - 3); if (v !== n && v <= 12) opts.add(v); }
      return { type: MM.t('puzzle.type.missing'), q: `${p} ÷ ? = ${q}`, opts: MM.shuffle([...opts]), ans: n, fact: [n, q], explain: `${p} ÷ ${n} = ${q}` };
    },
    // True or false
    function () {
      const { n, q, p } = fact();
      const truth = Math.random() < .5;
      const shown = truth ? q : MM.pick([q + 1, q - 1, q + 2, n].filter(v => v > 0 && v !== q));
      const T = MM.t('puzzle.true'), F = MM.t('puzzle.false');
      return { type: MM.t('puzzle.type.tf'), q: `${p} ÷ ${n} = ${shown}`, opts: [T, F], ans: truth ? T : F, fact: [n, q], explain: `${p} ÷ ${n} = ${q}` };
    },
    // Fact family: n × q = p, so p ÷ n = ?
    function () {
      const { n, q, p } = fact();
      return { type: MM.t('puzzle.type.family'), q: `${n} × ${q} = ${p}, ${p} ÷ ${n} = ?`, opts: MM.divDistractors(n, q), ans: q, fact: [n, q], explain: `${p} ÷ ${n} = ${q}` };
    },
    // Which one equals q?
    function () {
      const { n, q, p } = fact();
      const right = `${p} ÷ ${n}`;
      const opts = new Set([right]);
      let guard = 0;
      while (opts.size < 4 && guard++ < 100) { const w = fact(); if (w.q !== q) opts.add(`${w.p} ÷ ${w.n}`); }
      return { type: MM.t('puzzle.type.which'), q: MM.t('puzzle.q.which', { n: q }), opts: MM.shuffle([...opts]), ans: right, fact: [n, q], explain: `${p} ÷ ${n} = ${q}` };
    },
    // Odd one out: which is NOT q?
    function () {
      const q = 2 + MM.rand(8);
      const ds = MM.shuffle([2,3,4,5,6,7,8,9,10]).slice(0, 3);
      const goods = ds.map(d => `${d * q} ÷ ${d}`);
      let w; do { w = fact(); } while (w.q === q);
      const odd = `${w.p} ÷ ${w.n}`;
      return { type: MM.t('puzzle.type.odd'), q: MM.t('puzzle.q.not', { n: q }), opts: MM.shuffle([...goods, odd]), ans: odd, fact: [w.n, w.q], explain: MM.t('puzzle.explainNot', { odd, v: w.q, target: q }) };
    }
  ];
  function puzzleNext() {
    puzzle.locked = false;
    const p = MM.pick(puzzleTypes)(); puzzle.current = p;
    $('puzzle-type').textContent = p.type;
    $('puzzle-q').textContent = p.q;
    const isMath = /^[\d?\s×÷=,]+$/.test(p.q);
    $('puzzle-q').style.fontSize = p.q.length > 22 ? 'clamp(1.5rem,5vw,2.4rem)' : p.q.length > 14 ? 'clamp(1.8rem,6vw,3rem)' : '';
    $('puzzle-q').classList.toggle('prose', !isMath);
    const opts = $('puzzle-opts'); opts.innerHTML = '';
    p.opts.forEach(v => {
      const btn = document.createElement('button');
      btn.className = 'option'; btn.textContent = v;
      if (String(v).length > 6) btn.style.fontSize = '1.5rem';
      btn.addEventListener('click', () => puzzleAnswer(btn, v));
      opts.appendChild(btn);
    });
  }
  function puzzleAnswer(btn, v) {
    if (puzzle.locked) return; puzzle.locked = true;
    const p = puzzle.current, right = v === p.ans;
    MM.recordFact(p.fact[0], p.fact[1], right);
    if (right) {
      puzzle.score++; MM.sound.good(); btn.classList.add('correct');
      $('puzzle-score').textContent = puzzle.score;
      if (puzzle.score % 10 === 0) MM.confetti(40);
      setTimeout(puzzleNext, 450);
    } else {
      puzzle.lives--; MM.sound.bad(); btn.classList.add('wrong');
      markCorrect($('puzzle-opts'), p.ans);
      $('puzzle-hearts').textContent = '❤️'.repeat(puzzle.lives) + '🖤'.repeat(3 - puzzle.lives);
      $('puzzle-type').textContent = MM.t('puzzle.remember') + p.explain;
      if (puzzle.lives <= 0) setTimeout(puzzleEnd, 1400); else setTimeout(puzzleNext, 1600);
    }
  }
  function puzzleStart() {
    puzzle.score = 0; puzzle.lives = 3;
    $('puzzle-score').textContent = 0; $('puzzle-hearts').textContent = '❤️❤️❤️';
    $('puzzle-setup').hidden = true; $('puzzle-play').hidden = false;
    puzzleNext();
  }
  function puzzleEnd() {
    $('puzzle-setup').hidden = false; $('puzzle-play').hidden = true;
    const best = MM.load('puzzle_best', 0), newBest = puzzle.score > best;
    if (newBest) { MM.save('puzzle_best', puzzle.score); $('puzzle-best-label').textContent = puzzle.score; }
    if (puzzle.score > 0) { MM.sound.win(); MM.confetti(newBest ? 100 : 40); }
    openModal(newBest ? '🏆' : '🧩', MM.t(newBest ? 'puzzle.title.best' : 'puzzle.title.over'),
      MM.t('puzzle.body', { s: puzzle.score, word: MM.t(puzzle.score === 1 ? 'puzzle.one' : 'puzzle.many'), tail: newBest ? MM.t('puzzle.beat') : MM.t('puzzle.bestSoFar', { b: Math.max(best, puzzle.score) }) }), puzzleStart);
  }
  $('puzzle-start').addEventListener('click', puzzleStart);
  $('puzzle-quit').addEventListener('click', puzzleEnd);
})();

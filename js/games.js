/* Games: Times Table Race, Multiplication Bingo, Math Puzzles */
(function () {
  'use strict';
  const $ = (id) => document.getElementById(id);

  /* ---------- Tabs ---------- */
  const tabs = document.querySelectorAll('.game-tab');
  function showGame(name) {
    tabs.forEach(t => t.setAttribute('aria-selected', String(t.dataset.game === name)));
    document.querySelectorAll('.game-panel').forEach(p => p.classList.toggle('active', p.id === 'game-' + name));
    history.replaceState(null, '', '#' + name);
  }
  tabs.forEach(t => t.addEventListener('click', () => showGame(t.dataset.game)));
  const hash = location.hash.replace('#', '');
  if (['race', 'bingo', 'puzzle', 'memory', 'balloon', 'hunt'].includes(hash)) showGame(hash);
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

  /* =========================================================
     TIMES TABLE RACE
     ========================================================= */
  const race = { tables: new Set([2, 3, 4, 5]), score: 0, streak: 0, time: 60, timer: null, a: 0, b: 0, locked: false, answered: 0 };
  const raceTables = $('race-tables');
  for (let n = 1; n <= 10; n++) {
    const c = document.createElement('button');
    c.className = 'chip'; c.textContent = n; c.dataset.n = n;
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
    const t = [...race.tables];
    race.a = MM.pick(t); race.b = 1 + MM.rand(10);
    if (Math.random() < .5) [race.a, race.b] = [race.b, race.a]; // sometimes flip so kids see both orders
    $('race-q').textContent = `${race.a} × ${race.b} = ?`;
    const opts = $('race-opts'); opts.innerHTML = '';
    MM.distractors(race.a, race.b).forEach(v => {
      const btn = document.createElement('button');
      btn.className = 'option'; btn.textContent = v;
      btn.addEventListener('click', () => raceAnswer(btn, v));
      opts.appendChild(btn);
    });
  }
  function raceAnswer(btn, v) {
    if (race.locked) return; race.locked = true;
    const right = v === race.a * race.b;
    race.answered++;
    MM.recordFact(race.a, race.b, right);
    if (right) {
      race.score++; race.streak++; MM.sound.good(); btn.classList.add('correct');
      if (race.streak % 5 === 0) MM.confetti(25);
    } else {
      race.streak = 0; MM.sound.bad(); btn.classList.add('wrong');
      [...$('race-opts').children].forEach(o => { if (+o.textContent === race.a * race.b) o.classList.add('correct'); });
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
    const sessions = MM.load('race_sessions', []); sessions.push({ d: Date.now(), s: race.score, acc }); MM.save('race_sessions', sessions.slice(-30));
    if (race.score > 0) { MM.sound.win(); MM.confetti(newBest ? 120 : 50); }
    MM.checkBadges({ raceScore: race.score, raceTables: [...race.tables] });
    openModal(newBest ? '🏆' : '🚀', MM.t(newBest ? 'race.title.best' : 'race.title.over'),
      MM.t('race.body', { s: race.score, acc, stars, tail: newBest ? MM.t('race.beat') : MM.t('race.bestSoFar', { b: Math.max(best, race.score) }) }), raceStart);
  }
  $('race-start').addEventListener('click', raceStart);
  $('race-quit').addEventListener('click', raceEnd);

  /* =========================================================
     MULTIPLICATION BINGO
     ========================================================= */
  const bingo = { level: 'easy', cells: [], marked: [], calls: 0, current: null, onCard: true, locked: false };
  $('bingo-level').querySelectorAll('.chip').forEach(c => c.addEventListener('click', () => {
    $('bingo-level').querySelectorAll('.chip').forEach(x => x.setAttribute('aria-pressed', 'false'));
    c.setAttribute('aria-pressed', 'true'); bingo.level = c.dataset.level;
  }));
  function bingoFacts() {
    const range = bingo.level === 'easy' ? [1,2,3,4,5] : bingo.level === 'hard' ? [6,7,8,9,10] : [1,2,3,4,5,6,7,8,9,10];
    const facts = [];
    range.forEach(a => { for (let b = 1; b <= 10; b++) facts.push([a, b]); });
    return facts;
  }
  function bingoStart() {
    const facts = bingoFacts();
    const products = MM.shuffle([...new Set(facts.map(f => f[0] * f[1]))]).slice(0, 24);
    bingo.cells = products.slice(0, 12).concat(['FREE'], products.slice(12));
    bingo.marked = bingo.cells.map(c => c === 'FREE');
    bingo.calls = 0; bingo.facts = facts;
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
  function bingoCall() {
    bingo.locked = false;
    const unmarkedProducts = bingo.cells.filter((c, i) => c !== 'FREE' && !bingo.marked[i]);
    // 75% of calls are on the card; 25% are decoys so kids must check
    bingo.onCard = Math.random() < .75 && unmarkedProducts.length > 0;
    let fact;
    if (bingo.onCard) {
      const target = MM.pick(unmarkedProducts);
      fact = MM.pick(bingo.facts.filter(f => f[0] * f[1] === target));
    } else {
      const onCardSet = new Set(bingo.cells);
      const off = bingo.facts.filter(f => !onCardSet.has(f[0] * f[1]));
      fact = off.length ? MM.pick(off) : MM.pick(bingo.facts);
      bingo.onCard = onCardSet.has(fact[0] * fact[1]) && !bingo.marked[bingo.cells.indexOf(fact[0] * fact[1])];
    }
    if (Math.random() < .5) fact = [fact[1], fact[0]];
    bingo.current = fact; bingo.calls++;
    $('bingo-calls').textContent = bingo.calls;
    const caller = $('bingo-caller'); caller.textContent = `${fact[0]} × ${fact[1]}`;
    caller.style.animation = 'none'; void caller.offsetWidth; caller.style.animation = 'pop .4s';
  }
  function bingoClick(i, cell) {
    if (bingo.locked || bingo.marked[i] || bingo.cells[i] === 'FREE') return;
    const [a, b] = bingo.current;
    const right = bingo.cells[i] === a * b;
    MM.recordFact(a, b, right);
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
    const bestCalls = MM.load('bingo_best_calls', 0);
    if (!bestCalls || bingo.calls < bestCalls) MM.save('bingo_best_calls', bingo.calls);
    MM.checkBadges({ bingoWin: true });
    setTimeout(() => openModal('🎯', MM.t('bingo.win.title'), MM.t('bingo.win.body', { c: bingo.calls, w: wins }), bingoStart), 700);
  }
  $('bingo-nope').addEventListener('click', () => {
    if (bingo.locked) return;
    const [a, b] = bingo.current;
    if (!bingo.onCard) { MM.sound.good(); MM.recordFact(a, b, true); bingoCall(); }
    else {
      MM.sound.bad(); MM.recordFact(a, b, false);
      const idx = bingo.cells.indexOf(a * b);
      const cell = $('bingo-grid').children[idx];
      cell.classList.add('wrong'); setTimeout(() => cell.classList.remove('wrong'), 600);
    }
  });
  $('bingo-start').addEventListener('click', bingoStart);
  $('bingo-quit').addEventListener('click', () => { $('bingo-setup').hidden = false; $('bingo-play').hidden = true; });

  /* =========================================================
     MATH PUZZLES
     ========================================================= */
  const puzzle = { score: 0, lives: 3, locked: false, current: null };
  $('puzzle-best-label').textContent = MM.load('puzzle_best', 0);
  const puzzleTypes = [
    // Missing factor: ? × b = c
    function () {
      const a = 2 + MM.rand(9), b = 2 + MM.rand(9);
      const hideFirst = Math.random() < .5;
      const q = hideFirst ? `? × ${b} = ${a * b}` : `${a} × ? = ${a * b}`;
      const ans = hideFirst ? a : b;
      const opts = new Set([ans]);
      while (opts.size < 4) { const v = Math.max(1, ans + MM.rand(7) - 3); if (v !== ans && v <= 12) opts.add(v); }
      return { type: MM.t('puzzle.type.missing'), q, opts: MM.shuffle([...opts]), ans, fact: [a, b], explain: `${a} × ${b} = ${a * b}` };
    },
    // True or false
    function () {
      const a = 2 + MM.rand(9), b = 2 + MM.rand(9);
      const truth = Math.random() < .5;
      let shown = a * b;
      if (!truth) { const wrongs = [a * b + a, a * b - a, a * b + 1, a * b - 1, a * b + 2]; shown = MM.pick(wrongs.filter(v => v > 0 && v !== a * b)); }
      const T = MM.t('puzzle.true'), F = MM.t('puzzle.false');
      return { type: MM.t('puzzle.type.tf'), q: `${a} × ${b} = ${shown}`, opts: [T, F], ans: truth ? T : F, fact: [a, b], explain: `${a} × ${b} = ${a * b}` };
    },
    // Which one makes N?
    function () {
      const a = 2 + MM.rand(9), b = 2 + MM.rand(9);
      const target = a * b;
      const right = `${a} × ${b}`;
      const opts = new Set([right]);
      let guard = 0;
      while (opts.size < 4 && guard++ < 100) {
        const x = 2 + MM.rand(9), y = 2 + MM.rand(9);
        if (x * y !== target) opts.add(`${x} × ${y}`);
      }
      return { type: MM.t('puzzle.type.which'), q: MM.t('puzzle.q.which', { n: target }), opts: MM.shuffle([...opts]), ans: right, fact: [a, b], explain: `${a} × ${b} = ${target}` };
    },
    // Odd one out (which does NOT equal N)
    function () {
      const target = MM.pick([12, 16, 18, 20, 24, 30, 36, 40]);
      const pairs = [];
      for (let x = 1; x <= 10; x++) for (let y = 1; y <= 10; y++) if (x * y === target && x <= y) pairs.push(`${x} × ${y}`);
      const goods = MM.shuffle(pairs).slice(0, 3);
      let odd; do { const x = 2 + MM.rand(9), y = 2 + MM.rand(9); if (x * y !== target) odd = `${x} × ${y}`; } while (!odd);
      const [ox, oy] = odd.split(' × ').map(Number);
      return { type: MM.t('puzzle.type.odd'), q: MM.t('puzzle.q.not', { n: target }), opts: MM.shuffle([...goods, odd]), ans: odd, fact: [ox, oy], explain: MM.t('puzzle.explainNot', { odd, v: ox * oy, target }) };
    }
  ];
  function puzzleNext() {
    puzzle.locked = false;
    const p = MM.pick(puzzleTypes)(); puzzle.current = p;
    $('puzzle-type').textContent = p.type;
    $('puzzle-q').textContent = p.q;
    const isMath = /^[\d?\s×=]+$/.test(p.q);
    $('puzzle-q').style.fontSize = p.q.length > 14 ? 'clamp(1.8rem,6vw,3rem)' : '';
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
      [...$('puzzle-opts').children].forEach(o => { if (o.textContent === String(p.ans)) o.classList.add('correct'); });
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

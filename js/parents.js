/* Parents page: progress tracker. */
(function () {
  const $ = (id) => document.getElementById(id);
  function paint() {
    $('p-race').textContent = MM.load('race_best', 0);
    $('p-puzzle').textContent = MM.load('puzzle_best', 0);
    $('p-bingo').textContent = MM.load('bingo_wins', 0);
    const facts = MM.load('facts', {});
    let R = 0, W = 0;
    const perTable = {};
    for (let n = 1; n <= 10; n++) perTable[n] = { r: 0, w: 0 };
    const trouble = [];
    Object.entries(facts).forEach(([k, s]) => {
      const [a, b] = k.split('x').map(Number);
      R += s.r; W += s.w;
      perTable[a].r += s.r; perTable[a].w += s.w;
      if (a !== b) { perTable[b].r += s.r; perTable[b].w += s.w; }
      if (s.w >= 2 && s.w >= s.r) trouble.push({ a, b, s });
    });
    $('p-facts').textContent = R + W;
    $('p-acc').textContent = R + W ? Math.round(R / (R + W) * 100) + '%' : '–';
    const m = $('mastery'); m.innerHTML = '';
    for (let n = 1; n <= 10; n++) {
      const t = perTable[n], total = t.r + t.w, acc = total ? Math.round(t.r / total * 100) : 0;
      const d = document.createElement('div');
      d.style.background = total === 0 ? '#eee' : (total >= 10 && acc >= 90) ? 'var(--lime)' : 'var(--sun)';
      d.innerHTML = `<span class="math">× ${n}</span><small>${total ? MM.t('p.accOf', { acc, total }) : MM.t('p.notTried')}</small>`;
      m.appendChild(d);
    }
    const tr = $('trouble'); tr.innerHTML = '';
    trouble.sort((x, y) => (y.s.w - y.s.r) - (x.s.w - x.s.r)).slice(0, 12).forEach(f => {
      const c = document.createElement('span'); c.className = 'chip math'; c.textContent = `${f.a} × ${f.b} = ${f.a * f.b}`; tr.appendChild(c);
    });
    if (!trouble.length) tr.innerHTML = `<span style="color:var(--ink-soft)">${MM.t('p.noTrouble')}</span>`;
  }
  $('p-reset').addEventListener('click', () => {
    if (!confirm(MM.t('p.resetConfirm'))) return;
    ['race_best', 'puzzle_best', 'bingo_wins', 'bingo_best_calls', 'memory_best', 'balloon_best', 'hunt_best', 'facts', 'qc_best', 'race_sessions', 'watched', 'stars'].forEach(k => MM.save(k, k === 'facts' || k === 'watched' ? {} : k === 'race_sessions' ? [] : 0));
    MM.save('prizes', []); MM.save('badges', []); MM.stars = 0; MM.prizes = []; MM.badges = []; MM.paintStars();
    paint();
  });
  paint();
})();

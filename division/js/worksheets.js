/* Division worksheet generator with print support */
(function () {
  'use strict';
  const $ = (id) => document.getElementById(id);
  const ws = { tables: new Set([2, 3, 4, 5]), layout: 'h', problems: [], families: [] };

  /* ---------- Divisor chips ---------- */
  const chips = $('ws-tables');
  for (let n = 1; n <= 10; n++) {
    const c = document.createElement('button');
    c.type = 'button'; c.className = 'chip'; c.textContent = '÷' + n; c.dataset.n = n;
    c.setAttribute('aria-pressed', String(ws.tables.has(n)));
    c.addEventListener('click', () => { if (ws.tables.has(n)) ws.tables.delete(n); else ws.tables.add(n); c.setAttribute('aria-pressed', String(ws.tables.has(n))); generate(); });
    chips.appendChild(c);
  }
  function setTables(list) {
    ws.tables = new Set(list);
    chips.querySelectorAll('.chip').forEach(c => c.setAttribute('aria-pressed', String(ws.tables.has(+c.dataset.n))));
    generate();
  }
  document.querySelectorAll('[data-ws-preset]').forEach(b => b.addEventListener('click', () => {
    const p = b.dataset.wsPreset;
    setTables(p === 'all' ? [1,2,3,4,5,6,7,8,9,10] : p === 'none' ? [] : p === 'easy' ? [1,2,5,10] : [6,7,8,9]);
  }));
  $('ws-layout-h').addEventListener('click', () => { ws.layout = 'h'; paintLayout(); render(); });
  $('ws-layout-v').addEventListener('click', () => { ws.layout = 'v'; paintLayout(); render(); });
  function paintLayout() {
    $('ws-layout-h').setAttribute('aria-pressed', String(ws.layout === 'h'));
    $('ws-layout-v').setAttribute('aria-pressed', String(ws.layout === 'v'));
  }
  ['ws-type', 'ws-count'].forEach(id => $(id).addEventListener('change', () => { toggleFields(); generate(); }));
  ['ws-name', 'ws-key'].forEach(id => $(id).addEventListener('input', render));
  $('ws-generate').addEventListener('click', generate);
  $('ws-print').addEventListener('click', () => window.print());
  $('ws-form').addEventListener('submit', (e) => e.preventDefault());   // the form never submits anywhere

  function toggleFields() {
    const t = $('ws-type').value;
    $('f-count').style.display = (t === 'problems' || t === 'missing') ? '' : 'none';
    $('f-layout').style.display = t === 'problems' ? '' : 'none';
    $('f-key').style.display = t === 'chart' ? 'none' : '';
    $('f-tables').style.display = t === 'chart' ? 'none' : '';
  }
  const chosen = () => ws.tables.size ? [...ws.tables] : [2, 3, 4, 5];

  /* ---------- Problem generation ---------- */
  function generate() {
    const t = $('ws-type').value;
    const count = +$('ws-count').value;
    ws.problems = []; ws.families = [];
    if (t === 'problems' || t === 'missing') {
      // Balanced pool: every fact for the chosen divisors, shuffled, repeated if needed
      let pool = [];
      while (pool.length < count) {
        const facts = [];
        chosen().forEach(n => { for (let q = 1; q <= 10; q++) facts.push({ n, q, p: n * q }); });
        pool = pool.concat(MM.shuffle(facts));
      }
      ws.problems = pool.slice(0, count).map(f => Object.assign(f, { hide: t === 'missing' ? (Math.random() < .5 ? 'p' : 'n') : null }));
    }
    if (t === 'family') {
      const seen = new Set();
      let guard = 0;
      while (ws.families.length < 8 && guard++ < 200) {
        const n = MM.pick(chosen()), q = 2 + MM.rand(9);
        const key = Math.min(n, q) + '-' + Math.max(n, q);
        if (n === 1 || seen.has(key)) continue;
        seen.add(key); ws.families.push({ n, q, p: n * q });
      }
    }
    render();
  }

  /* ---------- Render ---------- */
  function header(title, sub) {
    const name = $('ws-name').value.trim();
    return `<div class="sheet-head">
      <div><h2>${title}</h2><div style="font-size:.95rem;color:#555">${sub}</div></div>
      <div class="sheet-meta"><div>${MM.t('ws.name')} <span>${name ? '&nbsp;' + esc(name) : ''}</span></div><div>${MM.t('ws.date')} <span></span></div></div>
    </div>`;
  }
  function footer(extra) {
    return `<div class="sheet-footer"><span>${MM.t('ws.footer')}</span><span>${extra || MM.t('ws.score')}</span></div>`;
  }
  function esc(s) { return s.replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c])); }
  function tableList() { const t = chosen().sort((a, b) => a - b); return t.length === 10 ? MM.t('ws.allTables') : MM.t('ws.tables') + t.map(n => '÷' + n).join(MM.sep); }
  const num = (i) => `<span style="color:#888;font-size:.9rem;width:1.6rem">${i + 1}.</span>`;
  const blank = '<span class="blank"></span>';

  function render() {
    const t = $('ws-type').value, sheet = $('sheet');
    const key = $('ws-key').checked;
    let html = '';

    if (t === 'problems') {
      html += header(MM.t('ws.practice'), tableList());
      if (ws.layout === 'h') {
        html += `<div class="prob-grid h">` + ws.problems.map((f, i) => `<div class="prob">${num(i)}${f.p} ÷ ${f.n} = ${blank}</div>`).join('') + '</div>';
      } else {
        // "Bus stop" layout: divisor outside the bracket, dividend inside, answer on top
        html += `<div class="prob-grid bus-grid">` + ws.problems.map((f, i) => `<div class="prob bus-prob">${num(i)}<span class="bus"><span class="bus-ans"></span><span class="bus-dvs">${f.n}</span><span class="bus-dvd">${f.p}</span></span></div>`).join('') + '</div>';
      }
      html += `<p style="margin-top:1.8rem" class="stars">☆ ☆ ☆ ☆ ☆</p>` + footer();
      if (key) html += answerKey(MM.t('ws.key', { title: MM.t('ws.practice') }), ws.problems.map((f, i) => `<div class="prob">${i + 1}. ${f.p} ÷ ${f.n} = <span class="ans-inline">${f.q}</span></div>`));
    }

    else if (t === 'missing') {
      html += header(MM.t('ws.missing'), tableList() + ' · ' + MM.t('ws.missingSub'));
      html += `<div class="prob-grid h">` + ws.problems.map((f, i) =>
        `<div class="prob">${num(i)}${f.hide === 'p' ? blank : f.p} ÷ ${f.hide === 'n' ? blank : f.n} = ${f.q}</div>`).join('') + '</div>';
      html += footer();
      if (key) html += answerKey(MM.t('ws.key', { title: MM.t('ws.missing') }), ws.problems.map((f, i) => `<div class="prob">${i + 1}. ${f.p} ÷ ${f.n} = ${f.q} → <span class="ans-inline">${f.hide === 'p' ? f.p : f.n}</span></div>`));
    }

    else if (t === 'family') {
      html += header(MM.t('ws.family'), MM.t('ws.familySub'));
      const line = (op) => `<div class="family-line">${blank} ${op} ${blank} = ${blank}</div>`;
      html += `<div class="family-grid">` + ws.families.map(f => `
        <div class="family">
          <div class="family-nums"><span>${f.n}</span><span>${f.q}</span><span class="big">${f.p}</span></div>
          ${line('×')}${line('×')}${line('÷')}${line('÷')}
        </div>`).join('') + '</div>';
      html += footer();
      if (key) html += `<div class="page-break">${header(MM.t('ws.key', { title: MM.t('ws.family') }), MM.t('ws.forParents'))}<div class="family-grid">` +
        ws.families.map(f => `<div class="family key math">${f.n} × ${f.q} = ${f.p}<br>${f.q} × ${f.n} = ${f.p}<br>${f.p} ÷ ${f.n} = ${f.q}<br>${f.p} ÷ ${f.q} = ${f.n}</div>`).join('') + '</div></div>';
    }

    else if (t === 'chart') {
      html += header(MM.t('ws.chart'), MM.t('ws.chartSub'));
      let h = '<table class="sheet-chart"><tr><th>÷</th>' + Array.from({ length: 10 }, (_, i) => `<th>${i + 1}</th>`).join('') + '</tr>';
      for (let r = 1; r <= 10; r++) h += `<tr><th>${r}</th>` + Array.from({ length: 10 }, (_, i) => `<td>${r * (i + 1)}</td>`).join('') + '</tr>';
      html += h + '</table>';
      html += `<p style="margin-top:1.2rem;color:#555;font-size:.95rem">${MM.t('ws.chartHow')}</p>`;
      html += footer(' ');
    }

    sheet.innerHTML = html;
  }
  function answerKey(title, rows) {
    return `<div class="page-break">${header(title, MM.t('ws.forParents'))}<div class="prob-grid h" style="font-size:1rem">${rows.join('')}</div></div>`;
  }

  toggleFields();
  generate();
})();

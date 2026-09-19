/* Worksheet generator with print support */
(function () {
  'use strict';
  const $ = (id) => document.getElementById(id);
  const ws = { tables: new Set([2, 3, 4, 5]), layout: 'h', problems: [] };

  /* ---------- Table chips ---------- */
  const chips = $('ws-tables');
  for (let n = 1; n <= 10; n++) {
    const c = document.createElement('button');
    c.type = 'button'; c.className = 'chip'; c.textContent = n; c.dataset.n = n;
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

  function toggleFields() {
    const t = $('ws-type').value;
    const isProblems = t === 'problems' || t === 'missing';
    $('f-count').style.display = isProblems ? '' : 'none';
    $('f-layout').style.display = t === 'problems' ? '' : 'none';
    $('f-key').style.display = t === 'chart-full' ? 'none' : '';
    $('f-tables').style.display = t.startsWith('chart') ? 'none' : '';
  }

  /* ---------- Problem generation ---------- */
  function generate() {
    const t = $('ws-type').value;
    const count = +$('ws-count').value;
    const tables = ws.tables.size ? [...ws.tables] : [2, 3, 4, 5];
    ws.problems = [];
    if (t === 'problems' || t === 'missing') {
      // Build a balanced pool: every fact from the chosen tables, shuffled, then repeat if needed
      let pool = [];
      while (pool.length < count) {
        const facts = [];
        tables.forEach(a => { for (let b = 1; b <= 10; b++) facts.push(Math.random() < .5 ? [a, b] : [b, a]); });
        pool = pool.concat(MM.shuffle(facts));
      }
      ws.problems = pool.slice(0, count).map(([a, b]) => ({ a, b, hide: t === 'missing' ? (Math.random() < .5 ? 'a' : 'b') : null }));
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
  function tableList() { const t = ws.tables.size ? [...ws.tables].sort((a, b) => a - b) : [2,3,4,5]; return t.length === 10 ? MM.t('ws.allTables') : MM.t('ws.tables') + t.join(MM.sep); }

  function render() {
    const t = $('ws-type').value, sheet = $('sheet');
    const key = $('ws-key').checked;
    let html = '';

    if (t === 'problems') {
      html += header(MM.t('ws.practice'), tableList());
      html += `<div class="prob-grid ${ws.layout}">` + ws.problems.map((p, i) => ws.layout === 'h'
        ? `<div class="prob"><span style="color:#888;font-size:.9rem;width:1.6rem">${i + 1}.</span>${p.a} × ${p.b} = <span class="blank"></span></div>`
        : `<div class="prob"><span>${p.a}</span><span class="op">${p.b}</span><span class="space"></span></div>`).join('') + '</div>';
      html += `<p style="margin-top:1.8rem" class="stars">☆ ☆ ☆ ☆ ☆</p>` + footer();
      if (key) html += answerKey(MM.t('ws.key', { title: MM.t('ws.practice') }), ws.problems.map((p, i) => `<div class="prob">${i + 1}. ${p.a} × ${p.b} = <span class="ans-inline">${p.a * p.b}</span></div>`));
    }

    else if (t === 'missing') {
      html += header(MM.t('ws.missing'), tableList() + ' · ' + MM.t('ws.missingSub'));
      html += `<div class="prob-grid h">` + ws.problems.map((p, i) =>
        `<div class="prob"><span style="color:#888;font-size:.9rem;width:1.6rem">${i + 1}.</span>${p.hide === 'a' ? '<span class="blank"></span>' : p.a} × ${p.hide === 'b' ? '<span class="blank"></span>' : p.b} = ${p.a * p.b}</div>`).join('') + '</div>';
      html += footer();
      if (key) html += answerKey(MM.t('ws.key', { title: MM.t('ws.missing') }), ws.problems.map((p, i) => `<div class="prob">${i + 1}. ${p.a} × ${p.b} = ${p.a * p.b} → <span class="ans-inline">${p.hide === 'a' ? p.a : p.b}</span></div>`));
    }

    else if (t === 'chart-blank' || t === 'chart-full') {
      const full = t === 'chart-full';
      html += header(full ? MM.t('ws.chartFull') : MM.t('ws.chartBlank'), full ? MM.t('ws.chartFullSub') : MM.t('ws.chartBlankSub'));
      html += chartTable(full);
      html += `<p style="margin-top:1.2rem;color:#555;font-size:.95rem">${full ? MM.t('ws.diag') : MM.t('ws.hint')}</p>`;
      html += footer(full ? '' : MM.t('ws.time'));
      if (!full && key) html += `<div class="page-break">` + header(MM.t('ws.key', { title: MM.t('ws.chartFull') }), '') + chartTable(true) + '</div>';
    }

    else if (t === 'skip') {
      const tables = ws.tables.size ? [...ws.tables].sort((a, b) => a - b) : [2, 3, 4, 5];
      html += header(MM.t('ws.skip'), MM.t('ws.skipSub'));
      html += tables.map(n => {
        const hidden = new Set(MM.shuffle([1,2,3,4,5,6,7,8,9]).slice(0, 4));
        return `<div style="margin:1rem 0 1.4rem"><div style="font-family:var(--display);font-weight:700;font-size:1.2rem;margin-bottom:.4rem">${MM.t('ws.countBy', { n })}</div>
          <div style="display:flex;gap:.5rem;flex-wrap:wrap">${Array.from({ length: 10 }, (_, i) => `<span style="display:inline-block;min-width:54px;height:44px;border:2px solid #000;border-radius:10px;text-align:center;line-height:40px;font-family:var(--display);font-size:1.2rem;font-weight:700">${hidden.has(i) ? '' : n * (i + 1)}</span>`).join('')}</div></div>`;
      }).join('');
      html += footer();
      if (key) html += `<div class="page-break">` + header(MM.t('ws.key', { title: MM.t('ws.skip') }), '') + tables.map(n => `<div class="prob" style="font-family:var(--display);font-size:1.1rem;margin:.4rem 0"><b>${MM.t('ws.countBy', { n })}</b> ${Array.from({ length: 10 }, (_, i) => n * (i + 1)).join(MM.sep)}</div>`).join('') + '</div>';
    }

    sheet.innerHTML = html;
  }
  function answerKey(title, rows) {
    return `<div class="page-break">${header(title, MM.t('ws.forParents'))}<div class="prob-grid h" style="font-size:1rem">${rows.join('')}</div></div>`;
  }
  function chartTable(full) {
    let h = '<table class="sheet-chart"><tr><th>×</th>' + Array.from({ length: 10 }, (_, i) => `<th>${i + 1}</th>`).join('') + '</tr>';
    for (let r = 1; r <= 10; r++) h += `<tr><th>${r}</th>` + Array.from({ length: 10 }, (_, i) => `<td>${full ? r * (i + 1) : ''}</td>`).join('') + '</tr>';
    return h + '</table>';
  }

  toggleFields();
  generate();
})();

/* Animated "video" episodes for tables 1–10, built live in the browser. */
(function () {
  'use strict';
  const $ = (id) => document.getElementById(id);

  // Text for names/titles/tricks lives in i18n.js (T.en / T.ar); only the emoji is fixed here.
  const EMOJI = { 1: '⭐', 2: '🍎', 3: '🐸', 4: '🚗', 5: '🖐️', 6: '🐝', 7: '🌈', 8: '🐙', 9: '🎈', 10: '🍩' };
  const EPISODES = {};
  for (let n = 1; n <= 10; n++) EPISODES[n] = { emoji: EMOJI[n], name: MM.t('ep.' + n + '.name'), title: MM.t('ep.' + n + '.title'), trick: MM.t('ep.' + n + '.trick') };
  const SPEEDS = [{ label: MM.t('speed.slow'), ms: 4200 }, { label: MM.t('speed.normal'), ms: 2800 }, { label: MM.t('speed.fast'), ms: 1600 }];

  const state = { table: 2, step: 0, playing: false, timer: null, speedIdx: 1, voice: MM.load('voice', false), done: false };

  /* ---------- Episode list ---------- */
  const list = $('episodes');
  for (let n = 1; n <= 10; n++) {
    const ep = EPISODES[n];
    const b = document.createElement('button');
    b.className = 'episode'; b.id = 'ep-' + n;
    b.innerHTML = `<div class="thumb" style="background:var(--n${n})">${ep.emoji}</div><b>${MM.t('ep.card.title', { n })}</b><small>${MM.t('ep.card.sub', { n, title: ep.title })}</small>`;
    b.addEventListener('click', () => loadTable(n, true));
    list.appendChild(b);
  }

  /* ---------- Rendering ---------- */
  function caption(n, k) {
    const ep = EPISODES[n];
    const skip = Array.from({ length: k }, (_, i) => n * (i + 1)).join(MM.sep);
    if (k === 1) return MM.t('stage.cap1', { n, name: ep.name });
    return MM.t('stage.cap', { k, n, skip, p: n * k });
  }
  function render() {
    const n = state.table, k = state.step, ep = EPISODES[n];
    $('stage-title').textContent = MM.t('stage.title', { n, title: ep.title });
    $('trick-text').textContent = ep.trick;
    document.querySelectorAll('.episode').forEach(e => e.classList.toggle('playing', e.id === 'ep-' + n));
    const rows = $('stage-rows'); rows.innerHTML = '';
    const strip = $('skip-strip'); strip.innerHTML = '';
    for (let i = 1; i <= 10; i++) { const s = document.createElement('span'); s.textContent = n * i; if (i <= k) s.classList.add('on'); strip.appendChild(s); }

    if (k === 0) {
      $('stage-eq').innerHTML = MM.t('stage.introEq', { n });
      rows.innerHTML = `<div class="stage-done"><div style="font-size:4rem">${ep.emoji}</div><div style="font-family:var(--display);font-size:1.3rem;font-weight:600">${MM.t('stage.starring', { name: ep.name })}</div></div>`;
      $('stage-caption').textContent = MM.t('stage.press', { n, title: ep.title });
    } else if (k <= 10) {
      $('stage-eq').innerHTML = `${n} × ${k} = <span class="ans">${n * k}</span>`;
      for (let r = 0; r < k; r++) {
        const row = document.createElement('div'); row.className = 'stage-row';
        for (let c = 0; c < n; c++) {
          const it = document.createElement('span'); it.className = 'stage-item'; it.textContent = ep.emoji;
          // Only animate the newest row so replays don't flash everything
          it.style.animationDelay = (r === k - 1 ? c * .06 : 0) + 's';
          if (r !== k - 1) it.style.animation = 'none';
          row.appendChild(it);
        }
        rows.appendChild(row);
      }
      $('stage-caption').textContent = caption(n, k);
    } else {
      $('stage-eq').innerHTML = MM.t('stage.doneEq');
      rows.innerHTML = `<div class="stage-done"><div style="font-size:3.5rem">${ep.emoji}${ep.emoji}${ep.emoji}</div>
        <div style="font-family:var(--display);font-size:1.3rem;font-weight:600">${MM.t('stage.doneMsg', { n })}</div>
        <div style="display:flex;gap:.6rem;flex-wrap:wrap;justify-content:center;margin-top:.5rem">
          <a class="btn btn-sm btn-coral" href="games.html#race">${MM.t('stage.race')}</a>
          ${n < 10 ? `<button class="btn btn-sm btn-sky" id="btn-next-ep">${MM.t('stage.nextEp')}</button>` : ''}
        </div></div>`;
      $('stage-caption').textContent = MM.t('stage.doneCap', { n });
      const nx = $('btn-next-ep'); if (nx) nx.addEventListener('click', () => loadTable(n + 1, true));
      strip.querySelectorAll('span').forEach(s => s.classList.add('on'));
    }
    $('progress-fill').style.width = (Math.min(k, 10) / 10 * 100) + '%';
    $('scene-label').textContent = k === 0 ? MM.t('scene.intro') : k > 10 ? MM.t('scene.end') : MM.t('scene', { k });
    $('btn-play').textContent = state.playing ? '⏸' : '▶';
    speak($('stage-caption').textContent);
  }

  /* ---------- Voice (Web Speech API, optional) ---------- */
  function speak(text) {
    if (!state.voice || !('speechSynthesis' in window)) return;
    try {
      speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text.replace(/×/g, ' ' + MM.t('speech.times') + ' '));
      u.lang = MM.rtl ? 'ar-SA' : 'en-US';
      u.rate = .95; u.pitch = 1.15;
      speechSynthesis.speak(u);
    } catch (e) { /* ignore */ }
  }
  function paintVoice() { $('btn-voice').textContent = state.voice ? MM.t('voice.on') : MM.t('voice.off'); }
  $('btn-voice').addEventListener('click', () => {
    state.voice = !state.voice; MM.save('voice', state.voice); paintVoice();
    if (state.voice) speak($('stage-caption').textContent); else if ('speechSynthesis' in window) speechSynthesis.cancel();
  });
  paintVoice();

  /* ---------- Playback ---------- */
  function tick() {
    if (state.step > 10) { pause(); return; }
    state.step++;
    render();
    if (state.step > 10) { pause(); MM.confetti(60); MM.sound.win(); markWatched(); }
  }
  function play() {
    if (state.step > 10) state.step = 0;
    state.playing = true; render();
    clearInterval(state.timer);
    state.timer = setInterval(tick, SPEEDS[state.speedIdx].ms);
    if (state.step === 0) setTimeout(() => { if (state.playing) tick(); }, 900);
  }
  function pause() { state.playing = false; clearInterval(state.timer); $('btn-play').textContent = '▶'; }
  function markWatched() {
    const w = MM.load('watched', {}); w[state.table] = (w[state.table] || 0) + 1; MM.save('watched', w);
  }
  $('btn-play').addEventListener('click', () => state.playing ? pause() : play());
  $('btn-next').addEventListener('click', () => { pause(); if (state.step <= 10) state.step++; render(); });
  $('btn-prev').addEventListener('click', () => { pause(); if (state.step > 0) state.step--; render(); });
  $('btn-speed').addEventListener('click', () => {
    state.speedIdx = (state.speedIdx + 1) % SPEEDS.length;
    $('btn-speed').textContent = SPEEDS[state.speedIdx].label;
    if (state.playing) play();
  });
  $('btn-speed').textContent = SPEEDS[state.speedIdx].label;
  $('progress').addEventListener('click', (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    state.step = Math.max(1, Math.min(10, Math.ceil((e.clientX - r.left) / r.width * 10)));
    pause(); render();
  });
  document.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT') return;
    if (e.code === 'Space') { e.preventDefault(); state.playing ? pause() : play(); }
    if (e.code === 'ArrowRight') $('btn-next').click();
    if (e.code === 'ArrowLeft') $('btn-prev').click();
  });

  function loadTable(n, autoplay) {
    pause(); state.table = n; state.step = 0;
    history.replaceState(null, '', '#table-' + n);
    render();
    if (autoplay) { play(); $('stage').scrollIntoView({ behavior: 'smooth', block: 'nearest' }); }
  }

  /* ---------- Chart ---------- */
  const chart = $('mchart');
  let html = '<tr><th>×</th>' + Array.from({ length: 10 }, (_, i) => `<th>${i + 1}</th>`).join('') + '</tr>';
  for (let r = 1; r <= 10; r++) {
    html += `<tr><th>${r}</th>` + Array.from({ length: 10 }, (_, i) => `<td data-r="${r}" data-c="${i + 1}" class="${r === i + 1 ? 'diag' : ''}">${r * (i + 1)}</td>`).join('') + '</tr>';
  }
  chart.innerHTML = html;
  function highlight(td) {
    chart.querySelectorAll('td').forEach(x => x.classList.remove('hl', 'focus'));
    if (!td) return;
    const r = +td.dataset.r, c = +td.dataset.c;
    chart.querySelectorAll('td').forEach(x => {
      if ((+x.dataset.r === r && +x.dataset.c <= c) || (+x.dataset.c === c && +x.dataset.r <= r)) x.classList.add('hl');
    });
    td.classList.add('focus');
    $('chart-readout').textContent = MM.t('chart.result', { r, c, p: r * c });
  }
  chart.addEventListener('mouseover', (e) => { if (e.target.tagName === 'TD') highlight(e.target); });
  chart.addEventListener('click', (e) => { if (e.target.tagName === 'TD') { highlight(e.target); MM.sound.tick(); } });

  /* ---------- Boot ---------- */
  const m = location.hash.match(/table-(\d+)/);
  const start = m && +m[1] >= 1 && +m[1] <= 10 ? +m[1] : 2;
  loadTable(start, false);
})();

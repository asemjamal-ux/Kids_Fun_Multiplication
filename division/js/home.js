/* Home page: quick challenge widget and greeting. */
/* Quick challenge widget */
(function () {
  let f, streak = 0, best = MM.load('qc_best', 0), locked = false;
  const q = document.getElementById('qc-question'), opts = document.getElementById('qc-options');
  const sStreak = document.getElementById('qc-streak'), sBest = document.getElementById('qc-best'), msg = document.getElementById('qc-msg');
  sBest.textContent = best;
  // After i18n has applied static text, so the greeting wins in both languages
  document.addEventListener('DOMContentLoaded', () => { if (MM.name) document.getElementById('hero-eyebrow').textContent = MM.t('hero.hi', { name: MM.name }); });
  const cheers = MM.t('qc.cheers');
  function next() {
    locked = false;
    f = MM.divFact([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    q.textContent = `${f.p} ÷ ${f.n} = ?`;
    opts.innerHTML = '';
    MM.divDistractors(f.n, f.q).forEach(v => {
      const btn = document.createElement('button');
      btn.className = 'option'; btn.textContent = v;
      btn.addEventListener('click', () => answer(btn, v));
      opts.appendChild(btn);
    });
  }
  function answer(btn, v) {
    if (locked) return; locked = true;
    const right = v === f.q;
    MM.recordFact(f.n, f.q, right);
    if (right) {
      btn.classList.add('correct'); MM.sound.good(); streak++;
      msg.textContent = MM.pick(cheers);
      if (streak > best) { best = streak; MM.save('qc_best', best); sBest.textContent = best; }
      if (streak === 5) { msg.textContent = MM.t('qc.five'); MM.confetti(80); MM.sound.win(); }
    } else {
      btn.classList.add('wrong'); MM.sound.bad(); streak = 0;
      msg.textContent = MM.t('qc.wrong', { p: f.p, n: f.n, q: f.q });
      [...opts.children].forEach(o => { if (+o.textContent === f.q) o.classList.add('correct'); });
    }
    sStreak.textContent = streak;
    setTimeout(next, right ? 700 : 1600);
  }
  next();
})();

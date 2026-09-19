/* Internationalisation: English (default) + Arabic (RTL).
   Loaded in <head> so the document direction is set before first paint.
   - Static text: elements carry data-i18n="key" (textContent), data-i18n-html="key" (innerHTML),
     data-i18n-placeholder / data-i18n-title. English lives in the HTML; only Arabic is applied.
   - Dynamic text: scripts call MM.t('key', {vars}); English strings live in T.en. */
(function () {
  'use strict';
  window.MM = window.MM || {};

  function load(key, fallback) { try { const v = localStorage.getItem('mm_' + key); return v === null ? fallback : JSON.parse(v); } catch (e) { return fallback; } }
  function save(key, value) { try { localStorage.setItem('mm_' + key, JSON.stringify(value)); } catch (e) { } }

  const T = {};

  /* ---------- English (dynamic strings only) ---------- */
  T.en = {
    'lang.switch': 'عربي',
    'sound.on': '🔊 Sound on', 'sound.off': '🔇 Sound off',

    'qc.cheers': ['Brilliant!', 'Yes! 🎉', 'You got it!', 'Super smart!', 'Nailed it!', 'Wow!'],
    'qc.five': '5 in a row! 🌟 Keep going!',
    'qc.wrong': 'Not quite — {a} × {b} = {c}. Try the next one!',

    'race.title.best': 'New best score!', 'race.title.over': 'Race over!',
    'race.body': 'You scored <b>{s}</b> with <b>{acc}%</b> accuracy. {stars}<br>{tail}',
    'race.beat': 'You beat your record!', 'race.bestSoFar': 'Best so far: {b}',
    'bingo.free': 'FREE', 'bingo.win.title': 'BINGO!',
    'bingo.win.body': "Five in a row in <b>{c}</b> calls! That's win number <b>{w}</b>.",
    'puzzle.type.missing': 'Missing number', 'puzzle.type.tf': 'True or false?', 'puzzle.type.which': 'Which one makes…', 'puzzle.type.odd': 'Odd one out',
    'puzzle.q.which': 'Which equals {n}?', 'puzzle.q.not': 'Which one is NOT {n}?',
    'puzzle.true': '✅ True', 'puzzle.false': '❌ False', 'puzzle.remember': 'Remember: ',
    'puzzle.explainNot': '{odd} = {v}, not {target}',
    'puzzle.title.best': 'New record!', 'puzzle.title.over': 'Out of hearts!',
    'puzzle.body': 'You solved <b>{s}</b> {word}. {tail}', 'puzzle.one': 'puzzle', 'puzzle.many': 'puzzles',
    'puzzle.beat': 'That is your best ever!', 'puzzle.bestSoFar': 'Best: {b}',

    'speed.slow': '🐢 Slow', 'speed.normal': '🐇 Normal', 'speed.fast': '🚀 Fast',
    'voice.on': '🔊 Voice on', 'voice.off': '🔈 Voice off',
    'scene': 'Scene {k} / 10', 'scene.intro': 'Intro', 'scene.end': 'The end',
    'ep.card.title': '{n} × table', 'ep.card.sub': 'Ep. {n} · {title}',
    'stage.title': 'Episode {n} · The {n} Times Table · {title}',
    'stage.introEq': 'The <span class="ans">{n}</span> times table',
    'stage.starring': 'Starring: the {name}!',
    'stage.press': 'Press ▶ to start Episode {n}: {title}',
    'stage.cap1': "{n} times 1 is one group of {n} {name}. That's just {n}!",
    'stage.cap': '{k} groups of {n}. Count by {n}s: {skip}. So {n} × {k} = {p}!',
    'stage.doneEq': 'You did it! <span class="ans">🎉</span>',
    'stage.doneMsg': "That's the whole {n} times table!",
    'stage.race': '🚀 Race this table', 'stage.nextEp': 'Next episode ▶',
    'stage.doneCap': 'Great watching! Now try the memory trick below, or race the {n} times table.',
    'chart.result': '{r} × {c} = {p}   (and {c} × {r} = {p} too!)',
    'speech.times': 'times',
    'ep.1.name': 'stars', 'ep.1.title': 'One of Everything', 'ep.1.trick': 'Anything times 1 stays exactly the same. 1 × 7 is just… 7!',
    'ep.2.name': 'apples', 'ep.2.title': 'The Doubling Dragon', 'ep.2.trick': 'Times 2 means DOUBLE it. 2 × 6 = 6 + 6 = 12. The answers are all even numbers.',
    'ep.3.name': 'frogs', 'ep.3.title': 'Triple Hop', 'ep.3.trick': 'Times 3 is double it, then add one more. 3 × 4: 4 + 4 = 8, then 8 + 4 = 12.',
    'ep.4.name': 'cars', 'ep.4.title': 'Double-Double', 'ep.4.trick': 'Times 4 is double, then double again! 4 × 6: 6 → 12 → 24.',
    'ep.5.name': 'hands', 'ep.5.title': 'High Fives', 'ep.5.trick': 'Times 5 answers always end in 5 or 0. Count 5, 10, 15, 20… like a clock!',
    'ep.6.name': 'bees', 'ep.6.title': 'Busy Bees', 'ep.6.trick': 'Times 6 is times 5 plus one more group. 6 × 7 = 35 + 7 = 42.',
    'ep.7.name': 'rainbows', 'ep.7.title': 'Lucky Sevens', 'ep.7.trick': 'Remember the rhyme: "5, 6, 7, 8 — 56 is 7 × 8!" And 7 × 7 = 49 (say "seven-seven-forty-nine").',
    'ep.8.name': 'octopuses', 'ep.8.title': 'Eight Wiggly Arms', 'ep.8.trick': 'Times 8 is double-double-double! 8 × 3: 3 → 6 → 12 → 24.',
    'ep.9.name': 'balloons', 'ep.9.title': 'The Finger Trick', 'ep.9.trick': 'Hold up 10 fingers. For 9 × 4, fold down finger number 4. Fingers on the left = tens (3), fingers on the right = ones (6). 36!',
    'ep.10.name': 'doughnuts', 'ep.10.title': 'Just Add a Zero', 'ep.10.trick': 'Times 10? Just put a 0 on the end. 10 × 7 = 70. Easiest table ever!',

    'ws.practice': 'Multiplication Practice', 'ws.name': 'Name:', 'ws.date': 'Date:', 'ws.score': 'Score: ____ / ____',
    'ws.key': '{title} — Answer Key', 'ws.forParents': 'For parents and teachers',
    'ws.missing': 'Missing Number Puzzles', 'ws.missingSub': 'Fill in the missing number',
    'ws.chartFull': 'Multiplication Chart 1–10', 'ws.chartBlank': 'Fill in the Multiplication Chart',
    'ws.chartFullSub': 'Keep this handy while you practise', 'ws.chartBlankSub': 'Write the answer in every square',
    'ws.diag': 'Squares on the diagonal (1, 4, 9, 16…) are "square numbers".',
    'ws.hint': 'Hint: start with the easy rows (1, 2, 5, 10) and the rest get easier!',
    'ws.time': 'Time taken: ____ min',
    'ws.skip': 'Skip Counting', 'ws.skipSub': 'Fill in the missing numbers as you count along', 'ws.countBy': 'Count by {n}s:',
    'ws.allTables': 'All tables 1–10', 'ws.tables': 'Tables: ', 'ws.footer': 'Fun with Multiplication! · Times tables 1–10',

    'p.notTried': 'not tried', 'p.accOf': '{acc}% of {total}',
    'p.noTrouble': 'Nothing yet — play a few games and tricky facts will appear here.',
    'p.resetConfirm': 'Reset all saved scores and progress on this device?',

    /* Player name & prizes */
    'name.q': "What's your name?", 'name.ph': 'Type your name', 'name.go': "Let's go! 🚀",
    'name.hi': 'Hi, {name}! 👋', 'name.change': 'Change name',
    'name.stars': '{n} stars', 'name.prizes': '{n} prizes',
    'name.next': '{n} more correct answers until your next prize!',
    'prize.title': '🎁 A prize for {name}!', 'prize.titleAnon': '🎁 You won a prize!',
    'prize.body': 'You earned a new sticker: {sticker}', 'prize.btn': 'Yay! 🎉',
    'prize.box': 'Prize box', 'prize.locked': 'Locked — {n} stars to go',
    'sticker.0': 'Unicorn', 'sticker.1': 'Rocket', 'sticker.2': 'Dragon', 'sticker.3': 'Ice cream', 'sticker.4': 'T-Rex', 'sticker.5': 'Rainbow',
    'sticker.6': 'Trophy', 'sticker.7': 'Butterfly', 'sticker.8': 'Dolphin', 'sticker.9': 'Guitar', 'sticker.10': 'Cupcake', 'sticker.11': 'Panda',
    'sticker.12': 'UFO', 'sticker.13': 'Crown', 'sticker.14': 'Fox', 'sticker.15': 'Carousel', 'sticker.16': 'Turtle', 'sticker.17': 'Pizza',
    'sticker.18': 'Lion', 'sticker.19': 'Fireworks', 'sticker.20': 'Octopus', 'sticker.21': 'Lollipop', 'sticker.22': 'Bronto', 'sticker.23': 'Diamond',

    /* New games */
    'games.h1.named': 'Pick a game, {name}! 🎮',
    'memory.win.title': 'All matched!', 'memory.win.body': 'You found all {p} pairs in <b>{m}</b> moves! {tail}',
    'memory.best': 'Best: {b} moves', 'memory.beat': 'New best!',
    'balloon.over': 'Game over!', 'balloon.body': 'You popped <b>{s}</b> {word}! {tail}', 'balloon.one': 'balloon', 'balloon.many': 'balloons',
    'hunt.over': "Time's up!", 'hunt.body': 'You cleared <b>{r}</b> rounds and found <b>{f}</b> tiles! {tail}',
    'generic.beat': 'New record!', 'generic.best': 'Best: {b}',
    'hero.hi': 'Welcome back, {name}! 👋', 'who.h2': "Who's playing?",
  };

  /* ---------- Arabic ---------- */
  T.ar = {
    /* Player name & prizes */
    'name.q': 'ما اسمك؟', 'name.ph': 'اكتب اسمك', 'name.go': 'هيا بنا! 🚀',
    'name.hi': 'أهلاً {name}! 👋', 'name.change': 'تغيير الاسم',
    'name.stars': '{n} نجمة', 'name.prizes': '{n} جائزة', 'stat.stars': 'نجوم',
    'name.next': '{n} إجابات صحيحة أخرى حتى جائزتك التالية!',
    'prize.title': '🎁 جائزة لـ{name}!', 'prize.titleAnon': '🎁 لقد ربحت جائزة!',
    'prize.body': 'حصلت على ملصق جديد: {sticker}', 'prize.btn': 'رائع! 🎉',
    'prize.box': 'صندوق الجوائز', 'prize.locked': 'مقفل — تبقّى {n} نجمة',
    'sticker.0': 'يونيكورن', 'sticker.1': 'صاروخ', 'sticker.2': 'تنين', 'sticker.3': 'آيس كريم', 'sticker.4': 'ديناصور', 'sticker.5': 'قوس قزح',
    'sticker.6': 'كأس', 'sticker.7': 'فراشة', 'sticker.8': 'دلفين', 'sticker.9': 'غيتار', 'sticker.10': 'كب كيك', 'sticker.11': 'باندا',
    'sticker.12': 'طبق طائر', 'sticker.13': 'تاج', 'sticker.14': 'ثعلب', 'sticker.15': 'حصان دوّار', 'sticker.16': 'سلحفاة', 'sticker.17': 'بيتزا',
    'sticker.18': 'أسد', 'sticker.19': 'ألعاب نارية', 'sticker.20': 'أخطبوط', 'sticker.21': 'مصاصة', 'sticker.22': 'برونتو', 'sticker.23': 'ماسة',
    'prizes.h2': '🎁 صندوق الجوائز', 'prizes.lead': 'كل إجابة صحيحة = نجمة ⭐. كل 10 نجوم = ملصق جديد!',
    'who.h2': 'من يلعب؟', 'hero.hi': 'أهلاً بعودتك يا {name}! 👋',

    /* New games */
    'games.h1.named': 'اختر لعبة يا {name}! 🎮',
    'games.tab.memory': '🃏 لعبة الذاكرة', 'games.tab.balloon': '🎈 فرقعة البالونات', 'games.tab.hunt': '🔍 صيد الأرقام',
    'memory.lead': 'اقلب بطاقتين. طابق كل سؤال مع إجابته!', 'memory.start': 'اخلط والعب! 🃏',
    'stat.moves': 'محاولات', 'stat.pairs': 'أزواج',
    'memory.win.title': 'طابقت الكل!', 'memory.win.body': 'وجدت كل الأزواج الـ{p} في <b>{m}</b> محاولة! {tail}',
    'memory.best': 'الأفضل: {b} محاولة', 'memory.beat': 'رقم قياسي جديد!',
    'balloon.lead': 'فرقع البالون الذي يحمل الإجابة الصحيحة قبل أن يطير! ثلاث أخطاء وتنتهي اللعبة.', 'balloon.start': 'ابدأ الفرقعة! 🎈',
    'stat.popped': 'مفرقعة', 'balloon.over': 'انتهت اللعبة!', 'balloon.body': 'فرقعت <b>{s}</b> {word}! {tail}', 'balloon.one': 'بالوناً واحداً', 'balloon.many': 'بالوناً',
    'hunt.lead': 'اعثر على كل بطاقة تساوي الرقم المطلوب. اضغط عليها كلها قبل انتهاء الوقت!', 'hunt.start': 'ابدأ الصيد! 🔍',
    'hunt.target': 'اعثر على كل ما يساوي', 'stat.found': 'وجدت', 'stat.round': 'الجولة',
    'hunt.over': 'انتهى الوقت!', 'hunt.body': 'أكملت <b>{r}</b> جولات ووجدت <b>{f}</b> بطاقة! {tail}',
    'generic.beat': 'رقم قياسي جديد!', 'generic.best': 'الأفضل: {b}',
    'lang.switch': 'English',
    'sound.on': '🔊 الصوت مفعّل', 'sound.off': '🔇 الصوت مغلق',
    'brand': 'مرح مع جدول الضرب!',
    'nav.home': '🏠 الرئيسية', 'nav.games': '🎮 الألعاب', 'nav.videos': '📺 الفيديوهات', 'nav.worksheets': '📝 أوراق العمل', 'nav.parents': '👩‍🏫 الأهل والمعلمون',
    'nav.menu': 'فتح القائمة',
    'footer.made': 'مرح مع جدول الضرب! — صُنع بحب ❤️ للأطفال الفضوليين من 6 إلى 12 سنة.',
    'footer.grownups': 'للكبار', 'footer.back': 'العودة إلى المرح',

    /* Home */
    'title.home': 'مرح مع جدول الضرب! — تعلّم جداول الضرب من 1 إلى 10',
    'hero.eyebrow': 'جداول الضرب من 1 إلى 10',
    'hero.h1': 'مرح مع <span style="white-space:nowrap"><span class="wobble">جدول</span> <span class="swing">الضرب!</span></span>',
    'hero.lead': 'العب الألعاب، وشاهد القصص المتحركة، واطبع أوراق العمل — حتى يقفز ناتج 7 × 8 إلى ذهنك أسرع من قولك «ستة وخمسون».',
    'hero.play': '🎮 العب لعبة', 'hero.watch': '📺 شاهد فيديو', 'hero.print': '📝 اطبع ورقة عمل',
    'pick.eyebrow': 'ابدأ من هنا', 'pick.h2': 'اختر جدول ضرب', 'pick.lead': 'اضغط على رقم لمشاهدة فيديوه، ثم تسابق معه في لعبة!', 'pick.chip': 'جدول',
    'ways.eyebrow': 'ثلاث طرق للتعلّم', 'ways.h2': 'العبها. شاهدها. اكتبها.', 'ways.popular': 'الأكثر شعبية',
    'ways.games.h3': 'ألعاب الضرب',
    'ways.games.p': 'تسابق مع الوقت في <b>سباق جدول الضرب</b>، أو اصرخ <b>بينغو!</b>، أو حُلّ <b>ألغاز الرياضيات</b> الصعبة. اجمع النجوم وتغلّب على أفضل نتيجة لك.',
    'ways.games.btn': 'هيا نلعب ←',
    'ways.videos.h3': 'فيديوهات متحركة',
    'ways.videos.p': 'عشر حلقات قصيرة — واحدة لكل جدول. شاهد مجموعات التفاح والضفادع والسيارات وهي تبني كل إجابة، مع راوٍ يقرأ بصوت عالٍ.',
    'ways.videos.btn': 'شاهد الآن ←',
    'ways.ws.h3': 'أوراق عمل للطباعة',
    'ways.ws.p': 'اصنع أوراق التدريب الخاصة بك في ثوانٍ: اختر الجداول، وعدد المسائل، ثم اطبع. مع مفاتيح الإجابات للكبار.',
    'ways.ws.btn': 'اصنع ورقة ←',
    'qc.tag': '⚡ تحدٍّ سريع', 'qc.h2': 'هل تستطيع الإجابة على 5 متتالية؟', 'stat.streak': 'متتالية', 'stat.best': 'الأفضل',
    'how.watch.h3': '1️⃣ شاهد', 'how.watch.p': 'ابدأ بحلقة. افهم <em>لماذا</em> 4 × 3 يساوي 12 — ثلاثة صفوف من أربع سيارات — بدلاً من حفظها فقط.',
    'how.play.h3': '2️⃣ العب', 'how.play.p': 'تحوّل الألعاب التدريب إلى سباق. جولات قصيرة، وتشجيع كبير، وأفضل نتيجة تتحدّاها غداً.',
    'how.practise.h3': '3️⃣ تدرّب', 'how.practise.p': 'اطبع ورقة عمل لطاولة المطبخ. عشر دقائق يومياً تكفي.',
    'banner.h2': 'الأهل والمعلمون', 'banner.p': 'نصائح، وترتيب مقترح للتعلّم، وحيل للحفظ، ومتتبّع للتقدّم.', 'banner.btn': 'اقرأ الدليل ←',
    'qc.cheers': ['رائع!', 'نعم! 🎉', 'أصبت!', 'ذكي جداً!', 'ممتاز!', 'واو!'],
    'qc.five': '5 متتالية! 🌟 واصل!',
    'qc.wrong': 'ليس تماماً — {a} × {b} = {c}. جرّب التالية!',

    /* Games */
    'title.games': 'ألعاب الضرب — مرح مع جدول الضرب!',
    'games.eyebrow': 'منطقة الألعاب', 'games.h1': 'اختر لعبة 🎮',
    'games.tab.race': '🚀 سباق جدول الضرب', 'games.tab.bingo': '🎯 بينغو الضرب', 'games.tab.puzzle': '🧩 ألغاز الرياضيات',
    'race.lead': 'أجب على أكبر عدد ممكن خلال 60 ثانية. زوّد الصاروخ بالوقود بإجاباتك الصحيحة!',
    'race.which': 'أي الجداول تريد التدرّب عليها؟', 'race.all': 'كل الجداول', 'race.easy': 'سهل (1، 2، 5، 10)', 'race.hard': 'صعب (6، 7، 8، 9)',
    'race.start': 'ابدأ السباق! 🏁', 'race.best': 'أفضل نتيجة:',
    'stat.score': 'النقاط', 'stat.seconds': 'ثانية', 'btn.stop': 'توقف',
    'bingo.lead': 'مالتي ينادي بسؤال. ابحث عن الإجابة في بطاقتك واضغط عليها. اجمع خمسة في صف واحد لتفوز!',
    'bingo.level': 'اختر مستواك', 'bingo.easy': '🌱 سهل — الجداول من 1 إلى 5', 'bingo.mixed': '🌼 مختلط — الجداول من 1 إلى 10', 'bingo.hard': '🔥 صعب — الجداول من 6 إلى 10',
    'bingo.start': 'وزّع بطاقتي! 🃏', 'stat.calls': 'نداءات', 'stat.marked': 'مُعلَّمة', 'bingo.nope': '🙅 ليس في بطاقتي', 'bingo.new': 'بطاقة جديدة',
    'puzzle.lead': 'أرقام مفقودة، صح أم خطأ، والمختلف بينها. لديك ثلاثة قلوب — إلى أين تصل؟',
    'puzzle.start': 'ابدأ حل الألغاز! 🧠', 'puzzle.best': 'الأفضل:', 'puzzle.unit': 'ألغاز', 'stat.solved': 'محلولة', 'stat.lives': 'القلوب',
    'modal.again': 'العب مجدداً', 'modal.close': 'العودة إلى الألعاب',
    'race.title.best': 'أفضل نتيجة جديدة!', 'race.title.over': 'انتهى السباق!',
    'race.body': 'أحرزت <b>{s}</b> بدقة <b>{acc}%</b>. {stars}<br>{tail}',
    'race.beat': 'لقد حطّمت رقمك القياسي!', 'race.bestSoFar': 'الأفضل حتى الآن: {b}',
    'bingo.free': 'مجاني', 'bingo.win.title': 'بينغو!',
    'bingo.win.body': 'خمسة في صف واحد خلال <b>{c}</b> نداءً! هذا فوزك رقم <b>{w}</b>.',
    'puzzle.type.missing': 'الرقم المفقود', 'puzzle.type.tf': 'صح أم خطأ؟', 'puzzle.type.which': 'أيها يساوي…', 'puzzle.type.odd': 'المختلف بينها',
    'puzzle.q.which': 'أيها يساوي {n}؟', 'puzzle.q.not': 'أيها لا يساوي {n}؟',
    'puzzle.true': '✅ صح', 'puzzle.false': '❌ خطأ', 'puzzle.remember': 'تذكّر: ',
    'puzzle.explainNot': '{odd} = {v}، وليس {target}',
    'puzzle.title.best': 'رقم قياسي جديد!', 'puzzle.title.over': 'نفدت القلوب!',
    'puzzle.body': 'لقد حللت <b>{s}</b> {word}. {tail}', 'puzzle.one': 'لغزاً', 'puzzle.many': 'لغزاً',
    'puzzle.beat': 'هذا أفضل ما حققته!', 'puzzle.bestSoFar': 'الأفضل: {b}',

    /* Videos */
    'title.videos': 'فيديوهات متحركة — مرح مع جدول الضرب!',
    'videos.eyebrow': 'مسرح مالتي للضرب', 'videos.h1': 'فيديوهات متحركة 📺',
    'videos.lead': 'كل جدول حلقة قصيرة من عشرة مشاهد. اضغط تشغيل وشاهد الإجابة تتكوّن مجموعة بعد مجموعة.',
    'videos.press': 'اضغط ▶ للبدء!',
    'ctrl.prev': 'المشهد السابق', 'ctrl.play': 'تشغيل / إيقاف', 'ctrl.next': 'المشهد التالي', 'ctrl.speed': 'سرعة التشغيل', 'ctrl.voice': 'قراءة التعليقات بصوت عالٍ', 'ctrl.jump': 'انتقل إلى مشهد',
    'trick.label': '🧠 حيلة للحفظ:', 'episodes.h3': 'الحلقات',
    'chart.eyebrow': 'استكشف', 'chart.h2': 'جدول الضرب الكبير', 'chart.lead': 'مرّر أو اضغط على أي مربع لإضاءة صفه وعموده.', 'chart.readout': 'اضغط على مربع! 👆',
    'speed.slow': '🐢 بطيء', 'speed.normal': '🐇 عادي', 'speed.fast': '🚀 سريع',
    'voice.on': '🔊 الراوي مفعّل', 'voice.off': '🔈 الراوي مغلق',
    'scene': 'المشهد {k} / 10', 'scene.intro': 'المقدمة', 'scene.end': 'النهاية',
    'ep.card.title': 'جدول {n}', 'ep.card.sub': 'الحلقة {n} · {title}',
    'stage.title': 'الحلقة {n} · جدول {n} · {title}',
    'stage.introEq': 'جدول <span class="ans">{n}</span>',
    'stage.starring': 'بطولة: {name}!',
    'stage.press': 'اضغط ▶ لبدء الحلقة {n}: {title}',
    'stage.cap1': '{n} × 1 يعني مجموعة واحدة من {n} {name}. أي {n} فقط!',
    'stage.cap': '{k} مجموعات من {n}. عُدّ بالـ{n}: {skip}. إذاً {n} × {k} = {p}!',
    'stage.doneEq': 'أحسنت! <span class="ans">🎉</span>',
    'stage.doneMsg': 'هذا هو جدول {n} كاملاً!',
    'stage.race': '🚀 تسابق مع هذا الجدول', 'stage.nextEp': 'الحلقة التالية ◀',
    'stage.doneCap': 'مشاهدة رائعة! جرّب الآن حيلة الحفظ أدناه، أو تسابق مع جدول {n}.',
    'chart.result': '{r} × {c} = {p}   (و{c} × {r} = {p} أيضاً!)',
    'speech.times': 'في',
    'ep.1.name': 'النجوم', 'ep.1.title': 'واحد من كل شيء', 'ep.1.trick': 'أي رقم × 1 يبقى كما هو تماماً. 1 × 7 يساوي… 7!',
    'ep.2.name': 'التفاح', 'ep.2.title': 'تنين المضاعفة', 'ep.2.trick': 'الضرب في 2 يعني المضاعفة. 2 × 6 = 6 + 6 = 12. كل النواتج أعداد زوجية.',
    'ep.3.name': 'الضفادع', 'ep.3.title': 'القفزة الثلاثية', 'ep.3.trick': 'الضرب في 3: ضاعف الرقم ثم أضفه مرة أخرى. 3 × 4: 4 + 4 = 8، ثم 8 + 4 = 12.',
    'ep.4.name': 'السيارات', 'ep.4.title': 'ضاعف مرتين', 'ep.4.trick': 'الضرب في 4: ضاعف ثم ضاعف مرة أخرى! 4 × 6: 6 ثم 12 ثم 24.',
    'ep.5.name': 'الأيدي', 'ep.5.title': 'الخمسات', 'ep.5.trick': 'نواتج الضرب في 5 تنتهي دائماً بـ5 أو 0. عُدّ 5، 10، 15، 20… مثل الساعة!',
    'ep.6.name': 'النحل', 'ep.6.title': 'النحل النشيط', 'ep.6.trick': 'الضرب في 6 هو الضرب في 5 زائد مجموعة أخرى. 6 × 7 = 35 + 7 = 42.',
    'ep.7.name': 'أقواس قزح', 'ep.7.title': 'السبعات المحظوظة', 'ep.7.trick': 'تذكّر: 7 × 8 = 56 (الأرقام 5، 6، 7، 8 بالترتيب!). و7 × 7 = 49.',
    'ep.8.name': 'الأخطبوطات', 'ep.8.title': 'ثماني أذرع متمايلة', 'ep.8.trick': 'الضرب في 8: ضاعف ثلاث مرات! 8 × 3: 3 ثم 6 ثم 12 ثم 24.',
    'ep.9.name': 'البالونات', 'ep.9.title': 'حيلة الأصابع', 'ep.9.trick': 'ارفع أصابعك العشرة. لحساب 9 × 4، اثنِ الإصبع رقم 4. الأصابع على اليسار = العشرات (3)، والأصابع على اليمين = الآحاد (6). الناتج 36!',
    'ep.10.name': 'الكعك', 'ep.10.title': 'أضف صفراً فقط', 'ep.10.trick': 'الضرب في 10؟ فقط أضف 0 في النهاية. 10 × 7 = 70. أسهل جدول على الإطلاق!',

    /* Worksheets */
    'title.worksheets': 'أوراق عمل للطباعة — مرح مع جدول الضرب!',
    'ws.eyebrow': 'صانع أوراق العمل', 'ws.h1': 'اطبع وتدرّب 📝',
    'ws.lead': 'أنشئ ورقة عمل في ثوانٍ. كل ورقة مختلفة، فيمكنك طباعة ورقة جديدة كل يوم.',
    'ws.type': 'نوع الورقة', 'ws.type.problems': 'مسائل تدريب', 'ws.type.missing': 'ألغاز الرقم المفقود', 'ws.type.chartBlank': 'جدول 10 × 10 فارغ (املأه)', 'ws.type.chartFull': 'جدول 10 × 10 كامل (مرجع)', 'ws.type.skip': 'ورقة العدّ بالقفز',
    'ws.tablesLabel': 'الجداول المطلوبة', 'ws.all': 'الكل', 'ws.none': 'لا شيء',
    'ws.count': 'كم عدد المسائل؟', 'ws.count12': '12 (سريع)', 'ws.count40': '40 (تحدٍّ)',
    'ws.layout': 'التنسيق', 'ws.layoutH': 'أفقي ( 3 × 4 = __ )', 'ws.layoutV': 'عمودي',
    'ws.childName': 'اسم الطفل (اختياري)', 'ws.namePh': 'مثال: مايا', 'ws.addKey': 'أضف صفحة مفتاح الإجابات',
    'ws.generate': '🎲 ورقة جديدة', 'ws.print': '🖨️ طباعة',
    'ws.tip': 'نصيحة: في نافذة الطباعة، اختر «حفظ كملف PDF» للاحتفاظ بنسخة.',
    'ws.practice': 'تدريب على الضرب', 'ws.name': 'الاسم:', 'ws.date': 'التاريخ:', 'ws.score': 'النتيجة: ____ / ____',
    'ws.key': '{title} — مفتاح الإجابات', 'ws.forParents': 'للأهل والمعلمين',
    'ws.missing': 'ألغاز الرقم المفقود', 'ws.missingSub': 'املأ الرقم المفقود',
    'ws.chartFull': 'جدول الضرب 1–10', 'ws.chartBlank': 'املأ جدول الضرب',
    'ws.chartFullSub': 'احتفظ به قريباً منك أثناء التدريب', 'ws.chartBlankSub': 'اكتب الإجابة في كل مربع',
    'ws.diag': 'المربعات على القطر (1، 4، 9، 16…) هي «الأعداد المربعة».',
    'ws.hint': 'تلميح: ابدأ بالصفوف السهلة (1، 2، 5، 10) وسيصبح الباقي أسهل!',
    'ws.time': 'الوقت المستغرق: ____ دقيقة',
    'ws.skip': 'العدّ بالقفز', 'ws.skipSub': 'املأ الأرقام المفقودة أثناء العدّ', 'ws.countBy': 'عُدّ بالـ{n}:',
    'ws.allTables': 'كل الجداول 1–10', 'ws.tables': 'الجداول: ', 'ws.footer': 'مرح مع جدول الضرب! · جداول الضرب 1–10',

    /* Parents */
    'title.parents': 'الأهل والمعلمون — مرح مع جدول الضرب!',
    'p.eyebrow': 'للكبار', 'p.h1': 'الأهل والمعلمون 👩‍🏫',
    'p.lead': 'كيف تستفيد من هذا الموقع إلى أقصى حد — في عشر دقائق يومياً، وبدون دموع.',
    'p.saved': 'محفوظ على هذا الجهاز', 'p.tracker': 'متتبّع التقدّم',
    'p.trackerLead': 'كل ما يلعبه طفلك على هذا المتصفح يُسجَّل هنا — بلا حسابات ولا تسجيل.',
    'p.raceBest': 'أفضل سباق', 'p.puzzleBest': 'أفضل ألغاز', 'p.bingoWins': 'مرات فوز بينغو', 'p.facts': 'حقائق أُجيب عنها', 'p.acc': 'الدقة',
    'p.mastery': 'الإتقان حسب الجدول',
    'p.legend': 'أخضر = 90%+ صحيح مع 10 محاولات على الأقل. أصفر = قيد التدريب. رمادي = لم يُجرَّب بعد.',
    'p.notTried': 'لم يُجرَّب', 'p.accOf': '{acc}% من {total}',
    'p.trouble': 'حقائق تحتاج إلى تدريب',
    'p.noTrouble': 'لا شيء بعد — العب بعض الألعاب وستظهر الحقائق الصعبة هنا.',
    'p.reset': 'إعادة تعيين التقدّم', 'p.resetConfirm': 'هل تريد إعادة تعيين كل النتائج والتقدّم المحفوظ على هذا الجهاز؟',
    'p.tips.eyebrow': 'نصائح', 'p.tips.h2': 'سبع طرق لاستخدام هذا الموقع جيداً',
    'p.tip1': '<b>شاهد أولاً، ثم العب.</b> ابدأ كل جدول جديد بـ<a href="videos.html" style="text-decoration:underline">حلقة الفيديو</a> الخاصة به. الأطفال الذين يتخيّلون «3 مجموعات من 4» نادراً ما ينسون الإجابة.',
    'p.tip2': '<b>القليل المتكرر أفضل من الكثير النادر.</b> عشر دقائق يومياً (فيديو واحد أو جولة لعب واحدة) أفضل بكثير من ساعة كاملة يوم العطلة.',
    'p.tip3': '<b>جدول واحد في كل مرة.</b> في السباق، ألغِ تحديد كل الجداول ما عدا الجدول الذي تتعلّمه وجدولاً تعرفه مسبقاً. أضف المزيد مع نمو الثقة.',
    'p.tip4': '<b>احتفل بالسرعة بعد الدقة.</b> يكافئ السباق الإجابات السريعة، لكن لا تبدأ به إلا بعد أن يجيب طفلك عن معظم الألغاز بشكل صحيح.',
    'p.tip5': '<b>قلها بصوت عالٍ.</b> فعّل زر الراوي في مشغّل الفيديو واطلب من طفلك تكرار كل جملة. السمع والرؤية والنطق معاً تبني ذاكرة قوية.',
    'p.tip6': '<b>استخدم الحيل.</b> تنتهي كل حلقة بحيلة للحفظ (المضاعفة، حيلة أصابع جدول 9، «أضف صفراً فقط»). اطلب من طفلك أن يعلّمك الحيلة — فالتعليم أفضل اختبار.',
    'p.tip7': '<b>اطبع لأيام بلا شاشات.</b> <a href="worksheets.html" style="text-decoration:underline">ورقة عمل</a> على طاولة المطبخ، مع مؤقّت، تصنع تحدياً رائعاً لنهاية الأسبوع.',
    'p.order.eyebrow': 'ترتيب التعلّم', 'p.order.h2': 'أي جدول نتعلّم بعد ذلك؟',
    'p.order.lead': 'لا تسر بالترتيب 1، 2، 3، 4… بل من الأسهل إلى الأصعب. كل خطوة تستفيد مما سبقها.',
    'p.step1': '10 و1 <small>(أضف صفراً / يبقى كما هو)</small>', 'p.step2': '2 و5 <small>(المضاعفة، عدّ الساعة)</small>', 'p.step3': '4 <small>(ضاعف مرتين)</small>',
    'p.step4': '3 و6 <small>(ثلاثة أضعاف، ومضاعفة الـ3)</small>', 'p.step5': '9 <small>(حيلة الأصابع)</small>', 'p.step6': '8 و7 <small>(لم يبقَ سوى بضع حقائق جديدة!)</small>',
    'p.order.note': 'لأن 7 × 8 هي نفسها 8 × 7، فعندما تصل إلى جدول 7 لن يبقى سوى عدد قليل من الحقائق الجديدة فعلاً (7 × 7، 7 × 8، 8 × 8). أشر إلى ذلك — فهو يعزّز الثقة كثيراً.',
    'p.tricks.eyebrow': 'ورقة الحيل', 'p.tricks.h2': 'حيل للحفظ لكل جدول',
    'p.th.table': 'الجدول', 'p.th.trick': 'الحيلة', 'p.th.example': 'مثال',
    'p.trick1': 'يبقى الرقم كما هو.', 'p.trick2': 'ضاعفه. كل النواتج زوجية.', 'p.trick3': 'ضاعفه، ثم أضفه مرة أخرى.', 'p.trick4': 'ضاعف، ثم ضاعف مرة أخرى.',
    'p.trick5': 'ينتهي بـ5 أو 0. نصف ناتج الضرب في 10.', 'p.trick6': 'اضرب في 5، ثم أضف مجموعة أخرى.',
    'p.trick7': 'تذكّر: 5، 6، 7، 8 ← 56 = 7 × 8. في هذه المرحلة لا يبقى جديداً سوى 7 × 7 و7 × 8.',
    'p.trick8': 'ضاعف، ضاعف، ضاعف.', 'p.trick9': 'حيلة الأصابع: اثنِ الإصبع رقم N؛ العشرات على اليسار والآحاد على اليمين. مجموع الرقمين دائماً 9.', 'p.trick10': 'أضف صفراً.',
    'p.routine.h3': '🕙 روتين يومي من 10 دقائق',
    'p.r1': '<b>دقيقتان</b> — شاهد حلقة هذا الأسبوع (أو أعدها بالسرعة العالية).', 'p.r2': '<b>3 دقائق</b> — ألغاز الرياضيات حتى تنفد القلوب الثلاثة.',
    'p.r3': '<b>3 دقائق</b> — سباق واحد على جدول هذا الأسبوع.', 'p.r4': '<b>دقيقتان</b> — راجعا متتبّع التقدّم معاً واختارا «حقيقة تحتاج إلى تدريب» لقولها بصوت عالٍ خمس مرات.',
    'p.class.h3': '🏫 في الصف',
    'p.c1': 'اعرض حلقة فيديو على السبورة ودع الصف يردّد شريط العدّ بالقفز.', 'p.c2': 'بينغو رائعة في أزواج: طفل يقرأ النداء، والآخر يجد الإجابة.',
    'p.c3': 'اطبع مجموعة أوراق عمل للصف دفعة واحدة — كل ضغطة على «ورقة جديدة» تعطي مسائل مختلفة، فلا يستطيع الجيران النقل.', 'p.c4': 'الجدول الفارغ تقييم جيد لنهاية الوحدة؛ وقّته واحتفظ به.',
    'p.faq.eyebrow': 'أسئلة شائعة', 'p.faq.h2': 'أسئلة يطرحها الكبار',
    'p.q1': 'هل يجمع الموقع أي بيانات أو يحتاج إلى حساب؟', 'p.a1': 'لا. تُحفظ النتائج والتقدّم في هذا المتصفح فقط (localStorage). مسح بيانات المتصفح، أو الضغط على «إعادة تعيين التقدّم» أعلاه، يحذفها. لا يُرسل أي شيء إلى أي مكان.',
    'p.q2': 'طفلي يخمّن بسرعة بدلاً من التفكير. ماذا أفعل؟', 'p.a2': 'انتقل من السباق إلى الألغاز لفترة — الإجابات الخاطئة تكلّف قلباً، مما يبطئ التخمين. تفعيل الصوت يساعد أيضاً: صوت «الخطأ» تنبيه لطيف.',
    'p.q3': 'لأي عمر هذا الموقع؟', 'p.a3': 'تقريباً من 6 إلى 12 سنة. يبدأ الأصغر عادةً بفيديوهات 1 و2 و5 و10 وبينغو السهلة؛ وينتقل الأكبر مباشرة إلى السباق بإعداد 6–9.',
    'p.q4': 'هل يعمل على الهاتف أو الجهاز اللوحي؟', 'p.a4': 'نعم — كل صفحة تتكيّف مع الشاشات الصغيرة، وكل الألعاب تعمل باللمس. يُفضَّل طباعة أوراق العمل من الحاسوب.',
    'p.q5': 'الراوي الصوتي لا يعمل.', 'p.a5': 'يستخدم الراوي خاصية النطق المدمجة في المتصفح (بدون تنزيلات). وهي مدعومة في Chrome وEdge وSafari وFirefox على معظم الأجهزة. للقراءة بالعربية يجب أن يحتوي جهازك على صوت عربي مثبّت.'
  };

  /* ---------- API ---------- */
  MM.lang = load('lang', 'en') === 'ar' ? 'ar' : 'en';
  MM.rtl = MM.lang === 'ar';
  MM.sep = MM.rtl ? '، ' : ', ';   // list separator for generated text
  MM.t = function (key, vars) {
    let s = (T[MM.lang] && T[MM.lang][key] !== undefined) ? T[MM.lang][key] : (T.en[key] !== undefined ? T.en[key] : key);
    if (Array.isArray(s)) return s;
    if (vars) Object.keys(vars).forEach(k => { s = s.split('{' + k + '}').join(vars[k]); });
    return s;
  };
  MM.setLang = function (lang) { save('lang', lang); location.reload(); };

  // Set direction before first paint
  document.documentElement.lang = MM.lang;
  document.documentElement.dir = MM.rtl ? 'rtl' : 'ltr';

  document.addEventListener('DOMContentLoaded', function () {
    if (MM.rtl) {
      document.querySelectorAll('[data-i18n]').forEach(el => { el.textContent = MM.t(el.dataset.i18n); });
      document.querySelectorAll('[data-i18n-html]').forEach(el => { el.innerHTML = MM.t(el.dataset.i18nHtml); });
      document.querySelectorAll('[data-i18n-placeholder]').forEach(el => { el.placeholder = MM.t(el.dataset.i18nPlaceholder); });
      document.querySelectorAll('[data-i18n-title]').forEach(el => { el.title = MM.t(el.dataset.i18nTitle); });
      document.querySelectorAll('[data-i18n-label]').forEach(el => { el.setAttribute('aria-label', MM.t(el.dataset.i18nLabel)); });
      const t = document.querySelector('title[data-i18n]'); if (t) document.title = MM.t(t.dataset.i18n);
    }
    document.querySelectorAll('[data-lang-toggle]').forEach(btn => {
      btn.textContent = MM.t('lang.switch');
      btn.addEventListener('click', () => MM.setLang(MM.rtl ? 'en' : 'ar'));
    });
  });
})();

/* Internationalisation: English (default) + Arabic (RTL).
   Loaded in <head> so the document direction is set before first paint.
   - Static text: elements carry data-i18n="key" (textContent), data-i18n-html="key" (innerHTML),
     data-i18n-placeholder / data-i18n-title. English lives in the HTML; only Arabic is applied.
   - Dynamic text: scripts call MM.t('key', {vars}); English strings live in T.en.
   - A ?lang=ar / ?lang=en link parameter (used by the sister-site links) sets and remembers the language. */
(function () {
  'use strict';
  window.MM = window.MM || {};

  function load(key, fallback) { try { const v = localStorage.getItem('dv_' + key); return v === null ? fallback : JSON.parse(v); } catch (e) { return fallback; } }
  function save(key, value) { try { localStorage.setItem('dv_' + key, JSON.stringify(value)); } catch (e) { } }

  const T = {};

  /* ---------- English (dynamic strings only) ---------- */
  T.en = {
    'lang.switch': 'عربي',
    'sound.on': '🔊 Sound on', 'sound.off': '🔇 Sound off',

    'qc.cheers': ['Brilliant!', 'Yes! 🎉', 'You got it!', 'Super smart!', 'Nailed it!', 'Wow!'],
    'qc.five': '5 in a row! 🌟 Keep going!',
    'qc.wrong': 'Not quite — {p} ÷ {n} = {q}. Try the next one!',
    'hero.hi': 'Welcome back, {name}! 👋',

    /* Games */
    'games.h1.named': 'Pick a game, {name}! 🎮',
    'share.q': 'Share {p} {item} between {n} friends. How many does each friend get?',
    'share.q1': 'Share {p} {item} with just 1 friend. How many does that friend get?',
    'share.each': 'Each friend gets {q}! {p} ÷ {n} = {q}',
    'share.title.perfect': 'Perfect sharing!', 'share.title.over': 'All shared!',
    'share.body': 'You shared fairly <b>{s}</b> out of 10 times! {tail}',
    'share.i.0': 'cookies', 'share.i.1': 'strawberries', 'share.i.2': 'sweets', 'share.i.3': 'cupcakes', 'share.i.4': 'doughnuts', 'share.i.5': 'apples',
    'race.title.best': 'New best score!', 'race.title.over': 'Race over!',
    'race.body': 'You scored <b>{s}</b> with <b>{acc}%</b> accuracy. {stars}<br>{tail}',
    'race.beat': 'You beat your record!', 'race.bestSoFar': 'Best so far: {b}',
    'bingo.free': 'FREE', 'bingo.win.title': 'BINGO!',
    'bingo.win.body': "Five in a row in <b>{c}</b> calls! That's win number <b>{w}</b>.",
    'puzzle.type.missing': 'Missing number', 'puzzle.type.tf': 'True or false?', 'puzzle.type.which': 'Which one makes…', 'puzzle.type.odd': 'Odd one out', 'puzzle.type.family': 'Fact family',
    'puzzle.q.which': 'Which equals {n}?', 'puzzle.q.not': 'Which one is NOT {n}?',
    'puzzle.true': '✅ True', 'puzzle.false': '❌ False', 'puzzle.remember': 'Remember: ',
    'puzzle.explainNot': '{odd} = {v}, not {target}',
    'puzzle.title.best': 'New record!', 'puzzle.title.over': 'Out of hearts!',
    'puzzle.body': 'You solved <b>{s}</b> {word}. {tail}', 'puzzle.one': 'puzzle', 'puzzle.many': 'puzzles',
    'puzzle.beat': 'That is your best ever!', 'puzzle.bestSoFar': 'Best: {b}',
    'memory.win.title': 'All matched!', 'memory.win.body': 'You found all {p} pairs in <b>{m}</b> moves! {tail}',
    'memory.best': 'Best: {b} moves', 'memory.beat': 'New best!',
    'balloon.over': 'Game over!', 'balloon.body': 'You popped <b>{s}</b> {word}! {tail}', 'balloon.one': 'balloon', 'balloon.many': 'balloons',
    'hunt.over': "Time's up!", 'hunt.body': 'You cleared <b>{r}</b> rounds and found <b>{f}</b> tiles! {tail}',
    'generic.beat': 'New record!', 'generic.best': 'Best: {b}',

    /* Videos */
    'speed.slow': '🐢 Slow', 'speed.normal': '🐇 Normal', 'speed.fast': '🚀 Fast',
    'voice.on': '🔊 Voice on', 'voice.off': '🔈 Voice off',
    'scene': 'Scene {k} / 10', 'scene.intro': 'Intro', 'scene.end': 'The end',
    'ep.card.title': 'Divide by {n}', 'ep.card.sub': 'Ep. {n} · {title}',
    'stage.title': 'Episode {n} · Dividing by {n} · {title}',
    'stage.introEq': 'Dividing by <span class="ans">{n}</span>',
    'stage.starring': 'Today we share: {name}!',
    'stage.press': 'Press ▶ to start Episode {n}: {title}',
    'stage.cap1': 'Dividing by 1: all {p} {name} go into one group. So {p} ÷ 1 = {k}!',
    'stage.cap': '{p} {name} shared into {n} equal groups: {k} in each! So {p} ÷ {n} = {k}.',
    'stage.jumps': 'Count by {n}s up to {p}: that is {k} jumps!',
    'stage.doneEq': 'You did it! <span class="ans">🎉</span>',
    'stage.doneMsg': 'Now you can divide by {n}!',
    'stage.race': '🚀 Race dividing by {n}', 'stage.nextEp': 'Next episode ▶',
    'stage.doneCap': 'Great watching! Try the memory trick below, or race dividing by {n}.',
    'chart.result': '{p} ÷ {r} = {c}   and   {p} ÷ {c} = {r}',
    'speech.div': 'divided by', 'speech.times': 'times',
    'ep.1.name': 'stars', 'ep.1.title': 'One Big Group', 'ep.1.trick': 'Dividing by 1 changes nothing: 7 ÷ 1 = 7. One group gets everything!',
    'ep.2.name': 'apples', 'ep.2.title': 'Half and Half', 'ep.2.trick': 'Dividing by 2 means HALVING. 16 ÷ 2: half of 16 is 8.',
    'ep.3.name': 'strawberries', 'ep.3.title': 'Three Friends Share', 'ep.3.trick': 'Think of the 3 times table backwards: 3 × ? = 24. 3 × 8 = 24, so 24 ÷ 3 = 8.',
    'ep.4.name': 'cookies', 'ep.4.title': 'Half of a Half', 'ep.4.trick': 'Halve it, then halve it again! 28 ÷ 4: 28 → 14 → 7.',
    'ep.5.name': 'balloons', 'ep.5.title': 'High-Five Split', 'ep.5.trick': 'Double it, then take off the zero! 35 ÷ 5: 35 → 70 → 7.',
    'ep.6.name': 'pizza slices', 'ep.6.title': 'Pizza Party', 'ep.6.trick': 'Halve it, then divide by 3. 42 ÷ 6: 42 → 21 → 7.',
    'ep.7.name': 'sweets', 'ep.7.title': 'Magic Sevens', 'ep.7.trick': 'Use the fact family: 7 × 8 = 56, so 56 ÷ 7 = 8. Remember "5, 6, 7, 8": 56 = 7 × 8!',
    'ep.8.name': 'cupcakes', 'ep.8.title': 'Half, Half, Half', 'ep.8.trick': 'Halve it three times! 48 ÷ 8: 48 → 24 → 12 → 6.',
    'ep.9.name': 'presents', 'ep.9.title': "The Nine's Secret", 'ep.9.trick': 'Look at the tens digit and add 1! 54 ÷ 9: the tens digit is 5, and 5 + 1 = 6. It works for every answer in the 9 table.',
    'ep.10.name': 'doughnuts', 'ep.10.title': 'Drop the Zero', 'ep.10.trick': 'Dividing by 10? Just take the 0 off the end. 70 ÷ 10 = 7. Easiest one of all!',

    /* Worksheets */
    'ws.practice': 'Division Practice', 'ws.name': 'Name:', 'ws.date': 'Date:', 'ws.score': 'Score: ____ / ____',
    'ws.key': '{title} — Answer Key', 'ws.forParents': 'For parents and teachers',
    'ws.missing': 'Missing Number Puzzles', 'ws.missingSub': 'Fill in the missing number',
    'ws.family': 'Fact Families', 'ws.familySub': 'Use the three numbers to write two × facts and two ÷ facts',
    'ws.chart': 'Division Finder Chart', 'ws.chartSub': 'Find the big number in a row — the number at the top of its column is the answer',
    'ws.chartHow': 'Example: 42 ÷ 6 — go along row 6 until you reach 42, then look up. The answer is 7!',
    'ws.allTables': 'Dividing by 1–10', 'ws.tables': 'Divide by: ', 'ws.footer': 'Fun with Division! · Dividing by 1–10',
    'ws.time': 'Time taken: ____ min',

    /* Parents */
    'p.notTried': 'not tried', 'p.accOf': '{acc}% of {total}',
    'p.noTrouble': 'Nothing yet — play a few games and tricky facts will appear here.',
    'p.resetConfirm': 'Reset all saved scores and progress on this device?',

    /* Name & prizes */
    'name.hi': 'Hi, {name}! 👋',
    'name.next': '{n} more correct answers until your next prize!',
    'prize.title': '🎁 A prize for {name}!', 'prize.titleAnon': '🎁 You won a prize!',
    'prize.body': 'You earned a new sticker: {sticker}', 'prize.btn': 'Yay! 🎉',
    'prize.box': 'Prize box', 'prize.locked': 'Locked — {n} stars to go',
    'badge.title': '🏆 A trophy for {name}!', 'badge.titleAnon': '🏆 You won a trophy!',
    'badge.body': 'You unlocked: {badge}',
    'prizes.hard': '🔥 ÷6 to ÷9',
    'badge.bingo': 'Bingo Champion', 'badge.bingo.how': 'Win a game of Division Bingo.',
    'badge.memory': 'Memory Whiz', 'badge.memory.how': 'Finish Memory Match in 12 moves or fewer.',
    'badge.racer': 'Speed Rocket', 'badge.racer.how': 'Score 20 or more in the Division Race.',
    'badge.popstar': 'Pop Star', 'badge.popstar.how': 'Pop 15 balloons in one game.',
    'badge.eyes': 'Eagle Eyes', 'badge.eyes.how': 'Clear 5 rounds of Number Hunt.',
    'badge.sharer': 'Fair Sharer', 'badge.sharer.how': 'Get all 10 right in a game of Fair Share.',
    'badge.century': 'Century Club', 'badge.century.how': 'Collect 100 stars.',
    'badge.little': 'Little Divider', 'badge.little.how': 'Master dividing by 1, 2, 3, 4 and 5.',
    'badge.t6': 'Pizza Slicer', 'badge.t6.how': 'Master dividing by 6.',
    'badge.t7': 'Lucky Seven Splitter', 'badge.t7.how': 'Master dividing by 7.',
    'badge.t8': 'Octo Divider', 'badge.t8.how': 'Master dividing by 8.',
    'badge.t9': 'Nine Ninja', 'badge.t9.how': 'Master dividing by 9.',
    'badge.hardracer': 'Fire Racer', 'badge.hardracer.how': 'Score 15+ in the Race dividing only by 6–9.',
    'badge.hardpop': 'Hot Popper', 'badge.hardpop.how': 'Pop 10 balloons dividing only by 6–9.',
    'badge.hero': 'Division Hero', 'badge.hero.how': 'Master dividing by all of 6, 7, 8 and 9.',
    'badge.royalty': 'Division Royalty', 'badge.royalty.how': 'Master dividing by every number from 1 to 10.',
    'badge.genius': 'Division Genius', 'badge.genius.how': 'Collect 500 stars.',
    'sticker.0': 'Penguin', 'sticker.1': 'Owl', 'sticker.2': 'Tiger', 'sticker.3': 'Zebra', 'sticker.4': 'Giraffe', 'sticker.5': 'Elephant',
    'sticker.6': 'Hedgehog', 'sticker.7': 'Otter', 'sticker.8': 'Ladybird', 'sticker.9': 'Parrot', 'sticker.10': 'Squirrel', 'sticker.11': 'Kangaroo',
    'sticker.12': 'Bunny', 'sticker.13': 'Bear', 'sticker.14': 'Hamster', 'sticker.15': 'Sloth', 'sticker.16': 'Seal', 'sticker.17': 'Bee',
    'sticker.18': 'Doughnut', 'sticker.19': 'Cookie', 'sticker.20': 'Waffle', 'sticker.21': 'Pretzel', 'sticker.22': 'Cherries', 'sticker.23': 'Kiwi',
    'sticker.24': 'Pineapple', 'sticker.25': 'Avocado', 'sticker.26': 'Taco', 'sticker.27': 'Popcorn', 'sticker.28': 'Football', 'sticker.29': 'Paint palette',
    'sticker.30': 'Kite', 'sticker.31': 'Piano', 'sticker.32': 'Roller skate', 'sticker.33': 'Train', 'sticker.34': 'Sailboat', 'sticker.35': 'Planet'
  };

  /* ---------- Arabic ---------- */
  T.ar = {
    'lang.switch': 'English',
    'sound.on': '🔊 الصوت مفعّل', 'sound.off': '🔇 الصوت مغلق',
    'brand': 'مرح مع القسمة!',
    'nav.home': '🏠 الرئيسية', 'nav.games': '🎮 الألعاب', 'nav.videos': '📺 الفيديوهات', 'nav.worksheets': '📝 أوراق العمل', 'nav.parents': '👩‍🏫 الأهل والمعلمون',
    'nav.sister': '✖️ الضرب', 'nav.menu': 'فتح القائمة',
    'footer.made': 'مرح مع القسمة! — صُنع بحب ❤️ للأطفال الفضوليين من 6 إلى 12 سنة.',
    'footer.grownups': 'للكبار', 'footer.back': 'العودة إلى المرح', 'footer.sister': '✖️ مرح مع جدول الضرب',

    /* Home */
    'title.home': 'مرح مع القسمة! — تعلّم القسمة على الأعداد من 1 إلى 10',
    'hero.eyebrow': 'القسمة على 1 حتى 10',
    'hero.h1': 'مرح مع <span style="white-space:nowrap"><span class="wobble">القسمة!</span></span>',
    'hero.lead': 'شارك الحلوى بالعدل، والعب الألعاب، وشاهد القصص المتحركة، واطبع أوراق العمل — حتى تعرف أن 56 ÷ 7 = 8 قبل أن تنتهي من قراءتها.',
    'hero.play': '🎮 العب لعبة', 'hero.watch': '📺 شاهد فيديو', 'hero.print': '📝 اطبع ورقة عمل',
    'hero.hi': 'أهلاً بعودتك يا {name}! 👋',
    'pick.eyebrow': 'ابدأ من هنا', 'pick.h2': 'اختر رقماً تقسم عليه', 'pick.lead': 'اضغط على رقم لمشاهدة فيديوه، ثم تسابق معه في لعبة!', 'pick.chip': 'اقسم على',
    'ways.eyebrow': 'ثلاث طرق للتعلّم', 'ways.h2': 'العبها. شاهدها. اكتبها.', 'ways.popular': 'الأكثر شعبية',
    'ways.games.h3': 'ألعاب القسمة',
    'ways.games.p': 'وزّع الحلوى بالعدل في <b>القسمة العادلة</b>، وتسابق في <b>سباق القسمة</b>، واصرخ <b>بينغو!</b>، وحُلّ <b>الألغاز</b>. سبع ألعاب، ونجوم وجوائز!',
    'ways.games.btn': 'هيا نلعب ←',
    'ways.videos.h3': 'فيديوهات متحركة',
    'ways.videos.p': 'عشر حلقات قصيرة — واحدة لكل رقم. شاهد التفاح والكعك والبيتزا تُوزَّع على المجموعات بالتساوي، مع راوٍ يقرأ بصوت عالٍ.',
    'ways.videos.btn': 'شاهد الآن ←',
    'ways.ws.h3': 'أوراق عمل للطباعة',
    'ways.ws.p': 'مسائل قسمة، وأرقام مفقودة، وعائلات الحقائق، وجدول للبحث — مع مفاتيح الإجابات للكبار.',
    'ways.ws.btn': 'اصنع ورقة ←',
    'qc.tag': '⚡ تحدٍّ سريع', 'qc.h2': 'هل تستطيع الإجابة على 5 متتالية؟', 'stat.streak': 'متتالية', 'stat.best': 'الأفضل',
    'how.watch.h3': '1️⃣ شاهد', 'how.watch.p': 'ابدأ بحلقة. شاهد 12 كعكة تُوزَّع على 3 أصدقاء حتى يحصل كل واحد على 4 — عندها تفهم <em>لماذا</em> 12 ÷ 3 = 4.',
    'how.play.h3': '2️⃣ العب', 'how.play.p': 'تحوّل الألعاب التدريب إلى سباق. جولات قصيرة، وتشجيع كبير، وأفضل نتيجة تتحدّاها غداً.',
    'how.practise.h3': '3️⃣ تدرّب', 'how.practise.p': 'اطبع ورقة عمل لطاولة المطبخ. عشر دقائق يومياً تكفي.',
    'banner.h2': 'الأهل والمعلمون', 'banner.p': 'نصائح، وترتيب مقترح للتعلّم، وحيل للحفظ، ومتتبّع للتقدّم.', 'banner.btn': 'اقرأ الدليل ←',
    'sister.h2': 'هل ما زلت تتعلّم جداول الضرب؟', 'sister.p': 'القسمة هي الضرب بالعكس — فكلما عرفت جداول الضرب أكثر، أصبحت القسمة أسهل. زُر موقعنا الشقيق!', 'sister.btn': '✖️ مرح مع جدول الضرب ←',
    'qc.cheers': ['رائع!', 'نعم! 🎉', 'أصبت!', 'ذكي جداً!', 'ممتاز!', 'واو!'],
    'qc.five': '5 متتالية! 🌟 واصل!',
    'qc.wrong': 'ليس تماماً — {p} ÷ {n} = {q}. جرّب التالية!',

    /* Games */
    'title.games': 'ألعاب القسمة — مرح مع القسمة!',
    'who.h2': 'من يلعب؟', 'name.q': 'ما اسمك؟', 'name.ph': 'اكتب اسمك', 'name.go': 'هيا بنا! 🚀',
    'name.hi': 'أهلاً {name}! 👋', 'name.change': 'تغيير الاسم', 'stat.stars': 'نجوم',
    'name.next': '{n} إجابات صحيحة أخرى حتى جائزتك التالية!',
    'games.eyebrow': 'منطقة الألعاب', 'games.h1': 'اختر لعبة 🎮', 'games.h1.named': 'اختر لعبة يا {name}! 🎮',
    'games.tab.share': '🍪 القسمة العادلة', 'games.tab.race': '🚀 سباق القسمة', 'games.tab.bingo': '🎯 بينغو القسمة', 'games.tab.puzzle': '🧩 ألغاز القسمة',
    'games.tab.memory': '🃏 لعبة الذاكرة', 'games.tab.balloon': '🎈 فرقعة البالونات', 'games.tab.hunt': '🔍 صيد الأرقام',
    'share.lead': 'وزّع الحلوى على الأصدقاء بالعدل! كم يحصل كل صديق؟ عشر جولات — هل تحصل عليها كلها؟',
    'share.start': 'ابدأ التوزيع! 🍪', 'stat.round': 'الجولة', 'stat.correct': 'صحيحة',
    'share.q': 'وزّع {p} من {item} على {n} أصدقاء. كم يحصل كل صديق؟',
    'share.q1': 'أعطِ {p} من {item} لصديق واحد فقط. كم يحصل؟',
    'share.each': 'كل صديق يحصل على {q}! {p} ÷ {n} = {q}',
    'share.title.perfect': 'توزيع مثالي!', 'share.title.over': 'تم التوزيع!',
    'share.body': 'وزّعت بالعدل <b>{s}</b> من 10 مرات! {tail}',
    'share.i.0': 'الكعك', 'share.i.1': 'الفراولة', 'share.i.2': 'الحلوى', 'share.i.3': 'الكب كيك', 'share.i.4': 'الدونات', 'share.i.5': 'التفاح',
    'race.lead': 'أجب على أكبر عدد ممكن خلال 60 ثانية. زوّد الصاروخ بالوقود بإجاباتك الصحيحة!',
    'race.which': 'على أي الأرقام تريد أن تقسم؟', 'race.all': 'كل الأرقام', 'race.easy': 'سهل (÷1، ÷2، ÷5، ÷10)', 'race.hard': 'صعب (÷6، ÷7، ÷8، ÷9)',
    'race.start': 'ابدأ السباق! 🏁', 'race.best': 'أفضل نتيجة:',
    'stat.score': 'النقاط', 'stat.seconds': 'ثانية', 'btn.stop': 'توقف',
    'race.title.best': 'أفضل نتيجة جديدة!', 'race.title.over': 'انتهى السباق!',
    'race.body': 'أحرزت <b>{s}</b> بدقة <b>{acc}%</b>. {stars}<br>{tail}',
    'race.beat': 'لقد حطّمت رقمك القياسي!', 'race.bestSoFar': 'الأفضل حتى الآن: {b}',
    'bingo.lead': 'ديفي ينادي بمسألة قسمة. ابحث عن الإجابة في بطاقتك واضغط عليها — أي مربع فيه الرقم يُحسب! اجمع خمسة في صف واحد لتفوز.',
    'bingo.level': 'اختر مستواك', 'bingo.easy': '🌱 سهل — القسمة على 1 حتى 5', 'bingo.mixed': '🌼 مختلط — القسمة على 1 حتى 10', 'bingo.hard': '🔥 صعب — القسمة على 6 حتى 10',
    'bingo.start': 'وزّع بطاقتي! 🃏', 'stat.calls': 'نداءات', 'stat.marked': 'مُعلَّمة', 'bingo.nope': '🙅 ليس في بطاقتي', 'bingo.new': 'بطاقة جديدة',
    'bingo.free': 'مجاني', 'bingo.win.title': 'بينغو!',
    'bingo.win.body': 'خمسة في صف واحد خلال <b>{c}</b> نداءً! هذا فوزك رقم <b>{w}</b>.',
    'puzzle.lead': 'أرقام مفقودة، وصح أم خطأ، وعائلات الحقائق، والمختلف بينها. لديك ثلاثة قلوب — إلى أين تصل؟',
    'puzzle.start': 'ابدأ حل الألغاز! 🧠', 'puzzle.best': 'الأفضل:', 'puzzle.unit': 'ألغاز', 'stat.solved': 'محلولة', 'stat.lives': 'القلوب',
    'puzzle.type.missing': 'الرقم المفقود', 'puzzle.type.tf': 'صح أم خطأ؟', 'puzzle.type.which': 'أيها يساوي…', 'puzzle.type.odd': 'المختلف بينها', 'puzzle.type.family': 'عائلة الحقائق',
    'puzzle.q.which': 'أيها يساوي {n}؟', 'puzzle.q.not': 'أيها لا يساوي {n}؟',
    'puzzle.true': '✅ صح', 'puzzle.false': '❌ خطأ', 'puzzle.remember': 'تذكّر: ',
    'puzzle.explainNot': '{odd} = {v}، وليس {target}',
    'puzzle.title.best': 'رقم قياسي جديد!', 'puzzle.title.over': 'نفدت القلوب!',
    'puzzle.body': 'لقد حللت <b>{s}</b> {word}. {tail}', 'puzzle.one': 'لغزاً', 'puzzle.many': 'لغزاً',
    'puzzle.beat': 'هذا أفضل ما حققته!', 'puzzle.bestSoFar': 'الأفضل: {b}',
    'memory.lead': 'اقلب بطاقتين. طابق كل مسألة قسمة مع إجابتها!', 'memory.start': 'اخلط والعب! 🃏',
    'stat.moves': 'محاولات', 'stat.pairs': 'أزواج',
    'memory.win.title': 'طابقت الكل!', 'memory.win.body': 'وجدت كل الأزواج الـ{p} في <b>{m}</b> محاولة! {tail}',
    'memory.best': 'الأفضل: {b} محاولة', 'memory.beat': 'رقم قياسي جديد!',
    'balloon.lead': 'فرقع البالون الذي يحمل الإجابة الصحيحة قبل أن يطير! ثلاث أخطاء وتنتهي اللعبة.', 'balloon.start': 'ابدأ الفرقعة! 🎈',
    'stat.popped': 'مفرقعة', 'balloon.over': 'انتهت اللعبة!', 'balloon.body': 'فرقعت <b>{s}</b> {word}! {tail}', 'balloon.one': 'بالوناً واحداً', 'balloon.many': 'بالوناً',
    'hunt.lead': 'اعثر على كل مسألة قسمة إجابتها تساوي الرقم المطلوب. اضغط عليها كلها قبل انتهاء الوقت!', 'hunt.start': 'ابدأ الصيد! 🔍',
    'hunt.target': 'اعثر على كل قسمة تساوي', 'stat.found': 'وجدت',
    'hunt.over': 'انتهى الوقت!', 'hunt.body': 'أكملت <b>{r}</b> جولات ووجدت <b>{f}</b> بطاقة! {tail}',
    'generic.beat': 'رقم قياسي جديد!', 'generic.best': 'الأفضل: {b}',
    'modal.again': 'العب مجدداً', 'modal.close': 'العودة إلى الألعاب',

    /* Prizes */
    'prizes.h2': '🎁 صندوق الجوائز', 'prizes.lead': 'كل إجابة صحيحة = نجمة ⭐. كل 10 نجوم = ملصق جديد!',
    'prizes.stickers.h3': '✨ الملصقات', 'prizes.trophies.h3': '🏆 الكؤوس',
    'prizes.trophies.lead': 'تُكسب الكؤوس بفعل شيء مميز. الكؤوس التي تحمل 🔥 لا تُفتح إلا بعد إتقان القسمة على 6 و7 و8 و9: 15 إجابة على الأقل مع 9 صحيحة من كل 10.',
    'prizes.hard': '🔥 ÷6 حتى ÷9',
    'prize.title': '🎁 جائزة لـ{name}!', 'prize.titleAnon': '🎁 لقد ربحت جائزة!',
    'prize.body': 'حصلت على ملصق جديد: {sticker}', 'prize.btn': 'رائع! 🎉',
    'prize.box': 'صندوق الجوائز', 'prize.locked': 'مقفل — تبقّى {n} نجمة',
    'badge.title': '🏆 كأس لـ{name}!', 'badge.titleAnon': '🏆 لقد ربحت كأساً!', 'badge.body': 'لقد فتحت: {badge}',
    'badge.bingo': 'بطل البينغو', 'badge.bingo.how': 'افز بلعبة بينغو القسمة.',
    'badge.memory': 'عبقري الذاكرة', 'badge.memory.how': 'أكمل لعبة الذاكرة في 12 محاولة أو أقل.',
    'badge.racer': 'صاروخ السرعة', 'badge.racer.how': 'أحرز 20 نقطة أو أكثر في سباق القسمة.',
    'badge.popstar': 'نجم الفرقعة', 'badge.popstar.how': 'فرقع 15 بالوناً في لعبة واحدة.',
    'badge.eyes': 'عين الصقر', 'badge.eyes.how': 'أكمل 5 جولات في صيد الأرقام.',
    'badge.sharer': 'الموزّع العادل', 'badge.sharer.how': 'أجب عن الجولات العشر كلها بشكل صحيح في القسمة العادلة.',
    'badge.century': 'نادي المئة', 'badge.century.how': 'اجمع 100 نجمة.',
    'badge.little': 'القاسم الصغير', 'badge.little.how': 'أتقن القسمة على 1 و2 و3 و4 و5.',
    'badge.t6': 'قاطع البيتزا', 'badge.t6.how': 'أتقن القسمة على 6.',
    'badge.t7': 'مقسّم السبعات المحظوظ', 'badge.t7.how': 'أتقن القسمة على 7.',
    'badge.t8': 'أخطبوط القسمة', 'badge.t8.how': 'أتقن القسمة على 8.',
    'badge.t9': 'نينجا التسعة', 'badge.t9.how': 'أتقن القسمة على 9.',
    'badge.hardracer': 'متسابق النار', 'badge.hardracer.how': 'أحرز 15+ في السباق مع القسمة على 6–9 فقط.',
    'badge.hardpop': 'الفرقعة الحارة', 'badge.hardpop.how': 'فرقع 10 بالونات مع القسمة على 6–9 فقط.',
    'badge.hero': 'بطل القسمة', 'badge.hero.how': 'أتقن القسمة على 6 و7 و8 و9 كلها.',
    'badge.royalty': 'ملك القسمة', 'badge.royalty.how': 'أتقن القسمة على كل الأرقام من 1 إلى 10.',
    'badge.genius': 'عبقري القسمة', 'badge.genius.how': 'اجمع 500 نجمة.',
    'sticker.0': 'بطريق', 'sticker.1': 'بومة', 'sticker.2': 'نمر', 'sticker.3': 'حمار وحشي', 'sticker.4': 'زرافة', 'sticker.5': 'فيل',
    'sticker.6': 'قنفذ', 'sticker.7': 'قضاعة', 'sticker.8': 'دعسوقة', 'sticker.9': 'ببغاء', 'sticker.10': 'سنجاب', 'sticker.11': 'كنغر',
    'sticker.12': 'أرنب', 'sticker.13': 'دب', 'sticker.14': 'هامستر', 'sticker.15': 'كسلان', 'sticker.16': 'فقمة', 'sticker.17': 'نحلة',
    'sticker.18': 'دونات', 'sticker.19': 'كعكة', 'sticker.20': 'وافل', 'sticker.21': 'بريتزل', 'sticker.22': 'كرز', 'sticker.23': 'كيوي',
    'sticker.24': 'أناناس', 'sticker.25': 'أفوكادو', 'sticker.26': 'تاكو', 'sticker.27': 'فشار', 'sticker.28': 'كرة قدم', 'sticker.29': 'لوحة ألوان',
    'sticker.30': 'طائرة ورقية', 'sticker.31': 'بيانو', 'sticker.32': 'حذاء تزلج', 'sticker.33': 'قطار', 'sticker.34': 'قارب شراعي', 'sticker.35': 'كوكب',

    /* Videos */
    'title.videos': 'فيديوهات متحركة — مرح مع القسمة!',
    'videos.eyebrow': 'مسرح ديفي للتوزيع', 'videos.h1': 'فيديوهات متحركة 📺',
    'videos.lead': 'لكل رقم حلقة قصيرة من عشرة مشاهد. اضغط تشغيل وشاهد الأشياء تُوزَّع على المجموعات بالتساوي، واحداً تلو الآخر.',
    'videos.press': 'اضغط ▶ للبدء!',
    'ctrl.prev': 'المشهد السابق', 'ctrl.play': 'تشغيل / إيقاف', 'ctrl.next': 'المشهد التالي', 'ctrl.speed': 'سرعة التشغيل', 'ctrl.voice': 'قراءة التعليقات بصوت عالٍ', 'ctrl.jump': 'انتقل إلى مشهد',
    'trick.label': '🧠 حيلة للحفظ:', 'episodes.h3': 'الحلقات',
    'chart.eyebrow': 'استكشف', 'chart.h2': 'جدول البحث عن القسمة', 'chart.lead': 'كل رقم في الجدول يخفي مسألتي قسمة. مرّر أو اضغط على أي مربع لتراهما.', 'chart.readout': 'اضغط على مربع! 👆',
    'speed.slow': '🐢 بطيء', 'speed.normal': '🐇 عادي', 'speed.fast': '🚀 سريع',
    'voice.on': '🔊 الراوي مفعّل', 'voice.off': '🔈 الراوي مغلق',
    'scene': 'المشهد {k} / 10', 'scene.intro': 'المقدمة', 'scene.end': 'النهاية',
    'ep.card.title': 'القسمة على {n}', 'ep.card.sub': 'الحلقة {n} · {title}',
    'stage.title': 'الحلقة {n} · القسمة على {n} · {title}',
    'stage.introEq': 'القسمة على <span class="ans">{n}</span>',
    'stage.starring': 'اليوم نوزّع: {name}!',
    'stage.press': 'اضغط ▶ لبدء الحلقة {n}: {title}',
    'stage.cap1': 'القسمة على 1: كل الـ{p} من {name} تذهب إلى مجموعة واحدة. إذاً {p} ÷ 1 = {k}!',
    'stage.cap': 'نوزّع {p} من {name} على {n} مجموعات متساوية: {k} في كل مجموعة! إذاً {p} ÷ {n} = {k}.',
    'stage.jumps': 'عُدّ بالـ{n} حتى {p}: هذه {k} قفزات!',
    'stage.doneEq': 'أحسنت! <span class="ans">🎉</span>',
    'stage.doneMsg': 'الآن تستطيع القسمة على {n}!',
    'stage.race': '🚀 تسابق في القسمة على {n}', 'stage.nextEp': 'الحلقة التالية ◀',
    'stage.doneCap': 'مشاهدة رائعة! جرّب حيلة الحفظ أدناه، أو تسابق في القسمة على {n}.',
    'chart.result': '{p} ÷ {r} = {c}   و   {p} ÷ {c} = {r}',
    'speech.div': 'مقسوماً على', 'speech.times': 'في',
    'ep.1.name': 'النجوم', 'ep.1.title': 'مجموعة واحدة كبيرة', 'ep.1.trick': 'القسمة على 1 لا تغيّر شيئاً: 7 ÷ 1 = 7. مجموعة واحدة تأخذ كل شيء!',
    'ep.2.name': 'التفاح', 'ep.2.title': 'نصف ونصف', 'ep.2.trick': 'القسمة على 2 تعني التنصيف. 16 ÷ 2: نصف 16 هو 8.',
    'ep.3.name': 'الفراولة', 'ep.3.title': 'ثلاثة أصدقاء يتقاسمون', 'ep.3.trick': 'فكّر في جدول 3 بالعكس: 3 × ؟ = 24. بما أن 3 × 8 = 24، فإن 24 ÷ 3 = 8.',
    'ep.4.name': 'الكعك', 'ep.4.title': 'نصف النصف', 'ep.4.trick': 'نصّفه، ثم نصّفه مرة أخرى! 28 ÷ 4: 28 ثم 14 ثم 7.',
    'ep.5.name': 'البالونات', 'ep.5.title': 'تقسيم الخمسات', 'ep.5.trick': 'ضاعفه، ثم احذف الصفر! 35 ÷ 5: 35 ثم 70 ثم 7.',
    'ep.6.name': 'شرائح البيتزا', 'ep.6.title': 'حفلة البيتزا', 'ep.6.trick': 'نصّفه، ثم اقسم على 3. 42 ÷ 6: 42 ثم 21 ثم 7.',
    'ep.7.name': 'الحلوى', 'ep.7.title': 'السبعات السحرية', 'ep.7.trick': 'استخدم عائلة الحقائق: 7 × 8 = 56، إذاً 56 ÷ 7 = 8. تذكّر «5، 6، 7، 8»: ‎56 = 7 × 8!',
    'ep.8.name': 'الكب كيك', 'ep.8.title': 'نصف، نصف، نصف', 'ep.8.trick': 'نصّفه ثلاث مرات! 48 ÷ 8: 48 ثم 24 ثم 12 ثم 6.',
    'ep.9.name': 'الهدايا', 'ep.9.title': 'سرّ التسعة', 'ep.9.trick': 'انظر إلى رقم العشرات وأضف 1! 54 ÷ 9: رقم العشرات 5، و5 + 1 = 6. تنجح مع كل إجابات جدول 9.',
    'ep.10.name': 'الدونات', 'ep.10.title': 'احذف الصفر', 'ep.10.trick': 'القسمة على 10؟ فقط احذف الصفر من النهاية. 70 ÷ 10 = 7. أسهلها كلها!',

    /* Worksheets */
    'title.worksheets': 'أوراق عمل للطباعة — مرح مع القسمة!',
    'ws.eyebrow': 'صانع أوراق العمل', 'ws.h1': 'اطبع وتدرّب 📝',
    'ws.lead': 'أنشئ ورقة عمل في ثوانٍ. كل ورقة مختلفة، فيمكنك طباعة ورقة جديدة كل يوم.',
    'ws.type': 'نوع الورقة', 'ws.type.problems': 'مسائل قسمة', 'ws.type.missing': 'ألغاز الرقم المفقود', 'ws.type.family': 'عائلات الحقائق', 'ws.type.chart': 'جدول البحث عن القسمة (مرجع)',
    'ws.tablesLabel': 'اقسم على', 'ws.all': 'الكل', 'ws.none': 'لا شيء',
    'ws.count': 'كم عدد المسائل؟', 'ws.count12': '12 (سريع)', 'ws.count40': '40 (تحدٍّ)',
    'ws.layout': 'التنسيق', 'ws.layoutH': 'أفقي ( 42 ÷ 6 = __ )', 'ws.layoutV': 'القسمة المطوّلة',
    'ws.childName': 'اسم الطفل (اختياري)', 'ws.namePh': 'مثال: مايا', 'ws.addKey': 'أضف صفحة مفتاح الإجابات',
    'ws.generate': '🎲 ورقة جديدة', 'ws.print': '🖨️ طباعة',
    'ws.tip': 'نصيحة: في نافذة الطباعة، اختر «حفظ كملف PDF» للاحتفاظ بنسخة.',
    'ws.practice': 'تدريب على القسمة', 'ws.name': 'الاسم:', 'ws.date': 'التاريخ:', 'ws.score': 'النتيجة: ____ / ____',
    'ws.key': '{title} — مفتاح الإجابات', 'ws.forParents': 'للأهل والمعلمين',
    'ws.missing': 'ألغاز الرقم المفقود', 'ws.missingSub': 'املأ الرقم المفقود',
    'ws.family': 'عائلات الحقائق', 'ws.familySub': 'استخدم الأرقام الثلاثة لكتابة حقيقتي ضرب وحقيقتي قسمة',
    'ws.chart': 'جدول البحث عن القسمة', 'ws.chartSub': 'ابحث عن الرقم الكبير في الصف — الرقم في أعلى عموده هو الإجابة',
    'ws.chartHow': 'مثال: 42 ÷ 6 — سر على طول الصف 6 حتى تصل إلى 42، ثم انظر للأعلى. الإجابة 7!',
    'ws.allTables': 'القسمة على 1–10', 'ws.tables': 'اقسم على: ', 'ws.footer': 'مرح مع القسمة! · القسمة على 1–10',
    'ws.time': 'الوقت المستغرق: ____ دقيقة',

    /* Parents */
    'title.parents': 'الأهل والمعلمون — مرح مع القسمة!',
    'p.eyebrow': 'للكبار', 'p.h1': 'الأهل والمعلمون 👩‍🏫',
    'p.lead': 'كيف تستفيد من هذا الموقع إلى أقصى حد — في عشر دقائق يومياً، وبدون دموع.',
    'p.saved': 'محفوظ على هذا الجهاز', 'p.tracker': 'متتبّع التقدّم',
    'p.trackerLead': 'كل ما يلعبه طفلك على هذا المتصفح يُسجَّل هنا — بلا حسابات ولا تسجيل.',
    'p.raceBest': 'أفضل سباق', 'p.puzzleBest': 'أفضل ألغاز', 'p.bingoWins': 'مرات فوز بينغو', 'p.facts': 'حقائق أُجيب عنها', 'p.acc': 'الدقة',
    'p.mastery': 'الإتقان حسب الرقم المقسوم عليه',
    'p.legend': 'أخضر = 90%+ صحيح مع 10 محاولات على الأقل. أصفر = قيد التدريب. رمادي = لم يُجرَّب بعد.',
    'p.notTried': 'لم يُجرَّب', 'p.accOf': '{acc}% من {total}',
    'p.trouble': 'حقائق تحتاج إلى تدريب',
    'p.noTrouble': 'لا شيء بعد — العب بعض الألعاب وستظهر الحقائق الصعبة هنا.',
    'p.reset': 'إعادة تعيين التقدّم', 'p.resetConfirm': 'هل تريد إعادة تعيين كل النتائج والتقدّم المحفوظ على هذا الجهاز؟',
    'p.tips.eyebrow': 'نصائح', 'p.tips.h2': 'سبع طرق لاستخدام هذا الموقع جيداً',
    'p.tip1': '<b>الضرب أولاً.</b> القسمة هي الضرب بالعكس، لذا يتعلّم الأطفال القسمة على 7 أسرع بكثير إذا عرفوا جدول 7. إذا كان جدول ما لا يزال صعباً، تدرّبوا عليه أولاً في <a data-sister href="../index.html" style="text-decoration:underline">مرح مع جدول الضرب</a>.',
    'p.tip2': '<b>وزّعوا أشياء حقيقية.</b> قبل الشاشات، وزّعوا 12 حبة عنب على 3 أطباق. لعبة «القسمة العادلة» والفيديوهات تعيد الفكرة نفسها: القسمة تعني مجموعات متساوية.',
    'p.tip3': '<b>تحدّثوا بعائلات الحقائق.</b> 6 و7 و42 تصنع أربع حقائق: 6 × 7، و7 × 6، و42 ÷ 6، و42 ÷ 7. ورقة عمل «عائلات الحقائق» وألغاز «عائلة الحقائق» تبني هذه العادة.',
    'p.tip4': '<b>القليل المتكرر أفضل من الكثير النادر.</b> عشر دقائق يومياً (فيديو واحد أو جولة لعب واحدة) أفضل بكثير من ساعة كاملة يوم العطلة.',
    'p.tip5': '<b>رقم واحد في كل مرة.</b> في السباق، ألغِ تحديد كل شيء ما عدا الرقم الذي تتعلّمونه ورقماً تعرفونه مسبقاً. أضيفوا المزيد مع نمو الثقة.',
    'p.tip6': '<b>استخدموا الحيل.</b> تنتهي كل حلقة بحيلة (التنصيف، «ضاعف ثم احذف الصفر»، سرّ التسعة). اطلبوا من طفلكم أن يعلّمكم الحيلة — فالتعليم أفضل اختبار.',
    'p.tip7': '<b>اطبعوا لأيام بلا شاشات.</b> <a href="worksheets.html" style="text-decoration:underline">ورقة عمل</a> على طاولة المطبخ، مع مؤقّت، تصنع تحدياً رائعاً لنهاية الأسبوع.',
    'p.order.eyebrow': 'ترتيب التعلّم', 'p.order.h2': 'على أي رقم نتعلّم القسمة بعد ذلك؟',
    'p.order.lead': 'اتبعوا ترتيب جداول الضرب نفسه: من الأسهل إلى الأصعب، وكل خطوة تستفيد مما سبقها.',
    'p.step1': '÷10 و÷1 <small>(احذف الصفر / يبقى كما هو)</small>', 'p.step2': '÷2 و÷5 <small>(التنصيف، ضاعف ثم احذف الصفر)</small>', 'p.step3': '÷4 <small>(نصّف مرتين)</small>',
    'p.step4': '÷3 و÷6 <small>(جدول 3 بالعكس)</small>', 'p.step5': '÷9 <small>(سرّ رقم العشرات)</small>', 'p.step6': '÷8 و÷7 <small>(عائلات الحقائق)</small>',
    'p.order.note': 'هذا الموقع يغطي القسمة من دون باقٍ (مثل 42 ÷ 6 = 7). عندما تصبح هذه الحقائق سريعة، يكون طفلكم مستعداً للقسمة مع الباقي والقسمة المطوّلة في المدرسة.',
    'p.tricks.eyebrow': 'ورقة الحيل', 'p.tricks.h2': 'حيل لكل رقم',
    'p.th.table': 'اقسم على', 'p.th.trick': 'الحيلة', 'p.th.example': 'مثال',
    'p.trick1': 'يبقى الرقم كما هو.', 'p.trick2': 'نصّفه.', 'p.trick3': 'فكّر: 3 × ؟ = الرقم.', 'p.trick4': 'نصّف، ثم نصّف مرة أخرى.',
    'p.trick5': 'ضاعف، ثم احذف الصفر.', 'p.trick6': 'نصّف، ثم اقسم على 3.',
    'p.trick7': 'استخدم عائلة الحقائق من جدول 7.', 'p.trick8': 'نصّف، نصّف، نصّف.',
    'p.trick9': 'رقم العشرات + 1.', 'p.trick10': 'احذف الصفر.',
    'p.routine.h3': '🕙 روتين يومي من 10 دقائق',
    'p.r1': '<b>دقيقتان</b> — شاهدوا حلقة هذا الأسبوع (أو أعيدوها بالسرعة العالية).', 'p.r2': '<b>3 دقائق</b> — جولة من القسمة العادلة أو الألغاز.',
    'p.r3': '<b>3 دقائق</b> — سباق واحد على رقم هذا الأسبوع.', 'p.r4': '<b>دقيقتان</b> — راجعوا متتبّع التقدّم معاً واختاروا «حقيقة تحتاج إلى تدريب» لقولها بصوت عالٍ خمس مرات.',
    'p.class.h3': '🏫 في الصف',
    'p.c1': 'اعرضوا حلقة فيديو على السبورة ودعوا الصف يعدّ القفزات معاً.', 'p.c2': 'بينغو رائعة في أزواج: طفل يقرأ النداء، والآخر يجد الإجابة.',
    'p.c3': 'اطبعوا أوراق «عائلات الحقائق» لربط القسمة بجداول الضرب التي يعرفها الصف.', 'p.c4': 'كل ضغطة على «ورقة جديدة» تعطي مسائل مختلفة، فلا يستطيع الجيران النقل.',
    'p.faq.eyebrow': 'أسئلة شائعة', 'p.faq.h2': 'أسئلة يطرحها الكبار',
    'p.q1': 'هل يجب أن يعرف طفلي جداول الضرب أولاً؟', 'p.a1': 'يساعد ذلك كثيراً. ليس عليه أن يكون سريعاً، لكن كل حقيقة قسمة هي حقيقة ضرب بالعكس. موقعنا الشقيق «مرح مع جدول الضرب» يعمل بالطريقة نفسها.',
    'p.q2': 'ماذا عن الباقي؟', 'p.a2': 'كل المسائل هنا تُقسم بلا باقٍ عن قصد — فهذه هي «الحقائق» التي تجعل القسمة مع الباقي والقسمة المطوّلة سهلة لاحقاً.',
    'p.q3': 'هل يجمع الموقع أي بيانات أو يحتاج إلى حساب؟', 'p.a3': 'لا. تُحفظ النتائج والتقدّم في هذا المتصفح فقط. مسح بيانات المتصفح، أو الضغط على «إعادة تعيين التقدّم» أعلاه، يحذفها. لا يُرسل أي شيء إلى أي مكان.',
    'p.q4': 'هل النجوم مشتركة مع موقع الضرب؟', 'p.a4': 'لا — لكل موقع صندوق جوائز خاص به، بملصقات وكؤوس مختلفة، فهناك دائماً شيء جديد لجمعه.',
    'p.q5': 'الراوي الصوتي لا يعمل.', 'p.a5': 'يستخدم الراوي خاصية النطق المدمجة في المتصفح (بدون تنزيلات). للقراءة بالعربية يجب أن يحتوي جهازك على صوت عربي مثبّت.'
  };

  /* ---------- API ---------- */
  let lang = load('lang', 'en');
  try {
    const q = new URLSearchParams(location.search).get('lang');
    if (q === 'ar' || q === 'en') { lang = q; save('lang', q); }
  } catch (e) { /* old browser: ignore */ }
  MM.lang = lang === 'ar' ? 'ar' : 'en';
  MM.rtl = MM.lang === 'ar';
  MM.sep = MM.rtl ? '، ' : ', ';   // list separator for generated text
  MM.t = function (key, vars) {
    let s = (T[MM.lang] && T[MM.lang][key] !== undefined) ? T[MM.lang][key] : (T.en[key] !== undefined ? T.en[key] : key);
    if (Array.isArray(s)) return s;
    if (vars) Object.keys(vars).forEach(k => { s = s.split('{' + k + '}').join(vars[k]); });
    return s;
  };
  MM.setLang = function (l) {
    save('lang', l);
    // Drop a ?lang= parameter so it doesn't override the new choice on reload
    location.href = location.pathname + location.hash;
  };

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

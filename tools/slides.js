/* Across App Store screenshot renderer — self-contained, no dependencies.
   DuoSlides.render(canvas, index, lang, device)  →  draws one slide.
   device: 'iphone' (1290×2796, 6.9") or 'ipad' (2048×2732, 13").
   Langs: en, de, fr, ar, es, ja. Captions follow ASO practice: benefit-first headline,
   ≤ 6 words, the strongest hooks in slides 1–3 (the ones visible in search results). */
(function () {
  const BW = 1290, BH = 2796;                         // base composition size
  const DEVICES = { iphone: [1290, 2796], ipad: [2048, 2732], duo: [2853, 2007] };
  const C = { bg: '#0B0B0E', fg: '#F4F4FA', muted: '#9A9AB2', indigo: '#6366F1', mint: '#34D399',
              orange: '#FB923C', red: '#F87171', yellow: '#FACC15' };
  const FONT = 'Inter, "SF Pro Display", system-ui, -apple-system, "Hiragino Sans", "Geeza Pro", "Noto Sans JP", "Noto Sans Arabic", sans-serif';

  const T = {
    en: {
      s1: ['TABLETOP MODE', 'Two Minds.\nOne Device.', 'Lay it flat between you. The learner’s half flips 180° to face them.'],
      s2: ['ADAPTIVE POSTURES', 'Fold, Flat\nor Face-Off.', 'Each posture is its own app: solo drills, deep analytics, live duels.'],
      s3: ['ASYMMETRIC ROLE-BASED UI', 'Tutor Sees Answers.\nLearner Doesn’t.', 'Two different screens, never mirrored. Hints, grading and scores stay on your side.'],
      s4: ['100% OFFLINE & PRIVATE', 'Your Voice\nNever Leaves.', 'Pronunciation is graded on-device by Apple speech recognition.'],
      s5: ['TRY 3 SESSIONS FREE', 'Pay Once or\nTeach a Class.', 'Every feature unlocked for your first 3 tabletop matches. No account.'],
      postures: [['Closed', 'Solo SM-2 cards'], ['Open', 'Analytics canvas'], ['Tabletop', 'Two-player duel']],
      roles: ['Half A · Tutor', 'Half B · Learner'],
      privacy: [['On-device speech grading', 'Audio stays on your iPhone'], ['Encrypted local storage', 'SwiftData + CryptoKit'], ['No ads, no tracking', 'No accounts. No servers.'], ['Works in airplane mode', 'Every deck ships in the app']],
      plans: [['FREE TRIAL', '3 Tabletop Matches', 'All features unlocked', []],
              ['BEST VALUE', 'Pro Lifetime', 'One-time purchase · no subscription', ['Unlimited tabletop duels', 'Every language deck', 'Apple Watch & widgets']],
              ['FOR CLASSROOMS', 'Teacher Pack', 'Yearly plan', ['Custom JSON/CSV decks', 'Student profiles', 'Offline PDF reports']]]
    },
    de: {
      s1: ['TABLETOP-MODUS', 'Zwei Köpfe.\nEin Gerät.', 'Flach zwischen euch legen. Die Lernhälfte dreht sich um 180° zum Gegenüber.'],
      s2: ['ADAPTIVE HALTUNGEN', 'Zu, flach\noder Duell.', 'Jede Haltung ist eine eigene App: Solo-Training, Analyse, Live-Duell.'],
      s3: ['ROLLENBASIERTE OBERFLÄCHE', 'Tutor sieht die Lösung.\nLernende nicht.', 'Zwei verschiedene Bildschirme, nie gespiegelt. Hinweise und Punkte bleiben bei dir.'],
      s4: ['100 % OFFLINE & PRIVAT', 'Deine Stimme\nbleibt bei dir.', 'Aussprache wird direkt auf dem Gerät bewertet.'],
      s5: ['3 RUNDEN GRATIS', 'Einmal zahlen\noder Klasse leiten.', 'Alle Funktionen in deinen ersten 3 Tabletop-Runden. Kein Konto.'],
      postures: [['Zugeklappt', 'Solo-Karteikarten'], ['Geöffnet', 'Analyse-Ansicht'], ['Tabletop', 'Duell zu zweit']],
      roles: ['Hälfte A · Tutor', 'Hälfte B · Lernende'],
      privacy: [['Aussprache auf dem Gerät', 'Audio bleibt auf dem iPhone'], ['Verschlüsselt gespeichert', 'SwiftData + CryptoKit'], ['Keine Werbung, kein Tracking', 'Kein Konto. Keine Server.'], ['Funktioniert im Flugmodus', 'Alle Decks in der App']],
      plans: [['GRATIS TESTEN', '3 Tabletop-Runden', 'Alle Funktionen frei', []],
              ['BESTER WERT', 'Pro Lifetime', 'Einmalkauf · kein Abo', ['Unbegrenzte Duelle', 'Alle Sprachdecks', 'Apple Watch & Widgets']],
              ['FÜR KLASSEN', 'Teacher Pack', 'Jahresplan', ['Eigene JSON/CSV-Decks', 'Schülerprofile', 'Offline-PDF-Berichte']]]
    },
    fr: {
      s1: ['MODE TABLE À DEUX', 'Deux esprits.\nUn appareil.', 'Posez-le à plat entre vous. La moitié de l’élève pivote de 180°.'],
      s2: ['POSTURES ADAPTATIVES', 'Fermé, à plat\nou en duel.', 'Chaque posture est une app : révision solo, analyse, duel en direct.'],
      s3: ['INTERFACE ASYMÉTRIQUE', 'Le tuteur voit la réponse.\nPas l’élève.', 'Deux écrans différents, jamais en miroir. Indices et notes restent de votre côté.'],
      s4: ['100 % HORS LIGNE & PRIVÉ', 'Votre voix\nreste chez vous.', 'La prononciation est notée sur l’appareil.'],
      s5: ['3 SESSIONS OFFERTES', 'Payez une fois\nou enseignez.', 'Toutes les fonctions pour vos 3 premières parties à deux. Sans compte.'],
      postures: [['Fermé', 'Cartes en solo'], ['Ouvert', 'Tableau d’analyse'], ['Table', 'Duel à deux']],
      roles: ['Moitié A · Tuteur', 'Moitié B · Élève'],
      privacy: [['Correction vocale locale', 'L’audio reste sur l’iPhone'], ['Stockage chiffré', 'SwiftData + CryptoKit'], ['Ni pub, ni pistage', 'Sans compte. Sans serveur.'], ['Fonctionne en mode avion', 'Tous les paquets inclus']],
      plans: [['ESSAI GRATUIT', '3 parties à deux', 'Tout est débloqué', []],
              ['MEILLEUR CHOIX', 'Pro à vie', 'Achat unique · sans abonnement', ['Duels illimités', 'Tous les paquets', 'Apple Watch & widgets']],
              ['POUR LES CLASSES', 'Pack Enseignant', 'Formule annuelle', ['Paquets JSON/CSV', 'Profils d’élèves', 'Rapports PDF hors ligne']]]
    },
    es: {
      s1: ['MODO DÚO EN LA MESA', 'Dos mentes.\nUn dispositivo.', 'Déjalo plano entre los dos. La mitad del alumno gira 180° hacia él.'],
      s2: ['POSTURAS ADAPTATIVAS', 'Cerrado, plano\no en duelo.', 'Cada postura es una app: repaso solo, análisis y duelo en directo.'],
      s3: ['INTERFAZ ASIMÉTRICA', 'El tutor ve la respuesta.\nEl alumno no.', 'Dos pantallas distintas, nunca en espejo. Pistas y puntos se quedan en tu lado.'],
      s4: ['100 % SIN CONEXIÓN', 'Tu voz nunca\nsale del móvil.', 'La pronunciación se evalúa en el dispositivo.'],
      s5: ['3 SESIONES GRATIS', 'Paga una vez\no enseña.', 'Todo desbloqueado en tus 3 primeras partidas a dos. Sin cuenta.'],
      postures: [['Cerrado', 'Tarjetas en solitario'], ['Abierto', 'Panel de análisis'], ['Mesa', 'Duelo a dos']],
      roles: ['Mitad A · Tutor', 'Mitad B · Alumno'],
      privacy: [['Voz evaluada en el móvil', 'El audio no sale del iPhone'], ['Almacenamiento cifrado', 'SwiftData + CryptoKit'], ['Sin anuncios ni rastreo', 'Sin cuenta. Sin servidores.'], ['Funciona en modo avión', 'Todos los mazos incluidos']],
      plans: [['PRUEBA GRATIS', '3 partidas a dos', 'Todo desbloqueado', []],
              ['MEJOR VALOR', 'Pro de por vida', 'Pago único · sin suscripción', ['Duelos ilimitados', 'Todos los mazos', 'Apple Watch y widgets']],
              ['PARA AULAS', 'Pack Docente', 'Plan anual', ['Mazos JSON/CSV', 'Perfiles de alumnos', 'Informes PDF sin conexión']]]
    },
    ja: {
      s1: ['テーブルトップモード', '2人の頭脳。\n1台のデバイス。', '2人の間に平らに置くだけ。生徒側は180°回転して向かい合えます。'],
      s2: ['3つの姿勢', '閉じる、開く、\n向かい合う。', '姿勢ごとに別のアプリ：1人練習、分析、2人対戦。'],
      s3: ['役割別の非対称UI', '先生には答え。\n生徒には問題。', '鏡写しではない2つの画面。ヒントも採点も先生側だけに。'],
      s4: ['完全オフライン', 'あなたの声は\n端末の外に出ない。', '発音の採点はすべて端末内で完結します。'],
      s5: ['3回まで無料', '買い切りか、\nクラスで使うか。', '最初の3回の2人対戦は全機能が無料。アカウント不要。'],
      postures: [['閉じる', '1人で単語カード'], ['開く', '分析ビュー'], ['テーブル', '2人で対戦']],
      roles: ['A面・先生', 'B面・生徒'],
      privacy: [['端末内で発音採点', '音声はiPhoneの外に出ません'], ['暗号化して保存', 'SwiftData + CryptoKit'], ['広告・追跡なし', 'アカウントもサーバーもなし'], ['機内モードでも使える', '全デッキをアプリに内蔵']],
      plans: [['無料体験', '2人対戦3回', '全機能を開放', []],
              ['おすすめ', 'Pro 買い切り', '1回の購入・サブスクなし', ['対戦し放題', '全言語デッキ', 'Apple Watchとウィジェット']],
              ['教室向け', 'ティーチャーパック', '年額プラン', ['JSON/CSVデッキ', '生徒プロフィール', 'オフラインPDFレポート']]]
    },
    ar: {
      s1: ['وضع الطاولة الثنائي', 'عقلان.\nجهاز واحد.', 'ضعه مسطحًا بينكما، ويستدير نصف المتعلّم 180° ليواجهه.'],
      s2: ['وضعيات تكيّفية', 'مغلق، مسطح\nأو مواجهة.', 'كل وضعية تطبيق مستقل: تدريب فردي، تحليل، ومباراة مباشرة.'],
      s3: ['واجهة حسب الدور', 'المعلّم يرى الإجابة.\nالمتعلّم لا يراها.', 'شاشتان مختلفتان دون انعكاس. التلميحات والتقييم في جهتك فقط.'],
      s4: ['بدون إنترنت 100%', 'صوتك لا يغادر\nجهازك أبدًا.', 'يُقيَّم النطق على الجهاز نفسه.'],
      s5: ['3 جلسات مجانًا', 'ادفع مرة واحدة\nأو درّس فصلًا.', 'كل الميزات مفتوحة في أول 3 جلسات. بدون حساب.'],
      postures: [['مغلق', 'بطاقات فردية'], ['مفتوح', 'لوحة التحليل'], ['الطاولة', 'مباراة لشخصين']],
      roles: ['النصف أ · المعلّم', 'النصف ب · المتعلّم'],
      privacy: [['تقييم النطق على الجهاز', 'الصوت يبقى على iPhone'], ['تخزين مشفّر', 'SwiftData + CryptoKit'], ['بلا إعلانات ولا تتبّع', 'بلا حساب ولا خوادم'], ['يعمل في وضع الطيران', 'كل المجموعات داخل التطبيق']],
      plans: [['تجربة مجانية', '3 جلسات ثنائية', 'كل الميزات مفتوحة', []],
              ['الأفضل قيمة', 'Pro مدى الحياة', 'شراء لمرة واحدة · بلا اشتراك', ['مباريات غير محدودة', 'كل مجموعات اللغات', 'Apple Watch والأدوات']],
              ['للفصول', 'حزمة المعلّم', 'خطة سنوية', ['مجموعات JSON/CSV', 'ملفات الطلاب', 'تقارير PDF دون اتصال']]]
    }
  };

  let RTL = false, LANG = 'en', SKIP_HEAD = false;
  const mx = (x, w = 0) => RTL ? BW - x - w : x;

  /* ---------- primitives ---------- */
  function rr(ctx, x, y, w, h, r) { ctx.beginPath(); ctx.roundRect(x, y, w, h, r); }
  function fillRR(ctx, x, y, w, h, r, fill) { rr(ctx, x, y, w, h, r); ctx.fillStyle = fill; ctx.fill(); }
  function strokeRR(ctx, x, y, w, h, r, stroke, lw = 2) { rr(ctx, x, y, w, h, r); ctx.strokeStyle = stroke; ctx.lineWidth = lw; ctx.stroke(); }
  function text(ctx, s, x, y, { size = 40, weight = 700, color = C.fg, align = 'left', base = 'alphabetic' } = {}) {
    ctx.font = `${weight} ${size}px ${FONT}`; ctx.fillStyle = color; ctx.textAlign = align; ctx.textBaseline = base;
    ctx.direction = 'ltr'; ctx.fillText(s, x, y);
  }
  /* Caption text: mirrors for Arabic. */
  function ctext(ctx, s, x, y, o = {}) {
    if (RTL && (o.align || 'left') === 'left') { ctx.save(); text(ctx, '', 0, 0, o); ctx.direction = 'rtl'; ctx.textAlign = 'right'; ctx.fillText(s, BW - x, y); ctx.restore(); }
    else text(ctx, s, x, y, o);
  }
  function fitSize(ctx, s, maxW, size, weight) {
    ctx.font = `${weight} ${size}px ${FONT}`;
    while (ctx.measureText(s).width > maxW && size > 20) { size -= 2; ctx.font = `${weight} ${size}px ${FONT}`; }
    return size;
  }
  function wrap(ctx, s, x, y, maxW, lh, o) {
    ctx.font = `${o.weight || 700} ${o.size}px ${FONT}`;
    const cjk = LANG === 'ja';
    const tokens = cjk ? [...s] : s.split(' ');
    const lines = []; let line = '';
    for (const t of tokens) {
      const next = line ? (cjk ? line + t : line + ' ' + t) : t;
      if (ctx.measureText(next).width > maxW && line) { lines.push(line); line = t; } else line = next;
    }
    lines.push(line);
    lines.forEach((l, i) => ctext(ctx, l, x, y + i * lh, o));
    return lines.length * lh;
  }
  function pill(ctx, x, y, label, bg, fg, size = 26, padX = 22, h = 54, mirror = true) {
    ctx.font = `700 ${size}px ${FONT}`; const w = ctx.measureText(label).width + padX * 2;
    const px = mirror ? mx(x, w) : x;
    fillRR(ctx, px, y, w, h, h / 2, bg);
    ctx.save(); text(ctx, '', 0, 0, { size }); ctx.direction = RTL ? 'rtl' : 'ltr';
    ctx.fillStyle = fg; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(label, px + w / 2, y + h / 2 + 1); ctx.restore();
    return w;
  }
  function button(ctx, x, y, w, h, label, bg, fg = '#fff', size = 28) {
    fillRR(ctx, x, y, w, h, 18, bg); text(ctx, label, x + w / 2, y + h / 2 + 1, { size, weight: 700, color: fg, align: 'center', base: 'middle' });
  }
  function glow(ctx, x, y, r, color) {
    const g = ctx.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, color); g.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = g; ctx.fillRect(x - r, y - r, r * 2, r * 2);
  }
  function background(ctx, W, H) {
    ctx.fillStyle = C.bg; ctx.fillRect(0, 0, W, H);
    glow(ctx, W * 0.15, H * 0.18, W * 0.75, 'rgba(99,102,241,0.38)');
    glow(ctx, W * 0.9, H * 0.82, W * 0.75, 'rgba(16,185,129,0.24)');
    ctx.globalAlpha = 0.05; ctx.strokeStyle = '#fff'; ctx.lineWidth = 1;
    for (let x = 0; x < W; x += 86) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
    for (let y = 0; y < H; y += 86) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }
    ctx.globalAlpha = 1;
  }
  function headline(ctx, [kicker, title, sub]) {
    if (SKIP_HEAD) return;
    pill(ctx, 90, 170, kicker, 'rgba(99,102,241,0.2)', '#C7C8FF', 30, 26, 62);
    const lines = title.split('\n');
    let size = 132; for (const l of lines) size = Math.min(size, fitSize(ctx, l, 1110, 132, 900));
    const lh = Math.round(size * 1.13);
    const g = ctx.createLinearGradient(90, 0, 1200, 0); g.addColorStop(0, '#FFFFFF'); g.addColorStop(1, '#C4B5FD');
    lines.forEach((l, i) => {
      ctx.font = `900 ${size}px ${FONT}`; ctx.fillStyle = g; ctx.textBaseline = 'alphabetic';
      ctx.direction = RTL ? 'rtl' : 'ltr'; ctx.textAlign = RTL ? 'right' : 'left';
      ctx.fillText(l, RTL ? BW - 86 : 86, 250 + lh * (i + 1));
    });
    const y = 250 + lh * lines.length + 70;
    wrap(ctx, sub, 90, y, 1100, 60, { size: 44, weight: 500, color: C.muted });
  }
  function device(ctx, x, y, w, h, r = 90) {
    ctx.save(); ctx.shadowColor = 'rgba(0,0,0,0.6)'; ctx.shadowBlur = 80; ctx.shadowOffsetY = 40;
    fillRR(ctx, x, y, w, h, r, '#1D1D24'); ctx.restore();
    strokeRR(ctx, x, y, w, h, r, '#3A3A48', 4);
    const i = 24; fillRR(ctx, x + i, y + i, w - i * 2, h - i * 2, r - i, '#000');
    return { x: x + i, y: y + i, w: w - i * 2, h: h - i * 2, r: r - i };
  }
  function waveform(ctx, x, y, w, h, color, seed = 1) {
    const n = 46, bw = w / n;
    for (let i = 0; i < n; i++) {
      const v = Math.abs(Math.sin(i * 0.42 * seed) * Math.cos(i * 0.13 + seed)) * 0.85 + 0.12;
      const bh = v * h; fillRR(ctx, x + i * bw, y + (h - bh) / 2, bw * 0.62, bh, 4, color);
    }
  }
  function mic(ctx, cx, cy, r, color) {
    ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.fillStyle = color; ctx.fill();
    fillRR(ctx, cx - r * 0.18, cy - r * 0.48, r * 0.36, r * 0.62, r * 0.18, '#fff');
    ctx.strokeStyle = '#fff'; ctx.lineWidth = r * 0.08; ctx.beginPath(); ctx.arc(cx, cy - r * 0.05, r * 0.32, 0.1 * Math.PI, 0.9 * Math.PI); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cx, cy + r * 0.27); ctx.lineTo(cx, cy + r * 0.45); ctx.stroke();
  }

  /* ---------- in-app UIs (the app's own German demo deck, same in every locale) ---------- */
  function learnerUI(ctx, x, y, w, h) {
    const s = w / 940, bh = h / s; ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
    fillRR(ctx, 0, 0, 940, bh, 0, '#151030');
    const o = Math.max(40, (bh - 760) / 2);
    text(ctx, 'LEARNER', 50, o + 40, { size: 30, weight: 800, color: '#A5B4FC' });
    text(ctx, '×3', 760, o + 44, { size: 46, weight: 900, color: C.orange, align: 'right' });
    fillRR(ctx, 790, o, 110, 56, 28, 'rgba(255,255,255,0.1)'); text(ctx, '18s', 845, o + 29, { size: 28, align: 'center', base: 'middle' });
    text(ctx, 'wanderlust', 470, o + 190, { size: 96, weight: 900, align: 'center' });
    ['Fernweh', 'Heimweh', 'Fernseher', 'Weltschmerz'].forEach((t, i) => {
      const bx = 50 + (i % 2) * 430, by = o + 260 + Math.floor(i / 2) * 130;
      fillRR(ctx, bx, by, 410, 110, 24, i === 0 ? 'rgba(99,102,241,0.35)' : 'rgba(255,255,255,0.07)');
      if (i === 0) strokeRR(ctx, bx, by, 410, 110, 24, C.indigo, 4);
      text(ctx, t, bx + 205, by + 56, { size: 40, weight: 700, align: 'center', base: 'middle' });
    });
    mic(ctx, 470, o + 640, 70, C.indigo);
    ctx.restore();
  }
  function tutorUI(ctx, x, y, w, h) {
    const s = w / 940, bh = h / s; ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
    fillRR(ctx, 0, 0, 940, bh, 0, '#0E1517');
    const o = Math.max(40, (bh - 760) / 2);
    text(ctx, 'TUTOR', 50, o + 40, { size: 30, weight: 800, color: C.mint });
    fillRR(ctx, 650, o, 240, 56, 28, 'rgba(255,255,255,0.08)');
    text(ctx, 'T 24', 700, o + 30, { size: 30, weight: 800, color: C.mint, base: 'middle' });
    text(ctx, 'L 60', 790, o + 30, { size: 30, weight: 800, color: '#A5B4FC', base: 'middle' });
    text(ctx, 'wanderlust', 50, o + 160, { size: 72, weight: 900 });
    text(ctx, 'Round 4/10', 890, o + 150, { size: 28, weight: 600, color: C.muted, align: 'right' });
    fillRR(ctx, 50, o + 200, 840, 130, 24, 'rgba(52,211,153,0.12)');
    text(ctx, 'ANSWER KEY', 80, o + 245, { size: 24, weight: 800, color: C.mint });
    text(ctx, 'Fernweh', 80, o + 305, { size: 54, weight: 800 });
    text(ctx, '/ˈfɛʁnˌveː/', 860, o + 302, { size: 36, weight: 500, color: C.muted, align: 'right' });
    text(ctx, '💡  Starts with “F”', 50, o + 400, { size: 34, weight: 600, color: C.yellow });
    button(ctx, 50, o + 450, 260, 92, 'Trigger Hint', 'rgba(255,255,255,0.1)');
    button(ctx, 330, o + 450, 560, 92, 'Grade Pronunciation  ·  92%', 'rgba(99,102,241,0.85)');
    button(ctx, 50, o + 570, 260, 92, '✓ Correct', '#059669');
    button(ctx, 330, o + 570, 260, 92, '✕ Wrong', '#DC2626');
    button(ctx, 610, o + 570, 280, 92, 'Next →', 'rgba(255,255,255,0.1)');
    ctx.restore();
  }
  function soloUI(ctx, x, y, w, h) {
    const s = w / 600; ctx.save(); ctx.translate(x, y); ctx.scale(s, s); const bh = h / s;
    fillRR(ctx, 0, 0, 600, bh, 0, '#0F0F16');
    text(ctx, '🔥 12', 40, 90, { size: 44, weight: 800, color: C.orange });
    text(ctx, 'day streak', 170, 88, { size: 28, weight: 600, color: C.muted });
    const g = ctx.createLinearGradient(0, 160, 0, 760); g.addColorStop(0, '#6366F1'); g.addColorStop(1, '#4338CA');
    fillRR(ctx, 40, 150, 520, bh - 420, 40, g);
    text(ctx, 'gemütlich', 300, 150 + (bh - 420) / 2, { size: 64, weight: 900, align: 'center', base: 'middle' });
    text(ctx, 'Tap to flip', 300, 150 + (bh - 420) / 2 + 70, { size: 26, weight: 600, color: 'rgba(255,255,255,0.7)', align: 'center' });
    [['Again', '#DC2626'], ['Hard', '#EA580C'], ['Good', '#16A34A'], ['Easy', '#0D9488']]
      .forEach(([t, c], i) => button(ctx, 40 + i * 132, bh - 230, 120, 80, t, c, '#fff', 24));
    ctx.restore();
  }
  function openUI(ctx, x, y, w, h) {
    const s = w / 1200; ctx.save(); ctx.translate(x, y); ctx.scale(s, s); const bh = h / s;
    fillRR(ctx, 0, 0, 1200, bh, 0, '#0F0F16'); fillRR(ctx, 0, 0, 300, bh, 0, '#14141D');
    ['Fernweh', 'gemütlich', 'Haus', 'Wasser', 'Freund', 'lernen', 'Buch'].forEach((t, i) => {
      if (i === 0) fillRR(ctx, 16, 30 + i * 96, 268, 84, 16, 'rgba(99,102,241,0.3)');
      text(ctx, t, 40, 84 + i * 96, { size: 32, weight: 700 });
      ctx.beginPath(); ctx.arc(260, 74 + i * 96, 9, 0, 7); ctx.fillStyle = ['#10B981', C.orange, '#10B981', C.red][i % 4]; ctx.fill();
    });
    const pw = 420, ph = (bh - 90) / 2;
    [[330, 30], [780, 30], [330, 60 + ph], [780, 60 + ph]].forEach(([px, py]) => fillRR(ctx, px, py, pw, ph, 26, 'rgba(255,255,255,0.06)'));
    text(ctx, 'Fernweh', 360, 120, { size: 58, weight: 900 }); text(ctx, '/ˈfɛʁnˌveː/', 360, 175, { size: 30, weight: 500, color: C.muted });
    text(ctx, 'GRAMMAR', 810, 90, { size: 22, weight: 800, color: '#A5B4FC' }); text(ctx, 'das Fernweh · neuter', 810, 135, { size: 28, weight: 600 });
    text(ctx, 'ORIGIN', 810, 195, { size: 22, weight: 800, color: '#A5B4FC' }); text(ctx, 'fern + Weh', 810, 240, { size: 28, weight: 600 });
    waveform(ctx, 360, 90 + ph, 360, 90, C.mint, 1.3); waveform(ctx, 360, 200 + ph, 360, 90, C.indigo, 1.1);
    for (let wk = 0; wk < 10; wk++) for (let d = 0; d < 7; d++) {
      const a = (Math.sin(wk * 1.7 + d * 2.3) + 1) / 2; fillRR(ctx, 810 + wk * 36, 90 + ph + d * 36, 28, 28, 6, `rgba(16,185,129,${0.15 + a * 0.8})`);
    }
    ctx.restore();
  }
  /* ---------- slides (drawn in the 1290×2796 base space) ---------- */
  const SLIDES = [
    function s1(ctx, L) {
      headline(ctx, L.s1);
      const d = device(ctx, 150, 1040, 990, 1640, 96);
      const half = (d.h - 14) / 2;
      ctx.save(); rr(ctx, d.x, d.y, d.w, d.h, d.r); ctx.clip();
      ctx.save(); ctx.translate(d.x + d.w, d.y + half); ctx.rotate(Math.PI); learnerUI(ctx, 0, 0, d.w, half); ctx.restore();
      const cg = ctx.createLinearGradient(0, d.y + half, 0, d.y + half + 14); cg.addColorStop(0, '#000'); cg.addColorStop(.5, '#3a3a48'); cg.addColorStop(1, '#000');
      ctx.fillStyle = cg; ctx.fillRect(d.x, d.y + half, d.w, 14);
      tutorUI(ctx, d.x, d.y + half + 14, d.w, half);
      ctx.restore();
      pill(ctx, 960, 985, '↻ 180°', C.indigo, '#fff', 30, 24, 64, false);
    },
    function s2(ctx, L) {
      headline(ctx, L.s2);
      let d = device(ctx, 90, 1050, 440, 880, 70); soloUI(ctx, d.x, d.y, d.w, d.h);
      d = device(ctx, 590, 1110, 610, 820, 60); openUI(ctx, d.x, d.y, d.w, d.h);
      const caps = [[310, 1990], [895, 1990]];
      caps.forEach(([cx, cy], i) => {
        text(ctx, L.postures[i][0], cx, cy, { size: 46, weight: 800, align: 'center' });
        text(ctx, L.postures[i][1], cx, cy + 55, { size: 30, weight: 500, color: C.muted, align: 'center' });
      });
      const bx = 300, by = 2420, bw = 690;
      ctx.beginPath(); ctx.moveTo(bx, by); ctx.lineTo(bx + bw, by); ctx.lineTo(bx + bw + 110, by + 200); ctx.lineTo(bx - 110, by + 200); ctx.closePath();
      ctx.fillStyle = '#1D1D24'; ctx.fill(); ctx.strokeStyle = '#3A3A48'; ctx.lineWidth = 4; ctx.stroke();
      ctx.beginPath(); ctx.moveTo(bx + 20, by + 14); ctx.lineTo(bx + bw - 20, by + 14); ctx.lineTo(bx + bw + 80, by + 186); ctx.lineTo(bx - 80, by + 186); ctx.closePath();
      const tg = ctx.createLinearGradient(0, by, 0, by + 200); tg.addColorStop(0, '#0E1517'); tg.addColorStop(1, '#10302a'); ctx.fillStyle = tg; ctx.fill();
      text(ctx, 'TUTOR', bx + bw / 2, by + 110, { size: 34, weight: 900, color: C.mint, align: 'center' });
      fillRR(ctx, bx, by - 330, bw, 340, 30, '#1D1D24'); strokeRR(ctx, bx, by - 330, bw, 340, 30, '#3A3A48', 4);
      fillRR(ctx, bx + 18, by - 312, bw - 36, 304, 18, '#151030');
      text(ctx, 'LEARNER', bx + bw / 2, by - 200, { size: 34, weight: 900, color: '#A5B4FC', align: 'center' });
      text(ctx, 'wanderlust', bx + bw / 2, by - 120, { size: 56, weight: 900, align: 'center' });
      text(ctx, L.postures[2][0], 645, 2700, { size: 46, weight: 800, align: 'center' });
      text(ctx, L.postures[2][1], 645, 2752, { size: 30, weight: 500, color: C.muted, align: 'center' });
    },
    function s3(ctx, L) {
      headline(ctx, L.s3);
      let d = device(ctx, 60, 1100, 570, 1520, 70); tutorUI(ctx, d.x, d.y, d.w, d.h);
      d = device(ctx, 660, 1100, 570, 1520, 70); learnerUI(ctx, d.x, d.y, d.w, d.h);
      const a = L.roles[0], b = L.roles[1];
      ctx.font = `700 32px ${FONT}`;
      const wa = ctx.measureText('🔑  ' + a).width + 52, wb = ctx.measureText('🎯  ' + b).width + 52;
      pill(ctx, 345 - wa / 2, 2660, '🔑  ' + a, 'rgba(16,185,129,0.2)', C.mint, 32, 26, 70, false);
      pill(ctx, 945 - wb / 2, 2660, '🎯  ' + b, 'rgba(99,102,241,0.25)', '#C7C8FF', 32, 26, 70, false);
    },
    function s4(ctx, L) {
      headline(ctx, L.s4);
      const cx = 645, cy = 1400;
      ctx.save(); ctx.beginPath(); ctx.moveTo(cx, cy - 280); ctx.quadraticCurveTo(cx + 230, cy - 215, cx + 245, cy - 185);
      ctx.quadraticCurveTo(cx + 245, cy + 130, cx, cy + 280); ctx.quadraticCurveTo(cx - 245, cy + 130, cx - 245, cy - 185);
      ctx.quadraticCurveTo(cx - 230, cy - 215, cx, cy - 280); ctx.closePath();
      const sg = ctx.createLinearGradient(cx - 245, cy - 280, cx + 245, cy + 280); sg.addColorStop(0, C.indigo); sg.addColorStop(1, '#10B981');
      ctx.fillStyle = sg; ctx.shadowColor = 'rgba(99,102,241,0.6)'; ctx.shadowBlur = 120; ctx.fill(); ctx.restore();
      waveform(ctx, cx - 160, cy - 65, 320, 130, 'rgba(255,255,255,0.95)', 1.2);
      const icons = ['🎙️', '🔐', '🚫', '✈️'];
      L.privacy.forEach(([t, s], i) => {
        const y = 1800 + i * 230; fillRR(ctx, 90, y, 1110, 200, 36, 'rgba(255,255,255,0.06)'); strokeRR(ctx, 90, y, 1110, 200, 36, 'rgba(255,255,255,0.08)', 2);
        text(ctx, icons[i], mx(150, 80), y + 125, { size: 70, weight: 400 });
        const ts = fitSize(ctx, t, 860, 46, 800);
        ctext(ctx, t, 270, y + 92, { size: ts, weight: 800 }); ctext(ctx, s, 270, y + 148, { size: 32, weight: 500, color: C.muted });
      });
    },
    function s5(ctx, L) {
      headline(ctx, L.s5);
      const ys = [[1080, 360], [1490, 590], [2130, 560]];
      L.plans.forEach(([tag, big, sub, bullets], i) => {
        const [y, h] = ys[i], hi = i === 1;
        if (hi) { const g = ctx.createLinearGradient(90, y, 1200, y + h); g.addColorStop(0, 'rgba(99,102,241,0.6)'); g.addColorStop(1, 'rgba(16,185,129,0.38)'); fillRR(ctx, 90, y, 1110, h, 44, g); strokeRR(ctx, 90, y, 1110, h, 44, '#A5B4FC', 4); }
        else { fillRR(ctx, 90, y, 1110, h, 44, 'rgba(255,255,255,0.06)'); strokeRR(ctx, 90, y, 1110, h, 44, 'rgba(255,255,255,0.1)', 2); }
        pill(ctx, 150, y + 50, tag, hi ? '#fff' : 'rgba(255,255,255,0.1)', hi ? '#312E81' : (i === 0 ? C.mint : '#C4B5FD'), 26, 22, 56);
        const bs = fitSize(ctx, big, 990, 104, 900);
        ctext(ctx, big, 150, y + 215, { size: bs, weight: 900 });
        ctext(ctx, sub, 150, y + 285, { size: 38, weight: 700, color: hi ? '#fff' : C.muted });
        bullets.forEach((b, j) => ctext(ctx, '✓  ' + b, 150, y + 370 + j * 60, { size: 36, weight: 600, color: 'rgba(255,255,255,0.92)' }));
      });
    }
  ];

  function render(canvas, index, lang = 'en', deviceName = 'iphone') {
    const [W, H] = DEVICES[deviceName];
    canvas.width = W; canvas.height = H;
    const ctx = canvas.getContext('2d');
    LANG = T[lang] ? lang : 'en'; RTL = LANG === 'ar';
    background(ctx, W, H);
    if (deviceName === 'duo') renderDuo(ctx, index, W, H);
    else {
      const s = Math.min(W / BW, H / BH);
      ctx.save(); ctx.translate((W - BW * s) / 2, (H - BH * s) / 2); ctx.scale(s, s);
      SLIDES[index](ctx, T[LANG]);
      ctx.restore();
    }
    RTL = false; SKIP_HEAD = false;
    return canvas;
  }

  /* iPhone Duo inner display, landscape: caption column + the slide's visual, side by side. */
  function renderDuo(ctx, index, W, H) {
    const L = T[LANG], key = 's' + (index + 1);
    const art = document.createElement('canvas'); art.width = BW; art.height = BH;
    const actx = art.getContext('2d');
    SKIP_HEAD = true; SLIDES[index](actx, L); SKIP_HEAD = false;
    const top = 940, cropH = BH - top, sc = (H - 120) / cropH, aw = BW * sc;
    const ax = RTL ? 90 : W - aw - 90;
    ctx.drawImage(art, 0, top, BW, cropH, ax, (H - cropH * sc) / 2, aw, cropH * sc);
    ctx.save();
    ctx.translate(RTL ? W - BW - 60 : 60, H / 2 - 620);
    headline(ctx, L[key]);
    ctx.restore();
  }

  const api = { render, count: SLIDES.length, langs: Object.keys(T), devices: DEVICES,
                titles: lang => SLIDES.map((_, i) => T[lang].s1 && T[lang]['s' + (i + 1)][1].replace('\n', ' ')) };
  (typeof window !== 'undefined' ? window : globalThis).DuoSlides = api;
})();

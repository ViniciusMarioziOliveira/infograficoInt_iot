/* Q3 — ciclo aberto × fechado, benefícios, fábrica 5G, fatiamento e níveis de dispositivo. */
(function () {
  'use strict';
  const IOT = window.IOT;
  const { $, $$, svg, esc } = IOT;

  /* ---------- FIG 3.1 ciclo + benefícios ---------- */
  function initBenefits() {
    const mini = $('#loopMini'), grid = $('#benGrid');
    if (!mini) return;
    const nodes = [['Sensor', 'i-dots'], ['Rede', 'i-antenna'], ['Nuvem / IA', 'i-spark'], ['Atuador', 'i-factory']];
    mini.innerHTML = `<svg viewBox="0 0 680 168" class="lm" role="img" aria-label="Ciclo sensor, rede, decisão e atuador">
      <defs><marker id="lmArrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" class="lm-arrowhead"/></marker></defs>
      ${nodes.map((n, i) => `<g class="lm-node lm-node--${i}" transform="translate(${22 + i * 172} 18)">
        <rect width="128" height="56" rx="12"/><use href="#${n[1]}" x="12" y="16" width="24" height="24"/>
        <text x="44" y="33">${n[0]}</text></g>`).join('')}
      ${[0, 1, 2].map(i => `<path class="lm-a lm-a--${i}" d="M${154 + i * 172} 46 H${190 + i * 172}" marker-end="url(#lmArrow)"/>`).join('')}
      <path class="lm-back" d="M602 77 C 602 128, 86 128, 86 80" marker-end="url(#lmArrow)"/>
      <text class="lm-cap" x="344" y="158" text-anchor="middle"></text>
    </svg>`;
    const cap = mini.querySelector('.lm-cap');
    function set(m) {
      mini.dataset.m = m;
      cap.textContent = m === '5g' ? 'ciclo fechado pela rede, em milissegundos' : 'ciclo aberto: os dados sobem, a ação fica para depois';
    }
    IOT.seg($('#loopSeg'), 'm', set);
    set('5g');

    grid.innerHTML = IOT.BENEFITS.map((b, i) => `
      <div class="ben">
        <button type="button" class="ben-btn" aria-expanded="false" aria-controls="ben-d-${i}">
          ${IOT.icon(b.icon, 'ben-ico')}<span class="ben-t">${esc(b.t)}</span>
          <span class="ben-tags">${b.p.length === 3 ? '<span class="ptag">todos os pilares</span>' : b.p.map(IOT.ptag).join('')}</span>
          <span class="ben-plus" aria-hidden="true"></span>
        </button>
        <p class="ben-d" id="ben-d-${i}" hidden>${esc(b.d)}</p>
      </div>`).join('');
    $$('.ben-btn', grid).forEach(btn => btn.addEventListener('click', () => {
      const open = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!open));
      btn.nextElementSibling.hidden = open;
    }));
  }

  /* ---------- FIG 3.2 fábrica 5G ---------- */
  function initFactory() {
    const s = $('#fabSvg');
    if (!s) return;
    const T = 9.2, STEPS = IOT.FAB_STEPS;
    const playBtn = $('#fabPlay'), nextBtn = $('#fabNext'), resetBtn = $('#fabReset'), scrub = $('#fabScrub'), list = $('#fabSteps');
    let t = 0, playing = false, stopAt = null, raf = 0, last = 0, autoplayed = false;

    /* --- cena estática --- */
    svg('line', { x1: 0, y1: 400, x2: 820, y2: 400, class: 'fab-floor' }, s);
    const ant = svg('g', { class: 'fab-ant fab-hot', 'data-tip': 'Rede 5G privada|Uma única rede dedicada à fábrica, com controle de cobertura, segurança e dados.' }, s);
    svg('path', { d: 'M392 112 L400 44 L408 112 Z' }, ant);
    svg('circle', { cx: 400, cy: 40, r: 5 }, ant);
    svg('path', { d: 'M388 30a17 17 0 0 1 24 0M382 22a26 26 0 0 1 36 0', class: 'fab-waves' }, ant);
    const antT = svg('text', { x: 400, y: 132, 'text-anchor': 'middle', class: 'fab-l' }, s); antT.textContent = 'REDE 5G PRIVADA';

    const edge = svg('g', { class: 'fab-edge fab-hot', 'data-tip': 'Servidor de borda (MEC)|Processa as imagens dentro da fábrica: a IA responde sem depender de uma nuvem distante.' }, s);
    svg('rect', { x: 586, y: 26, width: 150, height: 92, rx: 10, class: 'fab-box' }, edge);
    svg('rect', { x: 598, y: 38, width: 126, height: 44, rx: 5, class: 'fab-screen' }, edge);
    const scan = svg('rect', { x: 598, y: 38, width: 4, height: 44, class: 'fab-scan' }, edge);
    const scr = svg('text', { x: 661, y: 64, 'text-anchor': 'middle', class: 'fab-scr' }, edge);
    const edgeT = svg('text', { x: 661, y: 104, 'text-anchor': 'middle', class: 'fab-l' }, edge); edgeT.textContent = 'BORDA (MEC) + IA';

    /* esteira */
    svg('rect', { x: 40, y: 318, width: 550, height: 14, rx: 7, class: 'fab-belt' }, s);
    const beltTop = svg('line', { x1: 47, y1: 318, x2: 583, y2: 318, class: 'fab-belt-dash' }, s);
    [70, 560].forEach(x => svg('rect', { x: x - 4, y: 332, width: 8, height: 68, class: 'fab-leg' }, s));
    const rollers = [60, 200, 340, 480, 570].map(x => {
      const g = svg('g', { class: 'fab-roller' }, s);
      svg('circle', { cx: 0, cy: 0, r: 6 }, g);
      svg('line', { x1: -5, y1: 0, x2: 5, y2: 0 }, g);
      return { g, x };
    });
    /* motor + sensor */
    const motor = svg('g', { class: 'fab-motor' }, s);
    svg('rect', { x: 4, y: 300, width: 40, height: 50, rx: 6, class: 'fab-box' }, motor);
    svg('circle', { cx: 24, cy: 325, r: 11, class: 'fab-gear' }, motor);
    const sensor = svg('g', { class: 'fab-sensor fab-hot', 'data-tip': 'Sensor de vibração · mMTC|Um entre milhares de sensores simples e de baixo consumo espalhados pela fábrica.' }, s);
    svg('polygon', { points: '36,284 44,288.5 44,297.5 36,302 28,297.5 28,288.5' }, sensor);
    const sPulse = [0, 1].map(() => svg('circle', { cx: 36, cy: 293, r: 8, class: 'fab-spulse' }, s));
    const senT = svg('text', { x: 10, y: 270, class: 'fab-l fab-l--mmtc' }, s); senT.textContent = 'SENSOR · mMTC';
    /* câmera */
    svg('line', { x1: 330, y1: 150, x2: 330, y2: 202, class: 'fab-pole' }, s);
    svg('line', { x1: 300, y1: 150, x2: 360, y2: 150, class: 'fab-pole' }, s);
    const cone = svg('polygon', { points: '330,224 300,316 360,316', class: 'fab-cone' }, s);
    const cam = svg('g', { class: 'fab-cam fab-hot', 'data-tip': 'Câmera de inspeção · eMBB|Envia imagens em alta resolução para a IA na borda.' }, s);
    svg('rect', { x: 314, y: 202, width: 32, height: 20, rx: 4, class: 'fab-box' }, cam);
    svg('circle', { cx: 330, cy: 222, r: 5, class: 'fab-lens' }, cam);
    const camT = svg('text', { x: 352, y: 196, class: 'fab-l fab-l--embb' }, s); camT.textContent = 'CÂMERA · eMBB';
    /* caixas */
    svg('rect', { x: 566, y: 352, width: 60, height: 48, rx: 4, class: 'fab-crate' }, s);
    const okT = svg('text', { x: 596, y: 380, 'text-anchor': 'middle', class: 'fab-cnt' }, s);
    const okL = svg('text', { x: 596, y: 416, 'text-anchor': 'middle', class: 'fab-l' }, s); okL.textContent = 'APROVADAS';
    svg('rect', { x: 714, y: 340, width: 72, height: 60, rx: 4, class: 'fab-bin' }, s);
    const binL = svg('text', { x: 750, y: 416, 'text-anchor': 'middle', class: 'fab-l fab-l--bad' }, s); binL.textContent = 'REJEITO';
    /* robô */
    svg('rect', { x: 645, y: 248, width: 30, height: 152, rx: 5, class: 'fab-ped' }, s);
    const robot = svg('g', { class: 'fab-robot fab-hot', 'data-tip': 'Robô · URLLC|Recebe o comando crítico com latência de milissegundos e 99,999% de confiabilidade.' }, s);
    const arm1 = svg('line', { class: 'fab-arm' }, robot);
    const arm2 = svg('line', { class: 'fab-arm fab-arm--2' }, robot);
    svg('circle', { cx: 660, cy: 240, r: 9, class: 'fab-joint' }, robot);
    const elbow = svg('circle', { r: 7, class: 'fab-joint' }, robot);
    const grip = svg('path', { class: 'fab-grip' }, robot);
    const robT = svg('text', { x: 690, y: 236, class: 'fab-l fab-l--urllc' }, s); robT.textContent = 'ROBÔ · URLLC';
    const msT = svg('text', { x: 690, y: 220, class: 'fab-ms' }, s); msT.textContent = '≈ 1 ms';

    /* peças */
    const partG = svg('g', null, s);
    const normals = [-7, -6, -5, -4, -3, -2, -1, 1, 2, 3].map(k => {
      const r = svg('rect', { width: 22, height: 14, rx: 3, class: 'fab-part' }, partG);
      return { r, x0: 150 + 115 * k };
    });
    const defG = svg('g', { class: 'fab-def' }, s);
    const defR = svg('rect', { x: -11, y: 0, width: 22, height: 14, rx: 3, class: 'fab-part fab-part--def' }, defG);
    svg('path', { d: 'M-4 1 L1 6 L-2 9 L3 13', class: 'fab-crack' }, defG);

    /* pacotes */
    const pk = svg('g', null, s);
    const P1 = [[36, 293], [400, 44], [600, 70]], P2 = [[330, 204], [400, 44], [600, 70]], P3 = [[600, 70], [400, 44], [660, 250]];
    const p1 = [0, 1, 2, 3, 4, 5].map(i => ({ el: svg('circle', { r: 4.5, class: 'pk pk--mmtc' }, pk), t0: .3 + i * .22, d: .9, path: P1 }));
    const p2 = [0, 1, 2, 3, 4, 5, 6, 7].map(i => ({ el: svg('rect', { width: 18, height: 7, rx: 3.5, x: -9, y: -3.5, class: 'pk pk--embb' }, pk), t0: 2.62 + i * .12, d: .65, path: P2 }));
    const p3 = [{ el: svg('rect', { width: 10, height: 10, x: -5, y: -5, class: 'pk pk--urllc', transform: 'rotate(45)' }, pk), t0: 5.2, d: .25, path: P3 }];
    const pkts = p1.concat(p2, p3);
    const endMsg = svg('g', { class: 'fab-end' }, s);
    svg('rect', { x: 200, y: 150, width: 360, height: 42, rx: 21 }, endMsg);
    const endT = svg('text', { x: 380, y: 176, 'text-anchor': 'middle' }, endMsg); endT.textContent = 'Ciclo completo em uma única rede 5G privada';

    /* tooltips dos elementos */
    $$('.fab-hot', s).forEach(g => {
      const [a, b] = g.dataset.tip.split('|');
      const html = `<b>${esc(a)}</b>${esc(b)}`;
      g.addEventListener('mouseenter', e => IOT.tip.show(html, e.clientX, e.clientY));
      g.addEventListener('mousemove', e => IOT.tip.show(html, e.clientX, e.clientY));
      g.addEventListener('mouseleave', () => IOT.tip.hide());
    });

    /* --- utilidades de animação --- */
    function along(path, k) {
      const segs = [];
      let total = 0;
      for (let i = 1; i < path.length; i++) { const l = Math.hypot(path[i][0] - path[i - 1][0], path[i][1] - path[i - 1][1]); segs.push(l); total += l; }
      let d = k * total;
      for (let i = 0; i < segs.length; i++) {
        if (d <= segs[i] || i === segs.length - 1) { const f = segs[i] ? Math.min(1, d / segs[i]) : 0; return [IOT.lerp(path[i][0], path[i + 1][0], f), IOT.lerp(path[i][1], path[i + 1][1], f)]; }
        d -= segs[i];
      }
      return path[path.length - 1];
    }
    const S = { x: 660, y: 240 }, L1 = 78, L2 = 72;
    function ik(tx, ty) {
      const dx = tx - S.x, dy = ty - S.y;
      const d = IOT.clamp(Math.hypot(dx, dy), Math.abs(L1 - L2) + 1, L1 + L2 - 1);
      const th = Math.atan2(dy, dx);
      const e = Math.acos(IOT.clamp((d * d - L1 * L1 - L2 * L2) / (2 * L1 * L2), -1, 1));
      const off = Math.atan2(L2 * Math.sin(e), L1 + L2 * Math.cos(e));
      const c1 = { x: S.x + L1 * Math.cos(th - off), y: S.y + L1 * Math.sin(th - off) };
      const c2 = { x: S.x + L1 * Math.cos(th + off), y: S.y + L1 * Math.sin(th + off) };
      const el = c1.y < c2.y ? c1 : c2;
      const a = Math.atan2(ty - el.y, tx - el.x);
      return { el, w: { x: el.x + L2 * Math.cos(a), y: el.y + L2 * Math.sin(a) } };
    }
    const IDLE = [620, 170], PICK_T = 5.9, PICK = [150 + 70 * PICK_T, 300], LIFT = [640, 200], ABOVE = [750, 290], DROP = [750, 322];
    const KEYS = [[5.45, IDLE], [PICK_T, PICK], [6.5, LIFT], [7.2, ABOVE], [7.5, DROP], [7.8, DROP], [8.6, IDLE]];
    function target(tt) {
      if (tt <= KEYS[0][0]) return IDLE;
      for (let i = 1; i < KEYS.length; i++) {
        if (tt <= KEYS[i][0]) {
          const [ta, a] = KEYS[i - 1], [tb, b] = KEYS[i];
          const e = IOT.ease((tt - ta) / (tb - ta));
          return [IOT.lerp(a[0], b[0], e), IOT.lerp(a[1], b[1], e)];
        }
      }
      return IDLE;
    }

    /* --- renderização pura em função de t --- */
    function render() {
      beltTop.style.strokeDashoffset = String(-70 * t);
      rollers.forEach(r => r.g.setAttribute('transform', `translate(${r.x} 325) rotate(${(t * 240) % 360})`));
      const vib = t > .2 && t < 2.4 ? Math.sin(t * 95) * 1.6 : 0;
      motor.setAttribute('transform', `translate(${vib.toFixed(2)} 0)`);
      sensor.setAttribute('transform', `translate(${vib.toFixed(2)} 0)`);
      sPulse.forEach((c, i) => {
        const k = ((t * 1.4) + i * .5) % 1;
        const on = t > .2 && t < 2.4;
        c.setAttribute('r', 8 + k * 22);
        c.style.opacity = on ? String((1 - k) * .8) : '0';
      });
      let passed = 0;
      normals.forEach(n => {
        const x = n.x0 + 70 * t;
        let y = 304, op = 1;
        if (x > 600) passed++;
        if (x < 40 || x >= 632) op = 0;
        else if (x > 590) { y = 304 + (x - 590) * 1.5; op = 1 - (x - 590) / 42; }
        n.r.setAttribute('x', (x - 11).toFixed(1)); n.r.setAttribute('y', y.toFixed(1));
        n.r.style.opacity = String(op);
      });
      okT.textContent = String(36 + passed);
      /* robô e peça defeituosa */
      const tg = target(t);
      const k = ik(tg[0], tg[1]);
      arm1.setAttribute('x1', S.x); arm1.setAttribute('y1', S.y); arm1.setAttribute('x2', k.el.x); arm1.setAttribute('y2', k.el.y);
      arm2.setAttribute('x1', k.el.x); arm2.setAttribute('y1', k.el.y); arm2.setAttribute('x2', k.w.x); arm2.setAttribute('y2', k.w.y);
      elbow.setAttribute('cx', k.el.x); elbow.setAttribute('cy', k.el.y);
      const closed = t >= PICK_T && t < 7.5;
      const o = closed ? 9 : 14;
      grip.setAttribute('d', `M${k.w.x - o} ${k.w.y + 12} V${k.w.y} H${k.w.x + o} V${k.w.y + 12}`);
      let dx, dy;
      if (t < PICK_T) { dx = 150 + 70 * t; dy = 304; }
      else if (t < 7.5) { dx = k.w.x; dy = k.w.y + 3; }
      else { const f = IOT.clamp((t - 7.5) / .3, 0, 1); dx = 750; dy = IOT.lerp(325, 372, f * f); }
      defG.setAttribute('transform', `translate(${dx.toFixed(1)} ${dy.toFixed(1)})`);
      defR.classList.toggle('is-flag', t >= 4.6);
      /* câmera e borda */
      const flash = t > 2.5 && t < 2.75;
      cone.classList.toggle('on', t > 2.45 && t < 4.0);
      cam.classList.toggle('flash', flash);
      const scanning = t >= 4.0 && t < 4.6;
      scan.style.opacity = scanning ? '1' : '0';
      scan.setAttribute('x', 598 + ((t - 4) * 400 % 122));
      scr.classList.toggle('is-bad', t >= 4.6 && t < 5.45);
      scr.textContent = t < .3 ? 'aguardando dados' : t < 2.45 ? 'vibração fora do padrão' : t < 4 ? 'recebendo vídeo…' : t < 4.6 ? 'IA analisando…' : t < 5.45 ? 'DEFEITO CONFIRMADO' : t < 8.6 ? 'comando enviado ao robô' : 'linha normalizada';
      msT.style.opacity = t >= 5.42 && t < 6.6 ? '1' : '0';
      pkts.forEach(p => {
        const kk = (t - p.t0) / p.d;
        if (kk < 0 || kk > 1) { p.el.style.opacity = '0'; return; }
        const [x, y] = along(p.path, kk);
        p.el.style.opacity = '1';
        const rot = p.path === P3 ? ' rotate(45)' : '';
        p.el.setAttribute('transform', `translate(${x.toFixed(1)} ${y.toFixed(1)})${rot}`);
      });
      endMsg.style.opacity = t >= 8.6 ? '1' : '0';
      /* passos */
      $$('li', list).forEach((li, i) => {
        const st = STEPS[i];
        li.classList.toggle('is-now', t >= st.t0 && t < st.t1);
        li.classList.toggle('is-done', t >= st.t1);
      });
      scrub.value = String(Math.round(t / T * 1000));
    }

    list.innerHTML = STEPS.map((st, i) => `<li><button type="button" data-i="${i}">
      <span class="fs-n">${i + 1}</span><span class="fs-b"><span class="fs-t">${esc(st.t)}</span>
      ${st.p === 'mec' ? '<span class="ptag">borda + IA</span>' : IOT.ptag(st.p)}
      <span class="fs-d">${esc(st.d)}</span></span></button></li>`).join('');
    $$('button', list).forEach(b => b.addEventListener('click', () => { t = STEPS[+b.dataset.i].t0 + .001; stopAt = STEPS[+b.dataset.i].t1; play(true); }));

    /* em telas estreitas a cena rola sozinha para mostrar onde a ação está */
    const wrap = $('#fabWrap');
    function follow() {
      if (!wrap || wrap.scrollWidth <= wrap.clientWidth + 4) return;
      const fx = t < 2.4 ? 120 : t < 4 ? 360 : t < 5.2 ? 640 : 700;
      const goal = IOT.clamp(fx / 820 * wrap.scrollWidth - wrap.clientWidth / 2, 0, wrap.scrollWidth - wrap.clientWidth);
      wrap.scrollLeft += (goal - wrap.scrollLeft) * .08;
    }
    function setPlayUI() {
      playBtn.querySelector('use').setAttribute('href', playing ? '#i-pause' : '#i-play');
      playBtn.querySelector('span').textContent = playing ? 'Pausar' : (t >= T ? 'Repetir' : 'Reproduzir');
    }
    function loop(now) {
      const dt = Math.max(0, Math.min(.05, (now - last) / 1000)); last = now;
      t += dt;
      if (stopAt != null && t >= stopAt) { t = stopAt; stopAt = null; playing = false; }
      if (t >= T) { t = T; playing = false; }
      render();
      follow();
      setPlayUI();
      raf = playing ? requestAnimationFrame(loop) : 0;
    }
    function play(on) {
      playing = on;
      if (on && t >= T) t = 0;
      if (on && !raf) { last = performance.now(); raf = requestAnimationFrame(loop); }
      setPlayUI();
    }
    playBtn.addEventListener('click', () => { stopAt = null; play(!playing); });
    nextBtn.addEventListener('click', () => {
      if (t >= T) t = 0;
      const nxt = STEPS.find(st => st.t1 > t + .01);
      stopAt = nxt ? nxt.t1 : T;
      play(true);
    });
    resetBtn.addEventListener('click', () => { playing = false; stopAt = null; t = 0; render(); setPlayUI(); });
    scrub.addEventListener('input', () => { playing = false; stopAt = null; t = +scrub.value / 1000 * T; render(); setPlayUI(); });

    render();
    setPlayUI();
    IOT.onVisible(s, () => { if (!autoplayed && !IOT.reduced) { autoplayed = true; play(true); } }, .5);
  }

  document.addEventListener('DOMContentLoaded', () => {
    initBenefits();
    initFactory();
    if (IOT.initSlicing) IOT.initSlicing();
    if (IOT.initTiers) IOT.initTiers();
  });

  /* ---------- FIG 3.3 fatiamento ao vivo ---------- */
  IOT.initSlicing = function () {
    const cv = $('#sliceCanvas'), stats = $('#sliceStats'), msg = $('#sliceMsg'), burstBtn = $('#sliceBurst');
    if (!cv) return;
    const CL = {
      m: { name: 'Medidores', p: 'mmtc', len: 6, gap: 5, every: .11, lanes: [0] },
      e: { name: 'Câmeras', p: 'embb', len: 46, gap: 6, every: .55, lanes: [1, 2] },
      u: { name: 'Robôs', p: 'urllc', len: 10, gap: 6, every: .65, lanes: [3] }
    };
    const V = 240, DEADLINE = .06, BURST = 2.5;
    let mode = 'sliced', simT = 0, burstLeft = 0, raf = 0, last = 0, visible = false, paused = false;
    let ctx, W, H, P0, P1, top, laneH, srcW, col = {};
    let queues = { m: [], e: [], u: [], all: [] }, inPipe = [], lastIn = [null, null, null, null];
    const acc = { m: 0, e: 0, u: 0 };
    let urHist = [], uiT = 0;

    function readColors() {
      col = { ink: IOT.color('--ink'), muted: IOT.color('--muted'), line: IOT.color('--line'), line2: IOT.color('--line-2'), s2: IOT.color('--surface-2'), s3: IOT.color('--surface-3'), surface: IOT.color('--surface'), bad: IOT.color('--bad'), mmtc: IOT.color('--mmtc'), embb: IOT.color('--embb'), urllc: IOT.color('--urllc') };
    }
    function setup() {
      const narrow = cv.parentElement.clientWidth < 560;
      const h = narrow ? 260 : 300;
      cv.style.height = h + 'px';
      const r = IOT.fitCanvas(cv, h);
      ctx = r.ctx; W = r.w; H = r.h;
      srcW = narrow ? 64 : 150;
      P0 = srcW + (narrow ? 70 : 150);
      P1 = W - (narrow ? 44 : 96);
      top = 30; laneH = (H - 60) / 4;
    }
    const laneY = i => top + laneH * (i + .5);
    const qY = c => (mode === 'shared' ? top + laneH * 2 : (c === 'e' ? top + laneH * 2 : laneY(CL[c].lanes[0])));
    const srcY = c => (c === 'm' ? laneY(0) : c === 'e' ? top + laneH * 2 : laneY(3));

    function laneFree(i, gap) { const l = lastIn[i]; return !l || l.done || (l.x - l.len) >= P0 + gap; }
    function enter(p, i) { p.state = 'pipe'; p.lane = i; p.x = P0; p.enterT = simT; lastIn[i] = p; inPipe.push(p); }

    function step(dt) {
      simT += dt;
      if (burstLeft > 0) burstLeft = Math.max(0, burstLeft - dt);
      Object.keys(CL).forEach(c => {
        const burst = c === 'e' && burstLeft > 0;
        const every = burst ? .05 : CL[c].every;
        acc[c] += dt;
        while (acc[c] >= every) {
          acc[c] -= every;
          const p = { c, len: burst ? 60 : CL[c].len, born: simT, state: 'q', y: srcY(c) };
          (mode === 'shared' ? queues.all : queues[c]).push(p);
        }
      });
      if (mode === 'sliced') {
        Object.keys(CL).forEach(c => {
          const q = queues[c];
          let guard = 0;
          while (q.length && guard++ < 20) {
            const lane = CL[c].lanes.find(i => laneFree(i, CL[c].gap));
            if (lane == null) break;
            enter(q.shift(), lane);
          }
        });
      } else {
        const q = queues.all;
        let guard = 0;
        while (q.length && guard++ < 40) {
          const lane = [0, 1, 2, 3].find(i => laneFree(i, CL[q[0].c].gap));
          if (lane == null) break;
          enter(q.shift(), lane);
        }
      }
      inPipe.forEach(p => {
        p.x += V * dt;
        p.y += (laneY(p.lane) - p.y) * Math.min(1, dt * 12);
        if (p.x - p.len > P1) {
          p.done = true;
          if (p.c === 'u') { urHist.push(p.enterT - p.born <= DEADLINE); if (urHist.length > 25) urHist.shift(); }
        }
      });
      inPipe = inPipe.filter(p => !p.done);
    }

    function shape(c, x, y, len, color) {
      ctx.fillStyle = color;
      if (c === 'u') { ctx.beginPath(); ctx.moveTo(x - len / 2, y - 6); ctx.lineTo(x, y); ctx.lineTo(x - len / 2, y + 6); ctx.lineTo(x - len, y); ctx.closePath(); ctx.fill(); }
      else if (c === 'm') { ctx.beginPath(); ctx.arc(x - len / 2, y, len / 2, 0, Math.PI * 2); ctx.fill(); }
      else { ctx.beginPath(); if (ctx.roundRect) ctx.roundRect(x - len, y - 5, len, 10, 4); else ctx.rect(x - len, y - 5, len, 10); ctx.fill(); }
    }

    function draw() {
      ctx.clearRect(0, 0, W, H);
      const bottom = top + laneH * 4;
      /* tubo = infraestrutura física única */
      ctx.fillStyle = col.s2;
      ctx.beginPath(); if (ctx.roundRect) ctx.roundRect(P0, top - 6, P1 - P0, bottom - top + 12, 14); else ctx.rect(P0, top - 6, P1 - P0, bottom - top + 12); ctx.fill();
      if (mode === 'sliced') {
        [['m', 0, 1], ['e', 1, 3], ['u', 3, 4]].forEach(([c, a, b]) => {
          ctx.fillStyle = IOT.withAlpha(col[CL[c].p], .1);
          ctx.fillRect(P0, top + laneH * a + 2, P1 - P0, laneH * (b - a) - 4);
        });
        ctx.setLineDash([6, 5]); ctx.strokeStyle = col.line2;
        [1, 3].forEach(i => { ctx.beginPath(); ctx.moveTo(P0, top + laneH * i); ctx.lineTo(P1, top + laneH * i); ctx.stroke(); });
        ctx.setLineDash([]);
      }
      ctx.font = '600 10px "IBM Plex Mono", monospace';
      ctx.fillStyle = col.muted;
      ctx.fillText(mode === 'sliced' ? 'MESMA INFRAESTRUTURA, 3 FATIAS ISOLADAS' : 'MESMA INFRAESTRUTURA, FILA ÚNICA', P0 + 4, top - 12);
      if (mode === 'sliced' && W > 560) {
        ctx.textAlign = 'right';
        [['m', laneY(0), 'mMTC · densidade'], ['e', top + laneH * 2, 'eMBB · banda'], ['u', laneY(3), 'URLLC · ~1 ms']].forEach(([c, y, t]) => { ctx.fillStyle = col[CL[c].p]; ctx.fillText(t, P1 - 6, y - laneH * (c === 'e' ? .78 : .3)); });
        ctx.textAlign = 'left';
      }
      /* fontes */
      ctx.font = '600 11px "IBM Plex Sans", sans-serif';
      Object.keys(CL).forEach(c => {
        const y = srcY(c);
        shape(c, 14 + (c === 'e' ? 24 : 10), y, c === 'e' ? 24 : 10, col[CL[c].p]);
        if (srcW > 100) { ctx.fillStyle = col.ink; ctx.fillText(CL[c].name, 48, y + 4); }
      });
      /* destino */
      ctx.fillStyle = col.s3;
      ctx.fillRect(P1 + 10, top, Math.max(8, W - P1 - 14), bottom - top);
      if (W - P1 > 80) {
        ctx.save(); ctx.translate(P1 + 34, (top + bottom) / 2); ctx.rotate(-Math.PI / 2);
        ctx.fillStyle = col.muted; ctx.font = '600 10px "IBM Plex Mono", monospace'; ctx.textAlign = 'center';
        ctx.fillText('NÚCLEO 5G / BORDA', 0, 0); ctx.restore(); ctx.textAlign = 'left';
      }
      /* filas */
      const drawQueue = (q, y) => {
        let x = P0 - 6, shown = 0;
        for (const p of q) {
          if (x - p.len < srcW + (srcW > 100 ? 4 : 30)) break;
          const late = p.c === 'u' && simT - p.born > DEADLINE;
          shape(p.c, x, y, p.len, late ? col.bad : col[CL[p.c].p]);
          x -= p.len + 4; shown++;
        }
        if (q.length > shown) { ctx.fillStyle = col.ink; ctx.font = '600 11px "IBM Plex Mono", monospace'; ctx.fillText('+' + (q.length - shown), Math.max(4, x - 30), y - 10); }
      };
      if (mode === 'shared') drawQueue(queues.all, qY('m'));
      else Object.keys(CL).forEach(c => drawQueue(queues[c], qY(c)));
      /* pacotes no tubo */
      ctx.save();
      ctx.beginPath(); ctx.rect(P0 - 80, 0, P1 - P0 + 90, H); ctx.clip();
      inPipe.forEach(p => {
        const late = p.c === 'u' && p.enterT - p.born > DEADLINE;
        shape(p.c, p.x, p.y, p.len, late ? col.bad : col[CL[p.c].p]);
      });
      ctx.restore();
    }

    function ui() {
      const ok = urHist.length ? Math.round(urHist.filter(Boolean).length / urHist.length * 100) : 100;
      const qa = mode === 'shared' ? queues.all.length : queues.m.length + queues.e.length + queues.u.length;
      const qe = mode === 'shared' ? queues.all.filter(p => p.c === 'e').length : queues.e.length;
      const qu = mode === 'shared' ? queues.all.filter(p => p.c === 'u').length : queues.u.length;
      const good = ok >= 95;
      stats.innerHTML = `
        <div class="ss ss--status ${good ? 'is-ok' : 'is-bad'}">${IOT.icon(good ? 'i-check' : 'i-warn')}<span><b>Robôs: ${good ? 'no prazo' : 'comandos atrasados'}</b><span class="small">${ok}% dos últimos comandos dentro do limite</span></span></div>
        <div class="ss"><span class="eyebrow">Pacotes na fila</span><b class="num">${qa}</b></div>
        <div class="ss"><span class="eyebrow">Vídeo na fila</span><b class="num">${qe}</b></div>
        <div class="ss"><span class="eyebrow">Comandos na fila</span><b class="num">${qu}</b></div>`;
      burstBtn.disabled = burstLeft > 0;
      burstBtn.lastChild.textContent = burstLeft > 0 ? 'Pico em andamento…' : 'Gerar pico de vídeo';
    }

    function loop(now) {
      const dt = Math.max(0, Math.min(.05, (now - last) / 1000)); last = now;
      step(dt); draw();
      uiT += dt;
      if (uiT > .2) { uiT = 0; ui(); }
      raf = visible && !paused ? requestAnimationFrame(loop) : 0;
    }
    function kick() { if (!raf && visible && !paused) { last = performance.now(); raf = requestAnimationFrame(loop); } }

    function setMode(m) {
      if (m === mode) return;
      const queued = queues.all.concat(queues.m, queues.e, queues.u).sort((a, b) => a.born - b.born);
      queues = { m: [], e: [], u: [], all: [] };
      mode = m;
      queued.forEach(p => (m === 'shared' ? queues.all : queues[p.c]).push(p));
      urHist = [];
      msg.textContent = m === 'shared'
        ? 'Sem fatiamento, todos disputam a mesma fila. Gere um pico de vídeo e veja os comandos do robô atrasarem.'
        : 'Com fatiamento, cada aplicação tem sua faixa garantida. Gere um pico de vídeo: só a fatia de vídeo enche.';
      draw(); ui();
    }
    IOT.seg($('#sliceSeg'), 'm', setMode);
    burstBtn.addEventListener('click', () => { burstLeft = BURST; ui(); kick(); });

    /* botão de pausa (conteúdo em movimento contínuo) */
    const pauseBtn = document.createElement('button');
    pauseBtn.type = 'button'; pauseBtn.className = 'btn';
    pauseBtn.innerHTML = IOT.icon('i-pause') + '<span>Pausar</span>';
    burstBtn.after(pauseBtn);
    pauseBtn.addEventListener('click', () => {
      paused = !paused;
      pauseBtn.innerHTML = IOT.icon(paused ? 'i-play' : 'i-pause') + `<span>${paused ? 'Continuar' : 'Pausar'}</span>`;
      kick();
    });

    readColors(); setup();
    mode = 'shared'; setMode('sliced');
    for (let i = 0; i < 120; i++) step(1 / 30);
    draw(); ui();
    IOT.watch(cv, v => { visible = v; if (v) kick(); });
    let lw = window.innerWidth, rt = 0;
    window.addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(() => { if (window.innerWidth !== lw) { lw = window.innerWidth; setup(); inPipe.forEach(p => { p.y = laneY(p.lane); }); draw(); } }, 150); });
    document.addEventListener('themechange', () => { readColors(); draw(); });
  };

  /* ---------- FIG 3.4 níveis de dispositivo ---------- */
  IOT.initTiers = function () {
    const chips = $('#devChips'), box = $('#tiers');
    if (!chips) return;
    const labels = { taxa: 'Taxa de dados', bateria: 'Autonomia', mobilidade: 'Mobilidade', custo: 'Custo do módulo' };
    box.innerHTML = IOT.TIERS.map(tr => `
      <article class="tier" data-id="${tr.id}">
        <p class="tier-sub mono">${esc(tr.sub)}</p>
        <h4>${esc(tr.n)}</h4>
        <div class="tier-lv">${Object.keys(labels).map(k => `<div class="lv"><span>${labels[k]}</span><span class="pips">${[1, 2, 3, 4, 5].map(i => `<i class="${i <= tr.lv[k] ? 'on' : ''}"></i>`).join('')}</span></div>`).join('')}</div>
        <dl class="tier-dl">${tr.rows.map(r => `<dt>${esc(r[0])}</dt><dd>${esc(r[1])}</dd>`).join('')}</dl>
        <p class="tier-why" hidden></p>
      </article>`).join('');
    const btns = IOT.DEVICES.map((d, i) => {
      const b = document.createElement('button');
      b.type = 'button'; b.className = 'chip'; b.setAttribute('role', 'radio');
      b.textContent = d.n;
      b.addEventListener('click', () => pick(i));
      chips.appendChild(b);
      return b;
    });
    function pick(i) {
      const d = IOT.DEVICES[i];
      btns.forEach((b, k) => { b.setAttribute('aria-checked', k === i ? 'true' : 'false'); b.tabIndex = k === i ? 0 : -1; });
      box.dataset.sel = d.tier;
      $$('.tier', box).forEach(el => {
        const on = el.dataset.id === d.tier;
        el.classList.toggle('is-on', on);
        const why = el.querySelector('.tier-why');
        why.hidden = !on;
        if (on) why.innerHTML = `<b>${esc(d.n)}:</b> ${esc(d.why)}`;
      });
    }
    IOT.radioKeys(chips, b => pick(btns.indexOf(b)));
    pick(5);
  };
})();

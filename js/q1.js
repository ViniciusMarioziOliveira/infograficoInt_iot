/* Q1 — gerações, ficha técnica, triângulo dos pilares, espectro e habilitadores. */
(function () {
  'use strict';
  const IOT = window.IOT;
  const { $, $$, svg, esc } = IOT;

  /* ---------- FIG 1.1 gerações ---------- */
  function initGens() {
    const list = $('#gensList'), panel = $('#gensPanel');
    if (!list) return;
    const forIcon = { p: 'i-users', pm: 'i-factory', ai: 'i-spark' };
    const btns = IOT.GENS.map((g, i) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'gen gen--' + g.who;
      b.setAttribute('role', 'tab');
      b.id = 'gen-' + g.id;
      b.innerHTML = `<span class="gen-dot" aria-hidden="true"></span><span class="gen-g">${g.g}</span><span class="gen-w">${esc(g.when)}</span>`;
      b.addEventListener('click', () => pick(i));
      list.appendChild(b);
      return b;
    });
    function pick(i) {
      const g = IOT.GENS[i];
      btns.forEach((b, k) => { b.setAttribute('aria-selected', k === i ? 'true' : 'false'); b.tabIndex = k === i ? 0 : -1; });
      panel.setAttribute('aria-labelledby', 'gen-' + g.id);
      panel.innerHTML = `<div class="gen-big" aria-hidden="true">${g.g}</div>
        <div class="gen-txt"><p class="eyebrow">${esc(g.when)}</p>
        <p class="gen-for">${IOT.icon(forIcon[g.who])}Projetada para: <strong>${esc(g.for)}</strong></p>
        <p>${esc(g.text)}</p></div>`;
    }
    IOT.radioKeys(list, b => pick(btns.indexOf(b)));
    pick(3);
  }

  /* ---------- FIG 1.2 ficha técnica ---------- */
  function initSpecs() {
    const grid = $('#specGrid');
    if (!grid) return;
    grid.innerHTML = IOT.SPECS.map(s => `
      <div class="spec" data-p="${s.p}" tabindex="0">
        <div class="spec-v"><span class="num" data-v="${s.v}" data-dec="${s.dec}">${fmtNum(s.v, s.dec)}</span><small>${esc(s.unit)}</small></div>
        <p class="spec-l">${esc(s.label)}</p>
        <p class="spec-n">${esc(s.note)}</p>
        ${IOT.ptag(s.p)}
      </div>`).join('');
    $$('.spec', grid).forEach(el => {
      const on = () => { grid.dataset.hl = el.dataset.p; };
      const off = () => { delete grid.dataset.hl; };
      el.addEventListener('mouseenter', on); el.addEventListener('focus', on);
      el.addEventListener('mouseleave', off); el.addEventListener('blur', off);
    });
    IOT.onVisible(grid, () => {
      $$('.spec-v span', grid).forEach(n => { n.dataset.count = n.dataset.v; IOT.countUp(n); });
    }, .3);
  }

  /* ---------- FIG 1.3 triângulo dos pilares ---------- */
  function initTriangle() {
    const s = $('#triSvg');
    if (!s) return;
    const V = { embb: { x: 300, y: 70 }, mmtc: { x: 66, y: 478 }, urllc: { x: 534, y: 478 } };
    const E = V.embb, M = V.mmtc, U = V.urllc;
    const den = (M.y - U.y) * (E.x - U.x) + (U.x - M.x) * (E.y - U.y);
    const bary = p => {
      const wE = ((M.y - U.y) * (p.x - U.x) + (U.x - M.x) * (p.y - U.y)) / den;
      const wM = ((U.y - E.y) * (p.x - U.x) + (E.x - U.x) * (p.y - U.y)) / den;
      return { embb: wE, mmtc: wM, urllc: 1 - wE - wM };
    };
    const fromW = w => ({ x: w[0] * E.x + w[1] * M.x + w[2] * U.x, y: w[0] * E.y + w[1] * M.y + w[2] * U.y });
    function closestOnSeg(p, a, b) {
      const dx = b.x - a.x, dy = b.y - a.y;
      const t = IOT.clamp(((p.x - a.x) * dx + (p.y - a.y) * dy) / (dx * dx + dy * dy), 0, 1);
      return { x: a.x + t * dx, y: a.y + t * dy };
    }
    function clampTri(p) {
      const w = bary(p);
      if (w.embb >= 0 && w.mmtc >= 0 && w.urllc >= 0) return p;
      let best = null, bd = Infinity;
      [[E, M], [M, U], [U, E]].forEach(([a, b]) => {
        const c = closestOnSeg(p, a, b), d = Math.hypot(c.x - p.x, c.y - p.y);
        if (d < bd) { bd = d; best = c; }
      });
      return best;
    }

    /* desenho estático */
    const defs = svg('defs', null, s);
    const cp = svg('clipPath', { id: 'triClip' }, defs);
    const triPts = `${E.x},${E.y} ${M.x},${M.y} ${U.x},${U.y}`;
    svg('polygon', { points: triPts }, cp);
    ['embb', 'mmtc', 'urllc'].forEach(k => {
      const g = svg('radialGradient', { id: 'tg-' + k }, defs);
      svg('stop', { offset: '0', style: `stop-color:var(--${k});stop-opacity:.42` }, g);
      svg('stop', { offset: '1', style: `stop-color:var(--${k});stop-opacity:0` }, g);
    });
    svg('polygon', { points: triPts, class: 'tri-fill' }, s);
    const glow = svg('g', { 'clip-path': 'url(#triClip)' }, s);
    ['embb', 'mmtc', 'urllc'].forEach(k => svg('circle', { cx: V[k].x, cy: V[k].y, r: 330, fill: `url(#tg-${k})` }, glow));
    /* linhas de mistura (25/50/75%) */
    const iso = svg('g', { class: 'tri-iso' }, s);
    [.25, .5, .75].forEach(t => {
      [[E, M, U], [M, U, E], [U, E, M]].forEach(([a, b, c]) => {
        const p1 = { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t };
        const p2 = { x: a.x + (c.x - a.x) * t, y: a.y + (c.y - a.y) * t };
        svg('line', { x1: p1.x, y1: p1.y, x2: p2.x, y2: p2.y }, iso);
      });
    });
    svg('polygon', { points: triPts, class: 'tri-edge' }, s);

    /* vértices clicáveis */
    const vlab = {
      embb: { x: 300, y: 26, a: 'middle', sub: 'banda' },
      mmtc: { x: 66, y: 516, a: 'start', sub: 'densidade' },
      urllc: { x: 534, y: 516, a: 'end', sub: 'latência' }
    };
    Object.keys(V).forEach(k => {
      const g = svg('g', { class: `tri-v tri-v--${k}`, tabindex: '0', role: 'button', 'aria-label': `Ir para ${IOT.PILLARS[k].name}` }, s);
      svg('circle', { cx: V[k].x, cy: V[k].y, r: 9 }, g);
      const t = svg('text', { x: vlab[k].x, y: vlab[k].y, 'text-anchor': vlab[k].a, class: 'tri-vt' }, g);
      t.textContent = IOT.PILLARS[k].name;
      const t2 = svg('text', { x: vlab[k].x, y: vlab[k].y + 18, 'text-anchor': vlab[k].a, class: 'tri-vs' }, g);
      t2.textContent = vlab[k].sub;
      const go = () => setProbe({ x: V[k].x, y: V[k].y }, true);
      g.addEventListener('click', go);
      g.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go(); } });
    });

    /* aplicações */
    const appG = svg('g', { class: 'tri-apps' }, s);
    const labG = svg('g', { class: 'tri-labels' }, s);
    const apps = IOT.APPS.map(a => {
      const p = fromW(a.w);
      const dom = ['embb', 'mmtc', 'urllc'][a.w.indexOf(Math.max(...a.w))];
      const c = svg('circle', { cx: p.x, cy: p.y, r: 7, class: `tri-dot tri-dot--${dom}` }, appG);
      const html = `<b>${esc(a.n)}</b>${esc(a.d)}`;
      c.addEventListener('mouseenter', e => IOT.tip.show(html, e.clientX, e.clientY));
      c.addEventListener('mousemove', e => IOT.tip.show(html, e.clientX, e.clientY));
      c.addEventListener('mouseleave', () => IOT.tip.hide());
      return { ...a, p, c, dom };
    });

    /* sonda */
    const probe = svg('g', { class: 'tri-probe', tabindex: '0', role: 'slider', 'aria-label': 'Sonda de requisitos', 'aria-valuetext': '' }, s);
    svg('circle', { r: 26, class: 'tri-probe-halo' }, probe);
    const hx = [];
    for (let k = 0; k < 6; k++) { const a = Math.PI / 180 * (60 * k - 90); hx.push(`${(16 * Math.cos(a)).toFixed(1)},${(16 * Math.sin(a)).toFixed(1)}`); }
    svg('polygon', { points: hx.join(' '), class: 'tri-probe-hex' }, probe);
    svg('path', { d: 'M-6 0H6M0 -6V6', class: 'tri-probe-x' }, probe);

    const mix = $('#triMix'), card = $('#triCard'), near = $('#triNear');
    const presets = $$('#triPresets button');
    let pos = fromW([.34, .33, .33]);
    let lastDom = '';

    function render() {
      probe.setAttribute('transform', `translate(${pos.x.toFixed(1)} ${pos.y.toFixed(1)})`);
      const w = bary(pos);
      ['embb', 'mmtc', 'urllc'].forEach(k => { w[k] = IOT.clamp(w[k], 0, 1); });
      const sum = w.embb + w.mmtc + w.urllc;
      const pct = { embb: w.embb / sum * 100, urllc: w.urllc / sum * 100, mmtc: w.mmtc / sum * 100 };
      mix.innerHTML = ['embb', 'urllc', 'mmtc'].map(k => `
        <div class="mix-row mix-row--${k}">
          <span class="mix-l">${IOT.PILLARS[k].need}</span>
          <span class="mix-track"><span class="mix-fill" style="width:${pct[k].toFixed(1)}%"></span></span>
          <span class="mix-v num">${Math.round(pct[k])}%</span>
        </div>`).join('');
      const dom = Object.keys(pct).reduce((a, b) => (pct[a] >= pct[b] ? a : b));
      if (dom !== lastDom) {
        lastDom = dom;
        const P = IOT.PILLARS[dom];
        card.className = 'pillar-card pillar-card--' + dom;
        card.innerHTML = `<p class="eyebrow">Pilar dominante</p>
          <h4>${P.name} <span>${esc(P.full)}</span></h4>
          <dl><dt>O que oferece</dt><dd>${esc(P.offer)}</dd>
          <dt>Metas (IMT-2020)</dt><dd>${esc(P.goals)}</dd>
          <dt>Na IoT</dt><dd>${esc(P.iot)}</dd></dl>`;
        presets.forEach(b => b.setAttribute('aria-pressed', b.dataset.p === dom ? 'true' : 'false'));
      }
      const ranked = apps.map(a => ({ a, d: Math.hypot(a.p.x - pos.x, a.p.y - pos.y) })).sort((x, y) => x.d - y.d).slice(0, 3);
      apps.forEach(a => a.c.classList.remove('is-near'));
      labG.innerHTML = '';
      ranked.forEach(({ a }) => {
        a.c.classList.add('is-near');
        const right = a.p.x + 12 + a.n.length * 7.6 <= 596;
        const t = svg('text', { x: a.p.x + (right ? 12 : -12), y: a.p.y + 4, 'text-anchor': right ? 'start' : 'end', class: 'tri-lab' }, labG);
        t.textContent = a.n;
      });
      near.innerHTML = ranked.map(({ a }) => `<li><span class="ndot ndot--${a.dom}" aria-hidden="true"></span><span><b>${esc(a.n)}</b><br><span class="small muted">${esc(a.d)}</span></span></li>`).join('');
      probe.setAttribute('aria-valuetext', `Banda ${Math.round(pct.embb)}%, latência ${Math.round(pct.urllc)}%, densidade ${Math.round(pct.mmtc)}%`);
    }

    let anim = 0;
    function setProbe(p, animate) {
      const target = clampTri(p);
      cancelAnimationFrame(anim);
      if (!animate || IOT.reduced) { pos = target; render(); return; }
      const from = { ...pos }, t0 = performance.now();
      const tick = now => {
        const k = Math.min(1, (now - t0) / 450), e = IOT.ease(k);
        pos = { x: IOT.lerp(from.x, target.x, e), y: IOT.lerp(from.y, target.y, e) };
        render();
        if (k < 1) anim = requestAnimationFrame(tick);
      };
      anim = requestAnimationFrame(tick);
    }

    function toSvg(e) {
      const pt = s.createSVGPoint();
      pt.x = e.clientX; pt.y = e.clientY;
      return pt.matrixTransform(s.getScreenCTM().inverse());
    }
    let dragging = false;
    s.addEventListener('pointerdown', e => {
      if (e.target.closest('.tri-v')) return;
      dragging = true;
      s.setPointerCapture(e.pointerId);
      const hit = e.target.closest('.tri-dot');
      if (hit) { const a = apps.find(x => x.c === hit); setProbe(a.p, true); }
      else setProbe(toSvg(e), false);
    });
    s.addEventListener('pointermove', e => { if (dragging) setProbe(toSvg(e), false); });
    const stop = () => { dragging = false; };
    s.addEventListener('pointerup', stop);
    s.addEventListener('pointercancel', stop);
    probe.addEventListener('keydown', e => {
      const st = e.shiftKey ? 30 : 10;
      const d = { ArrowLeft: [-st, 0], ArrowRight: [st, 0], ArrowUp: [0, -st], ArrowDown: [0, st] }[e.key];
      if (d) { e.preventDefault(); setProbe({ x: pos.x + d[0], y: pos.y + d[1] }, false); }
    });
    presets.forEach(b => b.addEventListener('click', () => setProbe(V[b.dataset.p], true)));

    render();
  }

  document.addEventListener('DOMContentLoaded', () => {
    initGens();
    initSpecs();
    initTriangle();
    if (IOT.initSpectrum) IOT.initSpectrum();
    if (IOT.initEnablers) IOT.initEnablers();
  });

  /* ---------- FIG 1.4 espectro ---------- */
  IOT.initSpectrum = function () {
    const cv = $('#specCanvas'), btnBox = $('#bandBtns'), read = $('#specRead'), ruler = $('#specRuler');
    if (!cv) return;
    const B = IOT.BANDS;
    let cur = 2, Rnow = 0, Rto = 0, anim = null, phase = 0, raf = 0, visible = false, last = 0;
    let ctx, W, H, col = {}, blocks = [];
    const WAVE_H = 54;

    const btns = B.map((b, i) => {
      const el = document.createElement('button');
      el.type = 'button';
      el.className = 'band';
      el.setAttribute('role', 'radio');
      el.innerHTML = `<span class="band-f">${b.label}</span><span class="band-fr">${b.fr}</span>`;
      el.addEventListener('click', () => pick(i));
      btnBox.appendChild(el);
      return el;
    });
    IOT.radioKeys(btnBox, el => pick(btns.indexOf(el)));

    function readColors() {
      col = { line: IOT.color('--line'), line2: IOT.color('--line-2'), ink: IOT.color('--ink'), s2: IOT.color('--surface-2'), s3: IOT.color('--surface-3'), muted: IOT.color('--muted'), embb: IOT.color('--embb') };
    }
    function seeded(n) { let x = Math.sin(n * 9301 + 49297) * 233280; return x - Math.floor(x); }
    function setup() {
      const h = cv.parentElement.clientWidth < 520 ? 300 : 340;
      cv.style.height = h + 'px';
      const r = IOT.fitCanvas(cv, h);
      ctx = r.ctx; W = r.w; H = r.h;
      blocks = [];
      let k = 0;
      for (let y = 4; y < H - WAVE_H; y += 24) {
        for (let x = 4; x < W; x += 34) {
          k++;
          if (seeded(k) < .82) blocks.push([x, y, 28 - seeded(k + 99) * 8, 18 - seeded(k + 7) * 5]);
        }
      }
      Rmax = Math.min(W, H - WAVE_H) * .62;
      Rnow = Rto = B[cur].r * Rmax;
    }
    let Rmax = 200;

    function hexPath(x, y, r) {
      ctx.beginPath();
      for (let k = 0; k < 6; k++) { const a = Math.PI / 180 * (60 * k - 90); const px = x + r * Math.cos(a), py = y + r * Math.sin(a); if (k) ctx.lineTo(px, py); else ctx.moveTo(px, py); }
      ctx.closePath();
    }

    function draw() {
      const mapH = H - WAVE_H;
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = col.s2;
      blocks.forEach(b => ctx.fillRect(b[0], b[1], b[2], b[3]));
      const R = Math.max(6, Rnow);
      const hw = Math.sqrt(3) * R, vh = 1.5 * R;
      const cx = W / 2, cy = mapH / 2;
      ctx.save();
      ctx.beginPath(); ctx.rect(0, 0, W, mapH); ctx.clip();
      const rows = Math.ceil(mapH / vh / 2) + 2, cols = Math.ceil(W / hw / 2) + 2;
      ctx.lineWidth = 1;
      for (let rI = -rows; rI <= rows; rI++) {
        for (let cI = -cols; cI <= cols; cI++) {
          const x = cx + cI * hw + (Math.abs(rI) % 2 ? hw / 2 : 0), y = cy + rI * vh;
          if (x < -R || x > W + R || y < -R || y > mapH + R) continue;
          hexPath(x, y, R - .5);
          ctx.fillStyle = IOT.withAlpha(col.ink, rI === 0 && cI === 0 ? .14 : .04);
          ctx.fill();
          ctx.strokeStyle = IOT.withAlpha(col.ink, .35);
          ctx.stroke();
          ctx.fillStyle = col.ink;
          const s = IOT.clamp(R / 10, 1.6, 5);
          ctx.beginPath(); ctx.moveTo(x, y - s * 1.6); ctx.lineTo(x + s, y + s); ctx.lineTo(x - s, y + s); ctx.closePath(); ctx.fill();
        }
      }
      ctx.setLineDash([4, 4]);
      ctx.strokeStyle = col.ink;
      ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.stroke();
      ctx.setLineDash([]);
      ctx.restore();
      /* faixa da onda */
      ctx.fillStyle = col.s3;
      ctx.fillRect(0, mapH, W, WAVE_H);
      const lam = 299792458 / B[cur].f;
      const lpx = Math.max(3, lam * 600);
      ctx.strokeStyle = col.ink;
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      const mid = mapH + WAVE_H / 2;
      for (let x = 0; x <= W; x += 1) {
        const y = mid + Math.sin((x / lpx) * Math.PI * 2 - phase) * 13;
        if (x) ctx.lineTo(x, y); else ctx.moveTo(x, y);
      }
      ctx.stroke();
      ctx.fillStyle = col.muted;
      ctx.font = '600 11px "IBM Plex Mono", monospace';
      ctx.fillText('λ = ' + fmtLam(lam) + ' · onda na mesma escala para as 4 faixas', 10, mapH + 14);
    }
    function fmtLam(l) { const cm = l * 100; return cm >= 2 ? fmtNum(cm, 1) + ' cm' : fmtNum(l * 1000, 1) + ' mm'; }

    function loop(now) {
      const dt = Math.max(0, Math.min(.05, (now - last) / 1000 || 0)); last = now;
      phase += dt * 3;
      if (anim) {
        const k = Math.min(1, (now - anim.t0) / 650), e = IOT.ease(k);
        Rnow = IOT.lerp(anim.from, Rto, e);
        if (k >= 1) anim = null;
      }
      draw();
      raf = (visible && !IOT.reduced) || anim ? requestAnimationFrame(loop) : 0;
    }
    function kick() { if (!raf) { last = performance.now(); raf = requestAnimationFrame(loop); } }

    function pick(i) {
      cur = i;
      const b = B[i];
      btns.forEach((el, k) => { el.setAttribute('aria-checked', k === i ? 'true' : 'false'); el.tabIndex = k === i ? 0 : -1; });
      Rto = b.r * Rmax;
      if (IOT.reduced) { Rnow = Rto; draw(); }
      else { anim = { from: Rnow, t0: performance.now() }; kick(); }
      const lam = 299792458 / b.f;
      const ratio = 1 / (b.r * b.r);
      const pips = (n, cls) => `<span class="pips ${cls}" aria-label="${n} de 5">${[1, 2, 3, 4, 5].map(k => `<i class="${k <= n ? 'on' : ''}"></i>`).join('')}</span>`;
      read.innerHTML = `
        <p class="eyebrow">${esc(b.fr)}</p>
        <p class="sr-big">${b.label}</p>
        <dl class="sr-dl">
          <dt>Comprimento de onda</dt><dd class="num">${fmtLam(lam)}</dd>
          <dt>Alcance típico por antena</dt><dd>${esc(b.range)}</dd>
          <dt>Antenas para a mesma área</dt><dd class="num">${i === 0 ? 'referência (1×)' : '≈ ' + fmtNum(ratio, 0) + '× as de 700 MHz'}</dd>
        </dl>
        <div class="sr-meters"><span>Cobertura</span>${pips(b.cov, 'pips--cov')}<span>Capacidade</span>${pips(b.cap, 'pips--cap')}</div>
        <p class="small muted">${esc(b.note)}</p>`;
      drawRuler();
    }

    /* régua logarítmica de frequências */
    function drawRuler() {
      if (!ruler) return;
      ruler.innerHTML = '';
      const f0 = Math.log10(0.3e9), f1 = Math.log10(60e9);
      const X = f => 40 + (Math.log10(f) - f0) / (f1 - f0) * 820;
      svg('line', { x1: 40, y1: 52, x2: 860, y2: 52, class: 'rl-axis' }, ruler);
      [[0.41e9, 7.125e9, 'FR1 · < 7 GHz'], [24.25e9, 52.6e9, 'FR2 · mmWave']].forEach(([a, b, t]) => {
        svg('rect', { x: X(a), y: 38, width: X(b) - X(a), height: 28, rx: 4, class: 'rl-fr' }, ruler);
        const tx = svg('text', { x: X(b) - 6, y: 48, 'text-anchor': 'end', class: 'rl-frt' }, ruler); tx.textContent = t;
      });
      [[0.5e9, '0,5'], [1e9, '1'], [2e9, '2'], [5e9, '5'], [10e9, '10'], [20e9, '20'], [50e9, '50 GHz']].forEach(([f, t]) => {
        svg('line', { x1: X(f), y1: 64, x2: X(f), y2: 70, class: 'rl-tick' }, ruler);
        const tx = svg('text', { x: X(f), y: 82, 'text-anchor': 'middle', class: 'rl-tl' }, ruler); tx.textContent = t;
      });
      [[0.915e9, 'LoRaWAN 915'], [2.4e9, 'BLE/Zigbee 2,4']].forEach(([f, t], k) => {
        svg('line', { x1: X(f), y1: 64, x2: X(f), y2: 90, class: 'rl-ref' }, ruler);
        const tx = svg('text', { x: X(f) + (k ? 4 : -4), y: 94, 'text-anchor': k ? 'start' : 'end', class: 'rl-reft' }, ruler); tx.textContent = t;
      });
      B.forEach((b, i) => {
        const g = svg('g', { class: 'rl-band' + (i === cur ? ' is-on' : '') }, ruler);
        svg('line', { x1: X(b.f), y1: 14, x2: X(b.f), y2: 52 }, g);
        svg('circle', { cx: X(b.f), cy: 52, r: i === cur ? 6 : 4 }, g);
        const tx = svg('text', { x: X(b.f), y: 10, 'text-anchor': i === 1 ? 'end' : i === 2 ? 'start' : 'middle' }, g);
        tx.textContent = b.label;
        g.addEventListener('click', () => pick(i));
      });
    }

    readColors();
    setup();
    pick(cur);
    IOT.watch(cv, v => { visible = v; if (v) kick(); });
    let lw = window.innerWidth, rt = 0;
    window.addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(() => { if (window.innerWidth !== lw) { lw = window.innerWidth; setup(); draw(); } }, 150); });
    document.addEventListener('themechange', () => { readColors(); draw(); });
  };

  /* ---------- FIG 1.5 habilitadores ---------- */
  IOT.initEnablers = function () {
    const grid = $('#enGrid'), det = $('#enDetail'), range = $('#relRange'), out = $('#relOut');
    if (!grid) return;
    let sel = 0;
    const cards = IOT.ENABLERS.map((en, i) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'en';
      b.innerHTML = `${IOT.icon(en.icon, 'en-ico')}<span class="en-t">${esc(en.t)}</span><span class="en-s">${esc(en.s)}</span><span class="en-rel mono">Rel. ${en.rel}${en.rel === 18 ? '+' : ''}</span>`;
      b.addEventListener('click', () => select(i));
      grid.appendChild(b);
      return b;
    });
    function select(i) {
      sel = i;
      const en = IOT.ENABLERS[i];
      cards.forEach((c, k) => c.setAttribute('aria-pressed', k === i ? 'true' : 'false'));
      const rel = +range.value;
      const avail = en.rel <= rel;
      det.innerHTML = `${IOT.icon(en.icon, 'en-dico')}<div><p class="eyebrow">Disponível a partir do Release ${en.rel}${avail ? '' : ' · ainda não existe no Release ' + rel}</p><h4>${esc(en.t)}</h4><p>${esc(en.d)}</p></div>`;
      det.classList.toggle('is-future', !avail);
    }
    function filter() {
      const rel = +range.value;
      out.textContent = rel;
      let n = 0;
      cards.forEach((c, k) => { const ok = IOT.ENABLERS[k].rel <= rel; c.classList.toggle('is-future', !ok); if (ok) n++; });
      range.setAttribute('aria-valuetext', `Release ${rel}: ${n} de ${cards.length} habilitadores disponíveis`);
      grid.dataset.count = `${n}/${cards.length}`;
      select(sel);
    }
    range.addEventListener('input', filter);
    filter();
  };
})();

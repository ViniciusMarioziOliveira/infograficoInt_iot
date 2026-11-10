/* Q2 — comparador 4G × 5G, corrida da latência e NSA × SA. */
(function () {
  'use strict';
  const IOT = window.IOT;
  const { $, $$, svg, esc } = IOT;

  /* ---------- FIG 2.1 comparador ---------- */
  function initCompare() {
    const box = $('#cmpGauges'), table = $('#cmpTable');
    if (!box) return;
    box.innerHTML = IOT.GAUGES.map(g => {
      const extra = (g.range4 ? `<span class="g-range" style="left:${g.range4[0] / g.max * 100}%;width:${(g.range4[1] - g.range4[0]) / g.max * 100}%"></span>` : '') +
        (g.tick5 ? `<span class="g-tick" style="left:${g.tick5 / g.max * 100}%" title="URLLC: ${g.tick5} ms"></span>` : '');
      const x = g.better === 'up' ? g.g5 / g.g4 : g.g4 / g.g5;
      return `<div class="gauge" data-id="${g.id}">
        <div class="g-head"><span class="g-l">${esc(g.label)}${g.better === 'down' ? ' <span class="g-hint">menor é melhor</span>' : ''}</span>
          <span class="g-v"><b class="num">–</b> ${esc(g.unit)}</span></div>
        <div class="g-track">${extra}<span class="g-fill"></span><span class="g-ghost"></span></div>
        <div class="g-foot"><span>4G: ${esc(g.note4)}</span><span>5G: ${esc(g.note5)}</span>
          <span class="g-x">${fmtNum(x, x < 2 ? 1 : 0)}× ${g.better === 'up' ? 'mais' : 'menos'}</span></div>
      </div>`;
    }).join('');
    const tb = table.querySelector('tbody');
    tb.innerHTML = IOT.CMP_ROWS.map(r => `<tr><th scope="row">${esc(r[0])}</th><td data-col="4g">${esc(r[1])}</td><td data-col="5g">${esc(r[2])}</td></tr>`).join('');

    const cur = {};
    function set(gen) {
      box.dataset.g = gen;
      table.dataset.g = gen;
      IOT.GAUGES.forEach(g => {
        const row = box.querySelector(`[data-id="${g.id}"]`);
        const v = gen === '5g' ? g.g5 : g.g4, other = gen === '5g' ? g.g4 : g.g5;
        row.querySelector('.g-fill').style.width = (v / g.max * 100) + '%';
        row.querySelector('.g-ghost').style.left = (other / g.max * 100) + '%';
        const out = row.querySelector('.g-v b');
        const from = cur[g.id] == null ? 0 : cur[g.id];
        cur[g.id] = v;
        if (IOT.reduced) { out.textContent = g.fmt(v); return; }
        const t0 = performance.now();
        const tick = now => {
          const k = Math.min(1, (now - t0) / 700), e = 1 - Math.pow(1 - k, 3);
          out.textContent = g.fmt(IOT.lerp(from, v, e));
          if (k < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      });
    }
    IOT.seg($('#cmpSeg'), 'g', set);
    set('5g');
  }

  /* ---------- FIG 2.2 corrida da latência ---------- */
  function initRace() {
    const s = $('#raceSvg'), speed = $('#raceSpeed'), out = $('#raceSpeedOut'), go = $('#raceGo'), res = $('#raceResults');
    if (!s) return;
    const LANES = [
      { id: '4g', name: '4G', lat: .040, label: '4G · ~40 ms', y: 112 },
      { id: '5g', name: '5G', lat: .010, label: '5G · ~10 ms', y: 196 },
      { id: 'urllc', name: 'URLLC', lat: .001, label: '5G URLLC · ~1 ms', y: 280 }
    ];
    const X0 = 190, PXM = 180, SLOW = 25;
    const tower = { x: 70, y: 40 };
    let running = false;

    svg('rect', { x: 0, y: 0, width: 900, height: 330, class: 'race-bg' }, s);
    const tw = svg('g', { class: 'race-tower' }, s);
    svg('path', { d: `M${tower.x} ${tower.y - 14}L${tower.x + 10} ${tower.y + 22}H${tower.x - 10}Z` }, tw);
    svg('circle', { cx: tower.x, cy: tower.y - 18, r: 4 }, tw);
    const tl = svg('text', { x: tower.x + 18, y: tower.y - 8, class: 'race-tl' }, tw); tl.textContent = 'Antena: "freie!"';
    /* régua em metros */
    const rul = svg('g', { class: 'race-ruler' }, s);
    for (let m = 0; m <= 3.5; m += .5) {
      const x = X0 + m * PXM;
      svg('line', { x1: x, y1: 318, x2: x, y2: m % 1 === 0 ? 308 : 312 }, rul);
      if (m % 1 === 0) { const t = svg('text', { x, y: 302, 'text-anchor': 'middle' }, rul); t.textContent = fmtNum(m, 0) + ' m'; }
    }
    svg('line', { x1: X0, y1: 318, x2: X0 + 3.6 * PXM, y2: 318 }, rul);
    const lanes = LANES.map(L => {
      const g = svg('g', { class: `race-lane race-lane--${L.id}` }, s);
      svg('line', { x1: 20, y1: L.y + 26, x2: 880, y2: L.y + 26, class: 'race-road' }, g);
      svg('line', { x1: X0, y1: L.y - 30, x2: X0, y2: L.y + 26, class: 'race-start' }, g);
      const lab = svg('text', { x: 22, y: L.y - 18, class: 'race-ll' }, g); lab.textContent = L.label;
      const br = svg('g', { class: 'race-br' }, g);
      const brl = svg('path', { d: '' }, br);
      const brt = svg('text', { x: 0, y: L.y - 30, 'text-anchor': 'middle' }, br);
      const car = svg('g', { class: 'race-car' }, g);
      svg('rect', { x: -66, y: -14, width: 66, height: 22, rx: 7, class: 'car-body' }, car);
      svg('path', { d: 'M-52 -14 L-44 -27 H-20 L-12 -14 Z', class: 'car-cab' }, car);
      svg('circle', { cx: -50, cy: 9, r: 7, class: 'car-wheel' }, car);
      svg('circle', { cx: -16, cy: 9, r: 7, class: 'car-wheel' }, car);
      const brake = svg('rect', { x: -69, y: -10, width: 5, height: 8, rx: 1.5, class: 'car-brake' }, car);
      const pkt = svg('circle', { r: 6, class: 'race-pkt' }, g);
      pkt.style.display = 'none';
      return { L, car, brake, pkt, br, brl, brt, x: X0 };
    });

    function dist(L) { return (+speed.value / 3.6) * L.lat; }
    function fmtD(m) { return m >= 1 ? fmtNum(m, 2) + ' m' : m >= .1 ? fmtNum(m * 100, 0) + ' cm' : fmtNum(m * 100, 1) + ' cm'; }
    function placeCar(o, x, braking) {
      o.x = x;
      o.car.setAttribute('transform', `translate(${x.toFixed(1)} ${o.L.y + 10})`);
      o.brake.classList.toggle('on', !!braking);
    }
    function bracket(o, show) {
      const d = o.x - X0;
      o.br.style.opacity = show ? 1 : 0;
      const y = o.L.y - 36;
      o.brl.setAttribute('d', `M${X0} ${y + 6}V${y}H${X0 + Math.max(d, 1)}V${y + 6}`);
      o.brt.setAttribute('x', X0 + Math.max(d, 1) / 2 + (d < 40 ? 30 : 0));
      o.brt.textContent = fmtD(dist(o.L));
    }
    function rest() {
      lanes.forEach(o => { placeCar(o, X0 + dist(o.L) * PXM, true); bracket(o, true); o.pkt.style.display = 'none'; });
      results();
    }
    function results() {
      const v = +speed.value;
      out.textContent = v + ' km/h';
      const d4 = dist(LANES[0]), du = dist(LANES[2]);
      res.innerHTML = lanes.map(o => `<div class="rr rr--${o.L.id}"><span class="rr-n">${o.L.name}</span><b class="num">${fmtD(dist(o.L))}</b><span class="small muted">percorridos às cegas</span></div>`).join('') +
        `<p class="rr-note">A ${v} km/h, com 4G o veículo anda <b>${fmtNum(d4 / du, 0)}× mais</b> antes de receber o alerta do que com URLLC. É essa diferença que permite fechar o ciclo sensor → decisão → atuador pela rede.</p>`;
    }
    function run() {
      if (running) return;
      running = true;
      go.disabled = true;
      const v = +speed.value / 3.6;
      lanes.forEach(o => { placeCar(o, X0, false); bracket(o, false); o.pkt.style.display = ''; o.done = false; });
      const t0 = performance.now();
      const tick = now => {
        const t = (now - t0) / 1000 / SLOW;
        let all = true;
        lanes.forEach(o => {
          if (o.done) return;
          const tt = Math.min(t, o.L.lat);
          const x = X0 + v * tt * PXM;
          placeCar(o, x, false);
          const k = Math.min(1, t / o.L.lat);
          o.pkt.setAttribute('cx', IOT.lerp(tower.x, x - 30, k));
          o.pkt.setAttribute('cy', IOT.lerp(tower.y, o.L.y - 4, k));
          if (t >= o.L.lat) { o.done = true; placeCar(o, x, true); bracket(o, true); o.pkt.style.display = 'none'; }
          else all = false;
        });
        if (!all) requestAnimationFrame(tick);
        else { running = false; go.disabled = false; }
      };
      requestAnimationFrame(tick);
    }
    speed.addEventListener('input', () => { if (!running) rest(); else results(); });
    go.addEventListener('click', () => { if (IOT.reduced) rest(); else run(); });
    rest();
  }

  /* ---------- FIG 2.3 NSA × SA ---------- */
  function initSA() {
    const s = $('#saSvg'), txt = $('#saText'), feats = $('#saFeats');
    if (!s) return;
    function draw(mode) {
      s.innerHTML = '';
      const g = svg('g', { class: 'sa-g sa-g--' + mode }, s);
      /* dispositivo */
      svg('rect', { x: 18, y: 104, width: 40, height: 62, rx: 8, class: 'sa-dev' }, g);
      svg('rect', { x: 26, y: 114, width: 24, height: 34, rx: 3, class: 'sa-screen' }, g);
      const dl = svg('text', { x: 38, y: 188, 'text-anchor': 'middle', class: 'sa-l' }, g); dl.textContent = 'dispositivo';
      /* antena 5G */
      svg('path', { d: 'M160 150 L172 70 L184 150 Z', class: 'sa-mast' }, g);
      svg('circle', { cx: 172, cy: 64, r: 6, class: 'sa-nr' }, g);
      const al = svg('text', { x: 172, y: 172, 'text-anchor': 'middle', class: 'sa-l' }, g); al.textContent = 'rádio 5G NR';
      svg('path', { d: 'M62 130 Q 110 100 158 110', class: 'sa-link' }, g);
      if (mode === 'nsa') {
        svg('path', { d: 'M110 230 L118 186 L126 230 Z', class: 'sa-mast sa-mast--lte' }, g);
        const ll = svg('text', { x: 118, y: 246, 'text-anchor': 'middle', class: 'sa-l' }, g); ll.textContent = 'âncora 4G (LTE)';
        svg('path', { d: 'M62 150 Q 90 180 112 200', class: 'sa-link sa-link--dash' }, g);
        svg('path', { d: 'M126 205 Q 230 230 292 170', class: 'sa-link sa-link--dash' }, g);
      }
      svg('path', { d: 'M186 100 Q 240 80 292 110', class: 'sa-link' }, g);
      /* núcleo */
      const core = svg('g', { class: 'sa-core' }, g);
      svg('rect', { x: 292, y: 56, width: 116, height: 128, rx: 12, class: 'sa-corebox' }, core);
      const ct = svg('text', { x: 350, y: 80, 'text-anchor': 'middle', class: 'sa-ct' }, core);
      ct.textContent = mode === 'sa' ? '5G Core' : 'EPC (4G)';
      const parts = mode === 'sa' ? ['AMF', 'SMF', 'UPF', 'NWDAF'] : ['MME', 'S-GW', 'P-GW'];
      parts.forEach((p, i) => {
        const x = 304 + (i % 2) * 52, y = 94 + Math.floor(i / 2) * 36;
        svg('rect', { x, y, width: 46, height: 26, rx: mode === 'sa' ? 13 : 3, class: 'sa-fn' }, core);
        const t = svg('text', { x: x + 23, y: y + 17, 'text-anchor': 'middle', class: 'sa-fnt' }, core); t.textContent = p;
      });
      const cs = svg('text', { x: 350, y: 204, 'text-anchor': 'middle', class: 'sa-l' }, g);
      cs.textContent = mode === 'sa' ? 'serviços em nuvem (SBA)' : 'equipamentos dedicados';
    }
    function set(mode) {
      draw(mode);
      txt.textContent = mode === 'sa'
        ? 'Standalone: rádio 5G e núcleo 5G próprio, virtualizado e baseado em serviços. Libera tudo o que o 5G promete para a IoT.'
        : 'Non-Standalone: o rádio 5G se apoia na rede 4G (âncora LTE e núcleo EPC). Entrega mais velocidade, mas não oferece fatiamento, URLLC nem RedCap.';
      feats.innerHTML = IOT.SA_FEATS.map((f, i) => {
        const ok = mode === 'sa' || f.nsa;
        return `<li class="${ok ? 'ok' : 'no'}" style="--d:${i * 70}ms">${IOT.icon(ok ? 'i-check' : 'i-x')}<span>${esc(f.t)}</span></li>`;
      }).join('');
    }
    IOT.seg($('#saSeg'), 'm', set);
    set('nsa');
  }

  document.addEventListener('DOMContentLoaded', () => {
    initCompare();
    initRace();
    initSA();
  });
})();

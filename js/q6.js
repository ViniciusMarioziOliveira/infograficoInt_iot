/* Q6 — ciclo IoT → 5G → IA → automação, nos dois sentidos da relação. */
(function () {
  'use strict';
  const IOT = window.IOT;
  const { $, $$, svg, esc } = IOT;

  function initLoop() {
    const s = $('#loopSvg'), panel = $('#loopPanel'), tabs = $('#loopTabs');
    if (!s) return;
    const L = IOT.LOOP;
    const C = 260, R = 172;
    const ang = [-90, 0, 90, 180];
    const P = ang.map(a => ({ x: C + R * Math.cos(a * Math.PI / 180), y: C + R * Math.sin(a * Math.PI / 180) }));
    let dir = 'a', sec = 0, hl = -1;

    /* modo A: o ciclo */
    const gA = svg('g', { class: 'lp-a' }, s);
    svg('circle', { cx: C, cy: C, r: R, class: 'lp-ring' }, gA);
    [45, 135, 225, 315].forEach(a => {
      const r = a * Math.PI / 180, x = C + R * Math.cos(r), y = C + R * Math.sin(r);
      svg('path', { d: 'M-7 -6 L5 0 L-7 6 Z', transform: `translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${a + 90})`, class: 'lp-arrow' }, gA);
    });
    const ringPath = `M${C} ${C - R} A${R} ${R} 0 1 1 ${C - .1} ${C - R}`;
    if (!IOT.reduced) {
      ['mmtc', 'embb', 'urllc', 'mmtc', 'embb', 'urllc'].forEach((p, i) => {
        const c = svg('circle', { r: 5, class: `lp-pk lp-pk--${p}` }, gA);
        const am = svg('animateMotion', { dur: '9s', repeatCount: 'indefinite', begin: `${-i * 1.5}s`, path: ringPath }, c);
        am.setAttribute('rotate', 'auto');
      });
    }
    const center = svg('g', { class: 'lp-center' }, gA);
    const cT1 = svg('text', { x: C, y: C - 14, 'text-anchor': 'middle', class: 'lp-ct' }, center);
    const cT2 = svg('text', { x: C, y: C + 10, 'text-anchor': 'middle', class: 'lp-cs' }, center);
    const cT3 = svg('text', { x: C, y: C + 28, 'text-anchor': 'middle', class: 'lp-cs' }, center);
    const cT4 = svg('text', { x: C, y: C + 44, 'text-anchor': 'middle', class: 'lp-cs' }, center);
    const SHORT = ['gera dados', 'transporta', 'decide', 'executa'];
    const nodes = L.nodes.map((n, i) => {
      const g = svg('g', { class: 'lp-node', tabindex: '0', role: 'button', 'aria-label': `${n.t}: ${n.role}`, transform: `translate(${P[i].x.toFixed(1)} ${P[i].y.toFixed(1)})` }, gA);
      svg('circle', { r: 54 }, g);
      svg('use', { href: '#' + n.icon, x: -13, y: -34, width: 26, height: 26 }, g);
      const t = svg('text', { y: 8, 'text-anchor': 'middle', class: 'lp-nt' }, g); t.textContent = n.t;
      const r = svg('text', { y: 25, 'text-anchor': 'middle', class: 'lp-nr' }, g); r.textContent = SHORT[i];
      const go = () => { hl = hl === i ? -1 : i; render(); };
      g.addEventListener('click', go);
      g.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go(); } });
      return g;
    });

    /* modo B: a IA dentro da rede */
    const gB = svg('g', { class: 'lp-b' }, s);
    svg('circle', { cx: C, cy: C, r: 196, class: 'lp-ring lp-ring--b' }, gB);
    svg('circle', { cx: C, cy: C, r: 74, class: 'lp-core' }, gB);
    svg('use', { href: '#i-antenna', x: C - 15, y: C - 44, width: 30, height: 30 }, gB);
    const bt = svg('text', { x: C, y: C + 6, 'text-anchor': 'middle', class: 'lp-nt' }, gB); bt.textContent = 'Rede 5G';
    const bs = svg('text', { x: C, y: C + 26, 'text-anchor': 'middle', class: 'lp-nr' }, gB); bs.textContent = 'se gerencia sozinha';
    L.dirB.forEach((d, i) => {
      const a = (-90 + i * 120) * Math.PI / 180, x = C + 150 * Math.cos(a), y = C + 150 * Math.sin(a);
      svg('line', { x1: C + 74 * Math.cos(a), y1: C + 74 * Math.sin(a), x2: x - 46 * Math.cos(a), y2: y - 46 * Math.sin(a), class: 'lp-spoke' }, gB);
      const g = svg('g', { class: 'lp-sub', transform: `translate(${x.toFixed(1)} ${y.toFixed(1)})` }, gB);
      svg('circle', { r: 46 }, g);
      svg('use', { href: '#i-spark', x: -11, y: -30, width: 22, height: 22 }, g);
      const t = svg('text', { y: 10, 'text-anchor': 'middle', class: 'lp-nt lp-nt--sm' }, g); t.textContent = d.t;
    });
    const zt = svg('text', { x: C, y: 506, 'text-anchor': 'middle', class: 'lp-cs' }, gB); zt.textContent = 'automação "zero-touch" da rede';

    /* abas de setor */
    const tabBtns = L.sectors.map((x, i) => {
      const b = document.createElement('button');
      b.type = 'button'; b.className = 'stab'; b.setAttribute('role', 'tab'); b.id = 'stab-' + x.id;
      b.textContent = x.n;
      b.addEventListener('click', () => { sec = i; hl = -1; render(); });
      tabs.appendChild(b);
      return b;
    });
    IOT.radioKeys(tabs, b => { sec = tabBtns.indexOf(b); hl = -1; render(); });

    function render() {
      s.dataset.dir = dir;
      const x = L.sectors[sec];
      tabBtns.forEach((b, i) => { b.setAttribute('aria-selected', i === sec ? 'true' : 'false'); b.tabIndex = i === sec ? 0 : -1; b.disabled = dir === 'b'; });
      tabs.classList.toggle('is-off', dir === 'b');
      nodes.forEach((g, i) => g.classList.toggle('is-hl', i === hl));
      cT1.textContent = x.n;
      cT2.textContent = 'realimentação:';
      const lines = ['', ''];
      let li = 0;
      x.fb.split(' ').forEach(w => {
        const cand = lines[li] ? lines[li] + ' ' + w : w;
        if (li === 0 && lines[0] && cand.length > 24) { li = 1; lines[1] = w; } else lines[li] = cand;
      });
      cT3.textContent = lines[0];
      cT4.textContent = lines[1];
      if (dir === 'a') {
        const steps = [['iot', 'Dados', x.iot], ['net', 'Transporte', x.net], ['ai', 'Decisão', x.ai], ['act', 'Ação', x.act]];
        panel.innerHTML = `<p class="eyebrow">Exemplo · ${esc(x.n)}</p>
          <ol class="lp-steps">${steps.map((st, i) => `<li class="${i === hl ? 'is-hl' : ''}"><span class="lp-sn mono">${st[1]}</span><span>${esc(st[2])}</span></li>`).join('')}
          <li class="lp-fb"><span class="lp-sn mono">Volta</span><span>${esc(x.fb)}</span></li></ol>
          <p class="eyebrow">Como o 5G serve à IA</p>
          <ul class="lp-list">${L.dirA.map(t => `<li>${esc(t)}</li>`).join('')}</ul>`;
      } else {
        panel.innerHTML = `<p class="eyebrow">A IA dentro da própria rede</p>
          <ul class="lp-cards">${L.dirB.map(d => `<li><b>${esc(d.t)}</b><span>${esc(d.d)}</span></li>`).join('')}</ul>
          <p class="lp-zero">O resultado é a automação <strong>"zero-touch"</strong>: a rede prevê problemas, ajusta recursos e economiza energia sem intervenção humana.</p>`;
      }
    }
    IOT.seg($('#dirSeg'), 'd', d => { dir = d; hl = -1; render(); });
    render();
  }

  document.addEventListener('DOMContentLoaded', initLoop);
})();

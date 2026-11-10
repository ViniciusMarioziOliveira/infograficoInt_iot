/* Q5 — contexto 2026, metas de 5G SA, latência fim a fim e desafios. */
(function () {
  'use strict';
  const IOT = window.IOT;
  const { $, $$, esc } = IOT;

  /* ---------- FIG 5.1 anéis ---------- */
  function initRings() {
    const box = $('#rings');
    if (!box) return;
    const R = 54, C = 2 * Math.PI * R;
    const data = [
      { v: 77, big: '77%', l: 'da população tem 5G disponível', tip: 'Dados do governo de outubro de 2026: 5G em 1.610 municípios, alcançando cerca de 77% da população.' },
      { v: 1610 / 5570 * 100, big: '29%', l: 'dos 5.570 municípios do país', tip: 'Cálculo nosso: 1.610 municípios com 5G ÷ 5.570 municípios do Brasil ≈ 28,9%. As grandes cidades vieram primeiro.' }
    ];
    box.innerHTML = data.map((d, i) => `
      <div class="ring" tabindex="0" data-i="${i}">
        <svg viewBox="0 0 140 140" aria-hidden="true"><circle class="ring-bg" cx="70" cy="70" r="${R}"/>
          <circle class="ring-fg" cx="70" cy="70" r="${R}" stroke-dasharray="${C.toFixed(1)}" stroke-dashoffset="${(C * (1 - d.v / 100)).toFixed(1)}" transform="rotate(-90 70 70)"/></svg>
        <div class="ring-c"><b>${d.big}</b></div>
        <p class="ring-l">${esc(d.l)}</p>
      </div>`).join('') + '<p class="rings-x">mesma rede, retratos diferentes</p>';
    $$('.ring', box).forEach(el => {
      const d = data[+el.dataset.i];
      const html = `<b>${esc(d.big)} ${esc(d.l)}</b>${esc(d.tip)}`;
      el.setAttribute('aria-label', `${d.big} ${d.l}. ${d.tip}`);
      el.addEventListener('mouseenter', () => IOT.tip.showFor(el, html));
      el.addEventListener('focus', () => IOT.tip.showFor(el, html));
      el.addEventListener('mouseleave', () => IOT.tip.hide());
      el.addEventListener('blur', () => IOT.tip.hide());
    });
    if (!IOT.reduced) {
      const fgs = $$('.ring-fg', box);
      const finals = fgs.map(f => f.getAttribute('stroke-dashoffset'));
      IOT.onVisible(box, () => {
        fgs.forEach(f => { f.style.transition = 'none'; f.setAttribute('stroke-dashoffset', C.toFixed(1)); });
        requestAnimationFrame(() => requestAnimationFrame(() => fgs.forEach((f, i) => { f.style.transition = ''; f.setAttribute('stroke-dashoffset', finals[i]); })));
      }, .5);
    }
  }

  /* ---------- FIG 5.2 linha do tempo + calculadora ---------- */
  function initGoals() {
    const tl = $('#saTimeline'), input = $('#popInput'), range = $('#popRange'), out = $('#calcOut'), dots = $('#antDots');
    if (!tl) return;
    const D0 = new Date(2021, 5, 1).getTime(), D1 = new Date(2030, 5, 1).getTime();
    const pos = d => ((d.getTime() - D0) / (D1 - D0) * 100).toFixed(2) + '%';
    const MS = [
      { id: 'leilao', d: new Date(2021, 10, 4), t: 'nov/2021', l: 'Leilão do 5G (Anatel)' },
      { id: 'inicio', d: new Date(2022, 6, 6), t: '2022', l: '5G comercial começa' },
      { id: 'm200', d: new Date(2026, 6, 31), t: 'jul/2026', l: 'SA: acima de 200 mil hab.' },
      { id: 'm100', d: new Date(2027, 6, 31), t: 'jul/2027', l: 'SA: acima de 100 mil hab.' },
      { id: 'm30', d: new Date(2029, 6, 31), t: 'jul/2029', l: 'SA: acima de 30 mil hab.' },
      { id: '6g', d: new Date(2030, 0, 15), t: '~2030', l: '6G esperado' }
    ];
    const now = new Date();
    tl.innerHTML = `<div class="tl-track"><span class="tl-fill" style="width:${pos(now)}"></span></div>
      ${MS.map((m, i) => `<div class="tl-m tl-m--${i % 2 ? 'b' : 't'}${i === 0 ? ' tl-m--first' : ''}${i === MS.length - 1 ? ' tl-m--last' : ''}" data-id="${m.id}" style="left:${pos(m.d)}"><span class="tl-dot"></span><span class="tl-t mono">${m.t}</span><span class="tl-l">${esc(m.l)}</span></div>`).join('')}
      <div class="tl-now" style="left:${pos(now)}" title="hoje"></div>`;

    const LMIN = Math.log10(5000), LMAX = Math.log10(13000000);
    const toRange = v => Math.round((Math.log10(v) - LMIN) / (LMAX - LMIN) * 1000);
    const fromRange = k => Math.round(Math.pow(10, LMIN + k / 1000 * (LMAX - LMIN)) / 1000) * 1000;
    function monthsBetween(a, b) { return (b.getFullYear() - a.getFullYear()) * 12 + (b.getMonth() - a.getMonth()); }

    function calc(pop, from) {
      pop = IOT.clamp(Math.round(pop) || 0, 1000, 13000000);
      if (from !== 'input') input.value = pop;
      if (from !== 'range') range.value = toRange(pop);
      let ms = null, rule = '';
      if (pop > 200000) { ms = MS[2]; rule = 'acima de 200 mil habitantes'; }
      else if (pop > 100000) { ms = MS[3]; rule = 'entre 100 e 200 mil habitantes'; }
      else if (pop > 30000) { ms = MS[4]; rule = 'entre 30 e 100 mil habitantes'; }
      $$('.tl-m', tl).forEach(el => el.classList.toggle('is-hl', !!ms && el.dataset.id === ms.id));
      if (!ms) {
        out.innerHTML = `<p class="co-big">Sem meta</p><p>Municípios com até 30 mil habitantes ficam fora deste cronograma de 5G SA. Para IoT, nesses lugares, LPWAN (LoRaWAN, NB-IoT, LTE-M) e satélite seguem como caminho.</p>`;
        dots.innerHTML = '';
        return;
      }
      const n = Math.ceil(pop / 15000);
      const m = monthsBetween(now, ms.d);
      const status = now > ms.d
        ? `<span class="co-st is-past">prazo vencido em ${ms.t}</span>`
        : `<span class="co-st">faltam ${m} ${m === 1 ? 'mês' : 'meses'} (${ms.t})</span>`;
      out.innerHTML = `<p class="eyebrow">Meta mínima de 5G SA</p>
        <p class="co-big"><span class="num">${fmtNum(n, 0)}</span> <small>${n === 1 ? 'antena' : 'antenas'}</small></p>
        <p>${fmtNum(pop, 0)} ÷ 15.000 hab., arredondado para cima. Município ${rule}: prazo até ${ms.t}. ${status}</p>`;
      const show = Math.min(n, 240);
      dots.innerHTML = Array.from({ length: show }, () => '<i></i>').join('') + (n > show ? `<span class="mono small">+${fmtNum(n - show, 0)}</span>` : '');
    }
    input.addEventListener('input', () => { if (input.value) calc(+input.value, 'input'); });
    input.addEventListener('change', () => calc(+input.value));
    range.addEventListener('input', () => calc(fromRange(+range.value), 'range'));
    $$('#popPresets .chip').forEach(b => b.addEventListener('click', () => calc(+b.dataset.v)));
    calc(150000);
  }

  /* ---------- FIG 5.3 latência fim a fim ---------- */
  function initEdge() {
    const range = $('#edgeRange'), km = $('#edgeKm'), viz = $('#edgeViz');
    if (!range) return;
    const toKm = k => Math.pow(10, k / 1000 * 4);
    const toK = d => Math.round(Math.log10(d) / 4 * 1000);
    const LMIN = -2.3, LMAX = 2.3;
    const X = ms => IOT.clamp((Math.log10(ms) - LMIN) / (LMAX - LMIN) * 100, 0, 100);
    const refs = [[1, 'URLLC 1 ms'], [10, '5G 10 ms'], [40, '4G 30–50 ms']];
    viz.innerHTML = `
      <div class="ev-path"><span class="ev-dev">${IOT.icon('i-factory')}dispositivo</span><span class="ev-line"><i class="ev-pulse"></i></span><span class="ev-srv">${IOT.icon('i-edge')}<b class="ev-km num"></b></span></div>
      <div class="ev-chart">
        <div class="ev-axis">${[0.01, 0.1, 1, 10, 100].map(v => `<span style="left:${X(v)}%">${fmtNum(v, v < 1 ? (v < .1 ? 2 : 1) : 0)} ms</span>`).join('')}</div>
        <div class="ev-bar-box"><span class="ev-bar"></span>${refs.map(r => `<span class="ev-ref" style="left:${X(r[0])}%"><span>${r[1]}</span></span>`).join('')}</div>
      </div>
      <p class="ev-out" aria-live="polite"></p>`;
    const bar = $('.ev-bar', viz), outP = $('.ev-out', viz), kmB = $('.ev-km', viz), pulse = $('.ev-pulse', viz);
    function set(d, fromRange) {
      d = IOT.clamp(d, 1, 10000);
      if (!fromRange) range.value = toK(d);
      const rtt = d * 0.01;
      const dTxt = d < 10 ? fmtNum(d, 1) : fmtNum(Math.round(d), 0);
      km.textContent = dTxt + ' km';
      kmB.textContent = dTxt + ' km';
      bar.style.width = X(rtt) + '%';
      bar.classList.toggle('is-bad', rtt >= 1);
      pulse.style.animationDuration = (0.6 + Math.log10(d + 1) * .8).toFixed(2) + 's';
      const v = rtt < .1 ? fmtNum(rtt, 3) : rtt < 10 ? fmtNum(rtt, 2) : fmtNum(rtt, 0);
      let verdict;
      if (rtt < .5) verdict = 'Sobra tempo: a borda permite respostas dentro do orçamento de tempo real.';
      else if (rtt < 1) verdict = 'Já consome boa parte de 1 ms. O servidor precisa estar perto.';
      else if (rtt < 10) verdict = 'Só a viagem da luz já passa de 1 ms: URLLC fica impossível; serve para aplicações de ~10 ms.';
      else verdict = 'Só a distância já supera a latência típica do 5G. Tempo real exige processar na borda.';
      outP.innerHTML = `Ida e volta da luz na fibra: <b class="num">${v} ms</b>. ${verdict}`;
    }
    range.addEventListener('input', () => set(toKm(+range.value), true));
    $$('#edgePresets .chip').forEach(b => b.addEventListener('click', () => set(+b.dataset.km)));
    set(30);
  }

  /* ---------- FIG 5.4 desafios ---------- */
  function initChallenges() {
    const grid = $('#chGrid');
    if (!grid) return;
    grid.innerHTML = IOT.CHALLENGES.map((c, i) => `
      <button type="button" class="chal" aria-pressed="false">
        <span class="chal-f">${IOT.icon(c.icon, 'chal-ico')}<span class="chal-t">${esc(c.t)}</span><span class="chal-d">${esc(c.d)}</span><span class="chal-more mono">como lidar →</span></span>
        <span class="chal-b" aria-hidden="true"><span class="eyebrow">Como lidar</span><span class="chal-fix">${esc(c.fix)}</span><span class="chal-more mono">← voltar</span></span>
      </button>`).join('');
    $$('.chal', grid).forEach(b => b.addEventListener('click', () => {
      const on = b.getAttribute('aria-pressed') !== 'true';
      b.setAttribute('aria-pressed', String(on));
      b.querySelector('.chal-f').setAttribute('aria-hidden', String(on));
      b.querySelector('.chal-b').setAttribute('aria-hidden', String(!on));
    }));
  }

  document.addEventListener('DOMContentLoaded', () => {
    initRings();
    initGoals();
    initEdge();
    initChallenges();
  });
})();

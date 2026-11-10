/* Q4 — colmeia de setores com filtro por pilar. */
(function () {
  'use strict';
  const IOT = window.IOT;
  const { $, $$, esc } = IOT;

  const WHY = {
    urllc: 'O que mais pesa é o controle em tempo real: comandos em milissegundos e com 99,999% de confiabilidade.',
    embb: 'O que mais pesa é a banda: vídeo e imagens em alta resolução, realidade aumentada e drones.',
    mmtc: 'O que mais pesa é a escala: milhares de sensores simples, baratos e de bateria longa.'
  };

  function initHive() {
    const hive = $('#hive'), det = $('#hiveDetail');
    if (!hive) return;
    const S = IOT.SECTORS;
    let sel = 0, filter = 'all';
    const rows = [S.slice(0, 3), S.slice(3, 6), S.slice(6, 9)];
    hive.innerHTML = rows.map((r, ri) => `<div class="hive-row${ri === 1 ? ' hive-row--off' : ''}">${r.map(sec => {
      const i = S.indexOf(sec);
      return `<button type="button" class="hex" data-i="${i}" aria-pressed="false">
        <span class="hex-in">${IOT.icon(sec.icon, 'hex-ico')}<span class="hex-n">${esc(sec.n)}</span>
        <span class="hex-p">${sec.p.map(p => `<i class="g g--${p}" title="${IOT.PILLARS[p].name}"></i>`).join('')}</span></span></button>`;
    }).join('')}</div>`).join('');
    const hexes = $$('.hex', hive);

    function render() {
      hexes.forEach(h => {
        const sec = S[+h.dataset.i];
        h.setAttribute('aria-pressed', +h.dataset.i === sel ? 'true' : 'false');
        h.classList.toggle('is-dim', filter !== 'all' && !sec.p.includes(filter));
      });
      const sec = S[sel];
      const order = ['1º', '2º', '3º'];
      det.innerHTML = `
        <div class="hd-top">${IOT.icon(sec.icon, 'hd-ico')}<div><p class="eyebrow">Setor</p><h4>${esc(sec.n)}</h4></div></div>
        <div class="hd-pillars">${sec.p.map((p, k) => `<span class="hd-rank"><span class="mono">${order[k]}</span>${IOT.ptag(p)}</span>`).join('')}</div>
        <p class="hd-why">${esc(WHY[sec.p[0]])}</p>
        <p class="eyebrow">Aplicações viabilizadas ou potencializadas</p>
        <ul class="hd-apps">${sec.apps.map(a => `<li>${esc(a)}</li>`).join('')}</ul>
        ${filter !== 'all' && !sec.p.includes(filter) ? `<p class="small muted">Este setor não tem ${IOT.PILLARS[filter].name} entre os pilares principais.</p>` : ''}`;
    }
    hexes.forEach(h => h.addEventListener('click', () => { sel = +h.dataset.i; render(); }));
    IOT.seg($('#hiveSeg'), 'p', p => {
      filter = p;
      if (p !== 'all' && !S[sel].p.includes(p)) {
        const first = S.findIndex(s => s.p[0] === p);
        if (first >= 0) sel = first;
      }
      render();
    });
    render();
  }

  document.addEventListener('DOMContentLoaded', initHive);
})();

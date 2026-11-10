/* Conclusão — árvore de decisão de conectividade e quiz. */
(function () {
  'use strict';
  const IOT = window.IOT;
  const { $, $$, esc } = IOT;

  /* ---------- FIG 7.1 qual conectividade? ---------- */
  function initPick() {
    const box = $('#pick');
    if (!box) return;
    const T = IOT.PICK;
    let path = [];

    function render() {
      const at = path.length ? path[path.length - 1].next : T.start;
      const crumbs = path.map((p, i) => `<button type="button" class="crumb" data-i="${i}" title="Voltar a esta pergunta"><span class="mono">${i + 1}</span>${esc(p.a)}</button>`).join('');
      let body;
      if (T.nodes[at]) {
        const n = T.nodes[at];
        body = `<div class="pk-q"><p class="eyebrow">Pergunta ${path.length + 1}</p><h4>${esc(n.q)}</h4>
          <div class="pk-opts">${n.o.map((o, i) => `<button type="button" class="pk-opt" data-i="${i}">${esc(o[0])}<span aria-hidden="true">→</span></button>`).join('')}</div></div>`;
      } else {
        const r = T.results[at];
        const short = ['rble', 'rbt', 'rzig'].includes(at);
        body = `<div class="pk-r${r.star ? ' pk-r--star' : ''}">
          <p class="eyebrow">Tecnologia indicada</p>
          <h4>${esc(r.t)}</h4>
          <div class="pk-tags">${r.p ? IOT.ptag(r.p) : ''}${r.star ? '<span class="ptag pk-star">escolha da dupla na pesquisa</span>' : ''}</div>
          <p class="pk-why">${esc(r.why)}</p>
          <dl class="pk-stats">${r.s.map(x => `<div><dt>${esc(x[0])}</dt><dd>${esc(x[1])}</dd></div>`).join('')}</dl>
          ${short ? '<p class="small muted">Combine com o 5G: um gateway com conexão celular leva os dados da rede local até a nuvem.</p>' : ''}
          <button type="button" class="btn" id="pickAgain">${IOT.icon('i-reset')}Recomeçar</button></div>`;
      }
      box.innerHTML = `${path.length ? `<div class="crumbs">${crumbs}</div>` : ''}${body}`;
      $$('.pk-opt', box).forEach(b => b.addEventListener('click', () => {
        const n = T.nodes[at], o = n.o[+b.dataset.i];
        path.push({ q: n.q, a: o[0], next: o[1] });
        render();
        const f = $('.pk-opt, #pickAgain', box); if (f) f.focus({ preventScroll: true });
      }));
      $$('.crumb', box).forEach(b => b.addEventListener('click', () => { path = path.slice(0, +b.dataset.i); render(); }));
      const again = $('#pickAgain', box);
      if (again) again.addEventListener('click', () => { path = []; render(); const f = $('.pk-opt', box); if (f) f.focus({ preventScroll: true }); });
    }
    render();
  }

  /* ---------- FIG 7.2 quiz ---------- */
  function initQuiz() {
    const box = $('#quiz'), bestEl = $('#quizBest');
    if (!box) return;
    const Q = IOT.QUIZ;
    let i = 0, score = 0, answered = false, results = [];
    const KEY = 'iot5g-quiz-best';
    function getBest() { try { return parseInt(localStorage.getItem(KEY) || '', 10); } catch (e) { return NaN; } }
    function setBest(v) { try { localStorage.setItem(KEY, String(v)); } catch (e) { /* sem armazenamento */ } }
    function showBest() { const b = getBest(); bestEl.textContent = isNaN(b) ? 'sem recorde ainda' : `recorde: ${b}/${Q.length}`; }

    function dots() {
      return `<div class="qz-dots" aria-hidden="true">${Q.map((_, k) => `<i class="${k < results.length ? (results[k] ? 'ok' : 'no') : k === i ? 'now' : ''}"></i>`).join('')}</div>`;
    }
    function render() {
      if (i >= Q.length) {
        const best = getBest();
        if (isNaN(best) || score > best) setBest(score);
        showBest();
        const msg = score === Q.length ? 'Gabaritou! Você domina o 5G na IoT.' : score >= 4 ? 'Muito bem! Revise as perguntas que errou nas seções indicadas.' : 'Vale explorar as figuras de novo e tentar outra vez.';
        box.innerHTML = `${dots()}<div class="qz-end"><p class="eyebrow">Resultado</p><p class="qz-score"><span class="num">${score}</span>/${Q.length}</p><p>${msg}</p>
          <button type="button" class="btn btn--ink" id="qzAgain">${IOT.icon('i-reset')}Refazer o teste</button></div>`;
        $('#qzAgain', box).addEventListener('click', () => { i = 0; score = 0; results = []; answered = false; render(); });
        return;
      }
      const q = Q[i];
      answered = false;
      box.innerHTML = `${dots()}<p class="eyebrow">Pergunta ${i + 1} de ${Q.length}</p><h4 class="qz-q">${esc(q.q)}</h4>
        <div class="qz-opts">${q.o.map((o, k) => `<button type="button" class="qz-opt" data-k="${k}"><span class="qz-l mono">${'ABCD'[k]}</span>${esc(o)}</button>`).join('')}</div>
        <div class="qz-fb" aria-live="polite"></div>`;
      $$('.qz-opt', box).forEach(b => b.addEventListener('click', () => answer(+b.dataset.k)));
    }
    function answer(k) {
      if (answered) return;
      answered = true;
      const q = Q[i], ok = k === q.a;
      if (ok) score++;
      results.push(ok);
      $$('.qz-opt', box).forEach((b, j) => {
        b.disabled = true;
        if (j === q.a) b.classList.add('is-right');
        else if (j === k) b.classList.add('is-wrong');
      });
      const fb = $('.qz-fb', box);
      fb.innerHTML = `<p class="${ok ? 'qz-ok' : 'qz-no'}">${IOT.icon(ok ? 'i-check' : 'i-x')}<b>${ok ? 'Correto.' : 'Não foi dessa vez.'}</b> ${esc(q.e)}</p>
        <button type="button" class="btn btn--ink" id="qzNext">${i + 1 < Q.length ? 'Próxima pergunta' : 'Ver resultado'}</button>`;
      const old = $('.qz-dots', box); if (old) old.outerHTML = dots();
      const next = $('#qzNext', box);
      next.addEventListener('click', () => { i++; render(); const f = $('.qz-opt, #qzAgain', box); if (f) f.focus({ preventScroll: true }); });
      next.focus({ preventScroll: true });
    }
    showBest();
    render();
  }

  document.addEventListener('DOMContentLoaded', () => {
    initPick();
    initQuiz();
  });
})();

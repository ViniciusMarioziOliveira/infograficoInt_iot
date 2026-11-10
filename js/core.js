/* Núcleo: utilitários, tema, navegação, glossário e contadores. */
(function () {
  'use strict';
  const IOT = window.IOT;

  /* ---------- utilitários ---------- */
  window.fmtNum = function (v, dec) {
    return Number(v).toLocaleString('pt-BR', { minimumFractionDigits: dec || 0, maximumFractionDigits: dec || 0 });
  };
  IOT.$ = (s, r) => (r || document).querySelector(s);
  IOT.$$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  IOT.reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  IOT.clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  IOT.lerp = (a, b, t) => a + (b - a) * t;
  IOT.ease = t => (t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
  IOT.esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  const SVGNS = 'http://www.w3.org/2000/svg';
  IOT.svg = function (tag, attrs, parent) {
    const n = document.createElementNS(SVGNS, tag);
    if (attrs) for (const k in attrs) n.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(n);
    return n;
  };
  IOT.icon = (id, cls) => `<svg class="${cls || 'ico'}" aria-hidden="true"><use href="#${id}"/></svg>`;
  IOT.ptag = p => {
    if (!p || !IOT.PILLARS[p]) return '';
    return `<span class="ptag ptag--${p}">${IOT.PILLARS[p].name}</span>`;
  };

  /* lê um token de cor do tema atual (para canvas e SVG desenhados por JS) */
  IOT.color = name => getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  IOT.withAlpha = function (color, a) {
    const c = color.trim();
    if (c.startsWith('#')) {
      let h = c.slice(1);
      if (h.length === 3) h = h.split('').map(x => x + x).join('');
      const n = parseInt(h.slice(0, 6), 16);
      return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`;
    }
    const m = c.match(/rgba?\(([^)]+)\)/);
    if (m) { const p = m[1].split(',').map(s => s.trim()); return `rgba(${p[0]},${p[1]},${p[2]},${a})`; }
    return c;
  };

  /* executa quando o elemento entra na tela */
  IOT.onVisible = function (el, cb, threshold) {
    if (!el) return;
    if (!('IntersectionObserver' in window)) { cb(); return; }
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { io.disconnect(); cb(); } });
    }, { threshold: threshold == null ? .25 : threshold });
    io.observe(el);
  };
  /* informa se o elemento está visível (para pausar animações fora da tela) */
  IOT.watch = function (el, cb) {
    if (!el) return;
    if (!('IntersectionObserver' in window)) { cb(true); return; }
    const io = new IntersectionObserver(entries => entries.forEach(e => cb(e.isIntersecting)), { threshold: 0 });
    io.observe(el);
  };

  /* controle segmentado com aria-pressed */
  IOT.seg = function (root, attr, onChange) {
    if (!root) return;
    const btns = IOT.$$('button', root);
    btns.forEach(b => b.addEventListener('click', () => {
      btns.forEach(x => x.setAttribute('aria-pressed', x === b ? 'true' : 'false'));
      onChange(b.dataset[attr], b);
    }));
  };

  /* canvas nítido em telas de alta densidade */
  IOT.fitCanvas = function (canvas, h) {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = canvas.clientWidth || canvas.parentElement.clientWidth;
    const hh = h || canvas.clientHeight;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(hh * dpr);
    const ctx = canvas.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    return { ctx, w, h: hh };
  };

  /* ---------- tema ---------- */
  const root = document.documentElement;
  const mq = window.matchMedia('(prefers-color-scheme: dark)');
  IOT.isDark = () => root.getAttribute('data-theme') === 'dark' || (!root.getAttribute('data-theme') && mq.matches);
  function themeChanged() {
    const btn = IOT.$('#themeBtn');
    if (btn) {
      btn.innerHTML = IOT.icon(IOT.isDark() ? 'i-sun' : 'i-moon');
      btn.setAttribute('aria-label', IOT.isDark() ? 'Mudar para tema claro' : 'Mudar para tema escuro');
    }
    document.dispatchEvent(new CustomEvent('themechange'));
  }
  IOT.toggleTheme = function () {
    const next = IOT.isDark() ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    try { localStorage.setItem('iot5g-theme', next); } catch (e) { /* armazenamento indisponível */ }
    themeChanged();
  };
  if (mq.addEventListener) mq.addEventListener('change', themeChanged);
  document.addEventListener('DOMContentLoaded', () => {
    const btn = IOT.$('#themeBtn');
    if (btn) btn.addEventListener('click', IOT.toggleTheme);
    themeChanged();
  });

  /* ---------- tooltip compartilhado ---------- */
  IOT.tip = {
    el: null,
    show(html, x, y) {
      const t = this.el || (this.el = document.getElementById('tip'));
      if (!t) return;
      t.innerHTML = html;
      t.classList.add('show');
      const r = t.getBoundingClientRect();
      const vw = window.innerWidth, vh = window.innerHeight;
      let left = IOT.clamp(x - r.width / 2, 8, vw - r.width - 8);
      let top = y + 14;
      if (top + r.height > vh - 8) top = y - r.height - 14;
      t.style.left = left + 'px';
      t.style.top = Math.max(8, top) + 'px';
    },
    showFor(target, html) {
      const r = target.getBoundingClientRect();
      this.show(html, r.left + r.width / 2, r.bottom - 6);
    },
    hide() { if (this.el) this.el.classList.remove('show'); }
  };

  function initGlossary() {
    IOT.$$('.term').forEach(b => {
      const g = IOT.GLOSSARY[b.dataset.term];
      if (!g) return;
      b.setAttribute('aria-label', `${b.textContent.trim()}: ${g[1]}`);
      const html = `<b>${IOT.esc(g[0])}</b>${IOT.esc(g[1])}`;
      b.addEventListener('mouseenter', () => IOT.tip.showFor(b, html));
      b.addEventListener('focus', () => IOT.tip.showFor(b, html));
      b.addEventListener('mouseleave', () => IOT.tip.hide());
      b.addEventListener('blur', () => IOT.tip.hide());
      b.addEventListener('click', e => { e.stopPropagation(); IOT.tip.showFor(b, html); });
    });
    document.addEventListener('click', () => IOT.tip.hide());
    window.addEventListener('scroll', () => IOT.tip.hide(), { passive: true });
  }

  /* ---------- contadores ---------- */
  IOT.countUp = function (el) {
    const target = parseFloat(el.dataset.count);
    const dec = parseInt(el.dataset.dec || '0', 10);
    if (IOT.reduced || isNaN(target) || (target < 10 && dec === 0)) { el.textContent = fmtNum(target, dec); return; }
    const dur = 1200, t0 = performance.now();
    function tick(now) {
      const k = Math.min(1, (now - t0) / dur);
      const e = 1 - Math.pow(1 - k, 3);
      el.textContent = fmtNum(target * e, dec);
      if (k < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  };
  function initCounters() {
    IOT.$$('[data-count]').forEach(el => IOT.onVisible(el, () => IOT.countUp(el), .6));
  }

  /* ---------- entrada suave das figuras ---------- */
  function initReveal() {
    IOT.$$('.reveal').forEach(el => IOT.onVisible(el, () => el.classList.add('in'), .08));
  }

  /* ---------- navegação: medidor de sinal ---------- */
  let sections = [];
  function initNav() {
    const links = IOT.$$('#signalNav a');
    const label = IOT.$('#nowLabel');
    sections = links.map(a => document.querySelector(a.getAttribute('href'))).filter(Boolean);
    let ticking = false;
    function update() {
      ticking = false;
      const mid = window.innerHeight * .35;
      let active = -1;
      sections.forEach((s, i) => { if (s.getBoundingClientRect().top <= mid) active = i; });
      links.forEach((a, i) => {
        a.classList.toggle('is-active', i === active);
        a.classList.toggle('is-past', i < active);
        if (i === active) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current');
      });
      if (label) label.textContent = active >= 0 ? `${links[active].textContent.trim()} · ${links[active].dataset.label}` : 'Início';
    }
    window.addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
    window.addEventListener('resize', update);
    update();
  }
  IOT.currentSection = function () {
    const mid = window.innerHeight * .35;
    let active = -1;
    sections.forEach((s, i) => { if (s.getBoundingClientRect().top <= mid) active = i; });
    return active;
  };
  IOT.goSection = function (i) {
    const s = sections[IOT.clamp(i, 0, sections.length - 1)];
    if (s) s.scrollIntoView({ behavior: IOT.reduced ? 'auto' : 'smooth', block: 'start' });
  };

  function initKeys() {
    document.addEventListener('keydown', e => {
      if (e.altKey || e.ctrlKey || e.metaKey) return;
      const t = e.target;
      if (t.closest && t.closest('input, textarea, select, [contenteditable], [role="radiogroup"], [role="tablist"], [role="application"]')) return;
      if (e.key === 'ArrowRight') { e.preventDefault(); IOT.goSection(IOT.currentSection() + 1); }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); const c = IOT.currentSection(); if (c <= 0) window.scrollTo({ top: 0, behavior: IOT.reduced ? 'auto' : 'smooth' }); else IOT.goSection(c - 1); }
      else if (/^[1-6]$/.test(e.key)) { IOT.goSection(parseInt(e.key, 10) - 1); }
      else if (e.key === 't' || e.key === 'T') { IOT.toggleTheme(); }
    });
  }

  /* radiogroup acessível: setas movem a seleção */
  IOT.radioKeys = function (group, onPick) {
    group.addEventListener('keydown', e => {
      const items = IOT.$$('[role="radio"], [role="tab"]', group);
      const i = items.indexOf(document.activeElement);
      if (i < 0) return;
      let n = -1;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') n = (i + 1) % items.length;
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') n = (i - 1 + items.length) % items.length;
      if (e.key === 'Home') n = 0;
      if (e.key === 'End') n = items.length - 1;
      if (n >= 0) { e.preventDefault(); items[n].focus(); onPick(items[n]); }
    });
  };

  document.addEventListener('DOMContentLoaded', () => {
    initGlossary();
    initCounters();
    initReveal();
    initNav();
    initKeys();
  });
})();

/* Hero: mapa de células hexagonais com antenas emitindo sinal e dispositivos IoT. */
(function () {
  'use strict';
  const IOT = window.IOT;

  document.addEventListener('DOMContentLoaded', () => {
    const cv = IOT.$('#heroCanvas');
    if (!cv) return;
    const hero = cv.parentElement;
    let ctx, W = 0, H = 0, R = 34;
    let hexes = [], grid = null, towers = [], devices = [], pulses = [];
    let col = {}, mouse = null, visible = true, raf = 0, last = 0, spawn = 0;

    function readColors() {
      col = {
        line: IOT.color('--line'), ink: IOT.color('--ink'), paper: IOT.color('--paper'),
        embb: IOT.color('--embb'), urllc: IOT.color('--urllc'), mmtc: IOT.color('--mmtc')
      };
    }

    function hexPath(p, x, y, r) {
      for (let k = 0; k < 6; k++) {
        const a = Math.PI / 180 * (60 * k - 90);
        const px = x + r * Math.cos(a), py = y + r * Math.sin(a);
        if (k === 0) p.moveTo(px, py); else p.lineTo(px, py);
      }
      p.closePath();
    }

    function setup() {
      const r = IOT.fitCanvas(cv, hero.clientHeight);
      ctx = r.ctx; W = r.w; H = r.h;
      R = W < 640 ? 24 : 34;
      const hw = Math.sqrt(3) * R, vh = 1.5 * R;
      hexes = [];
      grid = new Path2D();
      for (let row = -1; row * vh < H + 2 * R; row++) {
        for (let c = -1; c * hw < W + hw; c++) {
          const x = c * hw + (row % 2 ? hw / 2 : 0), y = row * vh;
          hexes.push({ x, y, glow: 0 });
          hexPath(grid, x, y, R - 1);
        }
      }
      const spots = W < 700 ? [[.86, .14], [.8, .9]] : [[.8, .26], [.93, .7], [.64, .86]];
      towers = spots.map(([fx, fy]) => {
        let best = hexes[0], bd = Infinity;
        hexes.forEach(h => { const d = Math.hypot(h.x - fx * W, h.y - fy * H); if (d < bd) { bd = d; best = h; } });
        return { x: best.x, y: best.y };
      });
      const n = IOT.clamp(Math.round(W * H / 9000), 26, 90);
      devices = [];
      for (let i = 0; i < n; i++) {
        const r0 = Math.random();
        devices.push({
          x: Math.random() * W, y: Math.random() * H,
          vx: (Math.random() - .5) * 10, vy: (Math.random() - .5) * 10,
          t: r0 < .5 ? 'mmtc' : r0 < .75 ? 'embb' : 'urllc', lit: 0, ox: 0, oy: 0
        });
      }
      pulses = [];
      towers.forEach((t, i) => pulses.push({ x: t.x, y: t.y, r: i * 60, max: 300, sp: 120 }));
    }

    function drawDevice(d) {
      const c = col[d.t];
      ctx.fillStyle = IOT.withAlpha(c, .35 + d.lit * .65);
      if (d.t === 'embb') ctx.fillRect(d.x - 4, d.y - 2, 8, 4);
      else if (d.t === 'urllc') { ctx.beginPath(); ctx.moveTo(d.x, d.y - 3.6); ctx.lineTo(d.x + 3.6, d.y); ctx.lineTo(d.x, d.y + 3.6); ctx.lineTo(d.x - 3.6, d.y); ctx.closePath(); ctx.fill(); }
      else { ctx.beginPath(); ctx.arc(d.x, d.y, 2.2, 0, Math.PI * 2); ctx.fill(); }
    }

    function frame(now) {
      const dt = Math.max(0, Math.min(.05, (now - last) / 1000 || 0));
      last = now;
      step(dt);
      draw();
      if (visible && !IOT.reduced) raf = requestAnimationFrame(frame);
      else raf = 0;
    }

    function step(dt) {
      spawn += dt;
      if (spawn > 2.3) {
        spawn = 0;
        const t = towers[Math.floor(Math.random() * towers.length)];
        if (t) pulses.push({ x: t.x, y: t.y, r: 0, max: 300, sp: 120 });
      }
      pulses.forEach(p => { p.r += p.sp * dt; });
      pulses = pulses.filter(p => p.r < p.max);
      hexes.forEach(h => {
        h.glow = Math.max(0, h.glow - dt * .7);
        pulses.forEach(p => {
          const d = Math.hypot(h.x - p.x, h.y - p.y);
          if (Math.abs(d - p.r) < R * .6) h.glow = Math.max(h.glow, 1 - p.r / p.max);
        });
      });
      devices.forEach(d => {
        d.x += d.vx * dt; d.y += d.vy * dt;
        if (d.x < 0 || d.x > W) d.vx *= -1;
        if (d.y < 0 || d.y > H) d.vy *= -1;
        d.lit = Math.max(0, d.lit - dt * .8);
        pulses.forEach(p => {
          const dist = Math.hypot(d.x - p.x, d.y - p.y);
          if (Math.abs(dist - p.r) < 7) { d.lit = 1; d.ox = p.x; d.oy = p.y; }
        });
      });
    }

    function draw() {
      ctx.clearRect(0, 0, W, H);
      ctx.lineWidth = 1;
      ctx.strokeStyle = col.line;
      ctx.stroke(grid);
      hexes.forEach(h => {
        if (h.glow > .02) {
          const p = new Path2D(); hexPath(p, h.x, h.y, R - 1);
          ctx.fillStyle = IOT.withAlpha(col.ink, h.glow * .09);
          ctx.fill(p);
        }
      });
      if (mouse) {
        let best = null, bd = Infinity;
        hexes.forEach(h => { const d = Math.hypot(h.x - mouse.x, h.y - mouse.y); if (d < bd) { bd = d; best = h; } });
        if (best) { const p = new Path2D(); hexPath(p, best.x, best.y, R - 1); ctx.strokeStyle = IOT.withAlpha(col.ink, .55); ctx.lineWidth = 1.5; ctx.stroke(p); ctx.lineWidth = 1; }
        devices.forEach(d => {
          const dist = Math.hypot(d.x - mouse.x, d.y - mouse.y);
          if (dist < 130) {
            ctx.strokeStyle = IOT.withAlpha(col[d.t], (1 - dist / 130) * .6);
            ctx.beginPath(); ctx.moveTo(mouse.x, mouse.y); ctx.lineTo(d.x, d.y); ctx.stroke();
          }
        });
      }
      devices.forEach(d => {
        if (d.lit > .05) {
          ctx.strokeStyle = IOT.withAlpha(col[d.t], d.lit * .45);
          ctx.beginPath(); ctx.moveTo(d.ox, d.oy); ctx.lineTo(d.x, d.y); ctx.stroke();
        }
      });
      devices.forEach(drawDevice);
      pulses.forEach(p => {
        ctx.strokeStyle = IOT.withAlpha(col.ink, (1 - p.r / p.max) * .4);
        ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.stroke();
      });
      ctx.lineWidth = 1;
      towers.forEach(t => {
        ctx.fillStyle = col.ink;
        ctx.beginPath(); ctx.moveTo(t.x, t.y - 11); ctx.lineTo(t.x + 6, t.y + 8); ctx.lineTo(t.x - 6, t.y + 8); ctx.closePath(); ctx.fill();
        ctx.beginPath(); ctx.arc(t.x, t.y - 13, 3, 0, Math.PI * 2); ctx.fill();
      });
      /* véu para manter o texto legível */
      if (W < 700) {
        ctx.fillStyle = IOT.withAlpha(col.paper, .62);
        ctx.fillRect(0, 0, W, H);
      } else {
        const g = ctx.createLinearGradient(0, 0, W, 0);
        g.addColorStop(0, IOT.withAlpha(col.paper, .9));
        g.addColorStop(.42, IOT.withAlpha(col.paper, .6));
        g.addColorStop(.72, IOT.withAlpha(col.paper, 0));
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, W, H);
      }
    }

    function start() { if (!raf && visible && !IOT.reduced) { last = performance.now(); raf = requestAnimationFrame(frame); } }

    function local(e) { const r = cv.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top }; }
    cv.addEventListener('pointermove', e => { mouse = local(e); if (IOT.reduced) draw(); });
    cv.addEventListener('pointerleave', () => { mouse = null; if (IOT.reduced) draw(); });
    cv.addEventListener('pointerdown', e => {
      const p = local(e);
      pulses.push({ x: p.x, y: p.y, r: 0, max: 240, sp: 170 });
      if (IOT.reduced) { pulses.forEach(q => { q.r = q.max * .5; }); step(0); draw(); }
      start();
    });

    readColors();
    setup();
    if (IOT.reduced) { pulses.forEach(p => { p.r = 120; }); step(0); draw(); }
    else start();

    IOT.watch(hero, v => { visible = v; if (v) start(); });
    let rt = 0, lw = window.innerWidth;
    window.addEventListener('resize', () => {
      clearTimeout(rt);
      rt = setTimeout(() => { if (window.innerWidth !== lw || Math.abs(hero.clientHeight - H) > 40) { lw = window.innerWidth; setup(); draw(); } }, 150);
    });
    document.addEventListener('themechange', () => { readColors(); draw(); });
  });
})();

(function(){
  const canvas = document.getElementById('bgCanvas');
  if(!canvas) return;
  const ctx = canvas.getContext('2d');
  let dpr = Math.max(1, window.devicePixelRatio || 1);
  let w, h, cx, cy;

  function resize(){
    w = canvas.clientWidth = window.innerWidth;
    h = canvas.clientHeight = window.innerHeight;
    cx = w/2; cy = h/2;
    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  window.addEventListener('resize', resize);
  resize();

  const DEEP = '#0f1512'; // deeper greenish base
  const GREEN = '#1D2C1E';
  const ORANGE = 'rgba(220,92,51,0.35)';
  const IVORY = 'rgba(231,228,212,0.35)';

  const RAYS = 28;        // number of rays
  const SPEED = 0.004;    // rotation speed
  const EXPAND = 0.06;    // slow pulsation of length

  function step(t){
    // t in ms; convert to seconds
    const time = t * 0.001;

    // base gradient background
    const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(w,h));
    g.addColorStop(0, GREEN);
    g.addColorStop(1, DEEP);
    ctx.fillStyle = g;
    ctx.fillRect(0,0,w,h);

    const maxR = Math.hypot(cx, cy) * (1.05 + Math.sin(time*EXPAND)*0.03);
    const angleOffset = time * SPEED * Math.PI * 2;

    // draw alternating ivory/orange rays
    for(let i=0;i<RAYS;i++){
      const a0 = angleOffset + (i / RAYS) * Math.PI * 2;
      const a1 = a0 + (Math.PI * 2 / RAYS) * 0.6; // ray width
      const col = (i % 2 === 0) ? IVORY : ORANGE;

      ctx.save();
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, maxR, a0, a1, false);
      ctx.closePath();
      ctx.fillStyle = col;
      ctx.globalAlpha = 0.65; // overall transparency for softness
      ctx.fill();
      ctx.restore();
    }

    // soft vignette
    const vg = ctx.createRadialGradient(cx, cy, Math.max(w,h)*0.4, cx, cy, Math.max(w,h));
    vg.addColorStop(0, 'rgba(0,0,0,0)');
    vg.addColorStop(1, 'rgba(0,0,0,0.35)');
    ctx.fillStyle = vg;
    ctx.fillRect(0,0,w,h);

    requestAnimationFrame(step);
  }

  requestAnimationFrame(step);
})();

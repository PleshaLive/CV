(function(){
  const canvas = document.getElementById('bgCanvas');
  if(!canvas) return;
  const ctx = canvas.getContext('2d');
  let dpr = Math.max(1, window.devicePixelRatio || 1);
  let w, h;

  function resize(){
    w = canvas.clientWidth = window.innerWidth;
    h = canvas.clientHeight = window.innerHeight;
    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  window.addEventListener('resize', resize);
  resize();

  const COUNT = Math.min(120, Math.floor((w*h) / 18000)); // density-based count
  const particles = new Array(COUNT).fill(0).map(() => {
    return {
      x: Math.random()*w,
      y: Math.random()*h,
      vx: (Math.random()*0.6 - 0.3),  // subtle drift
      vy: (Math.random()*0.6 - 0.3),
      r: Math.random()*1.6 + 0.6,     // small radii
      a: Math.random()*0.3 + 0.25,    // alpha
    };
  });

  // theme colors
  const ORANGE = 'rgba(220, 92, 51, 0.9)';
  const GOLD = 'rgba(29, 44, 30, 0.9)';
  const dots = ['#DC5C33', '#E7E4D4', '#7a897d'];

  function step(){
    ctx.clearRect(0,0,w,h);

    // subtle vignette
    const grd = ctx.createLinearGradient(0,0,w,h);
    grd.addColorStop(0, 'rgba(0,0,0,0.05)');
    grd.addColorStop(1, 'rgba(0,0,0,0.08)');
    ctx.fillStyle = grd;
    ctx.fillRect(0,0,w,h);

    // draw connections
    ctx.lineWidth = 0.6;
    for(let i=0;i<particles.length;i++){
      const p = particles[i];
      for(let j=i+1;j<particles.length;j++){
        const q = particles[j];
        const dx = p.x - q.x;
        const dy = p.y - q.y;
        const d2 = dx*dx + dy*dy;
        if(d2 < 130*130){
          const a = 1 - Math.sqrt(d2)/130;
          ctx.strokeStyle = `rgba(231,228,212,${a*0.15})`; // #E7E4D4 faint lines
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.stroke();
        }
      }
    }

    // draw particles
    for(const p of particles){
      p.x += p.vx;
      p.y += p.vy;
      if(p.x < -20) p.x = w+20; else if(p.x > w+20) p.x = -20;
      if(p.y < -20) p.y = h+20; else if(p.y > h+20) p.y = -20;

      const color = dots[(p.r*13|0) % dots.length];
      ctx.fillStyle = color;
      ctx.globalAlpha = p.a;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    requestAnimationFrame(step);
  }

  step();
})();

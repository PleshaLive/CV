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

  // Bokeh bubbles configuration
  const COUNT = Math.min(40, Math.floor((w*h) / 60000));
  const colors = [
    'rgba(231,228,212,0.25)', // soft light
    'rgba(220,92,51,0.18)',   // orange hint
    'rgba(29,44,30,0.20)',    // deep green
  ];

  function rand(min,max){ return Math.random()*(max-min)+min; }

  function makeBubble(){
    const baseR = rand(24, 120);
    return {
      x: rand(-baseR, w+baseR),
      y: rand(h*0.2, h+baseR),
      r: baseR,
      vx: rand(-0.06, 0.06),
      vy: rand(-0.22, -0.06), // gentle rise
      blur: rand(8, 28),
      color: colors[(Math.random()*colors.length)|0],
      life: rand(6, 18), // seconds
      t: rand(0, 1),     // phase 0..1
    };
  }

  const bubbles = new Array(COUNT).fill(0).map(makeBubble);

  function draw(){
    // soft dark pass to create cinematic trailing feel
    ctx.fillStyle = 'rgba(0,0,0,0.35)';
    ctx.fillRect(0,0,w,h);

    for(let i=0;i<bubbles.length;i++){
      const b = bubbles[i];
      b.x += b.vx;
      b.y += b.vy;
      b.t += (1 / (60*b.life));
      if(b.t > 1) b.t -= 1;

      // wrap around horizontally
      if(b.x < -b.r*1.2) b.x = w + b.r*1.2;
      if(b.x > w + b.r*1.2) b.x = -b.r*1.2;
      // recycle bubble when it goes off top
      if(b.y < -b.r*1.2){
        bubbles[i] = makeBubble();
        continue;
      }

      // alpha pulse: fade in, then out
      const pulse = Math.sin(Math.PI * (b.t)); // 0..1..0
      const alphaBoost = 0.35 + 0.65 * pulse; // 0.35..1.0

      // draw blurred circle
      ctx.save();
      ctx.filter = `blur(${b.blur}px)`;
      ctx.globalAlpha = alphaBoost;
      ctx.fillStyle = b.color;
      ctx.beginPath();
      ctx.arc(b.x, b.y, b.r, 0, Math.PI*2);
      ctx.fill();
      ctx.restore();
    }

    requestAnimationFrame(draw);
  }

  // initial dark base
  ctx.fillStyle = 'rgba(0,0,0,0.6)';
  ctx.fillRect(0,0,w,h);
  draw();
})();

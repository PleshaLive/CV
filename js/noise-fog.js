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

  // Value noise via moving layers approach for performance
  const LAYERS = [
    { scale: 180, alpha: 0.06, speedX: 0.003, speedY: 0.001 },
    { scale: 320, alpha: 0.05, speedX: -0.001, speedY: 0.002 },
    { scale: 540, alpha: 0.04, speedX: 0.0015, speedY: -0.001 }
  ];

  const palette = [
    [29,44,30],   // deep green (accent gold)
    [220,92,51],  // orange
    [16,16,16]    // near black
  ];

  function lerp(a,b,t){ return a + (b-a)*t; }
  function randSeed(x,y,t){
    // Simple hash-based pseudo-random function (fast, repeatable)
    const s = Math.sin(x*127.1 + y*311.7 + t*0.05) * 43758.5453;
    return s - Math.floor(s);
  }
  function smoothstep(t){ return t*t*(3-2*t); }

  function valueNoise(x,y,t){
    const xi = Math.floor(x), yi = Math.floor(y);
    const xf = x - xi,      yf = y - yi;
    const r00 = randSeed(xi, yi, t);
    const r10 = randSeed(xi+1, yi, t);
    const r01 = randSeed(xi, yi+1, t);
    const r11 = randSeed(xi+1, yi+1, t);
    const u = smoothstep(xf), v = smoothstep(yf);
    const x1 = lerp(r00, r10, u);
    const x2 = lerp(r01, r11, u);
    return lerp(x1, x2, v);
  }

  let time = 0;
  function step(){
    ctx.clearRect(0,0,w,h);

    // base gradient to keep depth on very dark backgrounds
    const grd = ctx.createLinearGradient(0, 0, w, h);
    grd.addColorStop(0, 'rgba(0,0,0,0.45)');
    grd.addColorStop(1, 'rgba(0,0,0,0.55)');
    ctx.fillStyle = grd;
    ctx.fillRect(0,0,w,h);

    // draw multi-layered drifting fog
    for(const layer of LAYERS){
      const cell = layer.scale; // bigger = smoother
      const cols = Math.ceil(w / cell) + 2;
      const rows = Math.ceil(h / cell) + 2;
      const ox = time * layer.speedX * 200; // offset evolves over time
      const oy = time * layer.speedY * 200;

      for(let y=0; y<rows; y++){
        for(let x=0; x<cols; x++){
          const nx = (x - 1) + (ox / cell);
          const ny = (y - 1) + (oy / cell);
          const n = valueNoise(nx, ny, time*0.15);

          // mix palette colors based on noise
          const t1 = n;
          const c1 = palette[0];
          const c2 = palette[2];
          const r = Math.round(lerp(c2[0], c1[0], t1));
          const g = Math.round(lerp(c2[1], c1[1], t1));
          const b = Math.round(lerp(c2[2], c1[2], t1));

          ctx.fillStyle = `rgba(${r},${g},${b},${layer.alpha})`;
          ctx.fillRect(Math.floor((x-1)*cell), Math.floor((y-1)*cell), cell+1, cell+1);
        }
      }
    }

    // occasional warm hint (very subtle orange wash)
    ctx.fillStyle = 'rgba(220,92,51,0.03)';
    ctx.fillRect(0,0,w,h);

    time += 1/60;
    requestAnimationFrame(step);
  }

  step();
})();

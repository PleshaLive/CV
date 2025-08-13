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

  // Mouse parallax tracking
  let mouseX = 0.5, mouseY = 0.5; // normalized
  window.addEventListener('mousemove', (e)=>{
    mouseX = e.clientX / w;
    mouseY = e.clientY / h;
  });

  // Create star/dust layers
  const LAYERS = [
    { count: Math.floor((w*h)/7000), size:[0.5,1.1], speed: 0.02, parallax: 10, color: 'rgba(231,228,212,0.35)' }, // near white
    { count: Math.floor((w*h)/11000), size:[0.8,1.6], speed: 0.04, parallax: 18, color: 'rgba(220,92,51,0.25)' },   // orange hints
    { count: Math.floor((w*h)/16000), size:[1.2,2.2], speed: 0.06, parallax: 26, color: 'rgba(29,44,30,0.35)' }     // deep green
  ];

  function rand(min,max){ return Math.random()*(max-min)+min; }

  function makeLayer(layer){
    const items = new Array(layer.count).fill(0).map(()=>({
      x: Math.random()*w,
      y: Math.random()*h,
      r: rand(layer.size[0], layer.size[1]),
      vx: (Math.random()*2 - 1) * layer.speed,
      vy: (Math.random()*2 - 1) * layer.speed
    }));
    return items;
  }

  const stars = LAYERS.map(makeLayer);

  function draw(){
    // background fade for trailing effect (very subtle)
    ctx.fillStyle = 'rgba(0,0,0,0.35)';
    ctx.fillRect(0,0,w,h);

    for(let i=0;i<LAYERS.length;i++){
      const layer = LAYERS[i];
      const arr = stars[i];
      ctx.fillStyle = layer.color;

      const offsetX = (mouseX - 0.5) * layer.parallax;
      const offsetY = (mouseY - 0.5) * layer.parallax;

      for(const p of arr){
        p.x += p.vx;
        p.y += p.vy;
        if(p.x < -20) p.x = w+20; else if(p.x > w+20) p.x = -20;
        if(p.y < -20) p.y = h+20; else if(p.y > h+20) p.y = -20;

        // draw
        const x = p.x + offsetX;
        const y = p.y + offsetY;
        ctx.beginPath();
        ctx.arc(x, y, p.r, 0, Math.PI*2);
        ctx.fill();
      }
    }
    requestAnimationFrame(draw);
  }

  // initial dark base to avoid flash
  ctx.fillStyle = 'rgba(0,0,0,0.5)';
  ctx.fillRect(0,0,w,h);
  draw();
})();

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

  // Palette (your theme): deep green, orange, ivory
  const DEEP = '#1D2C1E';
  const ORANGE = '#DC5C33';
  const IVORY = '#E7E4D4';

  // Layered scallop/arch pattern parameters
  const LAYERS = [
    { height: 120, speed: 0.045, alpha: 0.10, stroke: IVORY, fill: 'rgba(29,44,30,0.30)' },
    { height: 160, speed: 0.030, alpha: 0.09,  stroke: 'rgba(220,92,51,0.32)', fill: 'rgba(29,44,30,0.24)' },
    { height: 220, speed: 0.018, alpha: 0.08,  stroke: 'rgba(231,228,212,0.26)', fill: 'rgba(29,44,30,0.18)' }
  ];

  let time = 0;

  function drawScallops(yBase, height, colorStroke, colorFill, alpha){
    const radius = height;
    const diameter = radius*2;
    const cols = Math.ceil(w/diameter) + 2;

    // fill base strip
    ctx.globalAlpha = alpha;
    ctx.fillStyle = colorFill;
    ctx.fillRect(0, yBase-height, w, height+2);

    ctx.strokeStyle = colorStroke;
    ctx.lineWidth = 2;

    for(let i=0;i<cols;i++){
  const cx = (i-1)*diameter + (time*4 % diameter) - diameter/2; // slower lateral drift
      const cy = yBase;
      ctx.beginPath();
      // Draw top half-arc (scallop)
      ctx.arc(cx, cy, radius, Math.PI, 0);
      ctx.stroke();
    }
  }

  function step(){
    // rich dark gradient base for cinematic depth
    const bg = ctx.createLinearGradient(0,0,0,h);
    bg.addColorStop(0, 'rgba(10,10,10,0.95)');
    bg.addColorStop(1, 'rgba(15,15,15,0.98)');
    ctx.fillStyle = bg;
    ctx.fillRect(0,0,w,h);

    // vertical scroll for layers (parallax)
    for(let i=0;i<LAYERS.length;i++){
      const L = LAYERS[i];
      const stride = L.height;
      const rows = Math.ceil(h/stride) + 2;
      const yOffset = (time * L.speed * 40) % stride;
      for(let r=0;r<rows;r++){
        const y = h - r*stride + yOffset;
        drawScallops(y, L.height, L.stroke, L.fill, L.alpha);
      }
    }

    // subtle shimmer lines
    ctx.globalAlpha = 0.035;
    ctx.strokeStyle = ORANGE;
    ctx.lineWidth = 1;
    for(let y=0;y<h;y+=80){
      ctx.beginPath();
      ctx.moveTo(0, y + (Math.sin((y+time*6)*0.009)*3));
      ctx.lineTo(w, y + (Math.cos((y+time*6)*0.009)*3));
      ctx.stroke();
    }

    ctx.globalAlpha = 1;
    time += 1/60;
    requestAnimationFrame(step);
  }

  step();
})();

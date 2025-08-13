// UI enhancements: reveal on scroll, back-to-top, tilt, stat counters, header parallax
(function(){
  const toTop = document.querySelector('.to-top');
  const reveals = Array.from(document.querySelectorAll('.reveal'));
  const header = document.querySelector('.cv-header');

  // Reveal animation
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      if(e.isIntersecting){
        e.target.classList.add('visible');
        io.unobserve(e.target);
        // animate skill bars when skills section reveals
        if(e.target.id === 'skills'){
          document.querySelectorAll('#skills .skill-progress').forEach(bar=>{
            const width = bar.style.width;
            bar.style.width = '0%';
            // ensure transition is applied
            requestAnimationFrame(()=>{
              bar.style.transition = 'width 1.2s cubic-bezier(.2,.65,.2,1)';
              const onEnd = (ev)=>{
                if(ev.propertyName === 'width'){
                  bar.removeEventListener('transitionend', onEnd);
                  // trigger sheen after fill reached its target
                  bar.classList.add('shine');
                }
              };
              bar.addEventListener('transitionend', onEnd);
              bar.style.width = width;
            });
          });
        }
        // animate stat counters
        if(e.target.querySelector && e.target.querySelector('.stat-number')){
          e.target.querySelectorAll('.stat-number').forEach(el=>{
            const target = parseInt((el.textContent||'').replace(/\D/g,''), 10);
            if(!isFinite(target)) return;
            const suffix = (el.textContent||'').replace(/[0-9]/g,'');
            let start = 0;
            const dur = 800;
            const t0 = performance.now();
            const step = (t)=>{
              const k = Math.min(1, (t - t0)/dur);
              const val = Math.floor(start + (target-start)*k);
              el.textContent = val + suffix;
              if(k<1) requestAnimationFrame(step);
            };
            requestAnimationFrame(step);
          });
        }
      }
    });
  }, { rootMargin: '0px 0px -10% 0px', threshold: 0.1});
  reveals.forEach(el=>io.observe(el));

  // Back to top visibility
  const toggleToTop = ()=>{
    if(window.scrollY > 300) toTop?.classList.add('show');
    else toTop?.classList.remove('show');
  };
  window.addEventListener('scroll', toggleToTop, { passive: true });
  toggleToTop();
  toTop?.addEventListener('click', ()=> window.scrollTo({ top: 0, behavior: 'smooth' }));

  // Card tilt effect on mouse move (subtle)
  const tilt = (el, intensity=8)=>{
    let rAF;
    el.addEventListener('mousemove', (e)=>{
      cancelAnimationFrame(rAF);
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width/2;
      const cy = rect.top + rect.height/2;
      const dx = (e.clientX - cx) / rect.width;
      const dy = (e.clientY - cy) / rect.height;
      rAF = requestAnimationFrame(()=>{
        el.style.transform = `rotateX(${(-dy*intensity)}deg) rotateY(${(dx*intensity)}deg) translateY(-2px)`;
      });
    });
    el.addEventListener('mouseleave', ()=>{
      el.style.transform = 'translateY(0)';
    });
  };
  document.querySelectorAll('.tournament-item, .stat-item').forEach(el=>tilt(el, 6));

  // Header parallax on scroll
  if(header){
    const parallax = ()=>{
      const y = window.scrollY || 0;
      const amt = Math.min(30, y * 0.06);
      const info = header.querySelector('.header-info');
      const photo = header.querySelector('.profile-photo');
      info && (info.style.transform = `translateY(${amt * 0.5}px)`);
      photo && (photo.style.transform = `translateY(${amt * 0.25}px)`);
    };
    window.addEventListener('scroll', parallax, { passive: true });
    parallax();
  }
})();

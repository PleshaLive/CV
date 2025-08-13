// UI enhancements: scroll spy, reveal on scroll, back-to-top
(function(){
  const links = Array.from(document.querySelectorAll('.nav-links a'));
  const sections = links
    .map(a => document.querySelector(a.getAttribute('href')))
    .filter(Boolean);
  const toTop = document.querySelector('.to-top');
  const reveals = Array.from(document.querySelectorAll('.reveal'));

  // Reveal animation
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      if(e.isIntersecting){
        e.target.classList.add('visible');
        io.unobserve(e.target);
      }
    });
  }, { rootMargin: '0px 0px -10% 0px', threshold: 0.1});
  reveals.forEach(el=>io.observe(el));

  // Scroll spy
  const spy = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      const id = '#' + e.target.id;
      const link = links.find(l=>l.getAttribute('href')===id);
      if(!link) return;
      if(e.isIntersecting){
        links.forEach(l=>l.classList.remove('active'));
        link.classList.add('active');
      }
    });
  }, { threshold: 0.4 });
  sections.forEach(sec=>spy.observe(sec));

  // Back to top visibility
  const toggleToTop = ()=>{
    if(window.scrollY > 300) toTop?.classList.add('show');
    else toTop?.classList.remove('show');
  };
  window.addEventListener('scroll', toggleToTop, { passive: true });
  toggleToTop();
  toTop?.addEventListener('click', ()=> window.scrollTo({ top: 0, behavior: 'smooth' }));

  // Smooth scroll on nav click
  links.forEach(l=>{
    l.addEventListener('click', (e)=>{
      const target = document.querySelector(l.getAttribute('href'));
      if(!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
})();

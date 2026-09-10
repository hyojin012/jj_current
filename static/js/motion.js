(() => {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const header = document.querySelector('.header');
  const progress = document.querySelector('.scroll-progress span');
  const top = document.querySelector('.back-top');
  const glow = document.querySelector('.cursor-glow');
  const parallax = document.querySelectorAll('[data-parallax]');

  const update = () => {
    const max = document.documentElement.scrollHeight - innerHeight;
    if (progress) progress.style.width = `${max > 0 ? scrollY / max * 100 : 0}%`;
    if (header) header.classList.toggle('is-scrolled', scrollY > 20);
    if (top) top.classList.toggle('show', scrollY > 650);
    if (!reduce) parallax.forEach(el => { el.style.transform = `translateY(${scrollY * parseFloat(el.dataset.parallax || 0)}px)`; });
  };
  addEventListener('scroll', update, {passive:true}); update();

  if (top) top.addEventListener('click', () => scrollTo({top:0, behavior:reduce ? 'auto' : 'smooth'}));

  const reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !reduce) {
    const io = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('is-visible'); io.unobserve(entry.target); }
    }), {threshold:.12, rootMargin:'0px 0px -8% 0px'});
    reveals.forEach(el => io.observe(el));
  } else reveals.forEach(el => el.classList.add('is-visible'));

  const counts = document.querySelectorAll('[data-count]');
  if ('IntersectionObserver' in window && !reduce) {
    const co = new IntersectionObserver(entries => entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target, target = Number(el.dataset.count), suffix = el.dataset.suffix || '';
      const start = performance.now(), duration = 1200;
      const tick = now => { const p = Math.min((now-start)/duration,1), eased = 1-Math.pow(1-p,3); el.textContent = `${Math.round(target*eased)}${suffix}`; if (p < 1) requestAnimationFrame(tick); };
      requestAnimationFrame(tick); co.unobserve(el);
    }), {threshold:.7});
    counts.forEach(el => co.observe(el));
  } else counts.forEach(el => el.textContent = `${el.dataset.count}${el.dataset.suffix || ''}`);

  if (glow && matchMedia('(pointer:fine)').matches && !reduce) {
    let x=innerWidth/2,y=innerHeight/2,tx=x,ty=y;
    addEventListener('pointermove', e => {tx=e.clientX;ty=e.clientY}, {passive:true});
    const loop = () => {x+=(tx-x)*.1;y+=(ty-y)*.1;glow.style.left=`${x}px`;glow.style.top=`${y}px`;requestAnimationFrame(loop)}; loop();
  }
})();

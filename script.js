// Enhanced interactions: reveal on scroll, smooth nav, theme toggle, nav highlighting
document.addEventListener('DOMContentLoaded', () => {
  const sections = document.querySelectorAll('section');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        entry.target.classList.add('reveal');
      }
    });
  }, { threshold: 0.15 });

  sections.forEach(s => { revealObserver.observe(s); });

  // Reveal project cards with stagger
  const cards = document.querySelectorAll('.project-card');
  cards.forEach((c, i) => {
    c.style.transitionDelay = `${i * 120}ms`;
    revealObserver.observe(c);
  });

  // Smooth scroll for nav links
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const href = link.getAttribute('href');
      const target = document.querySelector(href);
      if(target) target.scrollIntoView({behavior:'smooth', block:'start'});
      navLinks.forEach(l => l.classList.remove('active'));
      link.classList.add('active');
    });
  });

  // Theme toggle with persistence, ARIA, and system preference fallback
  const themeToggle = document.getElementById('theme-toggle');
  const root = document.body;
  const savedTheme = localStorage.getItem('theme');
  const prefersLight = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;

  const applyTheme = (light) => {
    if(light) root.classList.add('light'); else root.classList.remove('light');
    if(themeToggle){
      themeToggle.textContent = light ? '☀️' : '🌙';
      themeToggle.setAttribute('aria-pressed', light ? 'true' : 'false');
      themeToggle.title = light ? 'Switch to dark theme' : 'Switch to light theme';
    }
    localStorage.setItem('theme', light ? 'light' : 'dark');
  };

  if(savedTheme !== null){
    applyTheme(savedTheme === 'light');
  } else {
    applyTheme(prefersLight);
  }

  if(themeToggle){
    themeToggle.addEventListener('click', () => {
      applyTheme(!root.classList.contains('light'));
    });
  }

  // Highlight nav by scroll position
  const sectionMap = Array.from(sections).reduce((acc,s) => { acc[s.id]=s; return acc; }, {});
  window.addEventListener('scroll', () => {
    const fromTop = window.scrollY + 100;
    let current = null;
    for(const id in sectionMap){
      const el = sectionMap[id];
      if(el.offsetTop <= fromTop) current = id;
    }
    navLinks.forEach(l => l.classList.remove('active'));
    const activeLink = document.querySelector(`.nav-link[href='#${current}']`);
    if(activeLink) activeLink.classList.add('active');
  });

  // Small tilt effect on project cards
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      card.style.transform = `rotateX(${ -y * 6 }deg) rotateY(${ x * 8 }deg) translateZ(0)`;
    });
    card.addEventListener('mouseleave', () => { card.style.transform = ''; });
  });
});
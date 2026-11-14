document.addEventListener('DOMContentLoaded', () => {
  const header = document.getElementById('header');

  const handleHeaderScroll = () => {
    if (window.scrollY > 50) {
      header.classList.add('header--scrolled');
    } else {
      header.classList.remove('header--scrolled');
    }
  };

  window.addEventListener('scroll', handleHeaderScroll);

  const hamburger = document.getElementById('hamburger');
  const navMenu = document.getElementById('navMenu');

  if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      navMenu.classList.toggle('active');
      document.body.classList.toggle('menu-open');
    });

    const navLinks = navMenu.querySelectorAll('.navbar_link');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.classList.remove('menu-open');
      });
    });
  }

  const allNavLinks = document.querySelectorAll('.navbar_link');
  const navSections = Array.from(allNavLinks)
    .map(link => {
      const target = document.querySelector(link.getAttribute('href'));
      return target ? { el: target, link } : null;
    })
    .filter(Boolean)
    .sort((a, b) => a.el.getBoundingClientRect().top - b.el.getBoundingClientRect().top);

  const highlightNavLink = () => {
    if (!navSections.length) return;

    const headerOffset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-height')) || 80;
    const scrollPos = window.scrollY + headerOffset + 40;
    const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;

    let activeItem = navSections[0];
    if (atBottom) {
      activeItem = navSections[navSections.length - 1];
    } else {
      navSections.forEach(item => {
        const top = item.el.getBoundingClientRect().top + window.scrollY;
        if (scrollPos >= top) {
          activeItem = item;
        }
      });

      const lastItem = navSections[navSections.length - 1];
      if (lastItem.el.getBoundingClientRect().top <= window.innerHeight * 0.55) {
        activeItem = lastItem;
      }
    }

    allNavLinks.forEach(link => link.classList.toggle('navbar_link--active', link === activeItem.link));
  };

  highlightNavLink();
  window.addEventListener('scroll', highlightNavLink);

  const fadeElements = document.querySelectorAll('.fade-in');

  const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  };

  const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        fadeObserver.unobserve(entry.target);
      }
    });
  }, observerOptions);

  fadeElements.forEach(el => fadeObserver.observe(el));

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        const headerOffset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-height')) || 80;
        const targetPosition = targetEl.offsetTop - headerOffset;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
});

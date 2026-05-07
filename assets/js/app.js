/* ========================================================================
   APPLICATION INITIALIZATION
   ======================================================================== */
(() => {
  'use strict';

  /* ------------------------------------------------------------------
     1. LOADING SCREEN
     ------------------------------------------------------------------ */
  const loader = document.getElementById('loader');
  const loaderBar = document.getElementById('loaderBar');
  const loaderLetters = document.querySelectorAll('#loaderText span');

  // Animate loader letters in
  gsap.fromTo(loaderLetters,
    { y: 40, opacity: 0 },
    {
      y: 0,
      opacity: 1,
      duration: 0.5,
      stagger: 0.05,
      ease: 'power3.out',
      delay: 0.2
    }
  );

  // Animate progress bar
  gsap.to(loaderBar, {
    width: '100%',
    duration: 1.8,
    ease: 'power2.inOut',
    delay: 0.3,
    onComplete: initApp
  });

  function initApp() {
    // Fade out loader
    gsap.to(loader, {
      opacity: 0,
      duration: 0.6,
      ease: 'power2.inOut',
      onComplete: () => {
        loader.style.display = 'none';
        // Start all animations after loader is gone
        initLocomotiveScroll();
        initCursor();
        initHeroAnimations();
        initScrollAnimations();
        initMarquee();
        initCountUp();
        initThemeToggle();
        initNavigation();
        initProjectFilter();
      }
    });
  }

  /* ------------------------------------------------------------------
     2. LOCOMOTIVE SCROLL + SCROLLTRIGGER SYNC
     ------------------------------------------------------------------ */
  let locoScroll;

  function initLocomotiveScroll() {
    locoScroll = new LocomotiveScroll({
      el: document.getElementById('scrollContainer'),
      smooth: true,
      multiplier: 0.8,
      lerp: 0.07,
      smartphone: { smooth: true },
      tablet: { smooth: true, breakpoint: 1024 }
    });

    // Register GSAP ScrollTrigger
    gsap.registerPlugin(ScrollTrigger);

    // Sync Locomotive Scroll with ScrollTrigger
    locoScroll.on('scroll', ScrollTrigger.update);

    ScrollTrigger.scrollerProxy('#scrollContainer', {
      scrollTop(value) {
        return arguments.length
          ? locoScroll.scrollTo(value, { duration: 0, disableLerp: true })
          : locoScroll.scroll.instance.scroll.y;
      },
      getBoundingClientRect() {
        return {
          top: 0,
          left: 0,
          width: window.innerWidth,
          height: window.innerHeight
        };
      },
      pinType: document.getElementById('scrollContainer').style.transform
        ? 'transform'
        : 'fixed'
    });

    // Nav scrolled state
    locoScroll.on('scroll', (args) => {
      const nav = document.getElementById('nav');
      if (args.scroll.y > 50) {
        nav.classList.add('scrolled');
      } else {
        nav.classList.remove('scrolled');
      }
    });

    ScrollTrigger.addEventListener('refresh', () => locoScroll.update());
    ScrollTrigger.refresh();
  }

  /* ------------------------------------------------------------------
     3. CUSTOM CURSOR
     ------------------------------------------------------------------ */
  function initCursor() {
    const cursor = document.getElementById('cursor');
    const trail = document.getElementById('cursorTrail');
    let mouseX = 0, mouseY = 0;

    // Track mouse position
    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    // Smooth trailing with GSAP
    gsap.ticker.add(() => {
      gsap.to(cursor, {
        x: mouseX,
        y: mouseY,
        duration: 0.15,
        ease: 'power2.out',
        overwrite: 'auto'
      });
      gsap.to(trail, {
        x: mouseX,
        y: mouseY,
        duration: 0.4,
        ease: 'power2.out',
        overwrite: 'auto'
      });
    });

    // Hover effects for interactive elements
    const hoverTargets = document.querySelectorAll(
      'a, button, .project-card, .service-item, .skill-tag, .contact__social-link'
    );

    hoverTargets.forEach((el) => {
      el.addEventListener('mouseenter', () => {
        cursor.classList.add('is-hovering');
        trail.classList.add('is-hovering');
      });
      el.addEventListener('mouseleave', () => {
        cursor.classList.remove('is-hovering');
        trail.classList.remove('is-hovering');
      });
    });

    // Hide cursor when leaving window
    document.addEventListener('mouseleave', () => {
      gsap.to([cursor, trail], { opacity: 0, duration: 0.2 });
    });
    document.addEventListener('mouseenter', () => {
      gsap.to([cursor, trail], { opacity: 1, duration: 0.2 });
    });
  }

  /* ------------------------------------------------------------------
     4. HERO ENTRANCE ANIMATIONS
     ------------------------------------------------------------------ */
  function initHeroAnimations() {
    const tl = gsap.timeline({ delay: 0.2 });

    // Greeting text
    tl.from('.hero__greeting', {
      y: 40,
      opacity: 0,
      duration: 0.8,
      ease: 'power3.out'
    });

    // Name lines — stagger each line
    tl.from('.hero__title-line span', {
      y: '100%',
      duration: 1,
      ease: 'power4.out',
      stagger: 0.15
    }, '-=0.4');

    // Info section
    tl.from('.hero__info', {
      y: 60,
      opacity: 0,
      duration: 0.8,
      ease: 'power3.out'
    }, '-=0.4');

    // Scroll indicator
    tl.from('.hero__scroll-indicator', {
      opacity: 0,
      y: 20,
      duration: 0.6,
      ease: 'power2.out'
    }, '-=0.3');
  }

  /* ------------------------------------------------------------------
     5. SCROLL-TRIGGERED ANIMATIONS
     ------------------------------------------------------------------ */
  function initScrollAnimations() {
    // Reveal animation for all .reveal elements
    const reveals = document.querySelectorAll('.reveal');

    reveals.forEach((el) => {
      gsap.fromTo(el,
        {
          y: 60,
          opacity: 0
        },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            scroller: '#scrollContainer',
            start: 'top 85%',
            end: 'top 40%',
            toggleActions: 'play none none none'
          }
        }
      );
    });

    // Staggered animations for service items
    gsap.utils.toArray('.service-item').forEach((item, i) => {
      gsap.fromTo(item,
        { y: 80, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          delay: i * 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: item,
            scroller: '#scrollContainer',
            start: 'top 85%',
            toggleActions: 'play none none none'
          }
        }
      );
    });

    // Staggered skill tags
    gsap.utils.toArray('.skill-tag').forEach((tag, i) => {
      gsap.fromTo(tag,
        { y: 30, opacity: 0, scale: 0.9 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.5,
          delay: i * 0.03,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.skills-strip',
            scroller: '#scrollContainer',
            start: 'top 85%',
            toggleActions: 'play none none none'
          }
        }
      );
    });

    // Staggered experience items
    gsap.utils.toArray('.experience-item').forEach((item, i) => {
      gsap.fromTo(item,
        { x: 40, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.7,
          delay: i * 0.08,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: item,
            scroller: '#scrollContainer',
            start: 'top 88%',
            toggleActions: 'play none none none'
          }
        }
      );
    });

    // Project card parallax on scroll
    gsap.utils.toArray('.project-card__image-wrap').forEach((wrap) => {
      gsap.fromTo(wrap.querySelector('.project-card__image'),
        { scale: 1.15 },
        {
          scale: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: wrap,
            scroller: '#scrollContainer',
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1
          }
        }
      );
    });

    // Contact section reveal
    gsap.fromTo('.contact__cta',
      { y: 80, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.contact__cta',
          scroller: '#scrollContainer',
          start: 'top 80%',
          toggleActions: 'play none none none'
        }
      }
    );
  }

  /* ------------------------------------------------------------------
     6. MARQUEE ANIMATION
     ------------------------------------------------------------------ */
  function initMarquee() {
    const marquee = document.getElementById('marquee');
    if (!marquee) return;

    // Clone content for seamless loop
    const content = marquee.innerHTML;
    marquee.innerHTML += content;

    const totalWidth = marquee.scrollWidth / 2;

    gsap.to(marquee, {
      x: -totalWidth,
      duration: 30,
      ease: 'none',
      repeat: -1,
      modifiers: {
        x: gsap.utils.unitize((x) => parseFloat(x) % totalWidth)
      }
    });
  }

  /* ------------------------------------------------------------------
     7. COUNT-UP ANIMATION
     ------------------------------------------------------------------ */
  function initCountUp() {
    const counters = document.querySelectorAll('[data-count]');

    counters.forEach((counter) => {
      const target = parseInt(counter.getAttribute('data-count'), 10);
      const obj = { val: 0 };

      gsap.to(obj, {
        val: target,
        duration: 2,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: counter,
          scroller: '#scrollContainer',
          start: 'top 80%',
          toggleActions: 'play none none none'
        },
        onUpdate: () => {
          counter.textContent = Math.round(obj.val) + '+';
        }
      });
    });
  }

  /* ------------------------------------------------------------------
     8. THEME TOGGLE (Dark / Light)
     ------------------------------------------------------------------ */
  function initThemeToggle() {
    const toggle = document.getElementById('themeToggle');
    const html = document.documentElement;

    // Check saved preference
    const saved = localStorage.getItem('theme');
    if (saved) {
      html.setAttribute('data-theme', saved);
    }

    toggle.addEventListener('click', () => {
      const current = html.getAttribute('data-theme');
      const next = current === 'dark' ? 'light' : 'dark';
      html.setAttribute('data-theme', next);
      localStorage.setItem('theme', next);
    });
  }

  /* ------------------------------------------------------------------
     9. NAVIGATION
     ------------------------------------------------------------------ */
  function initNavigation() {
    const menuBtn = document.getElementById('menuBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    const scrollToLinks = document.querySelectorAll('[data-scroll-to]');

    // Mobile menu toggle
    menuBtn.addEventListener('click', () => {
      menuBtn.classList.toggle('active');
      mobileMenu.classList.toggle('active');
    });

    // Smooth scroll to sections using Locomotive Scroll
    scrollToLinks.forEach((link) => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const target = document.querySelector(targetId);

        if (target && locoScroll) {
          locoScroll.scrollTo(target, {
            offset: 0,
            duration: 1200,
            easing: [0.25, 0.0, 0.35, 1.0]
          });
        }

        // Close mobile menu if open
        menuBtn.classList.remove('active');
        mobileMenu.classList.remove('active');
      });
    });
  }

  /* ------------------------------------------------------------------
     10. PROJECT CATEGORY FILTER
     ------------------------------------------------------------------ */
  function initProjectFilter() {
    const filterBtns = document.querySelectorAll('[data-filter]');
    const cards = document.querySelectorAll('.project-card[data-category]');

    filterBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        // Update active button
        filterBtns.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.getAttribute('data-filter');

        cards.forEach((card) => {
          const category = card.getAttribute('data-category');
          const shouldShow = filter === 'all' || category === filter;

          if (shouldShow) {
            card.classList.remove('is-hidden');
            gsap.fromTo(card,
              { opacity: 0, y: 30, scale: 0.97 },
              { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: 'power2.out' }
            );
          } else {
            gsap.to(card, {
              opacity: 0,
              y: -20,
              scale: 0.97,
              duration: 0.3,
              ease: 'power2.in',
              onComplete: () => card.classList.add('is-hidden')
            });
          }
        });

        // Update Locomotive Scroll after layout changes
        setTimeout(() => {
          if (locoScroll) locoScroll.update();
        }, 600);
      });
    });
  }

})();

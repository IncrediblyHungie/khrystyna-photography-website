/**
 * Khrystyna Photography - Main JavaScript
 */

(function() {
  'use strict';

  // DOM Elements
  const header = document.getElementById('header');
  const menuToggle = document.getElementById('menuToggle');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileOverlay = document.getElementById('mobileOverlay');

  // Pages without a dark hero (portfolio, about, services) have a light
  // header area, so the transparent/white-logo treatment would vanish.
  // Keep those headers solid at all times.
  const hasHero = !!document.querySelector('.hero');

  // Header scroll behavior
  function handleScroll() {
    if (!hasHero || window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // Mobile booking bar appears once the hero has scrolled away
    const bookBar = document.getElementById('mobileBookBar');
    if (bookBar) {
      const hero = document.querySelector('.hero');
      const trigger = hero ? hero.offsetHeight * 0.8 : 400;
      bookBar.classList.toggle('visible', window.scrollY > trigger);
    }
  }

  // Mobile menu toggle
  function toggleMobileMenu() {
    menuToggle.classList.toggle('active');
    mobileMenu.classList.toggle('active');
    mobileOverlay.classList.toggle('active');
    document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
  }

  function closeMobileMenu() {
    menuToggle.classList.remove('active');
    mobileMenu.classList.remove('active');
    mobileOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  // Scroll animations with Intersection Observer
  function initScrollAnimations() {
    const fadeElements = document.querySelectorAll('.fade-in');

    if (!fadeElements.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    fadeElements.forEach(el => observer.observe(el));
  }

  // Lazy loading images
  function initLazyLoading() {
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');

    if ('loading' in HTMLImageElement.prototype) {
      // Browser supports native lazy loading
      return;
    }

    // Fallback for browsers that don't support native lazy loading
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src || img.src;
          imageObserver.unobserve(img);
        }
      });
    });

    lazyImages.forEach(img => imageObserver.observe(img));
  }

  // Portfolio filtering
  function initPortfolioFilter() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');

    if (!filterButtons.length) return;

    function applyFilter(filter) {
      galleryItems.forEach(item => {
        if (filter === 'all' || item.dataset.category === filter) {
          item.style.display = '';
          setTimeout(() => item.style.opacity = '1', 10);
        } else {
          item.style.opacity = '0';
          setTimeout(() => item.style.display = 'none', 300);
        }
      });
    }

    filterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        // Update active button
        filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        applyFilter(btn.dataset.filter);
      });
    });

    // Honor whichever filter is marked active in the markup on first paint
    const initialBtn = document.querySelector('.filter-btn.active');
    if (initialBtn) applyFilter(initialBtn.dataset.filter);
  }

  // Lightbox for gallery
  function initLightbox() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxClose = document.getElementById('lightboxClose');

    if (!galleryItems.length || !lightbox) return;

    galleryItems.forEach(item => {
      item.addEventListener('click', () => {
        const img = item.querySelector('img');
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
      });
    });

    function closeLightbox() {
      lightbox.classList.remove('active');
      document.body.style.overflow = '';
    }

    if (lightboxClose) {
      lightboxClose.addEventListener('click', closeLightbox);
    }

    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) {
        closeLightbox();
      }
    });

    // Close on escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && lightbox.classList.contains('active')) {
        closeLightbox();
      }
    });
  }

  // Smooth scroll for anchor links
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href === '#') return;

        e.preventDefault();
        const target = document.querySelector(href);

        if (target) {
          const headerHeight = header.offsetHeight;
          const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;

          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        }
      });
    });
  }

  // Video play/pause on visibility
  function initVideoObserver() {
    const videos = document.querySelectorAll('.hero-video');

    if (!videos.length) return;

    const videoObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.play();
        } else {
          entry.target.pause();
        }
      });
    }, { threshold: 0.25 });

    videos.forEach(video => videoObserver.observe(video));
  }

  // Initialize everything
  function init() {
    // Event listeners
    window.addEventListener('scroll', handleScroll, { passive: true });

    if (menuToggle) {
      menuToggle.addEventListener('click', toggleMobileMenu);
    }

    if (mobileOverlay) {
      mobileOverlay.addEventListener('click', closeMobileMenu);
    }

    // Close mobile menu on link click
    document.querySelectorAll('.mobile-nav-link').forEach(link => {
      link.addEventListener('click', closeMobileMenu);
    });

    // Close mobile menu on escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
        closeMobileMenu();
      }
    });

    // Initialize features
    handleScroll();
    initScrollAnimations();
    initLazyLoading();
    initPortfolioFilter();
    initLightbox();
    initSmoothScroll();
    initVideoObserver();
  }

  // Run when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

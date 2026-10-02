/* ==========================================================================
   RASHAD & SUAADH — WALIMA CELEBRATION
   Interactive JavaScript Architecture
   Features:
   - Preloader Splash screen
   - 3D Islamic Double Doors with Tap-to-Enter
   - Web Audio API Royal Acoustic Synthesizer (Zero CORS, 100% Offline)
   - Real-time Live Countdown to 1 Nov 2026 12:30 PM
   - Scroll-linked Staggered Reveals
   - Parallax Drift on Lanterns and Scenes
   - Gallery with Interactive Fullscreen Lightbox & Touch Gestures
   - Calendar .ICS File Generator + Google Calendar Integration
   - RSVP Modal with LocalStorage Persistence
   - Navigation Scroll & Back to Top Controller
   ========================================================================== */

(function () {
  'use strict';

  /* ==========================================================================
     01 — CONFIGURATION & CONSTANTS
     ========================================================================== */
  // Walima: Sunday, 1 November 2026, 12:30 PM Asia/Colombo (UTC+5:30)
  // Constructed in UTC: 12:30 PM IST = 07:00:00 UTC
  const WALIMA_UTC = new Date(Date.UTC(2026, 10, 1, 7, 0, 0));

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ==========================================================================
     02 — LOADING SPLASH CONTROLLER
     ========================================================================== */
  const splashScreen = document.getElementById('loadingSplash');

  function dismissSplash() {
    if (splashScreen && !splashScreen.classList.contains('is-hidden')) {
      splashScreen.classList.add('is-hidden');
      document.body.classList.remove('is-locked');
    }
  }

  // Dismiss on window load with smooth fallback
  window.addEventListener('load', function () {
    setTimeout(dismissSplash, 900);
  });
  // Failsafe timeout in case of slow resources
  setTimeout(dismissSplash, 2500);

  /* ==========================================================================
     03 — LUXURY WEDDING INSTRUMENTAL SYNTHESIZER (WEB AUDIO API)
     Zero external dependencies. Plays a soothing, meditative oriental melody
     mimicking acoustic Santur / Harp / Oud with gentle ambient resonance.
     ========================================================================== */
  class WeddingAudioSynthesizer {
    constructor() {
      this.ctx = null;
      this.isPlaying = false;
      this.isMuted = false;
      this.timerId = null;
      this.masterGain = null;
      this.scale = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25, 587.33, 659.25]; // C Major / Pentatonic warm acoustic
      this.noteIndex = 0;
      this.pattern = [0, 2, 4, 3, 2, 0, 4, 5, 4, 2, 3, 1, 0, 2, 4, 7];
    }

    init() {
      if (this.ctx) return;
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      this.ctx = new AudioContext();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.001, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }

    playNote(freq, time, duration = 1.6) {
      if (!this.ctx || this.isMuted) return;

      const osc = this.ctx.createOscillator();
      const noteGain = this.ctx.createGain();

      // Soft warm sine mixed with subtle triangle for plucked string texture
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, time);

      // Acoustic pluck envelope: fast attack, natural exponential decay
      noteGain.gain.setValueAtTime(0.001, time);
      noteGain.gain.exponentialRampToValueAtTime(0.22, time + 0.04);
      noteGain.gain.exponentialRampToValueAtTime(0.001, time + duration);

      osc.connect(noteGain);
      noteGain.connect(this.masterGain);

      osc.start(time);
      osc.stop(time + duration);
    }

    start() {
      this.init();
      if (!this.ctx) return;

      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }

      this.isPlaying = true;
      this.isMuted = false;

      // Smooth fade-in
      this.masterGain.gain.cancelScheduledValues(this.ctx.currentTime);
      this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, this.ctx.currentTime);
      this.masterGain.gain.linearRampToValueAtTime(0.4, this.ctx.currentTime + 1.5);

      this.scheduleLoop();
    }

    scheduleLoop() {
      if (!this.isPlaying) return;

      const now = this.ctx.currentTime;
      const noteOffset = this.pattern[this.noteIndex % this.pattern.length];
      const freq = this.scale[noteOffset] || 329.63;

      this.playNote(freq, now, 1.8);

      // Add soft warm bass harmonic drone on certain downbeats
      if (this.noteIndex % 4 === 0) {
        this.playNote(freq * 0.5, now, 2.5);
      }

      this.noteIndex++;
      this.timerId = setTimeout(() => {
        this.scheduleLoop();
      }, 720);
    }

    toggle() {
      if (!this.isPlaying) {
        this.start();
        return true;
      }
      if (this.isMuted) {
        this.isMuted = false;
        if (this.ctx && this.masterGain) {
          this.masterGain.gain.cancelScheduledValues(this.ctx.currentTime);
          this.masterGain.gain.linearRampToValueAtTime(0.4, this.ctx.currentTime + 0.3);
        }
        return true;
      } else {
        this.isMuted = true;
        if (this.ctx && this.masterGain) {
          this.masterGain.gain.cancelScheduledValues(this.ctx.currentTime);
          this.masterGain.gain.linearRampToValueAtTime(0.001, this.ctx.currentTime + 0.3);
        }
        return false;
      }
    }
  }

  const weddingAudio = new WeddingAudioSynthesizer();

  /* ==========================================================================
     04 — 3D ISLAMIC OPENING DOORS (COVER & TAP TO ENTER)
     ========================================================================== */
  const doorsSection = document.getElementById('doors');
  const tapToOpenBtn = document.getElementById('tapToOpenBtn');
  const doorPortal = document.getElementById('doorPortal');
  const replayDoorBtn = document.getElementById('replayDoorBtn');
  const musicToggle = document.getElementById('musicToggle');
  const musicTooltip = musicToggle.querySelector('.float-btn__tooltip');

  function openDoors(playMusic = true) {
    if (!doorsSection) return;

    doorsSection.classList.add('is-opened');

    if (playMusic) {
      weddingAudio.start();
      musicToggle.classList.remove('is-muted');
      musicToggle.classList.add('is-playing');
      if (musicTooltip) musicTooltip.textContent = 'Music Playing';
    }

    // Smoothly scroll down to Hero section after doors complete initial swing
    setTimeout(function () {
      const hero = document.getElementById('hero');
      if (hero && window.scrollY < 120) {
        hero.scrollIntoView({
          behavior: prefersReducedMotion ? 'auto' : 'smooth',
          block: 'start'
        });
      }
    }, 1400);
  }

  function closeDoors() {
    if (!doorsSection) return;
    doorsSection.classList.remove('is-opened');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  if (tapToOpenBtn) {
    tapToOpenBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      openDoors(true);
    });
  }

  if (doorPortal) {
    doorPortal.addEventListener('click', function () {
      if (!doorsSection.classList.contains('is-opened')) {
        openDoors(true);
      }
    });
  }

  if (replayDoorBtn) {
    replayDoorBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      closeDoors();
    });
  }

  // Floating Music Controller Toggle
  if (musicToggle) {
    musicToggle.addEventListener('click', function () {
      const active = weddingAudio.toggle();
      if (active) {
        musicToggle.classList.remove('is-muted');
        musicToggle.classList.add('is-playing');
        if (musicTooltip) musicTooltip.textContent = 'Music Playing';
      } else {
        musicToggle.classList.add('is-muted');
        musicToggle.classList.remove('is-playing');
        if (musicTooltip) musicTooltip.textContent = 'Music Muted';
      }
    });
  }

  /* ==========================================================================
     05 — LIVE COUNTDOWN TO 1 NOVEMBER 2026, 12:30 PM
     ========================================================================== */
  const cdDays = document.getElementById('cdDays');
  const cdHours = document.getElementById('cdHours');
  const cdMinutes = document.getElementById('cdMinutes');
  const cdSeconds = document.getElementById('cdSeconds');
  const cdTimer = document.getElementById('countdownTimer');
  const cdCompleted = document.getElementById('cdCompleted');

  function padZero(n) {
    return String(n).padStart(2, '0');
  }

  function updateCountdown() {
    if (!cdDays || !cdHours || !cdMinutes || !cdSeconds) return false;

    const now = new Date();
    const diff = WALIMA_UTC.getTime() - now.getTime();

    if (diff <= 0) {
      if (cdTimer) cdTimer.hidden = true;
      if (cdCompleted) cdCompleted.hidden = false;
      return false;
    }

    const totalSeconds = Math.floor(diff / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    cdDays.textContent = padZero(days);
    cdHours.textContent = padZero(hours);
    cdMinutes.textContent = padZero(minutes);
    cdSeconds.textContent = padZero(seconds);

    return true;
  }

  if (updateCountdown()) {
    const timerInterval = setInterval(function () {
      if (!updateCountdown()) {
        clearInterval(timerInterval);
      }
    }, 1000);
  }

  /* ==========================================================================
     06 — SCROLL-LINKED REVEALS (INTERSECTION OBSERVER)
     ========================================================================== */
  if (!prefersReducedMotion) {
    const revealElements = document.querySelectorAll('.reveal');

    const revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            const el = entry.target;
            const parent = el.closest('section, .calendar-card, .details-card, .location-card');
            if (parent) {
              const pendingSiblings = Array.from(parent.querySelectorAll('.reveal:not(.is-visible)'));
              const idx = pendingSiblings.indexOf(el);
              if (idx > -1) {
                el.style.transitionDelay = (idx * 0.1) + 's';
              }
            }
            el.classList.add('is-visible');
            revealObserver.unobserve(el);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px'
      }
    );

    revealElements.forEach(function (el) {
      revealObserver.observe(el);
    });
  } else {
    document.querySelectorAll('.reveal').forEach(function (el) {
      el.classList.add('is-visible');
    });
  }

  /* ==========================================================================
     07 — PARALLAX DRIFT ON SCROLL
     ========================================================================== */
  if (!prefersReducedMotion) {
    const parallaxItems = document.querySelectorAll('.parallax-drift');

    let isTicking = false;
    function handleParallax() {
      const scrollY = window.scrollY;
      const viewportHeight = window.innerHeight;

      parallaxItems.forEach(function (item) {
        const rect = item.getBoundingClientRect();
        if (rect.bottom > 0 && rect.top < viewportHeight) {
          const speed = parseFloat(item.getAttribute('data-speed')) || 0.06;
          const offset = (rect.top - viewportHeight * 0.5) * speed;
          item.style.transform = `translateY(${offset.toFixed(1)}px)`;
        }
      });
    }

    window.addEventListener('scroll', function () {
      if (!isTicking) {
        window.requestAnimationFrame(function () {
          handleParallax();
          isTicking = false;
        });
        isTicking = true;
      }
    }, { passive: true });
  }

  /* ==========================================================================
     08 — GALLERY & INTERACTIVE FULLSCREEN LIGHTBOX
     ========================================================================== */
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightboxModal = document.getElementById('lightboxModal');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const lightboxCounter = document.getElementById('lightboxCounter');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxPrev = document.getElementById('lightboxPrev');
  const lightboxNext = document.getElementById('lightboxNext');
  const lightboxBackdrop = document.getElementById('lightboxBackdrop');

  const galleryData = [
    {
      src: 'assets/images/facing-couple.jpg',
      caption: 'A Sacred Union • Rashad & Suaadh in Ivory & Antique Gold',
      alt: 'Couple seated facing each other in royal courtyard'
    },
    {
      src: 'assets/images/gallery-hall.jpg',
      caption: 'The Grand Venue • Al-Zakki Banquet Hall Decor with Chandeliers & Roses',
      alt: 'Banquet hall with chandeliers and white roses'
    },
    {
      src: 'assets/images/gallery-henna.jpg',
      caption: 'Sacred Vows • Intricate Bridal Henna & Pure Gold Rings',
      alt: 'Bridal mehndi henna and wedding rings'
    },
    {
      src: 'assets/images/back-couple.jpg',
      caption: 'The Walk of Eternity • Overlooking the Grand Minaret Arches',
      alt: 'Bride and groom back view with trailing gown'
    },
    {
      src: 'assets/images/opening-arch.jpg',
      caption: 'Architectural Splendour • The Ivory Islamic Archway',
      alt: 'Ivory Islamic carved archway with lanterns'
    }
  ];

  let currentGalleryIndex = 0;

  function showLightbox(index) {
    if (!lightboxModal || !galleryData[index]) return;
    currentGalleryIndex = index;
    const item = galleryData[index];

    lightboxImg.src = item.src;
    lightboxImg.alt = item.alt;
    lightboxCaption.textContent = item.caption;
    lightboxCounter.textContent = `${index + 1} / ${galleryData.length}`;

    lightboxModal.hidden = false;
    document.body.style.overflow = 'hidden';
  }

  function hideLightbox() {
    if (!lightboxModal) return;
    lightboxModal.hidden = true;
    document.body.style.overflow = '';
  }

  function nextGalleryItem() {
    showLightbox((currentGalleryIndex + 1) % galleryData.length);
  }

  function prevGalleryItem() {
    showLightbox((currentGalleryIndex - 1 + galleryData.length) % galleryData.length);
  }

  galleryItems.forEach(function (item, idx) {
    item.addEventListener('click', function () {
      showLightbox(idx);
    });
    item.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        showLightbox(idx);
      }
    });
  });

  if (lightboxClose) lightboxClose.addEventListener('click', hideLightbox);
  if (lightboxBackdrop) lightboxBackdrop.addEventListener('click', hideLightbox);
  if (lightboxNext) lightboxNext.addEventListener('click', nextGalleryItem);
  if (lightboxPrev) lightboxPrev.addEventListener('click', prevGalleryItem);

  // Keyboard navigation
  document.addEventListener('keydown', function (e) {
    if (lightboxModal && !lightboxModal.hidden) {
      if (e.key === 'Escape') hideLightbox();
      if (e.key === 'ArrowRight') nextGalleryItem();
      if (e.key === 'ArrowLeft') prevGalleryItem();
    }
  });

  // Mobile Touch Swipe detection for Lightbox
  let touchStartX = 0;
  let touchEndX = 0;

  if (lightboxModal) {
    lightboxModal.addEventListener('touchstart', function (e) {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    lightboxModal.addEventListener('touchend', function (e) {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    }, { passive: true });
  }

  function handleSwipe() {
    const diff = touchEndX - touchStartX;
    if (Math.abs(diff) > 45) {
      if (diff < 0) {
        nextGalleryItem(); // Swipe Left
      } else {
        prevGalleryItem(); // Swipe Right
      }
    }
  }

  /* ==========================================================================
     09 — CALENDAR DROPDOWN & .ICS FILE GENERATOR
     ========================================================================== */
  const addToCalBtn = document.getElementById('addToCalBtn');
  const calDropdown = document.getElementById('calDropdown');
  const downloadIcsBtn = document.getElementById('downloadIcsBtn');

  if (addToCalBtn && calDropdown) {
    addToCalBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      calDropdown.hidden = !calDropdown.hidden;
    });

    document.addEventListener('click', function (e) {
      if (!calDropdown.contains(e.target) && e.target !== addToCalBtn) {
        calDropdown.hidden = true;
      }
    });
  }

  // Generate and download standard .ics calendar file
  if (downloadIcsBtn) {
    downloadIcsBtn.addEventListener('click', function () {
      const icsContent = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//Rashad & Suaadh//Walima Celebration//EN',
        'CALSCALE:GREGORIAN',
        'METHOD:PUBLISH',
        'BEGIN:VEVENT',
        'UID:walima-rashad-suaadh-20261101@wedding',
        'SUMMARY:Walima Celebration of Rashad & Suaadh',
        'DESCRIPTION:With the blessings of Allah\\, we invite you to join us as we celebrate the Walima of Rashad & Suaadh at Al-Zakki Banquet Hall\\, Addalaichenai.',
        'LOCATION:Al-Zakki Banquet Hall\\, Main Street\\, Addalaichenai\\, Sri Lanka',
        'DTSTART:20261101T070000Z',
        'DTEND:20261101T110000Z',
        'STATUS:CONFIRMED',
        'END:VEVENT',
        'END:VCALENDAR'
      ].join('\r\n');

      const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'Walima-Rashad-and-Suaadh.ics';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      calDropdown.hidden = true;
    });
  }

  /* ==========================================================================
     10 — RSVP MODAL & LOCALSTORAGE FORM HANDLER
     ========================================================================== */
  const rsvpModal = document.getElementById('rsvpModal');
  const rsvpClose = document.getElementById('rsvpClose');
  const rsvpBackdrop = document.getElementById('rsvpBackdrop');
  const rsvpForm = document.getElementById('rsvpForm');
  const rsvpSuccessState = document.getElementById('rsvpSuccessState');
  const rsvpSuccessCloseBtn = document.getElementById('rsvpSuccessCloseBtn');
  const triggerRsvpBtns = document.querySelectorAll('.trigger-rsvp-btn, #quickRsvpBtn');
  const guestsCountGroup = document.getElementById('guestsCountGroup');

  function openRsvp() {
    if (!rsvpModal) return;
    rsvpModal.hidden = false;
    document.body.style.overflow = 'hidden';

    // Populate previously saved RSVP if present
    const saved = localStorage.getItem('rashad_suaadh_rsvp');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        if (data.name) document.getElementById('rsvpName').value = data.name;
        if (data.guests) document.getElementById('rsvpGuests').value = data.guests;
        if (data.message) document.getElementById('rsvpMessage').value = data.message;
      } catch (err) {}
    }
  }

  function closeRsvp() {
    if (!rsvpModal) return;
    rsvpModal.hidden = true;
    document.body.style.overflow = '';
  }

  triggerRsvpBtns.forEach(function (btn) {
    btn.addEventListener('click', openRsvp);
  });

  if (rsvpClose) rsvpClose.addEventListener('click', closeRsvp);
  if (rsvpBackdrop) rsvpBackdrop.addEventListener('click', closeRsvp);
  if (rsvpSuccessCloseBtn) rsvpSuccessCloseBtn.addEventListener('click', closeRsvp);

  // Toggle guest count based on attendance choice
  const attendanceRadios = document.querySelectorAll('input[name="attendance"]');
  attendanceRadios.forEach(function (radio) {
    radio.addEventListener('change', function () {
      if (guestsCountGroup) {
        guestsCountGroup.hidden = (this.value === 'declining');
      }
    });
  });

  if (rsvpForm) {
    rsvpForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const formData = new FormData(rsvpForm);
      const rsvpData = {
        name: formData.get('name'),
        attendance: formData.get('attendance'),
        guests: formData.get('guests'),
        message: formData.get('message'),
        submittedAt: new Date().toISOString()
      };

      // Save locally
      localStorage.setItem('rashad_suaadh_rsvp', JSON.stringify(rsvpData));

      // Show confirmation
      rsvpForm.hidden = true;
      if (rsvpSuccessState) {
        rsvpSuccessState.hidden = false;
        const msg = document.getElementById('rsvpSuccessMessage');
        if (msg) {
          if (rsvpData.attendance === 'attending') {
            msg.textContent = `Dear ${rsvpData.name}, your confirmation for ${rsvpData.guests} guest(s) has been noted with joy. We eagerly await welcoming you!`;
          } else {
            msg.textContent = `Dear ${rsvpData.name}, thank you for letting us know. Your heartfelt wishes and prayers are deeply cherished.`;
          }
        }
      }
    });
  }

  /* ==========================================================================
     11 — NAVIGATION, SCROLL TO TOP & SCROLLSPY
     ========================================================================== */
  const nav = document.getElementById('nav');
  const navToggle = document.getElementById('navToggle');
  const navList = document.querySelector('.nav__list');
  const navLinks = document.querySelectorAll('.nav__link');
  const scrollTopBtn = document.getElementById('scrollTopBtn');

  function handleScrollNavigation() {
    const y = window.scrollY;

    // Header background blur on scroll
    if (nav) {
      if (y > 60) {
        nav.classList.add('is-scrolled');
      } else {
        nav.classList.remove('is-scrolled');
      }
    }

    // Scroll to Top visibility
    if (scrollTopBtn) {
      if (y > 500) {
        scrollTopBtn.classList.add('is-visible');
      } else {
        scrollTopBtn.classList.remove('is-visible');
      }
    }
  }

  window.addEventListener('scroll', handleScrollNavigation, { passive: true });
  handleScrollNavigation();

  // Scroll to Top
  if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // Mobile menu toggle
  if (navToggle && navList) {
    navToggle.addEventListener('click', function () {
      const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', !isExpanded);
      navList.classList.toggle('is-open');
    });

    navLinks.forEach(function (link) {
      link.addEventListener('click', function (e) {
        navList.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');

        const href = this.getAttribute('href');
        if (href && href.startsWith('#')) {
          e.preventDefault();
          const target = document.querySelector(href);
          if (target) {
            target.scrollIntoView({
              behavior: prefersReducedMotion ? 'auto' : 'smooth',
              block: 'start'
            });
          }
        }
      });
    });
  }

})();

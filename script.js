// ============================================================
// script.js — Wanderlust Voyages
// Features: Dark/light mode, form validation, carousel,
//           scroll animations, FAQ accordion, scroll header,
//           mobile nav, countdown timer, dynamic content
// ============================================================

document.addEventListener('DOMContentLoaded', function () {

  // ==========================================================
  // 1. DARK / LIGHT MODE TOGGLE
  // ==========================================================
  var themeBtn  = document.getElementById('theme-toggle');
  var themeIcon = document.getElementById('theme-icon');
  var html      = document.documentElement;

  var savedTheme = localStorage.getItem('wv-theme') || 'light';
  setTheme(savedTheme);

  if (themeBtn) {
    themeBtn.addEventListener('click', function () {
      var current = html.getAttribute('data-theme') || 'light';
      setTheme(current === 'light' ? 'dark' : 'light');
    });
  }

  function setTheme(theme) {
    html.setAttribute('data-theme', theme);
    localStorage.setItem('wv-theme', theme);
    if (themeIcon) themeIcon.textContent = theme === 'dark' ? '☀️' : '🌙';
  }


  // ==========================================================
  // 2. STICKY HEADER — adds .scrolled class on scroll
  // ==========================================================
  var header = document.querySelector('header');
  if (header) {
    window.addEventListener('scroll', function () {
      header.classList.toggle('scrolled', window.scrollY > 60);
    });
  }


  // ==========================================================
  // 3. MOBILE HAMBURGER NAV
  // ==========================================================
  var hamburger = document.getElementById('hamburger');
  var navMenu   = document.getElementById('nav-menu');

  if (hamburger && navMenu) {
    hamburger.addEventListener('click', function () {
      navMenu.classList.toggle('open');
    });
    // Close nav on link click
    navMenu.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { navMenu.classList.remove('open'); });
    });
  }


  // ==========================================================
  // 4. IMAGE CAROUSEL (JS Feature: slideshow/carousel)
  // ==========================================================
  var carousels = document.querySelectorAll('.carousel');
  carousels.forEach(function (carousel) {
    var slides   = carousel.querySelector('.carousel-slides');
    var dots     = carousel.querySelectorAll('.carousel-dot');
    var total    = carousel.querySelectorAll('.carousel-slide').length;
    var current  = 0;
    var autoPlay = null;

    function goTo(idx) {
      current = (idx + total) % total;
      slides.style.transform = 'translateX(-' + (current * 100) + '%)';
      dots.forEach(function (d, i) { d.classList.toggle('active', i === current); });
    }

    var prev = carousel.querySelector('.carousel-btn.prev');
    var next = carousel.querySelector('.carousel-btn.next');
    if (prev) prev.addEventListener('click', function () { goTo(current - 1); resetAuto(); });
    if (next) next.addEventListener('click', function () { goTo(current + 1); resetAuto(); });
    dots.forEach(function (d, i) { d.addEventListener('click', function () { goTo(i); resetAuto(); }); });

    function resetAuto() {
      clearInterval(autoPlay);
      autoPlay = setInterval(function () { goTo(current + 1); }, 4500);
    }

    goTo(0);
    resetAuto();
  });


  // ==========================================================
  // 5. SCROLL REVEAL ANIMATION
  // ==========================================================
  var reveals = document.querySelectorAll('.reveal');
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  reveals.forEach(function (el) { observer.observe(el); });


  // ==========================================================
  // 6. FAQ ACCORDION
  // ==========================================================
  var faqBtns = document.querySelectorAll('.faq-q');
  faqBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var answer  = btn.nextElementSibling;
      var isOpen  = btn.classList.contains('open');

      // Close all
      document.querySelectorAll('.faq-q.open').forEach(function (b) {
        b.classList.remove('open');
        b.nextElementSibling.classList.remove('open');
      });

      // Open clicked (if it wasn't already open)
      if (!isOpen) {
        btn.classList.add('open');
        answer.classList.add('open');
      }
    });
  });


  // ==========================================================
  // 7. CONTACT FORM VALIDATION
  // ==========================================================
  var contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      var name    = (contactForm.querySelector('#name') || { value: '' }).value.trim();
      var email   = (contactForm.querySelector('#email') || { value: '' }).value.trim();
      var subject = (contactForm.querySelector('#subject') || { value: '' }).value.trim();
      var msg     = (contactForm.querySelector('#message') || { value: '' }).value.trim();
      var msgBox  = document.getElementById('form-msg');

      // Check empty fields
      if (!name || !email || !msg) {
        showMsg(msgBox, 'error', '❌ Please fill in all required fields.');
        return;
      }

      // Check @ in email
      if (!email.includes('@') || !email.includes('.')) {
        showMsg(msgBox, 'error', '❌ Please enter a valid email address.');
        return;
      }

      showMsg(msgBox, 'success', '✅ Thank you, ' + name + '! Your message has been sent. We\'ll be in touch within 24 hours.');
      contactForm.reset();
    });
  }

  // Booking form validation
  var bookingForm = document.getElementById('bookingForm');
  if (bookingForm) {
    bookingForm.addEventListener('submit', function (e) {
      e.preventDefault();

      var bname  = (bookingForm.querySelector('#b-name') || { value: '' }).value.trim();
      var bemail = (bookingForm.querySelector('#b-email') || { value: '' }).value.trim();
      var bdest  = (bookingForm.querySelector('#b-dest') || { value: '' }).value;
      var msgBox = document.getElementById('booking-msg');

      if (!bname || !bemail || !bdest) {
        showMsg(msgBox, 'error', '❌ Please fill in all required fields.');
        return;
      }

      if (!bemail.includes('@')) {
        showMsg(msgBox, 'error', '❌ Please enter a valid email address.');
        return;
      }

      // Confirmation message
      if (confirm('🌍 Confirm booking inquiry for "' + bdest + '"?\n\nWe will contact ' + bname + ' at ' + bemail + ' shortly.')) {
        showMsg(msgBox, 'success', '✅ Booking inquiry received for ' + bdest + '! Check your inbox soon, ' + bname + '.');
        bookingForm.reset();
      }
    });
  }

  function showMsg(box, type, text) {
    if (!box) return;
    box.className = 'form-message ' + type;
    box.style.display = 'block';
    box.textContent = text;
    setTimeout(function () { box.style.display = 'none'; }, 7000);
  }


  // ==========================================================
  // 8. COUNTDOWN TIMER (Dynamic JS content)
  // ==========================================================
  var countdownEl = document.getElementById('countdown-display');
  if (countdownEl) {
    var target = new Date();
    target.setDate(target.getDate() + 7); // 7 days from now
    target.setHours(0, 0, 0, 0);

    function updateCountdown() {
      var now  = new Date();
      var diff = target - now;
      if (diff <= 0) { countdownEl.textContent = 'Offer expired!'; return; }
      var days  = Math.floor(diff / (1000 * 60 * 60 * 24));
      var hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      var mins  = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      var secs  = Math.floor((diff % (1000 * 60)) / 1000);
      countdownEl.textContent = days + 'd ' + pad(hours) + 'h ' + pad(mins) + 'm ' + pad(secs) + 's';
    }

    function pad(n) { return n < 10 ? '0' + n : n; }
    updateCountdown();
    setInterval(updateCountdown, 1000);
  }


  // ==========================================================
  // 9. DYNAMIC DESTINATION FILTER (Changing content)
  // ==========================================================
  var filterBtns  = document.querySelectorAll('.filter-btn');
  var destCards   = document.querySelectorAll('.dest-card');

  if (filterBtns.length && destCards.length) {
    filterBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        filterBtns.forEach(function (b) { b.classList.remove('active-filter'); });
        btn.classList.add('active-filter');

        var filter = btn.getAttribute('data-filter');
        destCards.forEach(function (card) {
          var match = filter === 'all' || card.getAttribute('data-cat') === filter;
          card.style.display = match ? 'block' : 'none';
        });
      });
    });
  }

}); // end DOMContentLoaded
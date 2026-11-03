(function () {
  'use strict';

  /* ---- Dark mode ---- */
  try {
    if (localStorage.getItem('rishi-mode') === 'dark') {
      document.documentElement.dataset.mode = 'dark';
    }
  } catch (e) {}

  const cordHit = document.getElementById('cordHit');
  if (cordHit) {
    if (document.documentElement.dataset.mode === 'dark') {
      cordHit.setAttribute('aria-checked', 'true');
    }
    cordHit.addEventListener('click', () => {
      const isDark = document.documentElement.dataset.mode === 'dark';
      document.documentElement.dataset.mode = isDark ? '' : 'dark';
      cordHit.setAttribute('aria-checked', String(!isDark));
      try { localStorage.setItem('rishi-mode', isDark ? '' : 'dark'); } catch (e) {}
    });
  }

  /* ---- Clock ---- */
  function updateClock() {
    const now = new Date();
    const h = now.getHours(), m = String(now.getMinutes()).padStart(2, '0');
    const ampm = h >= 12 ? 'pm' : 'am', hh = h % 12 || 12;
    const timeStr = hh + ':' + m + '\u00a0' + ampm;
    const dateStr = now.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
    const el = document.getElementById('clockTime');
    const del = document.getElementById('clockDate');
    const sft = document.getElementById('sfTime');
    if (el) el.textContent = timeStr;
    if (del) del.textContent = dateStr;
    if (sft) sft.textContent = 'Local time \u2014 ' + timeStr;
  }
  updateClock();
  setInterval(updateClock, 1000);

  /* ---- Year ---- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---- Loader animation ---- */
  const loader = document.getElementById('loader');
  const pills = loader ? loader.querySelectorAll('.ld__pill') : [];
  const ldCount = document.getElementById('ldCount');
  const ldBar = document.getElementById('ldBar');

  pills.forEach((p, i) => setTimeout(() => p.classList.add('on'), 80 + i * 120));

  let progress = 0;
  const interval = setInterval(() => {
    progress = Math.min(progress + Math.random() * 18 + 5, 100);
    if (ldCount) ldCount.textContent = String(Math.floor(progress)).padStart(3, '0');
    if (ldBar) ldBar.style.setProperty('--p', (progress / 100).toFixed(3));
    if (progress >= 100) { clearInterval(interval); setTimeout(dismissLoader, 280); }
  }, 80);

  function dismissLoader() {
    if (loader) {
      loader.classList.add('out');
      setTimeout(() => {
        loader.style.display = 'none';
        document.body.classList.add('ready');
        revealInit();
      }, 900);
    }
  }

  /* ---- Intersection Observer for scroll reveals ---- */
  function revealInit() {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); }
      });
    }, { threshold: 0.12 });
    document.querySelectorAll('.rv, .ch').forEach(el => obs.observe(el));
  }

  /* ---- Header scroll behavior ---- */
  const hdr = document.getElementById('hdr');
  let lastY = 0;
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if (hdr) {
      hdr.classList.toggle('stuck', y > 20);
      if (y > lastY + 80 && y > 200) hdr.classList.add('away');
      if (y < lastY - 5 || y < 200) hdr.classList.remove('away');
    }
    lastY = y;
  }, { passive: true });

  /* ---- Mobile menu ---- */
  const menuBtn = document.getElementById('menuBtn');
  const navm = document.getElementById('navm');
  const navmClose = document.getElementById('navmClose');
  if (menuBtn && navm) {
    menuBtn.addEventListener('click', () => navm.classList.add('open'));
    if (navmClose) navmClose.addEventListener('click', () => navm.classList.remove('open'));
    navm.addEventListener('click', e => { if (e.target === navm) navm.classList.remove('open'); });
  }

  /* ---- Contact dialog ---- */
  const contactDialog = document.getElementById('contactDialog');
  const contactClose = document.getElementById('contactClose');
  const contactBg = document.getElementById('contactBg');

  function openContact() {
    if (contactDialog) contactDialog.classList.add('open');
    if (navm) navm.classList.remove('open');
    document.body.style.overflow = 'hidden';
  }
  function closeContact() {
    if (contactDialog) contactDialog.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (contactClose) contactClose.addEventListener('click', closeContact);
  if (contactBg) contactBg.addEventListener('click', closeContact);
  document.querySelectorAll('[data-contact]').forEach(btn => btn.addEventListener('click', openContact));

  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', e => {
      e.preventDefault();
      const email = document.getElementById('contactEmail').value;
      const name = document.getElementById('contactName').value;
      const msg = document.getElementById('contactMsg').value;
      window.location.href = 'mailto:hemantkagrahari@gmail.com?subject=' +
        encodeURIComponent('Project enquiry from ' + name) + '&body=' +
        encodeURIComponent(msg + '\n\nFrom: ' + name + ' <' + email + '>');
    });
  }

  /* ---- Scroll to section ---- */
  document.querySelectorAll('[data-go]').forEach(btn => {
    btn.addEventListener('click', () => {
      if (navm) navm.classList.remove('open');
      const id = btn.dataset.go;
      const el = document.getElementById(id === 'home' ? 'home' : id);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    });
  });

  /* ---- Doors data + hover info ---- */
  const doorData = [
    { h: 'Web Developer', t: 'Custom websites & web apps', p: ['React, Next.js, Vite & Framer', 'Responsive & accessible', 'From first sketch to deployment'] },
    { h: 'App Developer', t: 'Native iOS apps & games', p: ['Swift & SwiftUI', 'From sketch to App Store', 'Performance-first approach'] },
    { h: 'UI/UX Designer', t: 'Product & interface design', p: ['User flows & wireframes', 'Figma & Framer', 'Focused on usability & clarity'] },
    { h: 'Graphic Designer', t: 'Brand identity & creatives', p: ['Social media creatives', 'Adobe Illustrator & Photoshop', 'Logos, decks & visual assets'] }
  ];

  const dinfo = document.getElementById('dinfo');
  const dots = document.querySelectorAll('#doorsDots i');
  const doorUnits = document.querySelectorAll('.unit:not(.unit--secret)');

  function setDoorInfo(idx) {
    const d = doorData[idx];
    if (!d || !dinfo) return;
    dinfo.querySelector('.dinfo__h').textContent = d.h;
    dinfo.querySelector('.dinfo__t').textContent = d.t;
    dinfo.querySelector('.dinfo__p').innerHTML = d.p.map(s => '<li>' + s + '</li>').join('');
    dots.forEach((dot, i) => dot.classList.toggle('on', i === idx));
  }
  setDoorInfo(0);

  const doorLinks = ['web-developer', 'app-developer', 'ui-ux-designer', 'graphic-designer'];
  doorUnits.forEach((unit, idx) => {
    unit.addEventListener('mouseenter', () => setDoorInfo(idx));
    unit.querySelector('.doorway').addEventListener('click', () => {
      if (doorLinks[idx]) window.location.href = doorLinks[idx] + '/';
    });
  });

  /* ---- Doors drag-to-scroll ---- */
  const doorsRow = document.getElementById('doorsRow');
  if (doorsRow) {
    let isDown = false, startX, scrollLeft;
    doorsRow.addEventListener('mousedown', e => {
      isDown = true; startX = e.pageX - doorsRow.offsetLeft; scrollLeft = doorsRow.scrollLeft;
      doorsRow.style.userSelect = 'none';
    });
    doorsRow.addEventListener('mouseleave', () => { isDown = false; });
    doorsRow.addEventListener('mouseup', () => { isDown = false; doorsRow.style.userSelect = ''; });
    doorsRow.addEventListener('mousemove', e => {
      if (!isDown) return;
      e.preventDefault();
      doorsRow.scrollLeft = scrollLeft - (e.pageX - doorsRow.offsetLeft - startX) * 1.5;
    });
  }

  /* ---- Story timeline ---- */
  const storyItems = document.querySelectorAll('#storyList .ch');
  const storyWhen = document.getElementById('storyWhen');
  const storyCount = document.getElementById('storyCount');
  const storyBarFill = document.getElementById('storyBarFill');

  if (storyItems.length) {
    const storyObs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          const idx = Array.from(storyItems).indexOf(e.target);
          if (idx >= 0) {
            if (storyWhen) storyWhen.textContent = e.target.dataset.when || '';
            if (storyCount) storyCount.textContent = String(idx + 1).padStart(2, '0');
            if (storyBarFill) storyBarFill.style.transform = 'scaleX(' + ((idx + 1) / storyItems.length) + ')';
          }
        }
      });
    }, { threshold: 0.45, rootMargin: '-5% 0px -5% 0px' });
    storyItems.forEach(item => storyObs.observe(item));
  }

  /* ---- Keyboard escapes ---- */
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      closeContact();
      if (navm) navm.classList.remove('open');
    }
  });

})();

/* =============================================
   JOMBANG — KOTA SANTRI
   JavaScript — Interactions & Animations
   ============================================= */

'use strict';

// ========================
// 1. NAVBAR SCROLL & MOBILE
// ========================
function initNavbar() {
    const navbar = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');

    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 60);
    }, { passive: true });

    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('open');
    });

    navLinks.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => navLinks.classList.remove('open'));
    });

    // Active state via IntersectionObserver
    const sections = document.querySelectorAll('section[id]');
    const io = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.id;
                navLinks.querySelectorAll('.nav-link').forEach(l => {
                    l.classList.toggle('active', l.getAttribute('href') === '#' + id);
                });
            }
        });
    }, { threshold: 0.35 });
    sections.forEach(s => io.observe(s));

    // Inject active style
    const style = document.createElement('style');
    style.textContent = `.nav-link.active { color: var(--ijo) !important; }
  .nav-link.active::after { left: 10% !important; right: 10% !important; }
  .hamburger.open span:nth-child(1) { transform: rotate(45deg) translate(5px, 5px); }
  .hamburger.open span:nth-child(2) { opacity: 0; }
  .hamburger.open span:nth-child(3) { transform: rotate(-45deg) translate(5px, -5px); }`;
    document.head.appendChild(style);

    hamburger.addEventListener('click', () => hamburger.classList.toggle('open'));
}

// ========================
// 2. SCROLL REVEAL
// ========================
function initReveal() {
    const reveals = document.querySelectorAll('.reveal');

    const io = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = parseInt(entry.target.dataset.delay || 0);
                setTimeout(() => entry.target.classList.add('visible'), delay);
                io.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });

    reveals.forEach(el => io.observe(el));
}

// ========================
// 3. BAR CHART ANIMATION
// ========================
function initBarChart() {
    const bars = document.querySelectorAll('.bar-fill');

    // Store target widths then reset
    bars.forEach(bar => {
        bar._targetWidth = bar.dataset.w + '%';
        bar.style.width = '0%';
    });

    const io = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const bars = entry.target.querySelectorAll('.bar-fill');
                bars.forEach((bar, i) => {
                    setTimeout(() => {
                        bar.style.width = bar._targetWidth;
                    }, i * 120);
                });
                io.unobserve(entry.target);
            }
        });
    }, { threshold: 0.4 });

    const chart = document.querySelector('.bar-chart');
    if (chart) io.observe(chart);
}

// ========================
// 4. SMOOTH SCROLL
// ========================
function initSmoothScroll() {
    const NAV_HEIGHT = 70;
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', e => {
            e.preventDefault();
            const target = document.querySelector(link.getAttribute('href'));
            if (target) {
                const top = target.getBoundingClientRect().top + window.scrollY - NAV_HEIGHT;
                window.scrollTo({ top, behavior: 'smooth' });
            }
        });
    });
}

// ========================
// 5. HERO PARALLAX
// ========================
function initParallax() {
    const bgText = document.querySelector('.pesantren-bg-text');
    const patternSvg = document.querySelector('.hero-pattern-bg');

    window.addEventListener('scroll', () => {
        const sy = window.scrollY;
        if (bgText) {
            bgText.style.transform = `translate(-50%, calc(-50% + ${sy * 0.15}px))`;
            bgText.style.opacity = Math.max(0, 1 - sy / 600);
        }
    }, { passive: true });

    // Mandala subtle parallax on mouse
    const mandala = document.querySelector('.mandala-wrap');
    if (mandala) {
        window.addEventListener('mousemove', e => {
            const { innerWidth, innerHeight } = window;
            const x = (e.clientX / innerWidth - 0.5) * 12;
            const y = (e.clientY / innerHeight - 0.5) * 12;
            mandala.style.transform = `translate(${x}px, ${y}px)`;
        }, { passive: true });
    }
}

// ========================
// 6. ISLAMIC PATTERN CANVAS (hero bg enhancement)
// ========================
function initPatternAnimation() {
    const svg = document.querySelector('.pattern-svg');
    if (!svg) return;

    // Subtle breathing animation via CSS
    const style = document.createElement('style');
    style.textContent = `
    .pattern-svg {
      animation: pattern-breathe 8s ease-in-out infinite;
    }
    @keyframes pattern-breathe {
      0%, 100% { opacity: 0.7; transform: scale(1); }
      50% { opacity: 1; transform: scale(1.02); }
    }
  `;
    document.head.appendChild(style);
}

// ========================
// 7. COUNTER ANIMATION (hero pills)
// ========================
function initCounters() {
    function countUp(el, target, suffix = '') {
        const duration = 2000;
        const start = performance.now();

        function update(now) {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(target * eased);
            el.textContent = current.toLocaleString('id-ID') + suffix;
            if (progress < 1) requestAnimationFrame(update);
        }
        requestAnimationFrame(update);
    }

    const pillVals = document.querySelectorAll('.pill-val');
    const io = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const text = el.textContent.trim();
                // Parse numbers only
                if (text === '1.376.547') countUp(el, 1376547);
                else if (text === '1.159,50') {
                    // float formatted
                    let v = 0;
                    const dur = 2000;
                    const s = performance.now();

                    function upFloat(now) {
                        const p = Math.min((now - s) / dur, 1);
                        const e = 1 - Math.pow(1 - p, 3);
                        v = (1159.50 * e);
                        el.textContent = v.toFixed(2).replace('.', ',');
                        if (p < 1) requestAnimationFrame(upFloat);
                    }
                    requestAnimationFrame(upFloat);
                } else if (text === '21') countUp(el, 21);
                io.unobserve(el);
            }
        });
    }, { threshold: 0.8 });

    pillVals.forEach(el => io.observe(el));
}

// ========================
// 8. HOVER RIPPLE on cards
// ========================
function initRipple() {
    const cards = document.querySelectorAll('.hcard, .pp-card, .tokoh-card');

    cards.forEach(card => {
        card.addEventListener('click', function (e) {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const ripple = document.createElement('span');
            ripple.style.cssText = `
        position: absolute; border-radius: 50%;
        width: 0; height: 0;
        background: rgba(61,122,56,0.15);
        left: ${x}px; top: ${y}px;
        transform: translate(-50%, -50%);
        animation: ripple-anim 0.6s ease-out forwards;
        pointer-events: none;
      `;
            card.style.position = 'relative';
            card.style.overflow = 'hidden';
            card.appendChild(ripple);
            setTimeout(() => ripple.remove(), 700);
        });
    });

    const style = document.createElement('style');
    style.textContent = `
    @keyframes ripple-anim {
      to { width: 300px; height: 300px; opacity: 0; }
    }
  `;
    document.head.appendChild(style);
}

// ========================
// 9. ORNAMENTAL DIVIDERS
// ========================
function injectOrnaments() {
    // Add subtle section transition ornament
    const sectionIds = ['#history', '#pesantren', '#tokoh', '#geography'];
    sectionIds.forEach(id => {
        const el = document.querySelector(id);
        if (!el) return;
        const div = document.createElement('div');
        div.style.cssText = `text-align:center; padding: 0.5rem; color: rgba(61,122,56,0.25); font-size: 0.7rem; letter-spacing: 0.6em; user-select: none;`;
        div.textContent = '✦ ✦ ✦';
        el.parentNode.insertBefore(div, el);
    });
}

// ========================
// 10. HERO ENTRANCE ANIMATION
// ========================
function initHeroEntrance() {
    const style = document.createElement('style');
    style.textContent = `
    .hero-kaligrafi { animation: hero-fade-up 0.7s 0.1s both ease; }
    .hero-label     { animation: hero-fade-up 0.7s 0.25s both ease; }
    .hero-title     { animation: hero-fade-up 0.7s 0.4s both ease; }
    .hero-desc      { animation: hero-fade-up 0.7s 0.55s both ease; }
    .hero-tagline   { animation: hero-fade-up 0.7s 0.7s both ease; }
    .hero-actions   { animation: hero-fade-up 0.7s 0.85s both ease; }
    .hero-emblem    { animation: hero-fade-in 1s 0.5s both ease; }
    .hero-pills     { animation: hero-fade-up 0.7s 1s both ease; }
    @keyframes hero-fade-up {
      from { opacity: 0; transform: translateY(24px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes hero-fade-in {
      from { opacity: 0; transform: scale(0.92); }
      to   { opacity: 1; transform: scale(1); }
    }
  `;
    document.head.appendChild(style);
}

// ========================
// 11. TYPEWRITER - HERO TAGLINE
// ========================
function initTypewriter() {
    const tagline = document.querySelector('.hero-tagline');
    if (!tagline) return;

    const texts = [
        '"BERsih, Indah, nyaMAN"',
        '"Beriman · Toleransi · Santri"',
        '"Ijo dan Abang, satu jiwa"',
    ];
    let idx = 0;
    let charIdx = 0;
    let deleting = false;

    tagline.style.borderLeft = '3px solid var(--ijo)';
    tagline.style.minHeight = '1.7em';

    function type() {
        const current = texts[idx];
        if (!deleting) {
            tagline.textContent = current.substring(0, charIdx + 1);
            charIdx++;
            if (charIdx >= current.length) {
                deleting = true;
                setTimeout(type, 2200);
                return;
            }
        } else {
            tagline.textContent = current.substring(0, charIdx - 1);
            charIdx--;
            if (charIdx <= 0) {
                deleting = false;
                idx = (idx + 1) % texts.length;
                setTimeout(type, 400);
                return;
            }
        }
        setTimeout(type, deleting ? 40 : 70);
    }

    // Start after hero animation
    setTimeout(type, 1500);
}

// ========================
// 12. SCROLL PROGRESS BAR
// ========================
function initScrollProgress() {
    const bar = document.createElement('div');
    bar.style.cssText = `
    position: fixed; top: 0; left: 0; height: 3px; z-index: 9999;
    background: linear-gradient(90deg, var(--ijo), var(--gold));
    width: 0%; transition: width 0.1s linear;
    pointer-events: none;
  `;
    document.body.appendChild(bar);

    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        bar.style.width = (scrollTop / docHeight * 100) + '%';
    }, { passive: true });
}

// ========================
// INIT ALL
// ========================
document.addEventListener('DOMContentLoaded', () => {
    initHeroEntrance();
    initNavbar();
    initReveal();
    initBarChart();
    initSmoothScroll();
    initParallax();
    initPatternAnimation();
    initCounters();
    initRipple();
    injectOrnaments();
    initTypewriter();
    initScrollProgress();

    console.log('%c✦ JOMBANG — KOTA SANTRI ✦', 'color: #3d7a38; font-family: serif; font-size: 1.2rem; font-weight: bold;');
    console.log('%c112°03\'–112°27\' BT · 7°24\'–7°45\' LS', 'color: #8b5a2b; font-family: serif;');
    console.log('%c"Tempat lahirnya para ulama dan pemimpin bangsa."', 'color: #8a6a50; font-family: serif; font-style: italic;');
});
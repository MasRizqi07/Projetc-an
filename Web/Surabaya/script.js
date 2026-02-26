/* =============================================
   SURABAYA — KOTA PAHLAWAN
   JavaScript — Interactions & Animations
   ============================================= */

'use strict';

// ========================
// 1. CUSTOM CURSOR
// ========================
function initCursor() {
    const dot = document.createElement('div');
    dot.className = 'cursor-dot';
    const ring = document.createElement('div');
    ring.className = 'cursor-ring';
    document.body.appendChild(dot);
    document.body.appendChild(ring);

    let mouseX = 0, mouseY = 0;
    let ringX = 0, ringY = 0;
    let rafId;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        dot.style.left = mouseX + 'px';
        dot.style.top = mouseY + 'px';
    });

    function animateRing() {
        ringX += (mouseX - ringX) * 0.12;
        ringY += (mouseY - ringY) * 0.12;
        ring.style.left = ringX + 'px';
        ring.style.top = ringY + 'px';
        rafId = requestAnimationFrame(animateRing);
    }
    animateRing();

    // Hover effects
    const hoverTargets = 'a, button, .stat-card, .district-card, .culture-card, .timeline-card, .info-item';
    document.addEventListener('mouseover', (e) => {
        if (e.target.closest(hoverTargets)) {
            ring.style.width = '52px';
            ring.style.height = '52px';
            ring.style.opacity = '0.6';
            dot.style.transform = 'translate(-50%, -50%) scale(1.5)';
        }
    });
    document.addEventListener('mouseout', (e) => {
        if (e.target.closest(hoverTargets)) {
            ring.style.width = '32px';
            ring.style.height = '32px';
            ring.style.opacity = '1';
            dot.style.transform = 'translate(-50%, -50%) scale(1)';
        }
    });
}

// ========================
// 2. NAVBAR SCROLL
// ========================
function initNavbar() {
    const navbar = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.querySelector('.nav-links');

    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 60);
    });

    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('open');
        hamburger.classList.toggle('active');
    });

    // Close on link click
    navLinks.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('open');
            hamburger.classList.remove('active');
        });
    });

    // Active link on scroll
    const sections = document.querySelectorAll('section[id]');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.id;
                document.querySelectorAll('.nav-link').forEach(l => {
                    l.classList.toggle('active', l.getAttribute('href') === '#' + id);
                });
            }
        });
    }, { threshold: 0.4 });

    sections.forEach(s => observer.observe(s));
}

// ========================
// 3. SCROLL REVEAL
// ========================
function initScrollReveal() {
    const cards = document.querySelectorAll(
        '.stat-card, .district-card, .culture-card, .timeline-item'
    );

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
                const delay = parseInt(entry.target.dataset.delay || 0);
                setTimeout(() => {
                    entry.target.classList.add('visible');
                    // Animate bar fill
                    const bar = entry.target.querySelector('.stat-bar-fill');
                    if (bar) {
                        const targetWidth = bar.style.width;
                        bar.style.setProperty('--target-width', targetWidth);
                    }
                }, delay);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    cards.forEach((card, i) => {
        if (!card.dataset.delay) {
            card.dataset.delay = i * 80;
        }
        observer.observe(card);
    });
}

// ========================
// 4. COUNTER ANIMATION
// ========================
function initCounters() {
    const counters = document.querySelectorAll('.stat-number[data-target]');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const target = parseInt(el.dataset.target);
                animateCounter(el, 0, target, 2000);
                observer.unobserve(el);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(c => observer.observe(c));
}

function animateCounter(el, start, end, duration) {
    const startTime = performance.now();
    const range = end - start;

    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Easing: easeOutExpo
        const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
        const current = Math.floor(start + range * eased);
        el.textContent = current.toLocaleString('id-ID');
        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }
    requestAnimationFrame(update);
}

// ========================
// 5. GLITCH TITLE RANDOM
// ========================
function initGlitch() {
    const glitchTexts = document.querySelectorAll('.glitch-text');

    function randomGlitch(el) {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&';
        const original = el.dataset.text;
        let iterations = 0;
        const maxIterations = original.length * 2;

        const interval = setInterval(() => {
            el.textContent = original.split('').map((char, i) => {
                if (i < iterations / 2) return original[i];
                return chars[Math.floor(Math.random() * chars.length)];
            }).join('');

            iterations++;
            if (iterations >= maxIterations) {
                clearInterval(interval);
                el.textContent = original;
            }
        }, 40);
    }

    // Random glitch every few seconds
    glitchTexts.forEach(el => {
        setInterval(() => {
            if (Math.random() > 0.6) randomGlitch(el);
        }, 4000 + Math.random() * 3000);
    });
}

// ========================
// 6. PARALLAX HERO BG TEXT
// ========================
function initParallax() {
    const bgText = document.querySelector('.hero-bg-text');
    const heroCircle = document.querySelector('.hero-visual');

    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        if (bgText) {
            bgText.style.transform = `translate(-50%, calc(-50% + ${scrollY * 0.3}px))`;
            bgText.style.opacity = Math.max(0, 1 - scrollY / 400);
        }
    }, { passive: true });

    window.addEventListener('mousemove', (e) => {
        if (!heroCircle) return;
        const { innerWidth, innerHeight } = window;
        const x = (e.clientX / innerWidth - 0.5) * 20;
        const y = (e.clientY / innerHeight - 0.5) * 20;
        heroCircle.style.transform = `translateY(-50%) translate(${x}px, ${y}px)`;
    }, { passive: true });
}

// ========================
// 7. HERO BOTTOM BAR TICKER
// ========================
function initTicker() {
    const vals = document.querySelectorAll('.hbb-val');
    // Add blinking effect to values
    vals.forEach((val, i) => {
        setInterval(() => {
            val.style.opacity = '0.5';
            setTimeout(() => val.style.opacity = '1', 80);
        }, 3000 + i * 700);
    });
}

// ========================
// 8. NAVBAR ACTIVE STYLE
// ========================
const navStyle = document.createElement('style');
navStyle.textContent = `
  .nav-link.active { color: var(--clr-primary) !important; }
  .nav-link.active::before { left: 10% !important; right: 10% !important; }
  .nav-hamburger.active span:nth-child(1) { transform: rotate(45deg) translate(5px, 5px); }
  .nav-hamburger.active span:nth-child(2) { opacity: 0; }
  .nav-hamburger.active span:nth-child(3) { transform: rotate(-45deg) translate(5px, -5px); }
`;
document.head.appendChild(navStyle);

// ========================
// 9. STAT BAR ANIMATION FIX
// ========================
function initStatBars() {
    const bars = document.querySelectorAll('.stat-bar-fill');
    bars.forEach(bar => {
        const width = bar.style.width;
        bar.style.width = '0';
        bar.dataset.targetWidth = width;
    });

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const bar = entry.target;
                setTimeout(() => {
                    bar.style.transition = 'width 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
                    bar.style.width = bar.dataset.targetWidth;
                }, 400);
                observer.unobserve(bar);
            }
        });
    }, { threshold: 0.5 });

    bars.forEach(bar => observer.observe(bar));
}

// ========================
// 10. BACKGROUND PARTICLES
// ========================
function initParticles() {
    const canvas = document.createElement('canvas');
    canvas.style.cssText = `
    position: fixed; top: 0; left: 0; width: 100%; height: 100%;
    pointer-events: none; z-index: 0; opacity: 0.4;
  `;
    document.body.insertBefore(canvas, document.body.firstChild);

    const ctx = canvas.getContext('2d');
    let particles = [];
    let animFrame;

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    class Particle {
        constructor() { this.reset(); }
        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.vx = (Math.random() - 0.5) * 0.3;
            this.vy = -Math.random() * 0.5 - 0.1;
            this.life = 0;
            this.maxLife = Math.random() * 150 + 100;
            this.size = Math.random() * 1.5 + 0.5;
        }
        update() {
            this.x += this.vx;
            this.y += this.vy;
            this.life++;
            if (this.life > this.maxLife) this.reset();
        }
        draw() {
            const alpha = Math.sin((this.life / this.maxLife) * Math.PI) * 0.6;
            ctx.globalAlpha = alpha;
            ctx.fillStyle = Math.random() > 0.8 ? '#f0c040' : '#00b4ff';
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    // Create particles
    for (let i = 0; i < 60; i++) {
        const p = new Particle();
        p.life = Math.random() * p.maxLife; // stagger start
        particles.push(p);
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        ctx.globalAlpha = 1;
        animFrame = requestAnimationFrame(animate);
    }
    animate();
}

// ========================
// 11. SMOOTH SCROLL LINKS
// ========================
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(link.getAttribute('href'));
            if (target) {
                const offset = 64; // navbar height
                const top = target.getBoundingClientRect().top + window.scrollY - offset;
                window.scrollTo({ top, behavior: 'smooth' });
            }
        });
    });
}

// ========================
// 12. TYPING EFFECT — HERO SUBTITLE
// ========================
function initTypingEffect() {
    const el = document.querySelector('.hero-subtitle');
    if (!el) return;

    const lines = [
        'Ibu Kota Jawa Timur. Kota Terbesar Kedua Indonesia.',
        'Kota Pahlawan. Kota Perdagangan. Kota Masa Depan.',
        'Dari Sura & Baya, lahir jiwa perjuangan sejati.'
    ];

    let lineIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let isPaused = false;

    const monoEl = el.querySelector('.mono');
    const textNode = el.firstChild;
    if (!textNode || textNode.nodeType !== Node.TEXT_NODE) return;

    const originalText = textNode.textContent;
    textNode.textContent = '';

    function type() {
        const currentLine = lines[lineIndex];

        if (!isDeleting) {
            textNode.textContent = currentLine.substring(0, charIndex + 1);
            charIndex++;
            if (charIndex >= currentLine.length) {
                isDeleting = true;
                setTimeout(type, 2000);
                return;
            }
        } else {
            textNode.textContent = currentLine.substring(0, charIndex - 1);
            charIndex--;
            if (charIndex <= 0) {
                isDeleting = false;
                lineIndex = (lineIndex + 1) % lines.length;
                setTimeout(type, 500);
                return;
            }
        }
        setTimeout(type, isDeleting ? 35 : 60);
    }

    // Start after hero animation
    setTimeout(type, 1200);
}

// ========================
// INIT ALL
// ========================
document.addEventListener('DOMContentLoaded', () => {
    initCursor();
    initNavbar();
    initScrollReveal();
    initCounters();
    initGlitch();
    initParallax();
    initTicker();
    initStatBars();
    initParticles();
    initSmoothScroll();
    initTypingEffect();

    console.log('%c⚓ SURABAYA — KOTA PAHLAWAN', 'color: #00b4ff; font-family: monospace; font-size: 1.2rem; font-weight: bold;');
    console.log('%c[ -7.2575° S, 112.7521° E ]', 'color: #f0c040; font-family: monospace;');
    console.log('%cBuilt with ❤️ for Arek-Arek Suroboyo', 'color: #5a7a9a; font-family: monospace;');
});
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const dom = {
    loadingScreen: document.querySelector('.loading-screen'),
    loadingCounter: document.querySelector('.loading-counter'),
    menuOverlay: document.querySelector('.menu-overlay'),
    navToggle: document.querySelector('.nav-toggle'),
    hamburger: document.querySelector('.hamburger'),
    backToTop: document.querySelector('.back-to-top'),
    progressBar: document.querySelector('.scroll-progress-bar'),
    heroCta: document.querySelector('.hero-cta'),
    cursorEl: document.querySelector('.custom-cursor'),
    sakuraContainer: document.querySelector('.sakura-container'),
    eraLinks: [...document.querySelectorAll('[data-era-link]')],
    revealElements: [...document.querySelectorAll('.reveal')],
    sections: [...document.querySelectorAll('.era-section')],
    parallaxLayers: [...document.querySelectorAll('.parallax-layer')],
    canvas: document.querySelector('.fx-canvas'),
    statNumbers: [...document.querySelectorAll('.stat-number[data-target]')],
    tiltCards: [...document.querySelectorAll('[data-tilt]')]
};

let ticking = false;

/* ===== MENU ===== */
function closeMenu() {
    if (!dom.menuOverlay || !dom.hamburger) return;
    dom.menuOverlay.classList.remove('open');
    dom.menuOverlay.setAttribute('aria-hidden', 'true');
    dom.hamburger.classList.remove('active');
    document.body.classList.remove('menu-open');
}

function openMenu() {
    if (!dom.menuOverlay || !dom.hamburger) return;
    dom.menuOverlay.classList.add('open');
    dom.menuOverlay.setAttribute('aria-hidden', 'false');
    dom.hamburger.classList.add('active');
    document.body.classList.add('menu-open');
}

function toggleMenu() {
    if (!dom.menuOverlay) return;
    dom.menuOverlay.classList.contains('open') ? closeMenu() : openMenu();
}

function scrollToTarget(targetId) {
    const target = document.querySelector(targetId);
    if (!target) return;
    target.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'start' });
}

/* ===== SCROLL UPDATES ===== */
function updateScrollProgress() {
    if (!dom.progressBar) return;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const progress = maxScroll > 0 ? (window.scrollY / maxScroll) * 100 : 0;
    dom.progressBar.style.width = `${Math.min(100, Math.max(0, progress))}%`;
}

function updateBackToTop() {
    if (!dom.backToTop) return;
    dom.backToTop.classList.toggle('visible', window.scrollY > 560);
}

function updateParallax() {
    if (prefersReducedMotion) return;
    dom.parallaxLayers.forEach((layer) => {
        const speed = Number(layer.dataset.speed || 0);
        const section = layer.closest('.era-section');
        if (!section) return;
        const rect = section.getBoundingClientRect();
        if (rect.bottom < 0 || rect.top > window.innerHeight) return;
        const relative = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
        const movement = (relative - 0.5) * 130 * speed;
        layer.style.transform = `translate3d(0, ${movement}px, 0)`;
    });
}

function updateActiveEra() {
    let activeEra = '';
    dom.sections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= window.innerHeight * 0.45 && rect.bottom >= window.innerHeight * 0.35) {
            activeEra = section.dataset.era;
        }
    });
    dom.eraLinks.forEach((link) => {
        link.classList.toggle('active', link.dataset.eraLink === activeEra);
    });
}

function handleScroll() {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(() => {
        updateScrollProgress();
        updateBackToTop();
        updateParallax();
        updateActiveEra();
        ticking = false;
    });
}

/* ===== REVEAL OBSERVER ===== */
function setupRevealObserver() {
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            });
        },
        { threshold: 0.15, rootMargin: '0px 0px -6% 0px' }
    );
    dom.revealElements.forEach((el) => observer.observe(el));
}

/* ===== SECTION IN-VIEW (glow pulse) ===== */
function setupSectionObserver() {
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                entry.target.classList.toggle('in-view', entry.isIntersecting);
            });
        },
        { threshold: 0.25 }
    );
    dom.sections.forEach((s) => observer.observe(s));
}

/* ===== CUSTOM CURSOR ===== */
function setupCursor() {
    if (!dom.cursorEl || prefersReducedMotion) return;
    if (window.matchMedia('(pointer: coarse)').matches) return;

    let cx = 0, cy = 0, tx = 0, ty = 0;

    document.addEventListener('mousemove', (e) => {
        tx = e.clientX;
        ty = e.clientY;
    });

    function lerp(a, b, t) { return a + (b - a) * t; }

    function tick() {
        cx = lerp(cx, tx, 0.15);
        cy = lerp(cy, ty, 0.15);
        dom.cursorEl.style.transform = `translate(${cx}px, ${cy}px)`;
        requestAnimationFrame(tick);
    }
    tick();

    const hoverTargets = document.querySelectorAll('a, button, .image-frame, .fact-card, .timeline-card, .cta-btn');
    hoverTargets.forEach((el) => {
        el.addEventListener('mouseenter', () => dom.cursorEl.classList.add('hovering'));
        el.addEventListener('mouseleave', () => dom.cursorEl.classList.remove('hovering'));
    });
}

/* ===== SAKURA PETALS ===== */
function setupSakura() {
    if (!dom.sakuraContainer || prefersReducedMotion) return;

    function spawnPetal() {
        const petal = document.createElement('div');
        petal.className = 'sakura-petal';
        const size = Math.random() * 8 + 8;
        petal.style.width = size + 'px';
        petal.style.height = size + 'px';
        petal.style.left = Math.random() * 100 + 'vw';
        petal.style.animationDuration = (Math.random() * 6 + 7) + 's';
        petal.style.animationDelay = (Math.random() * 2) + 's';
        dom.sakuraContainer.appendChild(petal);
        petal.addEventListener('animationend', () => petal.remove());
    }

    setInterval(spawnPetal, 900);
}

/* ===== STAT COUNTERS ===== */
function setupStatCounters() {
    if (!dom.statNumbers.length) return;

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                const el = entry.target;
                const target = parseInt(el.dataset.target, 10);
                if (isNaN(target)) return;
                animateCounter(el, target);
                observer.unobserve(el);
            });
        },
        { threshold: 0.4 }
    );

    dom.statNumbers.forEach((el) => observer.observe(el));
}

function animateCounter(el, target) {
    const duration = 1800;
    const start = performance.now();

    function update(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(eased * target);
        if (progress < 1) requestAnimationFrame(update);
    }

    requestAnimationFrame(update);
}

/* ===== TILT EFFECT ===== */
function setupTilt() {
    if (prefersReducedMotion || window.matchMedia('(pointer: coarse)').matches) return;

    dom.tiltCards.forEach((card) => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;
            card.style.transform = `perspective(600px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) scale(1.02)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });
}

/* ===== LOADING SCREEN ===== */
function hideLoader() {
    if (!dom.loadingScreen) return;

    if (prefersReducedMotion) {
        dom.loadingScreen.classList.add('hidden');
        return;
    }

    let count = 0;
    const interval = setInterval(() => {
        count += Math.floor(Math.random() * 8) + 3;
        if (count > 100) count = 100;
        if (dom.loadingCounter) dom.loadingCounter.textContent = count + '%';
        if (count >= 100) {
            clearInterval(interval);
            setTimeout(() => dom.loadingScreen.classList.add('hidden'), 350);
        }
    }, 50);
}

/* ===== CANVAS PARTICLES ===== */
function setupCanvasFx() {
    if (!dom.canvas || prefersReducedMotion) return;

    const ctx = dom.canvas.getContext('2d');
    if (!ctx) return;

    let width = 0, height = 0;
    const particles = [];
    const particleCount = 48;

    function resize() {
        width = window.innerWidth;
        height = window.innerHeight;
        dom.canvas.width = width;
        dom.canvas.height = height;
    }

    function createParticle() {
        return {
            x: Math.random() * width,
            y: Math.random() * height,
            radius: Math.random() * 1.6 + 0.4,
            alpha: Math.random() * 0.3 + 0.06,
            vx: (Math.random() - 0.5) * 0.16,
            vy: (Math.random() - 0.5) * 0.16
        };
    }

    function initParticles() {
        particles.length = 0;
        for (let i = 0; i < particleCount; i++) particles.push(createParticle());
    }

    function draw() {
        ctx.clearRect(0, 0, width, height);
        particles.forEach((p) => {
            p.x += p.vx; p.y += p.vy;
            if (p.x < 0) p.x = width; if (p.x > width) p.x = 0;
            if (p.y < 0) p.y = height; if (p.y > height) p.y = 0;
            ctx.beginPath();
            ctx.fillStyle = `rgba(255, 179, 111, ${p.alpha})`;
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fill();
        });
        requestAnimationFrame(draw);
    }

    resize();
    initParticles();
    draw();
    window.addEventListener('resize', () => { resize(); initParticles(); });
}

/* ===== EVENT LISTENERS ===== */
function setupEventListeners() {
    window.addEventListener('scroll', handleScroll, { passive: true });

    dom.navToggle?.addEventListener('click', toggleMenu);

    dom.menuOverlay?.addEventListener('click', (e) => {
        if (e.target === dom.menuOverlay) closeMenu();
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeMenu();
    });

    document.querySelectorAll('[data-scroll]').forEach((anchor) => {
        anchor.addEventListener('click', (e) => {
            e.preventDefault();
            const href = anchor.getAttribute('href');
            if (!href || !href.startsWith('#')) return;
            closeMenu();
            scrollToTarget(href);
        });
    });

    dom.heroCta?.addEventListener('click', () => {
        const targetId = dom.heroCta.getAttribute('data-scroll-target');
        if (targetId) scrollToTarget(targetId);
    });

    dom.backToTop?.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
    });
}

/* ===== INIT ===== */
function init() {
    setupEventListeners();
    setupRevealObserver();
    setupSectionObserver();
    setupCursor();
    setupSakura();
    setupStatCounters();
    setupTilt();
    setupCanvasFx();
    updateScrollProgress();
    updateBackToTop();
    updateActiveEra();
    updateParallax();
    hideLoader();
}

window.addEventListener('load', init);

/* ===== ULTRA PREMIUM RESUME — ALIVE INTERACTIONS ===== */

(function() {
    'use strict';

    const isDesktop = window.innerWidth > 768;

    // --- Theme Switcher ---
    const themeToggle = document.getElementById('themeToggle');
    const themes = ['dark', 'light'];
    let currentTheme = localStorage.getItem('theme') || 'dark';
    if (!themes.includes(currentTheme)) currentTheme = 'dark';

    function applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        currentTheme = theme;
        localStorage.setItem('theme', theme);
    }

    applyTheme(currentTheme);

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const nextIndex = (themes.indexOf(currentTheme) + 1) % themes.length;
            applyTheme(themes[nextIndex]);
        });
    }

    gsap.registerPlugin(ScrollTrigger);

    // --- Mobile Menu ---
    const burger = document.getElementById('navBurger');
    const mobileMenu = document.getElementById('mobileMenu');

    if (burger && mobileMenu) {
        burger.addEventListener('click', () => {
            burger.classList.toggle('active');
            mobileMenu.classList.toggle('active');
            document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
        });
        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                burger.classList.remove('active');
                mobileMenu.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }

    // --- Smooth Cursor Glow (Lerp) ---
    const cursorGlow = document.getElementById('cursorGlow');
    let mouseX = -300, mouseY = -300;
    let glowX = -300, glowY = -300;

    if (cursorGlow && isDesktop) {
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        function updateCursor() {
            glowX += (mouseX - glowX) * 0.08;
            glowY += (mouseY - glowY) * 0.08;
            cursorGlow.style.left = glowX + 'px';
            cursorGlow.style.top = glowY + 'px';
            requestAnimationFrame(updateCursor);
        }
        updateCursor();
    }

    // --- Scroll Progress Bar ---
    const scrollProgress = document.getElementById('scrollProgress');
    if (scrollProgress) {
        window.addEventListener('scroll', () => {
            const pct = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
            scrollProgress.style.width = pct + '%';
        }, { passive: true });
    }

    // --- Nav Scroll Effect ---
    const nav = document.getElementById('nav');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 80) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    }, { passive: true });

    // --- Smooth Scroll ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // --- Floating Particles ---
    const particleCanvas = document.getElementById('particles');
    if (particleCanvas && isDesktop) {
        const ctx = particleCanvas.getContext('2d');
        let particles = [];
        const PARTICLE_COUNT = 35;

        function resizeCanvas() {
            particleCanvas.width = window.innerWidth;
            particleCanvas.height = window.innerHeight;
        }
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        function createParticle() {
            return {
                x: Math.random() * particleCanvas.width,
                y: Math.random() * particleCanvas.height,
                vx: (Math.random() - 0.5) * 0.3,
                vy: (Math.random() - 0.5) * 0.3,
                radius: Math.random() * 1.5 + 0.5,
                color: Math.random() > 0.5 ? 'rgba(99,102,241,' : 'rgba(34,211,238,',
                alpha: Math.random() * 0.3 + 0.1
            };
        }

        for (let i = 0; i < PARTICLE_COUNT; i++) {
            particles.push(createParticle());
        }

        function drawParticles() {
            ctx.clearRect(0, 0, particleCanvas.width, particleCanvas.height);

            for (let i = 0; i < particles.length; i++) {
                const p = particles[i];
                p.x += p.vx;
                p.y += p.vy;

                if (p.x < 0) p.x = particleCanvas.width;
                if (p.x > particleCanvas.width) p.x = 0;
                if (p.y < 0) p.y = particleCanvas.height;
                if (p.y > particleCanvas.height) p.y = 0;

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                ctx.fillStyle = p.color + p.alpha + ')';
                ctx.fill();

                for (let j = i + 1; j < particles.length; j++) {
                    const q = particles[j];
                    const dx = p.x - q.x;
                    const dy = p.y - q.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 100) {
                        ctx.beginPath();
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(q.x, q.y);
                        ctx.strokeStyle = 'rgba(99,102,241,' + (0.06 * (1 - dist / 100)) + ')';
                        ctx.lineWidth = 0.5;
                        ctx.stroke();
                    }
                }
            }
            requestAnimationFrame(drawParticles);
        }
        drawParticles();
    }

    // --- Per-Card Spotlight Effect ---
    if (isDesktop) {
        const spotlightCards = document.querySelectorAll('.specialty-card, .timeline-card, .metric-card, .cred-card, .contact-item');
        spotlightCards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                card.style.setProperty('--spot-x', (e.clientX - rect.left) + 'px');
                card.style.setProperty('--spot-y', (e.clientY - rect.top) + 'px');
            });
        });
    }

    // --- 3D Tilt Effect on Cards ---
    if (isDesktop) {
        const tiltCards = document.querySelectorAll('.specialty-card, .metric-card, .stat-badge');
        tiltCards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = (e.clientX - rect.left) / rect.width - 0.5;
                const y = (e.clientY - rect.top) / rect.height - 0.5;
                card.style.transform = `perspective(800px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) translateY(-6px) translateZ(4px)`;
            });
            card.addEventListener('mouseleave', () => {
                card.style.transition = 'transform 0.5s cubic-bezier(0.03, 0.98, 0.52, 0.99)';
                card.style.transform = 'perspective(800px) rotateY(0) rotateX(0) translateY(0) translateZ(0)';
                setTimeout(() => { card.style.transition = ''; }, 500);
            });
            card.addEventListener('mouseenter', () => {
                card.style.transition = 'none';
            });
        });
    }

    // --- Pill Shimmer Index ---
    document.querySelectorAll('.pill').forEach((pill, i) => {
        pill.style.setProperty('--pill-index', i % 10);
    });

    // --- GSAP: Hero Animations ---
    const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    heroTl
        .from('.hero-avatar-wrapper', { scale: 0.5, opacity: 0, duration: 0.8, rotation: -10 }, 0.2)
        .from('.hero-label', { x: -20, opacity: 0, duration: 0.7 }, 0.4)
        .from('.name-line', { y: 80, opacity: 0, duration: 1, stagger: 0.15, ease: 'power4.out' }, 0.5)
        .from('.hero-tagline', { y: 30, opacity: 0, duration: 0.8 }, 1.0)
        .from('.hero-cta-row', { y: 20, opacity: 0, duration: 0.7 }, 1.2)
        .from('.stat-badge', { scale: 0.7, opacity: 0, duration: 0.6, stagger: 0.1, ease: 'back.out(1.4)' }, 1.0)
        .from('lottie-player', { x: 80, opacity: 0, duration: 1.2, ease: 'power2.out' }, 0.6)
        .from('.scroll-cue', { opacity: 0, y: 10, duration: 0.6 }, 1.8);

    // --- GSAP: Cinematic Section Reveals ---
    gsap.utils.toArray('.section-header').forEach(header => {
        gsap.from(header, {
            scrollTrigger: { trigger: header, start: 'top 85%', toggleActions: 'play none none none' },
            y: 20, scale: 0.97, filter: 'blur(4px)', duration: 0.9, ease: 'power3.out',
            clearProps: 'all'
        });
    });

    // --- GSAP: About Section ---
    gsap.from('.about-hook', {
        scrollTrigger: { trigger: '.about-hook', start: 'top 85%' },
        y: 20, filter: 'blur(3px)', duration: 0.8, clearProps: 'all'
    });
    gsap.from('.about-text p:not(.about-hook)', {
        scrollTrigger: { trigger: '.about-text', start: 'top 80%' },
        y: 15, duration: 0.7, delay: 0.2, clearProps: 'all'
    });
    gsap.from('.specialty-card', {
        scrollTrigger: { trigger: '.specialty-grid', start: 'top 80%' },
        y: 30, scale: 0.95, filter: 'blur(3px)', duration: 0.8, stagger: 0.1, ease: 'power3.out',
        clearProps: 'all'
    });

    // --- GSAP: Timeline Cards ---
    gsap.utils.toArray('.timeline-entry').forEach((entry) => {
        gsap.from(entry, {
            scrollTrigger: { trigger: entry, start: 'top 85%', toggleActions: 'play none none none' },
            x: -30, scale: 0.98, filter: 'blur(2px)', duration: 0.8, ease: 'power3.out',
            clearProps: 'all'
        });
    });

    // --- GSAP: Skill Groups (no animation to avoid alignment issues) ---

    // --- GSAP: Metric Counter Animation ---
    const metricCards = document.querySelectorAll('.metric-number');
    metricCards.forEach(num => {
        const target = parseInt(num.dataset.target);
        gsap.fromTo(num, { innerText: 0 }, {
            innerText: target,
            duration: 2,
            ease: 'power2.out',
            snap: { innerText: 1 },
            scrollTrigger: {
                trigger: num.closest('.metric-card'),
                start: 'top 85%',
                toggleActions: 'play none none none'
            }
        });
    });

    gsap.from('.metric-card', {
        scrollTrigger: { trigger: '.metrics-grid', start: 'top 85%', toggleActions: 'play none none none' },
        scale: 0.9, filter: 'blur(4px)', duration: 0.7, stagger: 0.08, ease: 'power3.out',
        clearProps: 'all'
    });

    // --- GSAP: Credentials ---
    gsap.utils.toArray('.cred-card').forEach((card) => {
        gsap.from(card, {
            scrollTrigger: { trigger: card, start: 'top 88%' },
            x: -15, scale: 0.98, duration: 0.6, ease: 'power2.out',
            clearProps: 'all'
        });
    });

    // --- GSAP: Contact ---
    gsap.from('.contact-heading', {
        scrollTrigger: { trigger: '.contact-content', start: 'top 80%' },
        y: 30, filter: 'blur(4px)', duration: 0.8, clearProps: 'all'
    });
    gsap.from('.contact-sub', {
        scrollTrigger: { trigger: '.contact-content', start: 'top 78%' },
        y: 15, duration: 0.7, delay: 0.2, clearProps: 'all'
    });
    gsap.from('.contact-links', {
        scrollTrigger: { trigger: '.contact-links', start: 'top 85%' },
        y: 20, scale: 0.97, duration: 0.6, ease: 'power2.out', clearProps: 'all'
    });

    // --- Magnetic Buttons ---
    document.querySelectorAll('.magnetic').forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
        });
        btn.addEventListener('mouseleave', () => {
            gsap.to(btn, { x: 0, y: 0, duration: 0.4, ease: 'elastic.out(1, 0.5)' });
        });
    });

    // --- Active Nav Link Highlight ---
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120;
            if (window.scrollY >= sectionTop) {
                current = section.getAttribute('id');
            }
        });
        navLinks.forEach(link => {
            link.style.color = '';
            if (link.getAttribute('href') === '#' + current) {
                link.style.color = 'var(--text-primary)';
            }
        });
    }, { passive: true });

    // --- Parallax on Hero Mesh ---
    if (isDesktop) {
        window.addEventListener('scroll', () => {
            const scrolled = window.scrollY;
            const mesh = document.querySelector('.hero-mesh');
            if (mesh && scrolled < window.innerHeight) {
                mesh.style.transform = `scale(${1 + scrolled * 0.0003}) translateY(${scrolled * 0.3}px)`;
            }
        }, { passive: true });
    }

})();

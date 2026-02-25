window.addEventListener('load', () => {
    const loader = document.getElementById('loader');
    if (loader) {
        gsap.to(loader, {
            opacity: 0,
            duration: 1,
            onComplete: () => {
                loader.style.display = 'none';
                initHeroAnimations();
            }
        });
    }
});

document.addEventListener('DOMContentLoaded', () => {
    // Register ScrollTrigger
    gsap.registerPlugin(ScrollTrigger);

    // --- Theme Toggle ---
    const themeToggle = document.getElementById('theme-toggle');
    const html = document.documentElement;

    if (themeToggle) {
        const themeIcon = themeToggle.querySelector('i');

        const updateThemeIcon = (theme) => {
            if (themeIcon) {
                themeIcon.className = theme === 'dark' ? 'fa-solid fa-moon' : 'fa-solid fa-sun';
            }
        };

        themeToggle.addEventListener('click', () => {
            const currentTheme = html.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            html.setAttribute('data-theme', newTheme);
            updateThemeIcon(newTheme);
            localStorage.setItem('theme', newTheme);
        });

        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            html.setAttribute('data-theme', savedTheme);
            updateThemeIcon(savedTheme);
        }
    }

    // --- Mobile Menu ---
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const body = document.body;

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            hamburger.classList.toggle('toggle');
            body.classList.toggle('menu-open');
            // Prevent scrolling when menu is open
            body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
        });

        // Close menu on nav link click
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                hamburger.classList.remove('toggle');
                body.classList.remove('menu-open');
                body.style.overflow = '';
            });
        });

        // Close menu when clicking outside (on the overlay)
        document.addEventListener('click', (e) => {
            if (
                body.classList.contains('menu-open') &&
                !navLinks.contains(e.target) &&
                !hamburger.contains(e.target)
            ) {
                navLinks.classList.remove('active');
                hamburger.classList.remove('toggle');
                body.classList.remove('menu-open');
                body.style.overflow = '';
            }
        });
    }

    // --- Scroll Top Button ---
    const scrollTopBtn = document.querySelector('.scroll-top');

    if (scrollTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                scrollTopBtn.classList.add('active');
            } else {
                scrollTopBtn.classList.remove('active');
            }
        });

        scrollTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // --- Scroll Animations ---
    const reveals = gsap.utils.toArray('.glass, .bento-item, .experience-card');
    reveals.forEach((el) => {
        gsap.from(el, {
            scrollTrigger: {
                trigger: el,
                start: 'top 90%',
                toggleActions: 'play none none none'
            },
            y: 50,
            opacity: 0,
            duration: 1,
            ease: 'power4.out'
        });
    });

    // --- Custom Cursor (desktop only) ---
    const cursor = document.querySelector('.custom-cursor');
    const follower = document.querySelector('.custom-cursor-follower');

    if (cursor && follower) {
        document.addEventListener('mousemove', (e) => {
            gsap.to(cursor, { x: e.clientX, y: e.clientY, duration: 0.1 });
            gsap.to(follower, { x: e.clientX - 10, y: e.clientY - 10, duration: 0.3 });
        });

        const activeElements = document.querySelectorAll('a, button, .bento-item, img');
        activeElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                gsap.to(cursor, { scale: 1.5, duration: 0.3 });
                gsap.to(follower, { scale: 2, borderColor: 'var(--accent-color)', duration: 0.3 });
            });
            el.addEventListener('mouseleave', () => {
                gsap.to(cursor, { scale: 1, duration: 0.3 });
                gsap.to(follower, { scale: 1, borderColor: 'var(--glass-border)', duration: 0.3 });
            });
        });
    }

    // --- WhatsApp / Contact Form Redirection ---
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = contactForm.querySelector('input[type="text"]').value;
            const email = contactForm.querySelector('input[type="email"]').value;
            const msg = contactForm.querySelector('textarea').value;
            const whatsappMsg = `Hello Sivanandh! My name is ${name}. %0AEmail: ${email} %0AMessage: ${msg}`;
            window.open(`https://wa.me/919342446559?text=${whatsappMsg}`, '_blank');
        });
    }
});

function initHeroAnimations() {
    // Only run on index page where hero elements exist
    const heroHeading = document.getElementById('hero-heading');
    if (!heroHeading) return;

    const heroTl = gsap.timeline({ defaults: { ease: 'power4.out', duration: 1.2 } });

    try {
        const heroTitle = new SplitType('#hero-heading', { types: 'chars,words' });

        heroTl
            .from('.nav-container', { y: -50, opacity: 0, duration: 1 })
            .from(heroTitle.chars, {
                opacity: 0,
                y: 100,
                rotateX: -90,
                stagger: 0.02,
                duration: 1
            }, '-=0.5')
            .from('.hero-subtitle', { opacity: 0, y: 30, duration: 0.8 }, '-=0.8')
            .from('.hero-btns', { opacity: 0, y: 30, duration: 0.8 }, '-=0.6')
            .from('.hero-socials a', { opacity: 0, y: 20, stagger: 0.1, duration: 0.8 }, '-=0.6')
            .from('.profile-img-container', { opacity: 0, scale: 0.5, rotate: 15, duration: 1.5 }, '-=1.2');
    } catch (err) {
        // Fallback: simple fade in if SplitType fails
        heroTl.from('.nav-container', { y: -50, opacity: 0, duration: 0.8 });
    }
}

// DOM Elements
const themeToggleBtn = document.getElementById('theme-toggle-btn');
const themeIcon = document.getElementById('theme-icon');
const body = document.body;
const profileImg = document.getElementById('profile-img');
const navLinks = document.querySelectorAll('.nav-link');
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const mobileMenu = document.querySelector('.mobile-menu');
const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
const pageTransition = document.querySelector('.page-transition');
const sectionTitles = document.querySelectorAll('.section-title');
const cards = document.querySelectorAll('.card');
const skillCards = document.querySelectorAll('.skill-card');
const certCards = document.querySelectorAll('.cert-card');
const emailLink = document.getElementById('email-link');
const headerGlass = document.querySelector('.header-glass');

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    // Initial page load animation
    setTimeout(() => {
        pageTransition.style.transform = 'translateY(-100%)';
        pageTransition.style.transition = 'transform 0.6s cubic-bezier(0.76, 0, 0.24, 1)';
    }, 300);

    // Set index for staggered animations
    skillCards.forEach((card, index) => {
        card.style.setProperty('--index', index);
    });

    certCards.forEach((card, index) => {
        card.style.setProperty('--index', index);
    });

    // Setup email link to open Gmail compose
    if (emailLink) {
        emailLink.addEventListener('click', function (e) {
            e.preventDefault();
            const email = 'mobinmardi.uni@gmail.com';
            const gmailComposeUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${email}`;
            window.open(gmailComposeUrl, '_blank');
        });
    }
});

// Check for saved theme preference or use preferred color scheme
const savedTheme = localStorage.getItem('theme');
const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');

// Set initial theme
if (savedTheme === 'dark' || (!savedTheme && prefersDarkScheme.matches)) {
    setDarkTheme();
} else {
    setLightTheme();
}

// Theme toggle functionality
themeToggleBtn.addEventListener('click', () => {
    pageTransition.style.transform = 'translateY(0)';

    setTimeout(() => {
        if (body.classList.contains('light-theme')) {
            setDarkTheme();
        } else {
            setLightTheme();
        }

        setTimeout(() => {
            pageTransition.style.transform = 'translateY(-100%)';
        }, 300);
    }, 300);
});

function setDarkTheme() {
    body.classList.remove('light-theme');
    body.classList.add('dark-theme');
    themeIcon.textContent = 'light_mode';
    localStorage.setItem('theme', 'dark');
}

function setLightTheme() {
    body.classList.remove('dark-theme');
    body.classList.add('light-theme');
    themeIcon.textContent = 'dark_mode';
    localStorage.setItem('theme', 'light');
}

// Mobile menu toggle
if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => {
        mobileMenuBtn.classList.toggle('active');
        mobileMenu.classList.toggle('active');

        const bars = mobileMenuBtn.querySelectorAll('.bar');
        if (mobileMenuBtn.classList.contains('active')) {
            bars[0].style.transform = 'rotate(45deg) translate(5px, 6px)';
            bars[1].style.opacity = '0';
            bars[2].style.transform = 'rotate(-45deg) translate(5px, -6px)';
            document.body.style.overflow = 'hidden';
        } else {
            bars[0].style.transform = 'rotate(0) translate(0)';
            bars[1].style.opacity = '1';
            bars[2].style.transform = 'rotate(0) translate(0)';
            document.body.style.overflow = '';
        }
    });
}

// Close mobile menu when clicking a link
mobileNavLinks.forEach(link => {
    link.addEventListener('click', () => {
        mobileMenuBtn.classList.remove('active');
        mobileMenu.classList.remove('active');

        const bars = mobileMenuBtn.querySelectorAll('.bar');
        bars[0].style.transform = 'rotate(0) translate(0)';
        bars[1].style.opacity = '1';
        bars[2].style.transform = 'rotate(0) translate(0)';
        document.body.style.overflow = '';
    });
});

// Smooth scrolling for navigation links
navLinks.forEach(link => {
    link.addEventListener('click', smoothScroll);
});

mobileNavLinks.forEach(link => {
    link.addEventListener('click', smoothScroll);
});

function smoothScroll(e) {
    e.preventDefault();
    const targetId = this.getAttribute('href');
    const targetElement = document.querySelector(targetId);

    if (targetElement) {
        const headerOffset = headerGlass ? headerGlass.offsetHeight + 24 : 80;
        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerOffset;

        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }
}

// Intersection Observer for scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

sectionTitles.forEach(title => observer.observe(title));
cards.forEach(card => observer.observe(card));

// Material Design ripple effect for buttons
function createRipple(event) {
    const button = event.currentTarget;

    const circle = document.createElement('span');
    const diameter = Math.max(button.clientWidth, button.clientHeight);
    const radius = diameter / 2;

    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${event.clientX - button.getBoundingClientRect().left - radius}px`;
    circle.style.top = `${event.clientY - button.getBoundingClientRect().top - radius}px`;
    circle.classList.add('ripple');

    const ripple = button.querySelector('.ripple');
    if (ripple) {
        ripple.remove();
    }

    button.appendChild(circle);
}

const buttons = document.querySelectorAll('.btn');
buttons.forEach(button => {
    button.addEventListener('click', createRipple);
});

// Placeholder for profile image
if (profileImg) {
    profileImg.src = profileImg.src || 'img/Profile.png';
}

// Subtle parallax for hero blobs (transform-only, GPU friendly)
const heroSection = document.querySelector('.hero-section');
const heroContent = document.querySelector('.hero-content');
const meshBlobs = document.querySelectorAll('.bg-mesh span');
let ticking = false;

window.addEventListener('scroll', () => {
    if (!ticking) {
        requestAnimationFrame(() => {
            const scrollPosition = window.scrollY;

            if (heroSection && heroContent) {
                const heroHeight = heroSection.offsetHeight;
                if (scrollPosition <= heroHeight) {
                    const parallaxValue = scrollPosition * 0.25;
                    heroContent.style.transform = `translateY(${parallaxValue}px)`;
                }
            }

            meshBlobs.forEach((blob, index) => {
                const speed = 0.08 + index * 0.03;
                blob.style.translate = `0 ${scrollPosition * speed}px`;
            });

            // Header depth feedback on scroll
            if (headerGlass) {
                headerGlass.style.boxShadow = scrollPosition > 20
                    ? 'var(--glass-shadow-hover)'
                    : '';
            }

            ticking = false;
        });
        ticking = true;
    }
}, { passive: true });

// Add loaded class to body once everything is ready (prevents transition flash)
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});

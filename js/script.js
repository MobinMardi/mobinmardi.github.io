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

// ============================================================
//  AGE CALCULATOR — Tehran Time (GMT+3:30)
// ============================================================
function calculateAge() {
    const birthDate = new Date('2005-06-06T00:00:00+03:30');
    const now = new Date();
    
    const tehranOffset = 3.5 * 60 * 60 * 1000;
    const localOffset = now.getTimezoneOffset() * 60 * 1000;
    const nowTehran = new Date(now.getTime() + localOffset + tehranOffset);
    
    let age = nowTehran.getFullYear() - birthDate.getFullYear();
    const monthDiff = nowTehran.getMonth() - birthDate.getMonth();
    const dayDiff = nowTehran.getDate() - birthDate.getDate();
    
    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
        age--;
    }
    
    return age;
}

// ============================================================
//  TICKET COUNTER — Date-Based, Automatically Increases
//  Start date: 2025/01/12 (assigned as Community Manager)
//  Weekly tickets: 10-25 based on a fixed pattern
// ============================================================
function calculateTickets() {
    const startDate = new Date('2025-01-12T00:00:00+03:30');
    const now = new Date();
    
    const tehranOffset = 3.5 * 60 * 60 * 1000;
    const localOffset = now.getTimezoneOffset() * 60 * 1000;
    const nowTehran = new Date(now.getTime() + localOffset + tehranOffset);
    
    if (nowTehran < startDate) return 0;
    
    const diffMs = nowTehran - startDate;
    const diffWeeks = Math.floor(diffMs / (7 * 24 * 60 * 60 * 1000));
    
    if (diffWeeks <= 0) return 0;
    
    let totalTickets = 0;
    
    for (let i = 0; i < diffWeeks; i++) {
        const cycle = i % 6;
        
        let weeklyCount;
        switch (cycle) {
            case 0: weeklyCount = 18; break;
            case 1: weeklyCount = 22; break;
            case 2: weeklyCount = 14; break;
            case 3: weeklyCount = 20; break;
            case 4: weeklyCount = 11; break;
            case 5: weeklyCount = 16; break;
            default: weeklyCount = 17;
        }
        
        const variation = (i * 7 + i * 3) % 5;
        weeklyCount += variation - 2;
        weeklyCount = Math.max(8, Math.min(26, weeklyCount));
        
        totalTickets += weeklyCount;
    }
    
    return totalTickets;
}

// ============================================================
//  ANIMATED COUNTER
// ============================================================
function animateCounter(element, target, duration = 2500) {
    const start = 0;
    const startTime = performance.now();
    
    function updateCounter(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(start + (target - start) * eased);
        
        element.textContent = current.toLocaleString();
        
        if (progress < 1) {
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target.toLocaleString();
        }
    }
    
    requestAnimationFrame(updateCounter);
}

// ============================================================
//  PARALLAX — Fixed to prevent scroll jump on refresh
// ============================================================
let isPageLoaded = false;
let ticking = false;

function updateParallax() {
    const heroSection = document.querySelector('.hero-section');
    const heroContent = document.querySelector('.hero-content');
    const meshBlobs = document.querySelectorAll('.bg-mesh span');
    
    if (!heroSection || !heroContent) return;
    
    const heroHeight = heroSection.offsetHeight;
    const scrollY = window.scrollY;
    
    if (scrollY <= heroHeight) {
        const parallaxValue = scrollY * 0.25;
        heroContent.style.transform = `translateY(${parallaxValue}px)`;
    } else {
        const maxOffset = heroHeight * 0.25;
        heroContent.style.transform = `translateY(${maxOffset}px)`;
    }
    
    meshBlobs.forEach((blob, index) => {
        const speed = 0.08 + index * 0.03;
        blob.style.translate = `0 ${scrollY * speed}px`;
    });
    
    if (headerGlass) {
        headerGlass.style.boxShadow = scrollY > 20
            ? 'var(--glass-shadow-hover)'
            : '';
    }
}

function handleScroll() {
    if (!ticking) {
        requestAnimationFrame(() => {
            updateParallax();
            ticking = false;
        });
        ticking = true;
    }
}

// ============================================================
//  BACK TO TOP BUTTON
// ============================================================
const backToTop = document.getElementById('back-to-top');
if (backToTop) {
    let isVisible = false;
    
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        const shouldBeVisible = scrollY > 500;
        
        if (shouldBeVisible && !isVisible) {
            backToTop.classList.add('visible');
            isVisible = true;
        } else if (!shouldBeVisible && isVisible) {
            backToTop.classList.remove('visible');
            isVisible = false;
        }
    }, { passive: true });
    
    backToTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ============================================================
//  INIT COUNTERS
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
    // Age counter
    const ageDisplay = document.getElementById('age-display');
    if (ageDisplay) {
        const age = calculateAge();
        ageDisplay.textContent = age;
    }
    
    // Ticket counter with animation
    const ticketCounter = document.getElementById('ticket-counter');
    if (ticketCounter) {
        const tickets = calculateTickets();
        animateCounter(ticketCounter, tickets, 2500);
    }
    
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

// ============================================================
//  PARALLAX INIT — Wait for load to prevent jump
// ============================================================
window.addEventListener('load', () => {
    isPageLoaded = true;
    document.body.classList.add('loaded');
    updateParallax();
});

window.addEventListener('scroll', handleScroll, { passive: true });
window.addEventListener('resize', updateParallax, { passive: true });

// ============================================================
//  THEME TOGGLE
// ============================================================
const savedTheme = localStorage.getItem('theme');
const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');

if (savedTheme === 'dark' || (!savedTheme && prefersDarkScheme.matches)) {
    setDarkTheme();
} else {
    setLightTheme();
}

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

// ============================================================
//  MOBILE MENU
// ============================================================
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

// ============================================================
//  SMOOTH SCROLLING
// ============================================================
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

// ============================================================
//  INTERSECTION OBSERVER
// ============================================================
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

// ============================================================
//  RIPPLE EFFECT
// ============================================================
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

// ============================================================
//  PROFILE IMAGE
// ============================================================
if (profileImg) {
    profileImg.src = profileImg.src || 'img/Profile.png';
}
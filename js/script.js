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
        emailLink.addEventListener('click', function(e) {
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
    // Animate the transition
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
        
        // Animate hamburger to X
        const bars = mobileMenuBtn.querySelectorAll('.bar');
        if (mobileMenuBtn.classList.contains('active')) {
            bars[0].style.transform = 'rotate(45deg) translate(5px, 6px)';
            bars[1].style.opacity = '0';
            bars[2].style.transform = 'rotate(-45deg) translate(5px, -6px)';
            document.body.style.overflow = 'hidden'; // Prevent scrolling
        } else {
            bars[0].style.transform = 'rotate(0) translate(0)';
            bars[1].style.opacity = '1';
            bars[2].style.transform = 'rotate(0) translate(0)';
            document.body.style.overflow = ''; // Allow scrolling
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
        document.body.style.overflow = ''; // Allow scrolling
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
        // Animate page transition
        pageTransition.style.transform = 'translateY(0)';
        
        setTimeout(() => {
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'instant'
            });
            
            setTimeout(() => {
                pageTransition.style.transform = 'translateY(-100%)';
            }, 300);
        }, 300);
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

// Observe all section titles and cards
sectionTitles.forEach(title => {
    observer.observe(title);
});

cards.forEach(card => {
    observer.observe(card);
});

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

// Add ripple effect to all buttons
const buttons = document.querySelectorAll('.btn');
buttons.forEach(button => {
    button.addEventListener('click', createRipple);
});

// Placeholder for profile image
if (profileImg) {
    profileImg.src = profileImg.src || 'profile.jpg';
}

// Parallax effect for hero section
const heroSection = document.querySelector('.hero-section');
const heroContent = document.querySelector('.hero-content');
const blobs = document.querySelectorAll('.blob');

window.addEventListener('scroll', () => {
    if (heroSection) {
        const scrollPosition = window.scrollY;
        const heroHeight = heroSection.offsetHeight;
        const parallaxValue = scrollPosition * 0.4;
        
        if (scrollPosition <= heroHeight) {
            heroContent.style.transform = `translateY(${parallaxValue}px)`;
            
            blobs.forEach((blob, index) => {
                const speed = 0.2 + (index * 0.1);
                blob.style.transform = `translateY(${scrollPosition * speed}px)`;
            });
        }
    }
});

// Cursor effect (optional)
const cursor = document.createElement('div');
cursor.classList.add('custom-cursor');
document.body.appendChild(cursor);

const cursorStyle = document.createElement('style');
cursorStyle.textContent = `
    .custom-cursor {
        position: fixed;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background-color: rgba(var(--primary-rgb), 0.3);
        pointer-events: none;
        z-index: 9999;
        transform: translate(-50%, -50%);
        transition: width 0.3s, height 0.3s, background-color 0.3s;
        mix-blend-mode: difference;
        display: none;
    }
    
    @media (pointer: fine) {
        .custom-cursor {
            display: block;
        }
    }
    
    a:hover ~ .custom-cursor,
    button:hover ~ .custom-cursor {
        width: 50px;
        height: 50px;
        background-color: rgba(var(--primary-rgb), 0.1);
    }
`;
document.head.appendChild(cursorStyle);

// Only enable custom cursor on devices with fine pointer (mouse)
if (window.matchMedia('(pointer: fine)').matches) {
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = `${e.clientX}px`;
        cursor.style.top = `${e.clientY}px`;
    });
    
    document.addEventListener('mousedown', () => {
        cursor.style.transform = 'translate(-50%, -50%) scale(0.8)';
    });
    
    document.addEventListener('mouseup', () => {
        cursor.style.transform = 'translate(-50%, -50%) scale(1)';
    });
}

// Preload animations to prevent flash
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});

// Add loaded class to body
const loadedStyle = document.createElement('style');
loadedStyle.textContent = `
    body:not(.loaded) * {
        transition: none !important;
    }
`;
document.head.appendChild(loadedStyle);
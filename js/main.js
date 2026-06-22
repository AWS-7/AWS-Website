// Trial popup — show after 2 seconds on homepage load
document.addEventListener('DOMContentLoaded', function() {
    const popup = document.getElementById('trialPopup');
    const closeBtn = document.getElementById('closePopup');
    const laterBtn = document.getElementById('popupLaterBtn');
    const trialBtn = document.getElementById('popupTrialBtn');

    function hidePopup() {
        if (popup) {
            popup.classList.remove('active');
            popup.setAttribute('aria-hidden', 'true');
        }
    }

    function showPopup() {
        if (popup) {
            popup.classList.add('active');
            popup.setAttribute('aria-hidden', 'false');
        }
    }

    setTimeout(showPopup, 2000);

    if (closeBtn) closeBtn.addEventListener('click', hidePopup);
    if (laterBtn) laterBtn.addEventListener('click', hidePopup);
    if (trialBtn) trialBtn.addEventListener('click', hidePopup);

    if (popup) {
        popup.addEventListener('click', function(e) {
            if (e.target === popup) hidePopup();
        });
    }
});

// Initialize AOS (Animate On Scroll)
document.addEventListener('DOMContentLoaded', function() {
    // Initialize AOS
    AOS.init({
        duration: 800,
        easing: 'ease-in-out',
        once: true
    });

    // Initialize Swiper for testimonials
    const testimonialSwiper = document.querySelector('.testimonials-swiper');
    if (testimonialSwiper) {
        const counterEl = document.querySelector('.testimonials-current');
        const swiper = new Swiper('.testimonials-swiper', {
            slidesPerView: 1,
            spaceBetween: 20,
            autoHeight: true,
            loop: true,
            autoplay: {
                delay: 5000,
                disableOnInteraction: false,
            },
            pagination: {
                el: '.testimonials-pagination',
                clickable: true,
            },
            navigation: {
                nextEl: '.testimonials-next',
                prevEl: '.testimonials-prev',
            },
            on: {
                init(s) {
                    if (counterEl) counterEl.textContent = String(s.realIndex + 1);
                },
                slideChange(s) {
                    if (counterEl) counterEl.textContent = String(s.realIndex + 1);
                },
            },
        });
    }

    // Hero 3D card carousel
    const heroCarousel = document.querySelector('.hero-carousel');
    if (heroCarousel) {
        new Swiper('.hero-carousel', {
            effect: 'coverflow',
            grabCursor: true,
            centeredSlides: true,
            slidesPerView: 'auto',
            loop: true,
            autoplay: {
                delay: 4500,
                disableOnInteraction: false,
            },
            speed: 900,
            coverflowEffect: {
                rotate: 0,
                stretch: 0,
                depth: 90,
                modifier: 1,
                slideShadows: false,
            },
            pagination: {
                el: '.hero-carousel-pagination',
                clickable: true,
            },
            navigation: {
                nextEl: '.hero-carousel-next',
                prevEl: '.hero-carousel-prev',
            },
            breakpoints: {
                768: {
                    coverflowEffect: {
                        rotate: 14,
                        stretch: -8,
                        depth: 160,
                        modifier: 1.15,
                        slideShadows: false,
                    },
                },
                992: {
                    coverflowEffect: {
                        rotate: 10,
                        stretch: -2,
                        depth: 100,
                        modifier: 1,
                        slideShadows: false,
                    },
                },
                1200: {
                    coverflowEffect: {
                        rotate: 14,
                        stretch: -4,
                        depth: 130,
                        modifier: 1.05,
                        slideShadows: false,
                    },
                },
            },
        });
    }
});

// Feature icon animation
document.querySelectorAll('.feature-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        const icon = this.querySelector('.feature-icon i');
        icon.classList.add('fa-beat');
    });
    
    card.addEventListener('mouseleave', function() {
        const icon = this.querySelector('.feature-icon i');
        icon.classList.remove('fa-beat');
    });
});

// How It Works section interaction
document.addEventListener('DOMContentLoaded', function() {
    const stepItems = document.querySelectorAll('.step-item');
    
    stepItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            const number = this.querySelector('.step-number');
            number.style.transform = 'scale(1.1) rotate(5deg)';
        });
        
        item.addEventListener('mouseleave', function() {
            const number = this.querySelector('.step-number');
            number.style.transform = 'scale(1)';
        });
        
        // For touch devices
        item.addEventListener('touchstart', function() {
            const number = this.querySelector('.step-number');
            number.style.transform = 'scale(1.1) rotate(5deg)';
            setTimeout(() => {
                number.style.transform = 'scale(1)';
            }, 300);
        });
    });
});

// Initialize particles.js for hero section
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('particles-js')) {
        particlesJS('particles-js', {
            particles: {
                number: {
                    value: 80,
                    density: {
                        enable: true,
                        value_area: 800
                    }
                },
                color: {
                    value: ["#7928ca", "#ff0080", "#00c6ff"]
                },
                shape: {
                    type: "circle"
                },
                opacity: {
                    value: 0.5,
                    random: true
                },
                size: {
                    value: 3,
                    random: true
                },
                line_linked: {
                    enable: true,
                    distance: 150,
                    color: "#ffffff",
                    opacity: 0.1,
                    width: 1
                },
                move: {
                    enable: true,
                    speed: 2,
                    direction: "none",
                    random: true,
                    out_mode: "out"
                }
            },
            interactivity: {
                detect_on: "canvas",
                events: {
                    onhover: {
                        enable: true,
                        mode: "grab"
                    },
                    onclick: {
                        enable: true,
                        mode: "push"
                    },
                    resize: true
                }
            },
            retina_detect: true
        });
    }
});

// Mobile navigation drawer
document.addEventListener('DOMContentLoaded', function() {
    const toggle = document.getElementById('mobileNavToggle');
    const closeBtn = document.getElementById('mobileNavClose');
    const drawer = document.getElementById('mobileNavDrawer');
    const overlay = document.getElementById('mobileNavOverlay');
    const mobileLinks = document.querySelectorAll('.mobile-nav-link, .mobile-nav-cta, .mobile-nav-brand');

    function openMobileNav() {
        if (!drawer || !overlay || !toggle) return;
        drawer.classList.add('active');
        overlay.classList.add('active');
        toggle.classList.add('active');
        toggle.setAttribute('aria-expanded', 'true');
        drawer.setAttribute('aria-hidden', 'false');
        overlay.setAttribute('aria-hidden', 'false');
        document.body.classList.add('mobile-nav-open');
    }

    function closeMobileNav() {
        if (!drawer || !overlay || !toggle) return;
        drawer.classList.remove('active');
        overlay.classList.remove('active');
        toggle.classList.remove('active');
        toggle.setAttribute('aria-expanded', 'false');
        drawer.setAttribute('aria-hidden', 'true');
        overlay.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('mobile-nav-open');
    }

    if (toggle) {
        toggle.addEventListener('click', function() {
            drawer.classList.contains('active') ? closeMobileNav() : openMobileNav();
        });
    }

    if (closeBtn) closeBtn.addEventListener('click', closeMobileNav);
    if (overlay) overlay.addEventListener('click', closeMobileNav);

    mobileLinks.forEach(link => {
        link.addEventListener('click', closeMobileNav);
    });

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && drawer && drawer.classList.contains('active')) {
            closeMobileNav();
        }
    });

    window.addEventListener('resize', function() {
        if (window.innerWidth >= 992) closeMobileNav();
    });
});

// Navbar scroll effect
window.addEventListener('scroll', function() {
    const header = document.querySelector('.site-header');
    if (header && window.scrollY > 50) {
        header.classList.add('scrolled');
    } else if (header) {
        header.classList.remove('scrolled');
    }
});

// Close mobile menu when clicking desktop nav links (legacy safety)
document.querySelectorAll('.desktop-nav-list a').forEach(link => {
    link.addEventListener('click', () => {
        const drawer = document.getElementById('mobileNavDrawer');
        if (drawer && drawer.classList.contains('active')) {
            drawer.classList.remove('active');
            document.getElementById('mobileNavOverlay')?.classList.remove('active');
            document.getElementById('mobileNavToggle')?.classList.remove('active');
            document.body.classList.remove('mobile-nav-open');
        }
    });
});
// Prevent horizontal overflow on testimonials section (mobile)
document.addEventListener('DOMContentLoaded', function() {
    const testimonials = document.getElementById('testimonials');

    function handleResize() {
        if (window.innerWidth < 768 && testimonials) {
            testimonials.style.overflowX = 'hidden';
        } else if (testimonials) {
            testimonials.style.overflowX = '';
        }
    }

    handleResize();
    window.addEventListener('resize', handleResize);
});

// Contact form → Formspree
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) return;

    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        const form = e.target;
        const formData = new FormData(form);
        const submitBtn = form.querySelector('button[type="submit"]');
        const endpoint = (typeof SITE_CONFIG !== 'undefined' && SITE_CONFIG.formspree) || form.action;

        const email = formData.get('email');
        const replyToField = document.getElementById('contactReplyTo');
        if (replyToField && email) replyToField.value = email;

        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.dataset.originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = 'Sending...';
        }

        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                body: formData,
                headers: { Accept: 'application/json' }
            });

            const data = await response.json().catch(() => ({}));

            if (response.ok) {
                const name = formData.get('name') || 'there';

                if (typeof awsAddLead === 'function') {
                    awsAddLead({
                        name: formData.get('name'),
                        email: formData.get('email'),
                        phone: formData.get('phone'),
                        message: formData.get('message')
                    });
                }

                Swal.fire({
                    title: `Thank you, ${name}!`,
                    text: 'Message sent to Formspree! Opening WhatsApp to confirm...',
                    icon: 'success',
                    confirmButtonText: 'OK',
                    confirmButtonColor: '#7928ca'
                });

                if (typeof openWhatsAppMessage === 'function') {
                    setTimeout(() => {
                        openWhatsAppMessage(buildContactWhatsAppMessage({
                            name: formData.get('name'),
                            phone: formData.get('phone'),
                            email: formData.get('email'),
                            message: formData.get('message')
                        }));
                    }, 800);
                }

                form.reset();
            } else {
                throw new Error(data.error || 'Form submission failed');
            }
        } catch (error) {
            console.error('Contact form error:', error);
            Swal.fire({
                title: 'Error!',
                text: 'Could not send message. Please try again or WhatsApp us.',
                icon: 'error',
                confirmButtonText: 'OK',
                confirmButtonColor: '#7928ca'
            });
        } finally {
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.innerHTML = submitBtn.dataset.originalText || 'Send Message';
            }
        }
    });
});

// Pause animation on hover
const movingContainer = document.querySelector('.moving-container');
if (movingContainer) {
  movingContainer.addEventListener('mouseenter', () => {
    movingContainer.style.animationPlayState = 'paused';
  });
  
  movingContainer.addEventListener('mouseleave', () => {
    movingContainer.style.animationPlayState = 'running';
  });
}
// Add secret Konami code functionality
const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
let konamiIndex = 0;

document.addEventListener('keydown', (e) => {
    if (e.key === konamiCode[konamiIndex]) {
        konamiIndex++;
        if (konamiIndex === konamiCode.length) {
            // Trigger fun effect
            document.body.style.transform = 'rotate(180deg)';
            document.body.style.transition = 'transform 2s';
            setTimeout(() => {
                document.body.style.transform = '';
            }, 2000);
            konamiIndex = 0;
        }
    } else {
        konamiIndex = 0;
    }
});

// Smooth scroll with null check
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

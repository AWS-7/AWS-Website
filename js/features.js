document.addEventListener('DOMContentLoaded', function() {
    initStatCounters();
    initBackToTop();
    initStickyMobileCta();
    initFaqAccordion();
    initLazyImages();
    initPosTrialForm();
    initNewsletterForm();
    initPwa();
    initTawkChat();
    initNotificationOptIn();
});

function initStatCounters() {
    const counters = document.querySelectorAll('.stat-counter');
    if (!counters.length) return;

    const animate = (el) => {
        const target = parseInt(el.dataset.target, 10);
        const suffix = el.dataset.suffix || '';
        const duration = 1800;
        const start = performance.now();

        const step = (now) => {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            el.textContent = Math.floor(target * eased) + suffix;
            if (progress < 1) requestAnimationFrame(step);
            else el.textContent = target + suffix;
        };
        requestAnimationFrame(step);
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animate(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    counters.forEach(c => observer.observe(c));
}

function initBackToTop() {
    const btn = document.getElementById('backToTop');
    if (!btn) return;

    window.addEventListener('scroll', () => {
        btn.classList.toggle('visible', window.scrollY > 400);
    }, { passive: true });

    btn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

function initStickyMobileCta() {
    const bar = document.getElementById('stickyMobileCta');
    if (!bar) return;

    const cfg = typeof SITE_CONFIG !== 'undefined' ? SITE_CONFIG : {};
    const phone = cfg.phone || '+919080700642';
    const wa = cfg.whatsapp || '919080700642';

    bar.querySelector('[data-sticky-call]')?.setAttribute('href', 'tel:' + phone);
    bar.querySelector('[data-sticky-wa]')?.setAttribute('href', 'https://wa.me/' + wa + '?text=Hi%20AWS-Agni%2C%20I%20need%20help%20with%20');

    window.addEventListener('scroll', () => {
        bar.classList.toggle('visible', window.scrollY > 500);
    }, { passive: true });
}

function initFaqAccordion() {
    document.querySelectorAll('.faq-question').forEach(btn => {
        btn.addEventListener('click', () => {
            const item = btn.closest('.faq-item');
            const open = item.classList.contains('open');
            document.querySelectorAll('.faq-item.open').forEach(i => i.classList.remove('open'));
            if (!open) item.classList.add('open');
        });
    });
}

function initLazyImages() {
    document.querySelectorAll('img[loading="lazy"]').forEach(img => {
        const wrap = img.closest('.img-skeleton-wrap');
        if (!wrap) return;

        const done = () => wrap.classList.add('loaded');
        if (img.complete) done();
        else {
            img.addEventListener('load', done);
            img.addEventListener('error', done);
        }
    });
}

function initPosTrialForm() {
    const form = document.getElementById('posTrialForm');
    if (!form) return;

    const endpoint = (typeof SITE_CONFIG !== 'undefined' && SITE_CONFIG.formspree) || form.action;

    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        const fd = new FormData(form);
        const submitBtn = form.querySelector('button[type="submit"]');

        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.dataset.originalText = submitBtn.textContent;
            submitBtn.textContent = 'Sending...';
        }

        try {
            const res = await fetch(endpoint, {
                method: 'POST',
                body: fd,
                headers: { Accept: 'application/json' }
            });

            const data = await res.json().catch(() => ({}));

            if (res.ok) {
                if (typeof awsAddPosTrial === 'function') {
                    awsAddPosTrial({
                        name: fd.get('name'),
                        restaurant: fd.get('restaurant'),
                        phone: fd.get('phone')
                    });
                }
                if (typeof Swal !== 'undefined') {
                    Swal.fire({
                        title: 'Trial Request Sent!',
                        text: 'Submitted to Formspree! Opening WhatsApp to confirm...',
                        icon: 'success',
                        confirmButtonColor: '#7928ca'
                    });
                }
                if (typeof openWhatsAppMessage === 'function') {
                    setTimeout(() => {
                        openWhatsAppMessage(buildPosTrialWhatsAppMessage({
                            name: fd.get('name'),
                            restaurant: fd.get('restaurant'),
                            phone: fd.get('phone')
                        }));
                    }, 800);
                }
                form.reset();
            } else {
                throw new Error(data.error || 'fail');
            }
        } catch (err) {
            console.error('POS trial form error:', err);
            if (typeof Swal !== 'undefined') {
                Swal.fire({ title: 'Error', text: 'Please try again or WhatsApp us.', icon: 'error', confirmButtonColor: '#7928ca' });
            }
        } finally {
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.textContent = submitBtn.dataset.originalText || 'Request Free Trial';
            }
        }
    });
}

function initNewsletterForm() {
    const form = document.getElementById('newsletterForm');
    if (!form) return;

    const endpoint = (typeof SITE_CONFIG !== 'undefined' && SITE_CONFIG.formspree) || 'https://formspree.io/f/xanokzkq';

    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        const email = document.getElementById('newsletterEmail').value.trim();
        const fd = new FormData(form);

        try {
            const res = await fetch(endpoint, {
                method: 'POST',
                body: fd,
                headers: { Accept: 'application/json' }
            });
            if (res.ok) {
                if (typeof awsAddNewsletter === 'function') awsAddNewsletter(email);
                if (typeof Swal !== 'undefined') {
                    Swal.fire({ title: 'Subscribed!', text: 'Thank you for joining our newsletter.', icon: 'success', confirmButtonColor: '#7928ca' });
                }
                form.reset();
            } else throw new Error('fail');
        } catch {
            if (typeof Swal !== 'undefined') {
                Swal.fire({ title: 'Error', text: 'Please try again later.', icon: 'error', confirmButtonColor: '#7928ca' });
            }
        }
    });
}

function initPwa() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js').catch(() => {});
    }
}

function initTawkChat() {
    if (typeof SITE_CONFIG === 'undefined' || !SITE_CONFIG.tawkPropertyId) return;

    const s = document.createElement('script');
    s.async = true;
    s.src = `https://embed.tawk.to/${SITE_CONFIG.tawkPropertyId}/${SITE_CONFIG.tawkWidgetId}`;
    s.charset = 'UTF-8';
    s.setAttribute('crossorigin', '*');
    document.body.appendChild(s);
}

function initNotificationOptIn() {
    const btn = document.getElementById('enableNotifications');
    if (!btn || typeof requestNotifications !== 'function') return;

    btn.addEventListener('click', async () => {
        try {
            await requestNotifications();
            btn.textContent = 'Notifications Enabled';
            btn.disabled = true;
        } catch {
            btn.textContent = 'Enable in Browser Settings';
        }
    });
}

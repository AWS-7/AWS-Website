function getServiceSlug() {
    var params = new URLSearchParams(window.location.search);
    var fromQuery = params.get('service');
    if (fromQuery) return fromQuery;

    var hash = window.location.hash.replace(/^#/, '').trim();
    if (hash) return hash;

    return null;
}

document.addEventListener('DOMContentLoaded', function() {
    var slug = getServiceSlug();
    var service = slug && typeof SERVICES_DATA !== 'undefined' ? SERVICES_DATA[slug] : null;

    var heroIcon = document.getElementById('serviceHeroIcon');
    var heroTitle = document.getElementById('serviceHeroTitle');
    var heroTagline = document.getElementById('serviceHeroTagline');
    var heroIntro = document.getElementById('serviceHeroIntro');
    var featuresList = document.getElementById('serviceFeaturesList');
    var processGrid = document.getElementById('serviceProcessGrid');
    var ctaBtn = document.getElementById('serviceCtaBtn');

    if (!service) {
        if (heroTitle) heroTitle.textContent = 'Service Not Found';
        if (heroTagline) heroTagline.textContent = '';
        if (heroIntro) heroIntro.textContent = 'Please go back and select a service from our services section.';
        return;
    }

    document.title = service.title + ' | AWS-Agni Web Solution';

    if (heroIcon) heroIcon.innerHTML = '<i class="fas ' + service.icon + '"></i>';
    if (heroTitle) heroTitle.textContent = service.title;
    if (heroTagline) heroTagline.textContent = service.tagline;
    if (heroIntro) heroIntro.textContent = service.intro;
    if (ctaBtn) {
        ctaBtn.textContent = service.cta;
        ctaBtn.href = 'index.html#contact-form';
    }

    if (featuresList) {
        featuresList.innerHTML = service.features.map(function(f) {
            return '<li><i class="fas fa-check-circle"></i> ' + f + '</li>';
        }).join('');
    }

    if (processGrid) {
        processGrid.innerHTML = service.process.map(function(p) {
            return '<div class="process-card">' +
                '<span class="process-step">' + p.step + '</span>' +
                '<h4>' + p.title + '</h4>' +
                '<p>' + p.desc + '</p>' +
            '</div>';
        }).join('');
    }
});

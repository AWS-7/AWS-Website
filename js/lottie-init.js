const LOTTIE_ANIMS = {
    hero: 'https://assets10.lottiefiles.com/packages/lf20_xlkxfdek.json',
    web: 'https://assets9.lottiefiles.com/packages/lf20_4kx2q32n.json',
    poster: 'https://assets3.lottiefiles.com/packages/lf20_bhwgpivv.json',
    logo: 'https://assets4.lottiefiles.com/packages/lf20_vybwn7df.json',
    marketing: 'https://assets3.lottiefiles.com/packages/lf20_u25cckyh.json',
    pos: 'https://assets9.lottiefiles.com/packages/lf20_myejiggj.json',
    support: 'https://assets2.lottiefiles.com/packages/lf20_abmws9xb.json'
};

document.addEventListener('DOMContentLoaded', function() {
    if (typeof lottie === 'undefined') return;

    const heroEl = document.getElementById('heroLottie');
    if (heroEl) loadLottie(heroEl, LOTTIE_ANIMS.hero, 220);

    document.querySelectorAll('[data-lottie]').forEach(el => {
        const key = el.dataset.lottie;
        if (LOTTIE_ANIMS[key]) loadLottie(el, LOTTIE_ANIMS[key], 72);
    });
});

function loadLottie(container, path, size) {
    container.style.width = size + 'px';
    container.style.height = size + 'px';

    const anim = lottie.loadAnimation({
        container,
        renderer: 'svg',
        loop: true,
        autoplay: true,
        path
    });

    anim.addEventListener('data_failed', () => {
        container.innerHTML = '<i class="fas fa-star lottie-fallback-icon"></i>';
    });
}

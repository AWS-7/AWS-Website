document.addEventListener('DOMContentLoaded', function() {
    if (typeof PROJECTS === 'undefined') return;

    const desktopGrid = document.getElementById('projectsGridDesktop');
    const mobileScroll = document.getElementById('projectsMobileScroll');

    if (desktopGrid) {
        desktopGrid.innerHTML = PROJECTS.map(function(project, index) {
            return `
                <div class="col-lg-4" data-aos="fade-up" data-aos-delay="${100 + index * 50}">
                    ${renderProjectCard(project)}
                </div>
            `;
        }).join('');
    }

    if (mobileScroll) {
        const cards = PROJECTS.map(function(project) {
            return renderProjectCard(project, { scroll: true });
        }).join('');

        mobileScroll.innerHTML = `
            <div class="projects-scroll-row">
                <div class="projects-scroll-track">
                    ${cards}
                    ${cards}
                </div>
            </div>
        `;
    }

    if (typeof AOS !== 'undefined') {
        AOS.refresh();
    }
});

document.addEventListener('DOMContentLoaded', function() {
    const grid = document.getElementById('projectsPageGrid');
    if (!grid || typeof PROJECTS === 'undefined') return;

    grid.innerHTML = PROJECTS.map(function(project) {
        return `
            <div class="col-sm-6 col-lg-4">
                ${renderProjectCard(project)}
            </div>
        `;
    }).join('');
});

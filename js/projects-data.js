const PROJECTS = [
    {
        url: 'https://www.femmeflexladiesgym.com',
        title: 'Femme Flex Ladies Gym & Fitness',
        domain: 'femmeflexladiesgym.com',
        tag: 'Fitness',
        image: 'https://image.thum.io/get/width/600/crop/400/noanimate/https://www.femmeflexladiesgym.com',
        fallback: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?auto=format&fit=crop&w=600&q=80',
        alt: 'Femme Flex Ladies Gym & Fitness'
    },
    {
        url: 'https://www.lumbinilawassociates.in',
        title: 'Lumbini Law Associates',
        domain: 'lumbinilawassociates.in',
        tag: 'Legal',
        image: 'https://image.thum.io/get/width/600/crop/400/noanimate/https://www.lumbinilawassociates.in',
        fallback: 'https://images.unsplash.com/photo-1589829545855-d5edc945909a?auto=format&fit=crop&w=600&q=80',
        alt: 'Lumbini Law Associates'
    },
    {
        url: 'https://cult-fitness-hub-tamil-nadu.vercel.app/',
        title: 'Cult Fitness Hub',
        domain: 'cult-fitness-hub-tamil-nadu.vercel.app',
        tag: 'Fitness',
        image: 'https://image.thum.io/get/width/600/crop/400/noanimate/https://cult-fitness-hub-tamil-nadu.vercel.app/',
        fallback: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=600&q=80',
        alt: 'Cult Fitness Hub'
    },
    {
        url: 'https://www.vselectrical.in',
        title: 'VS Electrical',
        domain: 'vselectrical.in',
        tag: 'Electrical',
        image: 'https://image.thum.io/get/width/600/crop/400/noanimate/https://www.vselectrical.in',
        fallback: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=600&q=80',
        alt: 'VS Electrical'
    },
    {
        url: 'https://www.lenapromoterspvtltd.com',
        title: 'Lena Promoters Pvt Ltd',
        domain: 'lenapromoterspvtltd.com',
        tag: 'Real Estate',
        image: 'https://image.thum.io/get/width/600/crop/400/noanimate/https://www.lenapromoterspvtltd.com',
        fallback: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=600&q=80',
        alt: 'Lena Promoters Pvt Ltd'
    },
    {
        url: 'https://www.djphotographykaraikudi.com',
        title: 'DJ Photography',
        domain: 'djphotographykaraikudi.com',
        tag: 'Photography',
        image: 'https://image.thum.io/get/width/600/crop/400/noanimate/https://www.djphotographykaraikudi.com',
        fallback: 'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?auto=format&fit=crop&w=600&q=80',
        alt: 'DJ Photography'
    },
    {
        url: 'https://ironempirefitness.in',
        title: 'Iron Empire Fitness Gym',
        domain: 'ironempirefitness.in',
        tag: 'Fitness',
        image: 'https://image.thum.io/get/width/600/crop/400/noanimate/https://ironempirefitness.in',
        fallback: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=600&q=80',
        alt: 'Iron Empire Fitness Gym'
    },
    {
        url: 'https://www.blessingstoursandtravels.in',
        title: 'Blessings Tours and Travels',
        domain: 'blessingstoursandtravels.in',
        tag: 'Travel',
        image: 'https://image.thum.io/get/width/600/crop/400/noanimate/https://www.blessingstoursandtravels.in',
        fallback: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=600&q=80',
        alt: 'Blessings Tours and Travels'
    }
];

function renderProjectCard(project, options = {}) {
    const scrollClass = options.scroll ? ' project-card-link--scroll' : '';
    const skeletonClass = project.url.includes('femmeflex') ? ' img-skeleton-wrap' : '';

    return `
        <a href="${project.url}" target="_blank" rel="noopener noreferrer" class="project-card-link${scrollClass}">
            <div class="project-card">
                <div class="project-image${skeletonClass}">
                    <img src="${project.image}" alt="${project.alt}" loading="lazy" onerror="this.src='${project.fallback}'">
                    <span class="project-visit"><i class="fas fa-external-link-alt"></i> Visit Site</span>
                </div>
                <div class="project-body">
                    <span class="project-tag">${project.tag}</span>
                    <h4>${project.title}</h4>
                    <p>${project.domain}</p>
                </div>
            </div>
        </a>
    `;
}

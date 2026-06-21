document.addEventListener('DOMContentLoaded', function() {
    const params = new URLSearchParams(window.location.search);
    const slug = params.get('post') || (window.location.hash ? window.location.hash.slice(1) : '');
    const listEl = document.getElementById('blogList');
    const detailEl = document.getElementById('blogDetail');

    if (slug && typeof BLOG_POSTS !== 'undefined') {
        const post = BLOG_POSTS.find(p => p.slug === slug);
        if (post && detailEl) {
            document.title = post.title + ' | AWS-Agni Blog';
            detailEl.innerHTML = `
                <a href="blog.html" class="service-back-link"><i class="fas fa-arrow-left"></i> All Articles</a>
                <div class="blog-card-meta"><span>${post.category}</span><span>${post.date}</span><span>${post.readTime}</span></div>
                <h1>${post.title}</h1>
                <div class="utility-content blog-article-body">${post.content}</div>
            `;
            if (listEl) listEl.style.display = 'none';
            detailEl.style.display = 'block';
            return;
        }
    }

    if (listEl && typeof BLOG_POSTS !== 'undefined') {
        listEl.innerHTML = BLOG_POSTS.map(p => `
            <div class="col-md-6 col-lg-4">
                <article class="blog-card h-100">
                    <div class="blog-card-meta"><span>${p.category}</span><span>${p.readTime}</span></div>
                    <h3>${p.title}</h3>
                    <p>${p.excerpt}</p>
                    <a href="blog.html?post=${p.slug}" class="blog-card-link">Read More <i class="fas fa-arrow-right"></i></a>
                </article>
            </div>
        `).join('');
    }
});

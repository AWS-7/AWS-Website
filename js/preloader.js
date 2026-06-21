(function() {
    function hidePreloader() {
        var loader = document.getElementById('awsPreloader');
        if (!loader) return;
        loader.classList.add('preloader-done');
        setTimeout(function() {
            loader.style.display = 'none';
        }, 500);
    }

    function initPreloader() {
        var loader = document.getElementById('awsPreloader');
        if (!loader) return;

        var progressBar = loader.querySelector('.preloader-progress-bar');
        var statusText = loader.querySelector('.preloader-status');
        var progress = 0;
        var interval = setInterval(function() {
            progress += Math.random() * 18 + 8;
            if (progress >= 100) {
                progress = 100;
                clearInterval(interval);
                if (progressBar) progressBar.style.width = '100%';
                if (statusText) statusText.textContent = 'Welcome!';
                setTimeout(hidePreloader, 400);
            } else {
                if (progressBar) progressBar.style.width = progress + '%';
            }
        }, 120);

        window.addEventListener('load', function() {
            clearInterval(interval);
            if (progressBar) progressBar.style.width = '100%';
            if (statusText) statusText.textContent = 'Welcome!';
            setTimeout(hidePreloader, 350);
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initPreloader);
    } else {
        initPreloader();
    }
})();

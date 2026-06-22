(function () {
    var STATUS_STEPS = [
        { at: 0, text: 'Loading experience' },
        { at: 35, text: 'Preparing assets' },
        { at: 65, text: 'Almost ready' },
        { at: 90, text: 'Welcome' },
    ];

    function hidePreloader() {
        var loader = document.getElementById('awsPreloader');
        if (!loader) return;
        loader.classList.add('preloader-done');
        loader.setAttribute('aria-busy', 'false');
        setTimeout(function () {
            loader.style.display = 'none';
        }, 550);
    }

    function setProgress(loader, value) {
        var progressBar = loader.querySelector('.preloader-progress-bar');
        var statusText = loader.querySelector('.preloader-status');
        var percentText = loader.querySelector('.preloader-percent');
        var clamped = Math.min(100, Math.max(0, Math.round(value)));

        if (progressBar) progressBar.style.width = clamped + '%';
        if (percentText) percentText.textContent = clamped + '%';

        if (statusText) {
            var label = STATUS_STEPS[0].text;
            for (var i = STATUS_STEPS.length - 1; i >= 0; i--) {
                if (clamped >= STATUS_STEPS[i].at) {
                    label = STATUS_STEPS[i].text;
                    break;
                }
            }
            statusText.textContent = label;
        }
    }

    function initPreloader() {
        var loader = document.getElementById('awsPreloader');
        if (!loader) return;

        var progress = 0;
        var finished = false;

        function finish() {
            if (finished) return;
            finished = true;
            setProgress(loader, 100);
            setTimeout(hidePreloader, 380);
        }

        var interval = setInterval(function () {
            if (finished) {
                clearInterval(interval);
                return;
            }
            progress += Math.random() * 14 + 6;
            if (progress >= 92) {
                progress = 92;
                clearInterval(interval);
            }
            setProgress(loader, progress);
        }, 110);

        window.addEventListener('load', function () {
            clearInterval(interval);
            finish();
        });

        setTimeout(function () {
            clearInterval(interval);
            finish();
        }, 4500);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initPreloader);
    } else {
        initPreloader();
    }
})();

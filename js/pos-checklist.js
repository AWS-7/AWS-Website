import html2pdf from 'html2pdf.js';

const doc = document.getElementById('checklistDoc');
const statusEl = document.getElementById('clStatus');

function setStatus(msg, type = '') {
    statusEl.textContent = msg;
    statusEl.className = 'cl-status' + (type ? ` is-${type}` : '');
}

async function downloadPdf() {
    if (!doc) return;
    setStatus('Generating PDF…');

    try {
        await html2pdf().set({
            margin: [10, 10, 10, 10],
            filename: 'AWS-Billing-POS-Onboarding-Checklist.pdf',
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2, useCORS: true, scrollY: 0 },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
            pagebreak: { mode: ['avoid-all', 'css', 'legacy'] },
        }).from(doc).save();
        setStatus('PDF downloaded successfully.', 'success');
    } catch (err) {
        console.error(err);
        setStatus('PDF download failed. Use Print instead.', 'error');
    }
}

function printChecklist() {
    window.print();
}

document.getElementById('btnDownloadPdf').addEventListener('click', downloadPdf);
document.getElementById('btnPrint').addEventListener('click', printChecklist);

if (new URLSearchParams(location.search).has('print')) {
    window.addEventListener('load', () => setTimeout(printChecklist, 400));
}

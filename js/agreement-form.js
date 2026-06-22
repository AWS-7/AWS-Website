/**
 * AWS-Agni Billing Software — Client Agreement PDF Generator
 */

import html2pdf from 'html2pdf.js';

const COMPANY = {
    name: 'AWS-Agni Web Solution',
    product: 'AWS-Agni Billing Software',
    email: 'agniwebtech@gmail.com',
    phone: '+91 9080700642',
    website: 'www.awsagni.com',
    address: 'Kamuthi, Ramanathapuram, Tamil Nadu — 623603',
};

const PAYMENT_OPTIONS = ['Cash', 'UPI', 'Bank Transfer', 'Cheque', 'Card / Online'];

const form = document.getElementById('agreementForm');
const previewEl = document.getElementById('agreementPreview');
const previewPanel = document.getElementById('previewPanel');
const previewBackdrop = document.getElementById('previewBackdrop');
const statusEl = document.getElementById('formStatus');

function generateAgreementId() {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const rand = String(Math.floor(1000 + Math.random() * 9000));
    return `AWS-AGR-${y}${m}${day}-${rand}`;
}

function formatAgreementDate(date = new Date()) {
    return date.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
    });
}

function formatDisplayDate(isoDate) {
    if (!isoDate) return '—';
    const d = new Date(isoDate + 'T00:00:00');
    if (Number.isNaN(d.getTime())) return isoDate;
    return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' });
}

function escapeHtml(str) {
    return String(str ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

function val(id) {
    const el = document.getElementById(id);
    return el ? el.value.trim() : '';
}

function checkedPaymentMethods() {
    return [...form.querySelectorAll('input[name="paymentMethod"]:checked')].map((el) => el.value);
}

function selectedPlan() {
    const el = form.querySelector('input[name="planSelected"]:checked');
    return el ? el.value : '';
}

function checkboxHtml(label, checked) {
    return `<span class="agr-cb"><span class="agr-cb-box${checked ? ' is-checked' : ''}">${checked ? '✓' : ''}</span>${escapeHtml(label)}</span>`;
}

function paymentMethodsHtml(selected) {
    return `<div class="agr-checkbox-row">${PAYMENT_OPTIONS.map((opt) => checkboxHtml(opt, selected.includes(opt))).join('')}</div>`;
}

function pageHeader(data) {
    return `
        <div class="agr-page-header">
            <div>
                <div class="agr-page-brand-name">AWS-Agni</div>
                <div class="agr-page-brand-sub">Web Solution</div>
            </div>
            <div class="agr-page-meta">
                <strong>Agreement ID:</strong> ${escapeHtml(data.agreementId)}<br>
                <strong>Date:</strong> ${escapeHtml(data.agreementDate)}
            </div>
        </div>`;
}

function pageFooter(pageNum, totalPages) {
    return `
        <div class="agr-page-footer">
            <span>${escapeHtml(COMPANY.website)} | ${escapeHtml(COMPANY.email)} | ${escapeHtml(COMPANY.phone)}</span>
            <span class="agr-page-num">Page ${pageNum} of ${totalPages}</span>
        </div>`;
}

function buildAgreementHtml(data) {
    const totalPages = 3;

    const page1 = `
        <section class="agr-page">
            ${pageHeader(data)}
            <div class="agr-page-content">
                <div class="agr-doc-title">
                    <h1>AWS-Agni Billing Software<br>Service Agreement &amp; Terms</h1>
                    <p>Official client agreement for software activation, usage rights, and service terms</p>
                </div>
                <h2 class="agr-section-title">1. Client Details</h2>
                <table class="agr-details-table">
                    <tr><td>Hotel / Business Name</td><td>${escapeHtml(data.hotelName)}</td></tr>
                    <tr><td>Owner Name</td><td>${escapeHtml(data.ownerName)}</td></tr>
                    <tr><td>Contact Number</td><td>${escapeHtml(data.contactNumber)}</td></tr>
                    <tr><td>Email Address</td><td>${escapeHtml(data.email)}</td></tr>
                    <tr><td>Full Address</td><td>${escapeHtml(data.fullAddress)}</td></tr>
                    <tr><td>GST Number</td><td>${escapeHtml(data.gstNumber || 'Not provided')}</td></tr>
                    <tr><td>Software Activation Date</td><td>${escapeHtml(data.activationDateDisplay)}</td></tr>
                    <tr><td>Plan Selected</td><td>${checkboxHtml('Monthly', data.planSelected === 'Monthly')} ${checkboxHtml('Yearly', data.planSelected === 'Yearly')}</td></tr>
                    <tr><td>Subscription Amount</td><td>₹ ${escapeHtml(data.subscriptionAmount)} (${escapeHtml(data.planSelected)} Plan)</td></tr>
                    <tr><td>Number of Users</td><td>${escapeHtml(data.numberOfUsers)}</td></tr>
                    <tr><td>Payment Method</td><td>${paymentMethodsHtml(data.paymentMethods)}</td></tr>
                </table>
                <h2 class="agr-section-title">2. Service Description</h2>
                <p class="agr-body-text">${escapeHtml(COMPANY.product)} provides digital billing, invoice management, reports, customer management, and business automation solutions designed for hotels, restaurants, and retail businesses.</p>
                <p class="agr-body-text">This agreement governs the relationship between <strong>${escapeHtml(COMPANY.name)}</strong> (Service Provider) and the client named above for the provision and use of the billing software platform.</p>
            </div>
            ${pageFooter(1, totalPages)}
        </section>`;

    const page2 = `
        <section class="agr-page">
            ${pageHeader(data)}
            <div class="agr-page-content">
                <h2 class="agr-section-title">3. Terms &amp; Conditions</h2>
                <p class="agr-subsection">Software Usage</p>
                <ul class="agr-list">
                    <li>Software access is provided only for the registered business.</li>
                    <li>Client should not share login credentials with unauthorized persons.</li>
                    <li>Client is responsible for maintaining account security.</li>
                </ul>
                <p class="agr-subsection">Payment Terms</p>
                <ul class="agr-list">
                    <li>Subscription fees must be paid according to selected plan (${escapeHtml(data.planSelected)} — ₹ ${escapeHtml(data.subscriptionAmount)}).</li>
                    <li>Delayed payments may result in temporary service suspension.</li>
                    <li>Setup charges and customization charges are separate if applicable.</li>
                </ul>
                <p class="agr-subsection">Software Ownership</p>
                <ul class="agr-list">
                    <li>Software platform, code, design and technology remain the property of ${escapeHtml(COMPANY.name)}.</li>
                    <li>Client receives usage rights only.</li>
                </ul>
                <p class="agr-subsection">Data Responsibility</p>
                <ul class="agr-list">
                    <li>Client is responsible for the accuracy of entered billing/customer data.</li>
                    <li>${escapeHtml(COMPANY.name)} will take reasonable steps to maintain data security.</li>
                    <li>Client should maintain backups of important business records.</li>
                </ul>
                <p class="agr-subsection">Support Terms</p>
                <ul class="agr-list">
                    <li>Support will be provided through agreed communication channels.</li>
                    <li>Major customization requests may require additional charges.</li>
                </ul>
                <p class="agr-subsection">Updates</p>
                <ul class="agr-list">
                    <li>${escapeHtml(COMPANY.name)} may provide software updates, improvements and security updates.</li>
                </ul>
                <p class="agr-subsection">Termination</p>
                <ul class="agr-list">
                    <li>Either party can terminate service according to agreement terms.</li>
                    <li>Pending payments must be cleared before final account closure.</li>
                </ul>
                <p class="agr-subsection">Limitation</p>
                <ul class="agr-list">
                    <li>${escapeHtml(COMPANY.name)} is not responsible for business losses caused by incorrect data entry, internet issues, device problems or third-party services.</li>
                </ul>
            </div>
            ${pageFooter(2, totalPages)}
        </section>`;

    const page3 = `
        <section class="agr-page">
            ${pageHeader(data)}
            <div class="agr-page-content">
                <h2 class="agr-section-title">4. Privacy Policy</h2>
                <p class="agr-subsection">Data Collection</p>
                <ul class="agr-list">
                    <li>Business information</li>
                    <li>User account details</li>
                    <li>Billing information</li>
                    <li>Customer details entered into software</li>
                </ul>
                <p class="agr-subsection">Data Usage</p>
                <ul class="agr-list">
                    <li>Data is used only for providing software services.</li>
                    <li>Data will not be sold or shared with unauthorized third parties.</li>
                </ul>
                <p class="agr-subsection">Data Security</p>
                <ul class="agr-list">
                    <li>Reasonable security measures will be implemented.</li>
                    <li>Access will be limited to authorized persons.</li>
                </ul>
                <p class="agr-subsection">Client Consent</p>
                <ul class="agr-list">
                    <li>Client agrees to allow ${escapeHtml(COMPANY.name)} to process required information for providing the service.</li>
                </ul>
                <h2 class="agr-section-title">5. Client Acceptance Declaration</h2>
                <div class="agr-declaration">
                    "I have read and understood the AWS-Agni Billing Software Service Agreement, Terms &amp; Conditions and Privacy Policy. I agree to use the software according to the mentioned terms."
                </div>
                <h2 class="agr-section-title">6. Signature Section</h2>
                <div class="agr-signature-grid">
                    <div class="agr-signature-box">
                        <h4>Client Signature</h4>
                        <div class="agr-sig-line"></div>
                        <div class="agr-sig-label">Name</div>
                        <div class="agr-sig-value">${escapeHtml(data.ownerName)}</div>
                        <div class="agr-sig-label" style="margin-top:2mm">Date</div>
                        <div class="agr-sig-value">${escapeHtml(data.agreementDate)}</div>
                    </div>
                    <div class="agr-signature-box">
                        <h4>AWS-Agni Authorized Person</h4>
                        <div class="agr-sig-line"></div>
                        <div class="agr-sig-label">Name</div>
                        <div class="agr-sig-value">&nbsp;</div>
                        <div class="agr-sig-label" style="margin-top:2mm">Date</div>
                        <div class="agr-sig-value">&nbsp;</div>
                    </div>
                </div>
                <p class="agr-body-text" style="margin-top:5mm;font-size:7.5pt;color:#64748b;text-align:center;">
                    Generated by ${escapeHtml(COMPANY.name)} | ${escapeHtml(COMPANY.address)}
                </p>
            </div>
            ${pageFooter(3, totalPages)}
        </section>`;

    return `<div class="agr-doc">${page1}${page2}${page3}</div>`;
}

function collectFormData() {
    return {
        agreementId: val('agreementId'),
        agreementDate: val('agreementDate'),
        hotelName: val('hotelName'),
        ownerName: val('ownerName'),
        contactNumber: val('contactNumber'),
        email: val('email'),
        fullAddress: val('fullAddress'),
        gstNumber: val('gstNumber'),
        activationDate: val('activationDate'),
        activationDateDisplay: formatDisplayDate(val('activationDate')),
        planSelected: selectedPlan(),
        subscriptionAmount: val('subscriptionAmount'),
        numberOfUsers: val('numberOfUsers'),
        paymentMethods: checkedPaymentMethods(),
    };
}

function validateForm(data) {
    const errors = [];
    if (!data.hotelName) errors.push('Hotel / Business Name is required.');
    if (!data.ownerName) errors.push('Owner Name is required.');
    if (!data.contactNumber) errors.push('Contact Number is required.');
    if (!data.email) errors.push('Email Address is required.');
    if (!data.fullAddress) errors.push('Full Address is required.');
    if (!data.activationDate) errors.push('Software Activation Date is required.');
    if (!data.planSelected) errors.push('Please select a plan.');
    if (!data.subscriptionAmount) errors.push('Subscription Amount is required.');
    if (!data.numberOfUsers) errors.push('Number of Users is required.');
    if (!data.paymentMethods.length) errors.push('Select at least one Payment Method.');
    if (!document.getElementById('acceptTerms')?.checked) {
        errors.push('Please confirm client acceptance.');
    }
    return errors;
}

function setStatus(message, type = '') {
    statusEl.textContent = message;
    statusEl.className = 'agr-form-note' + (type ? ` is-${type}` : '');
}

function renderPreview() {
    const data = collectFormData();
    const errors = validateForm(data);
    if (errors.length) {
        setStatus(errors[0], 'error');
        return null;
    }
    previewEl.innerHTML = buildAgreementHtml(data);
    setStatus('Preview updated.', 'success');
    return data;
}

function openPreviewPanel() {
    previewPanel.classList.add('is-open');
    previewBackdrop.hidden = false;
    previewBackdrop.classList.add('is-open');
}

function closePreviewPanel() {
    previewPanel.classList.remove('is-open');
    previewBackdrop.classList.remove('is-open');
    previewBackdrop.hidden = true;
}

async function downloadPdf(data) {
    const slug = data.hotelName.replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '').slice(0, 40) || 'client';
    const filename = `AWS-Agni-Agreement-${slug}-${data.agreementId}.pdf`;
    const element = previewEl.querySelector('.agr-doc');
    if (!element) return;

    setStatus('Generating PDF…');

    try {
        await html2pdf().set({
            margin: 0,
            filename,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2, useCORS: true, scrollY: 0, windowWidth: 794 },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
            pagebreak: { mode: ['css', 'legacy'], before: '.agr-page' },
        }).from(element).save();
        setStatus(`PDF downloaded: ${filename}`, 'success');
    } catch (err) {
        console.error(err);
        setStatus('PDF generation failed. Try Print instead.', 'error');
    }
}

function printAgreement() {
    const data = renderPreview();
    if (!data) return;

    const printWindow = window.open('', '_blank', 'width=900,height=700');
    if (!printWindow) {
        setStatus('Pop-up blocked. Allow pop-ups to print.', 'error');
        return;
    }

    printWindow.document.write(`<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8">
<title>AWS-Agni Agreement — ${escapeHtml(data.agreementId)}</title>
<link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@700;800&family=Onest:wght@400;600;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="${window.location.origin}/css/agreement.css">
<style>@page{size:A4;margin:0}body{margin:0;background:#fff}.agr-page{box-shadow:none;margin:0}</style>
</head><body>${previewEl.innerHTML}<script>window.onload=function(){window.print();window.onafterprint=function(){window.close()}}<\/script></body></html>`);
    printWindow.document.close();
    setStatus('Print dialog opened.', 'success');
}

function initMetaFields() {
    document.getElementById('agreementId').value = generateAgreementId();
    document.getElementById('agreementDate').value = formatAgreementDate();
    const activation = document.getElementById('activationDate');
    if (activation && !activation.value) {
        activation.value = new Date().toISOString().slice(0, 10);
    }
}

document.getElementById('btnPreview').addEventListener('click', () => {
    if (renderPreview()) openPreviewPanel();
});

document.getElementById('btnGenerate').addEventListener('click', async () => {
    const data = renderPreview();
    if (!data) return;
    openPreviewPanel();
    await downloadPdf(data);
});

document.getElementById('btnPrint').addEventListener('click', printAgreement);
document.getElementById('btnClosePreview').addEventListener('click', closePreviewPanel);
previewBackdrop.addEventListener('click', closePreviewPanel);

form.addEventListener('reset', () => {
    setTimeout(() => {
        document.getElementById('agreementId').value = generateAgreementId();
        document.getElementById('agreementDate').value = formatAgreementDate();
        previewEl.innerHTML = '';
        setStatus('');
        closePreviewPanel();
    }, 0);
});

form.addEventListener('input', () => {
    if (previewEl.innerHTML) renderPreview();
});

form.querySelectorAll('input[name="planSelected"]').forEach((radio) => {
    radio.addEventListener('change', () => {
        const amount = document.getElementById('subscriptionAmount');
        if (radio.value === 'Yearly' && !amount.value) amount.value = '6000';
    });
});

initMetaFields();

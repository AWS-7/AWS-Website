function awsGetWhatsAppNumber() {
    return (typeof SITE_CONFIG !== 'undefined' && SITE_CONFIG.whatsapp) || '919080700642';
}

function openWhatsAppMessage(text) {
    const url = `https://wa.me/${awsGetWhatsAppNumber()}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
}

function buildContactWhatsAppMessage(data) {
    return [
        'Hi AWS-Agni Web Solution! 👋',
        '',
        'I submitted a contact form on your website.',
        '',
        `*Name:* ${data.name || '—'}`,
        `*Phone:* ${data.phone || '—'}`,
        `*Email:* ${data.email || '—'}`,
        '',
        `*Message:*`,
        data.message || '—',
        '',
        'Please get back to me. Thank you!'
    ].join('\n');
}

function buildPosTrialWhatsAppMessage(data) {
    return [
        'Hi AWS-Agni! 👋',
        '',
        'I want to start *AWS-Billing POS Free Trial*.',
        '',
        `*Name:* ${data.name || '—'}`,
        `*Restaurant:* ${data.restaurant || '—'}`,
        `*Phone:* ${data.phone || '—'}`,
        '',
        'Please contact me for setup. Thank you!'
    ].join('\n');
}

function buildNewsletterWhatsAppMessage(email) {
    return [
        'Hi AWS-Agni!',
        '',
        `I subscribed to your newsletter.`,
        `*Email:* ${email}`,
        '',
        'Please add me to your updates list. Thank you!'
    ].join('\n');
}

const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

const HTML_PATH = path.join(__dirname, '../assets/brochure/aws-billing-brochure.html');
const PDF_PATH = path.join(__dirname, '../assets/brochure/AWS-Billing-POS-Brochure.pdf');

async function generateBrochure() {
    if (!fs.existsSync(HTML_PATH)) {
        console.error('Brochure HTML not found:', HTML_PATH);
        process.exit(1);
    }

    console.log('Generating premium brochure PDF...');

    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    try {
        const page = await browser.newPage();
        const fileUrl = 'file:///' + HTML_PATH.replace(/\\/g, '/');

        await page.goto(fileUrl, { waitUntil: 'networkidle0', timeout: 30000 });
        await page.evaluateHandle('document.fonts.ready');

        await page.pdf({
            path: PDF_PATH,
            format: 'A4',
            printBackground: true,
            preferCSSPageSize: true,
            margin: { top: 0, right: 0, bottom: 0, left: 0 }
        });

        const stats = fs.statSync(PDF_PATH);
        console.log('✓ PDF created:', PDF_PATH);
        console.log('  Size:', (stats.size / 1024).toFixed(1), 'KB');
    } finally {
        await browser.close();
    }
}

generateBrochure().catch(err => {
    console.error('PDF generation failed:', err.message);
    process.exit(1);
});

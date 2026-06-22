import { defineConfig } from 'vite';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { viteStaticCopy } from 'vite-plugin-static-copy';

const __dirname = dirname(fileURLToPath(import.meta.url));

const pages = {
  main: resolve(__dirname, 'index.html'),
  service: resolve(__dirname, 'service.html'),
  admin: resolve(__dirname, 'admin.html'),
  portal: resolve(__dirname, 'portal.html'),
  privacy: resolve(__dirname, 'privacy.html'),
  terms: resolve(__dirname, 'terms.html'),
  '404': resolve(__dirname, '404.html'),
  'web-design-pudukottai': resolve(__dirname, 'web-design-pudukottai.html'),
  'pos-software-ramanathapuram': resolve(__dirname, 'pos-software-ramanathapuram.html'),
  project: resolve(__dirname, 'project/index.html'),
};

function ensureLegacyStylesheet() {
  return {
    name: 'ensure-legacy-stylesheet',
    transformIndexHtml: {
      order: 'post',
      handler(html) {
        if (!html.includes('css/style.css') && !html.includes('/css/style.css')) {
          return html.replace('</head>', '  <link rel="stylesheet" href="/css/style.css">\n</head>');
        }
        return html;
      },
    },
  };
}

function versionServiceWorker() {
  return {
    name: 'version-service-worker',
    closeBundle() {
      const distSw = resolve(__dirname, 'dist/sw.js');
      if (!existsSync(distSw)) return;

      const commit = process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 8);
      const version = commit ? `aws-agni-${commit}` : `aws-agni-${Date.now().toString(36)}`;
      let sw = readFileSync(distSw, 'utf8');
      sw = sw.replace(/const CACHE_NAME = '[^']+';/, `const CACHE_NAME = '${version}';`);
      writeFileSync(distSw, sw);
      console.log(`Service worker cache: ${version}`);
    },
  };
}

export default defineConfig({
  appType: 'mpa',
  plugins: [
    ensureLegacyStylesheet(),
    viteStaticCopy({
      targets: [
        { src: 'css/*', dest: 'css' },
        { src: 'js/*', dest: 'js' },
        { src: 'images/*', dest: 'images' },
        { src: 'assets/**/*', dest: 'assets' },
        { src: 'manifest.json', dest: '.' },
        { src: 'sw.js', dest: '.' },
        { src: 'firebase-messaging-sw.js', dest: '.' },
        { src: 'robots.txt', dest: '.' },
        { src: 'sitemap.xml', dest: '.' },
        { src: '*.jpg', dest: '.' },
        { src: '*.png', dest: '.' },
        { src: '*.jpeg', dest: '.' },
      ],
    }),
    versionServiceWorker(),
  ],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: pages,
    },
  },
  server: {
    port: 3000,
    open: '/',
  },
  preview: {
    port: 4173,
  },
});

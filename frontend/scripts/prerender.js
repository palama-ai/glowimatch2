/**
 * Pre-render Script for Glowimatch
 * Generates static HTML for SEO crawlers
 * 
 * Usage: node scripts/prerender.js
 * Run after: npm run build
 */

const fs = require('fs');
const path = require('path');

// Routes to pre-render (matching sitemap.xml)
const routes = [
    '/',
    '/about',
    '/blog',
    '/contact',
    '/terms'
];

const buildDir = path.join(__dirname, '../build');
const indexHtml = fs.readFileSync(path.join(buildDir, 'index.html'), 'utf8');

console.log('🚀 Pre-rendering routes for SEO...\n');

routes.forEach(route => {
    const routePath = route === '/' ? '' : route;
    const dir = path.join(buildDir, routePath);

    // Create directory if it doesn't exist
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }

    // Copy index.html to each route
    const targetFile = route === '/'
        ? path.join(buildDir, 'index.html')
        : path.join(dir, 'index.html');

    if (route !== '/') {
        fs.writeFileSync(targetFile, indexHtml);
        console.log(`✅ Created: ${targetFile}`);
    }
});

console.log('\n✨ Pre-rendering complete!');
console.log('📁 Static HTML files are ready in the build directory.');

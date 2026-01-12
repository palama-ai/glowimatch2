/**
 * Pre-render Script for Glowimatch
 * Generates static HTML with unique titles for SEO crawlers
 * 
 * This script uses only built-in Node.js modules (no external dependencies)
 * It copies index.html to route directories with modified titles
 * 
 * Usage: node scripts/prerender.js
 * Run after: npm run build
 */

const fs = require('fs');
const path = require('path');

// Routes to pre-render with their unique titles
const routes = [
    { path: '/about', title: 'About Us - AI Skincare Experts | Glowimatch' },
    { path: '/blog', title: 'Skincare Tips & Beauty Blog | Glowimatch' },
    { path: '/contact', title: 'Contact Us - Get Skincare Advice | Glowimatch' },
    { path: '/terms', title: 'Terms of Service | Glowimatch' }
];

const buildDir = path.join(__dirname, '../build');

console.log('🚀 Starting pre-rendering for SEO...\n');

// Check if build directory exists
if (!fs.existsSync(buildDir)) {
    console.log('⚠️  Build directory not found. Please run "npm run build" first.');
    process.exit(0);
}

// Read the base index.html
const indexPath = path.join(buildDir, 'index.html');
if (!fs.existsSync(indexPath)) {
    console.log('⚠️  index.html not found in build directory.');
    process.exit(0);
}

const indexHtml = fs.readFileSync(indexPath, 'utf8');

// Generate HTML for each route
routes.forEach(route => {
    const dir = path.join(buildDir, route.path);

    // Create directory if it doesn't exist
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }

    // Replace title in HTML
    const modifiedHtml = indexHtml.replace(
        /<title>.*?<\/title>/,
        `<title>${route.title}</title>`
    );

    // Write the HTML file
    const outputFile = path.join(dir, 'index.html');
    fs.writeFileSync(outputFile, modifiedHtml);
    console.log(`✅ Created: ${route.path}/index.html`);
});

console.log('\n✨ Pre-rendering complete!');
console.log('📁 Static HTML files with unique titles are ready for crawlers.');

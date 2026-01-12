/**
 * Pre-render Script for Glowimatch (Puppeteer Version)
 * Generates static HTML with unique titles and meta tags for SEO crawlers
 * 
 * Usage: node scripts/prerender.js
 * Run after: npm run build
 */

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const { createServer } = require('http');
const handler = require('serve-handler');

// Routes to pre-render (matching sitemap.xml)
const routes = [
    { path: '/', title: 'Glowimatch | AI Skin Analysis & Personalized Beauty' },
    { path: '/about', title: 'About Us - AI Skincare Experts | Glowimatch' },
    { path: '/blog', title: 'Skincare Tips & Beauty Blog | Glowimatch' },
    { path: '/contact', title: 'Contact Us - Get Skincare Advice | Glowimatch' },
    { path: '/terms', title: 'Terms of Service | Glowimatch' }
];

const buildDir = path.join(__dirname, '../build');
const PORT = 5000;

async function prerender() {
    console.log('🚀 Starting Puppeteer pre-rendering...\n');

    // Start a local server to serve the build
    const server = createServer((request, response) => {
        return handler(request, response, {
            public: buildDir,
            rewrites: [{ source: '**', destination: '/index.html' }]
        });
    });

    await new Promise(resolve => server.listen(PORT, resolve));
    console.log(`📡 Local server running at http://localhost:${PORT}\n`);

    // Launch Puppeteer
    const browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    for (const route of routes) {
        try {
            const page = await browser.newPage();
            const url = `http://localhost:${PORT}${route.path}`;

            console.log(`⏳ Rendering: ${route.path}`);

            // Navigate and wait for network to be idle
            await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });

            // Wait additional 2 seconds for react-helmet to inject meta tags
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Get the fully rendered HTML
            const html = await page.content();

            // Determine output path
            const routePath = route.path === '/' ? '' : route.path;
            const dir = path.join(buildDir, routePath);

            // Create directory if it doesn't exist
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }

            // Write the HTML file
            const outputFile = path.join(dir, 'index.html');
            fs.writeFileSync(outputFile, html);

            console.log(`✅ Created: ${outputFile}`);

            await page.close();
        } catch (error) {
            console.error(`❌ Error rendering ${route.path}:`, error.message);
        }
    }

    await browser.close();
    server.close();

    console.log('\n✨ Pre-rendering complete!');
    console.log('📁 Static HTML files with unique titles are ready.');
}

// Check if Puppeteer is available, otherwise use fallback
async function main() {
    try {
        require.resolve('puppeteer');
        await prerender();
    } catch (e) {
        console.log('⚠️  Puppeteer not installed. Using fallback method...\n');

        // Fallback: Copy index.html with modified titles
        const indexHtml = fs.readFileSync(path.join(buildDir, 'index.html'), 'utf8');

        routes.forEach(route => {
            if (route.path === '/') return;

            const routePath = route.path;
            const dir = path.join(buildDir, routePath);

            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }

            // Replace title in HTML
            const modifiedHtml = indexHtml.replace(
                /<title>.*?<\/title>/,
                `<title>${route.title}</title>`
            );

            const outputFile = path.join(dir, 'index.html');
            fs.writeFileSync(outputFile, modifiedHtml);
            console.log(`✅ Created (fallback): ${outputFile}`);
        });

        console.log('\n✨ Fallback pre-rendering complete!');
    }
}

main().catch(console.error);

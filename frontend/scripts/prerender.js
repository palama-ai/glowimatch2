/**
 * Pre-render Script for Glowimatch
 * Generates static HTML with unique titles, meta descriptions, and SEO content
 * 
 * This script uses only built-in Node.js modules (no external dependencies)
 * It modifies HTML files with proper meta tags and injected content
 * 
 * Usage: node scripts/prerender.js
 * Run after: npm run build
 */

const fs = require('fs');
const path = require('path');

// Routes to pre-render with their unique SEO content
const routes = [
    {
        path: '/',
        title: 'Glowimatch | AI Skin Analysis & Personalized Beauty Recommendations',
        description: 'Discover your perfect skincare routine with Glowimatch AI skin analysis. Get personalized product recommendations from The Ordinary, Cosrx, CeraVe, and more for your unique skin type.',
        ogImage: 'https://glowimatch.vercel.app/assets/images/og-image.png',
        canonical: 'https://glowimatch.vercel.app/'
    },
    {
        path: '/about',
        title: 'About Us - AI Skincare Experts | Glowimatch',
        description: 'Learn about Glowimatch, the AI-powered skincare platform revolutionizing personalized beauty. Our team combines dermatology expertise with machine learning technology.',
        ogImage: 'https://glowimatch.vercel.app/assets/images/og-image.png',
        canonical: 'https://glowimatch.vercel.app/about'
    },
    {
        path: '/blog',
        title: 'Skincare Tips & Beauty Blog | Glowimatch',
        description: 'Explore expert skincare tips, ingredient guides, and beauty advice on the Glowimatch blog. Learn about Retinol, Niacinamide, Hyaluronic Acid and build your perfect routine.',
        ogImage: 'https://glowimatch.vercel.app/assets/images/og-image.png',
        canonical: 'https://glowimatch.vercel.app/blog'
    },
    {
        path: '/contact',
        title: 'Contact Us - Get Skincare Advice | Glowimatch',
        description: 'Contact Glowimatch for personalized skincare support and advice. Our team is here to help you with your AI skin analysis and product recommendations.',
        ogImage: 'https://glowimatch.vercel.app/assets/images/og-image.png',
        canonical: 'https://glowimatch.vercel.app/contact'
    },
    {
        path: '/terms',
        title: 'Terms of Service | Glowimatch',
        description: 'Read the Glowimatch Terms of Service and Privacy Policy. Learn how we protect your data and ensure a secure AI skincare analysis experience.',
        ogImage: 'https://glowimatch.vercel.app/assets/images/og-image.png',
        canonical: 'https://glowimatch.vercel.app/terms'
    }
];

// SEO keywords content to inject into head for crawlers
const seoKeywordsContent = `
    <!-- SEO Keywords for Crawlers -->
    <meta name="keywords" content="AI skin analysis, personalized skincare, skin type quiz, The Ordinary, CeraVe, Cosrx, Paula's Choice, La Roche-Posay, Retinol, Niacinamide, Hyaluronic Acid, skincare routine, beauty recommendations, dermatologist approved" />
    <meta name="author" content="Glowimatch" />
    <meta name="application-name" content="Glowimatch" />
    <meta property="og:site_name" content="Glowimatch" />
    <meta property="og:locale" content="en_US" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:site" content="@glowimatch" />
`;

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
    let modifiedHtml = indexHtml;

    // Replace title
    modifiedHtml = modifiedHtml.replace(
        /<title>.*?<\/title>/,
        `<title>${route.title}</title>`
    );

    // Inject or replace meta description
    if (modifiedHtml.includes('<meta name="description"')) {
        modifiedHtml = modifiedHtml.replace(
            /<meta name="description"[^>]*>/,
            `<meta name="description" content="${route.description}" />`
        );
    } else {
        modifiedHtml = modifiedHtml.replace(
            '</title>',
            `</title>\n    <meta name="description" content="${route.description}" />`
        );
    }

    // Inject canonical link
    if (!modifiedHtml.includes('rel="canonical"')) {
        modifiedHtml = modifiedHtml.replace(
            '</title>',
            `</title>\n    <link rel="canonical" href="${route.canonical}" />`
        );
    } else {
        modifiedHtml = modifiedHtml.replace(
            /<link rel="canonical"[^>]*>/,
            `<link rel="canonical" href="${route.canonical}" />`
        );
    }

    // Inject OG tags
    if (!modifiedHtml.includes('og:title')) {
        modifiedHtml = modifiedHtml.replace(
            '</head>',
            `    <meta property="og:title" content="${route.title}" />
    <meta property="og:description" content="${route.description}" />
    <meta property="og:image" content="${route.ogImage}" />
    <meta property="og:url" content="${route.canonical}" />
    <meta property="og:type" content="website" />
    <meta name="twitter:title" content="${route.title}" />
    <meta name="twitter:description" content="${route.description}" />
    <meta name="twitter:image" content="${route.ogImage}" />
${seoKeywordsContent}
  </head>`
        );
    }

    if (route.path === '/') {
        // For homepage, overwrite the existing index.html
        fs.writeFileSync(indexPath, modifiedHtml);
        console.log('✅ Updated: /index.html (homepage) - ' + modifiedHtml.length + ' bytes');
    } else {
        // For other routes, create subdirectory with index.html
        const dir = path.join(buildDir, route.path);

        // Create directory if it doesn't exist
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }

        // Write the HTML file
        const outputFile = path.join(dir, 'index.html');
        fs.writeFileSync(outputFile, modifiedHtml);
        console.log(`✅ Created: ${route.path}/index.html - ${modifiedHtml.length} bytes`);
    }
});

console.log('\n✨ Pre-rendering complete!');
console.log('📁 Static HTML files with full SEO meta tags are ready for crawlers.');

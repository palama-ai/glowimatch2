import React from 'react';
import { Helmet } from 'react-helmet';
import { useI18n } from '../contexts/I18nContext';

/**
 * SEO Component for managing page-level meta tags
 * Uses react-helmet to inject meta tags into the document head
 */
const SEO = ({
    title,
    description,
    keywords,
    image,
    url,
    type = 'website',
    noindex = false,
    jsonLd = null,
    children
}) => {
    const { language } = useI18n();

    const siteUrl = 'https://glowimatch.vercel.app';
    const defaultImage = `${siteUrl}/assets/images/og-image.png`;

    // Default SEO content based on language
    const defaultContent = {
        en: {
            title: 'Glowimatch | AI Skincare Analysis & Personalized Beauty Recommendations',
            description: 'Discover your perfect skincare routine with AI-powered skin analysis. Get personalized beauty product recommendations, skin type quiz, and expert skincare tips. Find the best cosmetics for your skin.',
            keywords: 'skincare, AI skin analysis, beauty products, skin type quiz, personalized skincare, cosmetics, beauty shop, skincare routine, skin care tips, facial care, anti-aging, moisturizer, cleanser, serum'
        },
        fr: {
            title: 'Glowimatch | Analyse de Peau par IA & Recommandations Beauté Personnalisées',
            description: 'Découvrez votre routine de soin parfaite grâce à l\'analyse de peau par IA. Obtenez des recommandations de produits de beauté personnalisées, un quiz sur votre type de peau et des conseils d\'experts.',
            keywords: 'soins de la peau, analyse de peau IA, produits de beauté, quiz type de peau, soins personnalisés, cosmétiques, boutique beauté, routine beauté, conseils soins'
        },
        ar: {
            title: 'جلوماتش | تحليل البشرة بالذكاء الاصطناعي وتوصيات جمالية مخصصة',
            description: 'اكتشفي روتين العناية بالبشرة المثالي مع تحليل البشرة بالذكاء الاصطناعي. احصلي على توصيات منتجات تجميل مخصصة، اختبار نوع البشرة، ونصائح خبراء العناية بالبشرة. اعثري على أفضل مستحضرات التجميل لبشرتك.',
            keywords: 'العناية بالبشرة, تحليل البشرة بالذكاء الاصطناعي, منتجات التجميل, متاجر التجميل, اختبار نوع البشرة, مستحضرات التجميل, روتين العناية بالبشرة, كريم مرطب, سيروم, غسول الوجه'
        }
    };

    const currentLang = language || 'en';
    const defaults = defaultContent[currentLang] || defaultContent.en;

    const fullTitle = title ? `${title} | Glowimatch` : defaults.title;
    const fullDescription = description || defaults.description;
    const fullKeywords = keywords || defaults.keywords;
    const fullImage = image || defaultImage;
    const fullUrl = url ? `${siteUrl}${url}` : siteUrl;

    // Language codes for hreflang
    const langCodes = {
        en: 'en',
        fr: 'fr',
        ar: 'ar'
    };

    return (
        <Helmet>
            {/* Primary Meta Tags */}
            <html lang={langCodes[currentLang] || 'en'} dir={currentLang === 'ar' ? 'rtl' : 'ltr'} />
            <title>{fullTitle}</title>
            <meta name="title" content={fullTitle} />
            <meta name="description" content={fullDescription} />
            <meta name="keywords" content={fullKeywords} />

            {/* Robots */}
            {noindex && <meta name="robots" content="noindex, nofollow" />}

            {/* Canonical URL */}
            <link rel="canonical" href={fullUrl} />

            {/* Alternate Languages */}
            <link rel="alternate" hrefLang="en" href={`${siteUrl}${url || ''}`} />
            <link rel="alternate" hrefLang="fr" href={`${siteUrl}${url || ''}`} />
            <link rel="alternate" hrefLang="ar" href={`${siteUrl}${url || ''}`} />
            <link rel="alternate" hrefLang="x-default" href={`${siteUrl}${url || ''}`} />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content={type} />
            <meta property="og:url" content={fullUrl} />
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={fullDescription} />
            <meta property="og:image" content={fullImage} />
            <meta property="og:locale" content={currentLang === 'ar' ? 'ar_MA' : currentLang === 'fr' ? 'fr_FR' : 'en_US'} />
            <meta property="og:site_name" content="Glowimatch" />

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:url" content={fullUrl} />
            <meta name="twitter:title" content={fullTitle} />
            <meta name="twitter:description" content={fullDescription} />
            <meta name="twitter:image" content={fullImage} />

            {/* Additional Meta */}
            <meta name="author" content="Glowimatch" />
            <meta name="application-name" content="Glowimatch" />

            {/* JSON-LD Structured Data */}
            {jsonLd && (
                <script type="application/ld+json">
                    {JSON.stringify(jsonLd)}
                </script>
            )}

            {children}
        </Helmet>
    );
};

// Predefined JSON-LD schemas for common use cases
export const createOrganizationSchema = () => ({
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Glowimatch",
    "url": "https://glowimatch.vercel.app",
    "logo": "https://glowimatch.vercel.app/assets/images/logo.png",
    "description": "AI-powered skincare analysis and personalized beauty product recommendations",
    "sameAs": [
        "https://www.linkedin.com/company/glowimatch",
        "https://www.instagram.com/glowimatch"
    ],
    "contactPoint": {
        "@type": "ContactPoint",
        "email": "support@glowmatch.com",
        "contactType": "customer service"
    }
});

export const createWebsiteSchema = () => ({
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Glowimatch",
    "url": "https://glowimatch.vercel.app",
    "potentialAction": {
        "@type": "SearchAction",
        "target": "https://glowimatch.vercel.app/blog?search={search_term_string}",
        "query-input": "required name=search_term_string"
    }
});

export const createFAQSchema = (faqs) => ({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
        "@type": "Question",
        "name": faq.question,
        "acceptedAnswer": {
            "@type": "Answer",
            "text": faq.answer
        }
    }))
});

export const createBlogPostSchema = (post) => ({
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "description": post.excerpt,
    "image": post.image,
    "datePublished": post.date,
    "author": {
        "@type": "Organization",
        "name": "Glowimatch"
    },
    "publisher": {
        "@type": "Organization",
        "name": "Glowimatch",
        "logo": {
            "@type": "ImageObject",
            "url": "https://glowimatch.vercel.app/assets/images/logo.png"
        }
    }
});

export const createProductSchema = (product) => ({
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "description": product.description,
    "image": product.image,
    "brand": {
        "@type": "Brand",
        "name": product.brand
    },
    "offers": {
        "@type": "Offer",
        "price": product.price,
        "priceCurrency": "USD",
        "availability": "https://schema.org/InStock"
    }
});

export default SEO;

#!/usr/bin/env node

/**
 * Generate sitemap.xml for SEO
 */

const fs = require('fs').promises;
const path = require('path');

// Configuration
const config = {
  baseUrl: 'https://microokoaguarantycapital.com',
  outputFile: 'sitemap.xml',
  sections: [
    {
      url: '/',
      priority: 1.0,
      changefreq: 'daily',
      title: 'Home - Microokoa Guaranty Capital',
      description: 'Donate Today, Borrow Now! Community-powered microfinance for financial inclusion.'
    },
    {
      url: '/#about',
      priority: 0.8,
      changefreq: 'weekly',
      title: 'About Us - Microokoa Guaranty Capital',
      description: 'Learn about our mission, vision, and community-powered financing model.'
    },
    {
      url: '/#products',
      priority: 0.9,
      changefreq: 'weekly',
      title: 'Our Products - Microokoa Guaranty Capital',
      description: 'Explore our loan products: QuickLoans, BusinessLoans, and Donate & Access program.'
    },
    {
      url: '/#quickloans',
      priority: 0.8,
      changefreq: 'weekly',
      title: 'QuickLoans - Emergency Funding | Microokoa',
      description: 'Fast, small loans for emergencies. Get approved within 24 hours.'
    },
    {
      url: '/#businessloans',
      priority: 0.8,
      changefreq: 'weekly',
      title: 'BusinessLoans - Growth Capital | Microokoa',
      description: 'Capital for business expansion, inventory, and equipment. Up to Kshs 50,000.'
    },
    {
      url: '/#donate-access',
      priority: 0.8,
      changefreq: 'weekly',
      title: 'Donate & Access Program | Microokoa',
      description: 'Participate in community funding and unlock your borrowing potential.'
    },
    {
      url: '/#borrow',
      priority: 0.8,
      changefreq: 'weekly',
      title: 'Borrow Loans | Microokoa Guaranty Capital',
      description: 'Access loans tailored to your needs through our community-powered model.'
    },
    {
      url: '/#donate',
      priority: 0.9,
      changefreq: 'daily',
      title: 'Donate to Community Fund | Microokoa',
      description: 'Your donation helps others and unlocks your borrowing potential.'
    },
    {
      url: '/#contact',
      priority: 0.7,
      changefreq: 'monthly',
      title: 'Contact Us | Microokoa Guaranty Capital',
      description: 'Get in touch with our team for support, inquiries, or partnerships.'
    },
    {
      url: '/#careers',
      priority: 0.6,
      changefreq: 'monthly',
      title: 'Careers at Microokoa | Join Our Team',
      description: 'Join our mission to empower communities through innovative financing.'
    },
    {
      url: '/#faqs',
      priority: 0.7,
      changefreq: 'weekly',
      title: 'FAQs | Microokoa Guaranty Capital',
      description: 'Find answers to common questions about our donation-based financing model.'
    }
  ],
  // Additional static pages (if any)
  staticPages: [
    {
      url: '/privacy-policy',
      priority: 0.3,
      changefreq: 'yearly',
      title: 'Privacy Policy | Microokoa',
      description: 'Our privacy policy and data protection practices.'
    },
    {
      url: '/terms-of-service',
      priority: 0.3,
      changefreq: 'yearly',
      title: 'Terms of Service | Microokoa',
      description: 'Terms and conditions for using our services.'
    }
  ]
};

// XML Namespaces
const XML_NAMESPACES = {
  urlset: 'http://www.sitemaps.org/schemas/sitemap/0.9',
  xhtml: 'http://www.w3.org/1999/xhtml',
  image: 'http://www.google.com/schemas/sitemap-image/1.1',
  video: 'http://www.google.com/schemas/sitemap-video/1.1',
  news: 'http://www.google.com/schemas/sitemap-news/0.9'
};

// Images for sitemap
const IMAGES = [
  {
    loc: 'assets/logo.svg',
    caption: 'Microokoa Guaranty Capital Logo',
    title: 'Microokoa Guaranty Capital'
  },
  {
    loc: 'assets/hero1-min.jpg',
    caption: 'Community donating via mobile money',
    title: 'Community Donations'
  },
  {
    loc: 'assets/hero2-min.jpg',
    caption: 'Business owner thriving with Microokoa loan',
    title: 'Business Success'
  },
  {
    loc: 'assets/hero3-min.jpg',
    caption: 'Community uplift through financing',
    title: 'Community Uplift'
  }
];

async function generateSitemap() {
  console.log('🚀 Generating sitemap.xml...');
  
  const today = new Date().toISOString().split('T')[0];
  
  try {
    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    sitemap += `<urlset\n`;
    sitemap += `  xmlns="${XML_NAMESPACES.urlset}"\n`;
    sitemap += `  xmlns:xhtml="${XML_NAMESPACES.xhtml}"\n`;
    sitemap += `  xmlns:image="${XML_NAMESPACES.image}"\n`;
    sitemap += `>\n\n`;
    
    // Add all sections
    for (const section of [...config.sections, ...config.staticPages]) {
      const fullUrl = `${config.baseUrl}${section.url}`;
      
      sitemap += `  <url>\n`;
      sitemap += `    <loc>${fullUrl}</loc>\n`;
      sitemap += `    <lastmod>${today}</lastmod>\n`;
      sitemap += `    <changefreq>${section.changefreq}</changefreq>\n`;
      sitemap += `    <priority>${section.priority}</priority>\n`;
      
      // Add alternate language links (if supporting multiple languages)
      sitemap += `    <xhtml:link\n`;
      sitemap += `      rel="alternate"\n`;
      sitemap += `      hreflang="en"\n`;
      sitemap += `      href="${fullUrl}"\n`;
      sitemap += `    />\n`;
      sitemap += `    <xhtml:link\n`;
      sitemap += `      rel="alternate"\n`;
      sitemap += `      hreflang="x-default"\n`;
      sitemap += `      href="${fullUrl}"\n`;
      sitemap += `    />\n`;
      
      // Add images for home page
      if (section.url === '/') {
        for (const image of IMAGES) {
          const imageUrl = `${config.baseUrl}/${image.loc}`;
          sitemap += `    <image:image>\n`;
          sitemap += `      <image:loc>${imageUrl}</image:loc>\n`;
          sitemap += `      <image:caption><![CDATA[${image.caption}]]></image:caption>\n`;
          sitemap += `      <image:title><![CDATA[${image.title}]]></image:title>\n`;
          sitemap += `    </image:image>\n`;
        }
      }
      
      sitemap += `  </url>\n\n`;
    }
    
    // Add video sitemap entries (if applicable)
    const videos = [
      {
        title: 'How Microokoa Works - Donation-Based Financing',
        description: 'Learn how our community-powered financing model helps you donate and borrow.',
        thumbnail: `${config.baseUrl}/assets/video-thumbnail.jpg`,
        contentUrl: `${config.baseUrl}/videos/how-it-works.mp4`,
        duration: 180,
        rating: 4.8,
        viewCount: 1500,
        publicationDate: '2024-01-15'
      }
    ];
    
    for (const video of videos) {
      sitemap += `  <url>\n`;
      sitemap += `    <loc>${config.baseUrl}/#video-tutorial</loc>\n`;
      sitemap += `    <video:video>\n`;
      sitemap += `      <video:thumbnail_loc>${video.thumbnail}</video:thumbnail_loc>\n`;
      sitemap += `      <video:title><![CDATA[${video.title}]]></video:title>\n`;
      sitemap += `      <video:description><![CDATA[${video.description}]]></video:description>\n`;
      sitemap += `      <video:content_loc>${video.contentUrl}</video:content_loc>\n`;
      sitemap += `      <video:duration>${video.duration}</video:duration>\n`;
      sitemap += `      <video:rating>${video.rating}</video:rating>\n`;
      sitemap += `      <video:view_count>${video.viewCount}</video:view_count>\n`;
      sitemap += `      <video:publication_date>${video.publicationDate}</video:publication_date>\n`;
      sitemap += `      <video:family_friendly>yes</video:family_friendly>\n`;
      sitemap += `    </video:video>\n`;
      sitemap += `  </url>\n\n`;
    }
    
    sitemap += `</urlset>`;
    
    // Write to file
    await fs.writeFile(config.outputFile, sitemap);
    console.log(`✅ Generated: ${config.outputFile}`);
    
    // Generate sitemap index if needed (for large sites)
    await generateSitemapIndex();
    
    // Generate robots.txt
    await generateRobotsTxt();
    
    console.log('\n📊 Sitemap Statistics:');
    console.log(`   Total URLs: ${config.sections.length + config.staticPages.length + videos.length}`);
    console.log(`   Base URL: ${config.baseUrl}`);
    console.log(`   Last Modified: ${today}`);
    console.log('\n🎉 Sitemap generation complete!');
    
  } catch (error) {
    console.error('❌ Error generating sitemap:', error);
    process.exit(1);
  }
}

async function generateSitemapIndex() {
  // For large sites, you might want multiple sitemaps
  const sitemapIndex = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${config.baseUrl}/sitemap.xml</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
  </sitemap>
</sitemapindex>`;
  
  try {
    await fs.writeFile('sitemap-index.xml', sitemapIndex);
    console.log('✅ Generated: sitemap-index.xml');
  } catch (error) {
    console.log('⚠️ Could not generate sitemap index:', error.message);
  }
}

async function generateRobotsTxt() {
  const robots = `# robots.txt for Microokoa Guaranty Capital
# Generated: ${new Date().toISOString()}

User-agent: *
Allow: /
Disallow: /private/
Disallow: /admin/
Disallow: /cgi-bin/
Disallow: /wp-admin/
Disallow: /wp-includes/
Disallow: /search/

# Crawl delay to prevent server overload
Crawl-delay: 10

# Sitemaps
Sitemap: ${config.baseUrl}/sitemap.xml
Sitemap: ${config.baseUrl}/sitemap-index.xml

# Host directive
Host: ${config.baseUrl}

# User-agent specific rules
User-agent: Googlebot
Allow: /
Disallow: /private/
Crawl-delay: 5

User-agent: Googlebot-Image
Allow: /assets/
Disallow: /private/

User-agent: Bingbot
Allow: /
Disallow: /private/
Crawl-delay: 5

User-agent: Yandex
Allow: /
Disallow: /private/
Crawl-delay: 5

# Block known bad bots
User-agent: AhrefsBot
Disallow: /

User-agent: SemrushBot
Disallow: /

User-agent: MJ12bot
Disallow: /

User-agent: DotBot
Disallow: /

User-agent: BLEXBot
Disallow: /

User-agent: UptimeRobot
Disallow: /

User-agent: ia_archiver
Disallow: /

# Development/Staging environments
User-agent: *
Disallow: /staging/
Disallow: /test/
Disallow: /dev/
Disallow: /development/

# Noindex for specific paths
User-agent: *
Disallow: /cgi-bin/*.cgi$
Disallow: /*.php$
Disallow: /*.inc$
Disallow: /*.json$
Disallow: /*.xml$

# Allow all for sitemaps and feeds
Allow: /*.xml$
Allow: /*.rss$
Allow: /*.atom$

# Mobile sitemap (if separate)
Sitemap: ${config.baseUrl}/mobile-sitemap.xml

# News sitemap (if applicable)
Sitemap: ${config.baseUrl}/news-sitemap.xml

# Image sitemap
Sitemap: ${config.baseUrl}/image-sitemap.xml

# Video sitemap
Sitemap: ${config.baseUrl}/video-sitemap.xml

# Clean params
Clean-param: ref /search/
Clean-param: source /search/
Clean-param: utm_source /
Clean-param: utm_medium /
Clean-param: utm_campaign /
Clean-param: utm_term /
Clean-param: utm_content /
Clean-param: gclid /
Clean-param: fbclid /

# Visit-time directive (crawl during off-peak hours)
Visit-time: 0200-0600

# Request-rate directive
Request-rate: 1/5

# Cache directive
Cache: 86400

# Microokoa-specific rules
# Allow crawling of loan calculator
Allow: /#calculator
Allow: /#donate
Allow: /#contact

# Disallow crawling of user-specific data
Disallow: /user/
Disallow: /profile/
Disallow: /account/
Disallow: /dashboard/

# Allow social media bots
User-agent: FacebookExternalHit
Allow: /

User-agent: Twitterbot
Allow: /

User-agent: LinkedInBot
Allow: /

User-agent: Slackbot
Allow: /

User-agent: TelegramBot
Allow: /

# SEO Metadata
# ${config.baseUrl}
# Description: ${config.sections[0].description}
# Keywords: microfinance, kenya, financial inclusion, community financing, donation-based loans
# Language: en
# Country: KE
`;
  
  try {
    await fs.writeFile('robots.txt', robots);
    console.log('✅ Generated: robots.txt');
  } catch (error) {
    console.error('❌ Error generating robots.txt:', error);
  }
}

// Generate HTML sitemap for users
async function generateHtmlSitemap() {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Microokoa Guaranty Capital - Sitemap</title>
    <style>
        body {
            font-family: 'Open Sans', sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
            background: #f5f5f5;
        }
        .container {
            background: white;
            padding: 30px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        h1 {
            color: #006400;
            border-bottom: 3px solid #FF6600;
            padding-bottom: 10px;
        }
        .sitemap-section {
            margin: 30px 0;
        }
        .sitemap-section h2 {
            color: #006400;
            background: #f8fff8;
            padding: 15px;
            border-left: 4px solid #FF6600;
        }
        .sitemap-list {
            list-style: none;
            padding: 0;
        }
        .sitemap-list li {
            margin: 10px 0;
            padding: 10px;
            border-bottom: 1px solid #eee;
        }
        .sitemap-list a {
            color: #006400;
            text-decoration: none;
            font-weight: 600;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        .sitemap-list a:hover {
            color: #FF6600;
        }
        .sitemap-list a i {
            color: #FF6600;
        }
        .lastmod {
            color: #666;
            font-size: 14px;
            margin-left: 30px;
        }
        @media (max-width: 768px) {
            .container {
                padding: 15px;
            }
        }
    </style>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
</head>
<body>
    <div class="container">
        <h1><i class="fas fa-sitemap"></i> Microokoa Guaranty Capital Sitemap</h1>
        <p>Last updated: ${new Date().toLocaleDateString()}</p>
        
        <div class="sitemap-section">
            <h2><i class="fas fa-home"></i> Main Pages</h2>
            <ul class="sitemap-list">
                ${config.sections.map(section => `
                <li>
                    <a href="${section.url}">
                        <i class="fas fa-link"></i>
                        ${section.title}
                    </a>
                    <div class="lastmod">Priority: ${section.priority} | Updated: ${section.changefreq}</div>
                </li>
                `).join('')}
            </ul>
        </div>
        
        <div class="sitemap-section">
            <h2><i class="fas fa-file-alt"></i> Legal & Information</h2>
            <ul class="sitemap-list">
                ${config.staticPages.map(page => `
                <li>
                    <a href="${page.url}">
                        <i class="fas fa-file-contract"></i>
                        ${page.title}
                    </a>
                    <div class="lastmod">Priority: ${page.priority} | Updated: ${page.changefreq}</div>
                </li>
                `).join('')}
            </ul>
        </div>
        
        <div class="sitemap-section">
            <h2><i class="fas fa-search"></i> SEO Resources</h2>
            <ul class="sitemap-list">
                <li>
                    <a href="/sitemap.xml">
                        <i class="fas fa-code"></i>
                        XML Sitemap
                    </a>
                </li>
                <li>
                    <a href="/robots.txt">
                        <i class="fas fa-robot"></i>
                        Robots.txt
                    </a>
                </li>
                <li>
                    <a href="/manifest.json">
                        <i class="fas fa-mobile-alt"></i>
                        Web App Manifest
                    </a>
                </li>
            </ul>
        </div>
        
        <div class="sitemap-section">
            <h2><i class="fas fa-download"></i> Resources</h2>
            <ul class="sitemap-list">
                <li>
                    <a href="/assets/logo.svg">
                        <i class="fas fa-image"></i>
                        Logo (SVG)
                    </a>
                </li>
                <li>
                    <a href="/assets/app-preview-min.png">
                        <i class="fas fa-mobile-alt"></i>
                        App Preview Image
                    </a>
                </li>
                <li>
                    <a href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;500;600;700;800&display=swap">
                        <i class="fas fa-font"></i>
                        Google Fonts
                    </a>
                </li>
            </ul>
        </div>
    </div>
</body>
</html>`;
  
  try {
    await fs.writeFile('sitemap.html', html);
    console.log('✅ Generated: sitemap.html (for users)');
  } catch (error) {
    console.log('⚠️ Could not generate HTML sitemap:', error.message);
  }
}

// Generate JSON-LD structured data
async function generateStructuredData() {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${config.baseUrl}/#website`,
        "url": config.baseUrl,
        "name": "Microokoa Guaranty Capital",
        "description": config.sections[0].description,
        "publisher": {
          "@id": `${config.baseUrl}/#organization`
        },
        "inLanguage": "en"
      },
      {
        "@type": "Organization",
        "@id": `${config.baseUrl}/#organization`,
        "name": "Microokoa Guaranty Capital",
        "url": config.baseUrl,
        "logo": {
          "@type": "ImageObject",
          "url": `${config.baseUrl}/assets/logo.svg`,
          "width": "512",
          "height": "512"
        },
        "description": "Community development financial institution providing donation-based financing",
        "address": {
          "@type": "PostalAddress",
          "addressLocality": "Nairobi",
          "addressCountry": "KE"
        },
        "contactPoint": {
          "@type": "ContactPoint",
          "telephone": "+254-710-340-896",
          "contactType": "customer service",
          "availableLanguage": ["en", "sw"]
        }
      }
    ]
  };
  
  // Add breadcrumb list
  const breadcrumbList = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": config.sections.map((section, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": section.title,
      "item": `${config.baseUrl}${section.url}`
    }))
  };
  
  try {
    await fs.writeFile('structured-data.json', JSON.stringify(structuredData, null, 2));
    await fs.writeFile('breadcrumbs.json', JSON.stringify(breadcrumbList, null, 2));
    console.log('✅ Generated: structured-data.json');
    console.log('✅ Generated: breadcrumbs.json');
  } catch (error) {
    console.log('⚠️ Could not generate structured data:', error.message);
  }
}

// Generate sitemap report
async function generateReport() {
  const report = {
    generated: new Date().toISOString(),
    baseUrl: config.baseUrl,
    totalUrls: config.sections.length + config.staticPages.length,
    sections: config.sections.map(s => ({
      url: s.url,
      priority: s.priority,
      changefreq: s.changefreq
    })),
    staticPages: config.staticPages.map(p => ({
      url: p.url,
      priority: p.priority
    })),
    filesGenerated: [
      'sitemap.xml',
      'robots.txt',
      'sitemap.html',
      'structured-data.json',
      'breadcrumbs.json'
    ]
  };
  
  try {
    await fs.writeFile('sitemap-report.json', JSON.stringify(report, null, 2));
    console.log('✅ Generated: sitemap-report.json');
    
    // Print summary
    console.log('\n📋 Sitemap Generation Summary:');
    console.log('='.repeat(50));
    console.log(`Base URL: ${config.baseUrl}`);
    console.log(`Total URLs: ${report.totalUrls}`);
    console.log(`Main Sections: ${config.sections.length}`);
    console.log(`Static Pages: ${config.staticPages.length}`);
    console.log(`Files Generated: ${report.filesGenerated.length}`);
    console.log(`Generation Time: ${new Date().toLocaleString()}`);
    console.log('='.repeat(50));
    
  } catch (error) {
    console.log('⚠️ Could not generate report:', error.message);
  }
}

// Main execution
async function main() {
  console.log('🚀 Starting sitemap generation...\n');
  
  try {
    // Generate all files
    await generateSitemap();
    await generateHtmlSitemap();
    await generateStructuredData();
    await generateReport();
    
    console.log('\n🎉 All files generated successfully!');
    console.log('\n📝 Next steps:');
    console.log('1. Upload all generated files to your server');
    console.log(`2. Submit sitemap to Google Search Console: ${config.baseUrl}/sitemap.xml`);
    console.log('3. Update robots.txt on production server');
    console.log('4. Test sitemap with: https://search.google.com/test/rich-results');
    console.log('5. Monitor indexing in Google Search Console');
    
  } catch (error) {
    console.error('❌ Error in main execution:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = {
  generateSitemap,
  generateRobotsTxt,
  generateHtmlSitemap,
  generateStructuredData,
  generateReport,
  config
};
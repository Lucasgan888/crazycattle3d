'use client';

import { analyticsConfig, getAnalyticsStatus } from '@/config/analytics';

// 搜索引擎验证组件
// Search engine verification component
export default function SearchEngineVerification() {
  const status = getAnalyticsStatus();
  const { gsc, bing } = analyticsConfig;
  
  return (
    <>
      {/* Google Search Console 验证 / Google Search Console verification */}
      {status.hasGSCVerification && (
        <meta 
          name="google-site-verification" 
          content={gsc.verificationCode}
        />
      )}
      
      {/* Bing 站长工具验证 / Bing Webmaster Tools verification */}
      {status.hasBingVerification && (
        <meta 
          name="msvalidate.01" 
          content={bing.verificationCode}
        />
      )}
      
      {/* 其他搜索引擎验证（预留）/ Other search engines verification (reserved) */}
      {process.env.NEXT_PUBLIC_YANDEX_VERIFICATION && (
        <meta 
          name="yandex-verification" 
          content={process.env.NEXT_PUBLIC_YANDEX_VERIFICATION}
        />
      )}
      
      {process.env.NEXT_PUBLIC_BAIDU_VERIFICATION && (
        <meta 
          name="baidu-site-verification" 
          content={process.env.NEXT_PUBLIC_BAIDU_VERIFICATION}
        />
      )}
      
      {/* 开发环境调试信息 / Development debug info */}
      {process.env.NODE_ENV === 'development' && (
        <script
          dangerouslySetInnerHTML={{
            __html: `
              console.log('🔍 Search Engine Verification Status:', {
                gsc: ${status.hasGSCVerification},
                bing: ${status.hasBingVerification},
                environment: '${process.env.NODE_ENV}'
              });
            `
          }}
        />
      )}
    </>
  );
}

// 站点地图提交辅助组件
// Sitemap submission helper component
export function SitemapMetaTags({ 
  sitemapUrl = '/sitemap.xml',
  robotsUrl = '/robots.txt' 
}: { 
  sitemapUrl?: string;
  robotsUrl?: string;
}) {
  return (
    <>
      {/* 站点地图链接 / Sitemap links */}
      <link rel="sitemap" type="application/xml" href={sitemapUrl} />
      
      {/* Robots.txt 链接 / Robots.txt link */}
      <link rel="robots" type="text/plain" href={robotsUrl} />
      
      {/* RSS 源链接（如果有）/ RSS feed link (if available) */}
      {process.env.NEXT_PUBLIC_RSS_FEED_URL && (
        <link 
          rel="alternate" 
          type="application/rss+xml" 
          title="RSS Feed" 
          href={process.env.NEXT_PUBLIC_RSS_FEED_URL}
        />
      )}
    </>
  );
}

// 结构化数据组件（游戏网站专用）
// Structured data component (game website specific)
export function GameWebsiteStructuredData({
  siteName,
  siteUrl,
  gameTitle,
  gameDescription,
  gameCategory
}: {
  siteName: string;
  siteUrl: string;
  gameTitle: string;
  gameDescription: string;
  gameCategory: string;
}) {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${siteUrl}#website`,
        "url": siteUrl,
        "name": siteName,
        "description": gameDescription,
        "potentialAction": [
          {
            "@type": "SearchAction",
            "target": {
              "@type": "EntryPoint",
              "urlTemplate": `${siteUrl}/search?q={search_term_string}`
            },
            "query-input": "required name=search_term_string"
          }
        ],
        "inLanguage": "en-US"
      },
      {
        "@type": "Game",
        "@id": `${siteUrl}#game`,
        "name": gameTitle,
        "description": gameDescription,
        "category": gameCategory,
        "url": siteUrl,
        "gamePlatform": "Web Browser",
        "applicationCategory": "Game",
        "operatingSystem": "Any",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD"
        },
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": "4.5",
          "reviewCount": "100",
          "bestRating": "5",
          "worstRating": "1"
        }
      },
      {
        "@type": "Organization",
        "@id": `${siteUrl}#organization`,
        "name": siteName,
        "url": siteUrl,
        "logo": {
          "@type": "ImageObject",
          "url": `${siteUrl}/favicon.ico`
        },
        "sameAs": []
      }
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData, null, 2)
      }}
    />
  );
}
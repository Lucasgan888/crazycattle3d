import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { mainGameConfig } from "@/config/main-game";
import GoogleAnalytics from '@/components/Analytics/GoogleAnalytics';
import SearchEngineVerification, { SitemapMetaTags, GameWebsiteStructuredData } from '@/components/SEO/SearchEngineVerification';

const inter = Inter({ subsets: ['latin'] });

// 从配置文件生成metadata
// Generate metadata from config file
export const metadata: Metadata = {
  metadataBase: new URL(mainGameConfig.seo.canonicalBase),
  title: {
    template: mainGameConfig.seo.titleTemplate,
    default: mainGameConfig.seo.defaultTitle,
  },
  description: mainGameConfig.seo.description,
  keywords: mainGameConfig.seo.keywords,
  
  // OpenGraph配置
  // OpenGraph configuration
  openGraph: {
    title: mainGameConfig.seo.defaultTitle,
    description: mainGameConfig.seo.description,
    siteName: mainGameConfig.seo.openGraph.siteName,
    type: mainGameConfig.seo.openGraph.type,
    images: mainGameConfig.seo.openGraph.image ? [mainGameConfig.seo.openGraph.image] : [],
    url: mainGameConfig.seo.openGraph.url,
    locale: 'en_US',
  },
  
  // Twitter配置
  // Twitter configuration
  twitter: {
    card: mainGameConfig.seo.twitter?.card,
    site: mainGameConfig.seo.twitter?.site,
    title: mainGameConfig.seo.defaultTitle,
    description: mainGameConfig.seo.description,
    images: mainGameConfig.seo.openGraph.image ? [mainGameConfig.seo.openGraph.image] : [],
  },
  
  // 其他SEO配置
  // Other SEO configuration
  alternates: {
    canonical: mainGameConfig.seo.canonicalBase,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* 搜索引擎验证 / Search engine verification */}
        <SearchEngineVerification />
        
        {/* 站点地图和Robots.txt / Sitemap and Robots.txt */}
        <SitemapMetaTags />
        
        {/* 额外的SEO标签 / Additional SEO tags */}
        <meta name="keywords" content={mainGameConfig.seo.keywords.join(', ')} />
        <link rel="canonical" href={mainGameConfig.seo.canonicalBase} />
        
        {/* 图标文件 - 使用默认路径 / Icon files - using default paths */}
        <link rel="apple-touch-icon" sizes="180x180" href="/assets/img/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/assets/img/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/assets/img/favicon-16x16.png" />
        <link rel="manifest" href="/assets/img/site.webmanifest" />
        <link rel="shortcut icon" href="/assets/img/favicon.ico" />
        <meta name="theme-color" content="#ffffff" />
        
        {/* 增强的游戏网站结构化数据 / Enhanced game website structured data */}
        <GameWebsiteStructuredData 
          siteName={mainGameConfig.seo.siteName}
          siteUrl={mainGameConfig.seo.canonicalBase}
          gameTitle={mainGameConfig.mainGame.name}
          gameDescription={mainGameConfig.mainGame.description}
          gameCategory={mainGameConfig.mainGame.seoContent.category}
        />
      </head>
      <body className={inter.className}>
        {/* Google Analytics 4 集成 / Google Analytics 4 integration */}
        <GoogleAnalytics />
        
        {children}
      </body>
    </html>
  );
}


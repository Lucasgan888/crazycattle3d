// GA4 和其他分析工具配置
// GA4 and other analytics tools configuration
export interface AnalyticsConfig {
  // Google Analytics 4 配置
  // Google Analytics 4 configuration
  ga4: {
    measurementId: string;        // GA4 衡量ID，如 'G-XXXXXXXXXX'
    enabled: boolean;             // 是否启用GA4
    debugMode?: boolean;          // 调试模式（开发环境）
    customEvents: {
      gameStart: string;          // 游戏开始事件名
      gameComplete: string;       // 游戏完成事件名
      adClick: string;            // 广告点击事件名
      gameSwitch: string;         // 游戏切换事件名
      fullscreen: string;         // 全屏事件名
    };
  };
  
  // Google Search Console 配置
  // Google Search Console configuration
  gsc: {
    verificationCode: string;     // GSC 验证代码
    siteUrl: string;             // 网站URL
    autoSubmitSitemap: boolean;   // 自动提交sitemap
  };
  
  // Bing 站长工具配置
  // Bing Webmaster Tools configuration
  bing: {
    verificationCode: string;     // Bing 验证代码
    siteUrl: string;             // 网站URL
    autoSubmitSitemap: boolean;   // 自动提交sitemap
  };
  
  // 其他分析工具配置（预留）
  // Other analytics tools configuration (reserved)
  other: {
    hotjar?: {
      siteId: string;
      enabled: boolean;
    };
    clarity?: {
      projectId: string;
      enabled: boolean;
    };
  };
}

// 默认分析配置（需要替换真实ID）
// Default analytics config (replace with real IDs)
export const analyticsConfig: AnalyticsConfig = {
  ga4: {
    measurementId: process.env.NEXT_PUBLIC_GA_ID || 'G-PLACEHOLDER',
    enabled: process.env.NODE_ENV === 'production' && process.env.NEXT_PUBLIC_GA_ID !== 'G-PLACEHOLDER',
    debugMode: process.env.NODE_ENV === 'development',
    customEvents: {
      gameStart: 'game_start',
      gameComplete: 'game_complete', 
      adClick: 'ad_click',
      gameSwitch: 'game_switch',
      fullscreen: 'fullscreen_toggle'
    }
  },
  gsc: {
    verificationCode: process.env.NEXT_PUBLIC_GSC_VERIFICATION || 'placeholder-gsc-code',
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://crazy-cattle.net',
    autoSubmitSitemap: true
  },
  bing: {
    verificationCode: process.env.NEXT_PUBLIC_BING_VERIFICATION || 'placeholder-bing-code',
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://crazy-cattle.net',
    autoSubmitSitemap: true
  },
  other: {
    hotjar: {
      siteId: process.env.NEXT_PUBLIC_HOTJAR_ID || '',
      enabled: false
    },
    clarity: {
      projectId: process.env.NEXT_PUBLIC_CLARITY_ID || '',
      enabled: false
    }
  }
};

// 辅助函数
// Helper functions
export function getAnalyticsStatus() {
  return {
    ga4Enabled: analyticsConfig.ga4.enabled,
    hasRealGA4Id: analyticsConfig.ga4.measurementId !== 'G-PLACEHOLDER',
    hasGSCVerification: analyticsConfig.gsc.verificationCode !== 'placeholder-gsc-code',
    hasBingVerification: analyticsConfig.bing.verificationCode !== 'placeholder-bing-code',
    isProduction: process.env.NODE_ENV === 'production',
    debugMode: analyticsConfig.ga4.debugMode
  };
}
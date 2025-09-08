// AdSense 广告配置
// AdSense ads configuration
export interface AdsConfig {
  adsenseId: string;              // AdSense 发布商ID
  enabled: boolean;               // 是否启用广告
  testMode: boolean;              // 测试模式
  autoAds: boolean;               // 是否启用自动广告
  
  // 广告单元配置
  // Ad units configuration
  adUnits: {
    headerBanner: {
      slot: string;               // 广告位ID
      size: string;               // 广告尺寸
      position: 'header';
      description: string;        // 广告位描述
      responsive: boolean;        // 是否响应式
    };
    gameTopBanner: {
      slot: string;
      size: string;
      position: 'game-top';
      description: string;
      responsive: boolean;
    };
    gameBottomBanner: {
      slot: string;
      size: string;
      position: 'game-bottom';
      description: string;
      responsive: boolean;
    };
    sidebarSquare: {
      slot: string;
      size: string;
      position: 'sidebar';
      description: string;
      responsive: boolean;
    };
    contentBanner: {
      slot: string;
      size: string;
      position: 'content';
      description: string;
      responsive: boolean;
    };
    mobileFooter: {
      slot: string;
      size: string;
      position: 'mobile-footer';
      description: string;
      responsive: boolean;
    };
  };
  
  // 广告策略配置
  // Ad strategy configuration
  strategy: {
    maxAdsPerPage: number;        // 每页最大广告数
    minContentLength: number;     // 显示广告的最小内容长度
    adFrequency: number;          // 广告显示频率（秒）
    mobileOptimized: boolean;     // 移动端优化
  };
}

// 默认广告配置（占位符）
// Default ads config (placeholders)
export const adsConfig: AdsConfig = {
  adsenseId: process.env.NEXT_PUBLIC_ADSENSE_ID || 'ca-pub-PLACEHOLDER',
  enabled: process.env.NODE_ENV === 'production' && 
           process.env.NEXT_PUBLIC_ADSENSE_ID !== 'ca-pub-PLACEHOLDER' && 
           process.env.NEXT_PUBLIC_ADSENSE_ID !== undefined,
  testMode: process.env.NODE_ENV === 'development',
  autoAds: false, // 手动控制广告位置
  
  adUnits: {
    headerBanner: {
      slot: process.env.NEXT_PUBLIC_AD_SLOT_HEADER || 'PLACEHOLDER-SLOT-1',
      size: '728x60',
      position: 'header',
      description: '网站顶部横幅广告 / Header banner ad',
      responsive: true
    },
    gameTopBanner: {
      slot: process.env.NEXT_PUBLIC_AD_SLOT_GAME_TOP || 'PLACEHOLDER-SLOT-2', 
      size: '320x50',
      position: 'game-top',
      description: '游戏上方横幅广告 / Above game banner ad',
      responsive: true
    },
    gameBottomBanner: {
      slot: process.env.NEXT_PUBLIC_AD_SLOT_GAME_BOTTOM || 'PLACEHOLDER-SLOT-3',
      size: '728x90', 
      position: 'game-bottom',
      description: '游戏下方横幅广告 / Below game banner ad',
      responsive: true
    },
    sidebarSquare: {
      slot: process.env.NEXT_PUBLIC_AD_SLOT_SIDEBAR || 'PLACEHOLDER-SLOT-4',
      size: '300x250',
      position: 'sidebar',
      description: '侧边栏方形广告 / Sidebar square ad',
      responsive: true
    },
    contentBanner: {
      slot: process.env.NEXT_PUBLIC_AD_SLOT_CONTENT || 'PLACEHOLDER-SLOT-5',
      size: '336x280',
      position: 'content', 
      description: '内容区域广告 / Content area ad',
      responsive: true
    },
    mobileFooter: {
      slot: process.env.NEXT_PUBLIC_AD_SLOT_MOBILE || 'PLACEHOLDER-SLOT-6',
      size: '320x50',
      position: 'mobile-footer',
      description: '移动端底部广告 / Mobile footer ad',
      responsive: true
    }
  },
  
  strategy: {
    maxAdsPerPage: 5,             // 每页最多5个广告
    minContentLength: 300,        // 内容少于300字不显示广告
    adFrequency: 30,              // 30秒间隔
    mobileOptimized: true         // 移动端优化
  }
};

// 辅助函数
// Helper functions

// 检查广告是否应该显示
// Check if ads should be displayed
export function shouldShowAds(): boolean {
  return adsConfig.enabled && typeof window !== 'undefined';
}

// 检查是否为移动设备
// Check if mobile device
export function isMobileDevice(): boolean {
  if (typeof window === 'undefined') return false;
  return window.innerWidth < 768;
}

// 获取适合当前设备的广告尺寸
// Get appropriate ad size for current device
export function getResponsiveAdSize(baseSize: string): string {
  if (!isMobileDevice()) return baseSize;
  
  // 移动端尺寸映射
  // Mobile size mapping
  const mobileMapping: Record<string, string> = {
    '728x90': '320x50',
    '728x60': '320x50',
    '300x250': '320x100',
    '336x280': '320x100'
  };
  
  return mobileMapping[baseSize] || baseSize;
}

// 获取广告状态
// Get ads status
export function getAdsStatus() {
  return {
    enabled: adsConfig.enabled,
    testMode: adsConfig.testMode,
    hasRealAdsenseId: adsConfig.adsenseId !== 'ca-pub-PLACEHOLDER',
    isProduction: process.env.NODE_ENV === 'production',
    totalAdUnits: Object.keys(adsConfig.adUnits).length
  };
}

// 广告位置类型
// Ad position types
export type AdPosition = keyof typeof adsConfig.adUnits;
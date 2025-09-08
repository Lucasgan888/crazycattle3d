// 游戏嵌入方式：iframe（外链）或 local（本地文件）
// Game embed type: iframe (external) or local (local files)
export type EmbedType = 'iframe' | 'local';

// 游戏信息结构
// Game information structure
export interface Game {
  id: string;            // 游戏ID，如 'crazy-cattle-3d'
  name: string;          // 游戏名称，如 'Crazy Cattle 3D'
  slug: string;          // URL路径，如 'crazy-cattle-3d'
  description: string;   // 游戏描述
  keywords: string[];    // SEO关键词数组
  thumbnail?: string;    // 预览图路径
  
  // 游戏嵌入配置 - 这是关键部分！
  // Game embed config - This is the key part!
  embed: {
    type: EmbedType;     // 'iframe' 或 'local'
    iframeSrc?: string;  // 如果是iframe，这里是游戏链接
    localPath?: string;  // 如果是本地文件，这里是文件路径
  };
  
  // SEO内容自动生成配置
  // SEO content auto-generation config
  seoContent: {
    targetWordCount: number;    // 目标字数，建议800+
    keywordDensity: number;     // 关键词密度，建议3-5%
    category: string;           // 游戏类别
    features: string[];         // 游戏特色列表
  };
}

// 网站SEO配置
// Website SEO configuration
export interface SiteSEO {
  siteName: string;      // 网站名称
  domain: string;        // 域名，如 'crazy-cattle.net'
  titleTemplate: string; // 标题模板，如 '%s - Official Site'
  defaultTitle: string;  // 默认标题
  description: string;   // 网站描述
  keywords: string[];    // 网站关键词
  
  // 社交媒体分享配置
  // Social media sharing config
  openGraph: {
    siteName: string;
    type: 'website';
    image?: string;      // 分享图片
    url?: string;        // 网站URL
  };
  
  // Twitter卡片配置
  // Twitter card config
  twitter?: {
    card: 'summary_large_image';
    site?: string;       // @用户名
  };
  
  canonicalBase: string; // 标准URL基础，如 'https://crazy-cattle.net'
}

// 主配置文件结构
// Main config file structure
export interface MainGameConfig {
  mainGame: Game;        // 主游戏配置
  site: {
    name: string;        // 网站名称
    domain: string;      // 域名
  };
  seo: SiteSEO;         // SEO配置
}
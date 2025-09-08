import type { MainGameConfig } from './types';

// 当前主游戏配置（Crazy Cattle 3D）
// Current main game config (Crazy Cattle 3D)
export const mainGameConfig: MainGameConfig = {
  mainGame: {
    id: 'crazy-cattle-3d',
    name: 'Crazy Cattle 3D',
    slug: 'crazy-cattle-3d',
    description: 'Play Crazy Cattle 3D unblocked online for free. Control crazy cattle in this 3D action game. No download required, start playing instantly in your browser!',
    keywords: ['Crazy Cattle 3D', 'physics game', '3D action', 'browser game', 'free online game', 'unblocked game', 'battle royale'],
    thumbnail: '/assets/img/crazy-cattle-3d-og-image.png',
    
    // 嵌入配置 - 本地Godot游戏文件
    // Embed config - Local Godot game files
    embed: {
      type: 'local',
      localPath: '/game/crazycattle3d/index.html'
    },
    
    // SEO内容生成配置
    // SEO content generation config
    seoContent: {
      targetWordCount: 800,     // 目标800字以上
      keywordDensity: 4.0,      // 4%关键词密度
      category: 'Action',       // 动作类游戏
      features: [
        'Physics-based gameplay',
        '3D graphics',
        'Free to play',
        'No download required',
        'Browser-based gaming',
        'Battle royale mechanics',
        'Explosive sheep battles',
        'Multiple arena environments'
      ]
    }
  },
  
  site: {
    name: 'Crazy Cattle 3D',
    domain: 'crazy-cattle.net'
  },
  
  seo: {
    siteName: 'Crazy Cattle 3D',
    domain: 'crazy-cattle.net',
    titleTemplate: '%s - Crazy Cattle 3D Official Site',
    defaultTitle: 'Crazy Cattle 3D - Free Physics-Based 3D Action Game',
    description: 'Play Crazy Cattle 3D online for free. Experience explosive sheep battles in this physics-based 3D action game. No download required - play directly in your browser.',
    keywords: ['Crazy Cattle 3D', 'free online game', 'physics game', '3D action', 'browser game', 'unblocked game', 'battle royale'],
    openGraph: {
      siteName: 'Crazy Cattle 3D',
      type: 'website',
      image: '/assets/img/crazy-cattle-3d-og-image.png',
      url: 'https://crazy-cattle.net'
    },
    twitter: {
      card: 'summary_large_image',
      site: '@CrazyCattle'
    },
    canonicalBase: 'https://crazy-cattle.net'
  }
};
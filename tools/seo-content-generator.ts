import type { Game } from '@/config/types';

// SEO内容生成器类
// SEO content generator class
export class SEOContentGenerator {
  
  // 生成游戏页面完整内容
  // Generate complete game page content
  generateGamePage(game: Game): {
    title: string;        // 页面标题
    description: string;  // 页面描述
    content: string;      // 完整内容（HTML格式）
    wordCount: number;    // 字数统计
    keywordDensity: number; // 关键词密度
  } {
    const primaryKeyword = game.name;
    const features = game.seoContent.features;
    
    // 生成各个部分的内容
    // Generate content for each section
    const intro = this.generateIntroduction(game, primaryKeyword);
    const featuresSection = this.generateFeaturesSection(features, primaryKeyword);
    const howToPlay = this.generateHowToPlay(game);
    const faq = this.generateFAQ(game);
    
    // 组合完整内容
    // Combine complete content
    const fullContent = `
      <div class="game-content prose prose-lg max-w-none">
        ${intro}
        ${featuresSection}
        ${howToPlay}
        ${faq}
      </div>
    `;
    
    const wordCount = this.countWords(fullContent);
    const keywordDensity = this.calculateKeywordDensity(fullContent, primaryKeyword);
    
    return {
      title: `${game.name} - Free Online ${game.seoContent.category} Game`,
      description: game.description,
      content: fullContent,
      wordCount,
      keywordDensity
    };
  }
  
  // 生成游戏介绍部分（200-250字）
  // Generate game introduction section (200-250 words)
  private generateIntroduction(game: Game, keyword: string): string {
    return `
      <section class="game-intro mb-12">
        <h1 class="text-4xl font-bold mb-6">${game.name} - Play Free Online</h1>
        <p class="text-lg leading-relaxed mb-6">
          Welcome to ${keyword}, an exciting ${game.seoContent.category.toLowerCase()} game that brings ${game.description} Experience the thrill of ${keyword} directly in your browser without any downloads required.
        </p>
        
        <p class="text-lg leading-relaxed mb-6">
          ${keyword} offers an immersive gaming experience with cutting-edge graphics and engaging gameplay mechanics. This free online game has been designed to provide hours of entertainment for players of all skill levels. Whether you're a casual gamer or a hardcore enthusiast, ${keyword} delivers the perfect blend of challenge and fun.
        </p>
        
        <p class="text-lg leading-relaxed mb-6">
          Join thousands of players worldwide who have already discovered the excitement of ${keyword}. The game features intuitive controls, stunning visuals, and addictive gameplay that will keep you coming back for more. Start your adventure today and see why ${keyword} has become one of the most popular online games.
        </p>
      </section>
    `;
  }
  
  // 生成特色功能部分
  // Generate features section
  private generateFeaturesSection(features: string[], keyword: string): string {
    const featureItems = features.map(feature => 
      `<li class="mb-3"><strong>${feature}</strong>: Experience this amazing feature in ${keyword}</li>`
    ).join('');
    
    return `
      <section class="game-features mb-12">
        <h2 class="text-3xl font-bold mb-8">Why Choose ${keyword}?</h2>
        <p class="text-lg leading-relaxed mb-6">
          ${keyword} stands out from other online games with its unique features and exceptional gameplay quality. Here's what makes this game special:
        </p>
        <ul class="features-list space-y-2 mb-6 text-lg">
          ${featureItems}
        </ul>
        <p class="text-lg leading-relaxed">
          These features make ${keyword} the perfect choice for anyone looking for high-quality online entertainment. The combination of innovative gameplay mechanics and polished presentation ensures that every gaming session with ${keyword} is memorable and engaging.
        </p>
      </section>
    `;
  }
  
  // 生成玩法说明部分
  // Generate how to play section
  private generateHowToPlay(game: Game): string {
    return `
      <section class="how-to-play mb-12">
        <h2 class="text-3xl font-bold mb-8">How to Play ${game.name}</h2>
        <p class="text-lg leading-relaxed mb-6">
          Getting started with ${game.name} is easy and straightforward. Follow these simple steps to begin your gaming adventure:
        </p>
        
        <h3 class="text-2xl font-semibold mb-4">Getting Started</h3>
        <ol class="list-decimal list-inside space-y-2 mb-8 text-lg pl-4">
          <li>Click the "Play Now" button above to load ${game.name}</li>
          <li>Wait for the game to fully load in your browser</li>
          <li>Follow the on-screen instructions to learn the basic controls</li>
          <li>Start playing and enjoy the ${game.seoContent.category.toLowerCase()} experience</li>
        </ol>
        
        <h3 class="text-2xl font-semibold mb-4">Game Controls</h3>
        <p class="text-lg leading-relaxed mb-6">
          ${game.name} features intuitive controls that are easy to learn but challenging to master. The game responds to both keyboard and mouse inputs, providing a smooth and responsive gaming experience. The control scheme has been carefully designed to be accessible for new players while offering depth for experienced gamers.
        </p>
        
        <h3 class="text-2xl font-semibold mb-4">Tips for Success</h3>
        <p class="text-lg leading-relaxed mb-6">
          To excel in ${game.name}, practice regularly and experiment with different strategies. The game rewards skill and creativity, so don't be afraid to try new approaches to overcome challenges. Pay attention to the game's physics and mechanics, as understanding these systems will give you a significant advantage over other players.
        </p>
        
        <p class="text-lg leading-relaxed">
          Remember that ${game.name} is designed to be fun above all else. Don't get discouraged if you don't master everything immediately - the joy is in the learning process and the exciting moments that emerge from dynamic gameplay.
        </p>
      </section>
    `;
  }
  
  // 生成FAQ部分
  // Generate FAQ section
  private generateFAQ(game: Game): string {
    return `
      <section class="faq mb-12">
        <h2 class="text-3xl font-bold mb-8">Frequently Asked Questions</h2>
        
        <div class="space-y-8">
          <div class="faq-item">
            <h3 class="text-xl font-semibold mb-3">Is ${game.name} free to play?</h3>
            <p class="text-lg leading-relaxed">
              Yes, ${game.name} is completely free to play. You can enjoy the full game experience without any cost or hidden fees. There are no premium subscriptions or pay-to-win elements - everyone has access to the same great gameplay.
            </p>
          </div>
          
          <div class="faq-item">
            <h3 class="text-xl font-semibold mb-3">Do I need to download anything to play ${game.name}?</h3>
            <p class="text-lg leading-relaxed">
              No downloads are required. ${game.name} runs directly in your web browser, making it instantly accessible on any device with an internet connection. This browser-based approach means you can start playing immediately without waiting for installations or updates.
            </p>
          </div>
          
          <div class="faq-item">
            <h3 class="text-xl font-semibold mb-3">What devices can run ${game.name}?</h3>
            <p class="text-lg leading-relaxed">
              ${game.name} is compatible with most modern devices including desktop computers, laptops, tablets, and smartphones. The game automatically adjusts to your screen size for the best experience. We recommend using a recent version of Chrome, Firefox, Safari, or Edge for optimal performance.
            </p>
          </div>
          
          <div class="faq-item">
            <h3 class="text-xl font-semibold mb-3">How do I save my progress in ${game.name}?</h3>
            <p class="text-lg leading-relaxed">
              Your game progress in ${game.name} is automatically saved in your browser's local storage. You can continue playing from where you left off when you return to the game. For the best experience, we recommend using the same browser and device for consistent progress tracking.
            </p>
          </div>
          
          <div class="faq-item">
            <h3 class="text-xl font-semibold mb-3">Can I play ${game.name} offline?</h3>
            <p class="text-lg leading-relaxed">
              ${game.name} requires an internet connection to play initially. This ensures you always have access to the latest features and updates. Some game content may be cached in your browser for improved loading times on subsequent visits.
            </p>
          </div>
          
          <div class="faq-item">
            <h3 class="text-xl font-semibold mb-3">Is ${game.name} suitable for all ages?</h3>
            <p class="text-lg leading-relaxed">
              ${game.name} is designed to be family-friendly and suitable for players of all ages. The game features ${game.seoContent.category.toLowerCase()} gameplay that is engaging without being overly complex or containing inappropriate content.
            </p>
          </div>
        </div>
      </section>
    `;
  }
  
  // 统计英文单词数量
  // Count English words
  private countWords(text: string): number {
    const cleanText = text.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
    return cleanText.split(' ').filter(word => word.length > 0).length;
  }
  
  // 计算关键词密度
  // Calculate keyword density
  private calculateKeywordDensity(text: string, keyword: string): number {
    const cleanText = text.replace(/<[^>]*>/g, ' ').toLowerCase();
    const totalWords = this.countWords(text);
    const keywordCount = (cleanText.match(new RegExp(keyword.toLowerCase(), 'g')) || []).length;
    return totalWords > 0 ? (keywordCount / totalWords) * 100 : 0;
  }
  
  // 生成简化版内容（用于快速预览）
  // Generate simplified content (for quick preview)
  generateSimpleContent(game: Game): string {
    const primaryKeyword = game.name;
    
    return `
      <div class="simple-game-content">
        <h1>${primaryKeyword} - Play Free Online</h1>
        <p>${game.description}</p>
        
        <h2>Game Features</h2>
        <ul>
          ${game.seoContent.features.map(feature => `<li>${feature}</li>`).join('')}
        </ul>
        
        <h2>How to Play</h2>
        <p>Click the play button above to start ${primaryKeyword}. Use your keyboard and mouse to control the game.</p>
        
        <p>Enjoy playing ${primaryKeyword} for free in your browser!</p>
      </div>
    `;
  }
}
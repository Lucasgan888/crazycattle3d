import fs from 'fs-extra';
import path from 'path';
import { execSync } from 'child_process';
import type { MainGameConfig, Game } from '@/config/types';

// 切换选项配置
// Switch options configuration
interface SwitchOptions {
  name: string;              // 新游戏名称
  slug?: string;             // URL路径（可选，会自动生成）
  description?: string;      // 游戏描述
  keywords?: string[];       // 关键词数组
  uploadDir?: string;        // 上传的游戏文件目录
  embedType?: 'iframe' | 'local'; // 嵌入类型
  iframeSrc?: string;        // 如果是iframe，外链地址
  dryRun?: boolean;          // 预览模式，不实际修改
  backup?: boolean;          // 是否备份（默认true）
  category?: string;         // 游戏类别
  domain?: string;           // 自定义域名
}

export class GameSwitcher {
  private backupDir = 'backups';
  private configPath = 'config/main-game.ts';
  
  // 主要切换方法
  // Main switch method
  async switchMainGame(options: SwitchOptions): Promise<void> {
    console.log('🎮 开始切换主游戏 / Starting main game switch...');
    
    try {
      // 1. 验证输入参数
      // 1. Validate input parameters
      this.validateOptions(options);
      
      // 2. 生成游戏配置
      // 2. Generate game configuration
      const newConfig = this.generateGameConfig(options);
      
      // 3. 如果是预览模式，只显示变更
      // 3. If dry run, only show changes
      if (options.dryRun) {
        console.log('📋 预览模式 - 将要进行的变更 / Dry run - Changes to be made:');
        console.log(JSON.stringify(newConfig, null, 2));
        return;
      }
      
      // 4. 备份当前配置和文件
      // 4. Backup current config and files
      if (options.backup !== false) {
        await this.createBackup();
      }
      
      // 5. 处理游戏文件上传
      // 5. Handle game file upload
      if (options.uploadDir) {
        await this.handleGameUpload(options.uploadDir, newConfig.mainGame.slug);
      }
      
      // 6. 更新配置文件
      // 6. Update configuration file
      await this.updateConfigFile(newConfig);
      
      // 7. 重新生成sitemap
      // 7. Regenerate sitemap
      await this.regenerateSitemap();
      
      // 8. 生成SEO内容
      // 8. Generate SEO content
      await this.generateSEOContent(newConfig.mainGame);
      
      console.log('✅ 游戏切换完成 / Game switch completed!');
      console.log(`🌐 新主游戏 / New main game: ${newConfig.mainGame.name}`);
      console.log(`🔗 域名 / Domain: ${newConfig.seo.canonicalBase}`);
      
    } catch (error) {
      console.error('❌ 切换失败 / Switch failed:', error);
      throw error;
    }
  }
  
  // 验证选项
  // Validate options
  private validateOptions(options: SwitchOptions): void {
    if (!options.name || options.name.trim().length === 0) {
      throw new Error('游戏名称不能为空 / Game name cannot be empty');
    }
    
    if (options.embedType === 'iframe' && !options.iframeSrc) {
      throw new Error('iframe类型需要提供iframeSrc / iframe type requires iframeSrc');
    }
    
    if (options.uploadDir && !fs.existsSync(options.uploadDir)) {
      throw new Error(`上传目录不存在 / Upload directory does not exist: ${options.uploadDir}`);
    }
  }
  
  // 生成游戏配置
  // Generate game configuration
  private generateGameConfig(options: SwitchOptions): MainGameConfig {
    const slug = options.slug || this.generateSlug(options.name);
    const description = options.description || `Play ${options.name} online for free. ${options.category || 'Action'} game with exciting gameplay. No download required!`;
    const keywords = options.keywords || [options.name, 'free game', 'online game', 'browser game', 'unblocked game'];
    const category = options.category || 'Action';
    const domain = options.domain || 'crazy-cattle.net';
    
    return {
      mainGame: {
        id: slug,
        name: options.name,
        slug: slug,
        description: description,
        keywords: keywords,
        thumbnail: `/assets/${slug}/og-image.jpg`,
        embed: {
          type: options.embedType || 'local',
          ...(options.embedType === 'iframe' ? 
            { iframeSrc: options.iframeSrc } : 
            { localPath: `/game/${slug}/index.html` }
          )
        },
        seoContent: {
          targetWordCount: 800,
          keywordDensity: 4.0,
          category: category,
          features: [
            'Free to play',
            'No download required', 
            'Browser-based gaming',
            'High-quality graphics',
            'Engaging gameplay',
            'Mobile friendly',
            'Instant play',
            'Regular updates'
          ]
        }
      },
      site: {
        name: options.name,
        domain: domain
      },
      seo: {
        siteName: options.name,
        domain: domain,
        titleTemplate: `%s - ${options.name} Official Site`,
        defaultTitle: `${options.name} - Free Online ${category} Game`,
        description: description,
        keywords: keywords,
        openGraph: {
          siteName: options.name,
          type: 'website',
          image: `/assets/${slug}/og-image.jpg`,
          url: `https://${domain}`
        },
        twitter: {
          card: 'summary_large_image',
          site: '@YourGameStudio'
        },
        canonicalBase: `https://${domain}`
      }
    };
  }
  
  // 生成URL友好的slug
  // Generate URL-friendly slug
  private generateSlug(name: string): string {
    return name.toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }
  
  // 创建备份
  // Create backup
  private async createBackup(): Promise<void> {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupPath = path.join(this.backupDir, timestamp);
    
    await fs.ensureDir(backupPath);
    
    // 备份配置文件
    // Backup configuration file
    if (fs.existsSync(this.configPath)) {
      await fs.copy(this.configPath, path.join(backupPath, 'main-game.ts'));
    }
    
    // 备份package.json（如果有修改的话）
    // Backup package.json (if modified)
    if (fs.existsSync('package.json')) {
      await fs.copy('package.json', path.join(backupPath, 'package.json'));
    }
    
    console.log(`📦 备份创建完成 / Backup created: ${backupPath}`);
  }
  
  // 处理游戏文件上传
  // Handle game file upload
  private async handleGameUpload(uploadDir: string, gameSlug: string): Promise<void> {
    const targetDir = path.join('public', 'game', gameSlug);
    
    console.log(`📁 正在处理游戏文件 / Processing game files...`);
    console.log(`从 / From: ${uploadDir}`);
    console.log(`到 / To: ${targetDir}`);
    
    // 确保目标目录存在
    // Ensure target directory exists
    await fs.ensureDir(targetDir);
    
    // 复制文件
    // Copy files
    await fs.copy(uploadDir, targetDir);
    
    // 验证必要文件存在
    // Verify required files exist
    const indexPath = path.join(targetDir, 'index.html');
    if (!fs.existsSync(indexPath)) {
      console.warn('⚠️  警告：未找到 index.html 文件 / Warning: index.html not found');
    }
    
    console.log('✅ 游戏文件处理完成 / Game files processed');
  }
  
  // 更新配置文件
  // Update configuration file
  private async updateConfigFile(newConfig: MainGameConfig): Promise<void> {
    const configContent = `import type { MainGameConfig } from './types';

// 自动生成的主游戏配置 / Auto-generated main game configuration
// 生成时间 / Generated at: ${new Date().toISOString()}
export const mainGameConfig: MainGameConfig = ${JSON.stringify(newConfig, null, 2)};
`;
    
    await fs.writeFile(this.configPath, configContent, 'utf8');
    console.log('📝 配置文件已更新 / Configuration file updated');
  }
  
  // 重新生成sitemap
  // Regenerate sitemap
  private async regenerateSitemap(): Promise<void> {
    try {
      console.log('🗺️  正在重新生成sitemap / Regenerating sitemap...');
      execSync('npm run build:sitemap', { stdio: 'inherit' });
      console.log('✅ Sitemap重新生成完成 / Sitemap regeneration completed');
    } catch (error) {
      console.warn('⚠️  Sitemap生成失败，请手动执行 npm run build:sitemap / Sitemap generation failed, please run npm run build:sitemap manually');
    }
  }
  
  // 生成SEO内容
  // Generate SEO content
  private async generateSEOContent(game: Game): Promise<void> {
    console.log('📝 正在生成SEO内容 / Generating SEO content...');
    
    try {
      // 动态导入SEO生成器
      // Dynamic import SEO generator
      const { SEOContentGenerator } = await import('./seo-content-generator');
      const generator = new SEOContentGenerator();
      const seoContent = generator.generateGamePage(game);
      
      console.log(`📊 SEO内容统计 / SEO Content Stats:`);
      console.log(`   字数 / Word Count: ${seoContent.wordCount}`);
      console.log(`   关键词密度 / Keyword Density: ${seoContent.keywordDensity.toFixed(2)}%`);
      
      console.log('✅ SEO内容生成完成 / SEO content generation completed');
    } catch (error) {
      console.warn('⚠️  SEO内容生成失败 / SEO content generation failed:', error);
    }
  }
  
  // 列出可恢复的备份
  // List recoverable backups
  async listBackups(): Promise<string[]> {
    try {
      if (!fs.existsSync(this.backupDir)) {
        return [];
      }
      
      const backups = await fs.readdir(this.backupDir);
      return backups.filter(backup => 
        fs.statSync(path.join(this.backupDir, backup)).isDirectory()
      ).sort().reverse(); // 最新的在前面
    } catch (error) {
      console.error('读取备份失败 / Failed to read backups:', error);
      return [];
    }
  }
  
  // 恢复备份
  // Restore backup
  async restoreBackup(backupTimestamp: string): Promise<void> {
    const backupPath = path.join(this.backupDir, backupTimestamp);
    
    if (!fs.existsSync(backupPath)) {
      throw new Error(`备份不存在 / Backup does not exist: ${backupTimestamp}`);
    }
    
    console.log(`🔄 正在恢复备份 / Restoring backup: ${backupTimestamp}`);
    
    // 恢复配置文件
    // Restore configuration file
    const backupConfigPath = path.join(backupPath, 'main-game.ts');
    if (fs.existsSync(backupConfigPath)) {
      await fs.copy(backupConfigPath, this.configPath);
      console.log('✅ 配置文件已恢复 / Configuration file restored');
    }
    
    console.log('✅ 备份恢复完成 / Backup restoration completed');
  }
}

// 命令行接口
// Command line interface
export async function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log(`
🎮 游戏切换工具 / Game Switcher Tool

使用方法 / Usage:
  npm run switch-game "Game Name" [description] [-- options]

选项 / Options:
  --upload=<path>     上传游戏文件 / Upload game files
  --embed=iframe      使用iframe嵌入 / Use iframe embed
  --iframe=<url>      iframe源地址 / iframe source URL
  --category=<type>   游戏类别 / Game category
  --domain=<domain>   自定义域名 / Custom domain
  --dry-run          预览模式 / Preview mode
  --no-backup        跳过备份 / Skip backup

示例 / Examples:
  npm run switch-game "Super Game" "Amazing action game"
  npm run switch-game "My Game" -- --upload=./my-game-files/
  npm run switch-game "Web Game" -- --embed=iframe --iframe=https://example.com/game/
  npm run switch-game "Test Game" -- --dry-run
`);
    return;
  }
  
  // 简单的参数解析
  // Simple argument parsing
  const name = args[0];
  const description = args[1] && !args[1].startsWith('--') ? args[1] : undefined;
  
  const options: SwitchOptions = {
    name,
    description,
    keywords: args.find(arg => arg.startsWith('--keywords='))?.split('=')[1]?.split(','),
    uploadDir: args.find(arg => arg.startsWith('--upload='))?.split('=')[1],
    embedType: args.find(arg => arg.startsWith('--embed='))?.split('=')[1] as 'iframe' | 'local',
    iframeSrc: args.find(arg => arg.startsWith('--iframe='))?.split('=')[1],
    category: args.find(arg => arg.startsWith('--category='))?.split('=')[1],
    domain: args.find(arg => arg.startsWith('--domain='))?.split('=')[1],
    dryRun: args.includes('--dry-run'),
    backup: !args.includes('--no-backup')
  };
  
  const switcher = new GameSwitcher();
  
  // 特殊命令处理
  // Special command handling
  if (args[0] === 'list-backups') {
    const backups = await switcher.listBackups();
    console.log('📦 可用备份 / Available backups:');
    backups.forEach((backup, index) => {
      console.log(`  ${index + 1}. ${backup}`);
    });
    return;
  }
  
  if (args[0] === 'restore' && args[1]) {
    await switcher.restoreBackup(args[1]);
    return;
  }
  
  await switcher.switchMainGame(options);
}

// 如果直接运行此文件
// If running this file directly
if (require.main === module) {
  main().catch(console.error);
}
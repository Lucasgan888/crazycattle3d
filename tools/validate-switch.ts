import fs from 'fs';
import path from 'path';

// 验证切换是否成功
// Validate if switch was successful
export class SwitchValidator {
  
  // 运行所有验证检查
  // Run all validation checks
  async validateSwitch(): Promise<boolean> {
    console.log('🔍 开始验证切换结果 / Starting switch validation...');
    
    const checks = [
      this.checkConfigFile(),
      this.checkGameFiles(),
      this.checkSEOContent(),
      this.checkImages(),
      this.checkSitemap(),
    ];
    
    const results = await Promise.all(checks);
    const allPassed = results.every(result => result);
    
    if (allPassed) {
      console.log('✅ 所有验证通过 / All validations passed!');
    } else {
      console.log('❌ 某些验证失败 / Some validations failed!');
    }
    
    return allPassed;
  }
  
  // 检查配置文件
  // Check configuration file
  private async checkConfigFile(): Promise<boolean> {
    try {
      // 动态导入配置
      // Dynamic import configuration
      const configPath = path.resolve('config/main-game.ts');
      
      if (!fs.existsSync(configPath)) {
        console.log('❌ 配置文件不存在 / Config file does not exist');
        return false;
      }
      
      // 使用动态导入来避免编译时依赖
      // Use dynamic import to avoid compile-time dependency
      const { mainGameConfig } = await import('../config/main-game');
      
      // 检查必要字段
      // Check required fields
      const requiredFields = [
        mainGameConfig.mainGame.name,
        mainGameConfig.mainGame.description,
        mainGameConfig.seo.defaultTitle,
        mainGameConfig.seo.description,
      ];
      
      const hasAllFields = requiredFields.every(field => field && field.length > 0);
      
      if (hasAllFields) {
        console.log('✅ 配置文件验证通过 / Config file validation passed');
        console.log(`   游戏名称 / Game name: ${mainGameConfig.mainGame.name}`);
        console.log(`   嵌入类型 / Embed type: ${mainGameConfig.mainGame.embed.type}`);
        return true;
      } else {
        console.log('❌ 配置文件缺少必要字段 / Config file missing required fields');
        return false;
      }
    } catch (error) {
      console.log('❌ 配置文件读取失败 / Config file read failed:', error);
      return false;
    }
  }
  
  // 检查游戏文件
  // Check game files
  private async checkGameFiles(): Promise<boolean> {
    try {
      const { mainGameConfig } = await import('../config/main-game');
      const game = mainGameConfig.mainGame;
      
      if (game.embed.type === 'local' && game.embed.localPath) {
        const gamePath = path.join('public', game.embed.localPath);
        
        if (fs.existsSync(gamePath)) {
          console.log('✅ 游戏文件存在 / Game files exist');
          console.log(`   路径 / Path: ${gamePath}`);
          
          // 检查文件大小
          // Check file size
          const stats = fs.statSync(gamePath);
          if (stats.size > 0) {
            console.log(`   文件大小 / File size: ${(stats.size / 1024).toFixed(2)} KB`);
          }
          
          return true;
        } else {
          console.log('❌ 游戏文件不存在 / Game files do not exist:', gamePath);
          return false;
        }
      }
      
      // 对于iframe类型，只检查URL格式
      // For iframe type, only check URL format
      if (game.embed.type === 'iframe' && game.embed.iframeSrc) {
        try {
          new URL(game.embed.iframeSrc);
          console.log('✅ iframe URL格式正确 / iframe URL format correct');
          console.log(`   URL: ${game.embed.iframeSrc}`);
          return true;
        } catch {
          console.log('❌ iframe URL格式错误 / iframe URL format incorrect');
          return false;
        }
      }
      
      console.log('⚠️  未找到有效的嵌入配置 / No valid embed configuration found');
      return false;
    } catch (error) {
      console.log('❌ 游戏文件检查失败 / Game files check failed:', error);
      return false;
    }
  }
  
  // 检查SEO内容
  // Check SEO content
  private async checkSEOContent(): Promise<boolean> {
    try {
      const { mainGameConfig } = await import('../config/main-game');
      const seo = mainGameConfig.seo;
      
      let score = 0;
      const maxScore = 5;
      
      // 检查标题长度
      // Check title length
      if (seo.defaultTitle.length >= 30 && seo.defaultTitle.length <= 60) {
        console.log('✅ 标题长度合适 / Title length appropriate');
        score++;
      } else {
        console.log(`⚠️  标题长度建议30-60字符，当前${seo.defaultTitle.length}字符 / Title length should be 30-60 characters, current: ${seo.defaultTitle.length}`);
      }
      
      // 检查描述长度
      // Check description length
      if (seo.description.length >= 120 && seo.description.length <= 160) {
        console.log('✅ 描述长度合适 / Description length appropriate');
        score++;
      } else {
        console.log(`⚠️  描述长度建议120-160字符，当前${seo.description.length}字符 / Description length should be 120-160 characters, current: ${seo.description.length}`);
      }
      
      // 检查关键词
      // Check keywords
      if (seo.keywords.length > 0) {
        console.log('✅ SEO关键词已设置 / SEO keywords are set');
        console.log(`   关键词数量 / Keywords count: ${seo.keywords.length}`);
        score++;
      } else {
        console.log('❌ SEO关键词为空 / SEO keywords are empty');
      }
      
      // 检查OpenGraph配置
      // Check OpenGraph configuration
      if (seo.openGraph && seo.openGraph.siteName && seo.openGraph.url) {
        console.log('✅ OpenGraph配置完整 / OpenGraph configuration complete');
        score++;
      } else {
        console.log('⚠️  OpenGraph配置不完整 / OpenGraph configuration incomplete');
      }
      
      // 检查canonical URL
      // Check canonical URL
      if (seo.canonicalBase && seo.canonicalBase.startsWith('https://')) {
        console.log('✅ Canonical URL格式正确 / Canonical URL format correct');
        score++;
      } else {
        console.log('⚠️  Canonical URL格式不正确 / Canonical URL format incorrect');
      }
      
      const passed = score >= 3; // 至少通过3项检查
      console.log(`📊 SEO评分 / SEO Score: ${score}/${maxScore} ${passed ? '✅' : '⚠️'}`);
      
      return passed;
    } catch (error) {
      console.log('❌ SEO内容检查失败 / SEO content check failed:', error);
      return false;
    }
  }
  
  // 检查图片文件
  // Check image files
  private async checkImages(): Promise<boolean> {
    try {
      const { mainGameConfig } = await import('../config/main-game');
      const thumbnail = mainGameConfig.mainGame.thumbnail;
      
      if (thumbnail) {
        const imagePath = path.join('public', thumbnail);
        
        if (fs.existsSync(imagePath)) {
          console.log('✅ 预览图片存在 / Thumbnail image exists');
          
          // 检查图片大小
          // Check image size
          const stats = fs.statSync(imagePath);
          console.log(`   图片大小 / Image size: ${(stats.size / 1024).toFixed(2)} KB`);
          
          return true;
        } else {
          console.log('⚠️  预览图片不存在，建议添加 / Thumbnail image does not exist, recommend adding:', imagePath);
          return false;
        }
      }
      
      console.log('⚠️  未配置预览图片 / No thumbnail image configured');
      return true; // 不是必需的，所以返回true
    } catch (error) {
      console.log('❌ 图片检查失败 / Image check failed:', error);
      return false;
    }
  }
  
  // 检查sitemap
  // Check sitemap
  private async checkSitemap(): Promise<boolean> {
    const sitemapPath = 'public/sitemap.xml';
    
    if (fs.existsSync(sitemapPath)) {
      console.log('✅ Sitemap文件存在 / Sitemap file exists');
      
      // 检查sitemap内容
      // Check sitemap content
      try {
        const sitemapContent = fs.readFileSync(sitemapPath, 'utf8');
        const { mainGameConfig } = await import('../config/main-game');
        
        if (sitemapContent.includes(mainGameConfig.seo.canonicalBase)) {
          console.log('✅ Sitemap包含正确的域名 / Sitemap contains correct domain');
          return true;
        } else {
          console.log('⚠️  Sitemap可能需要更新 / Sitemap may need update');
          return false;
        }
      } catch (error) {
        console.log('⚠️  Sitemap内容检查失败 / Sitemap content check failed');
        return false;
      }
    } else {
      console.log('⚠️  Sitemap文件不存在，请运行 npm run build:sitemap / Sitemap file does not exist, please run npm run build:sitemap');
      return false;
    }
  }
  
  // 生成详细报告
  // Generate detailed report
  async generateReport(): Promise<string> {
    console.log('\n📋 生成详细验证报告 / Generating detailed validation report...\n');
    
    const report: string[] = [];
    report.push('# 游戏切换验证报告 / Game Switch Validation Report');
    report.push(`生成时间 / Generated at: ${new Date().toISOString()}`);
    report.push('');
    
    try {
      const { mainGameConfig } = await import('../config/main-game');
      
      report.push('## 游戏配置 / Game Configuration');
      report.push(`- 游戏名称 / Game Name: ${mainGameConfig.mainGame.name}`);
      report.push(`- 游戏ID / Game ID: ${mainGameConfig.mainGame.id}`);
      report.push(`- 游戏类别 / Category: ${mainGameConfig.mainGame.seoContent.category}`);
      report.push(`- 嵌入类型 / Embed Type: ${mainGameConfig.mainGame.embed.type}`);
      report.push(`- 域名 / Domain: ${mainGameConfig.seo.domain}`);
      report.push('');
      
      report.push('## SEO配置 / SEO Configuration');
      report.push(`- 页面标题 / Page Title: ${mainGameConfig.seo.defaultTitle}`);
      report.push(`- 标题长度 / Title Length: ${mainGameConfig.seo.defaultTitle.length} 字符`);
      report.push(`- 页面描述 / Page Description: ${mainGameConfig.seo.description.substring(0, 100)}...`);
      report.push(`- 描述长度 / Description Length: ${mainGameConfig.seo.description.length} 字符`);
      report.push(`- 关键词数量 / Keywords Count: ${mainGameConfig.seo.keywords.length}`);
      report.push('');
      
      // 运行验证检查
      // Run validation checks
      const validationResult = await this.validateSwitch();
      report.push('## 验证结果 / Validation Results');
      report.push(`- 总体状态 / Overall Status: ${validationResult ? '✅ 通过' : '❌ 失败'}`);
      
    } catch (error) {
      report.push('## 错误 / Error');
      report.push(`配置文件读取失败 / Config file read failed: ${error}`);
    }
    
    const reportContent = report.join('\n');
    
    // 保存报告到文件
    // Save report to file
    const reportPath = `validation-report-${new Date().toISOString().slice(0, 19).replace(/[:.]/g, '-')}.md`;
    fs.writeFileSync(reportPath, reportContent);
    console.log(`📄 详细报告已保存 / Detailed report saved: ${reportPath}`);
    
    return reportContent;
  }
  
  // 快速健康检查
  // Quick health check
  async quickCheck(): Promise<void> {
    console.log('⚡ 快速健康检查 / Quick health check...\n');
    
    try {
      const { mainGameConfig } = await import('../config/main-game');
      
      console.log(`🎮 当前游戏 / Current game: ${mainGameConfig.mainGame.name}`);
      console.log(`🌐 域名 / Domain: ${mainGameConfig.seo.canonicalBase}`);
      console.log(`📱 嵌入方式 / Embed method: ${mainGameConfig.mainGame.embed.type}`);
      
      if (mainGameConfig.mainGame.embed.type === 'local') {
        const gamePath = path.join('public', mainGameConfig.mainGame.embed.localPath || '');
        const exists = fs.existsSync(gamePath);
        console.log(`📁 游戏文件 / Game files: ${exists ? '✅ 存在' : '❌ 缺失'}`);
      }
      
      const configExists = fs.existsSync('config/main-game.ts');
      console.log(`⚙️  配置文件 / Config file: ${configExists ? '✅ 存在' : '❌ 缺失'}`);
      
      const sitemapExists = fs.existsSync('public/sitemap.xml');
      console.log(`🗺️  Sitemap / Sitemap: ${sitemapExists ? '✅ 存在' : '⚠️  需要生成'}`);
      
    } catch (error) {
      console.log('❌ 快速检查失败 / Quick check failed:', error);
    }
  }
}

// 命令行接口
// Command line interface
if (require.main === module) {
  const validator = new SwitchValidator();
  const args = process.argv.slice(2);
  
  if (args.includes('--report')) {
    validator.generateReport()
      .then(() => process.exit(0))
      .catch(error => {
        console.error('报告生成失败 / Report generation failed:', error);
        process.exit(1);
      });
  } else if (args.includes('--quick')) {
    validator.quickCheck()
      .then(() => process.exit(0))
      .catch(error => {
        console.error('快速检查失败 / Quick check failed:', error);
        process.exit(1);
      });
  } else {
    validator.validateSwitch()
      .then(success => {
        process.exit(success ? 0 : 1);
      })
      .catch(error => {
        console.error('验证过程出错 / Validation process error:', error);
        process.exit(1);
      });
  }
}
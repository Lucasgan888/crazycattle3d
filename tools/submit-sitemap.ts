#!/usr/bin/env node

/**
 * 站点地图提交工具
 * Sitemap submission tool
 * 
 * 自动向各大搜索引擎提交站点地图
 * Automatically submit sitemap to major search engines
 */

import { existsSync, readFileSync } from 'fs';
import { resolve } from 'path';
import { analyticsConfig } from '../config/analytics';

interface SearchEngine {
  name: string;
  submitUrl: string;
  enabled: boolean;
}

// 搜索引擎配置
// Search engines configuration
const searchEngines: SearchEngine[] = [
  {
    name: 'Google',
    submitUrl: 'https://www.google.com/ping?sitemap=',
    enabled: true
  },
  {
    name: 'Bing',
    submitUrl: 'https://www.bing.com/ping?sitemap=',
    enabled: true
  },
  {
    name: 'Yahoo',
    submitUrl: 'https://search.yahoo.com/ping?sitemap=',
    enabled: false // Yahoo使用Bing的索引 / Yahoo uses Bing's index
  },
  {
    name: 'Yandex',
    submitUrl: 'https://webmaster.yandex.com/ping?sitemap=',
    enabled: false // 需要额外配置 / Requires additional configuration
  }
];

// 日志记录函数
// Logging functions
const log = {
  info: (message: string) => console.log(`ℹ️  ${message}`),
  success: (message: string) => console.log(`✅ ${message}`),
  error: (message: string) => console.error(`❌ ${message}`),
  warn: (message: string) => console.warn(`⚠️  ${message}`)
};

// 验证站点地图文件
// Validate sitemap file
function validateSitemap(sitemapPath: string): boolean {
  if (!existsSync(sitemapPath)) {
    log.error(`站点地图文件不存在: ${sitemapPath} / Sitemap file not found: ${sitemapPath}`);
    return false;
  }

  try {
    const content = readFileSync(sitemapPath, 'utf-8');
    
    // 检查基本XML结构
    // Check basic XML structure
    if (!content.includes('<?xml') || !content.includes('<urlset')) {
      log.error('站点地图格式无效 / Invalid sitemap format');
      return false;
    }

    // 检查URL数量
    // Check URL count
    const urlMatches = content.match(/<url>/g);
    const urlCount = urlMatches ? urlMatches.length : 0;
    
    if (urlCount === 0) {
      log.warn('站点地图中没有找到URL / No URLs found in sitemap');
      return false;
    }

    log.info(`站点地图验证通过，包含 ${urlCount} 个URL / Sitemap validated with ${urlCount} URLs`);
    return true;
  } catch (error) {
    log.error(`验证站点地图时出错: ${error} / Error validating sitemap: ${error}`);
    return false;
  }
}

// 提交站点地图到搜索引擎
// Submit sitemap to search engine
async function submitToSearchEngine(
  engine: SearchEngine, 
  sitemapUrl: string
): Promise<{ success: boolean; message: string }> {
  try {
    const submitUrl = engine.submitUrl + encodeURIComponent(sitemapUrl);
    
    log.info(`正在提交到 ${engine.name} / Submitting to ${engine.name}...`);
    
    const response = await fetch(submitUrl, {
      method: 'GET',
      headers: {
        'User-Agent': 'SitemapSubmissionTool/1.0 (+https://crazy-cattle.net)'
      }
    });

    if (response.ok) {
      return {
        success: true,
        message: `成功提交到 ${engine.name} / Successfully submitted to ${engine.name}`
      };
    } else {
      return {
        success: false,
        message: `提交到 ${engine.name} 失败 (HTTP ${response.status}) / Failed to submit to ${engine.name} (HTTP ${response.status})`
      };
    }
  } catch (error) {
    return {
      success: false,
      message: `提交到 ${engine.name} 时出错: ${error} / Error submitting to ${engine.name}: ${error}`
    };
  }
}

// 主函数
// Main function
async function main() {
  const args = process.argv.slice(2);
  const sitemapPath = args[0] || './public/sitemap.xml';
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || analyticsConfig.gsc.siteUrl;
  
  log.info('🚀 站点地图提交工具启动 / Sitemap Submission Tool Starting');
  log.info(`网站URL: ${siteUrl} / Site URL: ${siteUrl}`);
  log.info(`站点地图路径: ${sitemapPath} / Sitemap path: ${sitemapPath}`);
  
  // 验证配置
  // Validate configuration
  if (!siteUrl || siteUrl === 'https://crazy-cattle.net') {
    log.error('请在 .env.local 中配置 NEXT_PUBLIC_SITE_URL / Please configure NEXT_PUBLIC_SITE_URL in .env.local');
    process.exit(1);
  }

  // 验证站点地图
  // Validate sitemap
  const resolvedPath = resolve(sitemapPath);
  if (!validateSitemap(resolvedPath)) {
    process.exit(1);
  }

  const sitemapUrl = `${siteUrl.replace(/\/$/, '')}/sitemap.xml`;
  log.info(`站点地图URL: ${sitemapUrl} / Sitemap URL: ${sitemapUrl}`);

  // 提交到各个搜索引擎
  // Submit to search engines
  const results = [];
  
  for (const engine of searchEngines.filter(e => e.enabled)) {
    const result = await submitToSearchEngine(engine, sitemapUrl);
    results.push({ engine: engine.name, ...result });
    
    if (result.success) {
      log.success(result.message);
    } else {
      log.error(result.message);
    }
    
    // 延迟以避免过于频繁的请求
    // Delay to avoid too frequent requests
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  // 输出总结
  // Output summary
  const successful = results.filter(r => r.success);
  const failed = results.filter(r => !r.success);

  log.info('\n📊 提交总结 / Submission Summary:');
  log.info(`成功: ${successful.length} / Successful: ${successful.length}`);
  if (successful.length > 0) {
    successful.forEach(r => log.success(`  ✅ ${r.engine}`));
  }
  
  if (failed.length > 0) {
    log.info(`失败: ${failed.length} / Failed: ${failed.length}`);
    failed.forEach(r => log.error(`  ❌ ${r.engine}: ${r.message}`));
  }

  // 返回适当的退出码
  // Return appropriate exit code
  process.exit(failed.length > 0 ? 1 : 0);
}

// 处理未捕获的异常
// Handle unhandled exceptions
process.on('unhandledRejection', (reason, promise) => {
  log.error(`未处理的Promise拒绝: ${reason} / Unhandled Promise Rejection: ${reason}`);
  process.exit(1);
});

process.on('uncaughtException', (error) => {
  log.error(`未捕获的异常: ${error.message} / Uncaught Exception: ${error.message}`);
  process.exit(1);
});

// 运行主函数
// Run main function
if (require.main === module) {
  main().catch((error) => {
    log.error(`工具执行失败: ${error} / Tool execution failed: ${error}`);
    process.exit(1);
  });
}

export { submitToSearchEngine, validateSitemap, searchEngines };
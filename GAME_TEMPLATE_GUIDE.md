# 🎮 游戏网站模板化系统使用指南
# Game Website Template System User Guide

> **一键切换主游戏，自动生成SEO内容，完美的游戏网站解决方案**
> **One-click main game switching with auto-generated SEO content - the perfect game website solution**

## 📋 目录 / Table of Contents

- [快速开始 / Quick Start](#快速开始--quick-start)
- [系统概述 / System Overview](#系统概述--system-overview)
- [安装依赖 / Installation](#安装依赖--installation)
- [基本使用 / Basic Usage](#基本使用--basic-usage)
- [高级功能 / Advanced Features](#高级功能--advanced-features)
- [配置详解 / Configuration Details](#配置详解--configuration-details)
- [故障排除 / Troubleshooting](#故障排除--troubleshooting)
- [最佳实践 / Best Practices](#最佳实践--best-practices)

## 🚀 快速开始 / Quick Start

### 1. 安装依赖 / Install Dependencies
```bash
npm install
```

### 2. 最简单的游戏切换 / Simplest Game Switch
```bash
# 方式1：切换到新游戏（使用默认设置）
# Method 1: Switch to new game (using defaults)
npm run switch-game "My Awesome Game"

# 方式2：上传游戏文件并切换
# Method 2: Upload game files and switch
npm run switch-game "My Game" "Game description" -- --upload=./my-game-files/

# 方式3：使用外部链接
# Method 3: Use external link
npm run switch-game "Web Game" -- --embed=iframe --iframe=https://example.com/my-game/
```

### 3. 验证切换结果 / Validate Switch Results
```bash
npm run validate-switch
```

### 4. 启动开发服务器 / Start Development Server
```bash
npm run dev
```

就这么简单！🎉 / That's it! 🎉

---

## 🔧 系统概述 / System Overview

### 核心功能 / Core Features

1. **一键游戏切换** / One-click game switching
2. **自动SEO内容生成** / Automatic SEO content generation
3. **多种嵌入方式支持** / Multiple embed methods support
4. **完整的备份恢复系统** / Complete backup and restore system
5. **实时验证和报告** / Real-time validation and reporting

### 文件结构 / File Structure
```
project/
├── config/
│   ├── types.ts              # TypeScript 类型定义
│   ├── main-game.ts          # 主游戏配置（自动生成）
│   └── examples/             # 示例配置文件
│       ├── game-a.json
│       ├── puzzle-game.json
│       └── racing-game.json
├── components/
│   └── GameEmbed.tsx         # 游戏嵌入组件
├── tools/
│   ├── switch-main-game.ts   # 一键切换脚本
│   ├── validate-switch.ts    # 验证脚本
│   └── seo-content-generator.ts # SEO内容生成器
└── backups/                  # 自动备份目录
```

---

## 📦 安装依赖 / Installation

### 必需依赖 / Required Dependencies

系统会自动安装以下依赖：

```json
{
  "devDependencies": {
    "fs-extra": "^11.2.0",
    "ts-node": "^10.9.2",
    "@types/fs-extra": "^11.0.4"
  }
}
```

### npm 脚本 / npm Scripts

安装后可用的脚本：

```json
{
  "scripts": {
    "switch-game": "ts-node --esm tools/switch-main-game.ts",
    "switch-preview": "npm run switch-game -- --dry-run",
    "validate-switch": "ts-node --esm tools/validate-switch.ts",
    "validate-quick": "npm run validate-switch -- --quick",
    "validate-report": "npm run validate-switch -- --report",
    "game:backup-list": "npm run switch-game list-backups",
    "game:restore": "npm run switch-game restore"
  }
}
```

---

## 🎯 基本使用 / Basic Usage

### 切换游戏的三种方法 / Three Ways to Switch Games

#### 方法1: 本地游戏文件 / Method 1: Local Game Files

```bash
# 步骤1：准备游戏文件
# Step 1: Prepare game files
mkdir my-new-game
# 将游戏文件放入文件夹（确保有index.html）
# Put game files in folder (ensure index.html exists)

# 步骤2：执行切换
# Step 2: Execute switch
npm run switch-game "My New Game" "An amazing new gaming experience" -- --upload=./my-new-game/

# 步骤3：验证结果
# Step 3: Validate results
npm run validate-switch
```

#### 方法2: 外部iframe链接 / Method 2: External iframe Link

```bash
npm run switch-game "External Game" "Play this amazing external game" -- --embed=iframe --iframe=https://example.com/game/
```

#### 方法3: 只更改配置（不上传文件）/ Method 3: Config Only (No File Upload)

```bash
npm run switch-game "Game Title" "Game description" -- --category=Action --domain=my-domain.com
```

### 预览模式 / Preview Mode

在实际切换前预览变更：

```bash
npm run switch-game "Test Game" -- --dry-run
```

### 快速验证 / Quick Validation

```bash
# 快速健康检查
# Quick health check
npm run validate-quick

# 生成详细报告
# Generate detailed report
npm run validate-report
```

---

## ⚡ 高级功能 / Advanced Features

### 完整参数列表 / Complete Parameter List

```bash
npm run switch-game "Game Name" "Description" -- [OPTIONS]
```

**可用选项 / Available Options:**

- `--upload=<path>` - 上传游戏文件目录 / Upload game files directory
- `--embed=<type>` - 嵌入类型：`local` 或 `iframe` / Embed type: `local` or `iframe`
- `--iframe=<url>` - iframe源地址 / iframe source URL
- `--category=<type>` - 游戏类别：`Action`, `Puzzle`, `Racing` 等 / Game category
- `--domain=<domain>` - 自定义域名 / Custom domain
- `--keywords=<list>` - 关键词列表（逗号分隔）/ Keywords list (comma-separated)
- `--dry-run` - 预览模式，不实际修改 / Preview mode, no actual changes
- `--no-backup` - 跳过备份 / Skip backup

### 示例命令 / Example Commands

```bash
# 完整配置示例
# Full configuration example
npm run switch-game "Super Racing Game" "Experience the ultimate racing thrill" -- \
  --upload=./racing-game/ \
  --category=Racing \
  --domain=super-racing.com \
  --keywords="racing,cars,speed,championship"

# 使用iframe的完整示例
# Complete iframe example
npm run switch-game "Puzzle Master" "Brain-teasing puzzle challenges" -- \
  --embed=iframe \
  --iframe=https://puzzlegames.example.com/master/ \
  --category=Puzzle \
  --domain=puzzle-master.net

# 只更新配置，不上传文件
# Update config only, no file upload
npm run switch-game "Updated Game Title" "New description" -- \
  --category=Adventure \
  --no-backup
```

### 备份和恢复 / Backup and Restore

```bash
# 查看所有备份
# List all backups
npm run game:backup-list

# 恢复特定备份
# Restore specific backup
npm run game:restore 2024-01-15T10-30-00-000Z
```

---

## 📋 配置详解 / Configuration Details

### 主配置文件结构 / Main Config File Structure

`config/main-game.ts` 是系统的核心配置文件：

```typescript
export const mainGameConfig: MainGameConfig = {
  mainGame: {
    id: "game-id",                    // 游戏唯一标识符
    name: "Game Name",                // 游戏显示名称
    slug: "game-slug",                // URL路径
    description: "Game description",   // 游戏描述
    keywords: ["keyword1", "keyword2"], // SEO关键词
    thumbnail: "/assets/game/og-image.jpg", // 预览图片
    
    embed: {
      type: "local",                  // 嵌入类型："local" 或 "iframe"
      localPath: "/game/path/index.html", // 本地文件路径
      // 或者
      // iframeSrc: "https://example.com/game/"
    },
    
    seoContent: {
      targetWordCount: 800,           // 目标字数
      keywordDensity: 4.0,           // 关键词密度 %
      category: "Action",             // 游戏类别
      features: [                     // 游戏特性列表
        "Feature 1",
        "Feature 2"
      ]
    }
  },
  
  site: {
    name: "Site Name",               // 网站名称
    domain: "example.com"            // 域名
  },
  
  seo: {
    siteName: "Site Name",
    domain: "example.com",
    titleTemplate: "%s - Site Name",
    defaultTitle: "Default Title",
    description: "Site description",
    keywords: ["site", "keywords"],
    openGraph: {
      siteName: "Site Name",
      type: "website",
      image: "/assets/og-image.jpg",
      url: "https://example.com"
    },
    twitter: {
      card: "summary_large_image",
      site: "@username"
    },
    canonicalBase: "https://example.com"
  }
};
```

### SEO内容自动生成 / Automatic SEO Content Generation

系统会自动生成以下SEO内容：

1. **800+字英文内容** / 800+ word English content
2. **3-5%关键词密度** / 3-5% keyword density
3. **完整的meta标签** / Complete meta tags
4. **OpenGraph和Twitter卡片** / OpenGraph and Twitter cards
5. **JSON-LD结构化数据** / JSON-LD structured data
6. **自动更新sitemap** / Auto-updated sitemap

### 游戏嵌入类型 / Game Embed Types

#### 本地文件 (Local) 
```typescript
embed: {
  type: "local",
  localPath: "/game/my-game/index.html"
}
```

#### 外部iframe (iframe)
```typescript
embed: {
  type: "iframe",
  iframeSrc: "https://external-games.com/my-game/"
}
```

---

## 🛠️ 故障排除 / Troubleshooting

### 常见问题 / Common Issues

#### 1. 切换失败 / Switch Failed

**问题**: 游戏切换失败
**解决方案**:

```bash
# 检查配置
npm run validate-switch

# 查看详细错误
npm run switch-game "Game Name" -- --dry-run

# 检查文件路径
ls -la ./path/to/game/files/
```

#### 2. 游戏无法显示 / Game Not Displaying

**问题**: 游戏切换成功但无法显示
**解决方案**:

```bash
# 验证游戏文件
npm run validate-switch

# 检查浏览器控制台错误
# 确保index.html文件存在
# 检查iframe权限设置
```

#### 3. SEO内容生成失败 / SEO Content Generation Failed

**问题**: SEO内容未正确生成
**解决方案**:

```bash
# 检查配置完整性
npm run validate-report

# 重新生成内容
npm run switch-game "Current Game Name" -- --no-backup
```

#### 4. 备份恢复问题 / Backup Restore Issues

```bash
# 查看可用备份
npm run game:backup-list

# 手动检查备份目录
ls -la backups/

# 恢复最新备份
npm run game:restore $(ls backups/ | tail -1)
```

### 调试模式 / Debug Mode

开发环境下会显示额外的调试信息：

- SEO统计数据
- 字数和关键词密度
- 配置验证结果

### 日志查看 / Log Viewing

系统会输出详细的操作日志：

```bash
🎮 开始切换主游戏 / Starting main game switch...
📁 正在处理游戏文件 / Processing game files...
📝 配置文件已更新 / Configuration file updated
🗺️  正在重新生成sitemap / Regenerating sitemap...
📝 正在生成SEO内容 / Generating SEO content...
✅ 游戏切换完成 / Game switch completed!
```

---

## 🌟 最佳实践 / Best Practices

### 1. 文件组织 / File Organization

```
my-game-files/
├── index.html          # 必须：游戏入口文件
├── assets/            # 游戏资源
├── css/              # 样式文件
├── js/               # JavaScript文件
└── images/           # 图片资源
```

### 2. 游戏配置建议 / Game Configuration Recommendations

- **游戏名称**: 简洁明了，包含核心关键词
- **描述**: 80-150字，包含主要特性和关键词
- **关键词**: 5-8个，包含游戏类型、特性、目标受众
- **类别**: 选择最准确的分类（Action, Puzzle, Racing等）

### 3. SEO优化建议 / SEO Optimization Recommendations

- **标题**: 30-60字符，包含品牌名和核心关键词
- **描述**: 120-160字符，吸引点击的同时包含关键词
- **关键词密度**: 保持在3-5%之间
- **内容长度**: 800字以上获得更好的搜索排名

### 4. 性能优化 / Performance Optimization

- 游戏文件压缩后上传
- 使用适当的图片格式（WebP等）
- 定期清理不必要的备份文件

### 5. 安全注意事项 / Security Considerations

- 不要在配置中包含敏感信息
- 定期备份配置文件
- 使用HTTPS域名

---

## 📚 示例配置 / Example Configurations

### 动作游戏示例 / Action Game Example

参考 `config/examples/game-a.json`：

- 强调3D图形和动作元素
- 包含多人游戏特性
- 针对动作游戏优化的关键词

### 益智游戏示例 / Puzzle Game Example

参考 `config/examples/puzzle-game.json`：

- 强调脑力训练和逻辑思维
- 包含教育价值
- 针对智力游戏优化的关键词

### 竞速游戏示例 / Racing Game Example

参考 `config/examples/racing-game.json`：

- 强调速度和刺激感
- 包含车辆定制和锦标赛
- 针对竞速游戏优化的关键词

---

## 🤝 技术支持 / Technical Support

### 获取帮助 / Getting Help

1. **查看文档**: 首先阅读本使用指南
2. **运行验证**: 使用 `npm run validate-switch` 检查问题
3. **查看示例**: 参考 `config/examples/` 中的示例配置
4. **生成报告**: 使用 `npm run validate-report` 获取详细信息

### 常用命令速查 / Quick Command Reference

```bash
# 基本操作
npm run switch-game "Game Name"                    # 基本切换
npm run switch-preview "Game Name"                 # 预览模式
npm run validate-switch                           # 验证配置

# 高级操作  
npm run switch-game "Name" -- --upload=./files/   # 上传文件
npm run switch-game "Name" -- --embed=iframe      # 使用iframe
npm run validate-report                           # 详细报告

# 备份恢复
npm run game:backup-list                          # 列出备份
npm run game:restore <timestamp>                  # 恢复备份
```

---

## 🎉 结语 / Conclusion

这个游戏网站模板化系统为您提供了：

✅ **一键切换主游戏**
✅ **自动生成800+字SEO内容**  
✅ **完整的备份恢复系统**
✅ **多种游戏嵌入方式**
✅ **实时验证和报告**
✅ **完美的SEO优化**

现在您可以轻松管理游戏网站，专注于提供优质的游戏体验！

---

## 📄 许可证 / License

MIT License - 可自由使用和修改

---

**版本**: v1.0.0  
**更新时间**: 2024年1月  
**作者**: Game Template System Team
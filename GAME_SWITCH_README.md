# 🎮 游戏网站一键切换系统 / Game Website One-Click Switch System

> **Transform your website into a switchable game template with one command!**
> **一个命令将您的网站转换为可切换的游戏模板！**

## ⚡ 快速开始 / Quick Start

### 1. 安装依赖 / Install Dependencies
```bash
npm install
```

### 2. 一键切换游戏 / One-Click Game Switch
```bash
# 最简单的方式 - 本地文件
# Simplest way - Local files
npm run switch-game "My Awesome Game"

# 上传游戏文件
# Upload game files  
npm run switch-game "My Game" "Description" -- --upload=./my-game-files/

# 使用外部链接
# Use external link
npm run switch-game "Web Game" -- --embed=iframe --iframe=https://example.com/game/
```

### 3. 验证结果 / Validate Results
```bash
npm run validate-switch
```

### 4. 启动开发 / Start Development
```bash
npm run dev
```

## 🚀 系统功能 / System Features

### ✅ 核心功能 / Core Features
- 🎯 **一键切换主游戏** / One-click main game switching
- 📝 **自动生成800+字SEO内容** / Auto-generate 800+ word SEO content
- 🔧 **支持本地文件和iframe** / Support local files and iframe
- 💾 **完整备份恢复系统** / Complete backup & restore system
- 📊 **实时验证和报告** / Real-time validation & reporting
- 🌐 **完美SEO优化** / Perfect SEO optimization

### 📁 支持的游戏类型 / Supported Game Types
- **本地游戏文件** (HTML5, Unity WebGL, etc.)
- **外部游戏链接** (iframe嵌入)
- **多种游戏类别** (Action, Puzzle, Racing, etc.)

## 📋 可用命令 / Available Commands

### 基本命令 / Basic Commands
```bash
npm run switch-game "Game Name"           # 基本切换
npm run switch-preview "Game Name"        # 预览模式
npm run validate-switch                   # 验证配置
npm run validate-quick                    # 快速检查
```

### 高级命令 / Advanced Commands  
```bash
# 完整配置
npm run switch-game "Game Name" "Description" -- \
  --upload=./files/ \
  --category=Action \
  --domain=example.com \
  --keywords="game,action,free"

# 外部iframe
npm run switch-game "External Game" -- \
  --embed=iframe \
  --iframe=https://example.com/game/

# 备份管理
npm run game:backup-list                  # 查看备份
npm run game:restore <timestamp>          # 恢复备份
```

## 📊 自动生成内容 / Auto-Generated Content

切换游戏时自动生成：
Content automatically generated when switching games:

- ✅ **800+ 英文单词SEO内容** / 800+ word English SEO content
- ✅ **3-5% 关键词密度优化** / 3-5% keyword density optimization  
- ✅ **完整meta标签** / Complete meta tags
- ✅ **OpenGraph & Twitter卡片** / OpenGraph & Twitter cards
- ✅ **JSON-LD结构化数据** / JSON-LD structured data
- ✅ **自动更新sitemap** / Auto-updated sitemap

## 🎯 使用场景 / Use Cases

### 场景1: 本地游戏文件 / Scenario 1: Local Game Files
```bash
# 1. 准备游戏文件
mkdir my-racing-game
# 将HTML5游戏文件放入文件夹

# 2. 执行切换  
npm run switch-game "Racing Master" "Ultimate racing experience" -- --upload=./my-racing-game/

# 3. 验证并启动
npm run validate-switch && npm run dev
```

### 场景2: 外部游戏链接 / Scenario 2: External Game Link
```bash
npm run switch-game "Puzzle Challenge" "Brain teasing puzzles" -- \
  --embed=iframe \
  --iframe=https://puzzlegames.com/challenge/ \
  --category=Puzzle
```

### 场景3: 快速测试 / Scenario 3: Quick Testing
```bash
# 预览模式 - 不实际修改
npm run switch-game "Test Game" -- --dry-run

# 查看会发生什么变化
npm run validate-report
```

## 📂 文件结构 / File Structure

```
project/
├── config/
│   ├── main-game.ts          # 主配置文件 (自动生成)
│   ├── types.ts              # TypeScript类型
│   └── examples/             # 示例配置
├── components/
│   └── GameEmbed.tsx         # 游戏嵌入组件
├── tools/
│   ├── switch-main-game.ts   # 切换脚本
│   ├── validate-switch.ts    # 验证脚本
│   └── seo-content-generator.ts # SEO生成器
└── backups/                  # 自动备份
```

## 🔍 验证系统 / Validation System

系统提供完整的验证功能：
The system provides complete validation:

```bash
# 快速健康检查
npm run validate-quick

# 完整验证
npm run validate-switch  

# 生成详细报告
npm run validate-report
```

验证内容包括：
Validation includes:
- ✅ 配置文件完整性 / Config file integrity
- ✅ 游戏文件存在性 / Game files existence  
- ✅ SEO标签优化度 / SEO tags optimization
- ✅ 图片资源检查 / Image resources check
- ✅ Sitemap有效性 / Sitemap validity

## 🛡️ 备份系统 / Backup System

每次切换都会自动备份：
Automatic backup on every switch:

```bash
# 查看所有备份
npm run game:backup-list

# 恢复特定备份  
npm run game:restore 2024-01-15T10-30-00-000Z

# 备份位置: ./backups/
```

## 📖 完整文档 / Complete Documentation

查看完整使用指南：
See complete usage guide:
- 📘 [完整使用指南 / Complete Guide](./GAME_TEMPLATE_GUIDE.md)
- 📝 [配置示例 / Config Examples](./config/examples/)
- 🔧 [API参考 / API Reference](./tools/)

## 🆘 故障排除 / Troubleshooting

### 常见问题 / Common Issues

1. **切换失败** / Switch failed:
   ```bash
   npm run validate-switch  # 检查配置
   npm run switch-game "Name" -- --dry-run  # 预览模式
   ```

2. **游戏无法显示** / Game not displaying:
   ```bash
   # 检查游戏文件路径
   ls -la public/game/your-game/
   # 确保index.html存在
   ```

3. **SEO内容问题** / SEO content issues:
   ```bash
   npm run validate-report  # 查看详细报告
   ```

## 📞 技术支持 / Technical Support

- 📖 **文档**: [GAME_TEMPLATE_GUIDE.md](./GAME_TEMPLATE_GUIDE.md)
- 📁 **示例**: [config/examples/](./config/examples/)
- 🔧 **工具**: [tools/](./tools/)

## 🎉 开始使用 / Get Started

1. **克隆项目** / Clone project
2. **安装依赖** / Install dependencies: `npm install`
3. **切换游戏** / Switch game: `npm run switch-game "Your Game"`
4. **验证结果** / Validate: `npm run validate-switch`
5. **启动开发** / Start dev: `npm run dev`

---

## 🌟 特性亮点 / Feature Highlights

| 功能 Feature | 描述 Description |
|-------------|-----------------|
| 🎮 一键切换 | 一个命令完成所有配置 |
| 📝 SEO优化 | 自动生成800+字优化内容 |  
| 🔄 备份恢复 | 完整的版本控制系统 |
| 🎯 多格式支持 | 本地文件+外部iframe |
| ⚡ 实时验证 | 即时检查和报告 |
| 🌐 完美兼容 | 支持所有现代浏览器 |

**现在就开始使用，让游戏网站管理变得简单！**
**Start using now and make game website management simple!**

---

**License**: MIT | **Version**: 1.0.0 | **Author**: Game Template Team
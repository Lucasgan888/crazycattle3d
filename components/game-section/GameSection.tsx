'use client';

import { useState, useRef, useEffect } from 'react';
import { mainGameConfig } from "@/config/main-game";
import { theme } from "@/config/theme";
import { layout } from "@/config/layout";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import GameEmbed from "@/components/GameEmbed";
import { SEOContentGenerator } from "@/tools/seo-content-generator";

interface GameSectionProps {
  // 保持向后兼容性，但现在从新配置系统读取
  // Maintain backward compatibility, but now reads from new config system
}

export function GameSection({}: GameSectionProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // 从新配置系统获取游戏信息
  // Get game info from new config system
  const game = mainGameConfig.mainGame;
  
  // 生成SEO优化的内容
  // Generate SEO-optimized content
  const seoGenerator = new SEOContentGenerator();
  const seoContent = seoGenerator.generateGamePage(game);

  const toggleFullscreen = async () => {
    if (!document.fullscreenElement) {
      await containerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      await document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  // 监听全屏状态变化
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  return (
    <section
      id="game-section"
      className={cn(
        theme.gameSection.layout.section,
        theme.layout.section.scrollMargin
      )}
    >
      {/* 游戏标题 */}
      {layout.gameSection.isVisible.title && (
        <h1 className={cn(
          theme.gameSection.typography.title,
          theme.gameSection.spacing.title,
          "text-4xl md:text-6xl font-bold mb-6"
        )}>
          {game.name}
        </h1>
      )}

      {/* 游戏容器 */}
      <div
        ref={containerRef}
        className={cn(
          "w-full max-w-4xl mx-auto overflow-hidden shadow-xl relative",
          theme.gameSection.colors.container,
          "mb-0 rounded-lg",
          // 全屏时填满整个屏幕
          isFullscreen && "!max-w-none !w-screen !h-screen !rounded-none !mx-0"
        )}
      >
        {/* 使用新的GameEmbed组件 */}
        <GameEmbed game={game} className={isFullscreen ? "!h-screen" : ""} />
        
        {/* 全屏时的退出按钮 */}
        {isFullscreen && (
          <Button
            onClick={toggleFullscreen}
            className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white border-none z-10"
            size="sm"
          >
            ✕ Exit Fullscreen
          </Button>
        )}
      </div>

      {/* 按钮行 */}
      <div className={cn(
        "flex justify-between items-center w-full max-w-4xl mx-auto mb-16 bg-gray-700/70 dark:bg-gray-800/70 text-white rounded-b-lg p-4 shadow-md",
        // 全屏时隐藏按钮行
        isFullscreen && "hidden"
      )}>
        {/* 播放按钮 */}
        <div className="flex gap-4">
          <Button
            onClick={() => window.location.reload()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2"
          >
            🎮 Play {game.name}
          </Button>
          <Button
            variant="outline"
            className="bg-transparent border-white/30 text-white hover:bg-white/10"
          >
            🔄 Restart
          </Button>
        </div>

        {/* 全屏按钮 */}
        <Button
          onClick={toggleFullscreen}
          size="icon"
          variant="ghost"
          className="hover:bg-white/20 text-white rounded-full p-1.5 transition-colors"
          aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 9L4 4m0 0l5 0M4 4l0 5" />
            <path d="M15 9l5-5m0 0h-5m5 0v5" />
            <path d="M9 15l-5 5m0 0h5m-5 0v-5" />
            <path d="M15 15l5 5m0 0v-5m0 5h-5" />
          </svg>
        </Button>
      </div>
    </section>
  );
}

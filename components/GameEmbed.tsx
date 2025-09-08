import type { Game } from '@/config/types';
import { cn } from '@/lib/utils';

interface GameEmbedProps {
  game: Game;
  className?: string;
}

// 游戏嵌入组件 - 自动判断显示方式
// Game embed component - automatically determines display method
export default function GameEmbed({ game, className }: GameEmbedProps) {
  // 如果是iframe类型
  // If iframe type
  if (game.embed.type === 'iframe' && game.embed.iframeSrc) {
    return (
      <iframe 
        src={game.embed.iframeSrc}
        title={game.name}
        loading="lazy"
        allowFullScreen
        allow="autoplay; fullscreen; gamepad; keyboard-map; xr-spatial-tracking"
        className={cn(
          "w-full h-[80vh] border-0 rounded-lg bg-black",
          className
        )}
      />
    );
  }
  
  // 如果是本地文件类型
  // If local file type
  if (game.embed.type === 'local' && game.embed.localPath) {
    return (
      <iframe 
        src={game.embed.localPath}
        title={game.name}
        loading="lazy"
        allowFullScreen
        allow="autoplay; fullscreen; gamepad; keyboard-map; xr-spatial-tracking"
        className={cn(
          "w-full h-[80vh] border-0 rounded-lg bg-black",
          className
        )}
      />
    );
  }
  
  // 如果配置有问题
  // If configuration has issues
  return (
    <div className={cn(
      "w-full h-[400px] flex items-center justify-center bg-gray-100 rounded-lg",
      className
    )}>
      <div className="text-center p-8">
        <p className="text-gray-600 text-lg mb-4">Game embed is not configured correctly.</p>
        <p className="text-gray-500 text-sm">
          Please check the embed configuration for "{game.name}"
        </p>
        <div className="mt-4 text-xs text-gray-400 font-mono">
          <p>Type: {game.embed.type}</p>
          <p>Source: {game.embed.iframeSrc || game.embed.localPath || 'Not specified'}</p>
        </div>
      </div>
    </div>
  );
}
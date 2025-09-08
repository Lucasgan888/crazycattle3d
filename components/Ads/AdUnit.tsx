'use client';

import { useEffect, useRef, useState } from 'react';
import { adsConfig, shouldShowAds, isMobileDevice, getResponsiveAdSize, type AdPosition } from '@/config/ads';
import { useAnalytics } from '@/hooks/useAnalytics';
import { cn } from '@/lib/utils';

interface AdUnitProps {
  position: AdPosition;
  className?: string;
  priority?: 'high' | 'normal' | 'low';
  hideOnMobile?: boolean;
  showOnlyOnMobile?: boolean;
}

// 通用广告单元组件
// Universal ad unit component
export default function AdUnit({ 
  position, 
  className = '', 
  priority = 'normal',
  hideOnMobile = false,
  showOnlyOnMobile = false
}: AdUnitProps) {
  const adRef = useRef<HTMLDivElement>(null);
  const [adLoaded, setAdLoaded] = useState(false);
  const [adError, setAdError] = useState(false);
  const { trackAdClick, trackError } = useAnalytics();
  const adUnit = adsConfig.adUnits[position];
  
  // 检查是否应该显示广告
  // Check if ad should be displayed
  const shouldDisplay = (() => {
    if (!shouldShowAds()) return false;
    
    const isMobile = isMobileDevice();
    
    if (hideOnMobile && isMobile) return false;
    if (showOnlyOnMobile && !isMobile) return false;
    
    return true;
  })();

  useEffect(() => {
    // 如果广告已启用且不是测试模式，加载AdSense
    // If ads enabled and not test mode, load AdSense
    if (shouldDisplay && adsConfig.enabled && !adsConfig.testMode && adRef.current) {
      try {
        // 确保 AdSense 脚本已加载
        // Ensure AdSense script is loaded
        if (typeof window !== 'undefined') {
          // 初始化 adsbygoogle 数组
          // Initialize adsbygoogle array
          (window as any).adsbygoogle = (window as any).adsbygoogle || [];
          
          // 推送广告配置
          // Push ad configuration
          (window as any).adsbygoogle.push({});
          
          setAdLoaded(true);
          
          // 跟踪广告加载
          // Track ad load
          if (process.env.NODE_ENV === 'development') {
            console.log(`🎯 AdSense unit loaded: ${position}`);
          }
        }
      } catch (error) {
        console.error('AdSense load error:', error);
        trackError('network', `AdSense load failed for position: ${position}`);
        setAdError(true);
      }
    }
  }, [shouldDisplay, position, trackError]);
  
  // 广告点击追踪
  // Ad click tracking
  const handleAdClick = () => {
    trackAdClick(position, adUnit.slot);
  };

  // 广告错误处理
  // Ad error handling
  const handleAdError = () => {
    setAdError(true);
    trackError('network', `AdSense error for position: ${position}`);
  };
  
  // 如果不应该显示，返回空
  // If shouldn't display, return null
  if (!shouldDisplay) {
    return null;
  }
  
  // 获取响应式尺寸
  // Get responsive size
  const responsiveSize = getResponsiveAdSize(adUnit.size);
  const [width, height] = responsiveSize.split('x').map(Number);

  // 如果广告未启用或测试模式，显示占位符
  // If ads not enabled or test mode, show placeholder
  if (!adsConfig.enabled || adsConfig.testMode) {
    return (
      <div 
        className={cn(
          "ad-placeholder border-2 border-dashed border-gray-300 bg-gray-50 flex items-center justify-center text-gray-500 rounded-lg transition-all hover:bg-gray-100",
          className
        )}
        style={{
          width: `${width}px`,
          height: `${height}px`,
          minWidth: isMobileDevice() ? '280px' : `${width}px`,
          minHeight: `${height}px`
        }}
      >
        <div className="text-center p-4">
          <div className="text-sm font-medium mb-1">
            📢 广告位占位符 / Ad Placeholder
          </div>
          <div className="text-xs text-gray-400 mb-1">
            {adUnit.description}
          </div>
          <div className="text-xs text-gray-400">
            位置: {position} | 尺寸: {responsiveSize} | 优先级: {priority}
          </div>
          {adsConfig.testMode && (
            <div className="text-xs text-blue-500 mt-1">
              🔍 测试模式 / Test Mode
            </div>
          )}
        </div>
      </div>
    );
  }
  
  // 错误状态显示
  // Error state display
  if (adError) {
    return (
      <div 
        className={cn(
          "ad-error border border-red-200 bg-red-50 flex items-center justify-center text-red-500 rounded-lg",
          className
        )}
        style={{
          width: `${width}px`,
          height: `${height}px`
        }}
      >
        <div className="text-center p-2">
          <div className="text-xs">❌ 广告加载失败 / Ad Load Failed</div>
        </div>
      </div>
    );
  }
  
  // 真实广告单元
  // Real ad unit
  return (
    <div 
      ref={adRef}
      className={cn("ad-unit", className)}
      onClick={handleAdClick}
      data-ad-position={position}
      data-ad-slot={adUnit.slot}
      data-priority={priority}
    >
      {/* AdSense 广告代码 */}
      {/* AdSense ad code */}
      <ins
        className="adsbygoogle"
        style={{ 
          display: 'block',
          width: `${width}px`,
          height: `${height}px`
        }}
        data-ad-client={adsConfig.adsenseId}
        data-ad-slot={adUnit.slot}
        data-ad-format={adUnit.responsive ? "auto" : ""}
        data-full-width-responsive={adUnit.responsive ? "true" : "false"}
        onError={handleAdError}
      />
      
      {/* 加载状态指示器（开发环境） */}
      {/* Loading indicator (development) */}
      {process.env.NODE_ENV === 'development' && !adLoaded && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
          <div className="text-xs text-gray-500">Loading Ad...</div>
        </div>
      )}
    </div>
  );
}

// 移动端底部固定广告组件
// Mobile bottom sticky ad component
export function MobileStickyAd() {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    if (isMobileDevice()) {
      setIsVisible(true);
    }
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 md:hidden">
      <div className="flex justify-center p-2">
        <AdUnit 
          position="mobileFooter" 
          priority="high"
          showOnlyOnMobile
        />
      </div>
      <button
        onClick={() => setIsVisible(false)}
        className="absolute top-1 right-1 w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-xs text-gray-500"
        aria-label="Close ad"
      >
        ×
      </button>
    </div>
  );
}

// 自适应广告横幅组件
// Adaptive ad banner component  
export function AdaptiveBanner({ 
  position, 
  maxWidth = 728,
  className 
}: { 
  position: AdPosition; 
  maxWidth?: number;
  className?: string;
}) {
  const [containerWidth, setContainerWidth] = useState(maxWidth);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        const width = containerRef.current.offsetWidth;
        setContainerWidth(Math.min(width, maxWidth));
      }
    };

    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, [maxWidth]);

  return (
    <div ref={containerRef} className={cn("w-full flex justify-center", className)}>
      <div style={{ width: containerWidth }}>
        <AdUnit position={position} />
      </div>
    </div>
  );
}

// 侧边栏广告组件（自动隐藏在小屏幕）
// Sidebar ad component (auto-hide on small screens)
export function SidebarAd({ className }: { className?: string }) {
  return (
    <div className={cn("hidden lg:block", className)}>
      <AdUnit position="sidebarSquare" hideOnMobile />
    </div>
  );
}
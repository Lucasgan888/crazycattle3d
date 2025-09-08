'use client';

import Script from 'next/script';
import { analyticsConfig, getAnalyticsStatus } from '@/config/analytics';

// GA4 跟踪组件
// GA4 tracking component
export default function GoogleAnalytics() {
  const { measurementId, enabled, debugMode } = analyticsConfig.ga4;
  const status = getAnalyticsStatus();
  
  // 如果未启用或没有真实ID，不渲染
  // Don't render if disabled or no real ID
  if (!enabled || !status.hasRealGA4Id) {
    // 开发环境显示调试信息
    // Show debug info in development
    if (process.env.NODE_ENV === 'development') {
      console.log('🔍 GA4 Debug Info:', {
        enabled,
        measurementId,
        hasRealId: status.hasRealGA4Id,
        isProduction: status.isProduction
      });
    }
    return null;
  }

  return (
    <>
      {/* GA4 全局站点标签 / GA4 Global Site Tag */}
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          
          gtag('config', '${measurementId}', {
            page_title: document.title,
            page_location: window.location.href,
            custom_map: {
              'custom_parameter_1': 'game_name',
              'custom_parameter_2': 'user_engagement'
            },
            ${debugMode ? 'debug_mode: true,' : ''}
            send_page_view: true
          });

          // 发送自定义游戏网站事件
          // Send custom game website events
          gtag('event', 'website_loaded', {
            event_category: 'engagement',
            event_label: 'initial_load',
            site_type: 'gaming'
          });

          ${debugMode ? `
          // 开发环境调试日志
          // Development debug logs
          console.log('🎯 GA4 initialized with ID: ${measurementId}');
          console.log('🔍 Debug mode enabled');
          ` : ''}
        `}
      </Script>
      
      {/* 增强电子商务和游戏特定跟踪 */}
      {/* Enhanced ecommerce and game-specific tracking */}
      <Script id="ga4-enhanced-tracking" strategy="afterInteractive">
        {`
          // 游戏互动增强跟踪
          // Enhanced game interaction tracking
          function initGameTracking() {
            // 跟踪页面停留时间
            // Track page dwell time
            let startTime = Date.now();
            
            window.addEventListener('beforeunload', function() {
              const dwellTime = Math.round((Date.now() - startTime) / 1000);
              gtag('event', 'page_dwell_time', {
                event_category: 'engagement',
                event_label: 'page_exit',
                value: dwellTime
              });
            });
            
            // 跟踪滚动深度
            // Track scroll depth
            let maxScroll = 0;
            window.addEventListener('scroll', function() {
              const scrollPercent = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
              if (scrollPercent > maxScroll) {
                maxScroll = scrollPercent;
                if (scrollPercent % 25 === 0 && scrollPercent > 0) {
                  gtag('event', 'scroll_depth', {
                    event_category: 'engagement',
                    event_label: 'scroll_' + scrollPercent + '_percent',
                    value: scrollPercent
                  });
                }
              }
            });
          }
          
          // 初始化跟踪
          // Initialize tracking
          if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initGameTracking);
          } else {
            initGameTracking();
          }
        `}
      </Script>
    </>
  );
}

// 额外的GA4辅助组件用于特殊页面
// Additional GA4 helper component for special pages
export function GA4PageView({ 
  pageTitle, 
  pagePath, 
  gameCategory 
}: { 
  pageTitle: string; 
  pagePath: string; 
  gameCategory?: string; 
}) {
  return (
    <Script id={`ga4-page-${pagePath.replace(/\//g, '-')}`} strategy="afterInteractive">
      {`
        if (window.gtag) {
          gtag('config', '${analyticsConfig.ga4.measurementId}', {
            page_title: '${pageTitle}',
            page_path: '${pagePath}',
            ${gameCategory ? `custom_parameter_game_category: '${gameCategory}',` : ''}
          });
        }
      `}
    </Script>
  );
}
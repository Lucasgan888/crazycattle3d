'use client';

import { useCallback, useEffect, useRef } from 'react';
import { analyticsConfig, getAnalyticsStatus } from '@/config/analytics';
import { mainGameConfig } from '@/config/main-game';

// GA4 事件跟踪Hook
// GA4 event tracking Hook
export function useAnalytics() {
  const sessionStartTime = useRef<number>(Date.now());
  const status = getAnalyticsStatus();
  
  // 检查GA4是否可用
  // Check if GA4 is available
  const isGAReady = useCallback(() => {
    return typeof window !== 'undefined' && 
           window.gtag && 
           status.ga4Enabled && 
           status.hasRealGA4Id;
  }, [status.ga4Enabled, status.hasRealGA4Id]);
  
  // 发送自定义事件
  // Send custom event
  const trackEvent = useCallback((
    eventName: string, 
    parameters?: Record<string, any>
  ) => {
    if (!isGAReady()) {
      if (status.debugMode) {
        console.log('🔍 GA4 Event (Debug):', eventName, parameters);
      }
      return;
    }

    window.gtag('event', eventName, {
      // 通用参数
      // Universal parameters
      custom_parameter: true,
      game_name: mainGameConfig.mainGame.name,
      game_category: mainGameConfig.mainGame.seoContent.category,
      timestamp: new Date().toISOString(),
      session_duration: Math.round((Date.now() - sessionStartTime.current) / 1000),
      page_url: window.location.href,
      page_title: document.title,
      // 自定义参数
      // Custom parameters
      ...parameters
    });

    if (status.debugMode) {
      console.log('🎯 GA4 Event Sent:', eventName, parameters);
    }
  }, [isGAReady, status.debugMode]);
  
  // 游戏开始事件
  // Game start event
  const trackGameStart = useCallback((gameName?: string) => {
    trackEvent(analyticsConfig.ga4.customEvents.gameStart, {
      game_name: gameName || mainGameConfig.mainGame.name,
      event_category: 'game_interaction',
      event_label: 'game_start',
      game_type: mainGameConfig.mainGame.embed.type,
      engagement_time_msec: 1
    });
  }, [trackEvent]);
  
  // 游戏完成事件
  // Game complete event
  const trackGameComplete = useCallback((
    gameName?: string, 
    score?: number, 
    duration?: number,
    level?: string
  ) => {
    trackEvent(analyticsConfig.ga4.customEvents.gameComplete, {
      game_name: gameName || mainGameConfig.mainGame.name,
      score: score || 0,
      duration_seconds: duration || 0,
      level: level || 'default',
      event_category: 'game_interaction',
      event_label: 'game_complete',
      value: score || 0
    });
  }, [trackEvent]);
  
  // 游戏切换事件
  // Game switch event
  const trackGameSwitch = useCallback((
    fromGame: string, 
    toGame: string, 
    switchMethod: 'click' | 'url' = 'click'
  ) => {
    trackEvent(analyticsConfig.ga4.customEvents.gameSwitch, {
      from_game: fromGame,
      to_game: toGame,
      switch_method: switchMethod,
      event_category: 'navigation',
      event_label: 'game_switch'
    });
  }, [trackEvent]);
  
  // 全屏切换事件
  // Fullscreen toggle event
  const trackFullscreenToggle = useCallback((
    action: 'enter' | 'exit',
    gameName?: string
  ) => {
    trackEvent(analyticsConfig.ga4.customEvents.fullscreen, {
      action,
      game_name: gameName || mainGameConfig.mainGame.name,
      event_category: 'game_interaction',
      event_label: `fullscreen_${action}`
    });
  }, [trackEvent]);
  
  // 广告点击事件
  // Ad click event
  const trackAdClick = useCallback((
    adPosition: string, 
    adUnit: string,
    revenue?: number
  ) => {
    trackEvent(analyticsConfig.ga4.customEvents.adClick, {
      ad_position: adPosition,
      ad_unit: adUnit,
      event_category: 'monetization',
      event_label: 'ad_interaction',
      currency: 'USD',
      value: revenue || 0
    });
  }, [trackEvent]);
  
  // 页面浏览事件
  // Page view event
  const trackPageView = useCallback((
    pagePath: string, 
    pageTitle: string,
    gameCategory?: string
  ) => {
    if (!isGAReady()) return;

    window.gtag('config', analyticsConfig.ga4.measurementId, {
      page_path: pagePath,
      page_title: pageTitle,
      page_location: window.location.href,
      content_group1: gameCategory || mainGameConfig.mainGame.seoContent.category,
      custom_parameter_page_type: 'game_website'
    });

    // 发送页面浏览事件
    // Send page view event
    trackEvent('page_view', {
      page_path: pagePath,
      page_title: pageTitle,
      page_category: gameCategory,
      event_category: 'engagement'
    });
  }, [isGAReady, trackEvent]);

  // 用户互动事件
  // User engagement events
  const trackUserEngagement = useCallback((
    engagementType: 'scroll' | 'click' | 'hover' | 'form_interaction',
    elementName: string,
    value?: number
  ) => {
    trackEvent('user_engagement', {
      engagement_type: engagementType,
      element_name: elementName,
      event_category: 'engagement',
      event_label: `${engagementType}_${elementName}`,
      value: value || 1
    });
  }, [trackEvent]);

  // 错误跟踪事件
  // Error tracking event
  const trackError = useCallback((
    errorType: 'javascript' | 'network' | 'game_load',
    errorMessage: string,
    errorUrl?: string
  ) => {
    trackEvent('exception', {
      description: `${errorType}: ${errorMessage}`,
      fatal: false,
      error_type: errorType,
      error_url: errorUrl || window.location.href,
      event_category: 'error'
    });
  }, [trackEvent]);

  // 搜索事件
  // Search event
  const trackSearch = useCallback((
    searchTerm: string,
    resultsCount?: number
  ) => {
    trackEvent('search', {
      search_term: searchTerm,
      results_count: resultsCount || 0,
      event_category: 'engagement',
      event_label: 'site_search'
    });
  }, [trackEvent]);

  // 性能追踪事件
  // Performance tracking event
  const trackPerformance = useCallback((
    metricName: string,
    value: number,
    unit: 'ms' | 'bytes' | 'score' = 'ms'
  ) => {
    trackEvent('performance_metric', {
      metric_name: metricName,
      metric_value: value,
      metric_unit: unit,
      event_category: 'performance',
      event_label: `${metricName}_${unit}`,
      value
    });
  }, [trackEvent]);

  // 自动跟踪错误
  // Auto track errors
  useEffect(() => {
    if (!isGAReady()) return;

    const handleError = (event: ErrorEvent) => {
      trackError('javascript', event.message, event.filename);
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      trackError('javascript', String(event.reason));
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, [isGAReady, trackError]);

  return {
    // 基础方法
    // Basic methods
    trackEvent,
    trackPageView,
    
    // 游戏特定方法
    // Game-specific methods  
    trackGameStart,
    trackGameComplete,
    trackGameSwitch,
    trackFullscreenToggle,
    
    // 商业化方法
    // Monetization methods
    trackAdClick,
    
    // 用户体验方法
    // User experience methods
    trackUserEngagement,
    trackSearch,
    
    // 技术方法
    // Technical methods
    trackError,
    trackPerformance,
    
    // 状态
    // Status
    isGAReady: isGAReady(),
    debugMode: status.debugMode
  };
}

// 类型声明
// Type declarations
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}
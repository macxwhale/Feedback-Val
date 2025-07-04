
/**
 * Enhanced Performance Service Implementation
 * Provides comprehensive performance monitoring and metrics
 */

import type { 
  IPerformanceService, 
  PerformanceMetrics, 
  ComponentPerformance, 
  SystemPerformance 
} from '@/domain/interfaces/IPerformanceService';
import { ComponentTracker } from '@/infrastructure/performance/ComponentTracker';
import { MetricsAggregator } from '@/infrastructure/performance/MetricsAggregator';

export class EnhancedPerformanceService implements IPerformanceService {
  private componentMetrics = new Map<string, ComponentPerformance>();

  async getMetrics(): Promise<PerformanceMetrics> {
    const snapshot = MetricsAggregator.captureSnapshot();
    const componentSummary = ComponentTracker.getComponentSummary();
    
    return {
      componentRenderTime: this.calculateAverageRenderTime(componentSummary),
      totalRenderCount: this.calculateTotalRenderCount(componentSummary),
      memoryUsage: snapshot.memoryUsage?.used || 0,
      bundleSize: await this.getBundleSize(),
      loadTime: snapshot.navigationTiming?.loadComplete || 0
    };
  }

  async getComponentPerformance(): Promise<ComponentPerformance[]> {
    const componentSummary = ComponentTracker.getComponentSummary();
    
    return Object.entries(componentSummary).map(([name, stats]) => ({
      componentName: name,
      avgRenderTime: stats.avgRenderTime,
      renderCount: stats.totalRenders,
      lastRenderTime: stats.maxRenderTime
    }));
  }

  async getSystemPerformance(): Promise<SystemPerformance> {
    const memoryInfo = (performance as any).memory;
    
    return {
      cpu: await this.getCPUUsage(),
      memory: memoryInfo ? (memoryInfo.usedJSHeapSize / memoryInfo.jsHeapSizeLimit) * 100 : 0,
      network: await this.getNetworkPerformance(),
      storage: await this.getStorageUsage()
    };
  }

  trackComponentRender(componentName: string, renderTime: number): void {
    ComponentTracker.trackRender(componentName, renderTime);
    
    const existing = this.componentMetrics.get(componentName);
    if (existing) {
      existing.renderCount++;
      existing.avgRenderTime = (existing.avgRenderTime * (existing.renderCount - 1) + renderTime) / existing.renderCount;
      existing.lastRenderTime = renderTime;
    } else {
      this.componentMetrics.set(componentName, {
        componentName,
        avgRenderTime: renderTime,
        renderCount: 1,
        lastRenderTime: renderTime
      });
    }
  }

  clearMetrics(): void {
    ComponentTracker.clearMetrics();
    MetricsAggregator.clearMetrics();
    this.componentMetrics.clear();
  }

  private calculateAverageRenderTime(componentSummary: Record<string, any>): number {
    const components = Object.values(componentSummary);
    if (components.length === 0) return 0;
    
    const totalTime = components.reduce((sum: number, comp: any) => sum + comp.avgRenderTime, 0);
    return totalTime / components.length;
  }

  private calculateTotalRenderCount(componentSummary: Record<string, any>): number {
    return Object.values(componentSummary).reduce((sum: number, comp: any) => sum + comp.totalRenders, 0);
  }

  private async getBundleSize(): Promise<number> {
    try {
      // Estimate bundle size based on loaded scripts
      const scripts = document.querySelectorAll('script[src]');
      let totalSize = 0;
      
      for (const script of scripts) {
        try {
          const response = await fetch((script as HTMLScriptElement).src, { method: 'HEAD' });
          const contentLength = response.headers.get('content-length');
          if (contentLength) {
            totalSize += parseInt(contentLength, 10);
          }
        } catch {
          // Ignore errors for cross-origin scripts
        }
      }
      
      return totalSize;
    } catch {
      return 0;
    }
  }

  private async getCPUUsage(): Promise<number> {
    // Simplified CPU usage estimation
    const start = performance.now();
    const iterations = 10000;
    
    for (let i = 0; i < iterations; i++) {
      Math.random();
    }
    
    const end = performance.now();
    const executionTime = end - start;
    
    // Normalize to percentage (this is a rough approximation)
    return Math.min(100, (executionTime / 10) * 100);
  }

  private async getNetworkPerformance(): Promise<number> {
    try {
      const start = performance.now();
      await fetch('/favicon.ico', { method: 'HEAD' });
      const end = performance.now();
      
      const latency = end - start;
      // Convert latency to a performance score (lower is better, normalize to 0-100)
      return Math.max(0, 100 - (latency / 10));
    } catch {
      return 0;
    }
  }

  private async getStorageUsage(): Promise<number> {
    try {
      if ('storage' in navigator && 'estimate' in navigator.storage) {
        const estimate = await navigator.storage.estimate();
        const used = estimate.usage || 0;
        const quota = estimate.quota || 1;
        return (used / quota) * 100;
      }
      return 0;
    } catch {
      return 0;
    }
  }
}


/**
 * Performance Service Interface
 * Defines the contract for performance monitoring operations
 */

export interface PerformanceMetrics {
  componentRenderTime: number;
  totalRenderCount: number;
  memoryUsage: number;
  bundleSize: number;
  loadTime: number;
}

export interface ComponentPerformance {
  componentName: string;
  avgRenderTime: number;
  renderCount: number;
  lastRenderTime: number;
}

export interface SystemPerformance {
  cpu: number;
  memory: number;
  network: number;
  storage: number;
}

export interface IPerformanceService {
  getMetrics(): Promise<PerformanceMetrics>;
  getComponentPerformance(): Promise<ComponentPerformance[]>;
  getSystemPerformance(): Promise<SystemPerformance>;
  trackComponentRender(componentName: string, renderTime: number): void;
  clearMetrics(): void;
}

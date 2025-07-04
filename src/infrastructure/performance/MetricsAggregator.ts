/**
 * Metrics Aggregator
 * Collects and aggregates performance metrics from various sources
 */

export interface ComponentMetric {
  componentName: string;
  renderTime: number;
  rerenderCount: number;
  timestamp: number;
}

export interface MetricsSummary {
  averages: Record<string, number>;
  totals: Record<string, number>;
  counts: Record<string, number>;
  percentiles: Record<string, number>;
}

export interface PerformanceSnapshot {
  timestamp: number;
  memoryUsage?: {
    used: number;
    total: number;
    limit: number;
  };
  navigationTiming?: {
    domContentLoaded: number;
    loadComplete: number;
    firstPaint?: number;
  };
  componentMetrics: ComponentMetric[];
}

class MetricsAggregatorClass {
  private snapshots: PerformanceSnapshot[] = [];
  private maxSnapshots = 100;

  captureSnapshot(): PerformanceSnapshot {
    const snapshot: PerformanceSnapshot = {
      timestamp: Date.now(),
      componentMetrics: [],
    };

    // Capture memory usage if available
    if (typeof window !== 'undefined' && 'memory' in performance) {
      const memory = (performance as any).memory;
      snapshot.memoryUsage = {
        used: memory.usedJSHeapSize,
        total: memory.totalJSHeapSize,
        limit: memory.jsHeapSizeLimit,
      };
    }

    // Capture navigation timing
    if (typeof window !== 'undefined' && performance.timing) {
      const timing = performance.timing;
      snapshot.navigationTiming = {
        domContentLoaded: timing.domContentLoadedEventEnd - timing.navigationStart,
        loadComplete: timing.loadEventEnd - timing.navigationStart,
      };

      // Try to get first paint timing
      if ('getEntriesByType' in performance) {
        const paintEntries = performance.getEntriesByType('paint');
        const firstPaint = paintEntries.find(entry => entry.name === 'first-paint');
        if (firstPaint) {
          snapshot.navigationTiming.firstPaint = firstPaint.startTime;
        }
      }
    }

    this.snapshots.push(snapshot);

    // Keep only recent snapshots
    if (this.snapshots.length > this.maxSnapshots) {
      this.snapshots = this.snapshots.slice(-this.maxSnapshots);
    }

    return snapshot;
  }

  getRecentSnapshots(count: number = 10): PerformanceSnapshot[] {
    return this.snapshots.slice(-count);
  }

  aggregateMetrics(): MetricsSummary {
    const summary: MetricsSummary = {
      averages: {},
      totals: {},
      counts: {},
      percentiles: {},
    };

    if (this.snapshots.length === 0) return summary;

    // Aggregate memory usage
    const memoryUsages = this.snapshots
      .map(s => s.memoryUsage?.used)
      .filter(Boolean) as number[];
    
    if (memoryUsages.length > 0) {
      summary.averages.memoryUsage = memoryUsages.reduce((a, b) => a + b, 0) / memoryUsages.length;
      summary.totals.memoryUsage = Math.max(...memoryUsages);
      summary.counts.memorySnapshots = memoryUsages.length;
    }

    // Aggregate navigation timing
    const loadTimes = this.snapshots
      .map(s => s.navigationTiming?.loadComplete)
      .filter(Boolean) as number[];
    
    if (loadTimes.length > 0) {
      summary.averages.loadTime = loadTimes.reduce((a, b) => a + b, 0) / loadTimes.length;
      summary.totals.maxLoadTime = Math.max(...loadTimes);
      summary.counts.loadTimeSnapshots = loadTimes.length;
    }

    return summary;
  }

  clearMetrics(): void {
    this.snapshots = [];
  }
}

export const MetricsAggregator = new MetricsAggregatorClass();

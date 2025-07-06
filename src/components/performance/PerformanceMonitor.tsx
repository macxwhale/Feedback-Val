
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Activity, Zap, Clock, AlertTriangle } from 'lucide-react';
import { performanceCollector } from '@/infrastructure/performance/PerformanceCollector';
import { MetricsAggregator } from '@/infrastructure/performance/MetricsAggregator';

interface PerformanceMonitorProps {
  children: React.ReactNode;
}

export const PerformanceMonitor: React.FC<PerformanceMonitorProps> = ({ children }) => {
  const [metrics, setMetrics] = useState({
    memoryUsage: 0,
    loadTime: 0,
    firstPaint: 0,
    renderCount: 0
  });
  
  const [showMetrics, setShowMetrics] = useState(false);

  useEffect(() => {
    const collectMetrics = () => {
      const snapshot = MetricsAggregator.captureSnapshot();
      const navigationMetrics = performanceCollector.collectNavigationMetrics();
      const paintMetrics = performanceCollector.collectPaintMetrics();

      setMetrics({
        memoryUsage: snapshot.memoryUsage?.used || 0,
        loadTime: navigationMetrics?.totalLoad || 0,
        firstPaint: paintMetrics['first-paint'] || 0,
        renderCount: MetricsAggregator.getRecentSnapshots().length
      });
    };

    const interval = setInterval(collectMetrics, 5000);
    collectMetrics();

    return () => clearInterval(interval);
  }, []);

  const getPerformanceScore = () => {
    let score = 100;
    if (metrics.loadTime > 3000) score -= 20;
    if (metrics.firstPaint > 1000) score -= 15;
    if (metrics.memoryUsage > 50 * 1024 * 1024) score -= 15;
    return Math.max(0, score);
  };

  const performanceScore = getPerformanceScore();
  const scoreColor = performanceScore > 80 ? 'text-green-600' : performanceScore > 60 ? 'text-yellow-600' : 'text-red-600';

  return (
    <>
      {children}
      
      {/* Performance Toggle Button */}
      <button
        onClick={() => setShowMetrics(!showMetrics)}
        className="fixed bottom-4 right-4 z-50 p-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors"
        title="Toggle Performance Metrics"
      >
        <Activity className="w-5 h-5" />
      </button>

      {/* Performance Metrics Overlay */}
      {showMetrics && (
        <div className="fixed bottom-20 right-4 z-40 w-80">
          <Card className="bg-white/95 backdrop-blur-sm border shadow-xl">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between text-sm">
                <span className="flex items-center space-x-2">
                  <Zap className="w-4 h-4" />
                  <span>Performance</span>
                </span>
                <Badge variant={performanceScore > 80 ? 'default' : 'destructive'} className={scoreColor}>
                  {performanceScore}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="flex items-center space-x-1">
                    <Clock className="w-3 h-3" />
                    <span>Load Time</span>
                  </span>
                  <span className="font-mono">{Math.round(metrics.loadTime)}ms</span>
                </div>
                <Progress value={Math.min(100, (metrics.loadTime / 3000) * 100)} className="h-1" />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span>First Paint</span>
                  <span className="font-mono">{Math.round(metrics.firstPaint)}ms</span>
                </div>
                <Progress value={Math.min(100, (metrics.firstPaint / 1000) * 100)} className="h-1" />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span>Memory Usage</span>
                  <span className="font-mono">{(metrics.memoryUsage / (1024 * 1024)).toFixed(1)}MB</span>
                </div>
                <Progress value={Math.min(100, (metrics.memoryUsage / (50 * 1024 * 1024)) * 100)} className="h-1" />
              </div>
              
              <div className="flex items-center justify-between text-xs pt-2 border-t">
                <span>Snapshots</span>
                <span className="font-mono">{metrics.renderCount}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
};

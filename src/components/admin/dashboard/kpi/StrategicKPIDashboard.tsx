
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  TrendingDown, 
  Target, 
  Users, 
  ThumbsUp,
  Star,
  Zap
} from 'lucide-react';
import { useStrategicKPIs } from '@/hooks/useStrategicKPIs';

interface StrategicKPIDashboardProps {
  organizationId: string;
}

export const StrategicKPIDashboard: React.FC<StrategicKPIDashboardProps> = ({
  organizationId
}) => {
  const { data: kpis, isLoading, error } = useStrategicKPIs(organizationId);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-48 bg-gray-200 rounded animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error || !kpis) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-gray-500">Unable to load strategic KPIs</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Strategic KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* NPS Card */}
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
              <Target className="w-4 h-4 mr-2" />
              Net Promoter Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold text-blue-600">
                  {kpis.nps.score}
                </div>
                <Badge variant={kpis.nps.trend.isPositive ? "default" : "destructive"}>
                  {kpis.nps.trend.isPositive ? (
                    <TrendingUp className="w-3 h-3 mr-1" />
                  ) : (
                    <TrendingDown className="w-3 h-3 mr-1" />
                  )}
                  {kpis.nps.trend.value}%
                </Badge>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Promoters: {kpis.nps.breakdown.promoters}%</span>
                  <span className="text-green-600">●</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Passives: {kpis.nps.breakdown.passives}%</span>
                  <span className="text-yellow-600">●</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Detractors: {kpis.nps.breakdown.detractors}%</span>
                  <span className="text-red-600">●</span>
                </div>
              </div>
              <Progress value={kpis.nps.breakdown.promoters} className="h-2" />
            </div>
          </CardContent>
        </Card>

        {/* CSAT Card */}
        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
              <Star className="w-4 h-4 mr-2" />
              Customer Satisfaction
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold text-green-600">
                  {kpis.csat.score}%
                </div>
                <Badge variant={kpis.csat.trend.isPositive ? "default" : "destructive"}>
                  {kpis.csat.trend.isPositive ? (
                    <TrendingUp className="w-3 h-3 mr-1" />
                  ) : (
                    <TrendingDown className="w-3 h-3 mr-1" />
                  )}
                  {kpis.csat.trend.value}%
                </Badge>
              </div>
              <div className="text-sm text-gray-600">
                Based on {kpis.csat.totalResponses} responses
              </div>
              <div className="flex items-center space-x-2">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-4 h-4 ${
                        star <= Math.round(kpis.csat.score / 20)
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600">
                  {(kpis.csat.score / 20).toFixed(1)}/5
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CES Card */}
        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
              <Zap className="w-4 h-4 mr-2" />
              Customer Effort Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold text-purple-600">
                  {kpis.ces.score}
                </div>
                <Badge variant={kpis.ces.trend.isPositive ? "default" : "destructive"}>
                  {kpis.ces.trend.isPositive ? (
                    <TrendingUp className="w-3 h-3 mr-1" />
                  ) : (
                    <TrendingDown className="w-3 h-3 mr-1" />
                  )}
                  {kpis.ces.trend.value}%
                </Badge>
              </div>
              <div className="text-sm text-gray-600">
                Lower is better (1-7 scale)
              </div>
              <Progress 
                value={100 - ((kpis.ces.score - 1) / 6 * 100)} 
                className="h-2" 
              />
              <div className="text-xs text-gray-500">
                {kpis.ces.score < 3 ? 'Excellent' : 
                 kpis.ces.score < 5 ? 'Good' : 'Needs Improvement'}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* KPI Trends Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Strategic KPI Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-blue-800">NPS Trend</span>
                  <Target className="w-4 h-4 text-blue-600" />
                </div>
                <div className="text-2xl font-bold text-blue-600">{kpis.nps.score}</div>
                <div className="text-sm text-blue-600">
                  Target: 50+ (Industry benchmark)
                </div>
              </div>
              
              <div className="p-4 bg-green-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-green-800">CSAT Trend</span>
                  <ThumbsUp className="w-4 h-4 text-green-600" />
                </div>
                <div className="text-2xl font-bold text-green-600">{kpis.csat.score}%</div>
                <div className="text-sm text-green-600">
                  Target: 80%+ (Excellent)
                </div>
              </div>
              
              <div className="p-4 bg-purple-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-purple-800">CES Trend</span>
                  <Zap className="w-4 h-4 text-purple-600" />
                </div>
                <div className="text-2xl font-bold text-purple-600">{kpis.ces.score}</div>
                <div className="text-sm text-purple-600">
                  Target: ≤3 (Low effort)
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

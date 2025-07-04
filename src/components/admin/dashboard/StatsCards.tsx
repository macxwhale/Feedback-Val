
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';
import { StatsCardSkeleton } from '@/components/ui/loading-skeleton';

interface StatCard {
  title: string;
  value: number | string;
  icon: LucideIcon;
  color: string;
  bgColor: string;
  suffix?: string;
  trend?: {
    value: number;
    label: string;
    isPositive: boolean;
  };
}

interface StatsCardsProps {
  cards: StatCard[];
  isLoading?: boolean;
  className?: string;
}

export const StatsCards: React.FC<StatsCardsProps> = ({ 
  cards, 
  isLoading = false,
  className = "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
}) => {
  if (isLoading) {
    return (
      <div className={className}>
        {Array.from({ length: 6 }).map((_, i) => (
          <StatsCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className={className}>
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <Card 
            key={card.title} 
            className="bg-white border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all duration-200 group"
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 group-hover:text-gray-700 transition-colors">
                {card.title}
              </CardTitle>
              <div className={`p-2.5 rounded-xl ${card.bgColor} group-hover:scale-105 transition-transform duration-200`}>
                <Icon className={`h-4 w-4 ${card.color}`} />
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-2xl font-bold text-gray-900 tracking-tight">
                {typeof card.value === 'number' ? card.value.toLocaleString() : card.value}
                {card.suffix && <span className="text-lg text-gray-500 ml-1">{card.suffix}</span>}
              </div>
              
              {card.trend && (
                <div className="flex items-center gap-2">
                  <div className={`
                    flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium
                    ${card.trend.isPositive 
                      ? 'bg-green-50 text-green-700 border border-green-200' 
                      : 'bg-red-50 text-red-700 border border-red-200'
                    }
                  `}>
                    {card.trend.isPositive ? (
                      <TrendingUp className="w-3 h-3" />
                    ) : (
                      <TrendingDown className="w-3 h-3" />
                    )}
                    {card.trend.isPositive ? '+' : ''}{card.trend.value}%
                  </div>
                  <span className="text-xs text-gray-500 font-medium">
                    vs {card.trend.label}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

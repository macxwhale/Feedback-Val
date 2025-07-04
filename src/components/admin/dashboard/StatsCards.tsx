
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LucideIcon } from 'lucide-react';
import { StatsCardSkeleton } from '@/components/ui/loading-skeleton';
import { cn } from '@/lib/utils';

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
  className = "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
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
            className={cn(
              "transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5",
              "border-gray-200/50 bg-white/80 backdrop-blur-sm",
              "group cursor-pointer"
            )}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-semibold text-gray-700 group-hover:text-gray-900 transition-colors">
                {card.title}
              </CardTitle>
              <div className={cn(
                "p-2.5 rounded-xl transition-all duration-200",
                "group-hover:scale-110",
                card.bgColor
              )}>
                <Icon className={cn("w-4 h-4", card.color)} />
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex flex-col space-y-3">
                <div className="text-3xl font-bold text-gray-900 tracking-tight">
                  {card.value}{card.suffix || ''}
                </div>
                {card.trend && (
                  <div className="flex items-center space-x-2">
                    <Badge 
                      variant={card.trend.isPositive ? "default" : "secondary"}
                      className={cn(
                        "text-xs font-semibold",
                        card.trend.isPositive ? [
                          "bg-green-100 text-green-800 border-green-200"
                        ] : [
                          "bg-red-100 text-red-800 border-red-200"
                        ]
                      )}
                    >
                      {card.trend.isPositive ? '+' : ''}{card.trend.value}%
                    </Badge>
                    <span className="text-sm text-gray-600">
                      {card.trend.label}
                    </span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

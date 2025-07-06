
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LucideIcon } from 'lucide-react';
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
          <Card key={card.title} className="transition-all hover:shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {card.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${card.bgColor}`}>
                <Icon className={`h-4 w-4 ${card.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {card.value}{card.suffix || ''}
              </div>
              {card.trend && (
                <div className="mt-2 flex items-center text-sm">
                  <Badge 
                    variant={card.trend.isPositive ? "default" : "secondary"}
                    className="text-xs"
                  >
                    {card.trend.isPositive ? '+' : ''}{card.trend.value}%
                  </Badge>
                  <span className="ml-2 text-muted-foreground">
                    {card.trend.label}
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

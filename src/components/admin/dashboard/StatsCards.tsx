
import React from 'react';
import { MaterialCard, MaterialCardContent, MaterialCardHeader, MaterialCardTitle } from '@/components/ui/material-card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { LucideIcon, TrendingUp, TrendingDown, MoreHorizontal } from 'lucide-react';
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
  comparison?: {
    current: number;
    previous: number;
    period: string;
  };
  actionable?: {
    label: string;
    onClick: () => void;
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
        const changePercent = card.comparison 
          ? ((card.comparison.current - card.comparison.previous) / card.comparison.previous * 100)
          : card.trend?.value || 0;
        const isPositive = changePercent > 0;
        
        return (
          <MaterialCard key={card.title} variant="elevated" className="group">
            <MaterialCardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className={cn(
                    "p-3 rounded-xl transition-all duration-200",
                    card.bgColor,
                    "group-hover:scale-105"
                  )}>
                    <Icon className={cn("h-5 w-5", card.color)} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <MaterialCardTitle className="text-title-medium text-on-surface-variant">
                      {card.title}
                    </MaterialCardTitle>
                  </div>
                </div>
                <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
            </MaterialCardHeader>
            
            <MaterialCardContent className="space-y-4">
              {/* Main metric */}
              <div className="space-y-1">
                <div className="text-display-small font-normal text-on-surface">
                  {typeof card.value === 'number' ? card.value.toLocaleString() : card.value}
                  {card.suffix && <span className="text-body-large text-on-surface-variant ml-1">{card.suffix}</span>}
                </div>
                
                {/* Trend indicator */}
                {(card.trend || card.comparison) && (
                  <div className="flex items-center space-x-2">
                    <div className={cn(
                      "flex items-center space-x-1 px-2 py-1 rounded-full text-label-small",
                      isPositive 
                        ? "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300" 
                        : "bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-300"
                    )}>
                      {isPositive ? (
                        <TrendingUp className="w-3 h-3" />
                      ) : (
                        <TrendingDown className="w-3 h-3" />
                      )}
                      <span className="font-medium">
                        {isPositive ? '+' : ''}{Math.abs(changePercent).toFixed(1)}%
                      </span>
                    </div>
                    <span className="text-body-small text-on-surface-variant">
                      {card.comparison ? `vs ${card.comparison.period}` : card.trend?.label}
                    </span>
                  </div>
                )}
              </div>

              {/* Comparison values */}
              {card.comparison && (
                <div className="flex justify-between text-body-small text-on-surface-variant pt-2 border-t border-outline-variant">
                  <span>Current: {card.comparison.current.toLocaleString()}</span>
                  <span>Previous: {card.comparison.previous.toLocaleString()}</span>
                </div>
              )}

              {/* Actionable button */}
              {card.actionable && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="w-full mt-3 text-primary hover:bg-primary/10"
                  onClick={card.actionable.onClick}
                >
                  {card.actionable.label}
                </Button>
              )}
            </MaterialCardContent>
          </MaterialCard>
        );
      })}
    </div>
  );
};

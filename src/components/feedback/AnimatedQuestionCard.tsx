
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';
import { useDynamicBranding } from '@/hooks/useDynamicBranding';

interface AnimatedQuestionCardProps {
  children: React.ReactNode;
  title: string;
  required?: boolean;
  isAnswered?: boolean;
  className?: string;
}

export const AnimatedQuestionCard: React.FC<AnimatedQuestionCardProps> = ({
  children,
  title,
  required,
  isAnswered,
  className = ''
}) => {
  const { colors } = useDynamicBranding();

  const headerStyle = {
    background: isAnswered 
      ? `linear-gradient(to right, #10B981, #34D399)` 
      : `linear-gradient(to right, ${colors.primary}, ${colors.accent})`
  };

  return (
    <Card className={`
      mb-8 shadow-xl border 
      animate-fade-in
      transition-all duration-300 ease-out
      hover:shadow-2xl hover:-translate-y-1
      ${isAnswered ? 'border-green-300' : 'border-gray-200/50'}
      ${className}
    `}>
      <CardHeader 
        className="text-white rounded-t-lg relative overflow-hidden p-6 transition-colors duration-300"
        style={headerStyle}
      >
        <div className="flex items-start justify-between relative z-10">
          <div className="flex-1">
            <CardTitle className="text-xl font-semibold pr-4 animate-fade-in">
              {title}
            </CardTitle>
            {required && (
              <span className="text-white/80 text-sm flex items-center mt-1 animate-fade-in">
                * Required
              </span>
            )}
          </div>
          {isAnswered && (
            <CheckCircle className="h-7 w-7 text-white flex-shrink-0 animate-scale-in" />
          )}
        </div>
        {isAnswered && (
          <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-green-600/10 animate-fade-in" />
        )}
      </CardHeader>
      
      <CardContent className="p-8 transition-all duration-200 bg-white rounded-b-lg">
        {children}
      </CardContent>
    </Card>
  );
};


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
    background: `linear-gradient(to right, ${colors.primary}, ${colors.accent})`,
  };

  const answeredHeaderStyle = {
    background: `linear-gradient(to right, #10B981, #059669)`,
  };

  return (
    <Card className={`
      mb-8 shadow-lg border-0 
      animate-fade-in
      transition-all duration-300 ease-out
      hover:shadow-xl hover:scale-[1.02]
      ${isAnswered ? 'ring-2 ring-green-400 ring-opacity-50' : ''}
      ${className}
    `}>
      <CardHeader 
        className={`
          text-white rounded-t-lg 
          relative overflow-hidden
        `}
        style={isAnswered ? answeredHeaderStyle : headerStyle}
      >
        <div className="flex items-start justify-between relative z-10">
          <div className="flex-1">
            <CardTitle className="text-xl pr-4 animate-fade-in">
              {title}
            </CardTitle>
            {required && (
              <span className="text-orange-200 text-sm flex items-center mt-1 animate-fade-in">
                <span className="text-red-300 mr-1">*</span>
                Required
              </span>
            )}
          </div>
          {isAnswered && (
            <CheckCircle className="h-6 w-6 text-green-300 flex-shrink-0 animate-scale-in" />
          )}
        </div>
        {isAnswered && (
          <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-green-600/20 animate-fade-in" />
        )}
      </CardHeader>
      
      <CardContent className="p-6 transition-all duration-200">
        {children}
      </CardContent>
    </Card>
  );
};

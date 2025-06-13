
import React from 'react';
import { Smile, Frown, Meh } from 'lucide-react';

interface SentimentIconProps {
  sentiment: string;
}

export const SentimentIcon: React.FC<SentimentIconProps> = ({ sentiment }) => {
  switch (sentiment) {
    case 'positive': 
      return <Smile className="w-5 h-5 text-green-600" />;
    case 'negative': 
      return <Frown className="w-5 h-5 text-red-600" />;
    default: 
      return <Meh className="w-5 h-5 text-yellow-600" />;
  }
};

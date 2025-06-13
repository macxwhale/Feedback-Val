
export const calculateSentiment = (score: number): 'positive' | 'negative' | 'neutral' => {
  if (score >= 4) return 'positive';
  if (score <= 2) return 'negative';
  return 'neutral';
};

export const getSentimentColor = (sentiment: string): string => {
  switch (sentiment) {
    case 'positive': return 'bg-green-100 text-green-800';
    case 'negative': return 'bg-red-100 text-red-800';
    default: return 'bg-yellow-100 text-yellow-800';
  }
};

export const aggregateSentimentStats = (questionSentiments: any[]) => {
  return questionSentiments.reduce((acc, q) => {
    acc[q.sentiment] += 1;
    return acc;
  }, { positive: 0, neutral: 0, negative: 0 });
};

export const calculateOverallSentiment = (sentimentStats: { positive: number; neutral: number; negative: number }): 'positive' | 'negative' | 'neutral' => {
  return sentimentStats.positive > sentimentStats.negative ? 'positive' : 
    sentimentStats.negative > sentimentStats.positive ? 'negative' : 'neutral';
};

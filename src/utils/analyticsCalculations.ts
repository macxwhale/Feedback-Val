
import { calculateSessionMetrics, calculateGrowthMetrics } from './analyticsMetrics';
import { processQuestionsAnalytics } from './questionsProcessor';
import { processCategoriesAnalytics } from './categoriesProcessor';
import { generateTrendData } from './trendDataProcessor';

// Re-export all the functions to maintain the existing API
export {
  calculateSessionMetrics,
  calculateGrowthMetrics,
  processQuestionsAnalytics,
  processCategoriesAnalytics,
  generateTrendData
};

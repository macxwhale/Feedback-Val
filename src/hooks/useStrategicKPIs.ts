
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface StrategicKPIs {
  nps: {
    score: number;
    breakdown: {
      promoters: number;
      passives: number;
      detractors: number;
    };
    trend: {
      value: number;
      isPositive: boolean;
    };
  };
  csat: {
    score: number;
    totalResponses: number;
    trend: {
      value: number;
      isPositive: boolean;
    };
  };
  ces: {
    score: number;
    trend: {
      value: number;
      isPositive: boolean;
    };
  };
}

// Helper function to safely calculate percentage change with caps
const calculateTrendPercentage = (current: number, previous: number): number => {
  if (previous === 0) return 0;
  const change = ((current - previous) / previous) * 100;
  // Cap extreme values to prevent unrealistic percentages
  return Math.max(-100, Math.min(500, Math.round(change)));
};

export const useStrategicKPIs = (organizationId: string) => {
  return useQuery({
    queryKey: ['strategic-kpis', organizationId],
    queryFn: async (): Promise<StrategicKPIs> => {
      console.log('Calculating Strategic KPIs for organization:', organizationId);
      
      // Get feedback responses with scores
      const { data: responses } = await supabase
        .from('feedback_responses')
        .select('score, created_at, question_type_snapshot')
        .eq('organization_id', organizationId)
        .not('score', 'is', null);

      if (!responses || responses.length === 0) {
        return {
          nps: {
            score: 0,
            breakdown: { promoters: 0, passives: 0, detractors: 0 },
            trend: { value: 0, isPositive: true }
          },
          csat: {
            score: 0,
            totalResponses: 0,
            trend: { value: 0, isPositive: true }
          },
          ces: {
            score: 0,
            trend: { value: 0, isPositive: true }
          }
        };
      }

      // Calculate date boundaries for trend analysis
      const now = new Date();
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);
      
      const recentResponses = responses.filter(r => 
        new Date(r.created_at) >= thirtyDaysAgo
      );
      const previousResponses = responses.filter(r => 
        new Date(r.created_at) >= sixtyDaysAgo && new Date(r.created_at) < thirtyDaysAgo
      );

      console.log('Response counts:', {
        total: responses.length,
        recent: recentResponses.length,
        previous: previousResponses.length
      });

      // Calculate NPS (assuming 1-5 scale, converting to 0-10 NPS scale)
      const npsResponses = responses.filter(r => r.score !== null);
      const npsScores = npsResponses.map(r => {
        // Convert 1-5 scale to 0-10 NPS scale
        return Math.round(((r.score - 1) / 4) * 10);
      });

      const promoters = npsScores.filter(score => score >= 9).length;
      const passives = npsScores.filter(score => score >= 7 && score <= 8).length;
      const detractors = npsScores.filter(score => score <= 6).length;
      const totalNPS = npsScores.length;

      const npsScore = totalNPS > 0 
        ? Math.round(((promoters - detractors) / totalNPS) * 100)
        : 0;

      // Calculate CSAT (percentage of 4-5 star ratings)
      const csatResponses = responses.filter(r => r.score !== null);
      const satisfiedResponses = csatResponses.filter(r => r.score >= 4).length;
      const csatScore = csatResponses.length > 0 
        ? Math.round((satisfiedResponses / csatResponses.length) * 100)
        : 0;

      // Calculate CES (simplified - using inverse of satisfaction for demonstration)
      const cesScore = responses.length > 0
        ? Math.round(7 - (responses.reduce((sum, r) => sum + r.score, 0) / responses.length) * 1.4)
        : 3;

      // Calculate trends with proper bounds
      const recentAvg = recentResponses.length > 0
        ? recentResponses.reduce((sum, r) => sum + r.score, 0) / recentResponses.length
        : 0;
      const previousAvg = previousResponses.length > 0
        ? previousResponses.reduce((sum, r) => sum + r.score, 0) / previousResponses.length
        : recentAvg;

      const trendValue = calculateTrendPercentage(recentAvg, previousAvg);

      console.log('Calculated trends:', {
        recentAvg,
        previousAvg,
        trendValue
      });

      return {
        nps: {
          score: Math.max(-100, Math.min(100, npsScore)),
          breakdown: {
            promoters: totalNPS > 0 ? Math.round((promoters / totalNPS) * 100) : 0,
            passives: totalNPS > 0 ? Math.round((passives / totalNPS) * 100) : 0,
            detractors: totalNPS > 0 ? Math.round((detractors / totalNPS) * 100) : 0
          },
          trend: {
            value: Math.abs(trendValue),
            isPositive: trendValue >= 0
          }
        },
        csat: {
          score: Math.max(0, Math.min(100, csatScore)),
          totalResponses: csatResponses.length,
          trend: {
            value: Math.abs(trendValue),
            isPositive: trendValue >= 0
          }
        },
        ces: {
          score: Math.max(1, Math.min(7, cesScore)),
          trend: {
            value: Math.abs(trendValue),
            isPositive: trendValue <= 0 // For CES, lower is better
          }
        }
      };
    },
    enabled: !!organizationId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

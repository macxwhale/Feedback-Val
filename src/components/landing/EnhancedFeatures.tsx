
import React from 'react';
import { PremiumCard, PremiumCardHeader, PremiumCardContent } from '@/components/ui/premium-card';
import { PremiumContainer, PremiumSection, PremiumGrid } from '@/components/ui/premium-layout';
import { HeadingLarge, HeadingMedium, BodyRegular } from '@/components/ui/enhanced-typography';
import { MessageSquare, BarChart3, Users, Zap, Shield, Globe } from 'lucide-react';

const features = [
  {
    icon: MessageSquare,
    title: 'Smart Feedback Collection',
    description: 'Capture feedback through multiple channels with intelligent routing and categorization.',
    gradient: 'from-blue-500 to-cyan-500'
  },
  {
    icon: BarChart3,
    title: 'Advanced Analytics',
    description: 'Get deep insights with AI-powered sentiment analysis and trend identification.',
    gradient: 'from-purple-500 to-pink-500'
  },
  {
    icon: Users,
    title: 'Team Collaboration',
    description: 'Work together seamlessly with role-based access and real-time notifications.',
    gradient: 'from-green-500 to-emerald-500'
  },
  {
    icon: Zap,
    title: 'Automated Workflows',
    description: 'Set up smart automations to respond to feedback and route issues efficiently.',
    gradient: 'from-yellow-500 to-orange-500'
  },
  {
    icon: Shield,
    title: 'Enterprise Security',
    description: 'Bank-level security with GDPR compliance and data encryption at rest and in transit.',
    gradient: 'from-red-500 to-rose-500'
  },
  {
    icon: Globe,
    title: 'Global Scale',
    description: 'Multi-language support with localization for teams and customers worldwide.',
    gradient: 'from-indigo-500 to-blue-500'
  }
];

export const EnhancedFeatures: React.FC = () => {
  return (
    <PremiumSection spacing="xl" className="bg-gray-50/50 dark:bg-gray-900/50">
      <PremiumContainer>
        <div className="text-center space-y-4 mb-16">
          <HeadingLarge>
            Everything you need to understand your customers
          </HeadingLarge>
          <BodyRegular className="max-w-2xl mx-auto">
            Powerful features designed to help you collect, analyze, and act on customer feedback 
            with unprecedented clarity and speed.
          </BodyRegular>
        </div>

        <PremiumGrid cols={3} gap="lg">
          {features.map((feature, index) => (
            <PremiumCard 
              key={index} 
              variant="elevated"
              interactive
              className="group"
            >
              <PremiumCardHeader>
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${feature.gradient} p-2.5 mb-4 group-hover:scale-110 transition-transform duration-200`}>
                  <feature.icon className="w-full h-full text-white" />
                </div>
                <HeadingMedium>{feature.title}</HeadingMedium>
              </PremiumCardHeader>
              
              <PremiumCardContent>
                <BodyRegular>{feature.description}</BodyRegular>
              </PremiumCardContent>
            </PremiumCard>
          ))}
        </PremiumGrid>
      </PremiumContainer>
    </PremiumSection>
  );
};


import React from 'react';
import { PremiumCard, PremiumCardHeader, PremiumCardContent, PremiumCardFooter } from '@/components/ui/premium-card';
import { PremiumButton } from '@/components/ui/premium-button';
import { PremiumContainer, PremiumSection, PremiumGrid } from '@/components/ui/premium-layout';
import { HeadingLarge, HeadingMedium, BodyRegular, BodySmall } from '@/components/ui/enhanced-typography';
import { Check, Star } from 'lucide-react';

const plans = [
  {
    name: 'Starter',
    price: 'Free',
    description: 'Perfect for small teams getting started',
    features: [
      'Up to 100 responses/month',
      'Basic analytics',
      '3 team members',
      'Email support',
      'Standard templates'
    ],
    cta: 'Get Started',
    variant: 'outline' as const,
    popular: false
  },
  {
    name: 'Professional',
    price: '$29',
    description: 'Best for growing businesses',
    features: [
      'Up to 5,000 responses/month',
      'Advanced analytics & AI insights',
      'Unlimited team members',
      'Priority support',
      'Custom branding',
      'API access',
      'Advanced integrations'
    ],
    cta: 'Start Free Trial',
    variant: 'primary' as const,
    popular: true
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    description: 'For large organizations',
    features: [
      'Unlimited responses',
      'White-label solution',
      'Dedicated account manager',
      'Custom integrations',
      'SLA guarantee',
      'Advanced security',
      'On-premise deployment'
    ],
    cta: 'Contact Sales',
    variant: 'secondary' as const,
    popular: false
  }
];

export const EnhancedPricing: React.FC = () => {
  return (
    <PremiumSection spacing="xl">
      <PremiumContainer>
        <div className="text-center space-y-4 mb-16">
          <HeadingLarge>
            Simple, transparent pricing
          </HeadingLarge>
          <BodyRegular className="max-w-2xl mx-auto">
            Choose the plan that fits your needs. All plans include a 14-day free trial 
            with full access to premium features.
          </BodyRegular>
        </div>

        <PremiumGrid cols={3} gap="lg" className="items-stretch">
          {plans.map((plan, index) => (
            <PremiumCard 
              key={index}
              variant={plan.popular ? 'elevated' : 'default'}
              className={`relative ${plan.popular ? 'ring-2 ring-orange-500 ring-opacity-20' : ''}`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                    <Star className="w-3 h-3" />
                    Most Popular
                  </div>
                </div>
              )}

              <PremiumCardHeader>
                <HeadingMedium>{plan.name}</HeadingMedium>
                <div className="space-y-2">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-gray-900 dark:text-white">
                      {plan.price}
                    </span>
                    {plan.price !== 'Free' && plan.price !== 'Custom' && (
                      <span className="text-gray-500 dark:text-gray-400">/month</span>
                    )}
                  </div>
                  <BodySmall>{plan.description}</BodySmall>
                </div>
              </PremiumCardHeader>

              <PremiumCardContent>
                <ul className="space-y-3">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center gap-3">
                      <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <BodyRegular>{feature}</BodyRegular>
                    </li>
                  ))}
                </ul>
              </PremiumCardContent>

              <PremiumCardFooter>
                <PremiumButton 
                  variant={plan.variant}
                  className="w-full"
                  size="lg"
                >
                  {plan.cta}
                </PremiumButton>
              </PremiumCardFooter>
            </PremiumCard>
          ))}
        </PremiumGrid>

        <div className="text-center mt-12 space-y-4">
          <BodyRegular>
            All plans include SSL certificates, 99.9% uptime guarantee, and GDPR compliance.
          </BodyRegular>
          <BodySmall>
            Need a custom solution? <a href="#" className="text-orange-600 hover:text-orange-700 font-medium">Contact our sales team</a>
          </BodySmall>
        </div>
      </PremiumContainer>
    </PremiumSection>
  );
};

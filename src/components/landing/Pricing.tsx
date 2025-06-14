
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';

export const Pricing: React.FC = () => {
  const navigate = useNavigate();

  const plans = [
    {
      name: "Starter",
      price: "$29",
      period: "/month",
      description: "Perfect for small businesses just getting started",
      features: [
        "Up to 1,000 responses/month",
        "Basic analytics & reporting", 
        "Email support",
        "Standard templates"
      ],
      popular: false,
      cta: "Start free trial"
    },
    {
      name: "Professional", 
      price: "$89",
      period: "/month",
      description: "Advanced features for growing businesses",
      features: [
        "Up to 10,000 responses/month",
        "Advanced AI analytics",
        "Priority support",
        "Custom branding",
        "Team collaboration",
        "API access"
      ],
      popular: true,
      cta: "Start free trial"
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "",
      description: "Tailored solutions for large organizations", 
      features: [
        "Unlimited responses",
        "White-label solution",
        "Dedicated success manager",
        "Custom integrations",
        "SLA guarantee",
        "Advanced security"
      ],
      popular: false,
      cta: "Contact sales"
    }
  ];

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <h2 className="text-4xl font-space font-bold text-warm-gray-900 mb-6">
            Simple, transparent pricing
          </h2>
          <p className="text-xl text-warm-gray-600 leading-relaxed">
            Choose the plan that's right for your business. Upgrade or downgrade at any time.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <Card key={index} className={`border-0 shadow-lg shadow-warm-gray-900/5 relative ${
              plan.popular 
                ? 'ring-2 ring-sunset-500 shadow-xl shadow-sunset-500/10 scale-105' 
                : 'hover:shadow-xl hover:shadow-warm-gray-900/10'
            } transition-all duration-300 bg-white`}>
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-gradient-to-r from-sunset-500 to-coral-500 text-white px-6 py-2 text-sm font-semibold">Most Popular</Badge>
                </div>
              )}
              <CardHeader className="text-center pb-6 pt-8">
                <CardTitle className="text-2xl font-space font-semibold text-warm-gray-900">{plan.name}</CardTitle>
                <div className="mt-6">
                  <span className="text-5xl font-space font-bold text-warm-gray-900">{plan.price}</span>
                  {plan.period && <span className="text-warm-gray-600 text-lg">{plan.period}</span>}
                </div>
                <CardDescription className="mt-4 text-warm-gray-600">{plan.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                <ul className="space-y-4">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                      <span className="text-warm-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button 
                  className={`w-full font-semibold ${
                    plan.popular 
                      ? 'bg-gradient-to-r from-sunset-500 to-coral-500 hover:from-sunset-600 hover:to-coral-600 text-white shadow-lg shadow-sunset-500/25' 
                      : 'bg-warm-gray-900 hover:bg-warm-gray-800 text-white'
                  }`}
                  onClick={() => navigate('/auth')}
                >
                  {plan.cta}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="text-center mt-16">
          <p className="text-sm text-warm-gray-500">
            All plans include a 14-day free trial. No setup fees. Cancel anytime.
          </p>
        </div>
      </div>
    </section>
  );
};

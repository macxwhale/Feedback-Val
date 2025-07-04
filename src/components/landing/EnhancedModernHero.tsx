
import React from 'react';
import { PremiumButton } from '@/components/ui/premium-button';
import { PremiumContainer, PremiumSection } from '@/components/ui/premium-layout';
import { DisplayLarge, BodyLarge } from '@/components/ui/enhanced-typography';
import { ArrowRight, Play } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const EnhancedModernHero: React.FC = () => {
  const navigate = useNavigate();

  return (
    <PremiumSection spacing="xl" className="relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-r from-orange-400/20 to-orange-600/20 rounded-full blur-3xl animate-pulse-gentle" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-r from-blue-400/20 to-purple-600/20 rounded-full blur-3xl animate-pulse-gentle" style={{ animationDelay: '2s' }} />
      </div>

      <PremiumContainer className="relative z-10">
        <div className="text-center space-y-8">
          {/* Main Headline */}
          <div className="space-y-6">
            <DisplayLarge className="max-w-4xl mx-auto">
              Transform Customer Feedback Into
              <span className="block bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
                Measurable Growth
              </span>
            </DisplayLarge>
            
            <BodyLarge className="max-w-2xl mx-auto">
              Capture, analyze, and act on customer insights with our intuitive feedback platform. 
              Turn every interaction into an opportunity for improvement and growth.
            </BodyLarge>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <PremiumButton 
              size="xl"
              onClick={() => navigate('/admin')}
              className="group"
            >
              Get Started Free
              <ArrowRight className="group-hover:translate-x-1 transition-transform" />
            </PremiumButton>
            
            <PremiumButton 
              variant="ghost" 
              size="xl"
              className="group"
            >
              <Play className="group-hover:scale-110 transition-transform" />
              Watch Demo
            </PremiumButton>
          </div>

          {/* Trust Indicators */}
          <div className="pt-12 space-y-4">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              Trusted by teams at
            </p>
            <div className="flex items-center justify-center space-x-8 opacity-60">
              <div className="text-lg font-semibold text-gray-600 dark:text-gray-400">Acme Corp</div>
              <div className="text-lg font-semibold text-gray-600 dark:text-gray-400">TechFlow</div>
              <div className="text-lg font-semibold text-gray-600 dark:text-gray-400">InnovateLab</div>
              <div className="text-lg font-semibold text-gray-600 dark:text-gray-400">DataSync</div>
            </div>
          </div>
        </div>
      </PremiumContainer>
    </PremiumSection>
  );
};

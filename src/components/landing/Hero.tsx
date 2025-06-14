import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { HeroVisual } from "./HeroVisual";

export const Hero: React.FC = () => {
  const navigate = useNavigate();
  return (
    <section className="relative pt-32 pb-16 bg-gradient-to-b from-[#fcfbf8] via-[#f3f5fa] to-[#f5f5fa]">
      <div className="absolute inset-0 z-0">
        <div className="w-full h-full opacity-80 bg-gradient-to-tl from-blue-50 via-white to-purple-50"></div>
      </div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
        <div className="text-center max-w-3xl mx-auto">
          <Badge className="mb-7 bg-black/5 text-blue-600 px-4 shadow font-medium tracking-wide backdrop-blur-xl animate-fade-in">
            Trusted by 2,000+ teams worldwide
          </Badge>
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight tracking-tight text-gray-800 drop-shadow-sm animate-fade-in">
            Customer Feedback, <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-orange-300 bg-clip-text text-transparent">Transformed Into Clarity</span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed animate-fade-in">
            Pulselify turns every signal into stories—helping teams grow, retain, and build trust through true listening and actionable insights.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-4">
            <Button
              size="lg"
              onClick={() => navigate('/auth')}
              className="bg-gradient-to-r from-blue-600 via-purple-500 to-orange-400 text-white text-lg px-8 py-4 rounded-full shadow-lg hover:brightness-110 hover:scale-105 animate-scale-in"
            >
              Get Started Free
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-0 bg-white/80 text-blue-700 px-8 py-4 rounded-full shadow hover:bg-blue-50 hover:text-blue-800 font-medium transition animate-scale-in"
              onClick={() => window.scrollTo({top: 1200, behavior: 'smooth'})}
            >
              Request Live Demo
            </Button>
          </div>
          <p className="text-sm text-gray-400 animate-fade-in">
            No credit card required &nbsp;•&nbsp; Onboarding in minutes &nbsp;•&nbsp; Personal support
          </p>
          <HeroVisual />
        </div>
      </div>
    </section>
  );
};


import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export const Hero: React.FC = () => {
  const navigate = useNavigate();
  return (
    <section className="pt-32 pb-20 bg-gradient-to-b from-[#fbfaf7] via-[#e8ebf8] to-[#f5f5fa]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          <Badge className="mb-6 bg-white/80 border-0 text-blue-700 px-4 shadow-sm font-semibold tracking-wide">
            Trusted by 2,000+ modern businesses
          </Badge>
          <h1 className="text-5xl lg:text-6xl font-bold mb-6 leading-tight text-gray-800 tracking-tight">
            Make Every Customer Voice <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-orange-300 bg-clip-text text-transparent">Actionable</span>
          </h1>
          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            Pulselify transforms raw feedback into clear, trustworthy insights so you never miss what matters. Confident decisions start with the power of understanding—simply and elegantly.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
            <Button 
              size="lg"
              onClick={() => navigate('/auth')}
              className="bg-gradient-to-r from-blue-600 via-purple-500 to-orange-400 text-white text-lg px-8 py-4 rounded-full shadow-lg hover:brightness-105 hover:scale-105 transition"
            >
              Get Started Free
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              size="lg"
              variant="outline"
              className="border-0 bg-white/80 text-blue-700 px-8 py-4 rounded-full shadow hover:bg-blue-50 hover:text-blue-800 font-medium transition"
              onClick={() => {
                window.scrollTo({top: 1200, behavior: 'smooth'});
              }}
            >
              Request Live Demo
            </Button>
          </div>
          <p className="text-sm text-gray-500">
            No credit card required &nbsp;•&nbsp; Onboarding in minutes &nbsp;•&nbsp; Personal support
          </p>
        </div>
      </div>
    </section>
  );
};

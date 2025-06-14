
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export const FinalCTA: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section className="py-20 bg-gradient-to-r from-[#edf1f3] via-[#f5f2fa] to-[#fff8ea] animate-fade-in">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-4xl font-bold text-gray-800 mb-6">
          Ready to build deeper customer loyalty?
        </h2>
        <p className="text-xl text-gray-500 mb-8">
          See how Pulselify turns feedback into meaningful growth.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            size="lg"
            onClick={() => navigate('/auth')}
            className="bg-gradient-to-r from-blue-600 via-purple-500 to-orange-400 text-white text-lg px-8 py-4 rounded-full shadow-lg hover:brightness-110 hover:scale-105 animate-scale-in"
          >
            Start your free trial
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-0 bg-white/80 text-blue-700 hover:bg-orange-50 hover:text-orange-600 text-lg px-8 py-4 rounded-full"
          >
            Request Personal Demo
          </Button>
        </div>
        <p className="text-sm text-gray-400 mt-7">
          No credit card required &nbsp;•&nbsp; Fast setup &nbsp;•&nbsp; Human support, always
        </p>
      </div>
    </section>
  );
};

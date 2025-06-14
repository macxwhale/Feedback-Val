
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Star, Quote } from 'lucide-react';
import { FluidBackground } from './FluidBackground';

export const SocialProof: React.FC = () => {
  const testimonials = [
    {
      quote: "Pulselify helped us increase customer satisfaction by 40% in just 3 months. The insights are absolutely game-changing for our business growth.",
      author: "Sarah Chen",
      role: "Head of Customer Success",
      company: "TechStart Inc",
      rating: 5,
      gradient: "from-sunset-500 to-coral-500"
    },
    {
      quote: "Finally, a feedback tool that's actually easy to use and powerful. Our entire team loves the real-time dashboards and actionable insights.",
      author: "Marcus Johnson", 
      role: "Operations Director",
      company: "RetailCorp",
      rating: 5,
      gradient: "from-coral-500 to-golden-400"
    }
  ];

  return (
    <section className="relative py-32 bg-white dark:bg-dark-warm-50 overflow-hidden">
      {/* Fluid Background */}
      <FluidBackground variant="dark" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-24 animate-fade-in">
          <div className="flex items-center justify-center space-x-2 text-warm-gray-600 dark:text-dark-warm-600 mb-8">
            <Star className="w-6 h-6 text-golden-400 fill-current" />
            <span className="text-lg font-space font-medium">Customer Love</span>
            <Star className="w-6 h-6 text-golden-400 fill-current" />
          </div>
          
          <h2 className="text-5xl lg:text-7xl font-space font-black text-warm-gray-900 dark:text-dark-warm-900 mb-8 leading-tight">
            Loved by{' '}
            <span className="relative">
              <span className="bg-gradient-to-r from-sunset-500 via-coral-500 to-golden-400 bg-clip-text text-transparent">
                businesses
              </span>
              <div className="absolute -bottom-3 left-0 right-0 h-2 bg-gradient-to-r from-sunset-500 via-coral-500 to-golden-400 rounded-full animate-scale-in"></div>
            </span>
            {' '}worldwide
          </h2>
          
          <p className="text-2xl lg:text-3xl text-warm-gray-600 dark:text-dark-warm-600 max-w-4xl mx-auto leading-relaxed font-medium">
            Join thousands of companies that trust Pulselify to{' '}
            <span className="text-sunset-600 dark:text-sunset-400 font-semibold">transform their customer relationships</span>
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="border-0 shadow-2xl shadow-warm-gray-900/10 dark:shadow-dark-warm-50/20 bg-white/90 dark:bg-dark-warm-100/90 backdrop-blur-sm rounded-3xl overflow-hidden group hover:scale-105 transition-all duration-500">
              <CardContent className="p-12">
                <div className="flex mb-8">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-6 h-6 fill-golden-400 text-golden-400" />
                  ))}
                </div>
                
                <div className="relative mb-10">
                  <Quote className="absolute -top-4 -left-2 w-12 h-12 text-sunset-200 dark:text-sunset-600" />
                  <blockquote className="text-warm-gray-700 dark:text-dark-warm-700 text-xl lg:text-2xl italic leading-relaxed font-medium pl-10">
                    "{testimonial.quote}"
                  </blockquote>
                </div>
                
                <div className="flex items-center">
                  <div className={`w-16 h-16 bg-gradient-to-br ${testimonial.gradient} rounded-2xl flex items-center justify-center text-white text-2xl font-space font-bold mr-6 shadow-lg`}>
                    {testimonial.author.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <div className="text-xl font-space font-bold text-warm-gray-900 dark:text-dark-warm-900">
                      {testimonial.author}
                    </div>
                    <div className="text-warm-gray-600 dark:text-dark-warm-600 font-medium">
                      {testimonial.role}
                    </div>
                    <div className="text-sunset-600 dark:text-sunset-400 font-semibold">
                      {testimonial.company}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {/* Company logos section */}
        <div className="mt-24 text-center">
          <p className="text-warm-gray-500 dark:text-dark-warm-500 font-medium mb-12 text-lg">
            Trusted by leading companies worldwide
          </p>
          <div className="flex flex-wrap justify-center items-center gap-12 opacity-60">
            {['TechStart', 'RetailCorp', 'InnovateCo', 'GrowthLabs', 'ScaleUp'].map((company, index) => (
              <div key={index} className="text-2xl font-space font-bold text-warm-gray-400 dark:text-dark-warm-400 hover:text-sunset-500 transition-colors duration-300">
                {company}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

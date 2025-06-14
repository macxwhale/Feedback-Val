
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Star } from 'lucide-react';

const testimonials = [
  {
    quote: "Pulselify made every customer truly heard. Insights feel personal, relevant and drive immediate impact. We feel closer to our customers than ever.",
    author: "Sarah Chen",
    role: "Head of Customer Success",
    company: "TechStart Inc"
  },
  {
    quote: "We switched in a day and saw value in a week. The modern dashboards and actionable summaries let us focus on outcomes, not endless noise.",
    author: "Marcus Johnson",
    role: "Operations Director",
    company: "RetailCorp"
  }
];

const logos = [
  { name: 'AcmeCorp', url: '/lovable-uploads/367347fe-02da-4338-b8ba-91138293d303.png' },
  { name: 'Linear', url: '/lovable-uploads/367347fe-02da-4338-b8ba-91138293d303.png' },
  { name: 'Zenith Metrics', url: '/lovable-uploads/367347fe-02da-4338-b8ba-91138293d303.png' },
  { name: 'Sunrise Retail', url: '/lovable-uploads/367347fe-02da-4338-b8ba-91138293d303.png' },
];

export const SocialProof: React.FC = () => (
  <section className="py-24 bg-[#f5f8f9] animate-fade-in">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-10">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 tracking-tight mb-2">Trusted by teams building remarkable experiences</h2>
        <p className="text-gray-500 text-base max-w-xl mx-auto mb-6">
          Modern companies using Pulselify to connect, listen, and act.                   
        </p>
      </div>
      <div className="flex flex-wrap justify-center gap-9 items-center mb-16">
        {logos.map((logo, idx) => (
          <div key={logo.name + idx} className="bg-gradient-to-br from-white via-blue-50 to-purple-50 rounded-xl p-3 shadow-sm flex items-center justify-center h-14 w-40 hover:shadow-md transition">
            <img className="h-8 w-auto opacity-70 grayscale hover:grayscale-0 hover:opacity-100 transition duration-300 mx-auto" src={logo.url} alt={logo.name + ' logo'} />
          </div>
        ))}
      </div>
      <div className="grid md:grid-cols-2 gap-7 max-w-4xl mx-auto">
        {testimonials.map((testimonial, idx) => (
          <Card key={idx} className="border-0 shadow-lg rounded-2xl bg-white hover:shadow-xl transition-all animate-fade-in">
            <CardContent className="pt-7">
              <div className="flex mb-3 gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <blockquote className="text-gray-700 mb-7 italic text-base">
                “{testimonial.quote}”
              </blockquote>
              <div>
                <div className="font-semibold text-gray-900">{testimonial.author}</div>
                <div className="text-sm text-gray-500">{testimonial.role}, {testimonial.company}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  </section>
);


import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Star } from 'lucide-react';

const testimonials = [
  {
    quote: "Pulselify made every customer truly heard. The insights were both human and actionable. Our whole culture is more responsive now.",
    author: "Sarah Chen",
    role: "Head of Customer Success",
    company: "TechStart Inc"
  },
  {
    quote: "We switched in a day, and saw value in a week. Clean, modern dashboards gave our small team big-company learning.",
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
  <section className="py-24 bg-[#f5f8f9]">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-12">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 tracking-tight mb-4">Clients who trust Pulselify</h2>
        </div>
        <div className="flex flex-wrap justify-center gap-6 mb-12">
          {logos.map((logo, idx) => (
            <img key={logo.name + idx} className="h-10 w-auto opacity-70 grayscale hover:grayscale-0 hover:opacity-100 transition duration-300" src={logo.url} alt={logo.name + ' logo'} />
          ))}
        </div>
        <div className="text-center mb-8">
          <h3 className="text-lg text-gray-600 font-semibold mb-2">What our users say</h3>
        </div>
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {testimonials.map((testimonial, idx) => (
            <Card key={idx} className="border-0 shadow-lg rounded-2xl bg-white hover:shadow-xl transition-all">
              <CardContent className="pt-6">
                <div className="flex mb-3 gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <blockquote className="text-gray-700 mb-6 italic text-base">
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
    </div>
  </section>
)


import React from "react";
import { Star } from "lucide-react";

const testimonials = [
  {
    quote: "We finally understand why customers leave — and now we win them back. Pulselify made feedback actionable, not just noise.",
    author: "Julia Carter",
    role: "Director, AcmeCorp"
  },
  {
    quote: "Our team stopped guessing. We spot churn risk and act instantly. Retention up, complaints down.",
    author: "Marcus Johnson",
    role: "CX Lead, Zenith Metrics"
  }
];

export const TestimonialSection: React.FC = () => (
  <section className="w-full bg-gradient-to-bl from-white to-blue-50 py-20">
    <div className="max-w-4xl mx-auto px-4 text-center">
      <h3 className="text-2xl font-bold text-blue-900 mb-10">What our users say</h3>
      <div className="grid md:grid-cols-2 gap-9">
        {testimonials.map((t, i) => (
          <div key={i} className="rounded-xl bg-white/90 border border-blue-100 shadow-md p-7 flex flex-col items-center transition animate-fade-in">
            <div className="flex mb-2 gap-1">
              {[...Array(5)].map((_, s) => (
                <Star key={s} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            <blockquote className="italic text-gray-700 mb-4">
              “{t.quote}”
            </blockquote>
            <div className="font-semibold text-blue-900">{t.author}</div>
            <div className="text-sm text-gray-500">{t.role}</div>
          </div>
        ))}
      </div>
    </div>
  </section>
)

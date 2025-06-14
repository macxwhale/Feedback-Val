
import React from "react";
import { Star } from "lucide-react";

const testimonials = [
  {
    quote: "Pulselify is a game-changer. Our response rates doubled, we finally act fast on what matters—and customers notice.",
    author: "Julia Carter",
    role: "Director of Customer Success",
    company: "AcmeCorp"
  },
  {
    quote: "Monthly reviews went from guessing to knowing. Our NPS is up 29 points and we celebrate real wins, not vanity metrics.",
    author: "Sam N.",
    role: "Operations Manager",
    company: "Zenith Metrics"
  }
];

export const TestimonialSection: React.FC = () => (
  <section className="w-full bg-white py-20">
    <div className="max-w-5xl mx-auto px-4 text-center">
      <h3 className="text-2xl font-bold text-gray-800 mb-12">Real teams. Real outcomes.</h3>
      <div className="grid md:grid-cols-2 gap-8">
        {testimonials.map((t, i) => (
          <div key={i} className="rounded-2xl bg-gradient-to-tr from-blue-100/30 to-orange-50/40 border border-blue-100/20 shadow-lg p-7 flex flex-col items-center transition animate-fade-in">
            <div className="flex mb-3 gap-1">
              {[...Array(5)].map((_, s) => (
                <Star key={s} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            <blockquote className="italic text-gray-700 mb-5">
              “{t.quote}”
            </blockquote>
            <div className="font-semibold text-gray-900">{t.author}</div>
            <div className="text-sm text-gray-500">{t.role}, {t.company}</div>
          </div>
        ))}
      </div>
    </div>
  </section>
)

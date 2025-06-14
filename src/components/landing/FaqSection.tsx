
import React from "react";

const faqs = [
  {
    q: "How long does setup take?",
    a: "Most teams launch Pulselify in under 10 minutes, with no technical skills required."
  },
  {
    q: "What support do I get on the free trial?",
    a: "Every free trial includes all features and live human support—ask us anything, anytime!"
  },
  {
    q: "How does Pulselify help retention?",
    a: "By surfacing pain points and trends, Pulselify helps you close feedback loops so customers stay longer and feel truly heard."
  }
];

export const FaqSection: React.FC = () => (
  <section className="w-full bg-gradient-to-t from-blue-50 to-white py-16">
    <div className="max-w-2xl mx-auto px-4">
      <h2 className="text-2xl font-bold mb-8 text-center text-gray-800">Frequently Asked Questions</h2>
      <div className="space-y-6">
        {faqs.map((faq, i) => (
          <div key={i} className="rounded-xl bg-white shadow px-6 py-5">
            <div className="font-semibold text-blue-700 mb-1">{faq.q}</div>
            <div className="text-gray-600">{faq.a}</div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

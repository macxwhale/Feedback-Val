
import React from "react";

export const FaqSection: React.FC = () => (
  <section className="py-16 bg-gradient-to-b from-white to-blue-50 border-t border-slate-100">
    <div className="max-w-3xl mx-auto px-6">
      <h3 className="text-2xl font-bold mb-6 text-blue-800 text-center">Frequently Asked Questions</h3>
      <div className="space-y-6">
        <div>
          <div className="font-medium text-gray-800 mb-1">Is this really a one-time price?</div>
          <div className="text-gray-600">Yes! Buy Pulsify once and use it forever. No recurring charges or hidden fees.</div>
        </div>
        <div>
          <div className="font-medium text-gray-800 mb-1">Can I use Pulsify with my existing workflows?</div>
          <div className="text-gray-600">Absolutely — embed into applications, interview flows, email, or simply send a direct feedback link.</div>
        </div>
        <div>
          <div className="font-medium text-gray-800 mb-1">How fast can I start collecting feedback?</div>
          <div className="text-gray-600">You'll be live in minutes with zero technical hurdles.</div>
        </div>
        <div>
          <div className="font-medium text-gray-800 mb-1">What kind of responses can I capture?</div>
          <div className="text-gray-600">Audio, video, and text — whatever allows people to express themselves best.</div>
        </div>
      </div>
    </div>
  </section>
);

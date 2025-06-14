
import React from "react";

export const BoldCTA: React.FC = () => (
  <section className="py-16 bg-gradient-to-r from-[#f5f2fa] via-[#f7f8fa] to-[#fbeee7] animate-scale-in">
    <div className="max-w-3xl mx-auto px-4 text-center">
      <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-6 leading-tight tracking-tight">
        Start transforming your feedback<br />into loyal superfans today.
      </h2>
      <p className="text-lg text-gray-500 mb-10">
        Pulselify helps successful teams unlock growth & retention—fast.
      </p>
      <button
        onClick={() => window.location.assign('/auth')}
        className="bg-gradient-to-r from-blue-600 via-purple-500 to-orange-400 text-white px-10 py-5 rounded-full shadow-lg hover:brightness-110 hover:scale-105 text-xl font-semibold transition"
      >Start Free – No credit card</button>
      <div className="text-xs text-gray-400 mt-5">
        Full onboarding in minutes &nbsp;•&nbsp; 14-day risk-free trial
      </div>
    </div>
  </section>
)

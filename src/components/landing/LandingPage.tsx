
import React from 'react';
import { useNavigate } from "react-router-dom";
import { FaqSection } from './FaqSection';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f6fbfc] via-[#f5f8fa] to-[#f7f8fa] text-gray-800 flex flex-col">
      {/* HERO */}
      <section className="relative pt-32 pb-10 flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-6 leading-tight tracking-tight text-gray-800">
          Stop Guessing. Start Hearing: <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-orange-400 bg-clip-text text-transparent">Elevate Every Candidate & Customer Experience</span>
        </h1>
        <p className="text-xl sm:text-2xl max-w-2xl mx-auto text-blue-800 mb-6 font-semibold">
          Unlock powerful, real feedback — audio, video, or text. Buy once, use forever.
        </p>
        <p className="text-lg max-w-xl mx-auto mb-4 text-gray-600">
          Pulsify empowers business owners and hiring managers to truly understand and improve candidate and customer journeys. Don’t just collect forms—collect real voices, faces, and stories.
        </p>
        <div className="my-8 flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate('/auth')}
            className="bg-gradient-to-r from-blue-600 via-purple-500 to-orange-400 text-white text-lg px-10 py-4 rounded-full shadow-lg hover:scale-105 transition font-semibold w-full sm:w-auto"
          >
            Unlock Lifetime Access Now
          </button>
        </div>
        <span className="block text-xs text-gray-500 mt-2">
          Limited-time offer: One-time payment. No subscriptions. <span className="text-orange-500">Offer ends soon!</span>
        </span>
      </section>

      {/* HERO DEMO / PREVIEW */}
      <section className="relative flex flex-col items-center lg:flex-row gap-12 lg:gap-28 justify-center py-8 max-w-5xl w-full mx-auto">
        <div className="max-w-md flex-1 text-left">
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-3 text-blue-900">See Pulsify in Action</h2>
            <ul className="text-gray-700 text-base list-check list-inside space-y-2">
              <li>🎤 <strong>Collect:</strong> Audio, video, or written feedback</li>
              <li>⚡ <strong>Analyze:</strong> Listen, watch, or read responses—get actionable insights instantly</li>
              <li>🔗 <strong>Share:</strong> Simple link, embed, or add to any workflow</li>
            </ul>
            <div className="mt-6 text-base text-blue-600">
              Works in job applications, interview flows, support channels, or as a standalone link.
            </div>
          </div>
          <div className="mt-4">
            <button 
              onClick={() => navigate('/auth')}
              className="bg-gradient-to-r from-green-500 via-blue-500 to-purple-500 text-white px-6 py-3 rounded-full font-medium hover:scale-105 transition shadow-md"
            >
              Try it free →
            </button>
          </div>
        </div>
        <div className="flex-1 max-w-xl flex items-center justify-center">
          {/* Placeholder visual/demo - replace with an actual video or animated mockup if available */}
          <div className="rounded-3xl shadow-lg border border-blue-100 bg-gradient-to-bl from-blue-50 via-white to-green-50 p-2 w-full max-w-sm">
            <img src="/lovable-uploads/367347fe-02da-4338-b8ba-91138293d303.png" alt="Pulsify feedback preview" className="rounded-2xl w-full object-cover" />
          </div>
        </div>
      </section>

      {/* VALUE PROPS / 6W's */}
      <section className="py-14 bg-white flex flex-col md:flex-row gap-10 max-w-6xl mx-auto w-full px-4">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-blue-700 mb-3">Who?</h3>
          <p className="text-gray-700 mb-5">For business owners & hiring managers who care about remarkable candidate and customer journeys.</p>
          <h3 className="text-xl font-bold text-blue-700 mb-3">What?</h3>
          <p className="text-gray-700 mb-5">Pulsify is a feedback platform that captures authentic audio, video, and text responses — real stories, not just numbers.</p>
          <h3 className="text-xl font-bold text-blue-700 mb-3">Where?</h3>
          <p className="text-gray-700">Embed in applications, interview flows, support tickets, or simply share a direct link.</p>
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-bold text-blue-700 mb-3">Why?</h3>
          <p className="text-gray-700 mb-5">Unlock richer insights, save time, and improve decision-making. Build trust and boost success with real feedback from real people.</p>
          <h3 className="text-xl font-bold text-blue-700 mb-3">When?</h3>
          <p className="text-gray-700 mb-5">Right now! <span className="font-semibold text-orange-500">Lifetime deal: buy once, keep forever.</span></p>
          <h3 className="text-xl font-bold text-blue-700 mb-3">How?</h3>
          <ol className="text-gray-700 list-decimal pl-6 mt-2 space-y-1 text-base">
            <li>Create a feedback campaign in minutes</li>
            <li>Customize questions and response types</li>
            <li>Share the link or embed it anywhere</li>
            <li>See results and actionable insights instantly</li>
          </ol>
        </div>
      </section>
      
      {/* EMOTIONAL BENEFITS / FEATURES */}
      <section className="py-20 bg-gradient-to-b from-[#f0f8ff] via-white to-[#edf7f7]">
        <div className="max-w-6xl mx-auto px-4 mb-12 text-center">
          <h2 className="text-3xl font-bold mb-3 text-blue-900">Everything you need for better feedback — and better business</h2>
          <p className="text-lg text-gray-600 max-w-xl mx-auto">Emotional intelligence, actionable results. Grouped by what matters most.</p>
        </div>
        <div className="grid gap-10 md:grid-cols-3 max-w-5xl mx-auto">
          <div className="rounded-2xl bg-white shadow p-7 relative border border-blue-100">
            <span className="absolute -top-5 left-5 bg-gradient-to-r from-blue-500 to-green-400 text-white px-4 py-1 rounded-full text-sm shadow">
              Know what your customers feel
            </span>
            <ul className="mt-8 space-y-4 text-gray-700 text-base">
              <li>✔️ Capture video, audio, or text feedback</li>
              <li>✔️ Real voices and faces reveal sentiment</li>
              <li>✔️ Go beyond forms—see emotions in action</li>
            </ul>
          </div>
          <div className="rounded-2xl bg-white shadow p-7 relative border border-green-100">
            <span className="absolute -top-5 left-5 bg-gradient-to-r from-green-400 to-blue-500 text-white px-4 py-1 rounded-full text-sm shadow">
              Improve loyalty & retention
            </span>
            <ul className="mt-8 space-y-4 text-gray-700 text-base">
              <li>✔️ Show customers and candidates you care</li>
              <li>✔️ Close feedback loops instantly</li>
              <li>✔️ Build trust with transparency</li>
            </ul>
          </div>
          <div className="rounded-2xl bg-white shadow p-7 relative border border-purple-100">
            <span className="absolute -top-5 left-5 bg-gradient-to-r from-purple-400 to-blue-500 text-white px-4 py-1 rounded-full text-sm shadow">
              Boost service & hiring quality
            </span>
            <ul className="mt-8 space-y-4 text-gray-700 text-base">
              <li>✔️ Surface powerful insights in minutes</li>
              <li>✔️ Make smarter, faster hiring/service decisions</li>
              <li>✔️ Save hours reviewing feedback</li>
            </ul>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-20 max-w-5xl mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-blue-800 text-center mb-8">What business owners & hiring managers say</h2>
        <div className="grid md:grid-cols-2 gap-7">
          <div className="rounded-2xl bg-white/90 shadow-lg p-8 border border-blue-50 text-gray-800">
            <blockquote className="mb-7 italic text-lg">“Pulsify gave us honest feedback we never would’ve gotten from a form. We saw candidate drop-off drop by 30% in weeks—and customers are finally telling us what they really think.”</blockquote>
            <div>
              <div className="font-semibold text-blue-900">Tanya S.</div>
              <div className="text-sm text-blue-600">People Operations, RetailCo</div>
            </div>
          </div>
          <div className="rounded-2xl bg-white/90 shadow-lg p-8 border border-purple-50 text-gray-800">
            <blockquote className="mb-7 italic text-lg">“The video option is a game changer. Lifetime access for a single payment was a no-brainer. Our support team feels closer to our users than ever.”</blockquote>
            <div>
              <div className="font-semibold text-blue-900">Miguel L.</div>
              <div className="text-sm text-blue-600">Head of Customer Success, TechLift</div>
            </div>
          </div>
        </div>
      </section>

      {/* SOCIAL PROOF */}
      <section className="mb-14 w-full px-4">
        <div className="max-w-5xl mx-auto border-t border-slate-100 pt-10 flex flex-col md:flex-row items-center justify-between gap-7">
          <div className="flex flex-col items-center md:items-start">
            <div className="flex gap-2 mb-1">
              <span className="font-extrabold text-blue-600 text-2xl">2,400+</span>
              <span className="text-gray-700 text-lg font-medium">businesses</span>
            </div>
            <div className="text-gray-500 text-sm mb-1">using Pulsify to drive better decisions</div>
            <div className="flex gap-2 items-center mt-2 opacity-80">
              <img src="/lovable-uploads/367347fe-02da-4338-b8ba-91138293d303.png" alt="AcmeCorp" className="h-6 w-auto grayscale" />
              <img src="/lovable-uploads/367347fe-02da-4338-b8ba-91138293d303.png" alt="TechStart" className="h-6 w-auto grayscale" />
              <img src="/lovable-uploads/367347fe-02da-4338-b8ba-91138293d303.png" alt="RetailCo" className="h-6 w-auto grayscale" />
              <span className="ml-2 text-xs text-gray-400">and more</span>
            </div>
          </div>
          <div className="mt-4 md:mt-0">
            <button
              onClick={() => navigate('/auth')}
              className="bg-gradient-to-r from-blue-600 via-purple-500 to-orange-400 text-white px-7 py-3 rounded-full shadow-lg hover:scale-105 font-medium transition"
            >
              Claim Lifetime Deal
            </button>
            <div className="text-xs mt-2 text-gray-400 text-center">Offer expires soon</div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <FaqSection />

      {/* FOOTER (leave as placeholder if not present) */}
      <footer className="py-8 text-center text-gray-400 text-sm border-t border-slate-100">
        &copy; {new Date().getFullYear()} Pulsify. All rights reserved.
      </footer>
    </div>
  );
};

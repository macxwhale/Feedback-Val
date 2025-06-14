
import React from 'react';
import { BarChart3 } from 'lucide-react';

export const DashboardPreview: React.FC = () => {
  return (
    <section className="py-24 bg-gradient-to-br from-[#edf1f3] via-white to-[#f5f2fa]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">See Your Insights Flow</h2>
          <p className="text-lg text-gray-500 max-w-xl mx-auto">
            Beautiful, live dashboards reveal actionable trends at a glance. Know what matters now.
          </p>
        </div>
        <div className="bg-[#f9fafb] rounded-3xl shadow-xl p-8 max-w-4xl mx-auto border border-blue-50 flex flex-col items-center justify-center">
          <div className="w-full h-72 flex flex-col items-center justify-center bg-gradient-to-bl from-blue-50 to-purple-50 rounded-2xl border border-slate-100">
            <BarChart3 className="w-16 h-16 text-blue-400 mx-auto mb-4" />
            <p className="text-lg font-medium text-gray-700">Interactive Dashboard Preview</p>
            <p className="text-gray-400 mt-2">Clarity in every visual, tailored for you</p>
          </div>
        </div>
      </div>
    </section>
  );
};

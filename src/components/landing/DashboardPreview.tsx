
import React from 'react';
import { BarChart3 } from 'lucide-react';

export const DashboardPreview: React.FC = () => {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Beautiful dashboards that make sense
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            See your feedback data come to life with intuitive visualizations and actionable insights
          </p>
        </div>
        
        <div className="bg-white rounded-2xl shadow-2xl shadow-gray-900/10 p-8 max-w-5xl mx-auto">
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-8 min-h-96 flex items-center justify-center">
            <div className="text-center">
              <BarChart3 className="w-16 h-16 text-blue-600 mx-auto mb-4" />
              <p className="text-lg font-medium text-gray-700">Interactive Dashboard Preview</p>
              <p className="text-gray-500 mt-2">See real-time analytics and insights</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

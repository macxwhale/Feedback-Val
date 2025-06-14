
import React from "react";
import { DashboardPreview } from "./DashboardPreview";

export const InteractiveDemo: React.FC = () => (
  <section className="w-full py-16 bg-white flex justify-center items-center">
    <div className="w-full max-w-5xl mx-auto flex flex-col md:flex-row items-center md:gap-16 gap-10 px-4">
      <div className="md:w-1/2">
        <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">See actionable insights in real-time</h3>
        <p className="text-gray-600 mb-4">
          Instantly visualize trends and sentiment as feedback rolls in. Move from chaos to coordinated growth—no setup headaches.
        </p>
        <ul className="list-disc ml-5 text-gray-700">
          <li>AI-powered tagging & summaries</li>
          <li>Team views & role-based dashboards</li>
          <li>Share actionable reports—instantly</li>
        </ul>
      </div>
      <div className="md:w-1/2 bg-gradient-to-br from-blue-50 to-purple-50 p-4 rounded-2xl shadow-lg border border-blue-100">
        <DashboardPreview />
      </div>
    </div>
  </section>
);

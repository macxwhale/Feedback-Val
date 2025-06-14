
import React from "react";

const stats = [
  { num: "2,000+", label: "Teams onboarded" },
  { num: "99%", label: "Positive feedback" },
  { num: "14 days", label: "To see ROI" }
];

export const StatsBar: React.FC = () => (
  <div className="w-full bg-gradient-to-r from-blue-100 via-green-50 to-purple-100 py-6 flex justify-center">
    <div className="flex flex-col sm:flex-row gap-6 sm:gap-14 text-center">
      {stats.map((stat, i) => (
        <div key={i}>
          <div className="text-2xl font-bold text-blue-700">{stat.num}</div>
          <div className="text-gray-500 text-sm">{stat.label}</div>
        </div>
      ))}
    </div>
  </div>
);

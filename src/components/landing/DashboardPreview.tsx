
import React from 'react';
import { ChartContainer } from '@/components/ui/chart';
import { BarChart, XAxis, YAxis, Tooltip, ResponsiveContainer, Bar, CartesianGrid } from 'recharts';

// Sample dashboard data—focus on visual clarity, not actual analytics
const data = [
  { name: "Jan", Responses: 310, Satisfied: 230 },
  { name: "Feb", Responses: 400, Satisfied: 345 },
  { name: "Mar", Responses: 480, Satisfied: 399 },
  { name: "Apr", Responses: 505, Satisfied: 455 },
  { name: "May", Responses: 670, Satisfied: 522 },
  { name: "Jun", Responses: 590, Satisfied: 540 },
];

export const DashboardPreview: React.FC = () => (
  <section className="py-24 bg-gradient-to-br from-[#edf1f3] via-white to-[#f5f2fa] animate-fade-in">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-800 mb-4 animate-fade-in">Insights That Empower Action</h2>
        <p className="text-lg text-gray-500 max-w-xl mx-auto animate-fade-in">
          Instantly see trends, themes, and sentiment visualized for your entire team.
        </p>
      </div>
      <div className="bg-white/90 rounded-3xl shadow-xl p-8 max-w-5xl mx-auto border border-blue-50 flex flex-col items-center justify-center animate-scale-in">
        <div className="w-full h-[350px] flex flex-col items-center justify-center bg-gradient-to-bl from-blue-50 to-purple-50 rounded-2xl border border-slate-100">
          <ChartContainer
            config={{
              Responses: { label: "Responses", color: "#3b82f6" },
              Satisfied: { label: "Satisfied", color: "#a78bfa" }
            }}
          >
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={data} margin={{ top: 15, right: 25, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="2 4" stroke="#e1e8eb" />
                <XAxis dataKey="name" stroke="#bbb" />
                <YAxis stroke="#bbb" />
                <Tooltip />
                <Bar dataKey="Responses" fill="#3b82f6" radius={[6, 6, 0, 0]} />
                <Bar dataKey="Satisfied" fill="#a78bfa" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </div>
    </div>
  </section>
);

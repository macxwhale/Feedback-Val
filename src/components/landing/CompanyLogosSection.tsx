
import React from "react";

const logos = [
  { name: 'AcmeCorp', url: '/lovable-uploads/367347fe-02da-4338-b8ba-91138293d303.png' },
  { name: 'Linear', url: '/lovable-uploads/367347fe-02da-4338-b8ba-91138293d303.png' },
  { name: 'Zenith Metrics', url: '/lovable-uploads/367347fe-02da-4338-b8ba-91138293d303.png' },
  { name: 'Sunrise Retail', url: '/lovable-uploads/367347fe-02da-4338-b8ba-91138293d303.png' }
];

export const CompanyLogosSection: React.FC = () => (
  <section className="w-full bg-gradient-to-r from-white via-blue-50 to-purple-50 py-10">
    <div className="max-w-5xl mx-auto flex flex-wrap justify-center gap-8 items-center">
      {logos.map((logo, idx) => (
        <div key={logo.name + idx} className="bg-white/90 rounded-xl p-3 shadow-md flex items-center justify-center h-12 w-36 hover:shadow-lg transition">
          <img className="h-7 w-auto opacity-80 grayscale hover:grayscale-0 hover:opacity-100 transition duration-300 mx-auto" src={logo.url} alt={logo.name + ' logo'} />
        </div>
      ))}
    </div>
  </section>
);


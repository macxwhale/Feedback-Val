
import React from 'react';
import { Activity, Mail, MapPin, Phone } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white py-20 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-12 mb-16">
          
          {/* Brand section */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-3 mb-8">
              <div className="relative">
                <Activity className="w-10 h-10 text-purple-500" />
                <div className="absolute inset-0 w-10 h-10 bg-purple-500 rounded-full opacity-20 animate-ping"></div>
              </div>
              <span className="text-3xl font-space font-bold">Pulsify</span>
            </div>
            
            <p className="text-xl text-gray-300 leading-relaxed mb-8 max-w-md font-medium">
              Transform customer feedback into meaningful growth with AI-powered insights that drive real business results.
            </p>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-purple-500" />
                <span className="text-gray-300">info@pulsify.bunisystems.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-purple-500" />
                <span className="text-gray-300">+254207862379</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="w-5 h-5 text-purple-500" />
                <span className="text-gray-300">Nairobi, Kenya</span>
              </div>
            </div>
          </div>
          
          {/* Product links */}
          <div>
            <h3 className="text-xl font-space font-bold mb-8">Product</h3>
            <ul className="space-y-4">
              {['Features', 'Pricing', 'Analytics', 'Integrations', 'API', 'Security'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-gray-300 hover:text-purple-400 transition-colors duration-300 font-medium">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Company links */}
          <div>
            <h3 className="text-xl font-space font-bold mb-8">Company</h3>
            <ul className="space-y-4">
              {['About', 'Blog', 'Careers', 'Partners', 'Contact', 'Support'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-gray-300 hover:text-purple-400 transition-colors duration-300 font-medium">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        {/* Bottom section */}
        <div className="border-t border-gray-800 pt-12 flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-8 mb-6 md:mb-0">
            <p className="text-gray-400 font-medium">
              © 2024 Pulsify. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors duration-300">
                Privacy Policy
              </a>
              <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors duration-300">
                Terms of Service
              </a>
            </div>
          </div>
          
          <div className="flex items-center space-x-6">
            <span className="text-gray-400 font-medium">Follow us:</span>
            <div className="flex space-x-4">
              {['Twitter', 'LinkedIn', 'GitHub'].map((social) => (
                <a key={social} href="#" className="w-10 h-10 bg-gray-800 rounded-xl flex items-center justify-center text-gray-300 hover:bg-purple-500 hover:text-white transition-all duration-300">
                  <span className="text-sm font-bold">{social[0]}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

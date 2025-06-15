
import React from 'react';
import { Activity, Mail, MapPin, Phone } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-warm-gray-900 dark:bg-dark-warm-100 text-warm-gray-300 dark:text-dark-warm-600 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-12 gap-8 mb-12">
          
          {/* Brand section */}
          <div className="md:col-span-9">
            <div className="flex items-center space-x-3 mb-6">
              <div className="relative">
                <Activity className="w-8 h-8 text-sunset-500" aria-label="Pulsify pulse icon" />
                <div className="absolute inset-0 w-8 h-8 bg-sunset-500 rounded-full opacity-20 animate-ping"></div>
              </div>
              <span className="text-2xl font-space font-bold text-white dark:text-dark-warm-900">Pulsify</span>
            </div>
            
            <p className="text-lg text-warm-gray-300 dark:text-dark-warm-600 leading-relaxed mb-2 max-w-md font-medium">
              Real Insights. Real Impact.
            </p>
            <p className="text-base text-warm-gray-400 dark:text-dark-warm-500 leading-relaxed mb-6 max-w-md font-medium">
              Transform customer feedback into meaningful growth with AI-powered insights that drive real business results.
            </p>
            
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-sunset-500" />
                <span className="text-warm-gray-300 dark:text-dark-warm-600 text-sm">info@pulsify.bunisystems.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-sunset-500" />
                <span className="text-warm-gray-300 dark:text-dark-warm-600 text-sm">+254207862379</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="w-4 h-4 text-sunset-500" />
                <span className="text-warm-gray-300 dark:text-dark-warm-600 text-sm">Nairobi, Kenya</span>
              </div>
            </div>
          </div>
          
          {/* Quick Actions */}
          <div className="md:col-span-3">
            <h3 className="text-lg font-space font-bold mb-4 text-white dark:text-dark-warm-900">Quick Actions</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <ThemeToggle />
                <span className="text-warm-gray-400 dark:text-dark-warm-500 text-sm">Toggle theme</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Bottom section */}
        <div className="border-t border-warm-gray-700 dark:border-dark-warm-300 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="flex flex-col sm:flex-row items-center text-center sm:text-left space-y-4 sm:space-y-0 sm:space-x-6 mb-4 md:mb-0">
            <p className="text-warm-gray-400 dark:text-dark-warm-500 font-medium text-sm">
              © 2025 Pulsify. All rights reserved.
            </p>
            <div className="flex space-x-4">
              <Link to="/privacy-policy" className="text-warm-gray-400 dark:text-dark-warm-500 hover:text-sunset-400 transition-colors duration-300 text-sm">
                Privacy Policy
              </Link>
              <Link to="/terms-of-service" className="text-warm-gray-400 dark:text-dark-warm-500 hover:text-sunset-400 transition-colors duration-300 text-sm">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};


import React from 'react';
import { Activity, Mail, MapPin, Phone } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export const Footer: React.FC = () => {
  const navigate = useNavigate();

  return (
    <footer className="bg-warm-gray-900 dark:bg-dark-warm-100 text-warm-gray-300 dark:text-dark-warm-600 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-12 gap-8 mb-12">
          
          {/* Brand section */}
          <div className="md:col-span-5">
            <div className="flex items-center space-x-3 mb-6">
              <div className="relative">
                <Activity className="w-8 h-8 text-sunset-500" />
                <div className="absolute inset-0 w-8 h-8 bg-sunset-500 rounded-full opacity-20 animate-ping"></div>
              </div>
              <span className="text-2xl font-space font-bold text-white dark:text-dark-warm-900">Pulsify</span>
            </div>
            
            <p className="text-lg text-warm-gray-300 dark:text-dark-warm-600 leading-relaxed mb-6 max-w-md font-medium">
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
          
          {/* Product links */}
          <div className="md:col-span-2">
            <h3 className="text-lg font-space font-bold mb-4 text-white dark:text-dark-warm-900">Product</h3>
            <ul className="space-y-3">
              {['Features', 'Pricing', 'Analytics', 'Integrations', 'API', 'Security'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-warm-gray-300 dark:text-dark-warm-600 hover:text-sunset-400 transition-colors duration-300 font-medium text-sm">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Company links */}
          <div className="md:col-span-2">
            <h3 className="text-lg font-space font-bold mb-4 text-white dark:text-dark-warm-900">Company</h3>
            <ul className="space-y-3">
              {['About', 'Blog', 'Careers', 'Partners', 'Contact', 'Support'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-warm-gray-300 dark:text-dark-warm-600 hover:text-sunset-400 transition-colors duration-300 font-medium text-sm">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Actions */}
          <div className="md:col-span-3">
            <h3 className="text-lg font-space font-bold mb-4 text-white dark:text-dark-warm-900">Quick Actions</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <ThemeToggle />
                <span className="text-warm-gray-400 dark:text-dark-warm-500 text-sm">Toggle theme</span>
              </div>
              <Button 
                variant="ghost" 
                onClick={() => navigate('/auth')}
                className="text-warm-gray-300 dark:text-dark-warm-600 hover:text-sunset-400 font-medium p-0 h-auto justify-start text-sm"
              >
                Sign in
              </Button>
            </div>
          </div>
        </div>
        
        {/* Bottom section */}
        <div className="border-t border-warm-gray-700 dark:border-dark-warm-300 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-6 mb-4 md:mb-0">
            <p className="text-warm-gray-400 dark:text-dark-warm-500 font-medium text-sm">
              © 2024 Pulsify. All rights reserved.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-warm-gray-400 dark:text-dark-warm-500 hover:text-sunset-400 transition-colors duration-300 text-sm">
                Privacy Policy
              </a>
              <a href="#" className="text-warm-gray-400 dark:text-dark-warm-500 hover:text-sunset-400 transition-colors duration-300 text-sm">
                Terms of Service
              </a>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <span className="text-warm-gray-400 dark:text-dark-warm-500 font-medium text-sm">Follow us:</span>
            <div className="flex space-x-3">
              {['T', 'L', 'G'].map((social, index) => (
                <a key={index} href="#" className="w-8 h-8 bg-warm-gray-700 dark:bg-dark-warm-300 rounded-lg flex items-center justify-center text-warm-gray-300 dark:text-dark-warm-600 hover:bg-sunset-500 hover:text-white transition-all duration-300 text-sm font-bold">
                  {social}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

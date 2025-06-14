
import React from 'react';
import { Activity, Mail, MapPin, Phone } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export const Footer: React.FC = () => {
  const navigate = useNavigate();

  return (
    <footer className="bg-warm-gray-900 dark:bg-dark-warm-50 text-white dark:text-dark-warm-900 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-12 mb-16">
          
          {/* Brand section */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-3 mb-8">
              <div className="relative">
                <Activity className="w-10 h-10 text-sunset-500" />
                <div className="absolute inset-0 w-10 h-10 bg-sunset-500 rounded-full opacity-20 animate-ping"></div>
              </div>
              <span className="text-3xl font-space font-bold">Pulsify</span>
            </div>
            
            <p className="text-xl text-warm-gray-300 dark:text-dark-warm-600 leading-relaxed mb-8 max-w-md font-medium">
              Transform customer feedback into meaningful growth with AI-powered insights that drive real business results.
            </p>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-sunset-500" />
                <span className="text-warm-gray-300 dark:text-dark-warm-600">info@pulsify.bunisystems.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-sunset-500" />
                <span className="text-warm-gray-300 dark:text-dark-warm-600">+254207862379</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="w-5 h-5 text-sunset-500" />
                <span className="text-warm-gray-300 dark:text-dark-warm-600">Nairobi, Kenya</span>
              </div>
            </div>
          </div>
          
          {/* Product links */}
          <div>
            <h3 className="text-xl font-space font-bold mb-8">Product</h3>
            <ul className="space-y-4">
              {['Features', 'Pricing', 'Analytics', 'Integrations', 'API', 'Security'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-warm-gray-300 dark:text-dark-warm-600 hover:text-sunset-400 transition-colors duration-300 font-medium">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Company links + Quick Actions */}
          <div>
            <h3 className="text-xl font-space font-bold mb-8">Company</h3>
            <ul className="space-y-4 mb-8">
              {['About', 'Blog', 'Careers', 'Partners', 'Contact', 'Support'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-warm-gray-300 dark:text-dark-warm-600 hover:text-sunset-400 transition-colors duration-300 font-medium">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
            
            {/* Quick Actions */}
            <div className="space-y-4">
              <h4 className="text-lg font-space font-semibold text-warm-gray-200 dark:text-dark-warm-700">Quick Actions</h4>
              <div className="flex items-center space-x-3">
                <ThemeToggle />
                <span className="text-warm-gray-400 dark:text-dark-warm-500 text-sm">Toggle theme</span>
              </div>
              <Button 
                variant="ghost" 
                onClick={() => navigate('/auth')}
                className="text-warm-gray-300 dark:text-dark-warm-600 hover:text-sunset-400 font-medium p-0 h-auto justify-start"
              >
                Sign in
              </Button>
            </div>
          </div>
        </div>
        
        {/* Bottom section */}
        <div className="border-t border-warm-gray-700 dark:border-dark-warm-300 pt-12 flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-8 mb-6 md:mb-0">
            <p className="text-warm-gray-400 dark:text-dark-warm-500 font-medium">
              © 2024 Pulsify. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <a href="#" className="text-warm-gray-400 dark:text-dark-warm-500 hover:text-sunset-400 transition-colors duration-300">
                Privacy Policy
              </a>
              <a href="#" className="text-warm-gray-400 dark:text-dark-warm-500 hover:text-sunset-400 transition-colors duration-300">
                Terms of Service
              </a>
            </div>
          </div>
          
          <div className="flex items-center space-x-6">
            <span className="text-warm-gray-400 dark:text-dark-warm-500 font-medium">Follow us:</span>
            <div className="flex space-x-4">
              {['Twitter', 'LinkedIn', 'GitHub'].map((social) => (
                <a key={social} href="#" className="w-10 h-10 bg-warm-gray-700 dark:bg-dark-warm-300 rounded-xl flex items-center justify-center text-warm-gray-300 dark:text-dark-warm-600 hover:bg-sunset-500 hover:text-white transition-all duration-300">
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

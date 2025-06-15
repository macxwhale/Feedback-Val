
import React from 'react';
import { Activity, Facebook, Instagram, Linkedin, Twitter } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { Link } from 'react-router-dom';

const FooterLink = ({ href, children, isRouterLink = false }: { href: string; children: React.ReactNode; isRouterLink?: boolean }) => {
  const Component = isRouterLink ? Link : 'a';
  const props = isRouterLink ? { to: href } : { href };
  return (
    <Component
      {...props}
      className="text-warm-gray-400 hover:text-white transition-colors duration-300 text-base"
    >
      {children}
    </Component>
  );
};

export const Footer: React.FC = () => {
  return (
    <footer className="bg-warm-gray-900 dark:bg-dark-warm-100">
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="xl:grid xl:grid-cols-5 xl:gap-8">
          {/* Brand section */}
          <div className="space-y-8 xl:col-span-2">
            <div className="flex items-center space-x-3">
              <Activity className="w-8 h-8 text-sunset-500" aria-label="Pulsify pulse icon" />
              <span className="text-2xl font-space font-bold text-white">Pulsify</span>
            </div>
            <p className="text-base text-warm-gray-400 max-w-xs">
              AI-powered insights to drive real business results.
            </p>
            <div className="flex space-x-6">
              <a href="#" className="text-warm-gray-400 hover:text-white">
                <span className="sr-only">Twitter</span>
                <Twitter className="h-6 w-6" />
              </a>
              <a href="#" className="text-warm-gray-400 hover:text-white">
                <span className="sr-only">LinkedIn</span>
                <Linkedin className="h-6 w-6" />
              </a>
              <a href="#" className="text-warm-gray-400 hover:text-white">
                <span className="sr-only">Facebook</span>
                <Facebook className="h-6 w-6" />
              </a>
              <a href="#" className="text-warm-gray-400 hover:text-white">
                <span className="sr-only">Instagram</span>
                <Instagram className="h-6 w-6" />
              </a>
            </div>
          </div>
          <div className="mt-12 grid grid-cols-2 gap-8 xl:mt-0 xl:col-span-3">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold text-gray-200 tracking-wider uppercase">Product</h3>
                <ul className="mt-4 space-y-4">
                  <li><FooterLink href="#features">Features</FooterLink></li>
                  <li><FooterLink href="#pricing">Pricing</FooterLink></li>
                  <li><FooterLink href="#faq">FAQ</FooterLink></li>
                </ul>
              </div>
              <div className="mt-12 md:mt-0">
                <h3 className="text-sm font-semibold text-gray-200 tracking-wider uppercase">Company</h3>
                <ul className="mt-4 space-y-4">
                  <li><FooterLink href="#">About Us</FooterLink></li>
                  <li><FooterLink href="#">Blog</FooterLink></li>
                  <li><FooterLink href="#">Careers</FooterLink></li>
                </ul>
              </div>
            </div>
            <div className="md:grid md:grid-cols-1 md:gap-8">
               <div>
                  <h3 className="text-sm font-semibold text-gray-200 tracking-wider uppercase">Legal</h3>
                  <ul className="mt-4 space-y-4">
                    <li><FooterLink href="/privacy-policy" isRouterLink>Privacy Policy</FooterLink></li>
                    <li><FooterLink href="/terms-of-service" isRouterLink>Terms of Service</FooterLink></li>
                  </ul>
                </div>
            </div>
          </div>
        </div>

        {/* Bottom section */}
        <div className="mt-12 border-t border-warm-gray-700 pt-8 flex justify-between items-center">
          <p className="text-base text-warm-gray-500">
            &copy; {new Date().getFullYear()} Pulsify. All rights reserved.
          </p>
          <ThemeToggle />
        </div>
      </div>
    </footer>
  );
};

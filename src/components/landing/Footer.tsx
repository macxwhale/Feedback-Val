
import React from 'react';
import { Activity, Facebook, Instagram, Linkedin, Twitter } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { Link } from 'react-router-dom';

const FooterLink = ({ href, children, isRouterLink = false }: { href: string; children: React.ReactNode; isRouterLink?: boolean }) => {
  if (isRouterLink) {
    return (
      <Link
        to={href}
        className="text-warm-gray-400 hover:text-white transition-colors duration-300 text-base"
      >
        {children}
      </Link>
    );
  }
  return (
    <a
      href={href}
      className="text-warm-gray-400 hover:text-white transition-colors duration-300 text-base"
    >
      {children}
    </a>
  );
};

export const Footer: React.FC = () => {
  return (
    <footer className="bg-warm-gray-900 dark:bg-dark-warm-100">
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="space-y-12">
          {/* Brand section */}
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="flex items-center space-x-3">
              <Activity className="w-8 h-8 text-sunset-500" aria-label="Pulsify pulse icon" />
              <span className="text-2xl font-space font-bold text-white">Pulsify</span>
            </div>
            <p className="text-base text-warm-gray-400 max-w-xs">
              AI-powered insights to drive real business results.
            </p>
          </div>
          
          <div className="md:flex md:justify-center md:space-x-24 space-y-12 md:space-y-0 text-center md:text-left">
              <div>
                <h3 className="text-sm font-semibold text-gray-200 tracking-wider uppercase">Product</h3>
                <ul className="mt-4 space-y-4">
                  <li><FooterLink href="#features">Features</FooterLink></li>
                  <li><FooterLink href="#pricing">Pricing</FooterLink></li>
                  <li><FooterLink href="#faq">FAQ</FooterLink></li>
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-200 tracking-wider uppercase">Company</h3>
                <ul className="mt-4 space-y-4">
                  <li><FooterLink href="#">About Us</FooterLink></li>
                  <li><FooterLink href="#">Blog</FooterLink></li>
                  <li><FooterLink href="#">Careers</FooterLink></li>
                </ul>
              </div>
          </div>
          <div className="flex justify-center space-x-6">
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

        {/* Bottom section */}
        <div className="mt-12 border-t border-warm-gray-700 pt-8 flex flex-col-reverse sm:flex-row sm:justify-between items-center gap-4">
          <div className="flex flex-col sm:flex-row items-center gap-x-6 gap-y-4">
            <p className="text-base text-warm-gray-500">
              &copy; {new Date().getFullYear()} Pulsify. All rights reserved.
            </p>
            <div className="flex items-center gap-x-6">
                <FooterLink href="/privacy-policy" isRouterLink>Privacy Policy</FooterLink>
                <FooterLink href="/terms-of-service" isRouterLink>Terms of Service</FooterLink>
            </div>
          </div>
          <ThemeToggle />
        </div>
      </div>
    </footer>
  );
};

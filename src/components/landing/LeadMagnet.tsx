
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DownloadCloud } from 'lucide-react';

export const LeadMagnet: React.FC = () => {
  return (
    <section id="lead-magnet" className="bg-warm-gray-50 dark:bg-dark-warm-100 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-2">
          <div className="max-w-xl lg:max-w-lg">
            <h2 className="text-3xl font-bold tracking-tight text-warm-gray-900 dark:text-dark-warm-900 sm:text-4xl">
              Get Ahead of the Curve.
            </h2>
            <p className="mt-4 text-lg leading-8 text-warm-gray-600 dark:text-dark-warm-600">
              Download our free e-book, "The Feedback Loop: A Guide to Growth," and learn how to turn customer insights into your most powerful asset.
            </p>
            <form onSubmit={(e) => e.preventDefault()} className="mt-6 flex max-w-md gap-x-4">
              <Input
                type="email"
                name="email"
                id="email-address"
                autoComplete="email"
                required
                className="min-w-0 flex-auto rounded-md border-0 bg-white px-3.5 py-2 text-warm-gray-900 shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-sunset-500 sm:text-sm sm:leading-6 dark:bg-dark-warm-200 dark:text-dark-warm-900"
                placeholder="Enter your email"
              />
              <Button
                type="submit"
                className="flex-none rounded-md bg-sunset-500 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-sunset-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sunset-500"
              >
                <DownloadCloud className="mr-2 h-4 w-4" />
                Download Now
              </Button>
            </form>
          </div>
          <div className="flex justify-center items-center">
            {/* Placeholder for an e-book cover image */}
            <div className="w-64 h-80 bg-white dark:bg-dark-warm-200 rounded-lg shadow-2xl flex items-center justify-center p-4">
                <div className="text-center">
                    <DownloadCloud className="mx-auto h-16 w-16 text-sunset-500"/>
                    <p className="mt-4 font-bold text-warm-gray-800 dark:text-dark-warm-800">The Feedback Loop: A Guide to Growth</p>
                    <p className="mt-2 text-sm text-warm-gray-600 dark:text-dark-warm-600">by Pulsify</p>
                </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

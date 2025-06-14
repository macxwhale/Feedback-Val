
import React from 'react';
import { EtaApplicationForm } from '@/components/eta/EtaApplicationForm';
import { Toaster } from '@/components/ui/toaster';

const EtaApplicationPage = () => {
  return (
    <div className="bg-gray-50 min-h-screen">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">Apply for Kenya eTA</h1>
        </div>
      </header>
      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <EtaApplicationForm />
        </div>
      </main>
      <Toaster />
    </div>
  );
};

export default EtaApplicationPage;

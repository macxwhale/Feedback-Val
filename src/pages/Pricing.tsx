
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const Pricing: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4">Pricing Plans</h1>
          <p className="text-gray-600">Choose the perfect plan for your organization</p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Starter</CardTitle>
              <p className="text-2xl font-bold">$29/mo</p>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 mb-4">
                <li>Up to 1,000 responses</li>
                <li>Basic analytics</li>
                <li>Email support</li>
              </ul>
              <Button className="w-full">Get Started</Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Professional</CardTitle>
              <p className="text-2xl font-bold">$99/mo</p>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 mb-4">
                <li>Up to 10,000 responses</li>
                <li>Advanced analytics</li>
                <li>Priority support</li>
                <li>Custom branding</li>
              </ul>
              <Button className="w-full">Get Started</Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Enterprise</CardTitle>
              <p className="text-2xl font-bold">Custom</p>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 mb-4">
                <li>Unlimited responses</li>
                <li>Custom features</li>
                <li>Dedicated support</li>
                <li>On-premise deployment</li>
              </ul>
              <Button className="w-full">Contact Sales</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

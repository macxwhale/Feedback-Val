
import React, { useState } from 'react';
import { PersonalInformationStep } from './steps/PersonalInformationStep';
import { StepIndicator } from './StepIndicator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const steps = [
  { id: 1, name: 'Personal Information' },
  { id: 2, name: 'Travel Information' },
  { id: 3, name: 'Review & Submit' },
];

export const EtaApplicationForm: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({});

  const handleNext = (data: any) => {
    setFormData(prev => ({ ...prev, ...data }));
    if (currentStep < steps.length) {
      setCurrentStep(prev => prev + 1);
    } else {
      // This will be replaced with actual submission logic later
      console.log('Final Form Data:', { ...formData, ...data });
      alert('Application Submitted!');
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <PersonalInformationStep onNext={handleNext} formData={formData} />;
      // Future steps will be added here
      default:
        return <PersonalInformationStep onNext={handleNext} formData={formData} />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <StepIndicator steps={steps} currentStep={currentStep} />
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>{steps.find(step => step.id === currentStep)?.name}</CardTitle>
        </CardHeader>
        <CardContent>
          {renderStep()}
        </CardContent>
      </Card>
    </div>
  );
};


import { QuestionConfig } from '@/components/FeedbackForm';

export const fetchQuestions = async (): Promise<QuestionConfig[]> => {
  // Simulated API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return [
    {
      id: 'satisfaction',
      type: 'star',
      question: 'How satisfied are you with our service?',
      required: true,
    },
    {
      id: 'service-emoji',
      type: 'emoji',
      question: 'How do you feel about our customer service?',
      required: true,
      options: ['😠', '😞', '😐', '😊', '😍']
    },
    {
      id: 'nps',
      type: 'nps',
      question: 'How likely are you to recommend Police Sacco to a friend or colleague?',
      required: true,
    },
    {
      id: 'ease-of-use',
      type: 'likert',
      question: 'Our services are easy to use',
      required: true,
      scale: {
        min: 1,
        max: 5,
        minLabel: 'Strongly Disagree',
        maxLabel: 'Strongly Agree'
      }
    },
    {
      id: 'interest-rate',
      type: 'slider',
      question: 'How would you rate our interest rates?',
      required: true,
      scale: {
        min: 1,
        max: 10,
        minLabel: 'Poor',
        maxLabel: 'Excellent'
      }
    },
    {
      id: 'service-ranking',
      type: 'ranking',
      question: 'Rank these services by importance to you (drag to reorder)',
      required: true,
      options: ['Savings Account', 'Loans', 'Insurance', 'Investment', 'Mobile Banking']
    },
    {
      id: 'service-matrix',
      type: 'matrix',
      question: 'Rate each aspect of our services',
      required: true,
      options: ['Speed', 'Quality', 'Value', 'Support'],
      scale: {
        min: 1,
        max: 5,
        minLabel: 'Poor',
        maxLabel: 'Excellent'
      }
    },
    {
      id: 'preferred-service',
      type: 'single-choice',
      question: 'Which service do you use most frequently?',
      required: true,
      options: ['Savings Account', 'Loans', 'Insurance', 'Investment', 'Mobile Banking']
    },
    {
      id: 'improvements',
      type: 'multi-choice',
      question: 'What areas would you like us to improve? (Select all that apply)',
      required: false,
      options: ['Customer Service', 'Mobile App', 'Interest Rates', 'Branch Hours', 'Online Services']
    },
    {
      id: 'comments',
      type: 'text',
      question: 'Please share any additional comments or suggestions',
      required: false,
    }
  ];
};

export const generateRandomScore = () => Math.floor(Math.random() * 100) + 1;

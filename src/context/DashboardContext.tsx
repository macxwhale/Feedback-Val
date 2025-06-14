
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { DateRange } from 'react-day-picker';

interface DashboardContextType {
  dateRange: DateRange | undefined;
  setDateRange: (date: DateRange | undefined) => void;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export const DashboardProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [dateRange, setDateRange] = useState<DateRange | undefined>();

  return (
    <DashboardContext.Provider value={{ dateRange, setDateRange }}>
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
};

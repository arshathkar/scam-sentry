import React from 'react';
import { useAppSettings } from '../contexts/SeniorFriendlyContext';

interface SeniorFriendlyWrapperProps {
  children: React.ReactNode;
}

export const SeniorFriendlyWrapper: React.FC<SeniorFriendlyWrapperProps> = ({ children }) => {
  const { isSeniorFriendly } = useAppSettings();

  return (
    <div className={`transition-all duration-500 ease-in-out w-full h-full min-h-screen text-white bg-[#0F172A] ${
      isSeniorFriendly 
        ? 'text-xl [&_p]:text-lg [&_button]:min-h-[56px] [&_button]:text-lg [&_input]:min-h-[56px] [&_input]:text-lg [&_.gap-2]:gap-4 [&_.gap-3]:gap-5 [&_.gap-4]:gap-6 [&_.p-4]:p-6 [&_.p-6]:p-8' 
        : 'text-base [&_button]:min-h-[44px] [&_input]:min-h-[44px]'
    }`}>
      {children}
    </div>
  );
};

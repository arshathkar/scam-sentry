import React, { createContext, useContext, useState, useEffect } from 'react';

interface AppSettingsContextType {
  isSeniorFriendly: boolean;
  language: string;
  toggleSeniorFriendly: () => void;
  setLanguage: (lang: string) => void;
}

const AppSettingsContext = createContext<AppSettingsContextType>({
  isSeniorFriendly: false,
  language: 'en',
  toggleSeniorFriendly: () => {},
  setLanguage: () => {},
});

export const SeniorFriendlyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isSeniorFriendly, setIsSeniorFriendly] = useState<boolean>(() => {
    return localStorage.getItem('isSeniorFriendly') === 'true';
  });
  
  const [language, setLanguageState] = useState<string>(() => {
    return localStorage.getItem('appLanguage') || 'en';
  });

  const toggleSeniorFriendly = () => {
    setIsSeniorFriendly((prev) => {
      const next = !prev;
      localStorage.setItem('isSeniorFriendly', String(next));
      return next;
    });
  };

  const setLanguage = (lang: string) => {
    setLanguageState(lang);
    localStorage.setItem('appLanguage', lang);
  };

  return (
    <AppSettingsContext.Provider value={{ isSeniorFriendly, language, toggleSeniorFriendly, setLanguage }}>
      {children}
    </AppSettingsContext.Provider>
  );
};

export const useAppSettings = () => useContext(AppSettingsContext);

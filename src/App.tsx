import React from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { SeniorFriendlyProvider, useAppSettings } from './contexts/SeniorFriendlyContext';
import { Home } from './pages/Home';
import { Processing } from './pages/Processing';
import { Result } from './pages/Result';
import { BeforeYouPay } from './pages/BeforeYouPay';
import { Settings } from './pages/Settings';
import { ShareTarget } from './pages/ShareTarget';
import { getStrings } from './i18n/strings';

const NavBar: React.FC = () => {
  const location = useLocation();
  const { language, isSeniorFriendly } = useAppSettings();
  const t = getStrings(language, isSeniorFriendly);
  
  if (location.pathname === '/processing' || location.pathname === '/result' || location.pathname === '/qr-result' || location.pathname === '/share') {
    return null;
  }

  return (
    <nav className="fixed bottom-0 left-0 w-full bg-white/5 backdrop-blur-xl border-t border-white/10 flex justify-around p-2 pb-safe z-50">
      <Link to="/" className={`relative flex flex-col items-center min-h-[44px] min-w-[44px] justify-center ${location.pathname === '/' ? 'text-white font-bold' : 'text-slate-400'}`}>
        <span className="text-xl mb-1">🏠</span>
        <span className="text-xs">{t.home}</span>
        {location.pathname === '/' && (
          <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-6 h-0.5 bg-gradient-to-r from-blue-500 to-violet-500 rounded-t-full"></div>
        )}
      </Link>
      <Link to="/settings" className={`relative flex flex-col items-center min-h-[44px] min-w-[44px] justify-center ${location.pathname === '/settings' ? 'text-white font-bold' : 'text-slate-400'}`}>
        <span className="text-xl mb-1">⚙️</span>
        <span className="text-xs">{t.settings}</span>
        {location.pathname === '/settings' && (
          <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-6 h-0.5 bg-gradient-to-r from-blue-500 to-violet-500 rounded-t-full"></div>
        )}
      </Link>
    </nav>
  );
};

export const App: React.FC = () => {
  return (
    <SeniorFriendlyProvider>
      <BrowserRouter>
        <div className="font-sans text-white bg-[#0F172A] min-h-screen relative flex flex-col overflow-hidden">
          {/* Gradient Mesh Background */}
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/20 rounded-full blur-[100px] pointer-events-none"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-violet-500/20 rounded-full blur-[100px] pointer-events-none"></div>
          <div className="relative z-10 flex-1 flex flex-col">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/processing" element={<Processing />} />
              <Route path="/result" element={<Result />} />
              <Route path="/qr-result" element={<BeforeYouPay />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/share" element={<ShareTarget />} />
            </Routes>
            <NavBar />
          </div>
        </div>
      </BrowserRouter>
    </SeniorFriendlyProvider>
  );
};

export default App;

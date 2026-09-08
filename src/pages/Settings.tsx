import React, { useState } from 'react';
import { useAppSettings } from '../contexts/SeniorFriendlyContext';
import { getStrings } from '../i18n/strings';
import { clearHistory } from '../services/scamDna';
import { ConfirmModal } from '../components/ConfirmModal';

export const Settings: React.FC = () => {
  const { language, setLanguage, isSeniorFriendly, toggleSeniorFriendly } = useAppSettings();
  const t = getStrings(language, isSeniorFriendly);

  const [contactName, setContactName] = useState(localStorage.getItem('trustedName') || '');
  const [contactPhone, setContactPhone] = useState(localStorage.getItem('trustedPhone') || '');
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [showSaveToast, setShowSaveToast] = useState(false);

  const saveContact = () => {
    localStorage.setItem('trustedName', contactName);
    localStorage.setItem('trustedPhone', contactPhone);
    setShowSaveToast(true);
    setTimeout(() => setShowSaveToast(false), 2500);
  };

  const handleClearHistory = async () => {
    await clearHistory();
    setShowClearConfirm(false);
  };

  return (
    <div className="flex flex-col flex-1 p-6 min-h-screen pb-24 relative z-10 text-white max-w-md mx-auto w-full">
      <h1 className="font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-violet-400 text-2xl">{t.settings}</h1>

      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-4 shadow-xl mb-6">
        <h2 className="font-bold text-lg mb-5 text-blue-300">{t.language}</h2>
        <div className="flex flex-col gap-3">
          {[{ code: 'en', label: 'English' }, { code: 'hi', label: 'हिन्दी' }, { code: 'ta', label: 'தமிழ்' }].map(lang => (
            <label key={lang.code} className="flex items-center gap-4 cursor-pointer min-h-[44px] group">
              <div className="relative flex items-center justify-center">
                <input 
                  type="radio" 
                  name="language" 
                  value={lang.code} 
                  checked={language === lang.code} 
                  onChange={(e) => setLanguage(e.target.value)} 
                  className="peer sr-only"
                />
                <div className="w-5 h-5 rounded-full border-2 border-white/30 peer-checked:border-blue-500 peer-checked:bg-blue-500/20 transition-all"></div>
                <div className="absolute w-2.5 h-2.5 rounded-full bg-blue-400 scale-0 peer-checked:scale-100 transition-transform"></div>
              </div>
              <span className={`font-medium group-hover:text-blue-200 transition-colors ${language === lang.code ? 'text-white' : 'text-slate-300'} ${isSeniorFriendly ? 'text-xl' : 'text-base'}`}>{lang.label}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-4 shadow-xl mb-6 flex items-center justify-between min-h-[44px]">
        <h2 className={`font-bold text-blue-300 ${isSeniorFriendly ? 'text-xl' : 'text-lg'}`}>{t.seniorMode}</h2>
        <button 
          onClick={toggleSeniorFriendly} 
          className={`w-11 h-6 rounded-full relative transition-all duration-300 p-1 ${isSeniorFriendly ? 'bg-gradient-to-r from-blue-500 to-violet-500 shadow-[0_0_15px_rgba(59,130,246,0.5)]' : 'bg-white/10 border border-white/20'}`}
        >
          <div className={`w-4 h-4 bg-white rounded-full shadow-md transition-transform duration-300 ${isSeniorFriendly ? 'translate-x-5' : 'translate-x-0'}`}></div>
        </button>
      </div>

      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-4 shadow-xl mb-6">
        <h2 className="font-bold text-lg mb-5 text-blue-300">{t.trustedContact}</h2>
        <div className="flex flex-col gap-5">
          <div>
            <label className="block text-sm text-slate-400 mb-2 ml-1">{t.name}</label>
            <input 
              type="text" 
              value={contactName} 
              onChange={e => setContactName(e.target.value)} 
              className="w-full bg-white/5 border border-white/10 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 text-white rounded-lg p-3 min-h-[44px] transition-all outline-none"
              placeholder="Enter name"
            />
          </div>
          <div>
            <label className="block text-sm text-slate-400 mb-2 ml-1">{t.phone}</label>
            <input 
              type="tel" 
              value={contactPhone} 
              onChange={e => setContactPhone(e.target.value)} 
              className="w-full bg-white/5 border border-white/10 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 text-white rounded-lg p-3 min-h-[44px] transition-all outline-none"
              placeholder="Enter phone number"
            />
          </div>
          <button onClick={saveContact} className="bg-gradient-to-r from-blue-500 to-violet-500 hover:shadow-lg hover:shadow-blue-500/25 hover:scale-[1.02] transition-all duration-300 text-white font-bold py-2.5 rounded-lg min-h-[44px] mt-2">
            {t.save}
          </button>
        </div>
      </div>

      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-2 shadow-xl mb-6">
        <button onClick={() => setShowClearConfirm(true)} className="w-full text-red-400 hover:text-red-300 hover:bg-red-500/10 font-bold text-center py-3 rounded-lg min-h-[44px] transition-all">
          {t.clearHistory}
        </button>
      </div>

      <div className="mt-8 text-center px-4">
        <p className="text-xs text-slate-500 mb-2">{t.about}</p>
        <p className="text-xs text-slate-500">{t.privacy}</p>
      </div>

      {/* Clear History Confirmation */}
      <ConfirmModal
        isOpen={showClearConfirm}
        title="Clear Scan History"
        message="This will permanently delete all your scan history. This action cannot be undone."
        confirmLabel="Clear All"
        cancelLabel="Cancel"
        variant="danger"
        onConfirm={handleClearHistory}
        onCancel={() => setShowClearConfirm(false)}
      />

      {/* Save Toast */}
      {showSaveToast && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] bg-emerald-500/90 backdrop-blur-md text-white px-5 py-2.5 rounded-lg shadow-lg shadow-emerald-500/30 font-medium text-sm flex items-center gap-2 animate-slide-down">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          Contact saved!
        </div>
      )}

      <style>{`
        @keyframes slide-down {
          from { transform: translate(-50%, -100%); opacity: 0; }
          to { transform: translate(-50%, 0); opacity: 1; }
        }
        .animate-slide-down { animation: slide-down 0.3s ease-out; }
      `}</style>
    </div>
  );
};

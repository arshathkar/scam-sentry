import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const ShareTarget: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // In a real PWA with Web Share Target level 2, the SW captures the POST request 
    // and stores the shared file in IndexedDB or caches it, then redirects here.
    // We simulate picking up the file and redirecting to processing.
    
    const timer = setTimeout(() => {
      // Navigate home as a fallback if no file is found, ideally we'd navigate to processing
      navigate('/');
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center h-screen p-6 text-center relative z-10 text-white">
      <div className="relative mb-8">
        <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full"></div>
        <div className="w-20 h-20 border-4 border-white/10 border-t-blue-500 rounded-full animate-spin relative z-10 shadow-[0_0_15px_rgba(59,130,246,0.3)]"></div>
      </div>
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-xl w-full max-w-sm">
        <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-violet-400 mb-3">Receiving share...</h2>
        <p className="text-slate-400">Preparing to analyze content</p>
      </div>
    </div>
  );
};

import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAppSettings } from '../contexts/SeniorFriendlyContext';
import { getStrings } from '../i18n/strings';
import { RiskGauge } from '../components/RiskGauge';
import { SignalCard } from '../components/SignalCard';
import { VoiceButton } from '../components/VoiceButton';
import { shareResult } from '../services/familyGuardian';
import type { EngineResult } from '../engine/types';

export const Result: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { language, isSeniorFriendly } = useAppSettings();
  const t = getStrings(language, isSeniorFriendly);

  const { engineResult, explanation, isKnownPattern } = (location.state || {}) as {
    engineResult?: EngineResult;
    explanation?: string;
    isKnownPattern?: boolean;
  };

  if (!engineResult) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 relative z-10 text-white max-w-md mx-auto w-full">
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-5 rounded-xl text-center">
          <p className="text-slate-400 text-lg mb-6">No result to display.</p>
          <button onClick={() => navigate('/')} className="bg-gradient-to-r from-blue-500 to-violet-500 hover:shadow-lg hover:shadow-blue-500/25 hover:scale-[1.02] transition-all duration-300 text-white py-3 px-5 rounded-lg font-bold min-h-[44px]">
            Go Home
          </button>
        </div>
      </div>
    );
  }

  const { riskLevel, riskScore, triggeredSignals } = engineResult;

  const getRiskColor = () => {
    if (riskLevel === 'safe') return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30 shadow-emerald-500/20';
    if (riskLevel === 'caution') return 'text-amber-400 bg-amber-500/10 border-amber-500/30 shadow-amber-500/20';
    return 'text-red-400 bg-red-500/10 border-red-500/30 shadow-red-500/20';
  };

  const getRiskLabel = () => {
    if (riskLevel === 'safe') return t.safe;
    if (riskLevel === 'caution') return t.caution;
    return t.danger;
  };

  const handleAskFamily = async () => {
    try {
      await shareResult(engineResult, explanation || '');
    } catch (err) {
      console.error('Share failed:', err);
    }
  };

  return (
    <div className="flex flex-col flex-1 p-4 pb-44 min-h-screen relative z-10 text-white max-w-md mx-auto w-full">
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-5 shadow-2xl flex flex-col items-center relative overflow-hidden">
        {/* Glow effect based on risk */}
        <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-full h-1/2 blur-[80px] -z-10 opacity-30 ${
          riskLevel === 'safe' ? 'bg-emerald-500' : riskLevel === 'caution' ? 'bg-amber-500' : 'bg-red-500'
        }`}></div>

        <RiskGauge score={riskScore} riskLevel={riskLevel} />
        
        <div className={`px-4 py-1.5 rounded-full font-bold text-xl mb-6 border shadow-lg ${getRiskColor()}`}>
          {getRiskLabel()}
        </div>

        {isKnownPattern && (
          <div className="bg-red-500/20 border border-red-500/50 text-red-400 px-4 py-1.5 rounded-lg text-sm font-bold mb-6 flex items-center gap-2 shadow-[0_0_15px_rgba(239,68,68,0.3)] animate-pulse">
            <span className="text-xl">⚠️</span> {t.knownPattern}
          </div>
        )}

        <div className="bg-white/5 border border-white/10 p-4 rounded-lg text-left w-full backdrop-blur-md">
          <p className={`${isSeniorFriendly ? 'text-xl' : 'text-base'} mb-4 leading-relaxed text-slate-200`}>
            {explanation}
          </p>
          <div className="flex justify-end">
            <VoiceButton text={explanation || ''} language={language} label={t.listen} />
          </div>
        </div>
      </div>

      <div className="mt-6 flex-1">
        {triggeredSignals && triggeredSignals.length > 0 ? (
          <>
            <h3 className={`font-bold mb-4 text-white ${isSeniorFriendly ? 'text-2xl' : 'text-lg'}`}>Detected Signals:</h3>
            <div className="space-y-3">
              {triggeredSignals.map((s, idx) => (
                <SignalCard key={idx} signal={s} />
              ))}
            </div>
          </>
        ) : (
          <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 p-5 rounded-xl text-center font-bold text-lg mt-4 shadow-[0_0_20px_rgba(16,185,129,0.15)] backdrop-blur-md">
            {t.looksSafe}
          </div>
        )}
      </div>

      <div className="fixed bottom-0 left-0 w-full p-4 bg-slate-900/80 backdrop-blur-xl border-t border-white/10 z-40">
        <div className="flex flex-col gap-3 max-w-md mx-auto w-full">
          {riskLevel !== 'safe' && (
            <button onClick={handleAskFamily} className="w-full bg-red-500/90 hover:bg-red-500 text-white py-3 rounded-lg font-bold text-lg min-h-[44px] shadow-lg shadow-red-500/25 transition-all">
              {t.askFamily}
            </button>
          )}
          <button onClick={() => navigate('/')} className="w-full bg-gradient-to-r from-blue-500 to-violet-500 hover:shadow-lg hover:shadow-blue-500/25 hover:scale-[1.01] transition-all duration-300 text-white py-3 rounded-lg font-bold text-lg min-h-[44px]">
            {t.scanAnother}
          </button>
        </div>
      </div>
    </div>
  );
};

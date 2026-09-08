import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAppSettings } from '../contexts/SeniorFriendlyContext';
import { getStrings } from '../i18n/strings';
import { RiskGauge } from '../components/RiskGauge';
import { SignalCard } from '../components/SignalCard';
import type { EngineResult, QRPaymentData } from '../engine/types';

export const BeforeYouPay: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { language, isSeniorFriendly } = useAppSettings();
  const t = getStrings(language, isSeniorFriendly);

  const { qrData, engineResult } = (location.state || {}) as {
    qrData?: QRPaymentData;
    engineResult?: EngineResult;
  };

  if (!qrData || !engineResult) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 relative z-10 text-white max-w-md mx-auto w-full">
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-5 rounded-xl text-center">
          <p className="text-slate-400 text-lg mb-6">No QR data to display.</p>
          <button onClick={() => navigate('/')} className="bg-gradient-to-r from-blue-500 to-violet-500 hover:shadow-lg hover:shadow-blue-500/25 hover:scale-[1.02] transition-all duration-300 text-white py-3 px-5 rounded-lg font-bold min-h-[44px]">
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col p-4 min-h-screen relative z-10 text-white max-w-md mx-auto w-full">
      <h1 className={`font-bold text-center mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-violet-400 ${isSeniorFriendly ? 'text-3xl' : 'text-2xl'}`}>
        {t.beforeYouPay}
      </h1>

      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-5 shadow-xl mb-6 text-center relative overflow-hidden">
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-blue-500/20 rounded-full blur-3xl"></div>
        
        <p className="text-slate-400 mb-1 text-sm">{t.recipient}</p>
        <p className="font-bold text-2xl mb-4 text-white">{qrData.payeeName || 'Unknown'}</p>
        
        <p className="text-slate-400 mb-1 text-sm">{t.upiId}</p>
        <p className="font-medium text-lg mb-4 font-mono bg-white/10 py-1 px-2 rounded-md inline-block border border-white/5 text-blue-200">{qrData.upiId || 'N/A'}</p>

        {qrData.amount != null && qrData.amount > 0 && (
          <>
            <p className="text-slate-400 mb-1 text-sm">{t.amount}</p>
            <p className="font-bold text-4xl text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">₹{qrData.amount}</p>
          </>
        )}
      </div>

      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-5 shadow-xl mb-6 flex flex-col items-center relative overflow-hidden">
        <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-full h-1/2 blur-[80px] -z-10 opacity-20 ${
          engineResult.riskLevel === 'safe' ? 'bg-emerald-500' : engineResult.riskLevel === 'caution' ? 'bg-amber-500' : 'bg-red-500'
        }`}></div>

        <RiskGauge score={engineResult.riskScore} riskLevel={engineResult.riskLevel} size={120} />
        
        {engineResult.riskLevel !== 'safe' && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-2.5 rounded-lg mb-3 w-full text-center font-medium shadow-[0_0_15px_rgba(239,68,68,0.15)] mt-4">
            ⚠️ Proceed with caution. Risk detected.
          </div>
        )}
        
        <div className="w-full mt-3 space-y-3">
          {engineResult.triggeredSignals.map((s, idx) => (
            <SignalCard key={idx} signal={s} />
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-3 mt-auto pb-8">
        <button 
          className={`w-full py-3 rounded-lg font-bold text-lg min-h-[44px] transition-all duration-300 ${
            engineResult.riskLevel === 'safe' ? 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:shadow-lg hover:shadow-emerald-500/25 hover:scale-[1.02] text-white' : 'bg-white/10 text-slate-500 cursor-not-allowed border border-white/5'
          }`} 
          disabled={engineResult.riskLevel !== 'safe'}
          onClick={() => engineResult.riskLevel === 'safe' && navigate('/')}
        >
          {t.confirmPayment}
        </button>
        <button onClick={() => navigate('/')} className="w-full bg-red-500/20 hover:bg-red-500/40 border border-red-500/50 text-red-400 py-3 rounded-lg font-bold text-lg min-h-[44px] transition-all">
          {t.cancelPayment}
        </button>
      </div>
    </div>
  );
};

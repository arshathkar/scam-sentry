import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAppSettings } from '../contexts/SeniorFriendlyContext';
import { getStrings } from '../i18n/strings';
import { extractText, initOCR } from '../services/ocr';
import { analyzeContent } from '../engine/signalEngine';
import { generateReasoning } from '../services/aiReasoning';
import { checkPattern, storePattern } from '../services/scamDna';
import type { ContentType, EngineResult } from '../engine/types';

function detectContentType(text: string): ContentType {
  const lower = text.toLowerCase();
  if (lower.includes('upi') || lower.includes('payment') || lower.includes('paid') || lower.includes('transaction')) {
    return 'screenshot';
  }
  if (lower.includes('http://') || lower.includes('https://') || lower.includes('www.')) {
    return 'url';
  }
  if (lower.includes('otp') || lower.includes('sms') || lower.includes('dear customer')) {
    return 'message';
  }
  return 'unknown';
}

export const Processing: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { language, isSeniorFriendly } = useAppSettings();
  const t = getStrings(language, isSeniorFriendly);
  
  const [step, setStep] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

  const imageFile = location.state?.imageFile as File | undefined;

  useEffect(() => {
    if (!imageFile) {
      navigate('/');
      return;
    }

    let cancelled = false;

    const processImage = async () => {
      try {
        setStep(0);
        await initOCR();
        const ocrResult = await extractText(imageFile);
        if (cancelled) return;
        
        setStep(1);
        const contentType = detectContentType(ocrResult.text);
        const engineResult: EngineResult = analyzeContent({
          text: ocrResult.text,
          contentType,
        });
        if (cancelled) return;
        
        setStep(2);
        const explanation = await generateReasoning(engineResult, language);
        if (cancelled) return;
        
        const dnaMatch = await checkPattern(ocrResult.text);
        
        if (engineResult.riskLevel !== 'safe') {
          await storePattern(ocrResult.text, {
            id: engineResult.id,
            timestamp: engineResult.timestamp,
            contentType: engineResult.contentType,
            riskLevel: engineResult.riskLevel,
            riskScore: engineResult.riskScore,
            summary: explanation.substring(0, 100),
          });
        }

        navigate('/result', { 
          state: { 
            engineResult, 
            explanation, 
            isKnownPattern: dnaMatch.isKnown 
          } 
        });
      } catch (err) {
        console.error('Processing failed:', err);
        if (!cancelled) {
          setError(t.processingError || 'Something went wrong. Please try again.');
        }
      }
    };

    processImage();

    return () => {
      cancelled = true;
    };
  }, [imageFile, navigate, language, t.processingError]);

  const steps = [
    t.readingImage || 'Reading image...',
    t.analyzingPatterns || 'Analyzing patterns...',
    t.generatingExplanation || 'Generating explanation...'
  ];

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center flex-1 p-6 h-screen relative z-10 text-white max-w-md mx-auto w-full">
        <div className="bg-white/5 backdrop-blur-xl border border-red-500/30 p-4 rounded-xl flex flex-col items-center text-center shadow-lg shadow-red-500/10">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mb-4">
            <span className="text-3xl text-red-500">!</span>
          </div>
          <p className="text-red-400 text-xl mb-6 font-bold">{error}</p>
          <button onClick={() => navigate('/')} className="bg-gradient-to-r from-blue-500 to-violet-500 hover:shadow-lg hover:shadow-blue-500/25 hover:scale-[1.02] transition-all duration-300 text-white py-3 px-5 rounded-lg font-bold min-w-[44px] min-h-[44px]">
            {t.tryAgain || 'Try Again'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center flex-1 h-screen p-6 relative z-10 max-w-md mx-auto w-full">
      <div className="relative mb-16">
        <div className="absolute inset-0 bg-blue-500/20 blur-3xl rounded-full animate-pulse"></div>
        <svg className="w-32 h-32 text-blue-500/40 relative z-0" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden rounded-full z-10">
          <div className="w-full h-1 bg-blue-400 shadow-[0_0_20px_rgba(96,165,250,1)] animate-scan"></div>
        </div>
      </div>

      <div className="w-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-4 shadow-xl">
        {steps.map((label, index) => (
          <div key={index} className="flex items-center mb-3 last:mb-0 min-h-[44px]">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center mr-3 shadow-lg transition-all duration-500 ${
              step > index ? 'bg-emerald-500/20 border border-emerald-500/50 text-emerald-400 shadow-emerald-500/20' : 
              step === index ? 'bg-blue-500 border border-blue-400 text-white animate-pulse shadow-blue-500/40' : 
              'bg-white/5 border border-white/10 text-slate-500'
            }`}>
              {step > index ? '✓' : index + 1}
            </div>
            <span className={`font-medium transition-colors duration-500 ${step === index ? 'text-blue-400 text-lg' : step > index ? 'text-emerald-400/80' : 'text-slate-500'}`}>
              {label}
            </span>
          </div>
        ))}
      </div>

      <button onClick={() => navigate('/')} className="mt-12 text-slate-400 hover:text-white transition-colors underline py-2.5 px-5 min-h-[44px]">
        {t.cancel || 'Cancel'}
      </button>

      <style>{`
        @keyframes scan {
          0% { transform: translateY(-10px); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(138px); opacity: 0; }
        }
        .animate-scan {
          animation: scan 2.5s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

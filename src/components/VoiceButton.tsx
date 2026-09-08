import React, { useState, useEffect } from 'react';
import * as ttsService from '../services/tts';

interface VoiceButtonProps {
  text: string;
  language: string;
  label?: string;
}

export const VoiceButton: React.FC<VoiceButtonProps> = ({ text, language, label = 'Read Aloud' }) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isSupported, setIsSupported] = useState(true);

  useEffect(() => {
    // Check if SpeechSynthesis is available
    if (!window.speechSynthesis) {
      setIsSupported(false);
    }
  }, []);

  const toggleSpeech = async () => {
    if (isSpeaking) {
      ttsService.stopSpeaking();
      setIsSpeaking(false);
    } else {
      setIsSpeaking(true);
      try {
        await ttsService.speak(text, language);
      } catch {
        // Speech may fail silently
      } finally {
        setIsSpeaking(false);
      }
    }
  };

  if (!isSupported) return null;

  return (
    <button
      onClick={toggleSpeech}
      aria-label={isSpeaking ? 'Stop reading' : label}
      className={`relative inline-flex items-center justify-center gap-2 py-1.5 px-3 rounded-full text-sm font-medium transition-all duration-300 hover:scale-[1.02] overflow-hidden group
        ${isSpeaking 
          ? 'bg-gradient-to-r from-blue-600 to-violet-600 text-white shadow-[0_0_15px_rgba(59,130,246,0.6)] animate-pulse border-transparent' 
          : 'bg-white/5 text-white border border-white/20 hover:bg-white/10 hover:border-blue-500/50 hover:shadow-[0_0_12px_rgba(59,130,246,0.3)] backdrop-blur-xl'
        }
      `}
    >
      {/* Optional glass gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
      
      {isSpeaking ? (
        <>
          <div className="relative flex items-center justify-center w-4 h-4">
            <span className="absolute w-1 h-2.5 bg-white rounded-full animate-bounce [animation-delay:-0.3s]"></span>
            <span className="absolute w-1 h-4 bg-white rounded-full animate-bounce left-0"></span>
            <span className="absolute w-1 h-3 bg-white rounded-full animate-bounce right-0 [animation-delay:-0.15s]"></span>
          </div>
          <span className="relative z-10 text-shadow-sm">Stop Reading</span>
        </>
      ) : (
        <>
          <svg className="w-4 h-4 relative z-10 text-blue-400 group-hover:text-blue-300 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
          </svg>
          <span className="relative z-10">{label}</span>
        </>
      )}
    </button>
  );
};

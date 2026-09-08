import React, { useEffect, useState } from 'react';

interface RiskGaugeProps {
  score: number;
  riskLevel: 'safe' | 'caution' | 'danger';
  size?: number;
}

export const RiskGauge: React.FC<RiskGaugeProps> = ({ score, riskLevel, size = 160 }) => {
  const [animatedScore, setAnimatedScore] = useState(0);
  const strokeWidth = size * 0.08;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;

  useEffect(() => {
    // Animate from 0 to actual score on mount
    const timer = setTimeout(() => {
      setAnimatedScore(score);
    }, 100);
    return () => clearTimeout(timer);
  }, [score]);

  const offset = circumference - (animatedScore / 100) * circumference;

  const getColorClass = () => {
    switch (riskLevel) {
      case 'safe': return 'text-[#10b981] stroke-[#10b981] drop-shadow-[0_0_8px_rgba(16,185,129,0.6)]';
      case 'caution': return 'text-[#f59e0b] stroke-[#f59e0b] drop-shadow-[0_0_8px_rgba(245,158,11,0.6)]';
      case 'danger': return 'text-[#ef4444] stroke-[#ef4444] drop-shadow-[0_0_8px_rgba(239,68,68,0.6)]';
      default: return 'text-slate-400 stroke-slate-400';
    }
  };

  const getLabel = () => {
    switch (riskLevel) {
      case 'safe': return 'Looks Safe';
      case 'caution': return 'Use Caution';
      case 'danger': return 'High Risk!';
      default: return 'Unknown';
    }
  };

  return (
    <div 
      className={`relative flex items-center justify-center bg-transparent rounded-full shadow-2xl ${riskLevel === 'danger' ? 'animate-pulse' : ''}`} 
      style={{ width: size, height: size }}
    >
      <svg
        className="transform -rotate-90 w-full h-full drop-shadow-lg transition-all duration-1000"
        viewBox={`0 0 ${size} ${size}`}
      >
        <defs>
          <linearGradient id={`gradient-${riskLevel}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="currentColor" stopOpacity="0.8" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0.4" />
          </linearGradient>
        </defs>
        {/* Background Circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-white/10 stroke-current"
        />
        {/* Animated Progress Circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke={`url(#gradient-${riskLevel})`}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className={`transition-[stroke-dashoffset] duration-1000 ease-out ${getColorClass()}`}
        />
      </svg>
      
      <div className="absolute flex flex-col items-center justify-center text-center animate-in fade-in duration-500 delay-300">
        <span className={`text-4xl font-bold tracking-tighter ${getColorClass().split(' ')[0]} drop-shadow-[0_0_10px_currentColor]`}>
          {Math.round(animatedScore)}
        </span>
        <span className={`mt-1 text-xs font-semibold uppercase tracking-wider ${getColorClass().split(' ')[0]}`}>
          {getLabel()}
        </span>
      </div>
    </div>
  );
};

import { SignalDetector, DetectionContext, SignalResult } from '../types';

export const urgencyLanguageDetector: SignalDetector = {
  id: 'urgency-language',
  name: 'Urgency Language',
  description: 'Detects language designed to create panic or force immediate action.',
  category: 'Social Engineering',
  weight: 6,
  detect: (context: DetectionContext): SignalResult => {
    const text = context.text.toLowerCase();
    
    const englishPatterns = [
      'act now', 'immediately', 'urgent', 'last chance', 'within 24 hours',
      'account will be blocked', 'suspended', 'limited time', 'expires soon',
      'action required', 'do this now', 'final notice'
    ];
    
    const hindiPatterns = [
      'turant', 'jaldi karo', 'abhi', 'khatam ho jayega', 'block ho jayega',
      'band ho jayega', 'aakhri mauka'
    ];

    const allPatterns = [...englishPatterns, ...hindiPatterns];
    let matchCount = 0;
    
    for (const pattern of allPatterns) {
      if (text.includes(pattern)) {
        matchCount++;
      }
    }

    const triggered = matchCount > 0;
    const confidence = Math.min(matchCount * 0.3, 1.0);

    return {
      signalId: 'urgency-language',
      signalName: 'Urgency Language',
      triggered,
      confidence,
      weight: 6,
      explanation: triggered 
        ? `Found ${matchCount} instances of urgency-inducing language.` 
        : 'No urgency language detected.',
      category: 'Social Engineering',
    };
  }
};

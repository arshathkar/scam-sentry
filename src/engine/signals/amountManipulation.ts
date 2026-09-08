import { SignalDetector, DetectionContext, SignalResult } from '../types';

export const amountManipulationDetector: SignalDetector = {
  id: 'amount-manipulation',
  name: 'Amount Manipulation',
  description: 'Detects suspicious amount requests and "pay to receive" scams.',
  category: 'Financial Fraud',
  weight: 6,
  detect: (context: DetectionContext): SignalResult => {
    const text = context.text.toLowerCase();
    
    let matchCount = 0;
    
    const manipulationPatterns = [
      /pay first to receive/i,
      /send rs\.? ?1/i,
      /send ₹1/i,
      /collect request/i,
      /verify your account by sending/i,
      /refund of rs\.? ?[0-9]{4,}/i // High refund amounts
    ];
    
    for (const pattern of manipulationPatterns) {
      if (pattern.test(text)) {
        matchCount++;
      }
    }

    const triggered = matchCount > 0;
    const confidence = Math.min(matchCount * 0.5, 1.0);

    return {
      signalId: 'amount-manipulation',
      signalName: 'Amount Manipulation',
      triggered,
      confidence,
      weight: 6,
      explanation: triggered 
        ? 'Detected requests to pay first, verify with ₹1, or high refund promises.' 
        : 'No amount manipulation patterns detected.',
      category: 'Financial Fraud',
    };
  }
};

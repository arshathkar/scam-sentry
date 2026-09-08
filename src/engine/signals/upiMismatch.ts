import { SignalDetector, DetectionContext, SignalResult } from '../types';

export const upiMismatchDetector: SignalDetector = {
  id: 'upi-mismatch',
  name: 'UPI Mismatch',
  description: 'Detects suspicious UPI IDs and mismatches.',
  category: 'Financial Fraud',
  weight: 8,
  detect: (context: DetectionContext): SignalResult => {
    const text = context.text.toLowerCase();
    
    let triggered = false;
    let confidence = 0;
    let explanation = 'No UPI mismatches detected.';
    
    const suspiciousUpiPattern = /[a-z0-9]{15,}@[a-z]+/i;
    
    const knownHandles = ['@ybl', '@okaxis', '@oksbi', '@paytm', '@apl', '@ibl', '@axl'];
    
    const upiRegex = /[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}/g;
    const upiMatches = text.match(upiRegex) || [];
    
    if (upiMatches.length > 0) {
      for (const upi of upiMatches) {
        if (suspiciousUpiPattern.test(upi)) {
          triggered = true;
          confidence = 0.8;
          explanation = 'Detected highly unusual/random UPI handle structure.';
          break;
        }
      }
    }

    if (context.qrData?.upiId) {
       const qrUpi = context.qrData.upiId.toLowerCase();
       if (suspiciousUpiPattern.test(qrUpi)) {
          triggered = true;
          confidence = 0.9;
          explanation = 'QR contains a highly unusual/random UPI handle structure.';
       }
    }

    return {
      signalId: 'upi-mismatch',
      signalName: 'UPI Mismatch',
      triggered,
      confidence,
      weight: 8,
      explanation,
      category: 'Financial Fraud',
    };
  }
};

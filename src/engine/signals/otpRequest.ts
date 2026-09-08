import { SignalDetector, DetectionContext, SignalResult } from '../types';

export const otpRequestDetector: SignalDetector = {
  id: 'otp-request',
  name: 'OTP Request',
  description: 'Detects requests for sensitive information like OTPs, PINs, or CVV.',
  category: 'Information Disclosure',
  weight: 9,
  detect: (context: DetectionContext): SignalResult => {
    const text = context.text.toLowerCase();
    
    const patterns = [
      /share.*otp/i,
      /enter.*pin/i,
      /send.*otp/i,
      /verification code/i,
      /cvv/i,
      /atm pin/i,
      /password/i,
      /secret code/i,
      /do not share this/i
    ];
    
    let matchCount = 0;
    
    for (const pattern of patterns) {
      if (pattern.test(text)) {
        matchCount++;
      }
    }

    const triggered = matchCount > 0;
    const confidence = Math.min(matchCount * 0.4, 1.0);

    return {
      signalId: 'otp-request',
      signalName: 'OTP Request',
      triggered,
      confidence,
      weight: 9,
      explanation: triggered 
        ? 'Detected requests for sensitive information like OTP or PIN.' 
        : 'No request for sensitive info detected.',
      category: 'Information Disclosure',
    };
  }
};

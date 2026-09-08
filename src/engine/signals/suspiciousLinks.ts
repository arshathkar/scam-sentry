import { SignalDetector, DetectionContext, SignalResult } from '../types';

export const suspiciousLinksDetector: SignalDetector = {
  id: 'suspicious-links',
  name: 'Suspicious Links',
  description: 'Detects shortened URLs, non-standard TLDs, and IP addresses.',
  category: 'Phishing',
  weight: 7,
  detect: (context: DetectionContext): SignalResult => {
    const text = context.text.toLowerCase();
    
    const urlPattern = /(https?:\/\/[^\s]+)/g;
    const urls = text.match(urlPattern) || [];
    
    let matchCount = 0;
    
    const suspiciousPatterns = [
      /bit\.ly/i, /tinyurl\.com/i, /t\.co/i, /is\.gd/i,
      /\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/, 
      /login-verify/i, /account-secure/i, /update-now/i,
      /\.tk\b/i, /\.xyz\b/i, /\.cc\b/i
    ];
    
    let isHttpOnly = false;
    
    for (const url of urls) {
      if (url.startsWith('http://')) {
        isHttpOnly = true;
        matchCount++;
      }
      for (const pattern of suspiciousPatterns) {
        if (pattern.test(url)) {
          matchCount++;
        }
      }
    }

    const triggered = matchCount > 0;
    const confidence = Math.min(matchCount * 0.5, 1.0);

    return {
      signalId: 'suspicious-links',
      signalName: 'Suspicious Links',
      triggered,
      confidence,
      weight: 7,
      explanation: triggered 
        ? `Found ${matchCount} suspicious link pattern(s).${isHttpOnly ? ' Includes insecure HTTP link.' : ''}` 
        : 'No suspicious links detected.',
      category: 'Phishing',
    };
  }
};

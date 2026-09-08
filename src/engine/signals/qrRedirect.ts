import { SignalDetector, DetectionContext, SignalResult } from '../types';

export const qrRedirectDetector: SignalDetector = {
  id: 'qr-redirect',
  name: 'QR Collect/Redirect',
  description: 'Detects suspicious QR code content.',
  category: 'QR Fraud',
  weight: 8,
  detect: (context: DetectionContext): SignalResult => {
    let triggered = false;
    let confidence = 0;
    let explanation = 'No suspicious QR content detected.';
    
    if (context.contentType === 'qr' && context.qrData) {
      const qrUrl = context.qrData.url || context.qrData.rawValue || '';
      
      // Typical format: upi://pay?pa=...
      if (qrUrl.toLowerCase().includes('upi://pay')) {
        // Look for typical collect request parameters if present in raw string
        // Usually, 'pa' is payee address, if it's a collect request, it might have specific flags or 
        // the user is being tricked to scan to receive.
        explanation = 'Valid UPI format detected. Ensure you are PAYING, not expecting to RECEIVE.';
        // We only flag if the raw QR URL goes to a non-UPI scheme or a suspicious bitly link etc
      }
      
      if (/bit\.ly|tinyurl|http:\/\//i.test(qrUrl)) {
        triggered = true;
        confidence = 0.9;
        explanation = 'QR code redirects to a suspicious or shortened URL, not a direct payment gateway.';
      }
    }

    return {
      signalId: 'qr-redirect',
      signalName: 'QR Collect/Redirect',
      triggered,
      confidence,
      weight: 8,
      explanation,
      category: 'QR Fraud',
    };
  }
};

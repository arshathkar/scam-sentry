import { SignalDetector, DetectionContext, SignalResult } from '../types';

export const fakePaymentDetector: SignalDetector = {
  id: 'fake-payment',
  name: 'Fake Payment Screenshot',
  description: 'Detects fake/fabricated payment receipt screenshots with comprehensive pattern matching.',
  category: 'Financial Fraud',
  weight: 10,
  detect: (context: DetectionContext): SignalResult => {
    const text = context.text;
    const lower = text.toLowerCase();
    
    let matchCount = 0;
    const reasons: string[] = [];

    // ── 1. Payment success indicators (these are what scammers fake) ──
    const paymentSuccessPatterns = [
      /payment\s*successful/i,
      /money\s*sent\s*successfully/i,
      /transaction\s*successful/i,
      /payment\s*completed/i,
      /transfer\s*successful/i,
      /amount\s*(?:credited|debited|transferred)/i,
      /paid\s*successfully/i,
    ];
    
    let paymentSuccessCount = 0;
    for (const p of paymentSuccessPatterns) {
      if (p.test(text)) paymentSuccessCount++;
    }
    if (paymentSuccessCount > 0) {
      matchCount += 2; // Heavy weight — this IS what fake screenshots show
      reasons.push(`Payment success claim detected ("${text.match(paymentSuccessPatterns[0]) || 'payment successful'}")`);
    }

    // ── 2. UPI receipt structure indicators ──
    const receiptStructurePatterns = [
      /transaction\s*id/i,
      /reference\s*no/i,
      /upi\s*(?:id|ref)/i,
      /payment\s*method/i,
      /date\s*[&\+]*\s*time/i,
      /(?:paid|sent)\s*to/i,
      /recipient/i,
      /rupees?\s+[a-z]+\s+[a-z]+/i, // "Rupees Two Thousand" etc
      /₹\s*[\d,]+/,
      /\brs\.?\s*[\d,]+/i,
    ];
    
    let structureCount = 0;
    for (const p of receiptStructurePatterns) {
      if (p.test(text)) structureCount++;
    }
    
    // If it looks like a full payment receipt (4+ structural elements), it's suspicious
    if (structureCount >= 4) {
      matchCount += 3;
      reasons.push(`Payment receipt structure detected (${structureCount} receipt elements found)`);
    } else if (structureCount >= 2) {
      matchCount += 1;
      reasons.push(`Partial payment receipt elements detected (${structureCount} found)`);
    }

    // ── 3. UPI branding / trust signals that scammers copy ──
    const trustBaitPatterns = [
      /unified\s*payments?\s*interface/i,
      /powered\s*by\s*npci/i,
      /payments?\s*(?:on|are|is)\s*(?:upi|safe)/i,
      /safe\s*(?:and|&)\s*secure/i,
      /share\s*receipt/i,
      /download\s*receipt/i,
      /view\s*details/i,
      /go\s*to\s*home/i,
    ];
    
    let trustBaitCount = 0;
    for (const p of trustBaitPatterns) {
      if (p.test(text)) trustBaitCount++;
    }
    
    if (trustBaitCount >= 2) {
      matchCount += 2;
      reasons.push(`UPI trust signals/branding copied (${trustBaitCount} indicators)`);
    } else if (trustBaitCount >= 1) {
      matchCount += 1;
      reasons.push('UPI branding element detected');
    }

    // ── 4. Suspicious transaction ID formats ──
    const txnIdMatch = text.match(/(?:transaction\s*id|txn\s*id|utr)[:\s]*([a-zA-Z0-9]+)/i);
    if (txnIdMatch) {
      const txnId = txnIdMatch[1];
      // Placeholder/fake transaction IDs
      if (/^0{5,}/.test(txnId) || /^1234/.test(txnId) || /^UPI\d{12}$/.test(txnId)) {
        matchCount += 2;
        reasons.push(`Suspicious transaction ID format: ${txnId}`);
      }
    }

    // ── 5. Reference number analysis ──
    const refMatch = text.match(/reference\s*(?:no|number|#)?[:\s.]*(\d+)/i);
    if (refMatch) {
      const refNum = refMatch[1];
      // Very short or obviously sequential
      if (refNum.length < 8 || /^12345/.test(refNum) || /^0{5,}/.test(refNum)) {
        matchCount += 1;
        reasons.push(`Suspicious reference number: ${refNum}`);
      }
    }

    // ── 6. Bank name mentions (indicates payment context) ──
    const bankPatterns = [
      /\bhdfc\b/i, /\bicici\b/i, /\bsbi\b/i, /\baxis\b/i, /\bkotak\b/i,
      /\bpnb\b/i, /\bbob\b/i, /\bcanara\b/i, /\bundion\b/i, /\bindian\s*bank/i,
      /\bpaytm/i, /\bphonepe/i, /\bgoogle\s*pay/i, /\bgpay/i,
    ];
    
    let bankCount = 0;
    for (const p of bankPatterns) {
      if (p.test(text)) bankCount++;
    }
    if (bankCount > 0 && paymentSuccessCount > 0) {
      matchCount += 1;
      reasons.push('Bank/UPI app name combined with payment success claim');
    }

    // ── 7. Amount in words (formal receipt format — commonly faked) ──
    if (/rupees?\s+(?:one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|thirteen|fourteen|fifteen|sixteen|seventeen|eighteen|nineteen|twenty|thirty|forty|fifty|sixty|seventy|eighty|ninety|hundred|thousand|lakh|crore|only)/i.test(text)) {
      matchCount += 1;
      reasons.push('Amount written in words (formal receipt format)');
    }

    // ── 8. KEY INSIGHT: A screenshot ALONE can never prove payment ──
    // If we detect it's a payment receipt, that itself is a risk signal
    const isPaymentReceipt = paymentSuccessCount > 0 && structureCount >= 2;
    if (isPaymentReceipt) {
      matchCount += 2;
      reasons.push('⚠️ Screenshot alone cannot prove money was transferred — verify in your bank app');
    }

    // ── Calculate confidence ──
    // Scale: 1-2 matches = 0.4, 3-4 = 0.6, 5-7 = 0.8, 8+ = 0.95
    const triggered = matchCount > 0;
    let confidence = 0;
    if (matchCount >= 8) confidence = 0.95;
    else if (matchCount >= 5) confidence = 0.85;
    else if (matchCount >= 3) confidence = 0.7;
    else if (matchCount >= 1) confidence = 0.4;

    return {
      signalId: 'fake-payment',
      signalName: 'Fake Payment Screenshot',
      triggered,
      confidence,
      weight: 10,
      explanation: triggered 
        ? reasons.join('. ') + '.'
        : 'No fake payment indicators detected.',
      category: 'Financial Fraud',
    };
  }
};

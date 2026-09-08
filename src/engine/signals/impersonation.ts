import { SignalDetector, DetectionContext, SignalResult } from '../types';

export const impersonationDetector: SignalDetector = {
  id: 'impersonation',
  name: 'Impersonation',
  description: 'Detects impersonation of officials, banks, or support in message/scam contexts.',
  category: 'Social Engineering',
  weight: 8,
  detect: (context: DetectionContext): SignalResult => {
    const text = context.text.toLowerCase();
    
    let matchCount = 0;
    const reasons: string[] = [];
    
    // Only trigger impersonation for messages/unknown — NOT payment receipts
    // Payment receipts legitimately contain bank names
    const isPaymentReceipt = /payment\s*successful/i.test(text) && /transaction\s*id/i.test(text);
    
    // ── Government/Authority impersonation ──
    const govPatterns = [
      { pattern: /\brbi\b/i, label: 'RBI' },
      { pattern: /reserve\s*bank/i, label: 'Reserve Bank' },
      { pattern: /income\s*tax/i, label: 'Income Tax dept' },
      { pattern: /\bsebi\b/i, label: 'SEBI' },
      { pattern: /police/i, label: 'Police' },
      { pattern: /cyber\s*cell/i, label: 'Cyber Cell' },
      { pattern: /government\s*official/i, label: 'Government Official' },
      { pattern: /\btrai\b/i, label: 'TRAI' },
      { pattern: /telecom\s*authority/i, label: 'Telecom Authority' },
      { pattern: /ministry/i, label: 'Ministry' },
    ];
    
    for (const { pattern, label } of govPatterns) {
      if (pattern.test(text)) {
        matchCount += 2; // Government impersonation is very serious
        reasons.push(`Claims to be from ${label}`);
      }
    }

    // ── Support team impersonation ──
    const supportPatterns = [
      { pattern: /customer\s*care/i, label: 'Customer Care' },
      { pattern: /support\s*team/i, label: 'Support Team' },
      { pattern: /bank\s*manager/i, label: 'Bank Manager' },
      { pattern: /helpline/i, label: 'Helpline' },
      { pattern: /technical\s*support/i, label: 'Technical Support' },
      { pattern: /service\s*executive/i, label: 'Service Executive' },
    ];
    
    for (const { pattern, label } of supportPatterns) {
      if (pattern.test(text)) {
        matchCount += 1;
        reasons.push(`References ${label}`);
      }
    }

    // ── Bank names in message context (NOT in payment receipts) ──
    if (!isPaymentReceipt) {
      const bankMentionPatterns = [
        /\bsbi\b/i, /\bhdfc\b/i, /\bicici\b/i, /\bpnb\b/i, /\baxis\b/i,
        /\bkotak\b/i, /\bbob\b/i, /\bcanara\b/i,
      ];
      
      let bankMentions = 0;
      for (const p of bankMentionPatterns) {
        if (p.test(text)) bankMentions++;
      }
      
      // Bank name in a message (not receipt) is suspicious
      if (bankMentions > 0 && (
        /dear\s*customer/i.test(text) || 
        /your\s*account/i.test(text) ||
        /verify/i.test(text) ||
        /update/i.test(text) ||
        /click\s*(?:here|link|below)/i.test(text)
      )) {
        matchCount += 2;
        reasons.push(`Bank name used in suspicious message context (${bankMentions} banks mentioned)`);
      }
    }

    // ── Telecom impersonation ──
    const telecomPatterns = [
      /airtel\s*support/i, /jio\s*support/i, /vi\s*support/i,
      /airtel\s*customer/i, /jio\s*customer/i,
    ];
    for (const p of telecomPatterns) {
      if (p.test(text)) {
        matchCount += 1;
        reasons.push('Telecom support impersonation');
      }
    }

    const triggered = matchCount > 0;
    const confidence = Math.min(matchCount * 0.25, 1.0);

    return {
      signalId: 'impersonation',
      signalName: 'Impersonation',
      triggered,
      confidence,
      weight: 8,
      explanation: triggered 
        ? reasons.join('. ') + '.'
        : 'No impersonation detected.',
      category: 'Social Engineering',
    };
  }
};

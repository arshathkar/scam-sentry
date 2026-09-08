import type { EngineResult } from '../engine/types';

const EN_TEMPLATES = {
  riskOpening: {
    safe: "This appears to be safe.",
    caution: "⚠️ This looks suspicious — proceed with caution.",
    danger: "🚨 HIGH RISK — This is likely a scam or fake."
  },
  signals: {
    'urgency-language': "It uses urgent language to pressure you into acting quickly.",
    'otp-request': "It requests an OTP or verification code — never share these.",
    'upi-mismatch': "The UPI ID structure looks suspicious or unusual.",
    'suspicious-links': "It contains suspicious links that may steal your data.",
    'fake-payment': "This appears to be a fake/fabricated payment screenshot. A screenshot alone NEVER proves that money was actually transferred. Always verify in your bank or UPI app.",
    'amount-manipulation': "The amount shown may have been manipulated.",
    'impersonation': "Someone may be impersonating an official entity, bank, or authority.",
    'qr-redirect': "The QR code redirects to a suspicious destination.",
    // Legacy keys for backward compat
    'urgent_language': "It uses urgent language to pressure you.",
    'unknown_sender': "The sender is unknown or unverified.",
    'suspicious_link': "It contains a suspicious link that may steal your information.",
    'request_money': "It asks for money or personal details.",
    'too_good_to_be_true': "The offer seems too good to be true.",
    'generic_greeting': "It uses a generic greeting instead of your name.",
    'grammar_issues': "There are spelling or grammar mistakes common in scams.",
    'apk_link': "It contains a link to download an unknown app which could be malicious.",
    'upi_request': "It is requesting a UPI payment.",
    'unknown_domain': "The link goes to an unrecognized or newly created website."
  },
  advice: {
    safe: "You can proceed, but always stay alert.",
    caution: "Verify the sender's identity and check your bank app before trusting this.",
    danger: "Do NOT trust this screenshot as proof of payment. Check your own bank/UPI app to verify if money was actually received. Do not hand over goods or services based on a screenshot alone."
  }
};

const HI_TEMPLATES = {
  riskOpening: {
    safe: "यह सुरक्षित प्रतीत होता है।",
    caution: "⚠️ यह संदेहास्पद लग रहा है — सावधान रहें।",
    danger: "🚨 उच्च जोखिम — यह संभावित घोटाला या नकली है।"
  },
  signals: {
    'urgency-language': "यह आप पर दबाव डालने के लिए तत्काल भाषा का उपयोग करता है।",
    'otp-request': "यह OTP या सत्यापन कोड मांगता है — कभी साझा न करें।",
    'upi-mismatch': "UPI ID की संरचना संदिग्ध लगती है।",
    'suspicious-links': "इसमें संदिग्ध लिंक है जो आपका डेटा चुरा सकता है।",
    'fake-payment': "यह एक नकली भुगतान स्क्रीनशॉट प्रतीत होता है। स्क्रीनशॉट अकेले कभी भी यह साबित नहीं करता कि पैसा वास्तव में भेजा गया। अपने बैंक या UPI ऐप में हमेशा सत्यापित करें।",
    'amount-manipulation': "दिखाई गई राशि में हेरफेर किया गया हो सकता है।",
    'impersonation': "कोई आधिकारिक इकाई, बैंक, या प्राधिकरण का रूप धारण कर सकता है।",
    'qr-redirect': "QR कोड एक संदिग्ध गंतव्य पर रीडायरेक्ट करता है।",
    'urgent_language': "यह आप पर दबाव डालने के लिए तत्काल भाषा का उपयोग करता है।",
    'unknown_sender': "प्रेषक अज्ञात या असत्यापित है।",
    'suspicious_link': "इसमें एक संदिग्ध लिंक है जो आपकी जानकारी चुरा सकता है।",
    'request_money': "यह पैसे या व्यक्तिगत विवरण मांगता है।",
    'too_good_to_be_true': "प्रस्ताव सच होने के लिए बहुत अच्छा लगता है।",
    'generic_greeting': "यह आपके नाम के बजाय एक सामान्य अभिवादन का उपयोग करता है।",
    'grammar_issues': "स्कैम में सामान्य रूप से होने वाली वर्तनी या व्याकरण संबंधी गलतियाँ हैं।",
    'apk_link': "इसमें एक अज्ञात ऐप डाउनलोड करने का लिंक है।",
    'upi_request': "यह UPI भुगतान का अनुरोध कर रहा है।",
    'unknown_domain': "लिंक एक अपरिचित वेबसाइट पर जाता है।"
  },
  advice: {
    safe: "आप आगे बढ़ सकते हैं, लेकिन हमेशा सतर्क रहें।",
    caution: "कोई भी कार्रवाई करने से पहले प्रेषक की पहचान सत्यापित करें और अपना बैंक ऐप जांचें।",
    danger: "इस स्क्रीनशॉट को भुगतान का प्रमाण न मानें। अपने बैंक/UPI ऐप में जांचें कि पैसा वास्तव में प्राप्त हुआ है या नहीं। केवल स्क्रीनशॉट के आधार पर सामान या सेवाएं न दें।"
  }
};

export function generateExplanation(result: EngineResult, language: string = 'en'): string {
  const templates = language.toLowerCase().startsWith('hi') ? HI_TEMPLATES : EN_TEMPLATES;
  const parts: string[] = [];
  
  // 1. Opening
  parts.push(templates.riskOpening[result.riskLevel]);
  
  // 2. Signal explanations — use detector's own explanation if rich, else template
  if (result.triggeredSignals && result.triggeredSignals.length > 0) {
    const signalSentences = result.triggeredSignals.map(signal => {
      const templateKey = signal.signalId as keyof typeof templates.signals;
      const template = templates.signals[templateKey];
      
      // If the signal's own explanation is detailed (has specific reasons), prefer it
      if (signal.explanation && signal.explanation.length > 60) {
        return signal.explanation;
      }
      
      return template || (language.startsWith('hi') ? `चेतावनी: ${signal.signalName}` : `Warning: ${signal.signalName}`);
    });
    parts.push(...signalSentences);
  }
  
  // 3. Closing Advice
  parts.push(templates.advice[result.riskLevel]);
  
  return parts.join(' ');
}

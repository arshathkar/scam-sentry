import { SignalDetector, DetectionContext, EngineResult, RiskLevel } from './types';

import { urgencyLanguageDetector } from './signals/urgencyLanguage';
import { otpRequestDetector } from './signals/otpRequest';
import { upiMismatchDetector } from './signals/upiMismatch';
import { suspiciousLinksDetector } from './signals/suspiciousLinks';
import { fakePaymentDetector } from './signals/fakePayment';
import { amountManipulationDetector } from './signals/amountManipulation';
import { impersonationDetector } from './signals/impersonation';
import { qrRedirectDetector } from './signals/qrRedirect';

const DETECTORS: SignalDetector[] = [
  urgencyLanguageDetector,
  otpRequestDetector,
  upiMismatchDetector,
  suspiciousLinksDetector,
  fakePaymentDetector,
  amountManipulationDetector,
  impersonationDetector,
  qrRedirectDetector
];

export function analyzeContent(context: DetectionContext): EngineResult {
  const signals = DETECTORS.map(detector => detector.detect(context));
  
  const triggeredSignals = signals.filter(signal => signal.triggered);
  
  // ── Scoring Strategy ──
  // Instead of normalizing against ALL possible weights (which dilutes the score),
  // use the highest single signal's weighted confidence as a floor,
  // then boost based on how many signals fire.
  
  let maxWeightedScore = 0;
  let totalWeightedScore = 0;
  
  for (const signal of triggeredSignals) {
    const weighted = signal.weight * signal.confidence;
    totalWeightedScore += weighted;
    if (weighted > maxWeightedScore) {
      maxWeightedScore = weighted;
    }
  }
  
  // Base score: strongest signal maps to 0-70 range
  // A single signal with weight=10 and confidence=0.95 → 9.5/10 * 70 = 66.5
  const baseScore = (maxWeightedScore / 10) * 70;
  
  // Boost: each additional triggered signal adds 5-15 points based on its strength
  let boost = 0;
  for (const signal of triggeredSignals) {
    const weighted = signal.weight * signal.confidence;
    if (weighted !== maxWeightedScore) {
      boost += (weighted / 10) * 15;
    }
  }
  
  // Multi-signal bonus: if 3+ signals fire, that's very suspicious
  if (triggeredSignals.length >= 3) {
    boost += 10;
  }
  
  let riskScore = Math.round(Math.min(baseScore + boost, 100));
  
  // ── Risk Level Thresholds ──
  let riskLevel: RiskLevel = 'safe';
  if (riskScore >= 50) {
    riskLevel = 'danger';
  } else if (riskScore >= 25) {
    riskLevel = 'caution';
  }
  
  // ── Override: if fake-payment signal fires with high confidence, force minimum caution ──
  const fakePaymentSignal = triggeredSignals.find(s => s.signalId === 'fake-payment');
  if (fakePaymentSignal && fakePaymentSignal.confidence >= 0.7) {
    if (riskLevel === 'safe') {
      riskLevel = 'caution';
      riskScore = Math.max(riskScore, 35);
    }
    if (fakePaymentSignal.confidence >= 0.85) {
      riskLevel = 'danger';
      riskScore = Math.max(riskScore, 65);
    }
  }
  
  return {
    id: crypto.randomUUID(),
    riskScore,
    riskLevel,
    signals,
    triggeredSignals,
    rawText: context.text,
    contentType: context.contentType,
    timestamp: Date.now()
  };
}

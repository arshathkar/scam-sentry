export type RiskLevel = 'safe' | 'caution' | 'danger';
export type ContentType = 'screenshot' | 'message' | 'qr' | 'url' | 'unknown';

export interface SignalResult {
  signalId: string;
  signalName: string;
  triggered: boolean;
  confidence: number; // 0-1
  weight: number; // relative importance 1-10
  explanation: string;
  category: string;
}

export interface EngineResult {
  riskScore: number; // 0-100
  riskLevel: RiskLevel;
  signals: SignalResult[];
  triggeredSignals: SignalResult[];
  rawText: string;
  contentType: ContentType;
  timestamp: number;
  id: string;
}

export interface SignalDetector {
  id: string;
  name: string;
  description: string;
  category: string;
  weight: number;
  detect: (context: DetectionContext) => SignalResult;
}

export interface DetectionContext {
  text: string;
  contentType: ContentType;
  qrData?: QRPaymentData;
}

export interface QRPaymentData {
  upiId?: string;
  payeeName?: string;
  amount?: number;
  url?: string;
  rawValue: string;
}

export interface ScanRecord {
  id: string;
  timestamp: number;
  contentType: ContentType;
  riskLevel: RiskLevel;
  riskScore: number;
  summary: string;
  imageDataUrl?: string;
}

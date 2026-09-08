import jsQR from 'jsqr';
import type { QRPaymentData } from '../engine/types';

export interface DecodeResult {
  text: string | null;
  error?: string;
}

const fileToCanvas = async (file: File | Blob): Promise<HTMLCanvasElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0);
        resolve(canvas);
      } else {
        reject(new Error('Failed to get canvas context'));
      }
      URL.revokeObjectURL(url);
    };
    img.onerror = () => {
      reject(new Error('Failed to load image'));
      URL.revokeObjectURL(url);
    };
    img.src = url;
  });
};

const getCanvasImageData = (canvas: HTMLCanvasElement): ImageData | null => {
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;
  return ctx.getImageData(0, 0, canvas.width, canvas.height);
};

export async function decodeQR(imageSource: File | Blob | HTMLCanvasElement): Promise<DecodeResult> {
  try {
    let canvas: HTMLCanvasElement;
    if (imageSource instanceof HTMLCanvasElement) {
      canvas = imageSource;
    } else {
      canvas = await fileToCanvas(imageSource);
    }

    // Try BarcodeDetector if available
    if ('BarcodeDetector' in window) {
      try {
        const detector = new (window as any).BarcodeDetector({ formats: ['qr_code'] });
        const barcodes = await detector.detect(canvas);
        if (barcodes.length > 0) {
          return { text: barcodes[0].rawValue };
        }
      } catch (e) {
        console.warn('BarcodeDetector failed or not fully supported, falling back to jsQR', e);
      }
    }

    // Fallback to jsQR
    const imageData = getCanvasImageData(canvas);
    if (!imageData) {
      return { text: null, error: 'Failed to extract image data' };
    }

    const code = jsQR(imageData.data, imageData.width, imageData.height, {
      inversionAttempts: 'dontInvert',
    });

    if (code) {
      return { text: code.data };
    }

    return { text: null };
  } catch (error: any) {
    return { text: null, error: error.message };
  }
}

export function parseUPIIntent(rawValue: string): QRPaymentData | null {
  if (!rawValue.toLowerCase().startsWith('upi://pay')) {
    return null;
  }

  try {
    const url = new URL(rawValue);
    const params = url.searchParams;
    
    return {
      upiId: params.get('pa') || undefined,
      payeeName: params.get('pn') || undefined,
      amount: params.get('am') ? parseFloat(params.get('am')!) : undefined,
      url: rawValue,
      rawValue,
    };
  } catch (e) {
    console.error('Failed to parse UPI intent', e);
    return null;
  }
}

export function assessURLSafety(urlStr: string): { isSafe: boolean; domain: string; reason?: string } {
  try {
    const url = new URL(urlStr);
    const domain = url.hostname.toLowerCase();
    
    // Very basic check, in reality this would use a robust list or API
    const suspiciousKeywords = ['login', 'verify', 'account', 'secure', 'update', 'banking', 'support'];
    const hasSuspiciousKeyword = suspiciousKeywords.some(kw => domain.includes(kw));
    
    if (hasSuspiciousKeyword) {
      return { isSafe: false, domain, reason: 'Domain contains suspicious keywords' };
    }
    
    // Protocol check
    if (url.protocol !== 'https:') {
      return { isSafe: false, domain, reason: 'URL does not use secure HTTPS protocol' };
    }
    
    return { isSafe: true, domain };
  } catch (e) {
    return { isSafe: false, domain: 'unknown', reason: 'Invalid URL format' };
  }
}

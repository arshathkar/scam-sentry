import type { EngineResult } from '../engine/types';

export interface TrustedContact {
  name: string;
  phone?: string;
}

export function isShareSupported(): boolean {
  return typeof navigator !== 'undefined' && !!navigator.share;
}

export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(text);
      return true;
    }
    return false;
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);
    return false;
  }
}

export async function shareResult(result: EngineResult, explanation: string, imageFile?: File): Promise<boolean> {
  const riskEmoji = result.riskLevel === 'danger' ? '🚨' : result.riskLevel === 'caution' ? '⚠️' : '✅';
  const riskText = result.riskLevel.toUpperCase();
  
  const text = `${riskEmoji} Scam Sentry Alert: ${riskText}\n\n${explanation}\n\nScanned with Scam Sentry`;
  
  if (!isShareSupported()) {
    return copyToClipboard(text);
  }

  try {
    const shareData: ShareData = {
      title: 'Scam Sentry Alert',
      text: text,
    };

    // Check if the file sharing is supported and requested
    if (imageFile && navigator.canShare) {
      const filesArray = [imageFile];
      if (navigator.canShare({ files: filesArray })) {
        shareData.files = filesArray;
      }
    }

    await navigator.share(shareData);
    return true;
  } catch (error) {
    console.error('Error sharing:', error);
    // User abort is treated as error but we don't want to copy to clipboard automatically in that case
    if ((error as Error).name !== 'AbortError') {
       return copyToClipboard(text);
    }
    return false;
  }
}

const CONTACT_STORAGE_KEY = 'scam_sentry_trusted_contact';

export function getSavedContact(): TrustedContact | null {
  try {
    const data = localStorage.getItem(CONTACT_STORAGE_KEY);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

export function saveTrustedContact(contact: TrustedContact): void {
  try {
    localStorage.setItem(CONTACT_STORAGE_KEY, JSON.stringify(contact));
  } catch (e) {
    console.error('Failed to save trusted contact', e);
  }
}

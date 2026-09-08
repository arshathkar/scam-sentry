import { createWorker, Worker } from 'tesseract.js';

export interface OCRResult {
  text: string;
  confidence: number;
  blocks: Array<{
    text: string;
    bbox: { x0: number; y0: number; x1: number; y1: number };
  }>;
}

export type ProgressCallback = (progress: number) => void;

let workerInstance: Worker | null = null;

export async function initOCR(onProgress?: ProgressCallback): Promise<void> {
  if (workerInstance) return;

  try {
    workerInstance = await createWorker('eng', undefined, {
      logger: (m: { status: string; progress: number }) => {
        if (m.status === 'recognizing text' && onProgress) {
          onProgress(m.progress);
        }
      }
    });
  } catch (error) {
    console.error('Failed to initialize OCR worker:', error);
    workerInstance = null;
    throw error;
  }
}

export async function extractText(imageSource: File | Blob | string): Promise<OCRResult> {
  if (!workerInstance) {
    await initOCR();
  }

  if (!workerInstance) {
    return { text: '', confidence: 0, blocks: [] };
  }

  try {
    const { data } = await workerInstance.recognize(imageSource);
    
    return {
      text: data.text,
      confidence: data.confidence,
      blocks: data.blocks?.map(block => ({
        text: block.text,
        bbox: {
          x0: block.bbox.x0,
          y0: block.bbox.y0,
          x1: block.bbox.x1,
          y1: block.bbox.y1
        }
      })) || []
    };
  } catch (error) {
    console.error('OCR extraction failed:', error);
    return { text: '', confidence: 0, blocks: [] };
  }
}

export async function terminateOCR(): Promise<void> {
  if (workerInstance) {
    await workerInstance.terminate();
    workerInstance = null;
  }
}

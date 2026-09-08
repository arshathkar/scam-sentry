import type { EngineResult } from '../engine/types';
import { generateExplanation as generateTemplateExplanation } from './templateReasoning';

export type ModelStatus = 'not-loaded' | 'loading' | 'ready' | 'failed';

let modelStatus: ModelStatus = 'not-loaded';
let engine: any = null;

export async function isWebGPUAvailable(): Promise<boolean> {
  try {
    const nav = navigator as any;
    if (!nav.gpu) return false;
    const adapter = await nav.gpu.requestAdapter();
    return !!adapter;
  } catch {
    return false;
  }
}

export async function initModel(onProgress?: (progress: number) => void): Promise<void> {
  if (modelStatus === 'ready' || modelStatus === 'loading') return;
  
  const hasGPU = await isWebGPUAvailable();
  if (!hasGPU) {
    console.warn('WebGPU is not available. AI reasoning will use template fallback.');
    modelStatus = 'failed';
    return;
  }

  modelStatus = 'loading';
  
  try {
    // Use a variable to prevent Rollup from statically analyzing this import
    const moduleName = '@mlc-ai/web-llm';
    const webllm = await import(/* @vite-ignore */ moduleName);
    const { CreateMLCEngine } = webllm;
    
    const selectedModel = 'Llama-3.1-8B-Instruct-q4f32_1-MLC';
    
    engine = await CreateMLCEngine(selectedModel, {
      initProgressCallback: (progressInfo: { progress: number }) => {
        if (onProgress) {
          onProgress(progressInfo.progress);
        }
      }
    });
    
    modelStatus = 'ready';
  } catch (error) {
    console.error('Failed to initialize WebLLM:', error);
    modelStatus = 'failed';
  }
}

export function getModelStatus(): ModelStatus {
  return modelStatus;
}

export async function generateReasoning(result: EngineResult, language: string = 'en'): Promise<string> {
  if (modelStatus !== 'ready' || !engine) {
    return generateTemplateExplanation(result, language);
  }

  try {
    const timeoutPromise = new Promise<string>((_, reject) => {
      setTimeout(() => reject(new Error('LLM Timeout')), 15000);
    });

    const signalNames = result.triggeredSignals.map(s => s.signalName).join(', ');
    
    const systemPrompt = `You are an AI assistant helping a user understand if a message or payment is a scam. 
Explain in very simple ${language === 'hi' ? 'Hindi' : language === 'ta' ? 'Tamil' : 'English'} language.
Keep it under 3 short sentences. Be direct and clear.`;

    const userPrompt = `Risk Level: ${result.riskLevel}
Detected Suspicious Signals: ${signalNames || 'None'}
Text to analyze: "${result.rawText.substring(0, 200)}"
Is this a scam? Why? What should I do?`;

    const llmPromise = async (): Promise<string> => {
      const messages = [
        { role: 'system' as const, content: systemPrompt },
        { role: 'user' as const, content: userPrompt }
      ];
      
      const reply = await engine.chat.completions.create({ messages });
      return reply.choices[0].message.content || generateTemplateExplanation(result, language);
    };

    const explanation = await Promise.race([llmPromise(), timeoutPromise]);
    return explanation;

  } catch (error) {
    console.warn('AI reasoning failed or timed out, falling back to templates:', error);
    return generateTemplateExplanation(result, language);
  }
}

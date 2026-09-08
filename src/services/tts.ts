export interface VoiceInfo {
  uri: string;
  name: string;
  lang: string;
  localService: boolean;
  default: boolean;
}

let voicesLoaded = false;
let voices: SpeechSynthesisVoice[] = [];

export async function getAvailableVoices(): Promise<SpeechSynthesisVoice[]> {
  return new Promise((resolve) => {
    if (!('speechSynthesis' in window)) {
      resolve([]);
      return;
    }

    const synth = window.speechSynthesis;
    voices = synth.getVoices();

    if (voices.length > 0) {
      voicesLoaded = true;
      resolve(voices);
      return;
    }

    // Chrome quirk: getVoices() returns empty initially
    synth.onvoiceschanged = () => {
      voices = synth.getVoices();
      voicesLoaded = true;
      resolve(voices);
    };

    // Fallback if event doesn't fire
    setTimeout(() => {
      if (!voicesLoaded) {
        resolve(synth.getVoices());
      }
    }, 1000);
  });
}

export async function getVoicesForLanguage(lang: string): Promise<SpeechSynthesisVoice[]> {
  const allVoices = await getAvailableVoices();
  const targetPrefix = lang.split('-')[0].toLowerCase(); // e.g., 'en' from 'en-US'
  
  return allVoices.filter(v => v.lang.toLowerCase().startsWith(targetPrefix));
}

export async function speak(text: string, lang: string = 'en-US'): Promise<void> {
  if (!('speechSynthesis' in window)) return;
  
  stopSpeaking(); // Cancel any current speech

  const synth = window.speechSynthesis;
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang;

  const voices = await getVoicesForLanguage(lang);
  if (voices.length > 0) {
    // Try to find a high quality local voice first
    const bestVoice = voices.find(v => v.localService && !v.name.toLowerCase().includes('google')) || voices[0];
    utterance.voice = bestVoice;
  }

  return new Promise((resolve, reject) => {
    utterance.onend = () => resolve();
    utterance.onerror = (event) => reject(event.error);
    synth.speak(utterance);
  });
}

export function stopSpeaking(): void {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}

export function isSpeaking(): boolean {
  if ('speechSynthesis' in window) {
    return window.speechSynthesis.speaking;
  }
  return false;
}

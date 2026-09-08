export interface LocalizedStrings {
  appName: string;
  tagline: string;
  scanScreenshot: string;
  chooseGallery: string;
  scanQr: string;
  recentScans: string;
  noRecentScans: string;
  readingImage: string;
  analyzingPatterns: string;
  generatingExplanation: string;
  cancel: string;
  tryAgain: string;
  processingError: string;
  safe: string;
  caution: string;
  danger: string;
  knownPattern: string;
  listen: string;
  askFamily: string;
  scanAnother: string;
  looksSafe: string;
  beforeYouPay: string;
  recipient: string;
  upiId: string;
  amount: string;
  confirmPayment: string;
  cancelPayment: string;
  settings: string;
  language: string;
  seniorMode: string;
  trustedContact: string;
  name: string;
  phone: string;
  save: string;
  clearHistory: string;
  about: string;
  privacy: string;
  receivingShared: string;
  scanScreenshotSenior: string;
  scanQrSenior: string;
  readingImageSenior: string;
  analyzingPatternsSenior: string;
  generatingExplanationSenior: string;
  askFamilySenior: string;
  scanAnotherSenior: string;
  home: string;
}

export const strings: Record<string, LocalizedStrings> = {
  en: {
    appName: 'Scam Sentry',
    tagline: 'Your on-device scam detector',
    scanScreenshot: 'Scan Screenshot',
    chooseGallery: 'Choose from Gallery',
    scanQr: 'Scan QR Code',
    recentScans: 'Recent Scans',
    noRecentScans: 'No recent scans found.',
    readingImage: 'Reading image...',
    analyzingPatterns: 'Analyzing patterns...',
    generatingExplanation: 'Generating explanation...',
    cancel: 'Cancel',
    tryAgain: 'Try Again',
    processingError: 'An error occurred during processing.',
    safe: 'Safe',
    caution: 'Caution',
    danger: 'Danger',
    knownPattern: 'Known Scam Pattern',
    listen: 'Listen',
    askFamily: '🛡️ Ask My Family',
    scanAnother: '🔍 Scan Another',
    looksSafe: 'This looks safe.',
    beforeYouPay: 'Before You Pay',
    recipient: 'Recipient Name',
    upiId: 'UPI ID',
    amount: 'Amount',
    confirmPayment: 'Confirm Payment',
    cancelPayment: 'Cancel',
    settings: 'Settings',
    language: 'Language',
    seniorMode: 'Senior-Friendly Mode',
    trustedContact: 'Trusted Contact',
    name: 'Name',
    phone: 'Phone',
    save: 'Save',
    clearHistory: 'Clear Scan History',
    about: 'Scam Sentry v1.0 — All processing happens on your device. Your data never leaves your phone.',
    privacy: 'Privacy Info: All your data is stored locally in IndexedDB.',
    receivingShared: 'Receiving shared content...',
    
    // Senior variants
    scanScreenshotSenior: 'Check a Screenshot for Scams',
    scanQrSenior: 'Check a QR Code',
    readingImageSenior: 'Looking at your picture...',
    analyzingPatternsSenior: 'Checking for danger signs...',
    generatingExplanationSenior: 'Writing down what we found...',
    askFamilySenior: '🛡️ Ask a Family Member for Help',
    scanAnotherSenior: '🔍 Check Another Picture',
    home: 'Home'
  },
  hi: {
    appName: 'स्कैम सेंट्री',
    tagline: 'आपका ऑन-डिवाइस स्कैम डिटेक्टर',
    scanScreenshot: 'स्क्रीनशॉट स्कैन करें',
    chooseGallery: 'गैलरी से चुनें',
    scanQr: 'QR कोड स्कैन करें',
    recentScans: 'हाल के स्कैन',
    noRecentScans: 'कोई हालिया स्कैन नहीं मिला।',
    readingImage: 'छवि पढ़ी जा रही है...',
    analyzingPatterns: 'पैटर्न का विश्लेषण हो रहा है...',
    generatingExplanation: 'स्पष्टीकरण उत्पन्न हो रहा है...',
    cancel: 'रद्द करें',
    tryAgain: 'पुनः प्रयास करें',
    processingError: 'प्रसंस्करण के दौरान एक त्रुटि हुई।',
    safe: 'सुरक्षित',
    caution: 'सावधानी',
    danger: 'खतरा',
    knownPattern: 'ज्ञात स्कैम पैटर्न',
    listen: 'सुनें',
    askFamily: '🛡️ मेरे परिवार से पूछें',
    scanAnother: '🔍 दूसरा स्कैन करें',
    looksSafe: 'यह सुरक्षित लग रहा है।',
    beforeYouPay: 'भुगतान करने से पहले',
    recipient: 'प्राप्तकर्ता का नाम',
    upiId: 'UPI आईडी',
    amount: 'राशि',
    confirmPayment: 'भुगतान की पुष्टि करें',
    cancelPayment: 'रद्द करें',
    settings: 'सेटिंग्स',
    language: 'भाषा',
    seniorMode: 'वरिष्ठ-अनुकूल मोड',
    trustedContact: 'विश्वसनीय संपर्क',
    name: 'नाम',
    phone: 'फ़ोन',
    save: 'सहेजें',
    clearHistory: 'स्कैन इतिहास साफ़ करें',
    about: 'स्कैम सेंट्री v1.0 — सभी प्रसंस्करण आपके डिवाइस पर होता है। आपका डेटा कभी भी आपके फोन से नहीं जाता है।',
    privacy: 'गोपनीयता जानकारी: आपका सभी डेटा IndexedDB में स्थानीय रूप से संग्रहीत है।',
    receivingShared: 'साझा सामग्री प्राप्त हो रही है...',

    // Senior variants (Hindi)
    scanScreenshotSenior: 'घोटालों के लिए एक स्क्रीनशॉट की जाँच करें',
    scanQrSenior: 'QR कोड की जाँच करें',
    readingImageSenior: 'आपकी तस्वीर देख रहे हैं...',
    analyzingPatternsSenior: 'खतरे के संकेतों की जाँच कर रहे हैं...',
    generatingExplanationSenior: 'हम जो पाए उसे लिख रहे हैं...',
    askFamilySenior: '🛡️ मदद के लिए परिवार के सदस्य से पूछें',
    scanAnotherSenior: '🔍 एक और तस्वीर की जाँच करें',
    home: 'होम'
  },
  ta: {
    appName: 'ஸ்கேம் சென்ட்ரி',
    tagline: 'உங்கள் ஆன்-டிவைஸ் ஸ்கேம் டிடெக்டர்',
    scanScreenshot: 'ஸ்கிரீன்ஷாட்டை ஸ்கேன் செய்',
    chooseGallery: 'கேலரியில் இருந்து தேர்ந்தெடு',
    scanQr: 'QR குறியீட்டை ஸ்கேன் செய்',
    recentScans: 'சமீபத்திய ஸ்கேன்கள்',
    noRecentScans: 'சமீபத்திய ஸ்கேன்கள் எதுவும் காணப்படவில்லை.',
    readingImage: 'படத்தைப் படிக்கிறது...',
    analyzingPatterns: 'வடிவங்களை பகுப்பாய்வு செய்கிறது...',
    generatingExplanation: 'விளக்கத்தை உருவாக்குகிறது...',
    cancel: 'ரத்து செய்',
    tryAgain: 'மீண்டும் முயற்சி செய்',
    processingError: 'செயலாக்கத்தின் போது பிழை ஏற்பட்டது.',
    safe: 'பாதுகாப்பானது',
    caution: 'எச்சரிக்கை',
    danger: 'ஆபத்து',
    knownPattern: 'அறியப்பட்ட மோசடி முறை',
    listen: 'கேள்',
    askFamily: '🛡️ என் குடும்பத்தினரிடம் கேள்',
    scanAnother: '🔍 மற்றொன்றை ஸ்கேன் செய்',
    looksSafe: 'இது பாதுகாப்பானது போல் தெரிகிறது.',
    beforeYouPay: 'நீங்கள் செலுத்துவதற்கு முன்',
    recipient: 'பெறுநர் பெயர்',
    upiId: 'UPI ஐடி',
    amount: 'தொகை',
    confirmPayment: 'கட்டணத்தை உறுதிப்படுத்து',
    cancelPayment: 'ரத்து செய்',
    settings: 'அமைப்புகள்',
    language: 'மொழி',
    seniorMode: 'முதியோர் நட்பு முறை',
    trustedContact: 'நம்பகமான தொடர்பு',
    name: 'பெயர்',
    phone: 'தொலைபேசி',
    save: 'சேமி',
    clearHistory: 'ஸ்கேன் வரலாற்றை அழி',
    about: 'ஸ்கேம் சென்ட்ரி v1.0 — அனைத்து செயலாக்கமும் உங்கள் சாதனத்தில் நடக்கிறது. உங்கள் தரவு உங்கள் தொலைபேசியை விட்டு வெளியேறாது.',
    privacy: 'தனியுரிமைத் தகவல்: உங்கள் தரவுகள் அனைத்தும் உள்நாட்டில் IndexedDB இல் சேமிக்கப்பட்டுள்ளன.',
    receivingShared: 'பகிரப்பட்ட உள்ளடக்கத்தைப் பெறுகிறது...',

    // Senior variants (Tamil)
    scanScreenshotSenior: 'மோசடிகளுக்கு ஒரு ஸ்கிரீன்ஷாட்டைச் சரிபார்க்கவும்',
    scanQrSenior: 'QR குறியீட்டைச் சரிபார்க்கவும்',
    readingImageSenior: 'உங்கள் படத்தைப் பார்க்கிறோம்...',
    analyzingPatternsSenior: 'ஆபத்து அறிகுறிகளைச் சரிபார்க்கிறோம்...',
    generatingExplanationSenior: 'நாங்கள் கண்டுபிடித்ததை எழுதுகிறோம்...',
    askFamilySenior: '🛡️ உதவிக்கு ஒரு குடும்ப உறுப்பினரிடம் கேளுங்கள்',
    scanAnotherSenior: '🔍 மற்றொரு படத்தைச் சரிபார்க்கவும்',
    home: 'முகப்பு'
  }
};

export function getStrings(lang: string, seniorMode: boolean): LocalizedStrings {
  const languageStrings = strings[lang] || strings['en'];
  
  if (!seniorMode) {
    return languageStrings;
  }

  // Override standard strings with senior variants where available
  return {
    ...languageStrings,
    scanScreenshot: languageStrings.scanScreenshotSenior,
    scanQr: languageStrings.scanQrSenior,
    readingImage: languageStrings.readingImageSenior,
    analyzingPatterns: languageStrings.analyzingPatternsSenior,
    generatingExplanation: languageStrings.generatingExplanationSenior,
    askFamily: languageStrings.askFamilySenior,
    scanAnother: languageStrings.scanAnotherSenior,
  };
}

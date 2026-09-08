import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSettings } from '../contexts/SeniorFriendlyContext';
import { getStrings } from '../i18n/strings';
import { getRecentScans, deleteScan } from '../services/scamDna';
import { QRScanner } from '../components/QRScanner';
import { ConfirmModal } from '../components/ConfirmModal';
import { parseUPIIntent } from '../services/qrDecoder';
import { analyzeContent } from '../engine/signalEngine';
import type { ScanRecord } from '../engine/types';

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const { language, isSeniorFriendly } = useAppSettings();
  const t = getStrings(language, isSeniorFriendly);
  const [recentScans, setRecentScans] = useState<ScanRecord[]>([]);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const fetchScans = async () => {
    try {
      const scans = await getRecentScans(5);
      setRecentScans(scans);
    } catch (error) {
      console.error("Failed to load recent scans", error);
    }
  };

  useEffect(() => {
    fetchScans();

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
      }
    }
  };

  const onImageCaptured = (file: File) => {
    navigate('/processing', { state: { imageFile: file } });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImageCaptured(file);
    }
  };

  const handleQRDetected = (data: string) => {
    setShowQRScanner(false);
    const upiData = parseUPIIntent(data);
    if (upiData) {
      const result = analyzeContent({ text: data, contentType: 'qr', qrData: upiData });
      navigate('/qr-result', { state: { qrData: upiData, engineResult: result } });
    } else {
      const result = analyzeContent({ text: data, contentType: 'qr' });
      navigate('/result', { state: { engineResult: result, explanation: `QR code content: ${data}` } });
    }
  };

  const handleDeleteScan = async () => {
    if (!confirmDelete) return;
    await deleteScan(confirmDelete);
    setConfirmDelete(null);
    await fetchScans();
  };

  if (showQRScanner) {
    return <QRScanner onQRDetected={handleQRDetected} onClose={() => setShowQRScanner(false)} />;
  }

  return (
    <div className="flex flex-col flex-1 p-4 text-white min-h-screen pb-20 relative z-10 max-w-md mx-auto w-full">
      {deferredPrompt && (
        <div className="bg-gradient-to-r from-blue-500 to-violet-500 text-white p-3 rounded-xl mb-4 flex justify-between items-center shadow-lg shadow-blue-500/25">
          <span className={isSeniorFriendly ? "text-lg font-bold" : "text-sm"}>Install Scam Sentry for offline use</span>
          <button onClick={handleInstallClick} className="bg-white/20 hover:bg-white/30 backdrop-blur-md text-white px-5 py-2.5 rounded-lg font-semibold min-w-[44px] min-h-[44px] transition-all">
            Install
          </button>
        </div>
      )}

      <div className="flex flex-col items-center justify-center py-6">
        <div className="relative">
          <div className="absolute inset-0 bg-blue-500/30 blur-2xl rounded-full animate-pulse"></div>
          <svg className="w-14 h-14 relative z-10 drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]" viewBox="0 0 100 100">
            <defs>
              <linearGradient id="shieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{stopColor:'#3b82f6',stopOpacity:1}} />
                <stop offset="100%" style={{stopColor:'#8b5cf6',stopOpacity:1}} />
              </linearGradient>
            </defs>
            <path d="M50 8 L85 25 L85 50 Q85 75 50 92 Q15 75 15 50 L15 25 Z" fill="url(#shieldGrad)" />
            <polyline points="35,52 45,62 65,38" fill="none" stroke="white" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <h1 className={`font-bold text-center mt-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-violet-400 ${isSeniorFriendly ? 'text-4xl' : 'text-3xl'}`}>{t.appName}</h1>
        <p className={`text-slate-400 mt-2 ${isSeniorFriendly ? 'text-xl' : 'text-base'}`}>{t.tagline}</p>
      </div>

      <input type="file" ref={cameraInputRef} accept="image/*" capture="environment" className="hidden" onChange={handleFileChange} />
      <input type="file" ref={galleryInputRef} accept="image/*" className="hidden" onChange={handleFileChange} />

      <div className="grid grid-cols-1 gap-3 mb-8">
        <button
          onClick={() => cameraInputRef.current?.click()}
          className="bg-white/5 backdrop-blur-xl border border-white/10 hover:border-blue-500/50 rounded-xl p-4 flex items-center justify-center shadow-lg cursor-pointer min-h-[44px] hover:shadow-blue-500/20 transition-all duration-300 group"
        >
          <span className="text-2xl mr-3 group-hover:scale-110 transition-transform">📸</span>
          <span className={`font-semibold text-blue-400 group-hover:text-blue-300 transition-colors ${isSeniorFriendly ? 'text-2xl' : 'text-lg'}`}>{t.scanScreenshot}</span>
        </button>

        <button
          onClick={() => galleryInputRef.current?.click()}
          className="bg-white/5 backdrop-blur-xl border border-white/10 hover:border-violet-500/50 rounded-xl p-4 flex items-center justify-center shadow-lg cursor-pointer min-h-[44px] hover:shadow-violet-500/20 transition-all duration-300 group"
        >
          <span className="text-2xl mr-3 group-hover:scale-110 transition-transform">🖼️</span>
          <span className={`font-semibold text-white group-hover:text-violet-200 transition-colors ${isSeniorFriendly ? 'text-xl' : 'text-base'}`}>{t.chooseGallery}</span>
        </button>

        <button
          onClick={() => setShowQRScanner(true)}
          className="bg-white/5 backdrop-blur-xl border border-white/10 hover:border-blue-500/50 rounded-xl p-4 flex items-center justify-center shadow-lg cursor-pointer min-h-[44px] hover:shadow-blue-500/20 transition-all duration-300 group"
        >
          <span className="text-2xl mr-3 group-hover:scale-110 transition-transform">📱</span>
          <span className={`font-semibold text-white group-hover:text-blue-200 transition-colors ${isSeniorFriendly ? 'text-xl' : 'text-base'}`}>{t.scanQr}</span>
        </button>
      </div>

      <div className="flex-1">
        <h2 className={`font-bold mb-4 text-white ${isSeniorFriendly ? 'text-2xl' : 'text-xl'}`}>{t.recentScans}</h2>
        {recentScans.length === 0 ? (
          <p className="text-slate-400 bg-white/5 backdrop-blur-md rounded-xl p-4 text-center border border-white/10">{t.noRecentScans}</p>
        ) : (
          <div className="space-y-3">
            {recentScans.map((scan) => (
              <div key={scan.id} className="bg-white/5 backdrop-blur-xl p-3 rounded-xl shadow-sm border border-white/10 flex items-center gap-3 min-h-[44px] hover:bg-white/10 transition-colors">
                <div className="flex-1 min-w-0">
                  <p className={`font-medium text-white truncate ${isSeniorFriendly ? 'text-lg' : 'text-sm'}`}>{scan.summary}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{new Date(scan.timestamp).toLocaleDateString()}</p>
                </div>
                <div className={`px-2.5 py-1 rounded-lg text-xs font-bold text-white shrink-0 ${
                  scan.riskLevel === 'safe' ? 'bg-emerald-500/80' : 
                  scan.riskLevel === 'caution' ? 'bg-amber-500/80' : 'bg-red-500/80'
                }`}>
                  {scan.riskLevel === 'safe' ? t.safe : scan.riskLevel === 'caution' ? t.caution : t.danger}
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); setConfirmDelete(scan.id); }}
                  className="p-1.5 rounded-lg hover:bg-red-500/20 transition-colors shrink-0 group"
                  aria-label="Delete scan"
                >
                  <svg className="w-4 h-4 text-slate-500 group-hover:text-red-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <ConfirmModal
        isOpen={confirmDelete !== null}
        title="Delete Scan"
        message="Are you sure you want to delete this scan from your history? This action cannot be undone."
        confirmLabel="Delete"
        cancelLabel="Keep"
        variant="danger"
        onConfirm={handleDeleteScan}
        onCancel={() => setConfirmDelete(null)}
      />
    </div>
  );
};

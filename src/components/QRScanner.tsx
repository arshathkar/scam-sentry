import React, { useEffect, useRef, useState } from 'react';
import jsQR from 'jsqr';

interface QRScannerProps {
  onQRDetected: (data: string) => void;
  onClose: () => void;
}

export const QRScanner: React.FC<QRScannerProps> = ({ onQRDetected, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let stream: MediaStream | null = null;
    let isActive = true;

    const startCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' }
        });
        
        if (videoRef.current && isActive) {
          videoRef.current.srcObject = stream;
          videoRef.current.setAttribute('playsinline', 'true');
          videoRef.current.play();
          requestAnimationFrame(tick);
        }
      } catch (err) {
        console.error('Camera access error:', err);
        setError('Unable to access the camera. Please check permissions.');
      }
    };

    const tick = () => {
      if (!isActive) return;

      if (videoRef.current && videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA) {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        
        if (canvas) {
          canvas.height = video.videoHeight;
          canvas.width = video.videoWidth;
          const context = canvas.getContext('2d', { willReadFrequently: true });
          
          if (context) {
            context.drawImage(video, 0, 0, canvas.width, canvas.height);
            const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
            
            if ('BarcodeDetector' in window) {
              const barcodeDetector = new (window as any).BarcodeDetector({ formats: ['qr_code'] });
              barcodeDetector.detect(canvas)
                .then((barcodes: any[]) => {
                  if (barcodes.length > 0) {
                    onQRDetected(barcodes[0].rawValue);
                    isActive = false;
                  }
                })
                .catch(() => fallbackJsQR(imageData));
            } else {
              fallbackJsQR(imageData);
            }
          }
        }
      }
      
      if (isActive) {
        animationFrameRef.current = requestAnimationFrame(tick);
      }
    };

    const fallbackJsQR = (imageData: ImageData) => {
      const code = jsQR(imageData.data, imageData.width, imageData.height, {
        inversionAttempts: 'dontInvert',
      });
      if (code && isActive) {
        onQRDetected(code.data);
        isActive = false;
      }
    };

    startCamera();

    return () => {
      isActive = false;
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [onQRDetected]);

  return (
    <div className="fixed inset-0 z-50 bg-[#0F172A] flex flex-col">
      {/* Header controls */}
      <div className="absolute top-0 inset-x-0 z-20 flex justify-end p-6">
        <button 
          onClick={onClose}
          className="p-3 bg-white/10 text-white rounded-xl hover:bg-white/20 hover:scale-[1.05] border border-white/20 backdrop-blur-xl shadow-lg shadow-blue-500/10 transition-all duration-300 min-w-[48px] min-h-[48px] flex items-center justify-center group"
          aria-label="Close scanner"
        >
          <svg className="w-6 h-6 group-hover:text-red-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="relative flex-1 overflow-hidden flex items-center justify-center bg-black/50">
        {error ? (
          <div className="p-6 bg-white/5 border border-white/10 backdrop-blur-xl rounded-2xl m-4 text-center max-w-sm shadow-xl shadow-red-500/10">
            <p className="text-[#ef4444] font-bold mb-3 drop-shadow-sm">Camera Error</p>
            <p className="text-slate-400">{error}</p>
          </div>
        ) : (
          <>
            <video 
              ref={videoRef} 
              className="absolute inset-0 w-full h-full object-cover opacity-80"
              muted 
            />
            <canvas ref={canvasRef} className="hidden" />
            
            {/* Overlay */}
            <div className="absolute inset-0 z-10 box-border border-[60px] md:border-[100px] border-[#0F172A]/80 backdrop-blur-[2px]">
              {/* Scan region */}
              <div className="relative w-full h-full shadow-[0_0_30px_rgba(59,130,246,0.3)]">
                {/* Animated scan line */}
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-blue-500 shadow-[0_0_15px_#3b82f6] animate-scan-line z-20" />
                
                {/* Corner markers - Glowing Cyan/Blue */}
                <div className="absolute top-0 left-0 w-10 h-10 border-t-4 border-l-4 border-blue-500 shadow-[-4px_-4px_10px_rgba(59,130,246,0.4)] -mt-1 -ml-1 rounded-tl-lg"></div>
                <div className="absolute top-0 right-0 w-10 h-10 border-t-4 border-r-4 border-blue-500 shadow-[4px_-4px_10px_rgba(59,130,246,0.4)] -mt-1 -mr-1 rounded-tr-lg"></div>
                <div className="absolute bottom-0 left-0 w-10 h-10 border-b-4 border-l-4 border-blue-500 shadow-[-4px_4px_10px_rgba(59,130,246,0.4)] -mb-1 -ml-1 rounded-bl-lg"></div>
                <div className="absolute bottom-0 right-0 w-10 h-10 border-b-4 border-r-4 border-blue-500 shadow-[4px_4px_10px_rgba(59,130,246,0.4)] -mb-1 -mr-1 rounded-br-lg"></div>
              </div>
            </div>

            <div className="absolute bottom-20 inset-x-0 z-20 flex justify-center">
              <div className="bg-white/10 text-white px-8 py-4 rounded-xl border border-white/20 font-bold backdrop-blur-xl shadow-lg shadow-blue-500/20 animate-pulse tracking-wide">
                Scanning QR Code...
              </div>
            </div>
          </>
        )}
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes scan {
          0% { top: 0%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
        .animate-scan-line {
          animation: scan 2.5s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }
      `}} />
    </div>
  );
};

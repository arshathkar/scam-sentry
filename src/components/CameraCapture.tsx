import React, { useRef, useState, useCallback, DragEvent } from 'react';

interface CameraCaptureProps {
  onImageCaptured: (file: File) => void;
}

export const CameraCapture: React.FC<CameraCaptureProps> = ({ onImageCaptured }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const cameraInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) return;
    setSelectedFile(file);
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) handleFile(file);
    event.target.value = ''; // Reset input
  };

  const handleDrop = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  }, []);

  const handleDragOver = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const clearSelection = () => {
    setSelectedFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
  };

  const confirmSelection = () => {
    if (selectedFile) onImageCaptured(selectedFile);
  };

  if (previewUrl) {
    return (
      <div className="flex flex-col items-center w-full space-y-4 animate-in fade-in zoom-in duration-300">
        <div className="relative w-full max-w-sm overflow-hidden rounded-xl shadow-lg shadow-blue-500/20 border border-white/20 bg-white/5 backdrop-blur-xl p-2">
          <img src={previewUrl} alt="Preview" className="w-full h-auto object-contain max-h-[60vh] rounded-lg" />
        </div>
        <div className="flex w-full max-w-sm gap-3 px-3">
          <button
            onClick={clearSelection}
            className="flex-1 py-2 px-4 rounded-lg font-bold text-sm text-white bg-white/5 border border-white/20 hover:bg-white/10 hover:border-white/30 backdrop-blur-xl transition-all duration-300 hover:scale-[1.02] min-h-[40px]"
          >
            Cancel
          </button>
          <button
            onClick={confirmSelection}
            className="flex-1 py-2 px-4 rounded-lg font-bold text-sm text-white bg-gradient-to-r from-blue-500 to-violet-500 hover:from-blue-400 hover:to-violet-400 shadow-md shadow-blue-500/30 transition-all duration-300 hover:scale-[1.02] min-h-[40px] border border-blue-400/30"
          >
            Scan This
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-sm mx-auto flex flex-col gap-3 px-3">
      <input
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        ref={cameraInputRef}
        onChange={handleInputChange}
      />
      <input
        type="file"
        accept="image/*"
        className="hidden"
        ref={galleryInputRef}
        onChange={handleInputChange}
      />

      <div 
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-xl transition-all duration-300 backdrop-blur-xl
          ${isDragging 
            ? 'border-blue-500 bg-blue-500/10 shadow-[0_0_30px_rgba(59,130,246,0.2)] scale-[1.02]' 
            : 'border-white/20 bg-white/5 hover:bg-white/10 hover:border-white/30'}
        `}
      >
        <button
          onClick={() => cameraInputRef.current?.click()}
          className="w-full flex items-center justify-center gap-2.5 py-2 px-4 mb-3 rounded-lg font-bold text-sm text-white bg-gradient-to-r from-blue-500 to-violet-500 hover:from-blue-400 hover:to-violet-400 shadow-md shadow-blue-500/25 transition-all duration-300 hover:scale-[1.02] min-h-[44px] border border-blue-400/30 group"
        >
          <svg className="w-5 h-5 group-hover:animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          Take Photo
        </button>

        <div className="flex items-center w-full mb-3 opacity-50">
          <div className="flex-1 border-t border-white/20"></div>
          <span className="px-3 text-white text-xs font-semibold tracking-wider">OR</span>
          <div className="flex-1 border-t border-white/20"></div>
        </div>

        <button
          onClick={() => galleryInputRef.current?.click()}
          className="w-full flex items-center justify-center gap-2.5 py-2 px-4 rounded-lg font-bold text-sm text-white bg-white/5 border border-white/20 hover:bg-white/10 hover:border-white/40 shadow-sm transition-all duration-300 hover:scale-[1.02] min-h-[44px]"
        >
          <svg className="w-5 h-5 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          Choose from Gallery
        </button>
        
        <p className="hidden md:block mt-4 text-xs text-slate-400 text-center font-medium">
          Or drag and drop an image here
        </p>
      </div>
    </div>
  );
};

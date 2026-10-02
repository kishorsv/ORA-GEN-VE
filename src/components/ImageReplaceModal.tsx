import React, { useState, useRef } from 'react';
import { X, Upload, Image as ImageIcon, RotateCcw, Check, Sparkles, Link } from 'lucide-react';

interface ImageReplaceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyImage: (img: HTMLImageElement | null) => Promise<void>;
  currentImage: HTMLImageElement | null;
}

export const ImageReplaceModal: React.FC<ImageReplaceModalProps> = ({
  isOpen,
  onClose,
  onApplyImage,
  currentImage,
}) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentImage?.src || null);
  const [imageUrlInput, setImageUrlInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [rebuildProgress, setRebuildProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setPreviewUrl(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUrlLoad = () => {
    if (imageUrlInput.trim()) {
      setPreviewUrl(imageUrlInput.trim());
    }
  };

  const handleApply = async () => {
    if (!previewUrl) return;

    setIsProcessing(true);
    setStatusMessage('Loading high-resolution asset...');
    setRebuildProgress(5);

    try {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = previewUrl;

      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject(new Error('Failed to load image asset'));
      });

      setStatusMessage('Re-rendering 240 canvas sequence frames with 3D perspective...');
      await onApplyImage(img);

      setRebuildProgress(100);
      setStatusMessage('240 frames successfully compiled!');
      setTimeout(() => {
        setIsProcessing(false);
        onClose();
      }, 500);
    } catch (err) {
      console.error(err);
      setStatusMessage('Error processing image. Please check the file or URL.');
      setIsProcessing(false);
    }
  };

  const handleResetToDefault = async () => {
    setIsProcessing(true);
    setStatusMessage('Restoring procedural Atelier ORA Calibre 900...');
    setRebuildProgress(20);

    await onApplyImage(null);
    setPreviewUrl(null);
    setImageUrlInput('');
    setRebuildProgress(100);

    setTimeout(() => {
      setIsProcessing(false);
      onClose();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#171817]/95 flex items-center justify-center p-4 md:p-8 backdrop-blur-none">
      <div className="hairline-border bg-[#141514] w-full max-w-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between p-6 border-b border-[#3c3b3a]">
          <div className="space-y-1">
            <div className="text-xs uppercase tracking-[0.2em] text-[#d4af37] font-mono">
              Atelier Asset Ingestion
            </div>
            <h2 className="text-xl font-semibold text-[#d8d8d4] font-display">
              REPLACE TIMEPIECE IMAGE
            </h2>
          </div>
          <button
            onClick={onClose}
            disabled={isProcessing}
            className="p-2 border border-[#3c3b3a] text-[#8d8d89] hover:text-[#d8d8d4] transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 md:p-8 space-y-6 overflow-y-auto max-h-[75vh]">
          <p className="text-xs text-[#8d8d89] leading-relaxed">
            Provide any watch image (PNG, JPG, or WebP). The engine will automatically generate the 240-frame 3D perspective rotation, lighting sweeps, and macro zoom sequence for your timepiece.
          </p>

          {/* Upload & URL Input Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* File Upload Box */}
            <div
              onClick={() => fileInputRef.current?.click()}
              className="p-6 hairline-border border-dashed hover:border-[#d4af37] bg-[#191a19] flex flex-col items-center justify-center gap-3 cursor-pointer text-center group transition-colors"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              <div className="w-10 h-10 rounded-full border border-[#3c3b3a] group-hover:border-[#d4af37] flex items-center justify-center text-[#8d8d89] group-hover:text-[#d4af37] transition-colors">
                <Upload className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <div className="text-xs font-semibold text-[#d8d8d4]">Upload Local Image</div>
                <div className="text-[11px] text-[#6d6f6f] font-mono">Click or drag & drop PNG/JPG/WebP</div>
              </div>
            </div>

            {/* Direct Image URL Input */}
            <div className="p-6 hairline-border bg-[#191a19] flex flex-col justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-[#d8d8d4]">
                  <Link className="w-3.5 h-3.5 text-[#d4af37]" />
                  <span>Image URL</span>
                </div>
                <div className="text-[11px] text-[#6d6f6f] font-mono">Paste link to online watch photo</div>
              </div>
              <div className="flex gap-2">
                <input
                  type="url"
                  placeholder="https://.../watch.png"
                  value={imageUrlInput}
                  onChange={(e) => setImageUrlInput(e.target.value)}
                  className="flex-1 bg-[#141514] border border-[#3c3b3a] focus:border-[#d4af37] px-3 py-1.5 text-xs text-[#d8d8d4] font-mono outline-none"
                />
                <button
                  type="button"
                  onClick={handleUrlLoad}
                  className="px-3 py-1.5 bg-[#252625] border border-[#3c3b3a] text-xs font-mono text-[#d8d8d4] hover:text-[#d4af37] transition-colors cursor-pointer"
                >
                  Load
                </button>
              </div>
            </div>
          </div>

          {/* Asset Preview Box */}
          {previewUrl && (
            <div className="p-4 hairline-border bg-[#161716] space-y-3">
              <div className="flex items-center justify-between text-xs font-mono text-[#6d6f6f]">
                <span className="text-[#d8d8d4] flex items-center gap-1.5">
                  <ImageIcon className="w-3.5 h-3.5 text-[#d4af37]" />
                  <span>PREVIEW ASSET</span>
                </span>
                <button
                  onClick={() => setPreviewUrl(null)}
                  className="text-[#8d8d89] hover:text-[#d8d8d4] transition-colors"
                >
                  Clear
                </button>
              </div>

              <div className="w-full h-56 bg-[#111211] border border-[#252625] flex items-center justify-center p-4 overflow-hidden relative">
                <img
                  src={previewUrl}
                  alt="Custom watch preview"
                  className="max-h-full max-w-full object-contain select-none"
                />
                <div className="absolute bottom-2 right-2 px-2 py-0.5 bg-[#141514]/90 border border-[#3c3b3a] text-[10px] font-mono text-[#8d8d89]">
                  Transparent or dark backdrop recommended
                </div>
              </div>
            </div>
          )}

          {/* Progress Indicator when rebuilding frames */}
          {isProcessing && (
            <div className="p-4 hairline-border bg-[#191a19] space-y-3">
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-[#d4af37] animate-pulse">{statusMessage}</span>
                <span className="text-[#d8d8d4] tabular-nums">{rebuildProgress}%</span>
              </div>
              <div className="w-full h-1 bg-[#252625] border border-[#3c3b3a] overflow-hidden">
                <div
                  className="h-full bg-[#d4af37] transition-all duration-150"
                  style={{ width: `${rebuildProgress}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Actions */}
        <div className="p-6 border-t border-[#3c3b3a] bg-[#191a19] flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            onClick={handleResetToDefault}
            disabled={isProcessing}
            className="w-full sm:w-auto py-2.5 px-4 text-xs font-mono uppercase tracking-wider text-[#8d8d89] hover:text-[#d8d8d4] border border-[#3c3b3a] hover:border-[#585a5a] transition-colors cursor-pointer flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset to Calibre 900</span>
          </button>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={onClose}
              disabled={isProcessing}
              className="flex-1 sm:flex-none py-2.5 px-5 text-xs font-mono uppercase tracking-wider text-[#8d8d89] hover:text-[#d8d8d4] border border-[#3c3b3a] transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleApply}
              disabled={!previewUrl || isProcessing}
              className="flex-1 sm:flex-none py-2.5 px-6 text-xs font-semibold uppercase tracking-wider bg-[#d4af37] text-[#171817] hover:bg-[#e4bf47] disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>Compile 240 Frames</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

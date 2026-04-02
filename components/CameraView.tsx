
import React, { useRef, useState, useCallback, useEffect, forwardRef, useImperativeHandle } from 'react';
import { RefreshCw, X, Image as ImageIcon, Layers, ChevronRight, AlertTriangle, Settings, Info } from 'lucide-react';
import { ScannerMode } from '../types';

interface CameraViewProps {
  mode: ScannerMode;
  subModeLabel?: string;
  onCapture: (imageSrc: string, isBatch: boolean) => void;
  onClose: () => void;
  onBatchComplete: () => void;
  batchCount: number;
  initialIsBatchMode?: boolean;
}

export interface CameraHandle {
    triggerCapture: () => void;
    toggleBatchMode: () => void;
    finishBatch: () => void;
}

const getInstructions = (mode: ScannerMode, subMode?: string): string => {
    const sub = subMode ? subMode.toLowerCase() : '';

    switch (mode) {
        case ScannerMode.HEALTH:
            if (sub.includes('face')) return "Center your face in good lighting. Remove glasses if possible.";
            if (sub.includes('tongue')) return "Stick out your tongue comfortably. Avoid shadows.";
            if (sub.includes('nail')) return "Place hand flat or hold fingers together clearly.";
            if (sub.includes('posture')) return "Full body shot from head to toe. Stand naturally.";
            if (sub.includes('eye')) return "Close-up of the eye. Look straight ahead.";
            return "Ensure the subject is well-lit and centered.";
        
        case ScannerMode.FOOD:
            if (sub.includes('label') || sub.includes('nutrition')) return "Scan the Nutrition Facts label clearly.";
            if (sub.includes('safety')) return "Close-up of food surface or expiration date.";
            return "Center the food item or meal on the plate.";

        case ScannerMode.DISEASE:
            if (sub.includes('skin')) return "Focus clearly on the rash, mole, or lesion.";
            return "Focus on the specific symptom or area of concern.";

        case ScannerMode.SHOPPING:
            return "Scan the product, price tag, or barcode.";

        case ScannerMode.FINANCE:
            if (sub.includes('vehicle') || sub.includes('car')) return "Capture the full vehicle (3/4 angle is best).";
            if (sub.includes('document')) return "Align edges of the document vertically.";
            return "Center the item or asset clearly.";
            
        case ScannerMode.STOCK:
            if (sub.includes('chart')) return "Focus on the candlestick chart and pattern.";
            if (sub.includes('ticker')) return "Scan the stock symbol or financial news.";
            if (sub.includes('earnings')) return "Scan an earnings calendar or report.";
            if (sub.includes('insider')) return "Scan insider trading data or news.";
            if (sub.includes('dividend')) return "Scan dividend yield info or ticker.";
            if (sub.includes('economics')) return "Scan economic calendar or data release.";
            return "Scan the stock chart, ticker, or portfolio screen.";

        case ScannerMode.BEAUTY:
            if (sub.includes('hair')) return "Frame your face and hair completely.";
            if (sub.includes('skin')) return "Close-up of skin area. Avoid harsh shadows.";
            return "Center the subject.";

        case ScannerMode.PLANT:
            return "Focus on the leaves or flower for best identification.";

        case ScannerMode.PETS:
            return "Get a clear shot of your pet's face or body.";

        case ScannerMode.DOCUMENT:
            return "Align document edges. Ensure text is legible.";

        case ScannerMode.PRIVACY:
            if (sub.includes('mirror')) return "Place fingernail against the mirror surface.";
            if (sub.includes('wifi')) return "Scan a list of available networks or router.";
            return "Scan the suspicious object (detector, clock, vent).";

        case ScannerMode.WINE:
            return "Center the wine label clearly.";
        
        case ScannerMode.FASHION:
            return "Capture the full outfit or specific garment.";

        case ScannerMode.ENVIRONMENT:
            if (sub.includes('recycle')) return "Scan the item or recycling symbol.";
            return "Capture the landscape or environment.";

        case ScannerMode.SLEEP:
            if (sub.includes('face') || sub.includes('fatigue')) return "Center your face. Remove glasses.";
            return "Scan your bedroom or sleeping area.";

        case ScannerMode.POSTURE:
            if (sub.includes('desk')) return "Side profile of your entire desk setup.";
            if (sub.includes('standing')) return "Full body side profile view.";
            return "Capture the body or workspace clearly.";

        case ScannerMode.GEMSTONE:
            return "Ensure good lighting. Clean the stone and hold it still.";

        default:
            return "Center the subject in the frame.";
    }
};

export const CameraView = forwardRef<CameraHandle, CameraViewProps>(({ 
  mode, 
  subModeLabel,
  onCapture, 
  onClose, 
  onBatchComplete,
  batchCount,
  initialIsBatchMode = false
}, ref) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');
  const [error, setError] = useState<string | null>(null);
  const [permissionDenied, setPermissionDenied] = useState(false);
  const [isBatchMode, setIsBatchMode] = useState(initialIsBatchMode);
  const [lastCapture, setLastCapture] = useState<string | null>(null);

  const startCamera = useCallback(async () => {
    try {
      // Stop any existing streams first
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }

      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("Camera API is not supported in this browser or context.");
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: facingMode,
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setError(null);
        setPermissionDenied(false);
      }
    } catch (err: any) {
      if (err.name === 'OverconstrainedError' && facingMode === 'environment') {
        // Fallback to any camera if environment camera is not found
        try {
          const fallbackStream = await navigator.mediaDevices.getUserMedia({
            video: {
              width: { ideal: 1920 },
              height: { ideal: 1080 }
            }
          });
          if (videoRef.current) {
            videoRef.current.srcObject = fallbackStream;
            setError(null);
            setPermissionDenied(false);
          }
          return;
        } catch (fallbackErr: any) {
          err = fallbackErr; // Process the fallback error instead
        }
      }

      console.error("Camera Error:", err);
      let errorMessage = "Unable to access camera.";
      let isPermError = false;

      if (
        err.name === 'NotAllowedError' || 
        err.name === 'PermissionDeniedError' || 
        err.message === 'Permission denied' ||
        err.message?.toLowerCase().includes('permission denied') ||
        err.message?.toLowerCase().includes('not allowed')
      ) {
          errorMessage = "Camera access was denied.";
          isPermError = true;
      } else if (err.name === 'NotFoundError' || err.message?.toLowerCase().includes('not found')) {
          errorMessage = "No camera device found.";
      } else if (err.name === 'NotReadableError' || err.message?.toLowerCase().includes('not readable')) {
          errorMessage = "Camera is in use by another app.";
      } else {
          errorMessage = err.message || "Unknown camera error.";
      }
      
      setError(errorMessage);
      setPermissionDenied(isPermError);
    }
  }, [facingMode]);

  useEffect(() => {
    startCamera();
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [startCamera]);

  const triggerCapture = useCallback(() => {
    if (videoRef.current && canvasRef.current) {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
  
        if (context) {
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          context.drawImage(video, 0, 0, canvas.width, canvas.height);
          const imageSrc = canvas.toDataURL('image/jpeg', 0.85);
          
          setLastCapture(imageSrc);
          onCapture(imageSrc, isBatchMode);
        }
      }
  }, [isBatchMode, onCapture]);

  // Expose methods to parent
  useImperativeHandle(ref, () => ({
    triggerCapture,
    toggleBatchMode: () => setIsBatchMode(prev => !prev),
    finishBatch: onBatchComplete
  }));

  const toggleCamera = () => {
    setFacingMode(prev => prev === 'user' ? 'environment' : 'user');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onCapture(reader.result as string, isBatchMode);
      };
      reader.readAsDataURL(file);
    }
  };

  const instructions = getInstructions(mode, subModeLabel);

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-10">
        <button onClick={onClose} className="p-3 rounded-full bg-black/40 text-white backdrop-blur-xl hover:bg-black/60 border border-white/5 transition-all">
          <X size={24} />
        </button>
        
        <div className="flex items-center gap-3">
            <span className="text-[#CCFF00] text-xs font-bold tracking-widest bg-black/60 px-4 py-2 rounded-full border border-[#CCFF00]/20 backdrop-blur-xl uppercase shadow-lg">
            {mode}
            </span>
            <button 
                onClick={() => setIsBatchMode(!isBatchMode)}
                className={`p-2 rounded-full backdrop-blur-xl transition-all border shadow-lg ${isBatchMode ? 'bg-[#CCFF00] border-[#CCFF00] text-black' : 'bg-black/40 border-white/10 text-slate-300'}`}
                title="Batch Mode"
            >
                <Layers size={20} />
            </button>
        </div>

        <button onClick={toggleCamera} className="p-3 rounded-full bg-black/40 text-white backdrop-blur-xl hover:bg-black/60 border border-white/5 transition-all">
          <RefreshCw size={24} />
        </button>
      </div>

      {/* Viewfinder */}
      <div className="flex-1 relative bg-zinc-950 flex items-center justify-center overflow-hidden">
        {error ? (
          <div className="text-white text-center p-8 max-w-md mx-auto z-20 flex flex-col items-center">
            <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mb-6 border border-red-500/20">
                <AlertTriangle size={40} className="text-red-500" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">{permissionDenied ? "Camera Access Denied" : "Camera Error"}</h3>
            <p className="mb-8 text-sm text-zinc-400 leading-relaxed">
                {permissionDenied 
                    ? "ScanZeo needs camera access to function. Please enable permissions in your browser settings." 
                    : error}
            </p>
            
            {permissionDenied && (
                <div className="bg-zinc-900/50 p-4 rounded-xl border border-white/10 text-xs text-left text-zinc-400 mb-8 w-full">
                    <strong className="block text-white mb-2 flex items-center gap-2"><Settings size={14} /> How to enable:</strong>
                    <ol className="list-decimal pl-4 space-y-1">
                        <li>Tap the <strong>Lock icon</strong> or <strong>Settings</strong> in your address bar.</li>
                        <li>Find <strong>Camera</strong> permissions.</li>
                        <li>Select <strong>Allow</strong> or <strong>Ask</strong>.</li>
                        <li>Refresh the page.</li>
                    </ol>
                </div>
            )}

            <div className="flex flex-col gap-3 w-full">
                <button 
                    onClick={startCamera}
                    className="bg-white text-black px-8 py-3 rounded-full font-bold hover:bg-zinc-200 transition-all"
                >
                    Try Again
                </button>
                <label className="bg-[#CCFF00] text-black px-8 py-3 rounded-full cursor-pointer hover:bg-[#b3e600] transition-all font-bold tracking-wide shadow-[0_0_20px_rgba(204,255,0,0.3)] flex items-center justify-center gap-2">
                    <ImageIcon size={18} /> Upload Image Instead
                    <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
                </label>
            </div>
          </div>
        ) : (
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline 
            className="w-full h-full object-cover opacity-80" 
            onLoadedMetadata={() => videoRef.current?.play()}
          />
        )}
        <canvas ref={canvasRef} className="hidden" />
        
        {/* Active Instruction Overlay */}
        {!error && (
            <div className="absolute top-24 left-0 right-0 z-20 flex justify-center px-4">
                <div className="bg-black/40 backdrop-blur-md border border-white/10 px-6 py-3 rounded-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-500 shadow-xl max-w-sm text-center">
                    <Info size={18} className="text-[#CCFF00] flex-shrink-0 animate-pulse" />
                    <p className="text-white text-sm font-medium tracking-wide leading-tight">{instructions}</p>
                </div>
            </div>
        )}
        
        {/* Reticle / Focus Area - Volt Green */}
        {!error && (
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                <div className={`transition-all duration-500 relative rounded-[2rem] shadow-[0_0_0_9999px_rgba(9,9,11,0.5)] ${isBatchMode ? 'w-64 h-64 border-2 border-dashed border-[#CCFF00]/60' : 'w-72 h-72 md:w-96 md:h-96 border border-[#CCFF00]/20'}`}>
                     <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-[#CCFF00] -mt-1 -ml-1 rounded-tl-xl shadow-[0_0_10px_#CCFF00]"></div>
                     <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-[#CCFF00] -mt-1 -mr-1 rounded-tr-xl shadow-[0_0_10px_#CCFF00]"></div>
                     <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-[#CCFF00] -mb-1 -ml-1 rounded-bl-xl shadow-[0_0_10px_#CCFF00]"></div>
                     <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-[#CCFF00] -mb-1 -mr-1 rounded-br-xl shadow-[0_0_10px_#CCFF00]"></div>
                     
                     <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-1">
                         <span className="text-[#CCFF00] text-xs font-bold tracking-[0.2em] uppercase whitespace-nowrap drop-shadow-md bg-black/40 px-3 py-1 rounded-full backdrop-blur-sm">
                             {isBatchMode ? `Batch Scan (${batchCount})` : (subModeLabel || 'AI Focus')}
                         </span>
                     </div>
                </div>
            </div>
        )}

        {/* Batch Feedback Animation */}
        {isBatchMode && batchCount > 0 && lastCapture && (
            <div className="absolute bottom-32 right-8 w-20 h-20 rounded-xl border-2 border-[#CCFF00] overflow-hidden shadow-[0_0_20px_rgba(204,255,0,0.3)] transform rotate-6 transition-all animate-in zoom-in slide-in-from-bottom duration-300">
                <img src={lastCapture} className="w-full h-full object-cover" alt="last scan" />
                <div className="absolute inset-0 bg-black/20"></div>
                <div className="absolute -top-1 -right-1 w-7 h-7 bg-[#CCFF00] rounded-full flex items-center justify-center text-[10px] font-bold text-black border border-white shadow-lg">
                    {batchCount}
                </div>
            </div>
        )}
      </div>

      {/* Controls */}
      <div className="h-40 bg-zinc-950 flex items-center justify-center gap-12 px-8 pb-8 relative border-t border-white/5">
         <label className="flex flex-col items-center gap-2 cursor-pointer group">
            <div className="p-4 rounded-full bg-zinc-900 text-slate-300 border border-white/5 group-hover:border-[#CCFF00]/50 group-hover:text-[#CCFF00] transition-all">
                <ImageIcon size={24} />
            </div>
            <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
            <span className="text-[10px] font-bold text-slate-500 tracking-wider group-hover:text-[#CCFF00]">GALLERY</span>
        </label>

        <button 
          onClick={triggerCapture}
          disabled={!!error}
          className={`w-20 h-20 rounded-full border-[3px] flex items-center justify-center transform active:scale-90 transition-all shadow-[0_0_30px_rgba(204,255,0,0.1)] hover:shadow-[0_0_50px_rgba(204,255,0,0.3)] ${isBatchMode ? 'border-[#CCFF00]' : 'border-white/20'} ${error ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <div className={`w-16 h-16 rounded-full bg-[#CCFF00] transition-colors duration-300`}></div>
        </button>

         {/* Right Control */}
         <div className="flex flex-col items-center gap-2 w-16">
             {isBatchMode && batchCount > 0 ? (
                 <button 
                    onClick={onBatchComplete}
                    className="flex flex-col items-center gap-2 group animate-in fade-in"
                 >
                     <div className="p-4 rounded-full bg-[#CCFF00] text-black group-hover:scale-110 transition-all shadow-[0_0_20px_rgba(204,255,0,0.4)] border border-white/10">
                         <ChevronRight size={24} />
                     </div>
                     <span className="text-[10px] font-bold text-[#CCFF00] tracking-wider">DONE</span>
                 </button>
             ) : (
                 <div className="w-16 h-16 opacity-0"></div>
             )}
         </div>
      </div>
    </div>
  );
});

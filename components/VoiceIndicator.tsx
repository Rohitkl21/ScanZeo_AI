
import React from 'react';
import { Mic, MicOff, Volume2 } from 'lucide-react';

interface VoiceIndicatorProps {
  isListening: boolean;
  transcript: string;
  toggleListening: () => void;
  showButton?: boolean;
  isSpeaking?: boolean;
}

export const VoiceIndicator: React.FC<VoiceIndicatorProps> = ({ isListening, transcript, toggleListening, showButton = true, isSpeaking = false }) => {
  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col items-end pointer-events-none">
      <div className="flex items-center gap-2 pointer-events-auto">
         {transcript && (
            <div className="bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg border border-[#CCFF00]/30 animate-in fade-in slide-in-from-right duration-300">
                <span className="text-[#CCFF00] text-xs font-mono font-bold">"{transcript}"</span>
            </div>
         )}

         {isSpeaking && (
             <div className="bg-blue-600/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-blue-400 flex items-center gap-2 animate-pulse">
                <Volume2 size={14} className="text-white" />
                <span className="text-white text-xs font-bold">Speaking...</span>
             </div>
         )}
         
         {showButton && (
            <button 
                onClick={toggleListening}
                className={`p-3 rounded-full transition-all duration-300 shadow-lg border backdrop-blur-md ${
                    isListening 
                    ? 'bg-[#CCFF00]/10 border-[#CCFF00] text-[#CCFF00] shadow-[0_0_15px_rgba(204,255,0,0.3)]' 
                    : 'bg-zinc-900/50 border-white/10 text-zinc-500'
                }`}
            >
                {isListening ? (
                    <div className="relative">
                        <Mic size={20} />
                        <span className="absolute -top-1 -right-1 w-2 h-2 bg-[#CCFF00] rounded-full animate-ping"></span>
                    </div>
                ) : (
                    <MicOff size={20} />
                )}
            </button>
         )}
      </div>
    </div>
  );
};

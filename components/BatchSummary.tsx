import React from 'react';
import { ArrowLeft, Loader2, CheckCircle2, AlertCircle, ChevronRight, Share2 } from 'lucide-react';
import { ScanResult, ScannerMode } from '../types';

interface BatchSummaryProps {
  results: ScanResult[];
  onSelectResult: (result: ScanResult) => void;
  onBack: () => void;
  mode: ScannerMode;
}

export const BatchSummary: React.FC<BatchSummaryProps> = ({ results, onSelectResult, onBack, mode }) => {
  const completedCount = results.filter(r => r.status === 'complete').length;
  const isAllComplete = completedCount === results.length;

  return (
    <div className="min-h-screen flex flex-col w-full bg-zinc-950">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-zinc-900/80 backdrop-blur-xl p-4 border-b border-white/5 flex items-center justify-between shadow-lg">
        <button onClick={onBack} className="p-2 rounded-full hover:bg-white/10 text-white transition-colors">
          <ArrowLeft size={20} />
        </button>
        <div className="text-center">
            <h2 className="font-bold text-[#CCFF00] text-lg uppercase tracking-wide">{mode} Batch</h2>
            <p className="text-xs text-zinc-400 font-mono mt-1">{completedCount} / {results.length} processed</p>
        </div>
        <button className="p-2 rounded-full hover:bg-white/10 text-white transition-colors">
           <Share2 size={20} />
        </button>
      </div>

      {/* Grid */}
      <div className="flex-1 p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 max-w-7xl mx-auto w-full pb-32">
        {results.map((item, index) => (
          <div 
            key={item.id}
            onClick={() => onSelectResult(item)}
            className="bg-zinc-900/50 backdrop-blur-md rounded-xl overflow-hidden border border-white/10 hover:border-[#CCFF00]/50 hover:bg-zinc-800 transition-all cursor-pointer group flex md:flex-col h-28 md:h-auto shadow-lg"
          >
            {/* Image Thumbnail */}
            <div className="w-28 md:w-full md:h-52 relative flex-shrink-0 bg-black/50">
                <img 
                    src={item.imageUrl} 
                    alt={`Scan ${index + 1}`} 
                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity group-hover:scale-105 duration-500" 
                />
                
                {/* Status Overlay */}
                <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-transparent transition-colors">
                    {item.status === 'analyzing' && (
                        <div className="bg-black/60 rounded-full p-2 backdrop-blur-md border border-[#CCFF00]/30 shadow-xl">
                            <Loader2 className="w-6 h-6 text-[#CCFF00] animate-spin" />
                        </div>
                    )}
                    {item.status === 'error' && (
                        <div className="bg-red-500/80 rounded-full p-2 backdrop-blur-md border border-white/10 shadow-xl">
                            <AlertCircle className="w-6 h-6 text-white" />
                        </div>
                    )}
                </div>
                
                {/* Index Badge */}
                <div className="absolute top-2 left-2 w-7 h-7 rounded-lg bg-[#CCFF00] text-black text-xs flex items-center justify-center font-bold shadow-lg">
                    {index + 1}
                </div>
            </div>

            {/* Content Summary */}
            <div className="flex-1 p-4 flex flex-col justify-between overflow-hidden relative">
                <div>
                    <div className="flex justify-between items-start mb-2">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                            item.status === 'complete' ? 'bg-[#CCFF00]/10 border-[#CCFF00]/20 text-[#CCFF00]' :
                            item.status === 'analyzing' ? 'bg-white/5 border-white/10 text-white' :
                            'bg-red-900/50 border-red-800 text-red-400'
                        }`}>
                            {item.status === 'complete' ? 'READY' : item.status === 'analyzing' ? 'PROCESSING' : 'ERROR'}
                        </span>
                        <span className="text-[10px] text-zinc-500 font-mono">
                             {new Date(item.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </span>
                    </div>
                    <p className="text-sm text-zinc-300 line-clamp-2 leading-relaxed font-light">
                        {item.status === 'analyzing' ? 'Analyzing content...' : item.text}
                    </p>
                </div>
                
                {item.status === 'complete' && (
                    <div className="flex items-center text-[#CCFF00] text-xs font-bold mt-2 group-hover:translate-x-1 transition-transform uppercase tracking-wider">
                        View Details <ChevronRight size={14} className="ml-1" />
                    </div>
                )}
            </div>
          </div>
        ))}
      </div>
      
      {/* Bottom Actions if needed */}
      {isAllComplete && (
          <div className="p-4 bg-zinc-900/90 backdrop-blur-xl border-t border-white/5 text-center fixed bottom-0 left-0 right-0 z-10">
              <p className="text-zinc-400 text-sm mb-2 font-light">All items processed successfully. Tap to view.</p>
          </div>
      )}
    </div>
  );
};
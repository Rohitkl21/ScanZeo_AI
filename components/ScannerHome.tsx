
import React, { useState } from 'react';
import { ScannerMode, ScannerConfig, SUPPORTED_LANGUAGES, SCANNER_SUBMODES, User } from '../types';
import { Heart, ShoppingBag, MapPin, GraduationCap, Sparkles, Dog, ScanLine, Globe, Check, X, Utensils, Stethoscope, Mic, MicOff, CircleDollarSign, Lock, Film, CloudSun, Flower2, FileText, Shirt, Wine, Moon, ChevronRight, ArrowLeft, Target, LogOut, User as UserIcon, Scale, LineChart, Diamond } from 'lucide-react';

interface ScannerHomeProps {
  onSelectMode: (mode: ScannerMode, subMode?: string) => void;
  currentLanguage: string;
  onSelectLanguage: (code: string) => void;
  isVoiceListening: boolean;
  onToggleVoice: () => void;
  user: User | null;
  onLogout: () => void;

  setView: (view: any) => void;
}

const SCANNERS: ScannerConfig[] = [
  {
    mode: ScannerMode.HEALTH,
    label: "Body Health",
    description: "Scan face, tongue, nails & vitals.",
    icon: "Heart",
    color: "from-pink-500 to-rose-600",
    systemPrompt: ""
  },
  {
    mode: ScannerMode.POSTURE,
    label: "Posture & Ergo",
    description: "Desk setup, spine & alignment check.",
    icon: "User",
    color: "from-orange-500 to-amber-600",
    systemPrompt: ""
  },
  {
    mode: ScannerMode.DISEASE,
    label: "Disease & Diagnosis",
    description: "Symptom check & medical triage.",
    icon: "Stethoscope",
    color: "from-red-600 to-rose-800",
    systemPrompt: ""
  },
  {
    mode: ScannerMode.PETS,
    label: "Animal Health",
    description: "Vet check for dogs, cats & more.",
    icon: "Dog",
    color: "from-orange-400 to-red-500",
    systemPrompt: ""
  },
  {
    mode: ScannerMode.SLEEP,
    label: "Sleep Quality",
    description: "Fatigue check & bedroom analysis.",
    icon: "Moon",
    color: "from-indigo-400 to-blue-600",
    systemPrompt: ""
  },
  {
    mode: ScannerMode.PLANT,
    label: "Plant Care",
    description: "ID, disease check & water schedule.",
    icon: "Flower2",
    color: "from-green-400 to-emerald-600",
    systemPrompt: ""
  },
  {
    mode: ScannerMode.FOOD,
    label: "Nutrition & Safety",
    description: "Macros, safety score, & additives.",
    icon: "Utensils",
    color: "from-lime-400 to-green-600",
    systemPrompt: ""
  },
  {
    mode: ScannerMode.ENVIRONMENT,
    label: "Environmental",
    description: "Recycling, air quality & nature.",
    icon: "CloudSun",
    color: "from-teal-400 to-cyan-600",
    systemPrompt: ""
  },
  {
    mode: ScannerMode.FINANCE,
    label: "Assets & Net Worth",
    description: "Appraise cars, items & financial health.",
    icon: "CircleDollarSign",
    color: "from-yellow-400 to-amber-600",
    systemPrompt: ""
  },
  {
    mode: ScannerMode.STOCK,
    label: "Stock Market",
    description: "Analyze charts, trends & tickers.",
    icon: "LineChart",
    color: "from-cyan-500 to-blue-600",
    systemPrompt: ""
  },
  {
    mode: ScannerMode.GEMSTONE,
    label: "Gem Identification",
    description: "Identify stones, crystals & value.",
    icon: "Diamond",
    color: "from-cyan-400 to-blue-500",
    systemPrompt: ""
  },
  {
    mode: ScannerMode.SHOPPING,
    label: "Smart Shopper",
    description: "Price check, value & deals.",
    icon: "ShoppingBag",
    color: "from-blue-400 to-indigo-600",
    systemPrompt: ""
  },
  {
    mode: ScannerMode.ENTERTAINMENT,
    label: "Entertainment",
    description: "Movies, books, games & ratings.",
    icon: "Film",
    color: "from-fuchsia-500 to-purple-600",
    systemPrompt: ""
  },
  {
    mode: ScannerMode.BEAUTY,
    label: "Style & Beauty",
    description: "Hairstyles, skin & makeup.",
    icon: "Sparkles",
    color: "from-purple-400 to-fuchsia-600",
    systemPrompt: ""
  },
  {
    mode: ScannerMode.FASHION,
    label: "Fashion & Outfit",
    description: "Styling advice, matching & brands.",
    icon: "Shirt",
    color: "from-violet-400 to-fuchsia-500",
    systemPrompt: ""
  },
  {
    mode: ScannerMode.TRAVEL,
    label: "Travel Safe",
    description: "Location safety, safe havens & tips.",
    icon: "MapPin",
    color: "from-emerald-400 to-teal-600",
    systemPrompt: ""
  },
  {
    mode: ScannerMode.STUDY,
    label: "Study & Homework",
    description: "Math solver, science & writing help.",
    icon: "GraduationCap",
    color: "from-amber-400 to-orange-600",
    systemPrompt: ""
  },
  {
    mode: ScannerMode.DOCUMENT,
    label: "Document Scanner",
    description: "Summarize, translate & explain.",
    icon: "FileText",
    color: "from-slate-500 to-zinc-600",
    systemPrompt: ""
  },
  {
    mode: ScannerMode.WINE,
    label: "Wine & Beverage",
    description: "Ratings, pairings & tasting notes.",
    icon: "Wine",
    color: "from-red-800 to-rose-900",
    systemPrompt: ""
  },
  {
    mode: ScannerMode.PRIVACY,
    label: "Privacy & Security",
    description: "Hidden cameras, mirrors & WiFi.",
    icon: "Lock",
    color: "from-indigo-500 to-violet-700",
    systemPrompt: ""
  },
  {
    mode: ScannerMode.GENERAL,
    label: "Quick Info",
    description: "Identify objects, plants & landmarks.",
    icon: "ScanLine",
    color: "from-slate-400 to-slate-600",
    systemPrompt: ""
  }
];

const IconMap: Record<string, React.FC<any>> = {
  Heart, ShoppingBag, MapPin, GraduationCap, Sparkles, Dog, ScanLine, Utensils, Stethoscope, CircleDollarSign, Lock, Film, CloudSun, Flower2, FileText, Shirt, Wine, Moon, Scale, User: UserIcon, LineChart, Diamond
};

export const ScannerHome: React.FC<ScannerHomeProps> = ({ 
  onSelectMode, 
  currentLanguage, 
  onSelectLanguage,
  isVoiceListening,
  onToggleVoice,
  user,
  onLogout,
  setView
}) => {
  const [showLangModal, setShowLangModal] = useState(false);
  const [selectedScanner, setSelectedScanner] = useState<ScannerConfig | null>(null);

  const activeLangLabel = SUPPORTED_LANGUAGES.find(l => l.code === currentLanguage)?.label || 'Auto';

  // Handle Main Card Click
  const handleCardClick = (scanner: ScannerConfig) => {
    setSelectedScanner(scanner);
  };

  // Handle Sub-Mode Click
  const handleSubModeClick = (subModeId: string, subModeLabel: string) => {
    if (selectedScanner) {
      onSelectMode(selectedScanner.mode, subModeLabel);
      setSelectedScanner(null);
    }
  };

  const SelectedIcon = selectedScanner ? IconMap[selectedScanner.icon] : null;

  return (
    <div className="p-4 pb-32 space-y-8 w-full max-w-7xl mx-auto relative min-h-screen">
      
      {/* Top Bar with Language, Voice, and User Profile */}
      <div className="flex justify-between items-center pt-2 relative z-20">
        <div className="flex items-center gap-3">
            <button 
                onClick={() => setShowLangModal(true)}
                className="flex items-center gap-2 px-3 py-2 rounded-full bg-zinc-900/50 border border-white/10 hover:border-[#CCFF00]/50 text-xs text-zinc-300 hover:text-[#CCFF00] transition-all backdrop-blur-md"
            >
                <Globe size={16} />
                <span>{activeLangLabel}</span>
            </button>

            <button 
                onClick={onToggleVoice}
                className={`p-2.5 rounded-full border transition-all backdrop-blur-md ${
                    isVoiceListening 
                    ? 'bg-[#CCFF00]/20 border-[#CCFF00] text-[#CCFF00] shadow-[0_0_15px_rgba(204,255,0,0.4)]' 
                    : 'bg-zinc-900/50 border-white/10 text-zinc-400 hover:text-[#CCFF00] hover:border-[#CCFF00]/50 hover:bg-white/5'
                }`}
                aria-label={isVoiceListening ? "Stop Voice Command" : "Start Voice Command"}
            >
                {isVoiceListening ? (
                    <div className="relative">
                    <Mic size={18} className="animate-pulse" />
                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-[#CCFF00] rounded-full animate-ping"></span>
                    </div>
                ) : (
                    <MicOff size={18} />
                )}
            </button>
        </div>
        <button
          onClick={() => setView('DASHBOARD')}
          className="px-3 py-2 rounded-full bg-zinc-900/50 border border-white/10 hover:border-[#CCFF00]/50 text-xs text-zinc-300 hover:text-[#CCFF00] transition-all backdrop-blur-md"
        >
          Dashboard
        </button>
        
        {/* User Profile / Logout */}
        {user && (
            <div className="flex items-center gap-3 bg-zinc-900/50 border border-white/10 p-1.5 rounded-full backdrop-blur-md">
                <div
                    onClick={() => setView('PROFILE')}
                    className="flex items-center gap-2 cursor-pointer"
                >    <div className="w-6 h-6 rounded-full bg-zinc-700 overflow-hidden flex items-center justify-center">
                        {user.avatar ? (
                            <img src={user.avatar} alt="avatar" className="w-full h-full object-cover" />
                        ) : (
                            <UserIcon size={14} className="text-zinc-400" />
                        )}
                    </div>
                    <span className="text-xs text-white font-medium max-w-[80px] truncate hidden md:block">{user.name}</span>
                </div>
                <button 
                    onClick={onLogout}
                    className="p-1.5 rounded-full bg-white/5 hover:bg-red-500/20 text-zinc-400 hover:text-red-400 transition-colors"
                    title="Logout"
                >
                    <LogOut size={14} />
                </button>
            </div>
        )}
      </div>

      <div className="text-center py-8 md:py-16 relative z-10">
        <div className="inline-block relative">
             <div className="absolute -inset-2 bg-[#CCFF00] rounded-lg blur opacity-20"></div>
             <h1 className="relative text-4xl md:text-6xl font-bold text-[#CCFF00] tracking-tight">
                ScanZeo AI
            </h1>
        </div>
        <p className="text-slate-400 mt-3 text-lg md:text-xl font-light tracking-wide">
            Your universal lens for <span className="text-[#CCFF00] font-normal">smarter</span> decisions.
        </p>
        <p className="text-zinc-500 mt-4 text-sm italic font-medium tracking-wide">
            "Everything has its price—except a <span className="text-[#CCFF00]">mother's</span> love."
        </p>
      </div>

      {/* Main Grid */}
      <div className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 transition-all duration-500 ${selectedScanner ? 'opacity-0 scale-95 pointer-events-none absolute inset-x-4 top-[300px]' : 'opacity-100 scale-100'}`}>
        {SCANNERS.map((scanner) => {
          const Icon = IconMap[scanner.icon];
          return (
            <button
              key={scanner.mode}
              onClick={() => handleCardClick(scanner)}
              className="relative group overflow-hidden rounded-2xl p-5 text-left transition-all duration-300
                         bg-zinc-900/50 backdrop-blur-md border border-white/10
                         hover:bg-zinc-800/80 hover:scale-[1.02] hover:border-[#CCFF00]/50 hover:shadow-[0_0_20px_rgba(204,255,0,0.1)]
                         flex flex-col justify-between min-h-[180px]"
            >
              <div className={`absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br ${scanner.color} rounded-full blur-3xl opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>

              <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${scanner.color} flex items-center justify-center mb-4 shadow-lg group-hover:shadow-xl transition-shadow relative z-10`}>
                <Icon size={28} className="text-white drop-shadow-md" />
              </div>
              
              <div className="relative z-10">
                <h3 className="text-lg font-semibold text-white tracking-wide group-hover:text-[#CCFF00] transition-colors">{scanner.label}</h3>
                <p className="text-xs text-zinc-400 mt-2 leading-relaxed font-light group-hover:text-zinc-300">
                  {scanner.description}
                </p>
              </div>
              
              <div className="absolute bottom-0 left-0 h-0.5 bg-[#CCFF00] w-0 group-hover:w-full transition-all duration-500 opacity-80"></div>
            </button>
          );
        })}
      </div>

      {/* Sub-Mode Selection Overlay */}
      {selectedScanner && (
        <div className="fixed inset-0 z-30 flex flex-col pt-32 px-4 bg-zinc-950/90 backdrop-blur-xl animate-in slide-in-from-bottom duration-300">
          <div className="max-w-4xl mx-auto w-full h-full overflow-y-auto pb-20 no-scrollbar">
            
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
              <button 
                onClick={() => setSelectedScanner(null)}
                className="p-3 rounded-full bg-zinc-900 border border-white/10 hover:border-white/30 text-white transition-all"
              >
                <ArrowLeft size={24} />
              </button>
              <div className="flex items-center gap-3">
                 <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${selectedScanner.color} flex items-center justify-center shadow-lg`}>
                    {SelectedIcon && <SelectedIcon size={24} className="text-white" />}
                 </div>
                 <div>
                    <h2 className="text-2xl font-bold text-white">{selectedScanner.label}</h2>
                    <p className="text-zinc-400 text-sm">Select specific analysis</p>
                 </div>
              </div>
            </div>

            {/* Sub-Mode Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {SCANNER_SUBMODES[selectedScanner.mode]?.map((sub) => (
                <button
                  key={sub.id}
                  onClick={() => handleSubModeClick(sub.id, sub.label)}
                  className="group flex items-center p-5 rounded-xl bg-zinc-900/50 border border-white/10 hover:border-[#CCFF00] hover:bg-zinc-800 transition-all text-left"
                >
                  <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mr-4 group-hover:bg-[#CCFF00]/20 group-hover:text-[#CCFF00] transition-colors text-zinc-400">
                    <Target size={20} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-white group-hover:text-[#CCFF00] transition-colors">{sub.label}</h3>
                    <p className="text-sm text-zinc-500 group-hover:text-zinc-300 transition-colors">{sub.description}</p>
                  </div>
                  <ChevronRight size={20} className="text-zinc-600 group-hover:text-[#CCFF00] group-hover:translate-x-1 transition-all" />
                </button>
              ))}
              
              {/* Default Option */}
              <button
                  onClick={() => handleSubModeClick('default', 'General Scan')}
                  className="group flex items-center p-5 rounded-xl bg-zinc-900/30 border border-white/5 hover:border-white/20 hover:bg-zinc-800 transition-all text-left border-dashed"
                >
                  <div className="w-12 h-12 rounded-full bg-transparent border border-zinc-700 flex items-center justify-center mr-4 group-hover:border-white text-zinc-600 group-hover:text-white">
                    <ScanLine size={20} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-zinc-400 group-hover:text-white transition-colors">General Analysis</h3>
                    <p className="text-sm text-zinc-600 group-hover:text-zinc-500 transition-colors">Standard full-scope scan</p>
                  </div>
                  <ChevronRight size={20} className="text-zinc-700 group-hover:text-white" />
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Language Modal */}
      {showLangModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-zinc-900 border border-white/10 rounded-2xl w-full max-w-2xl max-h-[80vh] flex flex-col shadow-2xl overflow-hidden relative">
            <div className="p-4 border-b border-white/10 flex justify-between items-center bg-zinc-900/50">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Globe size={18} className="text-[#CCFF00]" /> Select Output Language
              </h3>
              <button 
                onClick={() => setShowLangModal(false)}
                className="p-2 hover:bg-white/10 rounded-full text-zinc-400 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-4 overflow-y-auto grid grid-cols-2 md:grid-cols-3 gap-3">
              {SUPPORTED_LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => {
                    onSelectLanguage(lang.code);
                    setShowLangModal(false);
                  }}
                  className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                    currentLanguage === lang.code 
                      ? 'bg-[#CCFF00]/10 border-[#CCFF00] text-[#CCFF00]' 
                      : 'bg-zinc-800/50 border-white/5 text-zinc-300 hover:bg-zinc-800 hover:border-white/20'
                  }`}
                >
                  <div className="flex flex-col items-start">
                    <span className="text-sm font-medium">{lang.nativeName}</span>
                    <span className="text-[10px] text-zinc-500">{lang.label}</span>
                  </div>
                  {currentLanguage === lang.code && <Check size={16} />}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

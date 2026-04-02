
import React, { useState, useEffect, useRef } from 'react';
import { ScannerHome } from './components/ScannerHome';
import { CameraView, CameraHandle } from './components/CameraView';
import { ResultDisplay } from './components/ResultDisplay';
import { BatchSummary } from './components/BatchSummary';
import { VoiceIndicator } from './components/VoiceIndicator';
import { AuthScreen } from './components/AuthScreen';
import { analyzeImage } from './services/geminiService';
import { authService } from './services/authService';
import { useVoiceRecognition } from './hooks/useVoiceRecognition';
import { useVoiceAssistant } from './hooks/useVoiceAssistant';
import { ScannerMode, ViewState, ScanResult, GeoLocation, User } from './types';
import { History, Home, Loader2, ScanLine } from 'lucide-react';
import { Dashboard } from "./components/Dashboard";
import { supabase } from "./services/supabaseClient";
console.log("SUPABASE OBJECT:", supabase);

const testConnection = async () => {
  const { data, error } = await supabase.auth.getSession();
  console.log("SESSION TEST:", data, error);
};

testConnection();

export const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [view, setView] = useState<ViewState>('HOME');
  const [activeMode, setActiveMode] = useState<ScannerMode>(ScannerMode.GENERAL);
  const [activeSubMode, setActiveSubMode] = useState<string | undefined>(undefined);
  const [currentResult, setCurrentResult] = useState<ScanResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [location, setLocation] = useState<GeoLocation | undefined>(undefined);
  const [history, setHistory] = useState<ScanResult[]>([]);
  
  // Settings State
  const [language, setLanguage] = useState<string>('auto');
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  
  // Batch Mode State
  const [batchResults, setBatchResults] = useState<ScanResult[]>([]);

  // Ref for Camera Control
  const cameraRef = useRef<CameraHandle>(null);

  // Initialize Assistant Hook
  const { speak, stopSpeaking, isSpeaking } = useVoiceAssistant(voiceEnabled);

  // Check for existing session
  useEffect(() => {
  const checkSession = async () => {
    const sessionUser = await authService.getSession();
    if (sessionUser) {
      setUser(sessionUser);
    }
  };

  checkSession();
}, []);

  // Voice Command Handler
  const handleVoiceCommand = (transcript: string) => {
      if (!user) return; // Disable voice commands if not logged in

      const cmd = transcript.toLowerCase();
      
      // Global Navigation
      if (cmd.includes('home') || cmd.includes('go back')) {
          speak("Going home.");
          if (view === 'RESULT') {
               if (batchResults.length > 0) setView('BATCH_SUMMARY');
               else setView('HOME');
          }
          else if (view === 'BATCH_SUMMARY') setView('CAMERA');
          else if (view === 'CAMERA') setView('HOME');
      }
      if (cmd.includes('history')) {
        speak("Opening history.");
        setView('HISTORY');
      }

      // Mode Selection (Works from Home)
      if (view === 'HOME') {
          if (cmd.includes('health') || cmd.includes('body')) handleModeSelect(ScannerMode.HEALTH);
          if (cmd.includes('disease') || cmd.includes('diagnosis') || cmd.includes('symptom') || cmd.includes('checkup')) handleModeSelect(ScannerMode.DISEASE);
          if (cmd.includes('food') || cmd.includes('nutrition') || cmd.includes('calorie')) handleModeSelect(ScannerMode.FOOD);
          if (cmd.includes('finance') || cmd.includes('worth') || cmd.includes('value') || cmd.includes('appraise')) handleModeSelect(ScannerMode.FINANCE);
          if (cmd.includes('stock') || cmd.includes('market') || cmd.includes('chart') || cmd.includes('ticker')) handleModeSelect(ScannerMode.STOCK);
          if (cmd.includes('shopping') || cmd.includes('shopper')) handleModeSelect(ScannerMode.SHOPPING);
          if (cmd.includes('travel')) handleModeSelect(ScannerMode.TRAVEL);
          if (cmd.includes('study') || cmd.includes('homework')) handleModeSelect(ScannerMode.STUDY);
          if (cmd.includes('beauty') || cmd.includes('style')) handleModeSelect(ScannerMode.BEAUTY);
          if (cmd.includes('pet') || cmd.includes('dog') || cmd.includes('cat')) handleModeSelect(ScannerMode.PETS);
          if (cmd.includes('universal') || cmd.includes('general')) handleModeSelect(ScannerMode.GENERAL);
          if (cmd.includes('privacy') || cmd.includes('camera check')) handleModeSelect(ScannerMode.PRIVACY);
          if (cmd.includes('entertainment') || cmd.includes('movie') || cmd.includes('book') || cmd.includes('game')) handleModeSelect(ScannerMode.ENTERTAINMENT);
          if (cmd.includes('environment') || cmd.includes('recycle') || cmd.includes('nature') || cmd.includes('eco')) handleModeSelect(ScannerMode.ENVIRONMENT);
          if (cmd.includes('plant') || cmd.includes('garden') || cmd.includes('flower')) handleModeSelect(ScannerMode.PLANT);
          if (cmd.includes('document') || cmd.includes('translate') || cmd.includes('contract')) handleModeSelect(ScannerMode.DOCUMENT);
          if (cmd.includes('fashion') || cmd.includes('outfit') || cmd.includes('clothes')) handleModeSelect(ScannerMode.FASHION);
          if (cmd.includes('wine') || cmd.includes('alcohol') || cmd.includes('drink')) handleModeSelect(ScannerMode.WINE);
          if (cmd.includes('sleep') || cmd.includes('bedroom') || cmd.includes('insomnia')) handleModeSelect(ScannerMode.SLEEP);
          if (cmd.includes('posture') || cmd.includes('ergonomic') || cmd.includes('desk setup')) handleModeSelect(ScannerMode.POSTURE);
          if (cmd.includes('gemstone') || cmd.includes('crystal') || cmd.includes('diamond') || cmd.includes('jewel')) handleModeSelect(ScannerMode.GEMSTONE);
      }

      // Camera Controls
      if (view === 'CAMERA') {
          if (cmd.includes('capture') || cmd.includes('take') || cmd.includes('scan') || cmd.includes('shoot')) {
              speak("Capturing.");
              cameraRef.current?.triggerCapture();
          }
          
          if (cmd.includes('start batch') || cmd.includes('batch mode')) {
              speak("Starting batch mode.");
              cameraRef.current?.toggleBatchMode();
          }

          if (cmd.includes('finish') || cmd.includes('done') || cmd.includes('stop batch')) {
              speak("Finishing batch.");
              cameraRef.current?.finishBatch();
          }
      }

      // Assistant Controls
      if (cmd.includes('stop talking') || cmd.includes('quiet')) {
        stopSpeaking();
      }
  };

  // Initialize Voice Hook
  const { isListening, transcript, startListening, stopListening } = useVoiceRecognition(handleVoiceCommand);

  // Get location on mount
  useEffect(() => {
    if (navigator.geolocation && user) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        },
        (error) => console.log("Location access denied or error:", error),
        { enableHighAccuracy: false, timeout: 5000 }
      );
    }
  }, [user]);

  const handleModeSelect = (mode: ScannerMode, subMode?: string) => {
    speak(`Opening ${mode.toLowerCase().replace('_', ' ')} scanner.`);
    setActiveMode(mode);
    setActiveSubMode(subMode);
    setBatchResults([]); // Clear previous batch
    setView('CAMERA');
  };

  // Logic to process a single image and update the state
  const processImage = async (base64Data: string, resultId: string, mode: ScannerMode, subMode?: string) => {
    try {
      const analysis = await analyzeImage(base64Data, mode, language, location, subMode);
      
      const updatedResult: Partial<ScanResult> = {
        text: analysis.text,
        groundingMetadata: analysis.groundingMetadata,
        status: 'complete'
      };

      setHistory(prev => prev.map(item => item.id === resultId ? { ...item, ...updatedResult } : item));
      setBatchResults(prev => prev.map(item => item.id === resultId ? { ...item, ...updatedResult } : item));
      setCurrentResult(prev => prev && prev.id === resultId ? { ...prev, ...updatedResult } : prev);

    } catch (error) {
      console.error(error);
      const errorResult: Partial<ScanResult> = {
        text: "Failed to analyze image. Please try again.",
        status: 'error'
      };
       setHistory(prev => prev.map(item => item.id === resultId ? { ...item, ...errorResult } : item));
       setBatchResults(prev => prev.map(item => item.id === resultId ? { ...item, ...errorResult } : item));
    }
  };

  const handleCapture = async (imageSrc: string, isBatch: boolean = false) => {
    const newId = Date.now().toString() + Math.random().toString().slice(2, 6);
    const base64Data = imageSrc.split(',')[1];

    const newResult: ScanResult = {
      id: newId,
      mode: activeMode,
      subMode: activeSubMode,
      imageUrl: imageSrc,
      text: "Analyzing...",
      timestamp: Date.now(),
      status: 'analyzing'
    };

    setHistory(prev => [newResult, ...prev]);

    if (isBatch) {
      speak("Image captured. Processing in background.");
      setBatchResults(prev => [newResult, ...prev]);
      processImage(base64Data, newId, activeMode, activeSubMode);
    } else {
      speak("Image captured. Analyzing now.");
      setCurrentResult(newResult);
      setIsAnalyzing(true);
      
      try {
        const analysis = await analyzeImage(base64Data, activeMode, language, location, activeSubMode);
        
        await supabase.from("scan_results").insert([
          {
            user_id: user.id,
            result: analysis.text,
            image_url: imageSrc,
          },
        ]);
        const completedResult = {
             ...newResult,
             text: analysis.text,
             groundingMetadata: analysis.groundingMetadata,
             status: 'complete' as const
        };
        setCurrentResult(completedResult);
        setHistory(prev => prev.map(item => item.id === newId ? completedResult : item));
        
        setView('RESULT');
        
        // Auto-speak result summary
        const summary = analysis.text.split('\n').find(l => l.length > 50) || "Analysis complete.";
        speak(`Analysis complete. ${summary}`);

      } catch (e) {
         speak("Sorry, analysis failed.");
         alert("Analysis failed.");
      } finally {
        setIsAnalyzing(false);
      }
    }
  };

  // Auth Handling
  const handleLoginSuccess = (user: User) => {
      setUser(user);
      setView('HOME');
  };

  const handleLogout = () => {
      authService.logout();
      setUser(null);
      setHistory([]);
      setCurrentResult(null);
  };

  // Render Logic
  if (!user) {
      return <AuthScreen onLogin={handleLoginSuccess} />;
  }

  const renderContent = () => {
    if (isAnalyzing) {
      return (
        <div className="fixed inset-0 bg-zinc-950/80 backdrop-blur-xl z-50 flex flex-col items-center justify-center">
          <div className="relative">
             <div className="absolute inset-0 bg-[#CCFF00] blur-xl opacity-20 animate-pulse rounded-full"></div>
             <Loader2 className="w-16 h-16 text-[#CCFF00] animate-spin relative z-10" />
          </div>
          <h2 className="text-2xl font-bold text-[#CCFF00] tracking-widest mt-6 animate-pulse">ANALYZING</h2>
          <p className="text-zinc-400 mt-2 font-light">Consulting AI Models...</p>
          {activeSubMode && <span className="text-xs text-[#CCFF00] border border-[#CCFF00]/30 px-3 py-1 rounded-full mt-4">{activeSubMode}</span>}
        </div>
      );
    }

    switch (view) {
      case 'DASHBOARD':
       return (
        <div className="p-6">
         <h1 className="text-3xl text-[#CCFF00] font-bold mb-6">
          Dashboard
         </h1>

         <div className="grid grid-cols-2 gap-4">
          <div className="bg-zinc-900 p-4 rounded-xl">
           <p className="text-zinc-400">Total Scans</p>
           <p className="text-xl font-bold">{history.length}</p>
          </div>

          <div className="bg-zinc-900 p-4 rounded-xl">
           <p className="text-zinc-400">User</p>
           <p className="text-sm">{user?.email}</p>
          </div>
         </div>
        </div>
      );
      case 'PROFILE':
       return (
        <div className="p-6">
         <h1 className="text-3xl text-[#CCFF00] font-bold mb-6">
           Profile
         </h1>

         <div className="bg-zinc-900 p-4 rounded-xl">
          <p>Email: {user?.email}</p>

          <button
           onClick={handleLogout}
           className="mt-4 bg-red-500 px-4 py-2 rounded"
          >
           Logout
          </button>
        </div>
       </div>
      );
      case 'HOME':
        return (
          <ScannerHome 
            onSelectMode={handleModeSelect} 
            currentLanguage={language}
            onSelectLanguage={setLanguage}
            isVoiceListening={isListening}
            onToggleVoice={isListening ? stopListening : startListening}
            user={user}
            onLogout={handleLogout}
            setView={setView}
          />
        );
      case 'CAMERA':
        return (
          <CameraView 
            ref={cameraRef}
            mode={activeMode}
            subModeLabel={activeSubMode} 
            onCapture={handleCapture} 
            onClose={() => setView('HOME')}
            onBatchComplete={() => setView('BATCH_SUMMARY')}
            batchCount={batchResults.length}
            initialIsBatchMode={batchResults.length > 0}
          />
        );
      case 'RESULT':
        return currentResult ? (
          <ResultDisplay 
            result={currentResult} 
            onBack={() => {
                stopSpeaking();
                if (batchResults.length > 0) {
                    setView('BATCH_SUMMARY');
                } else {
                    setView('HOME');
                }
            }}
            isVoiceListening={isListening}
            onToggleVoice={isListening ? stopListening : startListening}
            isSpeaking={isSpeaking} // Pass speaking state to show visualizer
            onStopSpeaking={stopSpeaking}
          />
        ) : null;
      case 'BATCH_SUMMARY':
        return (
            <BatchSummary 
                results={batchResults}
                mode={activeMode}
                onSelectResult={(result) => {
                    setCurrentResult(result);
                    setView('RESULT');
                }}
                onBack={() => setView('CAMERA')} // Go back to camera to continue batch
            />
        );
      case 'HISTORY':
        return (
          <div className="p-4 pb-24 min-h-screen w-full max-w-7xl mx-auto">
             <h2 className="text-3xl font-bold text-[#CCFF00] mb-8">Scan History</h2>
             {history.length === 0 ? (
                 <div className="text-center text-zinc-500 mt-20 bg-zinc-900/50 p-8 rounded-2xl border border-white/5 backdrop-blur-md max-w-md mx-auto">
                    <History size={48} className="mx-auto mb-4 opacity-50" />
                    <p>No scans yet.</p>
                 </div>
             ) : (
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                     {history.map(item => (
                         <div 
                            key={item.id} 
                            onClick={() => { setCurrentResult(item); setBatchResults([]); setView('RESULT'); }} 
                            className="group flex bg-zinc-900/50 border border-white/10 hover:border-[#CCFF00]/50 hover:bg-zinc-800 backdrop-blur-md p-3 rounded-xl gap-4 cursor-pointer transition-all hover:scale-[1.01] hover:shadow-[0_0_15px_rgba(204,255,0,0.1)]"
                         >
                             <div className="w-20 h-20 rounded-lg overflow-hidden bg-black/30 border border-white/5 flex-shrink-0">
                                <img src={item.imageUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 opacity-80 group-hover:opacity-100" alt="history thumbnail" />
                             </div>
                             <div className="flex-1 overflow-hidden flex flex-col justify-center">
                                 <div className="flex justify-between items-center mb-1">
                                     <span className="text-[10px] font-bold text-[#CCFF00] tracking-wider px-2 py-0.5 rounded-full bg-[#CCFF00]/10 border border-[#CCFF00]/20">{item.mode}</span>
                                     <span className="text-[10px] text-zinc-500 font-mono">{new Date(item.timestamp).toLocaleDateString()}</span>
                                 </div>
                                 <p className="text-sm text-zinc-300 truncate leading-relaxed">
                                     {item.status === 'analyzing' ? 'Analyzing...' : item.text.substring(0, 60)}...
                                 </p>
                             </div>
                         </div>
                     ))}
                 </div>
             )}
          </div>
        );
      default:
        return (
            <ScannerHome 
                onSelectMode={handleModeSelect} 
                currentLanguage={language} 
                onSelectLanguage={setLanguage}
                isVoiceListening={isListening}
                onToggleVoice={isListening ? stopListening : startListening}
                user={user}
                onLogout={handleLogout}
            />
        );
    }
  };

  const showNav = view === 'HOME' || view === 'HISTORY';

  return (
    <div className="min-h-screen text-slate-50 w-full relative overflow-hidden flex flex-col bg-transparent">
      
      {/* Voice Indicator Overlay */}
      <VoiceIndicator 
        isListening={isListening} 
        transcript={transcript} 
        toggleListening={isListening ? stopListening : startListening}
        showButton={view !== 'HOME' && view !== 'RESULT'}
        isSpeaking={isSpeaking} // Pass Assistant state
      />

      {renderContent()}

      {showNav && (
        <nav className="fixed bottom-0 left-0 right-0 z-40 pb-safe">
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/80 to-transparent pointer-events-none h-32 -top-12"></div>
          
          <div className="relative mx-auto max-w-md px-6 pb-6">
              <div className="flex justify-around items-center bg-zinc-900/80 backdrop-blur-xl border border-white/10 rounded-full p-2 shadow-2xl shadow-black/80">
                <button 
                  onClick={() => setView('HOME')}
                  className={`flex flex-col items-center justify-center w-12 h-12 rounded-full transition-all ${view === 'HOME' ? 'text-[#CCFF00] bg-white/5 shadow-[0_0_15px_rgba(204,255,0,0.1)]' : 'text-zinc-500 hover:text-zinc-200 hover:bg-white/5'}`}
                >
                  <Home size={20} />
                </button>
                
                <button 
                  onClick={() => handleModeSelect(ScannerMode.GENERAL)}
                  className="relative -top-6 group"
                  aria-label="Quick Scan"
                >
                  <div className="absolute inset-0 bg-[#CCFF00] blur-lg opacity-40 group-hover:opacity-60 transition-opacity rounded-full"></div>
                  <div className="relative bg-[#CCFF00] p-4 rounded-full text-black shadow-xl hover:scale-105 transition-transform border border-white/20">
                     <ScanLine size={24} />
                  </div>
                </button>

                <button 
                  onClick={() => setView('HISTORY')}
                  className={`flex flex-col items-center justify-center w-12 h-12 rounded-full transition-all ${view === 'HISTORY' ? 'text-[#CCFF00] bg-white/5 shadow-[0_0_15px_rgba(204,255,0,0.1)]' : 'text-zinc-500 hover:text-zinc-200 hover:bg-white/5'}`}
                >
                  <History size={20} />
                </button>
              </div>
          </div>
        </nav>
      )}
    </div>
  );
};

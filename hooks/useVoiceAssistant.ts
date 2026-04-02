
import { useState, useCallback, useEffect, useRef } from 'react';

interface VoiceAssistantState {
  isSpeaking: boolean;
  speak: (text: string) => void;
  stopSpeaking: () => void;
  hasSpokenIntro: boolean;
}

export const useVoiceAssistant = (enabled: boolean = true): VoiceAssistantState => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const synth = window.speechSynthesis;
  const hasSpokenIntro = useRef(false);

  const speak = useCallback((text: string) => {
    if (!enabled || !synth) return;

    // Cancel existing speech
    synth.cancel();

    // Strip Markdown/Special chars for smoother speech
    const cleanText = text
      .replace(/[#*_`]/g, '') // Remove markdown chars
      .replace(/\|/g, ' ')    // Remove table pipes
      .replace(/\[.*?\]/g, '') // Remove [Links]
      .replace(/https?:\/\/\S+/g, '') // Remove URLs
      .substring(0, 300); // Limit length for summary to avoid droning on

    const utterance = new SpeechSynthesisUtterance(cleanText);
    
    // Select a pleasant voice (prefer Google or Microsoft English voices)
    const voices = synth.getVoices();
    const preferredVoice = voices.find(v => 
        (v.name.includes('Google') || v.name.includes('Microsoft')) && v.lang.includes('en')
    );
    
    if (preferredVoice) {
        utterance.voice = preferredVoice;
    }

    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    synth.speak(utterance);
  }, [enabled, synth]);

  const stopSpeaking = useCallback(() => {
    if (synth) {
      synth.cancel();
      setIsSpeaking(false);
    }
  }, [synth]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (synth) synth.cancel();
    };
  }, [synth]);

  return { 
    isSpeaking, 
    speak, 
    stopSpeaking,
    hasSpokenIntro: hasSpokenIntro.current 
  };
};

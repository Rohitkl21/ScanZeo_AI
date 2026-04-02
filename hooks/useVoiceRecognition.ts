import { useState, useEffect, useCallback, useRef } from 'react';

export interface VoiceRecognitionState {
  isListening: boolean;
  transcript: string;
  error: string | null;
  startListening: () => void;
  stopListening: () => void;
}

export const useVoiceRecognition = (onCommand: (command: string) => void): VoiceRecognitionState => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [recognition, setRecognition] = useState<any>(null);
  
  // Refs to track state and dependencies without triggering effect re-runs
  const isExplicitlyStopped = useRef(false);
  const onCommandRef = useRef(onCommand);

  // Update command ref whenever it changes so the listener always has the latest version
  useEffect(() => {
    onCommandRef.current = onCommand;
  }, [onCommand]);

  useEffect(() => {
    // Check browser support
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.continuous = true;
      recognitionInstance.interimResults = false;
      recognitionInstance.lang = 'en-US';

      recognitionInstance.onstart = () => {
        setIsListening(true);
        setError(null);
      };

      recognitionInstance.onend = () => {
        // If the user didn't stop it manually, try to restart (handling 'no-speech' timeouts)
        if (!isExplicitlyStopped.current) {
            try {
                recognitionInstance.start();
            } catch (e) {
                // Instance might be busy or already started, ignore
            }
        } else {
            setIsListening(false);
        }
      };

      recognitionInstance.onresult = (event: any) => {
        const lastResultIndex = event.results.length - 1;
        const text = event.results[lastResultIndex][0].transcript.trim();
        setTranscript(text);
        
        // Use ref to call latest function
        onCommandRef.current(text);
        
        // Clear transcript after a short delay for UI cleanliness
        setTimeout(() => setTranscript(''), 2000);
      };

      recognitionInstance.onerror = (event: any) => {
        // 'no-speech' is common (silence). Ignore it; onend will restart the service.
        if (event.error === 'no-speech') {
             return;
        }

        console.error("Speech Recognition Error:", event.error);
        if (event.error === 'not-allowed') {
             setError("Mic access denied");
             isExplicitlyStopped.current = true; // Stop forcing restart if permission denied
             setIsListening(false);
        } else {
             // For other errors, log them but don't necessarily kill the loop unless fatal
             setError(event.error);
             if (event.error === 'aborted') {
                 setIsListening(false);
             }
        }
      };

      setRecognition(recognitionInstance);
    } else {
      setError("Voice not supported");
    }
    // Empty dependency array ensures we only create the instance once
  }, []); 

  const startListening = useCallback(() => {
    if (recognition) {
      isExplicitlyStopped.current = false;
      try {
        recognition.start();
      } catch (e) {
        console.error("Start error:", e);
      }
    }
  }, [recognition]);

  const stopListening = useCallback(() => {
    if (recognition) {
      isExplicitlyStopped.current = true;
      try {
        recognition.stop();
      } catch(e) {
          console.error("Stop error:", e);
      }
      setIsListening(false);
    }
  }, [recognition]);

  return { isListening, transcript, error, startListening, stopListening };
};
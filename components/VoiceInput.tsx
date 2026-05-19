// components/VoiceInput.tsx
"use client";

import { useState, useEffect } from "react";

interface VoiceInputProps {
  onTranscript: (text: string) => void;
  disabled?: boolean;
}

export function VoiceInput({ onTranscript, disabled }: VoiceInputProps) {
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);
  const [supported, setSupported] = useState(true);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      setSupported(false);
      return;
    }
    
    const recognitionInstance = new SpeechRecognition();
    recognitionInstance.continuous = false;
    recognitionInstance.interimResults = false;
    recognitionInstance.lang = 'en-US';
    
    recognitionInstance.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      onTranscript(transcript);
      setIsListening(false);
    };
    
    recognitionInstance.onerror = () => {
      setIsListening(false);
    };
    
    recognitionInstance.onend = () => {
      setIsListening(false);
    };
    
    setRecognition(recognitionInstance);
  }, [onTranscript]);
  
  const startListening = () => {
    if (recognition && !disabled) {
      recognition.start();
      setIsListening(true);
    }
  };
  
  if (!supported) {
    return null;
  }
  
  return (
    <button
      onClick={startListening}
      disabled={disabled || isListening}
      className={`px-4 py-3 rounded-full transition-all duration-200 ${
        isListening 
          ? "bg-red-500 animate-pulse" 
          : "bg-purple-500 hover:bg-purple-600"
      } text-white`}
      title={isListening ? "Listening..." : "Click to speak"}
    >
      {isListening ? "🎤 Listening..." : "🎙️"}
    </button>
  );
}
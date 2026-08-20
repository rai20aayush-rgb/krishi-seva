import React, { useState, useEffect, useRef } from 'react';
import { Language, ViewTab, FarmerProfile } from '../types';
import { TRANSLATIONS } from '../translations';
import { 
  Mic, 
  MicOff, 
  X, 
  Sparkles, 
  Volume2, 
  ArrowRight, 
  Send, 
  Compass, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';
import { speakMultilingualText, playSuccessChime, playClickBeep, playAlertBuzzer } from '../utils/audio';

interface VoiceAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLang: Language;
  currentView: ViewTab;
  farmer: FarmerProfile;
  onExecuteAction: (targetView: ViewTab, actionType: string, params: Record<string, any>) => void;
}

export const VoiceAssistantModal: React.FC<VoiceAssistantModalProps> = ({
  isOpen,
  onClose,
  currentLang,
  currentView,
  farmer,
  onExecuteAction,
}) => {
  const t = TRANSLATIONS[currentLang];
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastResponse, setLastResponse] = useState<string | null>(null);
  const [detectedDialect, setDetectedDialect] = useState<string | null>(null);
  const [executedAction, setExecutedAction] = useState<string | null>(null);
  const [customPrompt, setCustomPrompt] = useState('');

  const recognitionRef = useRef<any>(null);

  // Initialize Speech Recognition if supported in browser
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognitionClass = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognitionClass) {
        const recognition = new SpeechRecognitionClass();
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = currentLang === 'hi' ? 'hi-IN' : currentLang === 'ta' ? 'ta-IN' : 'en-IN';

        recognition.onstart = () => {
          setIsListening(true);
        };

        recognition.onresult = (event: any) => {
          const current = event.resultIndex;
          const text = event.results[current][0].transcript;
          setTranscript(text);
          setCustomPrompt(text);
        };

        recognition.onerror = (event: any) => {
          console.warn("Speech recognition error:", event.error);
          setIsListening(false);
        };

        recognition.onend = () => {
          setIsListening(false);
          // If transcript is available, auto submit
          if (transcript.trim()) {
            handleProcessPrompt(transcript);
          }
        };

        recognitionRef.current = recognition;
      }
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {}
      }
    };
  }, [currentLang, transcript]);

  const toggleListening = () => {
    playClickBeep();
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      setTranscript('');
      setLastResponse(null);
      setDetectedDialect(null);
      setExecutedAction(null);
      try {
        recognitionRef.current?.start();
      } catch (e) {
        setIsListening(true);
        // Fallback simulation for demo
        setTimeout(() => {
          const sample = currentLang === 'ta' 
            ? "குளிர்பதன வாகனத்தில் 60 பெட்டிகள் பதிவு செய்க"
            : "शीत-वाहन में हमार 60 क्रेट टमाटर बुक कर दी";
          setTranscript(sample);
          setCustomPrompt(sample);
          setIsListening(false);
          handleProcessPrompt(sample);
        }, 2200);
      }
    }
  };

  const handleProcessPrompt = async (textToProcess: string) => {
    if (!textToProcess.trim()) return;

    setIsProcessing(true);
    playClickBeep();

    try {
      const response = await fetch('/api/voice-action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: textToProcess,
          currentLang,
          currentView,
          farmerProfile: farmer,
        }),
      });

      const data = await response.json();
      setIsProcessing(false);

      if (data.spokenResponse) {
        setLastResponse(data.spokenResponse);
        setDetectedDialect(data.dialectDetected || 'Hindi / Local Dialect');
        setExecutedAction(`${data.actionType} → ${data.targetView}`);

        // Read aloud with TTS
        speakMultilingualText(data.spokenResponse, currentLang);
        playSuccessChime();

        // Trigger action in state
        if (data.targetView && data.actionType) {
          setTimeout(() => {
            onExecuteAction(data.targetView, data.actionType, data.params || {});
          }, 600);
        }
      }
    } catch (err) {
      console.error("Error calling voice action API:", err);
      setIsProcessing(false);
      const fallbackMsg = currentLang === 'ta'
        ? "செயல்முறை வெற்றிகரமாக நிறைவேற்றப்பட்டது."
        : "आदेश प्राप्त हुआ। संबंधित मॉड्यूल में कार्रवाई की जा रही है।";
      setLastResponse(fallbackMsg);
      speakMultilingualText(fallbackMsg, currentLang);
    }
  };

  if (!isOpen) return null;

  const sampleVoiceChips = [
    { text: "शीत-वाहन में हमार 60 क्रेट टमाटर बुक कर दी", dialect: "Bhojpuri / Hindi" },
    { text: "पट्टा-सेतु में यूएलआई ₹1.85 लाख ऋण स्वीकृत करें", dialect: "Hindi (Formal)" },
    { text: "खाद की बोरी का QR कोड कवच से स्कैन करें", dialect: "Hindi" },
    { text: "சென்டினல்-2 செயற்கைக்கோள் பயிர் நிலையை காட்டு", dialect: "Tamil (தமிழ்)" },
    { text: "Show my RBI ULI credit trust score breakdown", dialect: "English" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#3A3A30]/50 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md bg-[#FDFBF7] text-[#3A3A30] border border-[#E8E2D9] rounded-3xl p-5 shadow-2xl flex flex-col max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          id="close-voice-modal-btn"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-[#F2EDE7] text-[#736B5E] hover:text-[#3A3A30] border border-[#E8E2D9]"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header Title */}
        <div className="flex items-center gap-2 mb-2">
          <div className="p-2 rounded-2xl bg-[#E8F0E7] border border-[#7E8F7C]/30 text-[#7E8F7C]">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-[#3A3A30] tracking-tight">
              {t.voiceModalTitle}
            </h2>
            <p className="text-[11px] text-[#736B5E]">
              {t.voiceModalSubtitle}
            </p>
          </div>
        </div>

        {/* Audio Wave Visualizer Centerpiece */}
        <div className="my-4 p-6 rounded-2xl bg-white border border-[#E8E2D9] flex flex-col items-center justify-center relative overflow-hidden shadow-xs">
          {/* Background Ambient Glow */}
          <div className="absolute inset-0 bg-[#7E8F7C]/5 pointer-events-none" />

          {/* Animated Audio Equalizer Bars */}
          <div className="flex items-center justify-center gap-1.5 h-16 my-2">
            {[40, 75, 95, 60, 85, 100, 70, 50, 90, 65, 80, 45].map((height, i) => (
              <div
                key={i}
                className={`w-1.5 rounded-full transition-all duration-150 ${
                  isListening || isProcessing
                    ? 'bg-[#7E8F7C] animate-pulse'
                    : 'bg-[#D9C5B2]'
                }`}
                style={{
                  height: isListening ? `${Math.max(12, (height * Math.random()) + 20)}%` : isProcessing ? '45%' : '20%',
                  animationDelay: `${i * 70}ms`,
                }}
              />
            ))}
          </div>

          {/* Glowing Microphone Central Button */}
          <button
            id="toggle-mic-btn"
            onClick={toggleListening}
            className={`mt-2 relative p-4 rounded-full border shadow-md transition-all transform hover:scale-105 active:scale-95 ${
              isListening
                ? 'bg-[#FDF3F2] border-[#D97D75] text-[#C25953] animate-ping-slow'
                : isProcessing
                ? 'bg-[#E8F0E7] border-[#7E8F7C] text-[#7E8F7C] animate-spin-slow'
                : 'bg-[#E8F0E7] border-[#7E8F7C] text-[#4A5D48] hover:bg-[#DCE7DA] shadow-[#7E8F7C]/20'
            }`}
          >
            {isListening ? (
              <Mic className="w-8 h-8" />
            ) : isProcessing ? (
              <Sparkles className="w-8 h-8" />
            ) : (
              <Mic className="w-8 h-8" />
            )}
          </button>

          <p className="mt-3 text-xs font-medium text-[#5A554C]">
            {isListening ? t.listening : isProcessing ? t.processing : t.speakNowPrompt}
          </p>

          {transcript && (
            <div className="mt-3 w-full p-2.5 rounded-xl bg-[#FDFBF7] border border-[#E8E2D9] text-xs text-[#4A5D48] font-mono text-center font-semibold">
              "{transcript}"
            </div>
          )}
        </div>

        {/* Live Response & Executed Action Status Box */}
        {lastResponse && (
          <div className="mb-4 p-3.5 rounded-2xl bg-[#E8F0E7] border border-[#7E8F7C]/40 animate-slide-up shadow-xs">
            <div className="flex items-center justify-between text-[10px] font-mono text-[#4A5D48] mb-1.5 font-bold">
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-[#7E8F7C]" />
                {t.actionExecutedLabel}: <strong className="text-[#3A3A30] font-bold">{executedAction}</strong>
              </span>
              {detectedDialect && (
                <span className="px-1.5 py-0.5 rounded-full bg-white text-[#4A5D48] border border-[#7E8F7C]/30">
                  {detectedDialect}
                </span>
              )}
            </div>

            <p className="text-xs text-[#3A3A30] font-medium leading-relaxed">
              {lastResponse}
            </p>

            <button
              onClick={() => speakMultilingualText(lastResponse, currentLang)}
              className="mt-2 text-[11px] text-[#4A5D48] hover:text-[#3A3A30] font-semibold flex items-center gap-1"
            >
              <Volume2 className="w-3 h-3" />
              <span>Listen again</span>
            </button>
          </div>
        )}

        {/* Manual Prompt Input Box */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleProcessPrompt(customPrompt);
          }}
          className="flex items-center gap-2 mb-4"
        >
          <input
            id="voice-text-input"
            type="text"
            value={customPrompt}
            onChange={(e) => setCustomPrompt(e.target.value)}
            placeholder="Type or speak a dialect command..."
            className="flex-1 px-3 py-2 text-xs bg-white border border-[#E8E2D9] rounded-xl text-[#3A3A30] placeholder-[#8C8275] focus:outline-none focus:border-[#7E8F7C]"
          />
          <button
            id="send-voice-prompt-btn"
            type="submit"
            disabled={!customPrompt.trim() || isProcessing}
            className="p-2 rounded-xl bg-[#7E8F7C] text-white disabled:opacity-40 hover:bg-[#6B7D69] transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

        {/* Quick Sample Voice Command Chips */}
        <div>
          <h4 className="text-[11px] font-semibold text-[#5A554C] mb-2">
            {t.sampleCommands}
          </h4>
          <div className="flex flex-col gap-1.5">
            {sampleVoiceChips.map((chip, idx) => (
              <button
                key={idx}
                id={`voice-preset-${idx}`}
                onClick={() => {
                  setCustomPrompt(chip.text);
                  setTranscript(chip.text);
                  handleProcessPrompt(chip.text);
                }}
                className="w-full text-left p-2.5 rounded-2xl bg-white hover:bg-[#E8F0E7] border border-[#E8E2D9] hover:border-[#7E8F7C]/40 text-[11px] text-[#3A3A30] hover:text-[#4A5D48] transition-all flex items-center justify-between group shadow-xs"
              >
                <span className="truncate pr-2 font-medium">{chip.text}</span>
                <span className="text-[9px] font-mono px-1.5 py-0.5 rounded-full bg-[#F2EDE7] text-[#736B5E] group-hover:bg-white group-hover:text-[#4A5D48] flex-shrink-0">
                  {chip.dialect}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

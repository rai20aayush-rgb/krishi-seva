import React, { useState, useEffect, useRef } from 'react';
import { Language, ViewTab, FarmerProfile } from '../types';
import { TRANSLATIONS } from '../translations';
import { 
  Mic, 
  MicOff, 
  X, 
  Sparkles, 
  Volume2, 
  VolumeX,
  ArrowRight, 
  Send, 
  CheckCircle2, 
  AlertCircle,
  HelpCircle,
  BookOpen,
  ShieldCheck,
  Truck,
  FileText,
  RefreshCw,
  MessageSquare,
  Cpu,
  CornerDownRight,
  Languages
} from 'lucide-react';
import { speakMultilingualText, playSuccessChime, playClickBeep, playAlertBuzzer } from '../utils/audio';

interface VoiceAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLang: Language;
  onLanguageChange?: (lang: Language) => void;
  currentView: ViewTab;
  farmer: FarmerProfile;
  onExecuteAction: (targetView: ViewTab, actionType: string, params: Record<string, any>) => void;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  spokenSummary?: string;
  dialectDetected?: string;
  actionExecuted?: string;
  targetView?: ViewTab;
  actionParams?: Record<string, any>;
  suggestedFollowUps?: string[];
  timestamp: string;
}

export const VoiceAssistantModal: React.FC<VoiceAssistantModalProps> = ({
  isOpen,
  onClose,
  currentLang,
  onLanguageChange,
  currentView,
  farmer,
  onExecuteAction,
}) => {
  const t = TRANSLATIONS[currentLang];
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [customPrompt, setCustomPrompt] = useState('');
  const [activeCategory, setActiveCategory] = useState<'all' | 'crop' | 'tenancy' | 'kavach' | 'mandi'>('all');
  const [isSpeaking, setIsSpeaking] = useState(false);
  
  // Message history thread
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: 'init-1',
      sender: 'assistant',
      text: currentLang === 'hi'
        ? `नमस्ते ${farmer.name}! मैं कृषि-सेतु का जेमिनी वॉइस असिस्टेंट हूँ। आप मुझसे फसल रोग, फॉर्म-7A पट्टा, ₹1.85L ऋण, असली/नकली खाद या शीत-वाहन के बारे में अपनी भाषा (हिन्दी, भोजपुरी, मैथिली, तमिल, अंग्रेजी) में कुछ भी पूछ सकते हैं।`
        : currentLang === 'ta'
        ? `வணக்கம் ${farmer.nameTa || farmer.name}! நான் கிருஷி-சேதுவின் ஜெமினி குரல் உதவியாளர். பயிர் பாதுகாப்பு, பட்டா-சேது கடன், போலி உர தடுப்பு அல்லது குளிர்சாதன வாகனம் பற்றி தமிழில் கேளுங்கள்.`
        : `Greetings ${farmer.name}! I am your Gemini-powered Cyber-Agri Assistant. Ask me anything about crop diseases, Form-7A digital tenancy, RBI ULI credit sanction, fake fertilizer detection, or cold-chain mandi arbitrage.`,
      spokenSummary: currentLang === 'hi'
        ? `नमस्ते ${farmer.name}! कृषि-सेतु जेमिनी वॉइस असिस्टेंट में आपका स्वागत है। बोलें या पूछें।`
        : currentLang === 'ta'
        ? `வணக்கம் ${farmer.nameTa || farmer.name}! கிருஷி-சேதுவிற்கு உங்களை வரவேற்கிறோம்.`
        : `Hello ${farmer.name}, I am ready to assist your agricultural operations.`,
      dialectDetected: currentLang === 'ta' ? 'Tamil' : currentLang === 'en' ? 'English' : 'Hindi',
      suggestedFollowUps: currentLang === 'hi'
        ? [
            'टमाटर में लीफ कर्ल रोग का क्या इलाज है?',
            'पट्टा-सेतु में ₹1.85 लाख ऋण कैसे स्वीकृत होगा?',
            'DAP खाद असली है या नकली कैसे पहचानें?',
          ]
        : currentLang === 'ta'
        ? [
            'நெல் பயிர் நோய் தடுப்பது எப்படி?',
            '₹1.85 லட்சம் உடனடி கடன் பெறுவது எப்படி?',
            'உரத்தின் நம்பகத்தன்மையை எவ்வாறு சரிபார்ப்பது?',
          ]
        : [
            'How to get instant ₹1.85 Lakh RBI ULI loan?',
            'How does Kavach detect fake fertilizers?',
            'What is the metro mandi rate for tomatoes today?',
          ],
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const recognitionRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll chat history
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isProcessing]);

  // Initialize Speech Recognition
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
      try {
        recognitionRef.current?.start();
      } catch (e) {
        setIsListening(true);
        // Fallback simulation for browsers without Web Speech API
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

    const userMessage: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: textToProcess,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setCustomPrompt('');
    setTranscript('');
    setIsProcessing(true);
    playClickBeep();

    try {
      // Build conversation history payload
      const conversationHistory = messages.slice(-4).map((m) => ({
        role: m.sender === 'user' ? 'user' : 'model',
        parts: [{ text: m.text }],
      }));

      const response = await fetch('/api/voice-action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: textToProcess,
          currentLang,
          currentView,
          farmerProfile: farmer,
          conversationHistory,
        }),
      });

      const data = await response.json();
      setIsProcessing(false);

      const spokenText = data.spokenResponse || data.fullAnswer || "आदेश प्राप्त हुआ।";
      const fullAnswerText = data.fullAnswer || data.spokenResponse || "सूचना अद्यतन कर दी गई है।";

      const aiMessage: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'assistant',
        text: fullAnswerText,
        spokenSummary: spokenText,
        dialectDetected: data.dialectDetected || (currentLang === 'ta' ? 'Tamil' : 'Hindi'),
        actionExecuted: data.actionType && data.targetView ? `${data.actionType} → ${data.targetView}` : undefined,
        targetView: data.targetView as ViewTab,
        actionParams: data.params || {},
        suggestedFollowUps: data.suggestedFollowUps && data.suggestedFollowUps.length > 0
          ? data.suggestedFollowUps
          : undefined,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, aiMessage]);

      // Speak response aloud using TTS
      speakMultilingualText(spokenText, currentLang);
      playSuccessChime();

      // Trigger action if valid navigation/operation requested
      if (data.targetView && data.actionType && data.actionType !== 'ANSWER_QUERY') {
        setTimeout(() => {
          onExecuteAction(data.targetView, data.actionType, data.params || {});
        }, 1200);
      }
    } catch (err) {
      console.error("Error calling voice action API:", err);
      setIsProcessing(false);
      playAlertBuzzer();
      
      const fallbackText = currentLang === 'ta'
        ? "மன்னிக்கவும், நெட்வொர்க் இணைப்பு பிழை. உங்கள் கேள்வி பதிவு செய்யப்பட்டுள்ளது."
        : "संजाल त्रुटि। कृपया पुनः प्रयास करें अथवा नीचे दिए गए सुझावों में से चुनें।";

      setMessages((prev) => [
        ...prev,
        {
          id: `ai-err-${Date.now()}`,
          sender: 'assistant',
          text: fallbackText,
          spokenSummary: fallbackText,
          dialectDetected: 'Fallback System',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }
  };

  const handleStopSpeech = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const handleSpeakText = (text: string) => {
    playClickBeep();
    setIsSpeaking(true);
    speakMultilingualText(text, currentLang);
  };

  if (!isOpen) return null;

  // Categorized Preset Questions
  const categorizedPresets = {
    crop: [
      { text: "टमाटर में फल छेदक कीट और लीफ कर्ल से कैसे बचें?", dialect: "Hindi (Crop Advisory)" },
      { text: "सेंटिनल-2 उपग्रह से खेत की नमी और फसल स्वास्थ्य कैसे देखें?", dialect: "Hindi (Satellite)" },
      { text: "பயிரில் பூச்சித் தாக்குதலை கட்டுப்படுத்துவது எப்படி?", dialect: "Tamil (தமிழ்)" },
      { text: "Best sowing time and NPK fertilizer ratio for Tomato crop?", dialect: "English" },
    ],
    tenancy: [
      { text: "पट्टा-सेतु में जमीन मालिक के साथ फॉर्म-7A पट्टा कैसे बनाएं?", dialect: "Hindi (Tenancy)" },
      { text: "बिना जमीन गिरवी रखे RBI ULI से ₹1.85 लाख ऋण कैसे मिलेगा?", dialect: "Bhojpuri / Hindi" },
      { text: "மாடல் நில குத்தகை சட்டம் மூலம் கடன் பெறுவது எப்படி?", dialect: "Tamil (குத்தகை)" },
      { text: "What is the non-mortgage clause in Form-7A agreement?", dialect: "English" },
    ],
    kavach: [
      { text: "DAP खाद असली है या नकली, कवच स्कैनर से कैसे जांचें?", dialect: "Hindi (Kavach)" },
      { text: "खाद की बोरी का QR कोड कवच से स्कैन करें", dialect: "Hindi" },
      { text: "போலி உரம் மற்றும் விதைகளை கேமரா மூலம் கண்டறிவது எப்படி?", dialect: "Tamil (கவச்)" },
      { text: "How does 850 km/h Geo-Velocity detect cloned QR codes?", dialect: "English" },
    ],
    mandi: [
      { text: "शीत-वाहन में हमार 60 क्रेट टमाटर बुक कर दी", dialect: "Bhojpuri" },
      { text: "स्थानीय मंडी के ₹7/kg की जगह दिल्ली/बेंगलुरु में ₹32/kg कैसे पाएं?", dialect: "Hindi (Arbitrage)" },
      { text: "குளிர்பதன வாகனத்தில் 60 பெட்டிகள் பதிவு செய்க", dialect: "Tamil (விலை உயர்வு)" },
      { text: "Calculate my net profit gain with 4.0°C Reefer pooling", dialect: "English" },
    ],
  };

  const currentPresets = activeCategory === 'all' 
    ? [
        categorizedPresets.crop[0],
        categorizedPresets.tenancy[1],
        categorizedPresets.kavach[0],
        categorizedPresets.mandi[0],
      ]
    : categorizedPresets[activeCategory];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#3A3A30]/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-[#FDFBF7] text-[#3A3A30] border border-[#E8E2D9] rounded-3xl p-4 sm:p-5 shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">
        
        {/* Top Header Row with Model Badge & Controls */}
        <div className="flex items-center justify-between pb-3 border-b border-[#E8E2D9]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-2xl bg-[#E8F0E7] border border-[#7E8F7C]/30 text-[#4A5D48] shadow-xs">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h2 className="text-sm sm:text-base font-extrabold text-[#3A3A30] tracking-tight">
                  {t.voiceModalTitle || 'Gemini Rural Voice Assistant'}
                </h2>
                <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-[#7E8F7C] text-white font-bold">
                  Gemini 3.7 Flash
                </span>
              </div>
              <p className="text-[10px] sm:text-[11px] text-[#736B5E]">
                {t.voiceModalSubtitle || 'Speak in your native dialect (Hindi, Bhojpuri, Maithili, Tamil, English)'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {/* 1-Tap Language Switcher Inside Modal */}
            {onLanguageChange && (
              <div className="flex items-center gap-0.5 bg-[#F2EDE7] p-0.5 rounded-xl border border-[#E8E2D9]">
                <button
                  onClick={() => {
                    playClickBeep();
                    onLanguageChange('hi');
                  }}
                  className={`px-2 py-0.5 rounded-lg text-[10px] font-bold transition-all ${
                    currentLang === 'hi' ? 'bg-white text-[#4A5D48] shadow-xs' : 'text-[#736B5E]'
                  }`}
                >
                  हिन्दी
                </button>
                <button
                  onClick={() => {
                    playClickBeep();
                    onLanguageChange('ta');
                  }}
                  className={`px-2 py-0.5 rounded-lg text-[10px] font-bold transition-all ${
                    currentLang === 'ta' ? 'bg-white text-[#4A5D48] shadow-xs' : 'text-[#736B5E]'
                  }`}
                >
                  தமிழ்
                </button>
                <button
                  onClick={() => {
                    playClickBeep();
                    onLanguageChange('en');
                  }}
                  className={`px-2 py-0.5 rounded-lg text-[10px] font-bold transition-all ${
                    currentLang === 'en' ? 'bg-white text-[#4A5D48] shadow-xs' : 'text-[#736B5E]'
                  }`}
                >
                  EN
                </button>
              </div>
            )}

            {/* Close Button */}
            <button
              id="close-voice-modal-btn"
              onClick={() => {
                handleStopSpeech();
                onClose();
              }}
              className="p-1.5 rounded-full bg-[#F2EDE7] text-[#736B5E] hover:text-[#3A3A30] border border-[#E8E2D9]"
              title="Close Voice Assistant"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 py-2 overflow-x-auto no-scrollbar border-b border-[#F0EBE4]">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-2.5 py-1 rounded-xl text-[10px] font-bold whitespace-nowrap transition-all flex items-center gap-1 ${
              activeCategory === 'all'
                ? 'bg-[#7E8F7C] text-white shadow-xs'
                : 'bg-white text-[#736B5E] border border-[#E8E2D9] hover:bg-[#F2EDE7]'
            }`}
          >
            <Sparkles className="w-3 h-3" />
            <span>All Topics</span>
          </button>
          <button
            onClick={() => setActiveCategory('crop')}
            className={`px-2.5 py-1 rounded-xl text-[10px] font-bold whitespace-nowrap transition-all flex items-center gap-1 ${
              activeCategory === 'crop'
                ? 'bg-[#7E8F7C] text-white shadow-xs'
                : 'bg-white text-[#736B5E] border border-[#E8E2D9] hover:bg-[#F2EDE7]'
            }`}
          >
            <span>🌾 Crop & Pest</span>
          </button>
          <button
            onClick={() => setActiveCategory('tenancy')}
            className={`px-2.5 py-1 rounded-xl text-[10px] font-bold whitespace-nowrap transition-all flex items-center gap-1 ${
              activeCategory === 'tenancy'
                ? 'bg-[#7E8F7C] text-white shadow-xs'
                : 'bg-white text-[#736B5E] border border-[#E8E2D9] hover:bg-[#F2EDE7]'
            }`}
          >
            <FileText className="w-3 h-3" />
            <span>Form-7A & Loan</span>
          </button>
          <button
            onClick={() => setActiveCategory('kavach')}
            className={`px-2.5 py-1 rounded-xl text-[10px] font-bold whitespace-nowrap transition-all flex items-center gap-1 ${
              activeCategory === 'kavach'
                ? 'bg-[#7E8F7C] text-white shadow-xs'
                : 'bg-white text-[#736B5E] border border-[#E8E2D9] hover:bg-[#F2EDE7]'
            }`}
          >
            <ShieldCheck className="w-3 h-3" />
            <span>Kavach QR</span>
          </button>
          <button
            onClick={() => setActiveCategory('mandi')}
            className={`px-2.5 py-1 rounded-xl text-[10px] font-bold whitespace-nowrap transition-all flex items-center gap-1 ${
              activeCategory === 'mandi'
                ? 'bg-[#7E8F7C] text-white shadow-xs'
                : 'bg-white text-[#736B5E] border border-[#E8E2D9] hover:bg-[#F2EDE7]'
            }`}
          >
            <Truck className="w-3 h-3" />
            <span>Mandi & Reefer</span>
          </button>
        </div>

        {/* Scrollable Conversation Thread */}
        <div className="flex-1 overflow-y-auto py-3 space-y-3 min-h-[160px] max-h-[280px] sm:max-h-[320px] px-1">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[92%] sm:max-w-[85%] rounded-3xl p-3 sm:p-4 text-xs leading-relaxed shadow-xs ${
                  msg.sender === 'user'
                    ? 'bg-[#7E8F7C] text-white rounded-tr-xs'
                    : 'bg-white border border-[#E8E2D9] text-[#3A3A30] rounded-tl-xs'
                }`}
              >
                {/* Assistant Metadata Badge */}
                {msg.sender === 'assistant' && (
                  <div className="flex items-center justify-between gap-2 mb-2 pb-1.5 border-b border-[#F0EBE4] text-[10px] font-mono">
                    <span className="flex items-center gap-1 text-[#4A5D48] font-bold">
                      <Sparkles className="w-3 h-3 text-[#7E8F7C]" />
                      Krishi-Setu AI
                    </span>
                    {msg.dialectDetected && (
                      <span className="px-1.5 py-0.2 rounded-md bg-[#FAF7F2] text-[#7A624E] border border-[#D9C5B2] font-semibold">
                        {msg.dialectDetected}
                      </span>
                    )}
                  </div>
                )}

                {/* Spoken summary callout if provided */}
                {msg.spokenSummary && msg.spokenSummary !== msg.text && (
                  <div className="mb-2 p-2 rounded-xl bg-[#E8F0E7] text-[#4A5D48] font-medium border border-[#7E8F7C]/20 flex items-start gap-1.5">
                    <Volume2 className="w-3.5 h-3.5 flex-shrink-0 mt-0.5 text-[#7E8F7C]" />
                    <span className="italic">"{msg.spokenSummary}"</span>
                  </div>
                )}

                {/* Full Body Text / Answer */}
                <div className="whitespace-pre-line font-normal">
                  {msg.text}
                </div>

                {/* Action Trigger Badge / Button if active module action returned */}
                {msg.actionExecuted && msg.targetView && (
                  <div className="mt-2.5 pt-2 border-t border-[#F0EBE4] flex items-center justify-between gap-2">
                    <span className="text-[10px] font-mono text-[#7E8F7C] font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      {msg.actionExecuted}
                    </span>
                    <button
                      onClick={() => {
                        playClickBeep();
                        onClose();
                        onExecuteAction(msg.targetView!, msg.actionExecuted?.split(' ')[0] || 'NAVIGATE', msg.actionParams || {});
                      }}
                      className="px-2 py-1 rounded-lg bg-[#7E8F7C] text-white text-[10px] font-bold hover:bg-[#6B7D69] flex items-center gap-1 transition-all"
                    >
                      <span>Open View</span>
                      <ArrowRight className="w-2.5 h-2.5" />
                    </button>
                  </div>
                )}

                {/* Suggested Follow-up Question Chips */}
                {msg.suggestedFollowUps && msg.suggestedFollowUps.length > 0 && (
                  <div className="mt-3 pt-2 border-t border-[#F0EBE4] space-y-1.5">
                    <p className="text-[9px] font-mono uppercase tracking-wider text-[#8C8275] font-bold flex items-center gap-1">
                      <CornerDownRight className="w-2.5 h-2.5" />
                      Suggested Follow-Ups:
                    </p>
                    <div className="flex flex-col gap-1">
                      {msg.suggestedFollowUps.map((q, idx) => (
                        <button
                          key={idx}
                          onClick={() => {
                            setCustomPrompt(q);
                            handleProcessPrompt(q);
                          }}
                          className="text-left px-2.5 py-1.5 rounded-xl bg-[#FAF7F2] hover:bg-[#E8F0E7] text-[11px] text-[#4A5D48] border border-[#E8E2D9] transition-all flex items-center justify-between group"
                        >
                          <span className="truncate">{q}</span>
                          <ArrowRight className="w-3 h-3 text-[#7E8F7C] opacity-60 group-hover:opacity-100 flex-shrink-0" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Audio replay controls for Assistant message */}
                {msg.sender === 'assistant' && (
                  <div className="mt-2 flex items-center justify-between text-[10px] text-[#8C8275]">
                    <span>{msg.timestamp}</span>
                    <button
                      onClick={() => handleSpeakText(msg.spokenSummary || msg.text)}
                      className="text-[#4A5D48] hover:text-[#3A3A30] font-semibold flex items-center gap-1"
                      title="Listen aloud"
                    >
                      <Volume2 className="w-3 h-3" />
                      <span>Speak</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Loading Processing Indicator */}
          {isProcessing && (
            <div className="flex items-start gap-2">
              <div className="p-3 rounded-3xl bg-white border border-[#E8E2D9] shadow-xs flex items-center gap-2 text-xs text-[#7E8F7C]">
                <Cpu className="w-4 h-4 animate-spin text-[#7E8F7C]" />
                <span className="font-mono font-semibold">
                  {currentLang === 'hi' ? 'जेमिनी एआई द्वारा विश्लेषण एवं उत्तर तैयार हो रहा है...' : currentLang === 'ta' ? 'ஜெமினி AI பதிலளிக்கிறது...' : 'Gemini AI reasoning & generating agri response...'}
                </span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Central Audio Microphone & Visualizer Bar */}
        <div className="py-2 px-3 rounded-2xl bg-white border border-[#E8E2D9] shadow-xs flex items-center justify-between gap-2">
          {/* Animated Equalizer */}
          <div className="flex items-center gap-1 h-8 flex-1">
            {[30, 70, 95, 55, 80, 100, 65, 45, 85, 60, 75, 40, 90, 50].map((h, i) => (
              <div
                key={i}
                className={`w-1 rounded-full transition-all duration-150 ${
                  isListening || isProcessing
                    ? 'bg-[#7E8F7C] animate-pulse'
                    : 'bg-[#E8E2D9]'
                }`}
                style={{
                  height: isListening ? `${Math.max(15, (h * Math.random()) + 20)}%` : isProcessing ? '40%' : '20%',
                  animationDelay: `${i * 60}ms`,
                }}
              />
            ))}
          </div>

          {/* Mic Button */}
          <button
            id="toggle-voice-mic-btn"
            onClick={toggleListening}
            className={`p-3 rounded-full border shadow-md transition-all transform hover:scale-105 active:scale-95 flex-shrink-0 ${
              isListening
                ? 'bg-[#FDF3F2] border-[#D97D75] text-[#C25953] animate-ping-slow'
                : isProcessing
                ? 'bg-[#E8F0E7] border-[#7E8F7C] text-[#7E8F7C]'
                : 'bg-[#7E8F7C] border-[#7E8F7C] text-white hover:bg-[#6B7D69]'
            }`}
            title="Toggle Voice Input"
          >
            {isListening ? (
              <MicOff className="w-5 h-5" />
            ) : (
              <Mic className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Transcript preview if speaking */}
        {transcript && (
          <div className="my-1.5 p-2 rounded-xl bg-[#E8F0E7] border border-[#7E8F7C]/30 text-xs text-[#4A5D48] font-mono text-center font-semibold animate-fade-in truncate">
            "{transcript}"
          </div>
        )}

        {/* Text Input Prompt Box */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleProcessPrompt(customPrompt);
          }}
          className="mt-2 flex items-center gap-2"
        >
          <input
            id="voice-custom-prompt-input"
            type="text"
            value={customPrompt}
            onChange={(e) => setCustomPrompt(e.target.value)}
            placeholder={currentLang === 'hi' ? 'अपनी भाषा में प्रश्न पूछें या आदेश दें...' : currentLang === 'ta' ? 'தமிழில் கேள்வி கேளுங்கள்...' : 'Ask any farming question or speak dialect command...'}
            className="flex-1 px-3.5 py-2 text-xs bg-white border border-[#E8E2D9] rounded-2xl text-[#3A3A30] placeholder-[#8C8275] focus:outline-none focus:border-[#7E8F7C] shadow-inner"
          />
          <button
            id="submit-voice-prompt-btn"
            type="submit"
            disabled={!customPrompt.trim() || isProcessing}
            className="p-2.5 rounded-2xl bg-[#7E8F7C] text-white disabled:opacity-40 hover:bg-[#6B7D69] transition-all shadow-xs"
            title="Send Question"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

        {/* Quick Sample Voice Chips */}
        <div className="mt-2 pt-2 border-t border-[#F0EBE4]">
          <div className="flex items-center justify-between mb-1 text-[10px] text-[#8C8275] font-mono">
            <span>QUICK TOPICS ({activeCategory.toUpperCase()})</span>
            <span>1-Tap Ask</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 max-h-24 overflow-y-auto no-scrollbar">
            {currentPresets.map((chip, idx) => (
              <button
                key={idx}
                id={`voice-chip-${idx}`}
                onClick={() => {
                  setCustomPrompt(chip.text);
                  handleProcessPrompt(chip.text);
                }}
                className="text-left p-2 rounded-xl bg-white hover:bg-[#E8F0E7] border border-[#E8E2D9] hover:border-[#7E8F7C]/40 text-[11px] text-[#3A3A30] hover:text-[#4A5D48] transition-all flex items-center justify-between group shadow-2xs"
              >
                <span className="truncate pr-1.5 font-medium">{chip.text}</span>
                <span className="text-[9px] font-mono px-1.5 py-0.2 rounded-md bg-[#FAF7F2] text-[#736B5E] group-hover:bg-white group-hover:text-[#4A5D48] flex-shrink-0">
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

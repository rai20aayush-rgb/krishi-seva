import React, { useState } from 'react';
import { Language, FarmerProfile, ViewTab } from '../types';
import { TRANSLATIONS } from '../translations';
import { 
  Award, 
  TrendingUp, 
  ShieldCheck, 
  FileText, 
  Truck, 
  ShieldAlert, 
  Droplets, 
  Thermometer, 
  Wind, 
  Radio, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  Bot, 
  ChevronRight 
} from 'lucide-react';
import { playClickBeep } from '../utils/audio';

interface CommandHubViewProps {
  currentLang: Language;
  farmer: FarmerProfile;
  onNavigate: (view: ViewTab) => void;
  onOpenVoice: () => void;
}

export const CommandHubView: React.FC<CommandHubViewProps> = ({
  currentLang,
  farmer,
  onNavigate,
  onOpenVoice,
}) => {
  const t = TRANSLATIONS[currentLang];
  const [advisorQuestion, setAdvisorQuestion] = useState('');
  const [advisorResponse, setAdvisorResponse] = useState<string | null>(null);
  const [isAdvisorLoading, setIsAdvisorLoading] = useState(false);

  // ULI Credit Score calculations
  const score = farmer.creditScore || 784;
  const scorePct = (score / 900) * 100;
  const strokeDashoffset = 282 - (282 * scorePct) / 100;

  const handleAskAdvisor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!advisorQuestion.trim()) return;

    setIsAdvisorLoading(true);
    playClickBeep();

    try {
      const res = await fetch('/api/agri-advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: advisorQuestion,
          language: currentLang,
          context: farmer,
        }),
      });
      const data = await res.json();
      setAdvisorResponse(data.answer);
    } catch (err) {
      setAdvisorResponse(
        currentLang === 'ta'
          ? "சென்டினல்-2 நிலப்பரப்பு படி மண்ணின் ஈரப்பதம் 38%. குளிர்சாதன வாகனத்தில் பதிவு செய்து மெட்ரோ மண்டியில் கிலோவுக்கு ₹32 பெறுங்கள்."
          : "सेंटिनल-2 सेटेलाइट के अनुसार आपकी मिट्टी में 38% नमी है। अगले 3 दिनों में टमाटर तुड़ाई कर शीत-वाहन बुक करें ताकि ₹32/किग्रा का भाव मिले।"
      );
    } finally {
      setIsAdvisorLoading(false);
    }
  };

  return (
    <div className="space-y-4 pb-20 animate-fade-in">
      {/* Welcome & Farmer Badge */}
      <div className="p-4 rounded-3xl bg-[#7E8F7C] text-white shadow-sm flex items-center justify-between relative overflow-hidden">
        <div className="absolute -right-6 -bottom-6 w-28 h-28 bg-white/10 rounded-full blur-xl pointer-events-none" />
        <div>
          <div className="flex items-center gap-1.5 text-xs text-white/80">
            <span>{t.hubGreeting},</span>
            <strong className="text-white font-bold">
              {currentLang === 'hi' ? farmer.nameHi : currentLang === 'ta' ? farmer.nameTa : farmer.name}
            </strong>
          </div>
          <p className="text-[11px] text-white/90 font-mono mt-0.5 font-medium">
            {t.farmerIdLabel}: {farmer.agriStackId}
          </p>
        </div>

        <div className="px-2.5 py-1 rounded-full bg-white/20 border border-white/30 text-white text-[10px] font-mono font-bold flex items-center gap-1.5 shadow-xs">
          <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
          <span>SOVEREIGN AGRI-NODE</span>
        </div>
      </div>

      {/* RBI ULI Credit Score Dial Centerpiece */}
      <div className="p-5 rounded-3xl bg-white border border-[#E8E2D9] shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-[#E8F0E7]/60 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-xl bg-[#E8F0E7] text-[#4A5D48] border border-[#7E8F7C]/30">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-[#3A3A30] uppercase tracking-wider">
                {t.uliScoreTitle}
              </h3>
              <p className="text-[10px] text-[#7E8F7C] font-medium">{t.creditScoreLabel}</p>
            </div>
          </div>

          <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#E8F0E7] text-[#4A5D48] border border-[#7E8F7C]/30">
            {t.primeRating}
          </span>
        </div>

        {/* Circular Gauge and Sub-Scores */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center my-2">
          {/* Gauge Graphic */}
          <div className="sm:col-span-5 flex flex-col items-center justify-center relative">
            <svg className="w-36 h-36 transform -rotate-90" viewBox="0 0 100 100">
              {/* Background Ring */}
              <circle
                cx="50"
                cy="50"
                r="45"
                stroke="currentColor"
                strokeWidth="7"
                className="text-[#F2EDE7]"
                fill="transparent"
              />
              {/* Animated Progress Ring */}
              <circle
                cx="50"
                cy="50"
                r="45"
                stroke="url(#uliGradient)"
                strokeWidth="7"
                strokeDasharray="282"
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
                className="transition-all duration-1000 ease-out"
              />
              <defs>
                <linearGradient id="uliGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#7E8F7C" />
                  <stop offset="50%" stopColor="#A3B899" />
                  <stop offset="100%" stopColor="#D9C5B2" />
                </linearGradient>
              </defs>
            </svg>

            {/* Inner Gauge Text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-2xl font-black text-[#3A3A30] font-mono tracking-tight">
                {score}
              </span>
              <span className="text-[10px] text-[#7E8F7C] font-mono font-semibold">/ 900 SCORE</span>
            </div>
          </div>

          {/* Sub-Metrics Score Breakdown */}
          <div className="sm:col-span-7 space-y-2">
            <div>
              <div className="flex justify-between text-[11px] mb-0.5">
                <span className="text-[#5A554C] font-medium">{t.landHistoryScore}</span>
                <span className="text-[#4A5D48] font-mono font-bold">94%</span>
              </div>
              <div className="w-full bg-[#F2EDE7] h-1.5 rounded-full overflow-hidden">
                <div className="bg-[#7E8F7C] h-full rounded-full w-[94%]" />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[11px] mb-0.5">
                <span className="text-[#5A554C] font-medium">{t.mandiRepayScore}</span>
                <span className="text-[#7A624E] font-mono font-bold">98%</span>
              </div>
              <div className="w-full bg-[#F2EDE7] h-1.5 rounded-full overflow-hidden">
                <div className="bg-[#BFA893] h-full rounded-full w-[98%]" />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[11px] mb-0.5">
                <span className="text-[#5A554C] font-medium">{t.satelliteHealthScore}</span>
                <span className="text-[#4A5D48] font-mono font-bold">88%</span>
              </div>
              <div className="w-full bg-[#F2EDE7] h-1.5 rounded-full overflow-hidden">
                <div className="bg-[#8AA088] h-full rounded-full w-[88%]" />
              </div>
            </div>

            <button
              onClick={() => {
                playClickBeep();
                onNavigate('patta-setu');
              }}
              className="mt-2 w-full py-2 px-3 rounded-2xl bg-[#7E8F7C] hover:bg-[#6B7D69] text-white text-xs font-semibold flex items-center justify-between group transition-all shadow-sm"
            >
              <span>{farmer.loanDisbursed ? 'View Sanction Certificate' : 'Claim ₹1.85L 0-Collateral Limit'}</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>

      {/* Live Telemetry Strip */}
      <div className="p-4 rounded-3xl bg-white border border-[#E8E2D9] shadow-sm">
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#3A3A30] uppercase tracking-wider">
            <Radio className="w-3.5 h-3.5 text-[#7E8F7C] animate-pulse" />
            <span>{t.telemetryTitle}</span>
          </div>
          <span className="text-[10px] text-[#7E8F7C] font-mono font-bold">LIVE SENSORS</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <div className="p-2.5 rounded-2xl bg-[#FDFBF7] border border-[#E8E2D9] flex items-center gap-2">
            <Droplets className="w-4 h-4 text-[#7E8F7C]" />
            <div>
              <p className="text-[10px] text-[#8C8275]">{t.soilMoisture}</p>
              <p className="text-xs font-mono font-bold text-[#3A3A30]">38.4% RH</p>
            </div>
          </div>

          <div className="p-2.5 rounded-2xl bg-[#FDFBF7] border border-[#E8E2D9] flex items-center gap-2">
            <Thermometer className="w-4 h-4 text-[#C89B65]" />
            <div>
              <p className="text-[10px] text-[#8C8275]">{t.ambientTemp}</p>
              <p className="text-xs font-mono font-bold text-[#3A3A30]">29.8°C</p>
            </div>
          </div>

          <div className="p-2.5 rounded-2xl bg-[#FDFBF7] border border-[#E8E2D9] flex items-center gap-2">
            <Wind className="w-4 h-4 text-[#7E8F7C]" />
            <div>
              <p className="text-[10px] text-[#8C8275]">{t.airQuality}</p>
              <p className="text-xs font-mono font-bold text-[#4A5D48]">52 (Good)</p>
            </div>
          </div>

          <div className="p-2.5 rounded-2xl bg-[#FDFBF7] border border-[#E8E2D9] flex items-center gap-2">
            <Radio className="w-4 h-4 text-[#A85847]" />
            <div>
              <p className="text-[10px] text-[#8C8275]">{t.satellitePass}</p>
              <p className="text-xs font-mono font-bold text-[#A85847]">T-42 Min</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tri-Module Gateway Cards */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-[#7E8F7C] uppercase tracking-wider px-1">
          {t.activeModules}
        </h3>

        {/* Module 1: Patta-Setu */}
        <div
          onClick={() => {
            playClickBeep();
            onNavigate('patta-setu');
          }}
          className="p-4 rounded-3xl bg-white hover:bg-[#FAF7F2] border border-[#E8E2D9] hover:border-[#D9C5B2] transition-all cursor-pointer group shadow-sm"
        >
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-2xl bg-[#F2EDE7] text-[#7A624E] border border-[#D9C5B2] group-hover:scale-105 transition-transform">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-[#3A3A30] group-hover:text-[#7A624E] transition-colors">
                    {t.navPatta}
                  </h4>
                  <span className="text-[9px] font-mono px-1.5 py-0.2 rounded-full bg-[#F2EDE7] text-[#7A624E] border border-[#D9C5B2] font-semibold">
                    FORM-7A LEASE
                  </span>
                </div>
                <p className="text-[11px] text-[#736B5E] mt-1 leading-snug">
                  Bilateral digital lease with mutual Aadhaar e-Sign + ₹1,85,000 ULI loan limit.
                </p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-[#8C8275] group-hover:text-[#7A624E] group-hover:translate-x-1 transition-all flex-shrink-0" />
          </div>
        </div>

        {/* Module 2: Kavach */}
        <div
          onClick={() => {
            playClickBeep();
            onNavigate('kavach');
          }}
          className="p-4 rounded-3xl bg-white hover:bg-[#FAF7F2] border border-[#E8E2D9] hover:border-[#E8C2B8] transition-all cursor-pointer group shadow-sm"
        >
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-2xl bg-[#FBF4F2] text-[#A84A36] border border-[#E8C2B8] group-hover:scale-105 transition-transform">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-[#3A3A30] group-hover:text-[#A84A36] transition-colors">
                    {t.navKavach}
                  </h4>
                  <span className="text-[9px] font-mono px-1.5 py-0.2 rounded-full bg-[#FBF4F2] text-[#A84A36] border border-[#E8C2B8] font-semibold">
                    LASER HUD SCANNER
                  </span>
                </div>
                <p className="text-[11px] text-[#736B5E] mt-1 leading-snug">
                  Optical reticle scanner + Geo-velocity physics anomaly engine preventing fake fertilizers.
                </p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-[#8C8275] group-hover:text-[#A84A36] group-hover:translate-x-1 transition-all flex-shrink-0" />
          </div>
        </div>

        {/* Module 3: Sheet-Vahan */}
        <div
          onClick={() => {
            playClickBeep();
            onNavigate('sheet-vahan');
          }}
          className="p-4 rounded-3xl bg-white hover:bg-[#FAF7F2] border border-[#E8E2D9] hover:border-[#7E8F7C] transition-all cursor-pointer group shadow-sm"
        >
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-2xl bg-[#E8F0E7] text-[#4A5D48] border border-[#7E8F7C]/30 group-hover:scale-105 transition-transform">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-[#3A3A30] group-hover:text-[#4A5D48] transition-colors">
                    {t.navSheet}
                  </h4>
                  <span className="text-[9px] font-mono px-1.5 py-0.2 rounded-full bg-[#E8F0E7] text-[#4A5D48] border border-[#7E8F7C]/30 font-semibold">
                    +107% ARBITRAGE
                  </span>
                </div>
                <p className="text-[11px] text-[#736B5E] mt-1 leading-snug">
                  Decentralized 4.2°C Reefer Pooling. Convert ₹14/kg local distress to ₹32/kg metro price.
                </p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-[#8C8275] group-hover:text-[#4A5D48] group-hover:translate-x-1 transition-all flex-shrink-0" />
          </div>
        </div>
      </div>

      {/* AI Agri Advisor Consultation Box */}
      <div className="p-4 rounded-3xl bg-white border border-[#E8E2D9] shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bot className="w-4 h-4 text-[#7E8F7C]" />
            <h4 className="text-xs font-bold text-[#3A3A30] uppercase tracking-wider">
              Gemini Agri-Advisor
            </h4>
          </div>
          <button
            onClick={onOpenVoice}
            className="text-[10px] text-[#7E8F7C] hover:text-[#4A5D48] font-semibold flex items-center gap-1"
          >
            <Sparkles className="w-3 h-3" />
            <span>Voice Mode</span>
          </button>
        </div>

        <form onSubmit={handleAskAdvisor} className="flex gap-2">
          <input
            id="advisor-input"
            type="text"
            value={advisorQuestion}
            onChange={(e) => setAdvisorQuestion(e.target.value)}
            placeholder={
              currentLang === 'ta'
                ? "விவசாய சந்தை அல்லது பயிர் பற்றி கேளுங்கள்..."
                : "मंडी भाव, फसल कटाई या सेटेलाइट सलाह पूछें..."
            }
            className="flex-1 px-3 py-2 text-xs bg-[#FDFBF7] border border-[#E8E2D9] rounded-xl text-[#3A3A30] placeholder-[#A69B8D] focus:outline-none focus:border-[#7E8F7C]"
          />
          <button
            id="advisor-submit-btn"
            type="submit"
            disabled={!advisorQuestion.trim() || isAdvisorLoading}
            className="px-3.5 py-2 rounded-xl bg-[#7E8F7C] hover:bg-[#6B7D69] text-white font-bold text-xs disabled:opacity-40 transition-colors shadow-xs"
          >
            {isAdvisorLoading ? '...' : 'Ask'}
          </button>
        </form>

        {advisorResponse && (
          <div className="p-3 rounded-2xl bg-[#E8F0E7] border border-[#7E8F7C]/30 text-xs text-[#3A3A30] leading-relaxed animate-fade-in">
            {advisorResponse}
          </div>
        )}
      </div>
    </div>
  );
};

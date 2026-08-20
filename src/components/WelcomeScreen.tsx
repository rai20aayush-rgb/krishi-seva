import React, { useEffect, useState } from 'react';
import { Language, FarmerProfile, ViewTab } from '../types';
import { TRANSLATIONS } from '../translations';
import { 
  ShieldCheck, 
  Sparkles, 
  ArrowRight, 
  FileText, 
  Truck, 
  Cpu, 
  Layers,
  Zap,
  CheckCircle2
} from 'lucide-react';
import { playSuccessChime, playClickBeep } from '../utils/audio';

interface WelcomeScreenProps {
  currentLang: Language;
  onLanguageChange?: (lang: Language) => void;
  farmer?: FarmerProfile;
  onSelectPreset?: (presetKey: 'bihar' | 'tamil') => void;
  onEnterApp: (targetTab?: ViewTab) => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  currentLang,
  onLanguageChange,
  farmer,
  onEnterApp,
}) => {
  const t = TRANSLATIONS[currentLang];
  const [countdown, setCountdown] = useState<number>(3);
  const [progress, setProgress] = useState<number>(0);

  useEffect(() => {
    // Play welcoming ambient chime
    playSuccessChime();

    const startTime = Date.now();
    const duration = 3000; // 3 seconds

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progressRatio = Math.min(elapsed / duration, 1);
      setProgress(progressRatio * 100);

      const remainingSeconds = Math.max(0, Math.ceil((duration - elapsed) / 1000));
      setCountdown(remainingSeconds);

      if (elapsed >= duration) {
        clearInterval(interval);
        onEnterApp('hub');
      }
    }, 50);

    const timer = setTimeout(() => {
      onEnterApp('hub');
    }, 3000);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, [onEnterApp]);

  const handleManualEnter = (tab: ViewTab = 'hub') => {
    playClickBeep();
    onEnterApp(tab);
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#3A3A30] flex flex-col justify-between p-6 animate-fade-in relative overflow-hidden select-none">
      {/* Ambient background glows */}
      <div className="absolute -top-12 -right-12 w-96 h-96 bg-[#7E8F7C]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-12 -left-12 w-96 h-96 bg-[#D9C5B2]/25 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-[#7E8F7C]/5 rounded-full blur-2xl pointer-events-none" />

      {/* Top Bar with Language Selector & Status */}
      <div className="flex items-center justify-between z-10">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#7E8F7C] animate-ping" />
          <span className="text-[11px] font-mono uppercase tracking-widest text-[#4A5D48] font-bold">
            AGRISTACK SOVEREIGN RAIL • v2.6
          </span>
        </div>

        {onLanguageChange && (
          <div className="flex items-center gap-1 bg-[#F2EDE7] p-1 rounded-xl border border-[#E8E2D9]">
            <button
              onClick={() => {
                playClickBeep();
                onLanguageChange('hi');
              }}
              className={`px-2.5 py-0.5 rounded-lg text-[11px] font-semibold transition-all ${
                currentLang === 'hi'
                  ? 'bg-white text-[#4A5D48] shadow-xs font-bold'
                  : 'text-[#736B5E] hover:text-[#3A3A30]'
              }`}
            >
              हिन्दी
            </button>
            <button
              onClick={() => {
                playClickBeep();
                onLanguageChange('ta');
              }}
              className={`px-2.5 py-0.5 rounded-lg text-[11px] font-semibold transition-all ${
                currentLang === 'ta'
                  ? 'bg-white text-[#4A5D48] shadow-xs font-bold'
                  : 'text-[#736B5E] hover:text-[#3A3A30]'
              }`}
            >
              தமிழ்
            </button>
            <button
              onClick={() => {
                playClickBeep();
                onLanguageChange('en');
              }}
              className={`px-2.5 py-0.5 rounded-lg text-[11px] font-semibold transition-all ${
                currentLang === 'en'
                  ? 'bg-white text-[#4A5D48] shadow-xs font-bold'
                  : 'text-[#736B5E] hover:text-[#3A3A30]'
              }`}
            >
              EN
            </button>
          </div>
        )}
      </div>

      {/* Center Hero Section with Animated Logo & Onboarding Message */}
      <div className="my-auto py-8 flex flex-col items-center text-center z-10 max-w-lg mx-auto space-y-6">
        {/* Animated Krishi-Setu Emblem Logo */}
        <div className="relative">
          {/* Pulsing ring aura */}
          <div className="absolute -inset-4 bg-gradient-to-tr from-[#7E8F7C]/30 to-[#D9C5B2]/40 rounded-3xl blur-md animate-pulse" />
          
          <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-gradient-to-br from-[#7E8F7C] to-[#4A5D48] border-4 border-white shadow-xl flex items-center justify-center transform transition-transform hover:scale-105">
            <span className="text-4xl sm:text-5xl drop-shadow-sm select-none">🌾</span>
            <div className="absolute -bottom-2 -right-2 p-1.5 rounded-xl bg-white text-[#7E8F7C] shadow-md border border-[#E8E2D9]">
              <ShieldCheck className="w-5 h-5 text-[#4A5D48]" />
            </div>
          </div>
        </div>

        {/* Title & Tagline */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E8F0E7] border border-[#7E8F7C]/30 text-[#4A5D48] text-xs font-bold tracking-wide">
            <Sparkles className="w-3.5 h-3.5 text-[#7E8F7C]" />
            <span>{t.welcomeTagline || 'Sovereign Agri-OS for Indian Farmers'}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#3A3A30] tracking-tight">
            {t.welcomeTitle || 'Welcome to Krishi-Setu'}
          </h1>
          <p className="text-xs sm:text-sm font-mono text-[#7A624E] font-medium tracking-wide">
            कृषि-सेतु • கிருஷி-சேது • Sovereign Agri Ecosystem
          </p>
        </div>

        {/* Professional Onboarding Pitch Message */}
        <div className="p-4 sm:p-5 rounded-3xl bg-white/90 backdrop-blur-sm border border-[#E8E2D9] shadow-sm space-y-3 text-left">
          <p className="text-xs sm:text-sm text-[#5A554C] leading-relaxed font-normal">
            {t.welcomeSubtitle ||
              'A zero-friction sovereign rail empowering tenant farmers (Bataidars) with legally-binding digital tenancy (Form-7A), instant pre-approved RBI ULI credit sanction, optical neural anti-counterfeit protection, and cold-chain price arbitrage.'}
          </p>

          {/* Core Feature Highlights */}
          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[#F0EBE4] text-center">
            <div className="p-2 rounded-2xl bg-[#FDFBF7] border border-[#E8E2D9]">
              <FileText className="w-4 h-4 text-[#7E8F7C] mx-auto mb-1" />
              <p className="text-[10px] font-bold text-[#3A3A30]">Patta-Setu</p>
              <p className="text-[9px] text-[#8C8275]">Digital Form-7A</p>
            </div>

            <div className="p-2 rounded-2xl bg-[#FDFBF7] border border-[#E8E2D9]">
              <ShieldCheck className="w-4 h-4 text-[#7A624E] mx-auto mb-1" />
              <p className="text-[10px] font-bold text-[#3A3A30]">Kavach</p>
              <p className="text-[9px] text-[#8C8275]">Camera QR Verify</p>
            </div>

            <div className="p-2 rounded-2xl bg-[#FDFBF7] border border-[#E8E2D9]">
              <Truck className="w-4 h-4 text-[#3D6B8C] mx-auto mb-1" />
              <p className="text-[10px] font-bold text-[#3A3A30]">Sheet-Vahan</p>
              <p className="text-[9px] text-[#8C8275]">Cold Reefer Pool</p>
            </div>
          </div>
        </div>

        {/* Institutional Regulatory Badges */}
        <div className="flex flex-wrap items-center justify-center gap-2 text-[10px] font-mono text-[#736B5E]">
          <span className="px-2.5 py-1 rounded-full bg-[#FAF7F2] border border-[#D9C5B2] font-semibold">
            🇮🇳 Digital India
          </span>
          <span className="px-2.5 py-1 rounded-full bg-[#FAF7F2] border border-[#D9C5B2] font-semibold">
            📜 Model Land Act 2026
          </span>
          <span className="px-2.5 py-1 rounded-full bg-[#FAF7F2] border border-[#D9C5B2] font-semibold">
            🏦 RBI ULI Enabled
          </span>
        </div>
      </div>

      {/* Bottom Splash Progress & Transition Bar */}
      <div className="w-full max-w-lg mx-auto space-y-3 z-10">
        {/* Animated Progress Bar */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs font-mono text-[#736B5E]">
            <span className="flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-[#7E8F7C] animate-spin" />
              <span>
                {currentLang === 'hi' 
                  ? `कमांड हब में स्वतः प्रवेश (${countdown}s)...` 
                  : currentLang === 'ta' 
                  ? `தானாகவே திறக்கிறது (${countdown}s)...` 
                  : `Transitioning to Command Hub in ${countdown}s...`}
              </span>
            </span>
            <span className="font-bold text-[#4A5D48]">{Math.round(progress)}%</span>
          </div>

          <div className="h-2 w-full bg-[#E8E2D9] rounded-full overflow-hidden p-0.5">
            <div
              className="h-full bg-gradient-to-r from-[#7E8F7C] to-[#4A5D48] rounded-full transition-all duration-75 ease-linear"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Fast Action Enter Button */}
        <button
          id="splash-enter-now-btn"
          onClick={() => handleManualEnter('hub')}
          className="w-full py-3 px-4 rounded-2xl bg-[#7E8F7C] hover:bg-[#6D7E6B] text-white font-bold text-xs shadow-md shadow-[#7E8F7C]/20 hover:brightness-105 active:scale-[0.99] transition-all flex items-center justify-center gap-2"
        >
          <span>{t.welcomeEnterHub || 'Enter Krishi-Setu OS Now'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

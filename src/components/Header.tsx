import React from 'react';
import { Language, FarmerProfile, ViewTab } from '../types';
import { TRANSLATIONS } from '../translations';
import { 
  Radio, 
  Mic, 
  Sparkles, 
  ShieldCheck, 
  Wifi, 
  BatteryCharging, 
  User, 
  Globe 
} from 'lucide-react';
import { playClickBeep } from '../utils/audio';

interface HeaderProps {
  currentLang: Language;
  onLanguageChange: (lang: Language) => void;
  farmer: FarmerProfile;
  onOpenVoice: () => void;
  onOpenProfile: () => void;
  currentView: ViewTab;
  onOpenWelcome?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentLang,
  onLanguageChange,
  farmer,
  onOpenVoice,
  onOpenProfile,
  onOpenWelcome,
}) => {
  const t = TRANSLATIONS[currentLang];

  return (
    <header className="sticky top-0 z-40 w-full bg-[#FDFBF7]/90 backdrop-blur-xl border-b border-[#E8E2D9] shadow-sm">
      {/* Top Status Telemetry Bar */}
      <div className="max-w-md mx-auto px-4 pt-1.5 pb-1 flex items-center justify-between text-[11px] font-mono text-[#7E8F7C] border-b border-[#F0EBE4]">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#7E8F7C] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#7E8F7C]"></span>
          </span>
          <span className="font-semibold tracking-wider text-[#4A5D48]">SENTINEL-2 SYNC</span>
          <span className="text-[#C8B4A0]">•</span>
          <span className="text-[#8C8275]">GPS: 25.86°N</span>
        </div>

        <div className="flex items-center gap-3 text-[#8C8275]">
          <div className="flex items-center gap-1">
            <Wifi className="w-3 h-3 text-[#7E8F7C]" />
            <span>5G RURAL</span>
          </div>
          <div className="flex items-center gap-1">
            <BatteryCharging className="w-3.5 h-3.5 text-[#7E8F7C]" />
            <span>98%</span>
          </div>
        </div>
      </div>

      {/* Main Header Row */}
      <div className="max-w-md mx-auto px-4 py-2.5 flex items-center justify-between gap-2">
        {/* App Identity & Brand */}
        <button
          id="header-brand-welcome-btn"
          onClick={() => {
            if (onOpenWelcome) {
              playClickBeep();
              onOpenWelcome();
            }
          }}
          className="flex items-center gap-2.5 text-left group hover:opacity-90 transition-opacity"
          title="Open Krishi-Setu Welcome Guide"
        >
          <div className="relative">
            <div className="w-10 h-10 rounded-2xl bg-[#D9C5B2] border-2 border-white shadow-sm flex items-center justify-center overflow-hidden group-hover:scale-105 transition-transform">
              <span className="text-xl">🌾</span>
            </div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-[#7E8F7C] border border-white flex items-center justify-center shadow-xs">
              <ShieldCheck className="w-2.5 h-2.5 text-white" />
            </div>
          </div>

          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-base font-semibold text-[#3A3A30] tracking-tight leading-none">
                {t.appName}
              </h1>
              <span className="text-[9px] font-semibold uppercase px-1.5 py-0.5 rounded-full bg-[#E8F0E7] text-[#4A5D48] border border-[#7E8F7C]/30">
                v2.6 OS
              </span>
            </div>
            <p className="text-[11px] text-[#7E8F7C] truncate max-w-[150px] sm:max-w-[180px] font-medium">
              {t.badgeGovt}
            </p>
          </div>
        </button>

        {/* Action Controls: Language Switcher & Voice AI & Profile */}
        <div className="flex items-center gap-1.5">
          {/* Language Selector Pill */}
          <div className="flex items-center bg-[#F2EDE7] rounded-full p-0.5 border border-[#E8E2D9] text-xs">
            {(['en', 'hi', 'ta'] as Language[]).map((lang) => (
              <button
                key={lang}
                id={`lang-btn-${lang}`}
                onClick={() => {
                  playClickBeep();
                  onLanguageChange(lang);
                }}
                className={`px-2 py-1 rounded-full font-medium transition-all ${
                  currentLang === lang
                    ? 'bg-[#7E8F7C] text-white font-bold shadow-xs'
                    : 'text-[#8C8275] hover:text-[#3A3A30]'
                }`}
              >
                {lang === 'en' ? 'EN' : lang === 'hi' ? 'हि' : 'த'}
              </button>
            ))}
          </div>

          {/* Voice AI Action Button */}
          <button
            id="voice-assistant-header-btn"
            onClick={() => {
              playClickBeep();
              onOpenVoice();
            }}
            className="relative group flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-[#7E8F7C] text-white hover:bg-[#6B7D69] text-xs font-semibold shadow-sm transition-all hover:scale-105 active:scale-95"
            title={t.voiceModalTitle}
          >
            <span className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#E8F0E7] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#E8F0E7]"></span>
            </span>
            <Mic className="w-3.5 h-3.5 text-white" />
            <span className="hidden xs:inline">{t.speakBtn}</span>
          </button>

          {/* Farmer Profile Pill */}
          <button
            id="farmer-profile-btn"
            onClick={() => {
              playClickBeep();
              onOpenProfile();
            }}
            className="w-8 h-8 rounded-full bg-[#F2EDE7] border border-[#E8E2D9] flex items-center justify-center text-[#556953] hover:text-[#3A3A30] hover:border-[#7E8F7C] transition-colors relative shadow-xs"
            title="Farmer e-KYC Profile"
          >
            <User className="w-4 h-4 text-[#7E8F7C]" />
            {farmer.isVerified && (
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-[#7E8F7C] rounded-full border border-white flex items-center justify-center">
                <span className="text-[7px] text-white font-bold">✓</span>
              </div>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Language, ViewTab, FarmerProfile } from './types';
import { TRANSLATIONS } from './translations';
import { PRESET_FARMERS } from './data/mockData';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { VoiceAssistantModal } from './components/VoiceAssistantModal';
import { FarmerProfileModal } from './components/FarmerProfileModal';
import { OnboardingView } from './components/OnboardingView';
import { CommandHubView } from './components/CommandHubView';
import { PattaSetuView } from './components/PattaSetuView';
import { KavachView } from './components/KavachView';
import { SheetVahanView } from './components/SheetVahanView';
import { playClickBeep } from './utils/audio';
import { triggerCelebrationConfetti } from './utils/confetti';
import { Mic, Smartphone, Monitor } from 'lucide-react';

export default function App() {
  const [currentLang, setCurrentLang] = useState<Language>('hi');
  const [currentView, setCurrentView] = useState<ViewTab>('hub');
  const [farmer, setFarmer] = useState<FarmerProfile>(PRESET_FARMERS.bihar);
  const [crates, setCrates] = useState<number>(60);
  const [isVoiceOpen, setIsVoiceOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isPhoneFrame, setIsPhoneFrame] = useState(false);

  const t = TRANSLATIONS[currentLang];

  // Voice AI Action Dispatcher
  const handleExecuteVoiceAction = (
    targetView: ViewTab,
    actionType: string,
    params: Record<string, any>
  ) => {
    if (targetView) {
      setCurrentView(targetView);
    }

    if (actionType === 'SET_CRATES' && params?.crates) {
      setCrates(params.crates);
    }

    if (actionType === 'DISBURSE_LOAN') {
      setFarmer(prev => ({
        ...prev,
        loanDisbursed: true,
        loanTxHash: `ULI-RBI-2026-${Math.floor(100000 + Math.random() * 900000)}-DBT`,
      }));
      triggerCelebrationConfetti();
    }
  };

  const handleSelectPreset = (presetKey: 'bihar' | 'tamil') => {
    setFarmer(PRESET_FARMERS[presetKey]);
    if (presetKey === 'tamil') {
      setCurrentLang('ta');
    } else {
      setCurrentLang('hi');
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#3A3A30] flex flex-col items-center justify-start relative selection:bg-[#7E8F7C] selection:text-white font-sans">
      {/* Background Natural Tones Lighting & Organic Shapes */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#7E8F7C]/10 rounded-full blur-[140px]" />
        <div className="absolute top-1/3 -right-40 w-[400px] h-[400px] bg-[#D9C5B2]/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-10 -left-40 w-[400px] h-[400px] bg-[#E8F0E7]/60 rounded-full blur-[120px]" />
      </div>

      {/* Desktop Responsive Layout Shell Container */}
      <div className={`w-full transition-all duration-300 ${
        isPhoneFrame 
          ? 'max-w-[430px] my-6 rounded-[48px] border-[8px] border-[#D9C5B2] shadow-2xl shadow-[#7E8F7C]/15 overflow-hidden bg-[#FDFBF7] ring-1 ring-[#E8E2D9]'
          : 'max-w-md min-h-screen bg-[#FDFBF7]'
      }`}>
        {/* Floating Top Header */}
        <Header
          currentLang={currentLang}
          onLanguageChange={setCurrentLang}
          farmer={farmer}
          onOpenVoice={() => setIsVoiceOpen(true)}
          onOpenProfile={() => setIsProfileOpen(true)}
          currentView={currentView}
        />

        {/* Main Content Viewport */}
        <main className="px-3.5 pt-3.5 pb-8 min-h-[80vh]">
          {currentView === 'onboarding' && (
            <OnboardingView
              currentLang={currentLang}
              farmer={farmer}
              onUpdateFarmer={setFarmer}
              onNavigate={setCurrentView}
            />
          )}

          {currentView === 'hub' && (
            <CommandHubView
              currentLang={currentLang}
              farmer={farmer}
              onNavigate={setCurrentView}
              onOpenVoice={() => setIsVoiceOpen(true)}
            />
          )}

          {currentView === 'patta-setu' && (
            <PattaSetuView
              currentLang={currentLang}
              farmer={farmer}
              onUpdateFarmer={setFarmer}
            />
          )}

          {currentView === 'kavach' && (
            <KavachView
              currentLang={currentLang}
            />
          )}

          {currentView === 'sheet-vahan' && (
            <SheetVahanView
              currentLang={currentLang}
              farmer={farmer}
              crates={crates}
              onChangeCrates={setCrates}
            />
          )}
        </main>

        {/* Mobile Tactile Bottom Navigation Bar */}
        <BottomNav
          currentView={currentView}
          onSelectView={setCurrentView}
          currentLang={currentLang}
        />
      </div>

      {/* Floating Action Voice Assistant Mic FAB (Mobile Viewport) */}
      <button
        id="floating-voice-fab"
        onClick={() => {
          playClickBeep();
          setIsVoiceOpen(true);
        }}
        className="fixed bottom-20 right-4 z-30 p-3.5 rounded-full bg-[#7E8F7C] text-white shadow-xl shadow-[#7E8F7C]/35 hover:bg-[#6B7D69] hover:scale-105 active:scale-95 transition-all flex items-center justify-center group"
        title="Speak to Gemini AI Voice OS"
      >
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#8AA088] opacity-50"></span>
        <Mic className="w-5 h-5 text-white font-bold" />
      </button>

      {/* Frame Mode Switcher for Desktop Preview */}
      <div className="fixed top-3 right-3 z-30 hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/90 border border-[#E8E2D9] text-xs text-[#7E8F7C] shadow-sm backdrop-blur-md">
        <button
          onClick={() => setIsPhoneFrame(false)}
          className={`px-2 py-0.5 rounded-full text-[11px] font-medium transition-all ${!isPhoneFrame ? 'bg-[#7E8F7C] text-white font-bold' : 'hover:text-[#3A3A30]'}`}
        >
          Fluid
        </button>
        <button
          onClick={() => setIsPhoneFrame(true)}
          className={`px-2 py-0.5 rounded-full text-[11px] font-medium transition-all ${isPhoneFrame ? 'bg-[#7E8F7C] text-white font-bold' : 'hover:text-[#3A3A30]'}`}
        >
          Mockup
        </button>
      </div>

      {/* Gemini Multilingual Voice Action Modal */}
      <VoiceAssistantModal
        isOpen={isVoiceOpen}
        onClose={() => setIsVoiceOpen(false)}
        currentLang={currentLang}
        currentView={currentView}
        farmer={farmer}
        onExecuteAction={handleExecuteVoiceAction}
      />

      {/* Farmer Profile e-KYC Drawer Modal */}
      <FarmerProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        currentLang={currentLang}
        farmer={farmer}
        onSelectPreset={handleSelectPreset}
      />
    </div>
  );
}

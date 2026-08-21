/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Language, ViewTab, FarmerProfile } from './types';
import { PRESET_FARMERS } from './data/mockData';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { OnboardingView } from './components/OnboardingView';
import { WelcomeScreen } from './components/WelcomeScreen';
import { CommandHubView } from './components/CommandHubView';
import { PattaSetuView } from './components/PattaSetuView';
import { KavachView } from './components/KavachView';
import { SheetVahanView } from './components/SheetVahanView';
import { VoiceAssistantModal } from './components/VoiceAssistantModal';
import { FarmerProfileModal } from './components/FarmerProfileModal';
import { Smartphone, Monitor } from 'lucide-react';
import { playClickBeep } from './utils/audio';

export default function App() {
  const [showWelcome, setShowWelcome] = useState(true);
  const [currentLang, setCurrentLang] = useState<Language>('hi');
  const [currentView, setCurrentView] = useState<ViewTab>('hub');
  const [farmer, setFarmer] = useState<FarmerProfile>(PRESET_FARMERS.bihar);
  const [isVoiceOpen, setIsVoiceOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [crates, setCrates] = useState(60);
  const [displayMode, setDisplayMode] = useState<'mobile' | 'fluid'>('mobile');

  const handleExecuteVoiceAction = (
    targetView: ViewTab,
    actionType: string,
    params: Record<string, any>
  ) => {
    setShowWelcome(false);
    setCurrentView(targetView);
    if (params.crates) {
      setCrates(Number(params.crates));
    }
    if (actionType === 'SANCTION_ULI_LOAN') {
      setFarmer((prev) => ({
        ...prev,
        loanDisbursed: true,
        loanTxHash: `ULI-RBI-2026-${Math.floor(100000 + Math.random() * 900000)}-DBT`,
      }));
    }
  };

  const handleSelectPreset = (presetKey: 'bihar' | 'tamil') => {
    const preset = PRESET_FARMERS[presetKey];
    setFarmer(preset);
    if (presetKey === 'tamil') {
      setCurrentLang('ta');
    } else {
      setCurrentLang('hi');
    }
  };

  const handleEnterFromWelcome = (targetTab: ViewTab = 'hub') => {
    setShowWelcome(false);
    setCurrentView(targetTab);
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#3A3A30] flex flex-col items-center">
      {/* Desktop Device View Mode Selector Bar */}
      <aside aria-label="Device Preview Toggle" className="hidden lg:flex items-center justify-between w-full max-w-4xl px-4 py-2 text-xs text-[#736B5E] border-b border-[#E8E2D9]/80 bg-[#F5EFEB]/50 backdrop-blur-sm">
        <div className="flex items-center gap-2 font-mono">
          <span className="w-2 h-2 rounded-full bg-[#7E8F7C] animate-pulse" />
          <span className="font-semibold text-[#4A5D48]">KRISHI-SETU v2.6</span>
          <span className="text-[#C8B4A0]">•</span>
          <span>Sovereign Farmer Agri-OS (Natural Tones)</span>
        </div>

        <div className="flex items-center gap-2">
          {!showWelcome && (
            <button
              onClick={() => {
                playClickBeep();
                setShowWelcome(true);
              }}
              className="px-2.5 py-1 rounded-lg text-xs font-semibold text-[#4A5D48] hover:bg-[#E8F0E7] border border-[#7E8F7C]/30 transition-all flex items-center gap-1"
            >
              <span>🌾 Welcome Guide</span>
            </button>
          )}

          <div className="flex items-center gap-1.5 bg-[#E8E2D9]/60 p-0.5 rounded-xl">
            <button
              onClick={() => {
                playClickBeep();
                setDisplayMode('mobile');
              }}
              className={`px-3 py-1 rounded-lg font-medium flex items-center gap-1.5 transition-all ${
                displayMode === 'mobile'
                  ? 'bg-white text-[#3A3A30] shadow-xs font-bold'
                  : 'text-[#736B5E] hover:text-[#3A3A30]'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Mobile Canvas</span>
            </button>

            <button
              onClick={() => {
                playClickBeep();
                setDisplayMode('fluid');
              }}
              className={`px-3 py-1 rounded-lg font-medium flex items-center gap-1.5 transition-all ${
                displayMode === 'fluid'
                  ? 'bg-white text-[#3A3A30] shadow-xs font-bold'
                  : 'text-[#736B5E] hover:text-[#3A3A30]'
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
              <span>Fluid View</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Container */}
      <div
        className={`w-full transition-all duration-300 ${
          displayMode === 'mobile'
            ? 'max-w-md min-h-screen bg-[#FDFBF7] border-x border-[#E8E2D9] shadow-xl relative'
            : 'max-w-3xl min-h-screen bg-[#FDFBF7] border-x border-[#E8E2D9] shadow-xl relative'
        }`}
      >
        {showWelcome ? (
          <WelcomeScreen
            currentLang={currentLang}
            onLanguageChange={setCurrentLang}
            farmer={farmer}
            onSelectPreset={handleSelectPreset}
            onEnterApp={handleEnterFromWelcome}
          />
        ) : (
          <>
            {/* Header */}
            <Header
              currentLang={currentLang}
              onLanguageChange={setCurrentLang}
              farmer={farmer}
              onOpenVoice={() => setIsVoiceOpen(true)}
              onOpenProfile={() => setIsProfileOpen(true)}
              currentView={currentView}
              onOpenWelcome={() => setShowWelcome(true)}
            />

            {/* Viewport Content */}
            <main className="px-4 py-3 min-h-[calc(100vh-140px)]">
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
                <KavachView currentLang={currentLang} />
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

            {/* Bottom Navigation */}
            <BottomNav
              currentView={currentView}
              onSelectView={setCurrentView}
              currentLang={currentLang}
            />
          </>
        )}
      </div>

      {/* Voice Assistant Modal */}
      <VoiceAssistantModal
        isOpen={isVoiceOpen}
        onClose={() => setIsVoiceOpen(false)}
        currentLang={currentLang}
        onLanguageChange={setCurrentLang}
        currentView={currentView}
        farmer={farmer}
        onExecuteAction={handleExecuteVoiceAction}
      />

      {/* Farmer Profile Modal */}
      <FarmerProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        currentLang={currentLang}
        farmer={farmer}
        onSelectPreset={handleSelectPreset}
        onOpenWelcome={() => setShowWelcome(true)}
      />
    </div>
  );
}

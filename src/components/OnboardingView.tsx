import React, { useState } from 'react';
import { Language, FarmerProfile, ViewTab } from '../types';
import { TRANSLATIONS } from '../translations';
import { PRESET_FARMERS } from '../data/mockData';
import { 
  ShieldCheck, 
  Sparkles, 
  CheckCircle2, 
  User, 
  MapPin, 
  LandPlot, 
  Sprout, 
  Key, 
  ArrowRight, 
  FileBadge, 
  Check, 
  HelpCircle 
} from 'lucide-react';
import { playSuccessChime, playClickBeep } from '../utils/audio';

interface OnboardingViewProps {
  currentLang: Language;
  farmer: FarmerProfile;
  onUpdateFarmer: (updated: FarmerProfile) => void;
  onNavigate: (view: ViewTab) => void;
}

export const OnboardingView: React.FC<OnboardingViewProps> = ({
  currentLang,
  farmer,
  onUpdateFarmer,
  onNavigate,
}) => {
  const t = TRANSLATIONS[currentLang];
  const [selectedPreset, setSelectedPreset] = useState<'bihar' | 'tamil' | 'custom'>('bihar');
  const [otpSent, setOtpSent] = useState(false);
  const [otpValue, setOtpValue] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(farmer.isVerified);

  // Form State
  const [formData, setFormData] = useState<FarmerProfile>(farmer);

  const handleSelectPreset = (presetKey: 'bihar' | 'tamil') => {
    playClickBeep();
    setSelectedPreset(presetKey);
    const preset = PRESET_FARMERS[presetKey];
    setFormData(preset);
    onUpdateFarmer(preset);
    setOtpSent(false);
    setOtpValue('');
  };

  const handleSimulateOtp = () => {
    playClickBeep();
    setOtpSent(true);
    // Autofill OTP simulation after 600ms for seamless user experience
    setTimeout(() => {
      setOtpValue('789456');
    }, 600);
  };

  const handleVerifyOtp = () => {
    setIsVerifying(true);
    playClickBeep();

    setTimeout(() => {
      setIsVerifying(false);
      setIsVerified(true);
      const verifiedProfile = {
        ...formData,
        isVerified: true,
        agriStackId: formData.agriStackId || `KA-${formData.state.slice(0, 3).toUpperCase()}-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      };
      onUpdateFarmer(verifiedProfile);
      playSuccessChime();
      
      // Auto navigate to Command Hub after 800ms
      setTimeout(() => {
        onNavigate('hub');
      }, 800);
    }, 900);
  };

  return (
    <div className="space-y-4 pb-20 animate-fade-in">
      {/* Top Banner */}
      <div className="p-4 rounded-3xl bg-[#7E8F7C] text-white shadow-sm relative overflow-hidden">
        <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        
        <div className="flex items-center gap-2 mb-1.5">
          <span className="p-1.5 rounded-xl bg-white/20 text-white border border-white/30">
            <ShieldCheck className="w-4 h-4" />
          </span>
          <span className="text-[11px] font-mono uppercase tracking-wider text-white font-bold">
            AGRISTACK SOVEREIGN e-KYC
          </span>
        </div>

        <h2 className="text-lg font-bold text-white tracking-tight leading-tight">
          {t.onboardingTitle}
        </h2>
        <p className="text-xs text-white/90 mt-1 leading-relaxed font-normal">
          {t.onboardingSubtitle}
        </p>

        {isVerified && (
          <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 border border-white/40 text-white text-xs font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5 text-white" />
            <span>{t.verifiedAgriStackBadge}</span>
          </div>
        )}
      </div>

      {/* 1-Click Demo Profiles Presets */}
      <div className="p-4 rounded-3xl bg-white border border-[#E8E2D9] shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-[#7E8F7C]" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#3A3A30]">
              {t.quickDemoPresets}
            </h3>
          </div>
          <span className="text-[10px] text-[#7E8F7C] font-mono font-bold">1-TAP PRE-FILL</span>
        </div>

        <div className="grid grid-cols-1 gap-2">
          {/* Preset 1: Bihar */}
          <button
            id="preset-bihar-btn"
            onClick={() => handleSelectPreset('bihar')}
            className={`p-3 rounded-2xl text-left border transition-all flex items-center justify-between ${
              selectedPreset === 'bihar'
                ? 'bg-[#E8F0E7] border-[#7E8F7C] text-[#3A3A30] shadow-xs'
                : 'bg-[#FDFBF7] border-[#E8E2D9] text-[#736B5E] hover:border-[#7E8F7C]/50'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#D9C5B2] border border-white flex items-center justify-center text-sm shadow-xs">
                🌾
              </div>
              <div>
                <p className="text-xs font-bold text-[#3A3A30] leading-tight">
                  {currentLang === 'hi' ? PRESET_FARMERS.bihar.nameHi : currentLang === 'ta' ? PRESET_FARMERS.bihar.nameTa : PRESET_FARMERS.bihar.name}
                </p>
                <p className="text-[11px] text-[#736B5E] mt-0.5 font-medium">
                  Samastipur, Bihar • 3.5 Acres • Bataidar (Tomatoes)
                </p>
              </div>
            </div>
            {selectedPreset === 'bihar' && (
              <div className="w-5 h-5 rounded-full bg-[#7E8F7C] text-white flex items-center justify-center flex-shrink-0 shadow-xs">
                <Check className="w-3 h-3 stroke-[3]" />
              </div>
            )}
          </button>

          {/* Preset 2: Tamil Nadu */}
          <button
            id="preset-tamil-btn"
            onClick={() => handleSelectPreset('tamil')}
            className={`p-3 rounded-2xl text-left border transition-all flex items-center justify-between ${
              selectedPreset === 'tamil'
                ? 'bg-[#F2EDE7] border-[#BFA893] text-[#3A3A30] shadow-xs'
                : 'bg-[#FDFBF7] border-[#E8E2D9] text-[#736B5E] hover:border-[#BFA893]/50'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#C8B4A0] border border-white flex items-center justify-center text-sm shadow-xs">
                🌴
              </div>
              <div>
                <p className="text-xs font-bold text-[#3A3A30] leading-tight">
                  {currentLang === 'hi' ? PRESET_FARMERS.tamil.nameHi : currentLang === 'ta' ? PRESET_FARMERS.tamil.nameTa : PRESET_FARMERS.tamil.name}
                </p>
                <p className="text-[11px] text-[#736B5E] mt-0.5 font-medium">
                  Thanjavur, TN • 4.2 Acres • Cauvery Delta (Paddy & Banana)
                </p>
              </div>
            </div>
            {selectedPreset === 'tamil' && (
              <div className="w-5 h-5 rounded-full bg-[#BFA893] text-white flex items-center justify-center flex-shrink-0 shadow-xs">
                <Check className="w-3 h-3 stroke-[3]" />
              </div>
            )}
          </button>
        </div>
      </div>

      {/* Form Fields Card */}
      <div className="p-4 rounded-3xl bg-white border border-[#E8E2D9] shadow-sm space-y-3.5">
        {/* Name & Aadhaar Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-[11px] font-semibold text-[#5A554C] mb-1">
              {t.farmerFullName}
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-[#8C8275] absolute left-3 top-2.5" />
              <input
                id="farmer-name-input"
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full pl-9 pr-3 py-2 text-xs bg-[#FDFBF7] border border-[#E8E2D9] rounded-xl text-[#3A3A30] focus:outline-none focus:border-[#7E8F7C] font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-[#5A554C] mb-1">
              {t.aadhaarNumber}
            </label>
            <div className="relative">
              <FileBadge className="w-4 h-4 text-[#7E8F7C] absolute left-3 top-2.5" />
              <input
                id="aadhaar-input"
                type="text"
                value={formData.aadhaarMasked}
                onChange={(e) => setFormData({ ...formData, aadhaarMasked: e.target.value })}
                className="w-full pl-9 pr-3 py-2 text-xs bg-[#FDFBF7] border border-[#E8E2D9] rounded-xl text-[#4A5D48] font-mono font-medium focus:outline-none focus:border-[#7E8F7C]"
              />
            </div>
          </div>
        </div>

        {/* Landholding Slider Control */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-[11px] font-semibold text-[#5A554C] flex items-center gap-1.5">
              <LandPlot className="w-3.5 h-3.5 text-[#7E8F7C]" />
              <span>{t.landholdingSize}</span>
            </label>
            <span className="px-2 py-0.5 rounded-lg bg-[#E8F0E7] border border-[#7E8F7C]/30 text-[#4A5D48] text-xs font-mono font-bold">
              {formData.landholdingAcres.toFixed(1)} Acres
            </span>
          </div>

          <input
            id="landholding-slider"
            type="range"
            min="0.5"
            max="15.0"
            step="0.1"
            value={formData.landholdingAcres}
            onChange={(e) => setFormData({ ...formData, landholdingAcres: parseFloat(e.target.value) })}
            className="w-full h-2 bg-[#F2EDE7] rounded-lg appearance-none cursor-pointer accent-[#7E8F7C]"
          />
          <p className="text-[10px] text-[#8C8275] mt-1 font-medium">
            {t.landSliderHint}
          </p>
        </div>

        {/* Tenancy Category & Crop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-[11px] font-semibold text-[#5A554C] mb-1">
              {t.tenancyStatus}
            </label>
            <select
              id="tenancy-select"
              value={formData.tenancyType}
              onChange={(e) => setFormData({ ...formData, tenancyType: e.target.value as any })}
              className="w-full px-3 py-2 text-xs bg-[#FDFBF7] border border-[#E8E2D9] rounded-xl text-[#3A3A30] font-medium focus:outline-none focus:border-[#7E8F7C]"
            >
              <option value="Bataidar / Sharecropper">Bataidar / Sharecropper (Tenant)</option>
              <option value="Owner Cultivator">Owner Cultivator (Bhoomi-Swami)</option>
              <option value="Oral Lessee">Oral Lessee (Form-7A Eligible)</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-[#5A554C] mb-1">
              {t.primaryCropType}
            </label>
            <div className="relative">
              <Sprout className="w-4 h-4 text-[#7E8F7C] absolute left-3 top-2.5" />
              <input
                id="crop-type-input"
                type="text"
                value={formData.primaryCrop}
                onChange={(e) => setFormData({ ...formData, primaryCrop: e.target.value })}
                className="w-full pl-9 pr-3 py-2 text-xs bg-[#FDFBF7] border border-[#E8E2D9] rounded-xl text-[#3A3A30] font-medium focus:outline-none focus:border-[#7E8F7C]"
              />
            </div>
          </div>
        </div>

        {/* Village & Khasra */}
        <div className="p-3 rounded-2xl bg-[#FDFBF7] border border-[#E8E2D9] text-xs text-[#3A3A30] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-[#7E8F7C] flex-shrink-0" />
            <div>
              <p className="font-semibold text-[#3A3A30]">{formData.village}, {formData.district}, {formData.state}</p>
              <p className="text-[10px] text-[#736B5E] font-mono">{formData.khasraPlot}</p>
            </div>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#E8F0E7] text-[#4A5D48] border border-[#7E8F7C]/30 font-semibold">
            GEO-LOCKED
          </span>
        </div>
      </div>

      {/* Biometric OTP Simulation Box */}
      <div className="p-4 rounded-3xl bg-white border border-[#E8E2D9] shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Key className="w-4 h-4 text-[#7E8F7C]" />
            <h3 className="text-xs font-bold text-[#3A3A30] uppercase tracking-wider">
              {otpSent ? t.enterOtp : t.sendOtp}
            </h3>
          </div>
          <span className="text-[10px] font-mono text-[#7E8F7C] font-semibold">UIDAI RE-AUTH</span>
        </div>

        {!otpSent ? (
          <button
            id="send-otp-btn"
            onClick={handleSimulateOtp}
            className="w-full py-3 rounded-2xl bg-[#7E8F7C] hover:bg-[#6B7D69] text-white text-xs font-bold shadow-md shadow-[#7E8F7C]/20 hover:brightness-105 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            <Key className="w-4 h-4" />
            <span>{t.sendOtp}</span>
          </button>
        ) : (
          <div className="space-y-3 animate-fade-in">
            <div className="flex items-center gap-2">
              <input
                id="otp-input-field"
                type="text"
                maxLength={6}
                value={otpValue}
                onChange={(e) => setOtpValue(e.target.value)}
                placeholder="789456"
                className="flex-1 px-4 py-2.5 text-center tracking-[0.5em] text-base font-mono bg-[#FDFBF7] border border-[#E8E2D9] rounded-2xl text-[#3A3A30] focus:outline-none focus:border-[#7E8F7C] font-bold"
              />
              <button
                onClick={() => setOtpValue('789456')}
                className="px-3 py-2.5 rounded-2xl bg-[#F2EDE7] hover:bg-[#E8E2D9] text-[#5A554C] text-[10px] font-mono border border-[#E8E2D9] font-bold"
                title="Autofill Simulated OTP"
              >
                AUTOFILL
              </button>
            </div>

            <button
              id="verify-otp-and-launch-btn"
              onClick={handleVerifyOtp}
              disabled={otpValue.length < 6 || isVerifying}
              className="w-full py-3 rounded-2xl bg-[#7E8F7C] hover:bg-[#6B7D69] text-white text-xs font-bold shadow-md shadow-[#7E8F7C]/25 hover:brightness-105 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-40"
            >
              {isVerifying ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Verifying UIDAI Hash...</span>
                </span>
              ) : (
                <>
                  <span>{t.verifyAndLaunch}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

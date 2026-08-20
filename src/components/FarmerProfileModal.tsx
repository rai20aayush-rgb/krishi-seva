import React from 'react';
import { Language, FarmerProfile } from '../types';
import { TRANSLATIONS } from '../translations';
import { PRESET_FARMERS } from '../data/mockData';
import { 
  X, 
  User, 
  ShieldCheck, 
  LandPlot, 
  Landmark, 
  Phone, 
  MapPin, 
  Award, 
  CheckCircle2, 
  Sparkles 
} from 'lucide-react';
import { playClickBeep } from '../utils/audio';

interface FarmerProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLang: Language;
  farmer: FarmerProfile;
  onSelectPreset: (presetKey: 'bihar' | 'tamil') => void;
}

export const FarmerProfileModal: React.FC<FarmerProfileModalProps> = ({
  isOpen,
  onClose,
  currentLang,
  farmer,
  onSelectPreset,
}) => {
  const t = TRANSLATIONS[currentLang];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#3A3A30]/50 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md bg-[#FDFBF7] text-[#3A3A30] border border-[#E8E2D9] rounded-3xl p-5 shadow-2xl max-h-[90vh] overflow-y-auto space-y-4">
        {/* Close Button */}
        <button
          id="close-profile-modal-btn"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-[#F2EDE7] text-[#736B5E] hover:text-[#3A3A30] border border-[#E8E2D9]"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Farmer Header */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#7E8F7C] p-[1.5px] shadow-sm">
            <div className="w-full h-full bg-[#E8F0E7] rounded-[14px] flex items-center justify-center text-xl">
              🌾
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-[#3A3A30]">
                {currentLang === 'hi' ? farmer.nameHi : currentLang === 'ta' ? farmer.nameTa : farmer.name}
              </h2>
              <span className="px-1.5 py-0.5 rounded-full bg-[#E8F0E7] text-[#4A5D48] text-[10px] font-mono font-bold border border-[#7E8F7C]/40">
                e-KYC VERIFIED
              </span>
            </div>
            <p className="text-xs text-[#736B5E] font-mono">
              AgriStack ID: {farmer.agriStackId}
            </p>
          </div>
        </div>

        {/* Details Grid */}
        <div className="p-3.5 rounded-2xl bg-white border border-[#E8E2D9] space-y-2.5 text-xs shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[#736B5E] flex items-center gap-1.5 font-medium">
              <Phone className="w-3.5 h-3.5 text-[#7E8F7C]" />
              <span>Mobile Contact:</span>
            </span>
            <span className="font-mono text-[#3A3A30] font-bold">{farmer.phone}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-[#736B5E] flex items-center gap-1.5 font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-[#4A5D48]" />
              <span>Aadhaar UID:</span>
            </span>
            <span className="font-mono text-[#4A5D48] font-bold">{farmer.aadhaarMasked}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-[#736B5E] flex items-center gap-1.5 font-medium">
              <LandPlot className="w-3.5 h-3.5 text-[#7A624E]" />
              <span>Cultivated Area:</span>
            </span>
            <span className="font-mono text-[#3A3A30] font-bold">{farmer.landholdingAcres} Acres ({farmer.tenancyType})</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-[#736B5E] flex items-center gap-1.5 font-medium">
              <MapPin className="w-3.5 h-3.5 text-[#7E8F7C]" />
              <span>Khasra Record:</span>
            </span>
            <span className="font-mono text-[#5A554C] font-semibold">{farmer.khasraPlot}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-[#736B5E] flex items-center gap-1.5 font-medium">
              <Landmark className="w-3.5 h-3.5 text-[#4A5D48]" />
              <span>DBT Bank Account:</span>
            </span>
            <span className="font-mono text-[#5A554C] font-semibold">{farmer.bankAccountMasked}</span>
          </div>
        </div>

        {/* Fast Switch Preset Profiles */}
        <div className="space-y-2">
          <p className="text-[11px] font-semibold text-[#5A554C] uppercase tracking-wider">
            Switch Demo Farmer Profile
          </p>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                playClickBeep();
                onSelectPreset('bihar');
                onClose();
              }}
              className="p-2.5 rounded-2xl bg-white hover:bg-[#E8F0E7] border border-[#E8E2D9] hover:border-[#7E8F7C]/40 text-left text-xs transition-all shadow-xs"
            >
              <p className="font-bold text-[#3A3A30]">Rameshwar Singh</p>
              <p className="text-[10px] text-[#736B5E]">Bihar • 3.5 Acres</p>
            </button>

            <button
              onClick={() => {
                playClickBeep();
                onSelectPreset('tamil');
                onClose();
              }}
              className="p-2.5 rounded-2xl bg-white hover:bg-[#E8F0E7] border border-[#E8E2D9] hover:border-[#7E8F7C]/40 text-left text-xs transition-all shadow-xs"
            >
              <p className="font-bold text-[#3A3A30]">Annamalai Selvan</p>
              <p className="text-[10px] text-[#736B5E]">Tamil Nadu • 4.2 Acres</p>
            </button>
          </div>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-2xl bg-[#7E8F7C] hover:bg-[#6B7D69] text-white text-xs font-bold transition-colors shadow-sm"
        >
          {t.close}
        </button>
      </div>
    </div>
  );
};

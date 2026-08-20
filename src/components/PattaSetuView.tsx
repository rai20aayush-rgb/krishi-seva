import React, { useState } from 'react';
import { Language, FarmerProfile } from '../types';
import { TRANSLATIONS } from '../translations';
import { SATELLITE_NDVI_TIMELINE } from '../data/mockData';
import { triggerCelebrationConfetti } from '../utils/confetti';
import { playSuccessChime, playClickBeep } from '../utils/audio';
import { 
  FileText, 
  CheckCircle2, 
  ShieldCheck, 
  Satellite, 
  Award, 
  TrendingUp, 
  Landmark, 
  ArrowRight, 
  Download, 
  Sparkles, 
  Lock, 
  Check, 
  Layers, 
  Info 
} from 'lucide-react';

interface PattaSetuViewProps {
  currentLang: Language;
  farmer: FarmerProfile;
  onUpdateFarmer: (updated: FarmerProfile) => void;
}

export const PattaSetuView: React.FC<PattaSetuViewProps> = ({
  currentLang,
  farmer,
  onUpdateFarmer,
}) => {
  const t = TRANSLATIONS[currentLang];
  const [isDisbursing, setIsDisbursing] = useState(false);
  const [showFullContract, setShowFullContract] = useState(false);
  const [selectedNdviPoint, setSelectedNdviPoint] = useState(SATELLITE_NDVI_TIMELINE[5]);

  const handleDisburseLoan = () => {
    setIsDisbursing(true);
    playClickBeep();

    setTimeout(() => {
      setIsDisbursing(false);
      const updated: FarmerProfile = {
        ...farmer,
        loanDisbursed: true,
        loanTxHash: `ULI-RBI-2026-${Math.floor(100000 + Math.random() * 900000)}-DBT`,
      };
      onUpdateFarmer(updated);
      triggerCelebrationConfetti();
      playSuccessChime();
    }, 1200);
  };

  return (
    <div className="space-y-4 pb-20 animate-fade-in">
      {/* Top Header Card */}
      <div className="p-4 rounded-3xl bg-[#7E8F7C] text-white shadow-sm relative overflow-hidden">
        <div className="absolute -right-8 -top-8 w-36 h-36 bg-white/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-center gap-2 mb-1.5">
          <span className="p-1.5 rounded-xl bg-white/20 text-white border border-white/30">
            <FileText className="w-4 h-4" />
          </span>
          <span className="text-[11px] font-mono uppercase tracking-wider text-white font-bold">
            MODULE 1 • DIGITAL TENANCY & ULI
          </span>
        </div>

        <h2 className="text-lg font-bold text-white tracking-tight leading-tight">
          {t.pattaTitle}
        </h2>
        <p className="text-xs text-white/90 mt-1 leading-relaxed font-normal">
          {t.pattaSubtitle}
        </p>
      </div>

      {/* Form-7A Bilateral Tenancy Agreement Card */}
      <div className="p-4 rounded-3xl bg-white border border-[#E8E2D9] shadow-sm space-y-3">
        <div className="flex items-center justify-between border-b border-[#F0EBE4] pb-2.5">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#7E8F7C]" />
            <h3 className="text-xs font-bold text-[#3A3A30] uppercase tracking-wider">
              {t.form7aBadge}
            </h3>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#E8F0E7] text-[#4A5D48] border border-[#7E8F7C]/30 font-semibold">
            STATE VALIDATED
          </span>
        </div>

        {/* Contract Key Terms Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          <div className="p-2.5 rounded-2xl bg-[#FDFBF7] border border-[#E8E2D9]">
            <p className="text-[10px] text-[#8C8275]">{t.landowner}</p>
            <p className="font-bold text-[#3A3A30]">{farmer.landownerName}</p>
            <span className="text-[9px] text-[#7E8F7C] font-mono font-semibold">UIDAI Aadhaar Linked</span>
          </div>

          <div className="p-2.5 rounded-2xl bg-[#FDFBF7] border border-[#E8E2D9]">
            <p className="text-[10px] text-[#8C8275]">{t.tenantFarmer}</p>
            <p className="font-bold text-[#3A3A30]">{currentLang === 'hi' ? farmer.nameHi : currentLang === 'ta' ? farmer.nameTa : farmer.name}</p>
            <span className="text-[9px] text-[#7A624E] font-mono font-semibold">AgriStack ID: {farmer.agriStackId}</span>
          </div>

          <div className="p-2.5 rounded-2xl bg-[#FDFBF7] border border-[#E8E2D9]">
            <p className="text-[10px] text-[#8C8275]">{t.plotKhasra}</p>
            <p className="font-semibold text-[#4A5D48] font-mono">{farmer.khasraPlot} ({farmer.landholdingAcres} Acres)</p>
          </div>

          <div className="p-2.5 rounded-2xl bg-[#FDFBF7] border border-[#E8E2D9]">
            <p className="text-[10px] text-[#8C8275]">{t.harvestShare}</p>
            <p className="font-semibold text-[#7A624E] font-mono">{farmer.shareRatio}</p>
          </div>
        </div>

        {/* Protective Non-Encumbrance Legal Covenant */}
        <div className="p-3 rounded-2xl bg-[#FAF7F2] border border-[#D9C5B2] text-xs">
          <div className="flex items-center gap-1.5 text-[#7A624E] font-bold mb-1">
            <Lock className="w-3.5 h-3.5" />
            <span className="text-[11px] uppercase tracking-wide">{t.nonMortgageClause}</span>
          </div>
          <p className="text-[11px] text-[#5A554C] leading-relaxed">
            {t.clauseText}
          </p>
        </div>

        {/* Mutual Aadhaar e-Sign Stamps */}
        <div className="pt-1">
          <p className="text-[11px] font-semibold text-[#5A554C] mb-2">{t.eSignStamps}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div className="p-2.5 rounded-2xl bg-[#E8F0E7] border border-[#7E8F7C]/30 flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-[#7E8F7C] text-white flex items-center justify-center flex-shrink-0 shadow-xs">
                <Check className="w-4 h-4 stroke-[3]" />
              </div>
              <div className="text-[11px]">
                <p className="font-bold text-[#3A3A30]">{t.landownerSigned}</p>
                <p className="text-[9px] text-[#7E8F7C] font-mono">18-Aug-2026 10:14 IST • Cert #9921</p>
              </div>
            </div>

            <div className="p-2.5 rounded-2xl bg-[#F2EDE7] border border-[#BFA893] flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-[#BFA893] text-white flex items-center justify-center flex-shrink-0 shadow-xs">
                <Check className="w-4 h-4 stroke-[3]" />
              </div>
              <div className="text-[11px]">
                <p className="font-bold text-[#3A3A30]">{t.tenantSigned}</p>
                <p className="text-[9px] text-[#7A624E] font-mono">18-Aug-2026 10:22 IST • Cert #9922</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sentinel-2 Multi-Spectral NDVI Health Visualizer */}
      <div className="p-4 rounded-3xl bg-white border border-[#E8E2D9] shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Satellite className="w-4 h-4 text-[#7E8F7C] animate-pulse" />
            <h3 className="text-xs font-bold text-[#3A3A30] uppercase tracking-wider">
              {t.ndviVisualizerTitle}
            </h3>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#E8F0E7] text-[#4A5D48] border border-[#7E8F7C]/30 font-bold">
            NDVI: 0.82 (OPTIMAL KHARIF)
          </span>
        </div>

        {/* Multi-spectral Satellite Imagery Viewport Simulation */}
        <div className="relative h-44 rounded-2xl bg-[#F8F5EE] overflow-hidden border border-[#E8E2D9] flex flex-col items-center justify-center">
          {/* Synthetic False-Color NDVI Farm Polygon Background */}
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-80"
            style={{
              backgroundImage: `radial-gradient(ellipse at center, rgba(126, 143, 124, 0.45) 0%, rgba(217, 197, 178, 0.35) 45%, rgba(200, 180, 160, 0.4) 100%), 
                                repeating-linear-gradient(45deg, rgba(126, 143, 124, 0.08) 0px, rgba(126, 143, 124, 0.08) 10px, transparent 10px, transparent 20px)`
            }}
          />

          {/* SVG Farm Boundaries and Telemetry Polygon */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 200">
            {/* Geo-fenced Polygon */}
            <polygon
              points="100,40 320,30 350,150 70,160"
              fill="rgba(126, 143, 124, 0.3)"
              stroke="#7E8F7C"
              strokeWidth="2.5"
              strokeDasharray="4 2"
            />
            {/* Field centroid marker */}
            <circle cx="210" cy="95" r="5" fill="#7E8F7C" className="animate-ping" />
            <circle cx="210" cy="95" r="4" fill="#4A5D48" />
            {/* Polygon Coordinates overlay */}
            <text x="110" y="35" fill="#3A3A30" fontSize="9" fontFamily="monospace" fontWeight="bold">LAT: 25.8624° N</text>
            <text x="260" y="175" fill="#3A3A30" fontSize="9" fontFamily="monospace" fontWeight="bold">LON: 85.7812° E</text>
          </svg>

          {/* Floating Live Telemetry Badge inside HUD */}
          <div className="absolute top-2 left-2 px-2 py-1 rounded-lg bg-white/90 backdrop-blur-md border border-[#E8E2D9] text-[10px] font-mono text-[#4A5D48] font-bold flex items-center gap-1 shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-[#7E8F7C] animate-pulse" />
            <span>Khasra #412/9B • 3.5 Acres Biomass Lock</span>
          </div>

          <div className="absolute bottom-2 right-2 px-2 py-1 rounded-lg bg-white/90 backdrop-blur-md border border-[#E8E2D9] text-[10px] font-mono text-[#7A624E] font-semibold shadow-xs">
            <span>Band 8 (NIR) / Band 4 (Red)</span>
          </div>
        </div>

        {/* NDVI Color Scale Bar */}
        <div>
          <div className="flex justify-between text-[10px] font-mono text-[#8C8275] mb-1">
            <span>0.0 (Bare Soil)</span>
            <span>0.5 (Moderate)</span>
            <span className="text-[#4A5D48] font-bold">0.74 (Peak Crop)</span>
            <span>1.0 (Dense Canopy)</span>
          </div>
          <div className="h-2 w-full rounded-full bg-gradient-to-r from-[#D9C5B2] via-[#C8B4A0] via-[#A3B899] to-[#7E8F7C] shadow-inner" />
        </div>

        {/* 3-Year Historical Biomass Health Curve Bar Selection */}
        <div>
          <p className="text-[11px] font-semibold text-[#5A554C] mb-2">{t.historicalTimeline}</p>
          <div className="grid grid-cols-6 gap-1.5">
            {SATELLITE_NDVI_TIMELINE.map((item, idx) => {
              const isSelected = selectedNdviPoint.month === item.month;
              return (
                <button
                  key={idx}
                  onClick={() => {
                    playClickBeep();
                    setSelectedNdviPoint(item);
                  }}
                  className={`p-2 rounded-xl text-center border transition-all ${
                    isSelected
                      ? 'bg-[#E8F0E7] border-[#7E8F7C] text-[#3A3A30] shadow-xs'
                      : 'bg-[#FDFBF7] border-[#E8E2D9] text-[#736B5E] hover:border-[#7E8F7C]/50'
                  }`}
                >
                  <p className="text-[9px] font-mono">{item.month}</p>
                  <p className="text-xs font-bold text-[#4A5D48] font-mono mt-0.5">{item.ndvi}</p>
                </button>
              );
            })}
          </div>

          <div className="mt-2 p-2.5 rounded-xl bg-[#FDFBF7] border border-[#E8E2D9] text-[11px] text-[#3A3A30] flex items-center justify-between">
            <span>{selectedNdviPoint.month}: <strong>{selectedNdviPoint.biomass}</strong></span>
            <span className="text-[#7A624E] font-mono font-medium">Rainfall: {selectedNdviPoint.rainfallMm}mm</span>
          </div>
        </div>
      </div>

      {/* RBI ULI Pre-Approved Sovereign Loan Box */}
      <div className="p-5 rounded-3xl bg-white border border-[#E8E2D9] shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Landmark className="w-5 h-5 text-[#7E8F7C]" />
            <div>
              <h3 className="text-xs font-bold text-[#3A3A30] uppercase tracking-wider">
                {t.uliLoanBoxTitle}
              </h3>
              <p className="text-[10px] text-[#7E8F7C] font-medium">{t.collateralFree}</p>
            </div>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#E8F0E7] text-[#4A5D48] border border-[#7E8F7C]/30 font-bold">
            {t.interestRate}
          </span>
        </div>

        {/* Loan Amount Box */}
        <div className="p-4 rounded-2xl bg-[#FDFBF7] border border-[#E8E2D9] flex items-center justify-between">
          <div>
            <p className="text-[10px] text-[#8C8275] uppercase font-mono">{t.preApprovedLimit}</p>
            <p className="text-2xl font-black text-[#4A5D48] font-mono tracking-tight">
              ₹{farmer.loanSanctionedAmount.toLocaleString('en-IN')}
            </p>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-[#8C8275]">DBT Bank Payout</p>
            <p className="text-xs text-[#3A3A30] font-mono font-semibold">{farmer.bankAccountMasked}</p>
          </div>
        </div>

        {/* Disburse Action or Success Confirmation */}
        {!farmer.loanDisbursed ? (
          <button
            id="disburse-loan-btn"
            onClick={handleDisburseLoan}
            disabled={isDisbursing}
            className="w-full py-3.5 rounded-2xl bg-[#7E8F7C] hover:bg-[#6B7D69] text-white text-xs font-bold shadow-md shadow-[#7E8F7C]/25 hover:brightness-105 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            {isDisbursing ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Executing RBI ULI Smart Disbursal...</span>
              </span>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>{t.disburseNow}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        ) : (
          <div className="p-4 rounded-2xl bg-[#E8F0E7] border border-[#7E8F7C]/40 space-y-2 animate-slide-up">
            <div className="flex items-center gap-2 text-[#4A5D48] text-xs font-bold">
              <CheckCircle2 className="w-4 h-4 text-[#7E8F7C]" />
              <span>{t.loanDisbursedSuccess}</span>
            </div>
            <div className="text-[10px] font-mono text-[#5A554C] space-y-0.5">
              <p>Tx Hash: <span className="text-[#4A5D48] font-bold">{farmer.loanTxHash}</span></p>
              <p>Interest Subvention: 3.0% Central + 1.0% Prompt Repayment</p>
              <p className="text-[#7A624E] font-semibold">{t.repaymentTenure}</p>
            </div>
          </div>
        )}

        {/* 1-Click Legal Protection & Section 65B Escalation */}
        <div className="mt-3 pt-3 border-t border-[#F0EBE4] text-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-mono text-[#736B5E] uppercase flex items-center gap-1.5 font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 text-[#7E8F7C]" />
              कानूनी सुरक्षा व विवाद निवारण (Sec. 65B)
            </span>
            <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-[#FAF7F2] text-[#7A624E] border border-[#D9C5B2] font-semibold">
              Model Land Act
            </span>
          </div>

          <div className="p-3 rounded-2xl bg-[#FDFBF7] border border-[#E8E2D9] text-[11px] text-[#5A554C] leading-relaxed space-y-1">
            <p className="font-semibold text-[#3A3A30]">
              ✓ Adverse Possession Waived (प्रतिकूल कब्ज़ा दावा स्वतः निरस्त)
            </p>
            <p className="text-[10px] text-[#736B5E]">
              डिजिटल पट्टा फॉर्म-7A भारतीय साक्ष्य अधिनियम Sec. 65B के तहत न्यायालय और बैंक दोनों में पूर्ण रूप से मान्य है।
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

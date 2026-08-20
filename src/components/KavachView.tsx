import React, { useState } from 'react';
import { Language, KavachBatch } from '../types';
import { TRANSLATIONS } from '../translations';
import { KAVACH_BATCH_AUTHENTIC, KAVACH_BATCH_COUNTERFEIT } from '../data/mockData';
import { playLaserScanSound, playSuccessChime, playAlertBuzzer, playClickBeep } from '../utils/audio';
import { 
  ShieldAlert, 
  ShieldCheck, 
  Scan, 
  Radio, 
  AlertTriangle, 
  FileWarning, 
  CheckCircle2, 
  Crosshair, 
  Send, 
  Sparkles, 
  Zap, 
  Activity, 
  Compass, 
  Fingerprint 
} from 'lucide-react';

interface KavachViewProps {
  currentLang: Language;
}

export const KavachView: React.FC<KavachViewProps> = ({ currentLang }) => {
  const t = TRANSLATIONS[currentLang];
  const [isScanning, setIsScanning] = useState(false);
  const [scannedResult, setScannedResult] = useState<KavachBatch | null>(null);
  const [firDispatched, setFirDispatched] = useState(false);

  const handleSimulateScan = (batchType: 'authentic' | 'counterfeit') => {
    setIsScanning(true);
    setScannedResult(null);
    setFirDispatched(false);
    playLaserScanSound();

    setTimeout(() => {
      setIsScanning(false);
      const result = batchType === 'authentic' ? KAVACH_BATCH_AUTHENTIC : KAVACH_BATCH_COUNTERFEIT;
      setScannedResult(result);

      if (result.status === 'AUTHENTIC') {
        playSuccessChime();
      } else {
        playAlertBuzzer();
      }
    }, 1500);
  };

  const handleDispatchFir = () => {
    playClickBeep();
    setFirDispatched(true);
    playAlertBuzzer();
  };

  return (
    <div className="space-y-4 pb-20 animate-fade-in">
      {/* Top Header Banner */}
      <div className="p-4 rounded-3xl bg-[#7E8F7C] text-white shadow-sm relative overflow-hidden">
        <div className="absolute -right-8 -top-8 w-36 h-36 bg-white/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-center gap-2 mb-1.5">
          <span className="p-1.5 rounded-xl bg-white/20 text-white border border-white/30">
            <ShieldAlert className="w-4 h-4" />
          </span>
          <span className="text-[11px] font-mono uppercase tracking-wider text-white font-bold">
            MODULE 2 • NEURAL ANTI-COUNTERFEIT
          </span>
        </div>

        <h2 className="text-lg font-bold text-white tracking-tight leading-tight">
          {t.kavachTitle}
        </h2>
        <p className="text-xs text-white/90 mt-1 leading-relaxed font-normal">
          {t.kavachSubtitle}
        </p>
      </div>

      {/* Optical Laser HUD Viewfinder Scanner Box */}
      <div className="p-4 rounded-3xl bg-white border border-[#E8E2D9] shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Scan className="w-4 h-4 text-[#7E8F7C]" />
            <h3 className="text-xs font-bold text-[#3A3A30] uppercase tracking-wider">
              {t.scannerHeading}
            </h3>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#E8F0E7] text-[#4A5D48] border border-[#7E8F7C]/30 font-bold">
            RADAR ACTIVE
          </span>
        </div>

        {/* Viewfinder Frame with Animated Reticles & Laser */}
        <div className="relative h-60 rounded-2xl bg-[#F8F5EE] border border-[#E8E2D9] overflow-hidden flex flex-col items-center justify-center p-4">
          {/* Subtle Grid Matrix Background */}
          <div 
            className="absolute inset-0 bg-cover opacity-30"
            style={{
              backgroundImage: 'radial-gradient(rgba(126, 143, 124, 0.3) 1px, transparent 0)',
              backgroundSize: '16px 16px'
            }}
          />

          {/* Corner HUD Reticle Brackets */}
          <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-[#7E8F7C]" />
          <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-[#7E8F7C]" />
          <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-[#7E8F7C]" />
          <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-[#7E8F7C]" />

          {/* Center Crosshairs */}
          <div className="relative flex items-center justify-center">
            <div className={`w-32 h-32 rounded-2xl border-2 transition-colors flex items-center justify-center relative ${
              isScanning ? 'border-[#7E8F7C] bg-[#7E8F7C]/15' : 'border-dashed border-[#C8B4A0]'
            }`}>
              <Crosshair className={`w-8 h-8 transition-all ${isScanning ? 'text-[#7E8F7C] animate-spin-slow scale-110' : 'text-[#8C8275]'}`} />

              {/* Simulated QR Code inside HUD */}
              <div className="absolute inset-2 border border-[#E8E2D9] flex items-center justify-center opacity-40">
                <Fingerprint className="w-12 h-12 text-[#7E8F7C]" />
              </div>
            </div>

            {/* Sweeping Laser Beam Line */}
            {isScanning && (
              <div className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#7E8F7C] to-transparent shadow-[0_0_12px_#7E8F7C] animate-laser-sweep" />
            )}
          </div>

          <p className="text-[11px] text-[#736B5E] mt-3 text-center px-4 font-medium">
            {isScanning ? t.scanningInProgress : t.pointCamera}
          </p>
        </div>

        {/* Live Pitch Demonstration Triggers */}
        <div className="space-y-2 pt-1">
          <p className="text-[11px] font-semibold text-[#5A554C] uppercase tracking-wider">
            {t.testSimulationHeading}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {/* Test 1: Authentic */}
            <button
              id="test-authentic-btn"
              onClick={() => handleSimulateScan('authentic')}
              disabled={isScanning}
              className="p-3 rounded-2xl bg-[#E8F0E7] hover:bg-[#DCE7DA] border border-[#7E8F7C]/40 text-left transition-all flex items-center justify-between group shadow-xs"
            >
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#4A5D48] flex-shrink-0" />
                <div>
                  <p className="text-xs font-bold text-[#3A3A30] group-hover:text-[#4A5D48]">
                    {t.testAuthenticBtn}
                  </p>
                  <p className="text-[10px] text-[#736B5E] font-mono">Batch #IFF-2026-NU-8842</p>
                </div>
              </div>
              <Sparkles className="w-4 h-4 text-[#7E8F7C] group-hover:scale-110 transition-transform" />
            </button>

            {/* Test 2: Geo-Velocity Cloned Counterfeit */}
            <button
              id="test-counterfeit-btn"
              onClick={() => handleSimulateScan('counterfeit')}
              disabled={isScanning}
              className="p-3 rounded-2xl bg-[#FDF3F2] hover:bg-[#FBE8E7] border border-[#D97D75]/40 text-left transition-all flex items-center justify-between group shadow-xs"
            >
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-[#C25953] flex-shrink-0" />
                <div>
                  <p className="text-xs font-bold text-[#3A3A30] group-hover:text-[#C25953]">
                    {t.testCounterfeitBtn}
                  </p>
                  <p className="text-[10px] text-[#8C8275] font-medium">Geo-Velocity Anomaly Alert</p>
                </div>
              </div>
              <Zap className="w-4 h-4 text-[#C25953] group-hover:scale-110 transition-transform" />
            </button>
          </div>
        </div>
      </div>

      {/* Verification Result Card */}
      {scannedResult && (
        <div className={`p-4 rounded-3xl border shadow-sm space-y-3 animate-slide-up ${
          scannedResult.status === 'AUTHENTIC'
            ? 'bg-white border-[#7E8F7C]/40'
            : 'bg-[#FCF6F5] border-[#D97D75]'
        }`}>
          {/* Header Status */}
          <div className="flex items-center justify-between border-b border-[#F0EBE4] pb-2.5">
            <div className="flex items-center gap-2">
              {scannedResult.status === 'AUTHENTIC' ? (
                <CheckCircle2 className="w-5 h-5 text-[#7E8F7C]" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-[#C25953] animate-bounce" />
              )}
              <div>
                <h3 className={`text-xs font-bold uppercase tracking-wider ${
                  scannedResult.status === 'AUTHENTIC' ? 'text-[#4A5D48]' : 'text-[#C25953]'
                }`}>
                  {scannedResult.status === 'AUTHENTIC' ? t.verifiedAuthenticTitle : t.counterfeitAlertTitle}
                </h3>
                <p className="text-[10px] text-[#736B5E] font-mono">
                  Batch: {scannedResult.batchNumber}
                </p>
              </div>
            </div>

            <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold ${
              scannedResult.status === 'AUTHENTIC'
                ? 'bg-[#E8F0E7] text-[#4A5D48] border border-[#7E8F7C]/40'
                : 'bg-[#FDF3F2] text-[#C25953] border border-[#D97D75]/40 animate-pulse'
            }`}>
              {scannedResult.status}
            </span>
          </div>

          {/* Product Details Grid */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2.5 rounded-2xl bg-[#FDFBF7] border border-[#E8E2D9]">
              <p className="text-[10px] text-[#8C8275]">Product Name</p>
              <p className="font-bold text-[#3A3A30] truncate">{scannedResult.productName}</p>
            </div>

            <div className="p-2.5 rounded-2xl bg-[#FDFBF7] border border-[#E8E2D9]">
              <p className="text-[10px] text-[#8C8275]">{t.spectrometryMatch}</p>
              <p className={`font-mono font-bold ${
                scannedResult.chemicalSpectrometryPct > 80 ? 'text-[#4A5D48]' : 'text-[#C25953]'
              }`}>
                {scannedResult.chemicalSpectrometryPct}% Purity
              </p>
            </div>
          </div>

          {/* Critical Geo-Velocity Anomaly Physics Alert Box */}
          {scannedResult.status === 'COUNTERFEIT_CLONE' && (
            <div className="p-3.5 rounded-2xl bg-white border border-[#D97D75]/40 space-y-2">
              <div className="flex items-center gap-1.5 text-[#C25953] font-bold text-xs">
                <Zap className="w-4 h-4 text-[#C25953]" />
                <span>{t.geoVelocityWarning}</span>
              </div>
              <p className="text-[11px] text-[#5A554C] leading-relaxed font-medium">
                {t.geoVelocityDesc}
              </p>
              <p className="text-[10px] font-mono text-[#A86438] font-bold">
                {t.quotaOverdraw}
              </p>

              {/* State DAO Auto-FIR Dispatch Button */}
              {!firDispatched ? (
                <button
                  id="dispatch-fir-btn"
                  onClick={handleDispatchFir}
                  className="mt-2 w-full py-2.5 px-3 rounded-xl bg-[#C25953] hover:bg-[#B04C46] text-white text-xs font-bold shadow-md shadow-[#C25953]/20 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                >
                  <FileWarning className="w-4 h-4" />
                  <span>{t.stateDaoFirBtn}</span>
                </button>
              ) : (
                <div className="mt-2 p-2.5 rounded-xl bg-[#E8F0E7] border border-[#7E8F7C]/40 text-[11px] text-[#4A5D48] font-mono font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#7E8F7C] flex-shrink-0" />
                  <span>{t.firDispatched}</span>
                </div>
              )}
            </div>
          )}

          {/* Genuine Scan Cryptographic Seal */}
          {scannedResult.status === 'AUTHENTIC' && (
            <div className="p-3 rounded-2xl bg-[#E8F0E7] border border-[#7E8F7C]/30 text-xs text-[#3A3A30] space-y-1">
              <p className="text-[#4A5D48] font-semibold">{scannedResult.reason}</p>
              <p className="text-[10px] font-mono text-[#736B5E] truncate">
                SHA-256 Seal: {scannedResult.qrSignatureHash}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

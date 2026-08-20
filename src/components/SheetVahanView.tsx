import React, { useState } from 'react';
import { Language, FarmerProfile } from '../types';
import { TRANSLATIONS } from '../translations';
import { DEFAULT_REEFER, MANDI_COMPARISON_DATA } from '../data/mockData';
import { triggerCelebrationConfetti } from '../utils/confetti';
import { playSuccessChime, playClickBeep } from '../utils/audio';
import { 
  Truck, 
  Thermometer, 
  TrendingUp, 
  ArrowRight, 
  Plus, 
  Minus, 
  CheckCircle2, 
  MapPin, 
  Clock, 
  Users, 
  Sparkles, 
  Package, 
  ShieldCheck 
} from 'lucide-react';

interface SheetVahanViewProps {
  currentLang: Language;
  farmer: FarmerProfile;
  crates: number;
  onChangeCrates: (crates: number) => void;
}

export const SheetVahanView: React.FC<SheetVahanViewProps> = ({
  currentLang,
  farmer,
  crates,
  onChangeCrates,
}) => {
  const t = TRANSLATIONS[currentLang];
  const [isBooking, setIsBooking] = useState(false);
  const [isBooked, setIsBooked] = useState(false);
  const [bookingToken, setBookingToken] = useState<string | null>(null);

  const kgPerCrate = 25;
  const totalWeightKg = crates * kgPerCrate;

  // Real-Time Arbitrage Math
  const localPricePerKg = 14;
  const localGross = totalWeightKg * localPricePerKg;
  const localSpoilageLoss = localGross * 0.18; // 18% distress spoilage
  const localNet = localGross - localSpoilageLoss;

  const metroPricePerKg = 32;
  const metroGross = totalWeightKg * metroPricePerKg;
  const transportCost = crates * 137.5; // ₹5.50 per kg
  const metroNet = metroGross - transportCost;

  const netFarmerGain = metroNet - localNet;
  const gainPct = ((netFarmerGain / localNet) * 100).toFixed(0);

  const handleCrateChange = (delta: number) => {
    playClickBeep();
    const newCount = Math.max(10, Math.min(crates + delta, 200));
    onChangeCrates(newCount);
  };

  const handleBookReefer = () => {
    setIsBooking(true);
    playClickBeep();

    setTimeout(() => {
      setIsBooking(false);
      setIsBooked(true);
      setBookingToken(`REEFER-BR-09-BAY03-${Math.floor(1000 + Math.random() * 9000)}`);
      triggerCelebrationConfetti();
      playSuccessChime();
    }, 1000);
  };

  return (
    <div className="space-y-4 pb-20 animate-fade-in">
      {/* Top Banner */}
      <div className="p-4 rounded-3xl bg-[#7E8F7C] text-white shadow-sm relative overflow-hidden">
        <div className="absolute -right-8 -top-8 w-36 h-36 bg-white/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-center gap-2 mb-1.5">
          <span className="p-1.5 rounded-xl bg-white/20 text-white border border-white/30">
            <Truck className="w-4 h-4" />
          </span>
          <span className="text-[11px] font-mono uppercase tracking-wider text-white font-bold">
            MODULE 3 • COLD-CHAIN ARBITRAGE
          </span>
        </div>

        <h2 className="text-lg font-bold text-white tracking-tight leading-tight">
          {t.sheetTitle}
        </h2>
        <p className="text-xs text-white/90 mt-1 leading-relaxed font-normal">
          {t.sheetSubtitle}
        </p>
      </div>

      {/* Dynamic Crate Stepper Card */}
      <div className="p-4 rounded-3xl bg-white border border-[#E8E2D9] shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Package className="w-4 h-4 text-[#7E8F7C]" />
            <h3 className="text-xs font-bold text-[#3A3A30] uppercase tracking-wider">
              {t.crateStepperTitle}
            </h3>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#E8F0E7] text-[#4A5D48] border border-[#7E8F7C]/30 font-bold">
            {t.tomatoSelect}
          </span>
        </div>

        {/* Stepper Control */}
        <div className="p-4 rounded-2xl bg-[#FDFBF7] border border-[#E8E2D9] flex items-center justify-between">
          <div>
            <p className="text-[10px] text-[#8C8275] uppercase font-mono">{t.totalWeight}</p>
            <p className="text-xl font-bold text-[#3A3A30] font-mono">
              {totalWeightKg.toLocaleString('en-IN')} kg
            </p>
            <p className="text-[11px] text-[#4A5D48] mt-0.5 font-semibold">
              ({crates} Crates @ 25kg/crate)
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              id="decrease-crates-btn"
              onClick={() => handleCrateChange(-10)}
              disabled={crates <= 10}
              className="w-10 h-10 rounded-2xl bg-[#F2EDE7] border border-[#E8E2D9] text-[#3A3A30] hover:border-[#7E8F7C] flex items-center justify-center disabled:opacity-30 active:scale-95 transition-all shadow-xs"
            >
              <Minus className="w-4 h-4" />
            </button>

            <span className="text-2xl font-black text-[#4A5D48] font-mono w-12 text-center">
              {crates}
            </span>

            <button
              id="increase-crates-btn"
              onClick={() => handleCrateChange(10)}
              disabled={crates >= 200}
              className="w-10 h-10 rounded-2xl bg-[#7E8F7C] text-white hover:bg-[#6B7D69] flex items-center justify-center active:scale-95 transition-all shadow-md shadow-[#7E8F7C]/20 font-bold"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Side-by-Side Mandi Comparison Arbitrage Matrix */}
      <div className="p-4 rounded-3xl bg-white border border-[#E8E2D9] shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-[#7E8F7C]" />
            <h3 className="text-xs font-bold text-[#3A3A30] uppercase tracking-wider">
              {t.comparisonHeading}
            </h3>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#E8F0E7] text-[#4A5D48] border border-[#7E8F7C]/30 font-bold">
            +{gainPct}% GAIN
          </span>
        </div>

        {/* Side-by-Side Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Column A: Local Distress Mandi */}
          <div className="p-3.5 rounded-2xl bg-[#FDFBF7] border border-[#E8E2D9] space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-[11px] font-bold text-[#5A554C]">{t.localMandiTitle}</p>
              <span className="text-[10px] text-[#C25953] font-mono font-bold">₹14/kg</span>
            </div>

            <div className="text-[11px] text-[#736B5E] space-y-1">
              <div className="flex justify-between">
                <span>Gross Revenue:</span>
                <span className="font-mono text-[#3A3A30]">₹{localGross.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-[#C25953]">
                <span>{t.localLossEst}:</span>
                <span className="font-mono">-₹{localSpoilageLoss.toLocaleString('en-IN')}</span>
              </div>
              <div className="border-t border-[#E8E2D9] pt-1 flex justify-between font-bold text-[#3A3A30]">
                <span>{t.localNetYield}:</span>
                <span className="font-mono text-[#5A554C]">₹{localNet.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          {/* Column B: Sheet-Vahan Pooled Reefer */}
          <div className="p-3.5 rounded-2xl bg-[#E8F0E7] border border-[#7E8F7C]/40 space-y-2 shadow-xs">
            <div className="flex items-center justify-between">
              <p className="text-[11px] font-bold text-[#3A3A30]">{t.sheetVahanTitle}</p>
              <span className="text-[10px] text-[#4A5D48] font-mono font-bold">₹32/kg</span>
            </div>

            <div className="text-[11px] text-[#5A554C] space-y-1">
              <div className="flex justify-between">
                <span>Gross Metro Revenue:</span>
                <span className="font-mono text-[#4A5D48] font-semibold">₹{metroGross.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-[#736B5E]">
                <span>{t.transportCost}:</span>
                <span className="font-mono">-₹{transportCost.toLocaleString('en-IN')}</span>
              </div>
              <div className="border-t border-[#7E8F7C]/20 pt-1 flex justify-between font-bold text-[#3A3A30]">
                <span>{t.metroNetYield}:</span>
                <span className="font-mono text-lg text-[#4A5D48] font-black">₹{metroNet.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Highlight Arbitrage Extra Profit Banner */}
        <div className="p-3 rounded-2xl bg-[#FAF7F2] border border-[#D9C5B2] flex items-center justify-between">
          <div>
            <p className="text-[10px] uppercase font-mono text-[#7A624E] font-semibold">{t.netFarmerGain}</p>
            <p className="text-lg font-black text-[#4A5D48] font-mono">
              +₹{netFarmerGain.toLocaleString('en-IN')}
            </p>
          </div>
          <div className="px-3 py-1 rounded-xl bg-[#7E8F7C] text-white font-bold text-xs shadow-xs">
            {t.gainPct}
          </div>
        </div>
      </div>

      {/* IoT 4.2°C Route Timeline & Live GPS Telemetry */}
      <div className="p-4 rounded-3xl bg-white border border-[#E8E2D9] shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Thermometer className="w-4 h-4 text-[#7E8F7C] animate-pulse" />
            <h3 className="text-xs font-bold text-[#3A3A30] uppercase tracking-wider">
              {t.iotTelemetryHeading}
            </h3>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#E8F0E7] text-[#4A5D48] border border-[#7E8F7C]/30 font-bold">
            4.2°C ACTIVE
          </span>
        </div>

        {/* Reefer Details Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
          <div className="p-2.5 rounded-2xl bg-[#FDFBF7] border border-[#E8E2D9]">
            <p className="text-[10px] text-[#8C8275]">Truck Number</p>
            <p className="font-mono font-bold text-[#3A3A30]">{DEFAULT_REEFER.truckNumber}</p>
          </div>

          <div className="p-2.5 rounded-2xl bg-[#FDFBF7] border border-[#E8E2D9]">
            <p className="text-[10px] text-[#8C8275]">{t.internalTemp}</p>
            <p className="font-mono font-bold text-[#4A5D48]">4.2°C / 88% RH</p>
          </div>

          <div className="p-2.5 rounded-2xl bg-[#FDFBF7] border border-[#E8E2D9]">
            <p className="text-[10px] text-[#8C8275]">Driver Contact</p>
            <p className="font-mono text-[#3A3A30] font-medium">{DEFAULT_REEFER.driverName}</p>
          </div>

          <div className="p-2.5 rounded-2xl bg-[#FDFBF7] border border-[#E8E2D9]">
            <p className="text-[10px] text-[#8C8275]">Hub ETA</p>
            <p className="font-mono font-bold text-[#7A624E]">3h 15m</p>
          </div>
        </div>

        {/* Capacity Pooling Gauge */}
        <div className="p-3 rounded-2xl bg-[#FDFBF7] border border-[#E8E2D9] space-y-1.5">
          <div className="flex justify-between text-[11px]">
            <span className="text-[#5A554C] flex items-center gap-1 font-medium">
              <Users className="w-3.5 h-3.5 text-[#7E8F7C]" />
              <span>{t.pooledFarmers}</span>
            </span>
            <span className="text-[#4A5D48] font-mono font-bold">
              {DEFAULT_REEFER.bookedCrates + crates} / {DEFAULT_REEFER.totalCapacityCrates} Crates Filled
            </span>
          </div>
          <div className="w-full bg-[#E8E2D9] h-2 rounded-full overflow-hidden">
            <div 
              className="bg-[#7E8F7C] h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, ((DEFAULT_REEFER.bookedCrates + crates) / DEFAULT_REEFER.totalCapacityCrates) * 100)}%` }}
            />
          </div>
        </div>

        {/* Booking Button */}
        {!isBooked ? (
          <button
            id="book-reefer-slot-btn"
            onClick={handleBookReefer}
            disabled={isBooking}
            className="w-full py-3.5 rounded-2xl bg-[#7E8F7C] hover:bg-[#6B7D69] text-white text-xs font-bold shadow-md shadow-[#7E8F7C]/25 hover:brightness-105 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            {isBooking ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Reserving Bay #03 in Samastipur Reefer...</span>
              </span>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>{t.bookReeferBtn}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        ) : (
          <div className="p-4 rounded-2xl bg-[#E8F0E7] border border-[#7E8F7C]/40 space-y-2 animate-slide-up">
            <div className="flex items-center gap-2 text-[#4A5D48] text-xs font-bold">
              <CheckCircle2 className="w-4 h-4 text-[#7E8F7C]" />
              <span>{t.bookingConfirmed}</span>
            </div>
            <div className="text-[10px] font-mono text-[#5A554C] space-y-0.5">
              <p>Booking Token: <strong className="text-[#4A5D48]">{bookingToken}</strong></p>
              <p>Locked Metro Settlement Price: <strong>₹32.00 / kg</strong></p>
              <p className="text-[#7A624E] font-medium">WhatsApp QR Gate Pass dispatched to {farmer.phone}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

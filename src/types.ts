export type Language = 'en' | 'hi' | 'ta';

export type ViewTab = 'onboarding' | 'hub' | 'patta-setu' | 'kavach' | 'sheet-vahan';

export interface FarmerProfile {
  id: string;
  name: string;
  nameHi: string;
  nameTa: string;
  phone: string;
  aadhaarMasked: string;
  state: string;
  district: string;
  village: string;
  landholdingAcres: number;
  tenancyType: 'Bataidar / Sharecropper' | 'Owner Cultivator' | 'Oral Lessee';
  primaryCrop: string;
  khasraPlot: string;
  isVerified: boolean;
  agriStackId: string;
  creditScore: number;
  loanSanctionedAmount: number;
  loanDisbursed: boolean;
  loanTxHash?: string;
  avatarSeed: string;
  landownerName: string;
  leaseDurationMonths: number;
  shareRatio: string;
  bankAccountMasked: string;
  ifscCode: string;
}

export interface NDVIDataPoint {
  month: string;
  ndvi: number;
  biomass: string;
  rainfallMm: number;
  status: 'Critical' | 'Moderate' | 'Vibrant' | 'Optimal';
}

export interface KavachBatch {
  id: string;
  batchNumber: string;
  productName: string;
  manufacturer: string;
  category: 'Fertilizer' | 'Pesticide' | 'Hybrid Seed' | 'Bio-Stimulant';
  mrp: number;
  mfgDate: string;
  expDate: string;
  status: 'AUTHENTIC' | 'COUNTERFEIT_CLONE' | 'SUSPICIOUS_VELOCITY' | 'UNREGISTERED';
  geoHistory: Array<{
    city: string;
    state: string;
    timestamp: string;
    scannerType: string;
  }>;
  velocityKmH?: number;
  quotaUsagePct: number;
  chemicalSpectrometryPct: number;
  qrSignatureHash: string;
  daoFirNumber?: string;
  reason?: string;
}

export interface MandiPriceComparison {
  crop: string;
  localMandi: string;
  localPrice: number;
  localSpoilagePct: number;
  metroMandi: string;
  metroPrice: number;
  distanceKm: number;
  coldTransportCostPerCrate: number;
  netMarginDiffPct: number;
}

export interface ReeferTelemetry {
  truckNumber: string;
  driverName: string;
  driverPhone: string;
  currentTempC: number;
  targetTempC: number;
  humidityPct: number;
  ambientTempC: number;
  gpsLocation: { lat: number; lng: number; label: string };
  etaMinutes: number;
  totalCapacityCrates: number;
  bookedCrates: number;
  pooledFarmersCount: number;
}

export interface VoiceActionResult {
  spokenResponse: string;
  targetView: ViewTab;
  actionType: string;
  params: Record<string, any>;
  dialectDetected: string;
  source?: string;
}

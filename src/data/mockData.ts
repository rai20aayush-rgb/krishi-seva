import { FarmerProfile, NDVIDataPoint, KavachBatch, ReeferTelemetry, MandiPriceComparison } from '../types';

export const PRESET_FARMERS: Record<string, FarmerProfile> = {
  bihar: {
    id: 'farmer-bihar-01',
    name: 'Rameshwar Singh',
    nameHi: 'रामेश्वर सिंह',
    nameTa: 'ராமேஷ்வர் சிங்',
    phone: '+91 98351 88412',
    aadhaarMasked: 'XXXX-XXXX-8921',
    state: 'Bihar',
    district: 'Samastipur',
    village: 'Kalyanpur (Ward 04)',
    landholdingAcres: 3.5,
    tenancyType: 'Bataidar / Sharecropper',
    primaryCrop: 'Solanaceous Tomato (Hybrid F1)',
    khasraPlot: 'Khasra #412/9B (Thana #108)',
    isVerified: true,
    agriStackId: 'KA-BIH-2026-9812',
    creditScore: 784,
    loanSanctionedAmount: 185000,
    loanDisbursed: false,
    avatarSeed: 'rameshwar',
    landownerName: 'Jagdish Narayan Prasad',
    leaseDurationMonths: 24,
    shareRatio: '25% Landowner : 75% Cultivator',
    bankAccountMasked: 'XXXX-XXXX-4491 (SBI Kalyanpur)',
    ifscCode: 'SBIN0003412',
  },
  tamil: {
    id: 'farmer-tamil-02',
    name: 'Annamalai Selvan',
    nameHi: 'अन्नामलाई सेल्वन',
    nameTa: 'அண்ணாமலை செல்வன்',
    phone: '+91 94432 77190',
    aadhaarMasked: 'XXXX-XXXX-4532',
    state: 'Tamil Nadu',
    district: 'Thanjavur',
    village: 'Thiruvaiyaru (Cauvery Delta)',
    landholdingAcres: 4.2,
    tenancyType: 'Bataidar / Sharecropper',
    primaryCrop: 'Cauvery Delta Samba Paddy & Grand Naine Banana',
    khasraPlot: 'Survey #184/3A (Pattukottai Taluk)',
    isVerified: true,
    agriStackId: 'KA-TN-2026-4419',
    creditScore: 792,
    loanSanctionedAmount: 210000,
    loanDisbursed: false,
    avatarSeed: 'annamalai',
    landownerName: 'Sundaramurthy Iyer',
    leaseDurationMonths: 36,
    shareRatio: '30% Landowner : 70% Cultivator',
    bankAccountMasked: 'XXXX-XXXX-8820 (Canara Bank Thiruvaiyaru)',
    ifscCode: 'CNRB0001290',
  }
};

export const SATELLITE_NDVI_TIMELINE: NDVIDataPoint[] = [
  { month: 'Mar 26', ndvi: 0.46, biomass: 'Summer Fallow / Soil Prep', rainfallMm: 14, status: 'Moderate' },
  { month: 'Apr 26', ndvi: 0.54, biomass: 'Pre-Monsoon Sowing', rainfallMm: 32, status: 'Moderate' },
  { month: 'May 26', ndvi: 0.62, biomass: 'Nursery Emergence', rainfallMm: 68, status: 'Vibrant' },
  { month: 'Jun 26', ndvi: 0.73, biomass: 'Kharif Monsoon Vegetative', rainfallMm: 185, status: 'Optimal' },
  { month: 'Jul 26', ndvi: 0.79, biomass: 'Canopy Density Peak', rainfallMm: 242, status: 'Optimal' },
  { month: 'Aug 26 (Now)', ndvi: 0.82, biomass: 'Active Monsoon Biomass', rainfallMm: 215, status: 'Optimal' },
];

export const KAVACH_BATCH_AUTHENTIC: KavachBatch = {
  id: 'batch-auth-01',
  batchNumber: 'IFF-2026-NU-8842',
  productName: 'IFFCO Nano Urea (Liquid 500ml)',
  manufacturer: 'Indian Farmers Fertiliser Cooperative (Kalol Unit)',
  category: 'Fertilizer',
  mrp: 225,
  mfgDate: '05-08-2026',
  expDate: '04-08-2028',
  status: 'AUTHENTIC',
  geoHistory: [
    { city: 'Kalol Factory', state: 'Gujarat', timestamp: '2026-08-08 09:30', scannerType: 'Production QA' },
    { city: 'Patna Regional Hub', state: 'Bihar', timestamp: '2026-08-16 11:20', scannerType: 'Wholesale Depot' },
    { city: 'Samastipur PACS Center', state: 'Bihar', timestamp: '2026-08-20 08:45', scannerType: 'Retail Agri-Store' }
  ],
  quotaUsagePct: 24.0,
  chemicalSpectrometryPct: 99.4,
  qrSignatureHash: '0x8f4c71a39b2e04d7c588e1a6c5f9923a4112e',
  reason: 'Cryptographic SHA-256 state seal matched and registered with Fertilizer Control Order ledger.',
};

export const KAVACH_BATCH_COUNTERFEIT: KavachBatch = {
  id: 'batch-fake-02',
  batchNumber: 'DAP-CLONE-9918',
  productName: 'Spurious DAP (Di-Ammonium Phosphate 50kg)',
  manufacturer: 'Unverified Third-Party Cloner (Simulated)',
  category: 'Fertilizer',
  mrp: 1350,
  mfgDate: '12-08-2026',
  expDate: '11-08-2028',
  status: 'COUNTERFEIT_CLONE',
  geoHistory: [
    { city: 'Patna Warehouse', state: 'Bihar', timestamp: '2026-08-20 09:12', scannerType: 'Local PACS' },
    { city: 'Varanasi Mandi', state: 'Uttar Pradesh', timestamp: '2026-08-20 09:24', scannerType: 'Private Dealer' },
    { city: 'Samastipur Farm', state: 'Bihar', timestamp: '2026-08-20 09:41', scannerType: 'Farmer Mobile HUD' },
  ],
  velocityKmH: 850,
  quotaUsagePct: 720.0,
  chemicalSpectrometryPct: 34.2,
  qrSignatureHash: '0xINVALID_CLONE_SIGNATURE_COLLISION',
  daoFirNumber: 'DAO-AGRI-2026-9921',
  reason: 'Impossible Geo-Velocity: QR scanned in Varanasi 12 mins after Patna (170 km apart = 850 km/h). Severe quota overdraw (720%).',
};

export const DEFAULT_REEFER: ReeferTelemetry = {
  truckNumber: 'BR-09-GC-4402',
  driverName: 'Mohan Yadav',
  driverPhone: '+91 97182 33491',
  currentTempC: 4.0,
  targetTempC: 4.0,
  humidityPct: 86,
  ambientTempC: 32.2,
  gpsLocation: {
    lat: 25.8624,
    lng: 85.7812,
    label: 'Samastipur Aggregation Hub (Bay #03)'
  },
  etaMinutes: 195,
  totalCapacityCrates: 200,
  bookedCrates: 140,
  pooledFarmersCount: 4,
};

export const MANDI_COMPARISON_DATA: MandiPriceComparison = {
  crop: 'Solanaceous Hybrid Tomato',
  localMandi: 'Samastipur Local Krishi Mandi',
  localPrice: 14,
  localSpoilagePct: 18,
  metroMandi: 'Azadpur Metro Mandi / Patna Apex Hub',
  metroPrice: 32,
  distanceKm: 280,
  coldTransportCostPerCrate: 137.5, // ~5.50 per kg
  netMarginDiffPct: 107.1,
};

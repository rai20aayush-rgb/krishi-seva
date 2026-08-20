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
  { month: 'Sep 25', ndvi: 0.42, biomass: 'Early Vegetative', rainfallMm: 110, status: 'Moderate' },
  { month: 'Oct 25', ndvi: 0.58, biomass: 'Active Canopy', rainfallMm: 85, status: 'Vibrant' },
  { month: 'Nov 25', ndvi: 0.69, biomass: 'Peak Flowering', rainfallMm: 45, status: 'Optimal' },
  { month: 'Dec 25', ndvi: 0.74, biomass: 'Fruiting Stage', rainfallMm: 15, status: 'Optimal' },
  { month: 'Jan 26', ndvi: 0.71, biomass: 'Maturity / Harvest', rainfallMm: 8, status: 'Optimal' },
  { month: 'Feb 26 (Now)', ndvi: 0.74, biomass: 'Peak Vegetative Biomass', rainfallMm: 5, status: 'Optimal' },
];

export const KAVACH_BATCH_AUTHENTIC: KavachBatch = {
  id: 'batch-auth-01',
  batchNumber: 'IFF-2026-NU-8842',
  productName: 'IFFCO Nano Urea (Liquid 500ml)',
  manufacturer: 'Indian Farmers Fertiliser Cooperative (Kalol Unit)',
  category: 'Fertilizer',
  mrp: 225,
  mfgDate: '15-01-2026',
  expDate: '14-01-2028',
  status: 'AUTHENTIC',
  geoHistory: [
    { city: 'Kalol Factory', state: 'Gujarat', timestamp: '2026-01-16 10:30', scannerType: 'Production QA' },
    { city: 'Patna Regional Hub', state: 'Bihar', timestamp: '2026-01-28 14:15', scannerType: 'Wholesale Depot' },
    { city: 'Samastipur PACS Center', state: 'Bihar', timestamp: '2026-02-14 09:40', scannerType: 'Retail Agri-Store' }
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
  mfgDate: '02-02-2026',
  expDate: '01-02-2028',
  status: 'COUNTERFEIT_CLONE',
  geoHistory: [
    { city: 'Patna Warehouse', state: 'Bihar', timestamp: '2026-02-19 11:15', scannerType: 'Local PACS' },
    { city: 'Varanasi Mandi', state: 'Uttar Pradesh', timestamp: '2026-02-19 11:27', scannerType: 'Private Dealer' },
    { city: 'Samastipur Farm', state: 'Bihar', timestamp: '2026-02-19 11:42', scannerType: 'Farmer Mobile HUD' },
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
  currentTempC: 4.2,
  targetTempC: 4.0,
  humidityPct: 88,
  ambientTempC: 31.4,
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

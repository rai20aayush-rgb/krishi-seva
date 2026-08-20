// src/components/MobileKrishiApp.tsx
"use client";
import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { 
  FileText, 
  ShieldCheck, 
  Truck, 
  Home, 
  Mic, 
  Globe, 
  CheckCircle2, 
  Camera, 
  PhoneCall,
  AlertTriangle,
  Scale,
  DollarSign,
  MapPin,
  FileCheck
} from "lucide-react";

export const MobileKrishiApp = () => {
  const { lang, setLang, profile, activeView, setActiveView, loadDemoData } = useApp();
  
  // Sheet-Vahan State
  const [crates, setCrates] = useState(20);
  const [reeferBooked, setReeferBooked] = useState(false);
  
  // Kavach State
  const [scanState, setScanState] = useState<"idle" | "valid" | "cloned">("idle");
  
  // Patta-Setu State
  const [loanSanctioned, setLoanSanctioned] = useState(false);
  const [disputeRaised, setDisputeRaised] = useState(false);

  // Gemini Voice Assistant State
  const [isListening, setIsListening] = useState(false);
  const [voiceFeedback, setVoiceFeedback] = useState("");

  // Arbitrage & Revenue Math
  const totalKg = crates * 25; // 1 Crate = 25 kg
  const localMandiRevenue = totalKg * 6; // ₹6/kg in village
  const terminalGrossRevenue = totalKg * 24; // ₹24/kg in city
  const driverPayout = totalKg * 2.0; // ₹2.00/kg to cold truck
  const platformFee = totalKg * 0.5; // ₹0.50/kg Krishi-Setu Revenue
  const farmerNetProfit = terminalGrossRevenue - (driverPayout + platformFee);

  // Trigger Dialect Voice Command Simulation (Gemini Backend Connected)
  const triggerVoiceAssistant = async () => {
    setIsListening(true);
    setVoiceFeedback(lang === "hi" ? "आवाज़ समझी जा रही है..." : "Processing dialect command...");

    try {
      const sampleQuery = activeView === "sheet" 
        ? "टमाटर 40 क्रेट के लिए पटना मंडी का मुनाफा बताओ" 
        : "पट्टा-सेतु में मेरा किसान क्रेडिट लोन चेक करो";

      const res = await fetch("/api/voice-action", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: sampleQuery, currentLang: lang, currentView: activeView }),
      });
      const data = await res.json();

      if (data.spokenResponse) {
        setVoiceFeedback(`✓ ${data.spokenResponse}`);
        if (data.targetView) {
          // Normalize targetView if backend returns "sheet-vahan" or "patta-setu"
          const normalizedView = 
            data.targetView === "sheet-vahan" ? "sheet" :
            data.targetView === "patta-setu" ? "patta" : 
            data.targetView;
          setActiveView(normalizedView as any);
        }
        if (data.params?.crates) setCrates(data.params.crates);
      }
    } catch {
      // Fallback Demo Response for Offline Hackathon environment
      setTimeout(() => {
        if (activeView === "sheet") {
          setCrates(35);
          setVoiceFeedback(lang === "hi" ? "✓ 35 क्रेट पटना मंडी रूट पर सेट किए गए।" : "✓ 35 Crates allocated for Patna reefer route.");
        } else {
          setActiveView("patta");
          setVoiceFeedback(lang === "hi" ? "✓ पट्टा-सेतु और ULI लोन पोर्टल खोला गया।" : "✓ Opened Patta-Setu Lease & Loan.");
        }
      }, 1000);
    } finally {
      setIsListening(false);
    }
  };

  return (
    <div id="krishi-app-root" className="w-full min-h-screen bg-stone-950 text-stone-100 flex justify-center selection:bg-emerald-500 selection:text-stone-950">
      {/* Mobile Constraints Viewport */}
      <div className="w-full max-w-md min-h-screen bg-stone-950 flex flex-col justify-between border-x border-stone-800 shadow-2xl relative pb-28">
        
        {/* Top Header */}
        <header id="mobile-header" className="sticky top-0 z-40 bg-stone-900/90 backdrop-blur-md px-4 py-3 border-b border-stone-800 flex justify-between items-center">
          <div id="header-logo" className="flex items-center gap-2 cursor-pointer" onClick={() => setActiveView("hub")}>
            <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center text-stone-950 font-black text-sm">
              KS
            </div>
            <div>
              <h1 className="font-bold text-sm text-white leading-tight">Krishi-Setu (कृषि-सेतु)</h1>
              <p className="text-[10px] text-emerald-400 font-medium">Bhojpuri • Hindi • Tamil</p>
            </div>
          </div>

          <div id="lang-selector" className="flex items-center gap-1 bg-stone-950 border border-stone-800 p-1 rounded-xl">
            <Globe className="w-3 h-3 text-stone-400 ml-1" />
            {(["en", "hi", "ta"] as const).map((l) => (
              <button
                key={l}
                id={`lang-btn-${l}`}
                onClick={() => setLang(l)}
                className={`px-2 py-0.5 rounded-md text-[11px] font-bold transition-colors ${
                  lang === l ? "bg-emerald-500 text-stone-950" : "text-stone-400 hover:text-white"
                }`}
              >
                {l === "en" ? "EN" : l === "hi" ? "हि" : "த"}
              </button>
            ))}
          </div>
        </header>

        {/* Dynamic Screen Routing */}
        <main id="main-content" className="p-4 space-y-4 flex-1">

          {/* VIEW: ONBOARDING */}
          {activeView === "login" && (
            <div id="view-login" className="bg-stone-900 p-5 rounded-2xl border border-stone-800 space-y-3 animate-fade-in">
              <div className="flex justify-between items-center">
                <h2 className="text-base font-bold text-white">किसान पहचान व लॉगिन</h2>
                <button 
                  id="btn-demo-prefill"
                  onClick={loadDemoData} 
                  className="text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-500/40 px-2.5 py-1 rounded-full font-mono active:scale-95 transition-transform"
                >
                  ⚡ Demo Pre-Fill
                </button>
              </div>
              <input 
                id="input-farmer-name"
                className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-sm text-white" 
                value={profile.name} 
                readOnly 
              />
              <div className="p-2.5 bg-emerald-950/40 border border-emerald-500/30 rounded-xl text-[11px] text-emerald-300 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>आधार ई-केवाईसी और बटाईदार प्रोफाइल सत्यापित</span>
              </div>
              <button 
                id="btn-launch-dashboard"
                onClick={() => setActiveView("hub")} 
                className="w-full py-3.5 bg-emerald-500 text-stone-950 font-black rounded-xl text-sm hover:bg-emerald-400 active:scale-[0.98] transition-all shadow-lg shadow-emerald-500/20"
              >
                पोर्टल में प्रवेश करें (Launch Dashboard)
              </button>
            </div>
          )}

          {/* VIEW: HUB */}
          {activeView === "hub" && (
            <div id="view-hub" className="space-y-3 animate-fade-in">
              <div className="bg-stone-900 p-4 rounded-2xl border border-stone-800 flex justify-between items-center">
                <div>
                  <span className="text-[9px] font-mono text-emerald-400 uppercase">VERIFIED TENANT FARMER</span>
                  <h2 className="text-base font-bold text-white">{profile.name}</h2>
                  <p className="text-[11px] text-stone-400">{profile.district}, {profile.state}</p>
                </div>
                <div className="text-right">
                  <span className="text-[9px] text-stone-400 font-mono">AGRI-CREDIT</span>
                  <div className="text-xl font-black text-emerald-400 font-mono">765</div>
                </div>
              </div>

              {/* Module 1: Patta-Setu */}
              <div 
                id="nav-to-patta"
                onClick={() => setActiveView("patta")} 
                className="bg-stone-900 border border-stone-800 hover:border-emerald-500/50 active:border-emerald-500 p-4 rounded-2xl flex items-center justify-between cursor-pointer transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-emerald-950 text-emerald-400 rounded-xl"><FileText className="w-5 h-5" /></div>
                  <div>
                    <h3 className="text-sm font-bold text-white">पट्टा-सेतु (Patta-Setu)</h3>
                    <p className="text-[11px] text-stone-400">डिजिटल बटाईदारी व ₹65,000 ULI लोन</p>
                  </div>
                </div>
                <span className="text-emerald-400 font-bold text-lg">→</span>
              </div>

              {/* Module 2: Kavach */}
              <div 
                id="nav-to-kavach"
                onClick={() => setActiveView("kavach")} 
                className="bg-stone-900 border border-stone-800 hover:border-red-500/50 active:border-red-500 p-4 rounded-2xl flex items-center justify-between cursor-pointer transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-red-950 text-red-400 rounded-xl"><ShieldCheck className="w-5 h-5" /></div>
                  <div>
                    <h3 className="text-sm font-bold text-white">कृषि-कवच (Kavach)</h3>
                    <p className="text-[11px] text-stone-400">नकली कीटनाशक व खाद सुरक्षा स्कैनर</p>
                  </div>
                </div>
                <span className="text-red-400 font-bold text-lg">→</span>
              </div>

              {/* Module 3: Sheet-Vahan */}
              <div 
                id="nav-to-sheet"
                onClick={() => setActiveView("sheet")} 
                className="bg-stone-900 border border-stone-800 hover:border-cyan-500/50 active:border-cyan-500 p-4 rounded-2xl flex items-center justify-between cursor-pointer transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-cyan-950 text-cyan-400 rounded-xl"><Truck className="w-5 h-5" /></div>
                  <div>
                    <h3 className="text-sm font-bold text-white">शीत-वाहन (Sheet-Vahan)</h3>
                    <p className="text-[11px] text-stone-400">साझा कोल्ड ट्रक व पटना मंडी मुनाफा</p>
                  </div>
                </div>
                <span className="text-cyan-400 font-bold text-lg">→</span>
              </div>
            </div>
          )}

          {/* VIEW: PATTA-SETU (LOANS + LEGAL DISPUTE INTEGRATION) */}
          {activeView === "patta" && (
            <div id="view-patta" className="space-y-3 animate-fade-in">
              <div className="bg-stone-900 p-4 rounded-2xl border border-stone-800 space-y-3">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-bold text-white">डिजिटल पट्टा व संस्थागत लोन</h3>
                  <span className="text-[9px] bg-emerald-950 text-emerald-400 border border-emerald-500/40 px-2 py-0.5 rounded font-mono">
                    Model Land Act Valid
                  </span>
                </div>

                {/* Legal Non-encumbrance Clause Box */}
                <div className="bg-stone-950 p-3 rounded-xl border border-stone-800 text-[11px] space-y-1">
                  <p className="text-stone-400">जमींदार: <b className="text-stone-200">आर. के. शर्मा (Khasra #412/1)</b></p>
                  <p className="text-emerald-400">✓ प्रतिकूल कब्ज़ा दावा कानूनी रूप से मुक्त (Adverse Possession Waived)</p>
                </div>

                {/* Satellite NDVI Verification */}
                <div className="bg-stone-950 p-3 rounded-xl border border-stone-800 space-y-1.5">
                  <div className="flex justify-between text-[10px]">
                    <span className="text-stone-400">सैटेलाइट खेत उर्वरा स्वास्थ्य (Sentinel-2 NDVI)</span>
                    <span className="text-emerald-400 font-bold">0.78 (उत्कृष्ट पैदावार)</span>
                  </div>
                  <div className="w-full h-1.5 bg-stone-800 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 w-[78%]" />
                  </div>
                </div>

                {/* Loan Sanction Box */}
                <div className="bg-emerald-950/40 border border-emerald-500/40 p-4 rounded-xl space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] text-emerald-400 font-bold uppercase font-mono">RBI ULI पूर्व-स्वीकृत सीमा</span>
                    <span className="text-[10px] text-stone-300 font-medium">4% ब्याज दर (ISS)</span>
                  </div>
                  <div className="text-2xl font-black text-emerald-300 font-mono">₹65,000</div>
                  <button 
                    id="btn-sanction-loan"
                    onClick={() => setLoanSanctioned(true)} 
                    className="w-full py-2.5 bg-emerald-500 text-stone-950 font-bold rounded-lg text-xs hover:bg-emerald-400 active:scale-[0.98] transition-all"
                  >
                    {loanSanctioned ? "✓ आर्यावर्त ग्रामीण बैंक को भेजा गया" : "बैंक खाते में राशि प्राप्त करें (Sanction via ULI)"}
                  </button>
                </div>

                {/* 1-Click Legal Dispute & Section 65B Escalation Box */}
                <div className="bg-stone-950 p-3 rounded-xl border border-stone-800 space-y-2 pt-2">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] text-stone-400 font-mono uppercase flex items-center gap-1">
                      <Scale className="w-3 h-3 text-amber-400" /> कानूनी सुरक्षा व विवाद निवारण
                    </span>
                    <span className="text-[9px] bg-stone-800 text-stone-300 px-1.5 py-0.5 rounded font-mono">Sec. 65B IT Act</span>
                  </div>

                  {!disputeRaised ? (
                    <button
                      id="btn-report-dispute"
                      onClick={() => setDisputeRaised(true)}
                      className="w-full py-2 bg-stone-900 hover:bg-stone-800 text-amber-300 font-bold text-xs rounded-lg border border-amber-500/30 transition flex items-center justify-center gap-1.5 active:scale-[0.98]"
                    >
                      <AlertTriangle className="w-3.5 h-3.5" /> पट्टा उल्लंघन / विवाद रिपोर्ट करें
                    </button>
                  ) : (
                    <div id="dispute-alert-box" className="bg-amber-950/60 border border-amber-500/60 p-3 rounded-lg space-y-1.5 text-xs animate-slide-up">
                      <p className="text-amber-300 font-bold flex items-center gap-1">
                        <FileCheck className="w-4 h-4 shrink-0" /> ब्लॉक तहसीलदार को डिजिटल प्रमाण भेजा गया
                      </p>
                      <p className="text-[11px] text-stone-300 leading-relaxed">
                        • आधार व GPS बाउंड्री प्रमाण (Sec 65B) दर्ज हुआ<br/>
                        • प्रतिकूल कब्ज़ा दावा स्वतः रद्द (Permissive License #LC-2026)<br/>
                        • ULI क्रेडिट लाइन सुरक्षित होल्ड पर रखी गई
                      </p>
                    </div>
                  )}
                </div>

              </div>
            </div>
          )}

          {/* VIEW: KAVACH (GEO-VELOCITY ANOMALY TEST) */}
          {activeView === "kavach" && (
            <div id="view-kavach" className="space-y-3 animate-fade-in">
              <div className="bg-stone-900 p-4 rounded-2xl border border-stone-800 space-y-3">
                <h3 className="text-sm font-bold text-white">कृषि-कवच: रसायन व बीज सुरक्षा</h3>
                
                {/* Camera Viewfinder Mock */}
                <div className="aspect-video bg-stone-950 rounded-xl border-2 border-dashed border-stone-700 flex flex-col items-center justify-center p-4 text-center">
                  <Camera className="w-8 h-8 text-stone-500 mb-1" />
                  <p className="text-[11px] text-stone-400">बोतल पर छपे सिंगल-बर्न कोड को स्कैन करें</p>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button 
                    id="btn-test-genuine"
                    onClick={() => setScanState("valid")} 
                    className="py-2.5 bg-emerald-950 hover:bg-emerald-900 border border-emerald-600 text-emerald-300 font-bold text-[11px] rounded-xl active:scale-95 transition-all"
                  >
                    Test Genuine Scan
                  </button>
                  <button 
                    id="btn-test-cloned"
                    onClick={() => setScanState("cloned")} 
                    className="py-2.5 bg-red-950 hover:bg-red-900 border border-red-600 text-red-300 font-bold text-[11px] rounded-xl active:scale-95 transition-all"
                  >
                    Test Cloned Scan ⚠️
                  </button>
                </div>

                {scanState === "valid" && (
                  <div id="scan-result-valid" className="p-3 bg-emerald-950/60 border border-emerald-500 rounded-xl text-xs text-emerald-300 animate-slide-up">
                    ✓ <b>सत्यापित असली उत्पाद:</b> बायर कोराजन (बैच #BY-9901) - सिंगल-बर्न टोकन लॉक हुआ।
                  </div>
                )}

                {scanState === "cloned" && (
                  <div id="scan-result-cloned" className="p-3 bg-red-950/60 border border-red-500 rounded-xl space-y-1.5 text-xs animate-slide-up">
                    <p className="text-red-400 font-bold flex items-center gap-1">
                      <AlertTriangle className="w-4 h-4 shrink-0" /> चेतावनी: नकली (Duplicate) उत्पाद पकड़ा गया!
                    </p>
                    <p className="text-[11px] text-stone-300">
                      <b>Geo-Velocity Alert:</b> यही बोतल कोड 18 मिनट पहले वाराणसी में स्कैन हो चुका है।
                    </p>
                    <button 
                      id="btn-report-dao"
                      onClick={() => alert("जिला कृषि अधिकारी (DAO) को GPS रिपोर्ट भेजी गई।")}
                      className="w-full py-1.5 bg-red-600 hover:bg-red-500 text-white font-bold rounded-lg text-[11px] active:scale-95 transition-all"
                    >
                      जिला कृषि अधिकारी को रिपोर्ट भेजें
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* VIEW: SHEET-VAHAN (ARBITRAGE + REVENUE MODEL INTEGRATION) */}
          {activeView === "sheet" && (
            <div id="view-sheet" className="space-y-3 animate-fade-in">
              <div className="bg-stone-900 p-4 rounded-2xl border border-stone-800 space-y-3">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-bold text-white">शीत-वाहन: साझा कोल्ड-चेन बुकिंग</h3>
                  <span className="text-[9px] bg-cyan-950 text-cyan-400 border border-cyan-500/40 px-2 py-0.5 rounded font-mono">
                    Empty Backhaul Match
                  </span>
                </div>

                {/* Harvest Crate Stepper */}
                <div className="bg-stone-950 p-3 rounded-xl border border-stone-800 flex justify-between items-center">
                  <div>
                    <span className="text-xs text-stone-300 font-medium">टमाटर की फसल (Harvest Quantity)</span>
                    <p className="text-[10px] text-stone-500 font-mono">कुल वजन: {totalKg} किलोग्राम ({crates} क्रेट)</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      id="btn-minus-crate"
                      onClick={() => setCrates(Math.max(5, crates - 5))} 
                      className="w-8 h-8 bg-stone-800 hover:bg-stone-700 rounded-lg font-bold text-white active:scale-95 transition-transform"
                    >
                      -
                    </button>
                    <span className="font-mono font-bold text-sm w-8 text-center text-cyan-400">{crates}</span>
                    <button 
                      id="btn-plus-crate"
                      onClick={() => setCrates(crates + 5)} 
                      className="w-8 h-8 bg-stone-800 hover:bg-stone-700 rounded-lg font-bold text-white active:scale-95 transition-transform"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Arbitrage Price Comparison */}
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div className="bg-stone-950 p-3 rounded-xl border border-stone-800">
                    <p className="text-stone-400">स्थानीय मंडी (Distress)</p>
                    <p className="text-lg font-black text-stone-200 mt-0.5 font-mono">₹{localMandiRevenue.toLocaleString('en-IN')}</p>
                    <span className="text-[9px] text-red-400 font-medium">₹6/kg पर मजबूरी बिक्री</span>
                  </div>
                  <div className="bg-cyan-950/40 p-3 rounded-xl border border-cyan-500/40">
                    <p className="text-cyan-400 font-medium">पटना टर्मिनल (Arbitrage)</p>
                    <p className="text-lg font-black text-cyan-300 mt-0.5 font-mono">₹{farmerNetProfit.toLocaleString('en-IN')}</p>
                    <span className="text-[9px] text-emerald-400 font-medium">₹21.50/kg शुद्ध बचत</span>
                  </div>
                </div>

                {/* Transparency Box: Platform Revenue Model */}
                <div className="bg-stone-950 p-3 rounded-xl border border-stone-800 text-[10px] space-y-1">
                  <span className="text-stone-400 font-mono uppercase text-[9px] flex items-center gap-1 font-semibold">
                    <DollarSign className="w-3 h-3 text-emerald-400" /> पारदर्शी लॉजिस्टिक्स व रेवेन्यू ब्रेकडाउन
                  </span>
                  <div className="flex justify-between text-stone-300 pt-0.5">
                    <span>कोल्ड ट्रक चालक किराया (₹2.00/kg):</span>
                    <span className="font-mono">₹{driverPayout.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-cyan-300">
                    <span>Krishi-Setu प्लेटफॉर्म शुल्क (₹0.50/kg):</span>
                    <span className="font-mono">₹{platformFee.toLocaleString('en-IN')}</span>
                  </div>
                  <p className="text-[9px] text-stone-500 pt-1">
                    *किसान से कोई अग्रिम शुल्क नहीं लिया जाता; भुगतान मंडी बिक्री से स्वतः कटेगा।
                  </p>
                </div>

                {/* Route Information */}
                <div className="bg-stone-950 p-2.5 rounded-xl border border-stone-800 flex items-center gap-2 text-[11px] text-stone-400">
                  <MapPin className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>पिकअप: <b>समस्तीपुर PACS केंद्र</b> ──► गंतव्य: <b>पटना थोक मंडी</b> (वापसी खाली ट्रक)</span>
                </div>

                <button 
                  id="btn-book-reefer"
                  onClick={() => setReeferBooked(true)} 
                  className="w-full py-3 bg-cyan-500 hover:bg-cyan-400 text-stone-950 font-bold rounded-xl text-xs shadow-lg shadow-cyan-500/20 active:scale-[0.98] transition-all"
                >
                  {reeferBooked ? "✓ साझा कोल्ड ट्रक आरक्षित हुआ (OTP: 4912)" : "साझा कोल्ड ट्रक बुक करें (Book Reefer)"}
                </button>
              </div>
            </div>
          )}
        </main>

        {/* Floating Voice Assistant Bar */}
        <div className="fixed bottom-16 left-0 right-0 max-w-md mx-auto px-4 z-40">
          <div className="bg-stone-900/95 border border-emerald-500/40 rounded-2xl p-2.5 flex items-center justify-between shadow-2xl backdrop-blur-lg">
            <button
              id="voice-mic-trigger-btn"
              onClick={triggerVoiceAssistant}
              className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                isListening ? "bg-red-500 text-white animate-pulse" : "bg-emerald-500 text-stone-950 shadow-md shadow-emerald-500/30 hover:bg-emerald-400"
              }`}
            >
              <Mic className="w-5 h-5" />
            </button>
            <div className="flex-1 px-3 text-[11px] text-stone-300 truncate font-medium">
              {voiceFeedback || (lang === "hi" ? "माइक दबाकर बोलें (उदा: 'पटना मंडी रेट')" : "Tap mic to speak dialect command...")}
            </div>
            <a 
              id="kisan-helpline-link"
              href="tel:18001801551" 
              className="p-2 bg-stone-800 text-stone-400 hover:text-white rounded-xl transition-colors"
              title="Kisan Call Center 1800-180-1551"
            >
              <PhoneCall className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Bottom Tab Navigation */}
        <nav id="bottom-nav-tabs" className="fixed bottom-0 left-0 right-0 max-w-md mx-auto z-30 bg-stone-900/90 backdrop-blur-md border-t border-stone-800 px-4 py-2 flex justify-around">
          {[
            { id: "hub", label: "होम", icon: Home },
            { id: "patta", label: "पट्टा-सेतु", icon: FileText },
            { id: "kavach", label: "कवच", icon: ShieldCheck },
            { id: "sheet", label: "शीत-वाहन", icon: Truck },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeView === tab.id;
            return (
              <button
                key={tab.id}
                id={`bottom-tab-${tab.id}`}
                onClick={() => setActiveView(tab.id as any)}
                className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-lg transition-colors ${
                  active ? "text-emerald-400" : "text-stone-500 hover:text-stone-300"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-[9px] font-bold">{tab.label}</span>
              </button>
            );
          })}
        </nav>

      </div>
    </div>
  );
};

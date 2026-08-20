import express from "express";
import path from "path";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini SDK lazily
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });
}

// Health check endpoint
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    service: "Krishi-Setu Sovereign Agri-OS API",
    geminiConfigured: !!process.env.GEMINI_API_KEY,
    timestamp: new Date().toISOString(),
  });
});

// Voice action & dialect parsing endpoint
app.post("/api/voice-action", async (req, res) => {
  try {
    const { prompt, currentLang = "hi", currentView = "hub", farmerProfile } = req.body;

    if (!prompt || typeof prompt !== "string") {
      return res.status(400).json({ error: "Missing prompt" });
    }

    const ai = getGeminiClient();

    // If Gemini is available, use gemini-3.7-flash to parse voice intent with high intelligence
    if (ai) {
      const systemInstruction = `You are Krishi-Setu's Multilingual Cyber-Agri Voice OS Assistant.
You support Indian agricultural dialects including Standard Hindi, Bhojpuri, Maithili, Tamil, and English.
The farmer is interacting with the mobile operating system.

Current application views:
- 'onboarding' (Aadhaar e-KYC & fast-track registration)
- 'hub' (Central Command Hub with RBI ULI credit score and telemetry)
- 'patta-setu' (Form-7A digital tenancy lease, Sentinel-2 NDVI satellite map, RBI ULI loan disbursement)
- 'kavach' (Neural anti-counterfeit QR laser scanner, batch authentication, Geo-velocity anomaly detector)
- 'sheet-vahan' (Cold-chain reefer pooling, tomato/perishable crate booking, mandi price arbitrage)

Extract the farmer's intent and return a clean JSON object with:
1. "spokenResponse": A short, empathetic, spoken response in the farmer's preferred language or dialect (${currentLang}).
2. "targetView": One of ['onboarding', 'hub', 'patta-setu', 'kavach', 'sheet-vahan'].
3. "actionType": One of ['NAVIGATE', 'SET_CRATES', 'DISBURSE_LOAN', 'START_SCAN', 'SIMULATE_COUNTERFEIT', 'SIMULATE_AUTHENTIC', 'SHOW_NDVI', 'BOOK_REEFER', 'ANSWER_QUERY'].
4. "params": Object with any extracted parameters (e.g. { "crates": 60, "loanAmount": 185000, "crop": "tomato" }).
5. "dialectDetected": Dialect detected (e.g. "Bhojpuri", "Hindi", "Tamil", "Maithili", "English").

Return ONLY valid JSON matching this schema:
{
  "spokenResponse": string,
  "targetView": string,
  "actionType": string,
  "params": object,
  "dialectDetected": string
}`;

      const response = await ai.models.generateContent({
        model: "gemini-3.7-flash",
        contents: `Farmer voice input: "${prompt}". Current view: "${currentView}". Current user language: "${currentLang}". Farmer context: ${JSON.stringify(farmerProfile || {})}`,
        config: {
          systemInstruction,
          responseMimeType: "application/json",
          temperature: 0.2,
        },
      });

      const responseText = response.text || "{}";
      try {
        const parsed = JSON.parse(responseText);
        return res.json({
          success: true,
          source: "gemini-3.7-flash",
          ...parsed,
        });
      } catch (parseError) {
        console.warn("Failed to parse Gemini JSON output, falling back to heuristic parser:", parseError);
      }
    }

    // Heuristic Smart Fallback if Gemini key is missing or parse failed
    const lowerPrompt = prompt.toLowerCase();
    let targetView = currentView;
    let actionType = "ANSWER_QUERY";
    let spokenResponse = "";
    let params: Record<string, any> = {};
    let dialectDetected = "Standard Hindi";

    if (
      lowerPrompt.includes("शीत") ||
      lowerPrompt.includes("crate") ||
      lowerPrompt.includes("क्रेट") ||
      lowerPrompt.includes("टमाटर") ||
      lowerPrompt.includes("மண்டி") ||
      lowerPrompt.includes("குளிர்பதன") ||
      lowerPrompt.includes("vahan") ||
      lowerPrompt.includes("reefer") ||
      lowerPrompt.includes("वाहन")
    ) {
      targetView = "sheet-vahan";
      actionType = "SET_CRATES";
      const matchNum = prompt.match(/\d+/);
      const crates = matchNum ? parseInt(matchNum[0], 10) : 60;
      params = { crates: Math.max(10, Math.min(crates, 200)) };

      if (currentLang === "ta") {
        spokenResponse = `${params.crates} பெட்டிகள் குளிர்பதன வாகனத்தில் பதிவு செய்யப்பட்டுள்ளன. லாபம் ₹${(params.crates * 312.5).toLocaleString('en-IN')}.`;
        dialectDetected = "Tamil";
      } else if (lowerPrompt.includes("हमार") || lowerPrompt.includes("दी") || lowerPrompt.includes("बा")) {
        spokenResponse = `${params.crates} क्रेट शीत-वाहन में जोड़ दिहल गइल बा। मंडी से +₹18,750 के अतिरिक्त मुनाफा मिली।`;
        dialectDetected = "Bhojpuri";
      } else {
        spokenResponse = `${params.crates} क्रेट शीत-वाहन में जोड़ दिए गए हैं। मंडी मूल्य से 107% अधिक लाभ प्राप्त होगा।`;
        dialectDetected = "Hindi";
      }
    } else if (
      lowerPrompt.includes("ऋण") ||
      lowerPrompt.includes("loan") ||
      lowerPrompt.includes("पट्टा") ||
      lowerPrompt.includes("கடன்") ||
      lowerPrompt.includes("patta") ||
      lowerPrompt.includes("ndvi") ||
      lowerPrompt.includes("सैटेलाइट") ||
      lowerPrompt.includes("lease") ||
      lowerPrompt.includes("ரூபாய்")
    ) {
      targetView = "patta-setu";
      actionType = "DISBURSE_LOAN";
      params = { loanAmount: 185000 };
      if (currentLang === "ta") {
        spokenResponse = "பட்டா-சேது மூலம் ₹1,85,000 உடனடி கடன் உங்கள் வங்கிக் கணக்கில் அனுமதிக்கப்பட்டது!";
        dialectDetected = "Tamil";
      } else if (lowerPrompt.includes("हमार") || lowerPrompt.includes("चाहीं")) {
        spokenResponse = "आरबीआई यूएलआई द्वारा ₹1.85 लाख ऋण मंजूर हो गइल बा, सीधे आपके बैंक खाता में!";
        dialectDetected = "Bhojpuri";
      } else {
        spokenResponse = "आरबीआई यूएलआई द्वारा ₹1,85,000 का 0-जमानत ऋण आपके खाते में स्वीकृत कर दिया गया है।";
        dialectDetected = "Hindi";
      }
    } else if (
      lowerPrompt.includes("कवच") ||
      lowerPrompt.includes("kavach") ||
      lowerPrompt.includes("नकली") ||
      lowerPrompt.includes("खाद") ||
      lowerPrompt.includes("போலி") ||
      lowerPrompt.includes("scan") ||
      lowerPrompt.includes("स्कैन") ||
      lowerPrompt.includes("qr")
    ) {
      targetView = "kavach";
      actionType = "START_SCAN";
      if (lowerPrompt.includes("नकली") || lowerPrompt.includes("fake") || lowerPrompt.includes("போலி")) {
        actionType = "SIMULATE_COUNTERFEIT";
      }
      if (currentLang === "ta") {
        spokenResponse = "கவச் லேசர் ஸ்கேனர் துவக்கப்பட்டது. உரம் மற்றும் விதைகளின் நம்பகத்தன்மையை சரிபார்க்கிறது.";
        dialectDetected = "Tamil";
      } else {
        spokenResponse = "कवच न्यूरल स्कैनर सक्रिय हो गया है। खाद की प्रामाणिकता और जियो-वेलोसिटी की जांच हो रही है।";
        dialectDetected = "Hindi";
      }
    } else {
      targetView = "hub";
      actionType = "NAVIGATE";
      if (currentLang === "ta") {
        spokenResponse = "கிருஷி-சேது முதன்மை கட்டுப்பாட்டு அறைக்கு செல்கிறது. உங்கள் ULI கடன் மதிப்பீடு 784.";
        dialectDetected = "Tamil";
      } else {
        spokenResponse = "कृषि-सेतु कमांड हब खुला है। आपका आरबीआई ULI क्रेडिट स्कोर 784/900 प्राइम है।";
        dialectDetected = "Hindi";
      }
    }

    return res.json({
      success: true,
      source: "heuristic-fallback",
      spokenResponse,
      targetView,
      actionType,
      params,
      dialectDetected,
    });
  } catch (error: any) {
    console.error("Error handling voice action:", error);
    res.status(500).json({ error: error.message || "Internal server error" });
  }
});

// AI Agri Advisor Consultation Endpoint
app.post("/api/agri-advisor", async (req, res) => {
  try {
    const { question, language = "hi", context } = req.body;
    const ai = getGeminiClient();

    if (ai) {
      const response = await ai.models.generateContent({
        model: "gemini-3.7-flash",
        contents: `You are Krishi-Setu's Senior Agronomist and Rural Sovereign Fintech Expert.
Answer concisely in maximum 3 practical sentences in ${language === 'hi' ? 'Hindi' : language === 'ta' ? 'Tamil' : 'English'}.
Question: ${question}
Farmer context: ${JSON.stringify(context || {})}`,
      });
      return res.json({ answer: response.text });
    }

    // Fallback response
    const fallbackAnswers: Record<string, string> = {
      hi: "सेंटिनल-2 सेटेलाइट के अनुसार आपकी मिट्टी में 38% नमी है। अगले 3 दिनों में टमाटर तुड़ाई कर शीत-वाहन बुक करें ताकि ₹32/किग्रा का भाव मिले।",
      ta: "சென்டினல்-2 நிலப்பரப்பு படி மண்ணின் ஈரப்பதம் 38%. குளிர்சாதன வாகனத்தில் பதிவு செய்து மெட்ரோ மண்டியில் கிலோவுக்கு ₹32 பெறுங்கள்.",
      en: "Sentinel-2 telemetry shows 38% soil moisture. Optimal harvest window is within 48 hours to secure ₹32/kg via Sheet-Vahan pooled reefer."
    };

    return res.json({ answer: fallbackAnswers[language] || fallbackAnswers.hi });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Setup Vite or Static File Serving
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`🌾 Krishi-Setu Server running on http://localhost:${PORT}`);
  });
}

startServer();

"use client";
import React, { createContext, useContext, useState } from "react";

export type Language = "en" | "hi" | "ta";
export type ViewMode = "login" | "hub" | "patta" | "kavach" | "sheet";

export interface AppContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  activeView: ViewMode;
  setActiveView: (view: ViewMode) => void;
  profile: { name: string; district: string; state: string };
  loadDemoData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [lang, setLang] = useState<Language>("hi");
  const [activeView, setActiveView] = useState<ViewMode>("login");
  const [profile, setProfile] = useState({
    name: "सुनीता देवी (Sunita Devi)",
    district: "समस्तीपुर (Samastipur)",
    state: "बिहार (Bihar)",
  });

  const loadDemoData = () => {
    setProfile({
      name: "सुनीता देवी (Sunita Devi)",
      district: "समस्तीपुर (Samastipur)",
      state: "बिहार (Bihar)",
    });
  };

  return (
    <AppContext.Provider value={{ lang, setLang, activeView, setActiveView, profile, loadDemoData }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within AppProvider");
  return context;
};

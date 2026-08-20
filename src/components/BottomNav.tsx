import React from 'react';
import { ViewTab, Language } from '../types';
import { TRANSLATIONS } from '../translations';
import { 
  UserCheck, 
  LayoutDashboard, 
  FileText, 
  ShieldAlert, 
  Truck, 
  Sparkles 
} from 'lucide-react';
import { playClickBeep } from '../utils/audio';

interface BottomNavProps {
  currentView: ViewTab;
  onSelectView: (view: ViewTab) => void;
  currentLang: Language;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentView,
  onSelectView,
  currentLang,
}) => {
  const t = TRANSLATIONS[currentLang];

  const navItems: Array<{
    id: ViewTab;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: string;
  }> = [
    { id: 'onboarding', label: t.navOnboarding, icon: UserCheck },
    { id: 'hub', label: t.navHub, icon: LayoutDashboard },
    { id: 'patta-setu', label: t.navPatta, icon: FileText, badge: '₹1.85L' },
    { id: 'kavach', label: t.navKavach, icon: ShieldAlert },
    { id: 'sheet-vahan', label: t.navSheet, icon: Truck, badge: '+107%' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-2xl border-t border-[#E8E2D9] shadow-lg pb-[max(env(safe-area-inset-bottom),8px)] pt-1.5">
      <div className="max-w-md mx-auto px-2 flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;

          return (
            <button
              key={item.id}
              id={`nav-item-${item.id}`}
              onClick={() => {
                playClickBeep();
                onSelectView(item.id);
              }}
              className={`relative flex flex-col items-center justify-center py-1.5 px-2.5 rounded-2xl transition-all duration-200 ${
                isActive
                  ? 'text-[#4A5D48] font-bold'
                  : 'text-[#8C8275] hover:text-[#3A3A30]'
              }`}
            >
              {/* Active Glow Pill Background */}
              {isActive && (
                <div className="absolute inset-0 bg-[#E8F0E7] border border-[#7E8F7C]/30 rounded-2xl -z-10 shadow-xs" />
              )}

              {/* Icon Container with Badge */}
              <div className="relative">
                <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110 text-[#7E8F7C]' : 'text-[#8C8275]'}`} />
                
                {item.badge && (
                  <span className={`absolute -top-1.5 -right-3 text-[9px] font-mono px-1.5 py-0.2 rounded-full border leading-tight ${
                    item.id === 'patta-setu' 
                      ? 'bg-[#F2EDE7] text-[#7A624E] border-[#D9C5B2]'
                      : 'bg-[#E8F0E7] text-[#4A5D48] border-[#7E8F7C]/30'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </div>

              {/* Label */}
              <span className="text-[10px] tracking-tight mt-1 truncate max-w-[64px]">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

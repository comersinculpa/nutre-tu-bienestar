import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Heart } from 'lucide-react';

export function CrisisButton() {
  const navigate = useNavigate();

  const handleCrisisClick = () => {
    navigate('/crisis');
    // Emergency vibration pattern
    if ('vibrate' in navigator) {
      navigator.vibrate([200, 100, 200, 100, 200]);
    }
  };

  return (
    <button
      onClick={handleCrisisClick}
      className="fixed top-4 right-4 z-50 w-16 h-16 rounded-2xl bg-gradient-to-br from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold text-xs shadow-2xl hover:shadow-red-500/50 transition-all duration-300 transform hover:scale-105 border-2 border-red-400/20"
      aria-label="Ayuda de Crisis - 024 (Salud Mental) y 112 (Emergencias)"
      title="Ayuda inmediata disponible"
    >
      <div className="flex flex-col items-center justify-center">
        <Shield className="w-5 h-5 mb-0.5" />
        <span className="text-[10px] font-bold">CRISIS</span>
        <span className="text-[8px] opacity-90">024•112</span>
      </div>
    </button>
  );
}
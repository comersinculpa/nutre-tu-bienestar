import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';

export function CrisisButton() {
  const navigate = useNavigate();

  const handleCrisisClick = () => {
    navigate('/crisis');
    // Vibración de emergencia
    if ('vibrate' in navigator) {
      navigator.vibrate([100, 50, 100]);
    }
  };

  return (
    <button
      onClick={handleCrisisClick}
      className="crisis-btn"
      aria-label="Ayuda de crisis"
      title="Necesito ayuda ahora"
    >
      <AlertCircle size={24} />
    </button>
  );
}
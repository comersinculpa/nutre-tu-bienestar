import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Pause } from 'lucide-react';

export function PersistentFAB() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Don't show FAB on pause page itself
  if (location.pathname === '/pausa-consciente') {
    return null;
  }

  const handlePauseClick = () => {
    navigate('/pausa-consciente');
    // Haptic feedback
    if ('vibrate' in navigator) {
      navigator.vibrate([100, 50, 100]);
    }
  };

  return (
    <Button
      onClick={handlePauseClick}
      className="fixed bottom-20 right-4 z-40 w-16 h-16 rounded-full bg-gradient-to-br from-ochre-500 to-ochre-600 hover:from-ochre-600 hover:to-ochre-700 text-white shadow-elegant hover:shadow-glow transition-all duration-300 transform hover:scale-110 animate-pulse"
      aria-label="Pausa ahora - Técnicas de respiración 2-3 minutos"
      title="Pausa ahora"
    >
      <Pause className="h-6 w-6" />
    </Button>
  );
}
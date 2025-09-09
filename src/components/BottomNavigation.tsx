import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Home, BookOpen, Users, Wrench, AlertCircle, MessageSquare } from 'lucide-react';
const navigationItems = [{
  id: 'inicio',
  label: 'Inicio',
  icon: Home,
  path: '/'
}, {
  id: 'diario',
  label: 'Diario',
  icon: BookOpen,
  path: '/diario-emocional'
}, {
  id: 'apoyo',
  label: 'Apoyo',
  icon: MessageSquare,
  path: '/apoyo'
}, {
  id: 'comunidad',
  label: 'Comunidad',
  icon: Users,
  path: '/comunidad'
}, {
  id: 'herramientas',
  label: 'Herramientas',
  icon: Wrench,
  path: '/recursos'
}, {
  id: 'crisis',
  label: 'Crisis',
  icon: AlertCircle,
  path: '/crisis'
}];
export function BottomNavigation() {
  const location = useLocation();
  const navigate = useNavigate();
  const handleNavigation = (path: string) => {
    navigate(path);
    // Vibración suave en dispositivos móviles
    if ('vibrate' in navigator) {
      navigator.vibrate(50);
    }
  };
  return <nav className="bottom-nav glass-nav bg-orange-400">
      <div className="flex justify-around items-center max-w-lg mx-auto px-2 py-2">
        {navigationItems.map(item => {
        const Icon = item.icon;
        const isActive = location.pathname === item.path;
        const isCrisis = item.id === 'crisis';
        return <button key={item.id} onClick={() => handleNavigation(item.path)} className={`nav-item relative ${isActive ? 'active' : ''} ${isCrisis ? 'text-crisis hover:text-crisis' : ''}`} aria-label={item.label}>
              <div className="relative z-10">
                <Icon size={22} className={`mb-1 transition-transform duration-300 ${isActive ? 'animate-bounce-gentle' : ''} ${isCrisis ? 'drop-shadow-lg' : ''}`} />
                <span className={`text-xs font-medium transition-all duration-300 ${isActive ? 'font-semibold' : ''}`}>
                  {item.label}
                </span>
              </div>
            </button>;
      })}
      </div>
    </nav>;
}
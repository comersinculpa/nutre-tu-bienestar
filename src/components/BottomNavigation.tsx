import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Home, BookOpen, Users, Wrench, AlertCircle } from 'lucide-react';

const navigationItems = [
  {
    id: 'inicio',
    label: 'Inicio',
    icon: Home,
    path: '/',
  },
  {
    id: 'diario',
    label: 'Diario',
    icon: BookOpen,
    path: '/diario-emocional',
  },
  {
    id: 'comunidad',
    label: 'Comunidad',
    icon: Users,
    path: '/comunidad',
  },
  {
    id: 'herramientas',
    label: 'Herramientas',
    icon: Wrench,
    path: '/recursos',
  },
  {
    id: 'crisis',
    label: 'Crisis',
    icon: AlertCircle,
    path: '/crisis',
  },
];

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

  return (
    <nav className="bottom-nav">
      <div className="flex justify-around items-center max-w-md mx-auto">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          const isCrisis = item.id === 'crisis';
          
          return (
            <button
              key={item.id}
              onClick={() => handleNavigation(item.path)}
              className={`nav-item ${isActive ? 'active' : ''} ${
                isCrisis ? 'text-crisis hover:text-crisis' : ''
              }`}
              aria-label={item.label}
            >
              <Icon 
                size={20} 
                className={`mb-1 ${isActive ? 'animate-scale-in' : ''}`}
              />
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
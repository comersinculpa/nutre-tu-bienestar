import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  Home, 
  Pause, 
  Edit, 
  TrendingUp, 
  User 
} from 'lucide-react';

const navItems = [
  {
    path: '/',
    icon: Home,
    label: 'Inicio',
    description: 'Acceso rápido y progreso'
  },
  {
    path: '/pausa-consciente',
    icon: Pause,
    label: 'Pausa',
    description: 'Técnicas guiadas 2-5 min'
  },
  {
    path: '/registrar',
    icon: Edit,
    label: 'Registrar',
    description: 'Check-in y comer con cuidado'
  },
  {
    path: '/progreso',
    icon: TrendingUp,
    label: 'Progreso',
    description: 'Insights y logros'
  },
  {
    path: '/perfil',
    icon: User,
    label: 'Perfil',
    description: 'Preferencias y privacidad'
  }
];

export function BottomNavigation() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-border shadow-lg">
      <div className="flex items-center justify-around px-2 py-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <button
              key={item.path}
              onClick={() => {
                navigate(item.path);
                if ('vibrate' in navigator) {
                  navigator.vibrate(30);
                }
              }}
              className={`flex flex-col items-center justify-center min-w-[44px] min-h-[44px] px-2 py-2 rounded-xl transition-all duration-200 ${
                isActive 
                  ? 'bg-gradient-brand text-white shadow-soft' 
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
              }`}
              aria-label={`${item.label} - ${item.description}`}
            >
              <Icon className={`h-5 w-5 mb-0.5 ${isActive ? 'scale-110' : ''}`} />
              <span className={`text-xs font-medium ${isActive ? 'font-semibold' : ''}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
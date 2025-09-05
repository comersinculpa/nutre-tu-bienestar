import { Link, useLocation } from 'react-router-dom';
import { Heart, BookOpen, Lightbulb, Home, User } from 'lucide-react';
import { Button } from '@/components/ui/button';

const navItems = [
  { path: '/', icon: Home, label: 'Inicio', color: 'primary' },
  { path: '/diario', icon: BookOpen, label: 'Diario', color: 'accent' },
  { path: '/detector', icon: Lightbulb, label: 'Detector', color: 'warning' },
  { path: '/recursos', icon: Heart, label: 'Recursos', color: 'success' },
  { path: '/perfil', icon: User, label: 'Perfil', color: 'secondary' },
];

export const Navigation = () => {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-sm border-t border-border shadow-warm z-50">
      <div className="flex items-center justify-around px-4 py-2 max-w-lg mx-auto">
        {navItems.map(({ path, icon: Icon, label, color }) => {
          const isActive = location.pathname === path;
          
          return (
            <Link key={path} to={path} className="flex-1">
              <Button
                variant="ghost"
                size="sm"
                className={`
                  w-full flex flex-col items-center gap-1 py-3 px-2 h-auto
                  transition-all duration-300 rounded-lg
                  ${isActive 
                    ? `bg-${color}/10 text-${color} shadow-soft` 
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  }
                `}
              >
                <Icon size={20} />
                <span className="text-xs font-medium">{label}</span>
              </Button>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
import React from 'react';
import { Mic, Music, Wrench, Users, Home, Calendar, Speech } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname.split('/')[1] || 'home';

  const navItems = [
    { id: 'home', icon: <Home />, label: 'Accueil', path: '/audioscan' },
    { id: 'voice', icon: <Mic />, label: 'Analyse', path: '/audioscan/voice' },
    { id: 'exercises', icon: <Speech />, label: 'Exercices', path: '/audioscan/exercises' },
    { id: 'library', icon: <Music />, label: 'Sons', path: '/audioscan/library' },
    { id: 'tools', icon: <Wrench />, label: 'Outils', path: '/audioscan/tools' },
    { id: 'community', icon: <Users />, label: 'Communauté', path: '/audioscan/community' },
    { id: 'cycle', icon: <Calendar />, label: 'Cycle', path: '/audioscan/cycle' }
  ];

  return (
    <nav className="fixed z-50 transition-all duration-300 md:left-0 md:top-0 md:w-20 md:h-full md:border-r md:border-t-0 md:border-purple-200/20 bottom-0 left-0 w-full bg-white/10 backdrop-blur-lg border-t border-purple-200/20">
      <div className="flex md:flex-col md:h-full md:justify-center md:gap-8 md:py-8 justify-around items-center p-2 overflow-x-auto hide-scrollbar">
        {navItems.map((item) => (
          <NavItem
            key={item.id}
            icon={item.icon}
            label={item.label}
            active={currentPath === item.id}
            onClick={() => navigate(item.path)}
          />
        ))}
      </div>
    </nav>
  );
};

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick: () => void;
}

const NavItem = ({ icon, label, active, onClick }: NavItemProps) => {
  return (
    <button
      className={`
        group flex flex-col items-center gap-1 transition-colors p-2
        ${active ? 'text-purple-100' : 'text-purple-100/60 hover:text-purple-100'}
        md:w-full
      `}
      onClick={onClick}
    >
      <div className={`
        p-2 rounded-xl transition-colors
        ${active ? 'bg-purple-500/20' : 'group-hover:bg-purple-500/20'}
      `}>
        {icon}
      </div>
      <span className="text-xs whitespace-nowrap">{label}</span>
    </button>
  );
};

export default Navbar;
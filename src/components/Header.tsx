import React from 'react';
import { Bell, LogOut, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { signOut } from '../services/auth.service';
import { useAuth } from '../hooks/useAuth';

const Header = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/auth');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <header className="fixed top-0 right-0 left-0 md:left-20 bg-white/10 backdrop-blur-lg border-b border-purple-200/20 p-4 z-50">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <h1 className="text-2xl font-semibold bg-gradient-to-r from-purple-200 to-purple-400 bg-clip-text text-transparent">
          Renescens
        </h1>
        <div className="flex items-center gap-4">
          
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/audioscan/profile')}
            className="p-2 rounded-full hover:bg-purple-500/20 transition-colors"
          >
            <User className="text-purple-100/60 hover:text-purple-100" />
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleLogout}
            className="p-2 rounded-full hover:bg-purple-500/20 transition-colors"
          >
            <LogOut className="text-purple-100/60 hover:text-purple-100" />
          </motion.button>
        </div>
      </div>
    </header>
  );
};

export default Header;
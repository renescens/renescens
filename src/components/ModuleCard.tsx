import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

interface ModuleCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  gradient: string;
  path: string;
}

const ModuleCard = ({ title, description, icon, gradient, path }: ModuleCardProps) => {
  const navigate = useNavigate();

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className={`p-6 rounded-2xl ${gradient} backdrop-blur-lg cursor-pointer`}
      onClick={() => navigate(path)}
    >
      <div className="flex items-start gap-4">
        <div className="p-3 bg-white/10 rounded-xl">
          {icon}
        </div>
        <div>
          <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
          <p className="text-purple-100/80 text-sm">{description}</p>
        </div>
      </div>
    </motion.div>
  );
};

export default ModuleCard;
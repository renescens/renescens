import React, { useEffect, useState } from 'react';
import { Clock, Activity } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../../hooks/useAuth';

const ProfileProgress: React.FC = () => {
  const { profile } = useAuth();
  const [totalTime, setTotalTime] = useState<number>(0); 
  const [progressPercentage, setProgressPercentage] = useState<number>(65); 
  useEffect(() => {
    const storedStartTime = localStorage.getItem('startTime');
    const storedTotalTime = localStorage.getItem('totalTime');
    
    if (storedStartTime && storedTotalTime) {
      const startTime = parseInt(storedStartTime);
      const totalTime = parseInt(storedTotalTime);
      const elapsedTime = Math.floor((Date.now() - startTime) / 1000); 
      setTotalTime(totalTime + elapsedTime); 
    } else {
      const newStartTime = Date.now();
      localStorage.setItem('startTime', newStartTime.toString());
    }

    localStorage.setItem('totalTime', totalTime.toString());
  }, []);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };
  useEffect(() => {
    const getProfile = async () => {
      if (profile) {
        
        console.log("le profile:", profile); // Should output a Date object
        
        
      }
    };
    getProfile();
  }, [profile]);
  

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="grid gap-6 md:grid-cols-2">
        {/* <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-purple-500/20 to-purple-700/20 p-6 rounded-2xl backdrop-blur-lg"
        >
          <div className="flex items-center gap-3 mb-3">
            <Clock className="w-6 h-6 text-purple-300" />
            <span className="text-purple-200/80">Temps total d'utilisation</span>
          </div>
          <p className="text-3xl font-bold">{formatTime(totalTime)}</p>
        </motion.div> */}

        {/* <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-blue-500/20 to-blue-700/20 p-6 rounded-2xl backdrop-blur-lg"
        >
          <div className="flex items-center gap-3 mb-3">
            <Activity className="w-6 h-6 text-blue-300" />
            <span className="text-purple-200/80">Progression globale</span>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Niveau {Math.floor(progressPercentage / 20)}</span>
              <span>{progressPercentage}%</span>
            </div>
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progressPercentage}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className="h-full bg-blue-500"
              />
            </div>
          </div>
        </motion.div> */}
      </div>

      {/* Détails de progression */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white/10 rounded-xl p-6 backdrop-blur-lg"
      >
        <h3 className="text-xl font-semibold mb-6">Détails de progression</h3>
        
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-purple-200/80">Cycle 21 jours</span>
            {profile && <span className="font-medium">{profile?.completedDays.length  } / 21</span>          }
          </div>
          
          {/* <div className="flex justify-between items-center">
            <span className="text-purple-200/80">Analyses vocales</span>
            <span className="font-medium">12</span>
          </div> */}
          
          <div className="flex justify-between items-center">
            <span className="text-purple-200/80">Dernière connexion</span>
            <span className="font-medium">
              {new Date().toLocaleDateString('fr-FR', {
                day: 'numeric',
                month: 'long',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ProfileProgress;

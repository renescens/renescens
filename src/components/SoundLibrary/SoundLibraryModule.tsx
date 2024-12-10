import React, { useState } from 'react';
import { Music, PlayCircle, Filter, Search } from 'lucide-react';
import { motion } from 'framer-motion';
import VideoPlayer from './VideoPlayer';
import VideoCard from './VideoCard';

interface Video {
  id: string;
  title: string;
  category: string;
}

const SoundLibraryModule = () => {
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const videos: Video[] = [
    { id: 'l_QiTxkLVkM', title: 'Une approche scientifique et ancestrale pour un bien-être global', category: 'relaxation' },
    { id: '3d3J7_m3tCM', title: '174 Hz – Sérénité profonde : libération des tensions', category: 'Fréquences' },
    { id: 'Wntg2aVS6Bk', title: '285 Hz – Énergie régénératrice : réparation et vitalité', category: 'Fréquences' },
    { id: 'enFwb3Oaf3E', title: '396 Hz – Libération émotionnelle : apaiser les peurs', category: 'Fréquences' },
    { id: '0iaHLtwkgIs', title: '417 Hz – Éveil au changement : transformation positive', category: 'Fréquences' },
    { id: 'xPVf8IdSlB0', title: '528 Hz – Fréquence harmonieuse : amour et réparation cellulaire', category: 'Fréquences' },
    { id: 'dQc8p0QSMU0', title: '639 Hz – Connexion et harmonie : renforcer les liens', category: 'Fréquences' },
    { id: 'iqmPj1eByac', title: '852 Hz – Intuition et éveil : connexion spirituelle', category: 'Fréquences' },
    
  ];

  const categories = ['all', ...new Set(videos.map(video => video.category))];

  const filteredVideos = videos.filter(video => {
    const matchesSearch = video.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || video.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="bg-white/10 rounded-xl p-6 backdrop-blur-lg">
        <div className="flex items-center gap-3 mb-6">
          <Music className="w-6 h-6 text-purple-300" />
          <h3 className="text-xl font-semibold">Bibliothèque Sonore</h3>
        </div>
        
        <p className="text-purple-200/80">
          Découvrez la bibliothèque sonore de l'application Renescens, conçue pour vous offrir une expérience immersive de relaxation et de bien-être. Exploitant les principes de la sonothérapie, notre collection de sons et de vibrations vise à réduire le stress et à harmoniser vos énergies internes, favorisant ainsi une détente profonde et un équilibre global.
        </p>
      </div>

      {/* Filtres et Recherche */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-purple-300/60" />
          <input
            type="text"
            placeholder="Rechercher un son..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white/5 border border-purple-300/20 rounded-lg 
                     focus:outline-none focus:border-purple-300/40 transition-colors"
          />
        </div>

        <div className="relative">
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-purple-300/60" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="pl-10 pr-8 py-2 bg-white/5 border border-purple-300/20 rounded-lg 
                     appearance-none focus:outline-none focus:border-purple-300/40 transition-colors"
          >
            {categories.map(category => (
              <option key={category} value={category} className="bg-gray-800">
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Lecteur Vidéo */}
      {selectedVideo && (
        <div className="bg-black/30 rounded-xl p-4">
          <VideoPlayer videoId={selectedVideo} />
        </div>
      )}

      {/* Liste des Vidéos */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredVideos.map((video) => (
          <VideoCard
            key={video.id}
            video={video}
            isActive={selectedVideo === video.id}
            onClick={() => setSelectedVideo(video.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default SoundLibraryModule;
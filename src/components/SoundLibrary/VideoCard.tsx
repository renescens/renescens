import React from 'react';
import { PlayCircle } from 'lucide-react';
import { motion } from 'framer-motion';

interface VideoCardProps {
  video: {
    id: string;
    title: string;
    category: string;
  };
  isActive: boolean;
  onClick: () => void;
}

const VideoCard: React.FC<VideoCardProps> = ({ video, isActive, onClick }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`p-4 rounded-xl cursor-pointer transition-colors ${
        isActive 
          ? 'bg-purple-500/30' 
          : 'bg-white/10 hover:bg-white/20'
      }`}
      onClick={onClick}
    >
      <div className="relative aspect-video mb-3">
        <img
          src={`https://img.youtube.com/vi/${video.id}/hqdefault.jpg`}
          alt={video.title}
          className="w-full h-full object-cover rounded-lg"
        />
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-lg">
          <PlayCircle className={`w-12 h-12 ${
            isActive ? 'text-purple-300' : 'text-white/80'
          }`} />
        </div>
      </div>

      <h4 className="font-medium mb-2 line-clamp-2">{video.title}</h4>
      
      <span className="inline-block px-2 py-1 text-xs rounded-full bg-white/10">
        {video.category.charAt(0).toUpperCase() + video.category.slice(1)}
      </span>
    </motion.div>
  );
};

export default VideoCard;
import React from 'react';
import { motion } from 'framer-motion';
import { Camera, Edit2 } from 'lucide-react';
import { UserProfile } from '../../types/user';

interface ProfileHeaderProps {
  profile: UserProfile;
  onEdit: () => void;
  onPhotoChange: (file: File) => void;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ profile, onEdit, onPhotoChange }) => {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onPhotoChange(file);
    }
  };

  return (
    <div className="flex items-center gap-6">
      <div className="relative">
        <div className="w-24 h-24 rounded-full bg-white/10 flex items-center justify-center overflow-hidden">
          {profile.photoURL ? (
            <img 
              src={profile.photoURL} 
              alt={profile.displayName} 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-purple-500/20">
              <span className="text-2xl font-bold text-purple-200">
                {profile.firstName.charAt(0)}{profile.lastName.charAt(0)}
              </span>
            </div>
          )}
        </div>
        <label className="absolute bottom-0 right-0 p-2 bg-purple-500/20 rounded-full cursor-pointer hover:bg-purple-500/30 transition-colors">
          <Camera className="w-4 h-4" />
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </label>
      </div>

      <div className="flex-1">
        <h2 className="text-2xl font-bold mb-2">
          {profile.firstName} {profile.lastName}
        </h2>
        <p className="text-purple-200/60">{profile.email}</p>
      </div>

      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={onEdit}
        className="p-2 rounded-lg bg-purple-500/20 hover:bg-purple-500/30 transition-colors"
      >
        <Edit2 className="w-5 h-5" />
      </motion.button>
    </div>
  );
};

export default ProfileHeader;
import React, { useEffect, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import ProfileHeader from './ProfileHeader';
import ProfileForm from './ProfileForm';
import { uploadFile } from '../../services/storage.service';
import { updateUserProfile } from '../../services/database.service';
import { parse } from 'date-fns';


const ProfileView: React.FC = () => {
  const { profile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  useEffect(() => {
    const getProfile = async () => {
      if (profile?.dateOfBirth) {
        const date = profile.dateOfBirth.toDate ? profile.dateOfBirth.toDate() : new Date(profile.dateOfBirth.seconds * 1000);
        
        console.log("Date of Birth:", date); // Should output a Date object
        
        // Convert the Date object to a locale string if needed
        console.log(date.toLocaleString()); // Outputs the formatted date
      }
    };
    getProfile();
  }, [profile?.dateOfBirth]);
  
  

  if (!profile) {
    return (
      <div className="text-center py-8">
        <p className="text-purple-200/60">Profil non trouvé</p>
      </div>
    );
  }

  const handlePhotoChange = async (file: File) => {
    try {
      const photoURL = await uploadFile(`profiles/${profile.id}/avatar`, file);
      await updateUserProfile(profile.id, { photoURL });
    } catch (error) {
      console.error('Error updating profile photo:', error);
    }
  };
 
  

  return (
    <div className="space-y-8">
      <ProfileHeader
        profile={profile}
        onEdit={() => setIsEditing(true)}
        onPhotoChange={handlePhotoChange}
      />

      {isEditing ? (
        <ProfileForm
          initialData={profile}
          onSave={() => setIsEditing(false)}
        />
      ) : (
        <div className="grid gap-8 md:grid-cols-2">
          <div className="bg-white/5 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-6">Informations personnelles</h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-purple-200/60">Email</p>
                <p>{profile.email}</p>
              </div>
              {profile.phoneNumber && (
                <div>
                  <p className="text-sm text-purple-200/60">Téléphone</p>
                  <p>{profile.phoneNumber}</p>
                </div>
              )}
              {profile.dateOfBirth && (
                <div>
                 <p className="text-sm text-purple-200/60">Date de naissance</p>
<p>
  {profile?.dateOfBirth
    ? new Date(profile.dateOfBirth.seconds * 1000).toLocaleDateString()
    : 'Date not available'}
</p>

                </div>
              )}
            </div>
          </div>

          <div className="bg-white/5 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-6">Adresse</h3>
            <div className="space-y-4">
              {profile.address.street && (
                <div>
                  <p className="text-sm text-purple-200/60">Rue</p>
                  <p>{profile.address.street}</p>
                </div>
              )}
              <div className="grid grid-cols-2 gap-4">
                {profile.address.postalCode && (
                  <div>
                    <p className="text-sm text-purple-200/60">Code postal</p>
                    <p>{profile.address.postalCode}</p>
                  </div>
                )}
                {profile.address.city && (
                  <div>
                    <p className="text-sm text-purple-200/60">Ville</p>
                    <p>{profile.address.city}</p>
                  </div>
                )}
              </div>
              {profile.address.country && (
                <div>
                  <p className="text-sm text-purple-200/60">Pays</p>
                  <p>{profile.address.country}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileView;
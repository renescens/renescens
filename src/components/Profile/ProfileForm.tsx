import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, Loader, AlertCircle } from 'lucide-react';
import { UserProfile, UserProfileFormData } from '../../types/user';
import { updateUserProfile } from '../../services/profile.service';
import { Timestamp } from 'firebase/firestore';

interface ProfileFormProps {
  initialData?: UserProfile;
  onSave: () => void;
}

const ProfileForm: React.FC<ProfileFormProps> = ({ initialData, onSave }) => {
  const [formData, setFormData] = useState<UserProfileFormData>({
    firstName: '',
    lastName: '',
    displayName: '',
    dateOfBirth: '',
    phoneNumber: '',
    address: {
      street: '',
      city: '',
      postalCode: '',
      country: ''
    },
    experience: '',
    interests: []
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialData) {
      setFormData({
        firstName: initialData.firstName,
        lastName: initialData.lastName,
        displayName: initialData.displayName,
        dateOfBirth: initialData.dateOfBirth
          ? new Date(initialData.dateOfBirth.seconds * 1000) // Convert Firestore `Timestamp` to JS Date
              .toISOString()
              .split('T')[0] // Format for `date` input field (YYYY-MM-DD)
          : '',
        phoneNumber: initialData.phoneNumber,
        address: initialData.address,
        experience: initialData.experience || '',
        interests: initialData.interests || []
      });
    }
  }, [initialData]);
  
  

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNestedInputChange = (field: string, subField: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: { ...prev[field], [subField]: value }
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
  
    // Convert `dateOfBirth` to Firestore Timestamp
    const updatedFormData = {
      ...formData,
      dateOfBirth: formData.dateOfBirth
        ? Timestamp.fromDate(new Date(formData.dateOfBirth)) // Convert to Firestore Timestamp
        : null
    };
  
    try {
      await updateUserProfile(initialData?.id || '', updatedFormData);
      onSave();
      window.location.reload(); // Refresh to reflect updated data
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* First and Last Name */}
      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <label className="block text-sm font-medium mb-2">First Name</label>
          <input
            type="text"
            value={formData.firstName}
            onChange={e => handleInputChange('firstName', e.target.value)}
            className="w-full px-4 py-2 bg-white/5 border border-purple-300/20 rounded-lg"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Last Name</label>
          <input
            type="text"
            value={formData.lastName}
            onChange={e => handleInputChange('lastName', e.target.value)}
            className="w-full px-4 py-2 bg-white/5 border border-purple-300/20 rounded-lg"
            required
          />
        </div>
      </div>

      {/* Display Name */}
      <div>
        <label className="block text-sm font-medium mb-2">Display Name</label>
        <input
          type="text"
          value={formData.displayName}
          onChange={e => handleInputChange('displayName', e.target.value)}
          className="w-full px-4 py-2 bg-white/5 border border-purple-300/20 rounded-lg"
        />
      </div>

      {/* Date of Birth and Phone Number */}
      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <label className="block text-sm font-medium mb-2">Date of Birth</label>
          <input
            type="date"
            value={formData.dateOfBirth || ''}
            onChange={e => handleInputChange('dateOfBirth', e.target.value)}
            className="w-full px-4 py-2 bg-white/5 border border-purple-300/20 rounded-lg"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Phone Number</label>
          <input
            type="tel"
            value={formData.phoneNumber}
            onChange={e => handleInputChange('phoneNumber', e.target.value)}
            className="w-full px-4 py-2 bg-white/5 border border-purple-300/20 rounded-lg"
          />
        </div>
      </div>

      {/* Address */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Address</h3>
        <div>
          <label className="block text-sm font-medium mb-2">Street</label>
          <input
            type="text"
            value={formData.address.street}
            onChange={e => handleNestedInputChange('address', 'street', e.target.value)}
            className="w-full px-4 py-2 bg-white/5 border border-purple-300/20 rounded-lg"
          />
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          <div>
            <label className="block text-sm font-medium mb-2">Postal Code</label>
            <input
              type="text"
              value={formData.address.postalCode}
              onChange={e => handleNestedInputChange('address', 'postalCode', e.target.value)}
              className="w-full px-4 py-2 bg-white/5 border border-purple-300/20 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">City</label>
            <input
              type="text"
              value={formData.address.city}
              onChange={e => handleNestedInputChange('address', 'city', e.target.value)}
              className="w-full px-4 py-2 bg-white/5 border border-purple-300/20 rounded-lg"
            />
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="flex items-center gap-2 p-4 bg-red-500/20 rounded-lg">
          <AlertCircle className="w-5 h-5 text-red-300" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* Buttons */}
      <div className="flex justify-end gap-4">
        <motion.button
          type="button"
          onClick={onSave}
          className="px-4 py-2 hover:bg-white/5 rounded-lg transition-colors"
        >
          Cancel
        </motion.button>
        <motion.button
          type="submit"
          disabled={loading}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 px-6 py-2 bg-purple-500/20 hover:bg-purple-500/30 rounded-lg transition-colors disabled:opacity-50"
        >
          {loading ? (
            <Loader className="w-5 h-5 animate-spin" />
          ) : (
            <>
              <Save className="w-5 h-5" />
              <span>Save</span>
            </>
          )}
        </motion.button>
      </div>
    </form>
  );
};

export default ProfileForm;

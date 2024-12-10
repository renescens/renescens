import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../ui/Tabs';
import ProfileView from './ProfileView';
import ProfileSettings from './ProfileSettings';
import ProfileProgress from './ProfileProgress';
import ProfileSubscription from './ProfileSubscription';

const ProfilePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('profile');

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-white/10 p-1 rounded-lg">
          <TabsTrigger value="profile" className="px-4 py-2 rounded-md">
            Mon Profil
          </TabsTrigger>
         
          <TabsTrigger value="progress" className="px-4 py-2 rounded-md">
            Progression
          </TabsTrigger>
         
        </TabsList>

        <TabsContent value="profile" className="mt-6">
          <ProfileView onEdit={() => setActiveTab('settings')} />
        </TabsContent>

        <TabsContent value="settings" className="mt-6">
          <ProfileSettings />
        </TabsContent>

        <TabsContent value="progress" className="mt-6">
          <ProfileProgress />
        </TabsContent>

        
      </Tabs>
    </div>
  );
};

export default ProfilePage;
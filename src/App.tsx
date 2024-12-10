import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Header from './components/Header';
import DynamicBackground from './components/DynamicBackground';
import AuthPage from './components/Auth/AuthPage';
import PrivateRoute from './components/Auth/PrivateRoute';
import VoiceAnalysisModule from './components/VoiceAnalysis/VoiceAnalysisModule';
import ExerciseModule from './components/ExerciseModule';
import SoundLibraryModule from './components/SoundLibrary/SoundLibraryModule';
import ToolsModule from './components/ToolsModule/ToolsModule';
import CommunityModule from './components/CommunityModule/CommunityModule';
import CycleModule from './components/CycleModule/CycleModule';
import ProfilePage from './components/Profile/ProfilePage';
import HomeModule from './components/HomeModule';

const App = () => {
  return (
    <Router>
      <DynamicBackground />
      <Routes>
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/" element={<Navigate to="/home" />} />
        <Route path="/home" element={<PrivateRoute><MainLayout><HomeModule /></MainLayout></PrivateRoute>} />
        <Route path="/voice" element={<PrivateRoute><MainLayout><VoiceAnalysisModule /></MainLayout></PrivateRoute>} />
        <Route path="/exercises" element={<PrivateRoute><MainLayout><ExerciseModule /></MainLayout></PrivateRoute>} />
        <Route path="/library" element={<PrivateRoute><MainLayout><SoundLibraryModule /></MainLayout></PrivateRoute>} />
        <Route path="/tools" element={<PrivateRoute><MainLayout><ToolsModule /></MainLayout></PrivateRoute>} />
        <Route path="/community" element={<PrivateRoute><MainLayout><CommunityModule /></MainLayout></PrivateRoute>} />
        <Route path="/cycle" element={<PrivateRoute><MainLayout><CycleModule /></MainLayout></PrivateRoute>} />
        <Route path="/profile" element={<PrivateRoute><MainLayout><ProfilePage /></MainLayout></PrivateRoute>} />
      </Routes>
    </Router>
  );
};

const MainLayout: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen">
      <Header />
      <Navbar />
      <main className="pt-24 pb-24 px-4 md:pl-24 md:pr-4 md:py-24">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

export default App;
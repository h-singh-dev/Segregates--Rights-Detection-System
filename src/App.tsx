/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import WasteClassifier from './components/WasteClassifier';
import Analytics from './components/Analytics';
import History from './components/History';
import Guide from './components/Guide';
import Login from './components/Login';
import { Camera } from 'lucide-react';
import { motion } from 'motion/react';
import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';

export default function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [user, setUser] = useState<string | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('segregate_auth');
    if (savedUser) setUser(savedUser);
  }, []);

  const handleLogin = (username: string) => {
    localStorage.setItem('segregate_auth', username);
    setUser(username);
  };

  const handleLogout = () => {
    localStorage.removeItem('segregate_auth');
    setUser(null);
  };

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-background text-on-surface glass-gradient">
      <TopBar onMenuClick={() => setIsSidebarOpen(true)} />
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
        user={user}
        onLogout={handleLogout}
      />
      
      <main className="md:ml-64 pt-32 px-6 pb-20 max-w-7xl mx-auto min-h-screen">
        <Routes>
          <Route path="/" element={<WasteClassifier />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/history" element={<History />} />
          <Route path="/guide" element={<Guide />} />
        </Routes>
      </main>

    </div>
  );
}

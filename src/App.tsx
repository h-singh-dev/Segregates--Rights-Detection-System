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
import { Camera } from 'lucide-react';
import { motion } from 'motion/react';
import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';

export default function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-on-surface glass-gradient">
      <TopBar onMenuClick={() => setIsSidebarOpen(true)} />
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
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

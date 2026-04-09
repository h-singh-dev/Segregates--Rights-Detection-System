import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Leaf, Lock, User as UserIcon, ArrowRight } from 'lucide-react';

export default function Login({ onLogin }: { onLogin: (username: string) => void }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim() && password.trim()) {
      onLogin(username);
    }
  };

  return (
    <div className="min-h-screen bg-background text-on-surface glass-gradient flex flex-col items-center justify-center p-6 relative overflow-hidden">
      
      {/* Decorative background blurs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[128px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-[128px] pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-surface-container-low/80 backdrop-blur-xl border border-outline-variant/10 p-8 md:p-12 rounded-3xl shadow-2xl relative z-10"
      >
        <div className="flex flex-col items-center text-center mb-10">
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-6">
            <Leaf size={32} />
          </div>
          <h1 className="text-3xl font-headline font-bold text-on-surface mb-2">Welcome Back</h1>
          <p className="text-sm text-on-surface-variant">Sign in to classify and track your environmental impact.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-headline tracking-widest uppercase text-on-surface-variant mb-2">Username</label>
            <div className="relative">
              <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant/50" size={20} />
              <input 
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                className="w-full bg-surface-container-highest border border-outline-variant/20 rounded-xl py-4 pl-12 pr-4 text-on-surface focus:outline-none focus:border-primary transition-colors"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-headline tracking-widest uppercase text-on-surface-variant mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant/50" size={20} />
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-surface-container-highest border border-outline-variant/20 rounded-xl py-4 pl-12 pr-4 text-on-surface focus:outline-none focus:border-primary transition-colors"
                required
              />
            </div>
          </div>

          <button 
            type="submit"
            className="w-full bg-primary text-on-primary font-bold py-4 rounded-xl hover:bg-primary-container transition-all flex items-center justify-center gap-2 group mt-8"
          >
            <span>Sign In</span>
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-xs text-on-surface-variant">
            Prototype Mode: Any combination of username and password will grant access.
          </p>
        </div>
      </motion.div>
    </div>
  );
}

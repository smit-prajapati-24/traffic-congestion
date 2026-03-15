
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Shield, Cpu, Zap, ChevronRight, BarChart3, Globe, Database, Lock, Server, LogOut, User as UserIcon } from 'lucide-react';
import AuthModal from './AuthModal';
import { isAuthenticated, logout } from '../services/authService';

const LandingPage = () => {
  const [efficiency, setEfficiency] = useState(94);
  const [activeVehicles, setActiveVehicles] = useState(124);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [userAuth, setUserAuth] = useState(isAuthenticated());

  // Simulate data changes
  useEffect(() => {
    const interval = setInterval(() => {
      setEfficiency(prev => Math.min(99, Math.max(90, prev + (Math.random() - 0.5) * 2)));
      setActiveVehicles(prev => Math.round(prev + (Math.random() - 0.5) * 10));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleAction = (action) => {
    if (!userAuth) {
      setIsAuthModalOpen(true);
      return;
    }
    alert(`Action Triggered: ${action}`);
  };

  const handleLogout = () => {
    logout();
    setUserAuth(false);
  };

  return (
    <div className="w-full h-screen overflow-y-auto overflow-x-hidden relative scroll-smooth">
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthSuccess={() => setUserAuth(true)}
      />

      {/* Sticky Header Nav */}
      <header className="fixed top-0 left-0 w-full z-50 p-6 md:px-16 flex items-center justify-between pointer-events-auto bg-slate-900/50 backdrop-blur-md border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-600 rounded-xl shadow-[0_0_15px_rgba(37,99,235,0.5)]">
            <Cpu size={22} className="text-white" />
          </div>
          <span className="text-2xl font-black tracking-tight text-white font-montserrat drop-shadow-md">SmartFlow <span className="text-blue-500">AI</span></span>
        </div>

        <nav className="hidden md:flex items-center gap-8 text-sm font-bold text-slate-300">
          <button onClick={() => document.getElementById('architecture').scrollIntoView({ behavior: 'smooth' })} className="transition-colors hover:text-white drop-shadow-sm">Architecture</button>
          <button onClick={() => document.getElementById('data').scrollIntoView({ behavior: 'smooth' })} className="transition-colors hover:text-white drop-shadow-sm">Real-time Data</button>

          {userAuth ? (
            <div className="flex items-center gap-4 pl-4 border-l border-white/10">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-lg border border-white/10">
                <UserIcon size={14} className="text-blue-400" />
                <span className="text-xs text-white">Active Node</span>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 text-slate-400 hover:text-red-400 transition-colors"
                title="Sign Out"
              >
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="px-5 py-2 text-white bg-blue-600 rounded-full hover:bg-blue-500 transition-all text-xs tracking-wide shadow-lg shadow-blue-500/20"
            >
              Get Started
            </button>
          )}
        </nav>
      </header>

      {/* Hero Section (100vh) */}
      <section className="relative w-full min-h-screen flex flex-col justify-center px-8 md:px-16 pt-24 pointer-events-none">
        <main className="flex flex-col items-start justify-center max-w-xl">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="p-8 rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl pointer-events-auto"
          >
            <div className="inline-flex items-center px-3 py-1 mb-6 text-xs font-semibold text-blue-400 bg-blue-900/40 rounded-full border border-blue-500/30">
              <Zap size={14} className="mr-1" /> NEXT-GEN TRAFFIC MANAGEMENT
            </div>
            <h1 className="mb-4 text-5xl md:text-7xl font-black text-white leading-[1.1] tracking-tighter drop-shadow-md">
              SmartFlow <br /><span className="text-blue-400">AI Engine</span>
            </h1>
            <p className="mb-8 text-lg text-slate-200 leading-relaxed font-medium drop-shadow-sm max-w-md">
              A systematic crossroads management system powered by real-time neural networks.
              Optimize urban flow, reduce emissions, and save lives.
            </p>

            <div className="flex flex-wrap gap-4">
              <button onClick={() => handleAction('Get Started')} className="flex items-center gap-2 px-6 py-3 text-sm font-bold text-white bg-blue-600 shadow-lg shadow-blue-500/30 rounded-xl hover:bg-blue-500 transition-all group">
                Get Started <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <button onClick={() => document.getElementById('details-section').scrollIntoView({ behavior: 'smooth' })} className="px-6 py-3 text-sm font-bold text-white bg-white/10 border border-white/20 rounded-xl hover:bg-white/20 transition-all backdrop-blur-sm">
                Explore More
              </button>
            </div>
          </motion.div>
        </main>
      </section>

      {/* Details Section Array */}
      <div id="details-section" className="relative z-10 w-full bg-slate-950/40 backdrop-blur-md border-t border-white/10 min-h-screen pt-24 pointer-events-auto">
        <div className="max-w-6xl mx-auto px-8 py-20">
          <div id="architecture" className="text-center mb-20 scroll-mt-32">
            <h2 className="text-4xl md:text-6xl font-black text-white mb-6">How It Works</h2>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">Our advanced AI monitors the intersection in real-time, instantly adapting traffic light logic to vehicle flow.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
            <div id="data" className="p-8 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors scroll-mt-32">
              <Database className="text-blue-500 mb-6 w-12 h-12" />
              <h3 className="text-2xl font-bold text-white mb-4">Live Vehicle Tracking</h3>
              <p className="text-slate-400 leading-relaxed">Cameras and sensors pass multidimensional visual data to the AI core to map all surrounding cars.</p>
            </div>
            <div className="p-8 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
              <Server className="text-emerald-500 mb-6 w-12 h-12" />
              <h3 className="text-2xl font-bold text-white mb-4">Edge Processing</h3>
              <p className="text-slate-400 leading-relaxed">Latency is entirely eliminated. Decisions are processed directly at the junction via an autonomous edge agent.</p>
            </div>
            <div id="security" className="p-8 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors scroll-mt-32">
              <Shield className="text-purple-500 mb-6 w-12 h-12" />
              <h3 className="text-2xl font-bold text-white mb-4">Secure & Instant Override</h3>
              <p className="text-slate-400 leading-relaxed">Encrypted priority access for emergency vehicles. Secured from external cyber threats.</p>
            </div>
          </div>

          <div className="p-12 rounded-3xl bg-gradient-to-r from-blue-900/40 to-indigo-900/40 border border-blue-500/20 flex flex-col items-center text-center">
            <h3 className="text-3xl font-black text-white mb-6">Ready to Optimize Your Intersections?</h3>
            <button onClick={() => handleAction('Contact Sales')} className="px-8 py-4 text-lg font-bold text-slate-900 bg-white rounded-xl hover:bg-slate-200 transition-all">
              Initialize Deployment
            </button>
          </div>
        </div>
      </div>

      {/* Live Status Widget - Fixed position */}
      <div className="fixed top-24 right-8 z-20 pointer-events-auto">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="p-5 rounded-2xl bg-slate-900/60 backdrop-blur-md border border-slate-700 shadow-2xl min-w-[220px]"
        >
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-700">
            <h3 className="text-xs font-bold text-white flex items-center gap-2">
              <Activity size={14} className="text-green-400" /> LIVE NODE STATUS
            </h3>
            <div className="w-2 h-2 bg-green-400 rounded-full flex items-center justify-center">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-ping opacity-75"></div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                <span>Network Efficiency</span>
                <span className="text-blue-400">{efficiency.toFixed(1)}%</span>
              </div>
              <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${efficiency}%` }}
                  className="h-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="text-center">
                <div className="text-[9px] font-bold text-slate-500 uppercase mb-1">Active Nodes</div>
                <div className="text-lg font-black text-white">{activeVehicles}</div>
              </div>
              <div className="text-center">
                <div className="text-[9px] font-bold text-slate-500 uppercase mb-1">Latency</div>
                <div className="text-lg font-black text-white">12ms</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Background Info Footer - Fixed position */}
      <footer className="fixed bottom-6 right-8 flex gap-6 text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] pointer-events-none z-20">
        <span className="flex items-center gap-1.5"><Globe size={12} /> Global Central Station</span>
        <span className="flex items-center gap-1.5"><Shield size={12} /> Encrypted Stream</span>
      </footer>
    </div>
  );
};

export default LandingPage;
